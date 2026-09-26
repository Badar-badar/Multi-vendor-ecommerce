import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, ArrowLeft, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import { setCurrentOrder } from '../../features/orders/orderSlice';

import CheckoutStepsHeader from '../../components/checkout/CheckoutStepsHeader';
import AddressStep from '../../components/checkout/AddressStep';
import ShippingStep from '../../components/checkout/ShippingStep';
import { SHIPPING_METHODS } from '../../data/checkoutConstants';
import ReviewStep from '../../components/checkout/ReviewStep';
import PaymentStep from '../../components/checkout/PaymentStep';
import OrderConfirmationView from '../../components/checkout/OrderConfirmationView';
import CheckoutOrderSummary from '../../components/checkout/CheckoutOrderSummary';
import Button from '../../components/common/Button';

import {
  createCheckoutOrderThunk,
  checkStockAvailabilityThunk,
} from '../../features/checkout/checkoutThunk';
import {
  selectIdempotencyKey,
  selectIsSubmittingOrder,
  selectCheckoutError,
} from '../../features/checkout/checkoutSelectors';
import { refreshIdempotencyKey, clearCheckoutError } from '../../features/checkout/checkoutSlice';

import { fetchAddresses, addAddress } from '../../features/addresses/addressThunk';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const reduxAddresses = useSelector((state) => state.addresses?.addresses || []);

  const {
    items,
    subtotal,
    productSavings,
    coupon,
    couponDiscount,
    couponError,
    applyPromoCode,
    removePromoCode,
    clearPromoError,
    emptyCart,
  } = useCart();

  // Redux Checkout state
  const idempotencyKey = useSelector(selectIdempotencyKey);
  const isSubmittingOrder = useSelector(selectIsSubmittingOrder);
  const checkoutError = useSelector(selectCheckoutError);

  // Multi-step progress (1: Address, 2: Shipping, 3: Review, 4: Payment, 5: Confirmation)
  const [currentStep, setCurrentStep] = useState(1);

  // Address State
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    isDefault: false,
  });

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (reduxAddresses.length > 0 && !selectedAddressId) {
      const defaultAddr = reduxAddresses.find((a) => a.isDefault) || reduxAddresses[0];
      setSelectedAddressId(defaultAddr._id || defaultAddr.id);
    }
  }, [reduxAddresses, selectedAddressId]);

  // Shipping State
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState('standard');
  const selectedShippingMethod =
    SHIPPING_METHODS.find((m) => m.id === selectedShippingMethodId) || SHIPPING_METHODS[0];

  // Dynamic Shipping Fee based on step selection & free shipping threshold ($300)
  const isComplimentaryStandard = subtotal >= 300;
  const shippingFee =
    selectedShippingMethod.id === 'standard'
      ? isComplimentaryStandard
        ? 0
        : selectedShippingMethod.baseFee
      : selectedShippingMethod.baseFee;

  // Gift Presentation State
  const [giftOptions, setGiftOptions] = useState({
    isGift: false,
    giftMessage: '',
  });

  // Multi-seller notes & concierge order notes
  const [sellerDeliveryNotes, setSellerDeliveryNotes] = useState({});
  const [orderNotes, setOrderNotes] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('stripe_card');
  const [cardDetails, setCardDetails] = useState({
    cardholderName: user?.name || 'Sarah Jenkins',
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/28',
    cvc: '424',
    postalCode: '10021',
  });
  const [localPaymentError, setLocalPaymentError] = useState(null);

  // Completed Order State
  const [completedOrder, setCompletedOrder] = useState(null);

  // Calculate taxes and grand total
  const discountedSubtotal = Math.max(0, subtotal - couponDiscount);
  const tax = Math.round(discountedSubtotal * 0.08);
  const total = discountedSubtotal + shippingFee + tax;

  // Active selected address object
  const activeAddress = isAddingNewAddress
    ? addressForm
    : reduxAddresses.find((a) => (a._id || a.id) === selectedAddressId) || reduxAddresses[0] || addressForm;

  // Handle address form updates
  const handleAddressFormChange = (field, value) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr._id || addr.id);
    setIsAddingNewAddress(false);
  };

  const handleSellerDeliveryNoteChange = (sellerId, note) => {
    setSellerDeliveryNotes((prev) => ({ ...prev, [sellerId]: note }));
  };

  // Step transitions
  const handleProceedToShipping = async () => {
    if (isAddingNewAddress) {
      try {
        const result = await dispatch(addAddress(addressForm)).unwrap();
        if (result?._id || result?.id) {
          setSelectedAddressId(result._id || result.id);
        }
      } catch (e) {
        // Continue even if saving to profile fails
      }
      setIsAddingNewAddress(false);
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToReview = async () => {
    // Check stock availability before review
    dispatch(checkStockAvailabilityThunk(items));
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToPayment = () => {
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Payment Execution & Order Creation
  const handleAuthorizePayment = async () => {
    setLocalPaymentError(null);
    dispatch(clearCheckoutError());

    try {
      const paymentMethodNames = {
        stripe_card: 'Stripe 256-Bit Encrypted Card',
        digital_wallet: 'Apple Pay / Google Pay Biometric',
        wire_escrow: 'Concierge SWIFT Wire Escrow',
        cod: 'Cash on White-Glove Handover',
      };

      const generatedOrderNumber = `ZRN-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const generatedTrackingNumber = `TRK-ZRN-${Math.floor(100000 + Math.random() * 900000)}-US`;

      const orderPayload = {
        orderNumber: generatedOrderNumber,
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        paymentStatus: paymentMethod === 'cod' ? 'Awaiting Handover' : 'Paid',
        paymentMethod: paymentMethod,
        paymentMethodName: paymentMethodNames[paymentMethod] || 'Stripe Card',
        deliveryEstimate: selectedShippingMethod.estimate,
        trackingNumber: generatedTrackingNumber,
        shippingAddress: activeAddress,
        shippingMethodName: selectedShippingMethod.name,
        giftOptions,
        sellerDeliveryNotes,
        orderNotes,
        items: items.map((it) => ({
          id: it.id || it._id,
          product: it.product,
          price: it.price,
          quantity: it.quantity,
          selectedVariant: it.selectedVariant,
          seller: it.seller || it.product?.seller,
        })),
        subtotal,
        discount: productSavings + couponDiscount,
        coupon,
        shippingFee,
        tax,
        total,
      };

      // Dispatch order creation thunk with idempotency header
      const resultAction = await dispatch(
        createCheckoutOrderThunk({
          orderData: orderPayload,
          idempotencyKey: idempotencyKey || `idem_${Date.now()}`,
        })
      );

      const placedOrderData = resultAction.payload?.order || resultAction.payload || orderPayload;

      // Update Redux currentOrder
      dispatch(setCurrentOrder(placedOrderData));
      setCompletedOrder(placedOrderData);

      // Empty shopping bag
      emptyCart();

      // Proceed to confirmation
      setCurrentStep(5);
      toast.success('Acquisition authorized & placed successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = err?.message || 'Payment authorization was rejected. Please verify your details.';
      setLocalPaymentError(msg);
      dispatch(refreshIdempotencyKey()); // Refresh key so user can retry safely
      toast.error('Payment authorization failed.');
    }
  };

  // Empty Cart Safety (When not in Step 5 Confirmation)
  if (items.length === 0 && currentStep !== 5) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-accent-light text-accent flex items-center justify-center mx-auto shadow-xs">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs text-text-muted max-w-md mx-auto">
          Please select fine creations to add to your bag before proceeding to checkout.
        </p>
        <Link to="/products">
          <Button variant="primary" size="lg">
            Explore Curated Collections
          </Button>
        </Link>
      </div>
    );
  }

  // Step 5: Full Order Confirmation View
  if (currentStep === 5 && completedOrder) {
    return <OrderConfirmationView order={completedOrder} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
            <Link to="/" className="hover:text-text-main">Home</Link>
            <span>/</span>
            <Link to="/cart" className="hover:text-text-main">Shopping Bag</Link>
            <span>/</span>
            <span className="text-text-main font-semibold">Checkout</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
            Sovereign Checkout
          </h1>
        </div>

        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-main transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Bag</span>
        </Link>
      </div>

      {/* Checkout Progress Stepper */}
      <CheckoutStepsHeader
        currentStep={currentStep}
        onStepClick={(stepId) => setCurrentStep(stepId)}
      />

      {/* Main 2-Column Checkout Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
        {/* Left Column (2 Cols): Active Step Form */}
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <AddressStep
              savedAddresses={reduxAddresses}
              selectedAddressId={selectedAddressId}
              onSelectSavedAddress={handleSelectSavedAddress}
              addressForm={addressForm}
              onAddressFormChange={handleAddressFormChange}
              isAddingNew={isAddingNewAddress}
              setIsAddingNew={setIsAddingNewAddress}
              onProceed={handleProceedToShipping}
            />
          )}

          {currentStep === 2 && (
            <ShippingStep
              selectedMethodId={selectedShippingMethodId}
              onSelectMethod={(methodId) => setSelectedShippingMethodId(methodId)}
              subtotal={subtotal}
              onBack={() => setCurrentStep(1)}
              onProceed={handleProceedToReview}
            />
          )}

          {currentStep === 3 && (
            <ReviewStep
              items={items}
              address={activeAddress}
              shippingMethod={selectedShippingMethod}
              giftOptions={giftOptions}
              onGiftOptionsChange={(field, val) =>
                setGiftOptions((prev) => ({ ...prev, [field]: val }))
              }
              sellerDeliveryNotes={sellerDeliveryNotes}
              onSellerDeliveryNoteChange={handleSellerDeliveryNoteChange}
              orderNotes={orderNotes}
              onOrderNotesChange={setOrderNotes}
              onEditStep={(stepId) => setCurrentStep(stepId)}
              onBack={() => setCurrentStep(2)}
              onProceed={handleProceedToPayment}
            />
          )}

          {currentStep === 4 && (
            <PaymentStep
              total={total}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              cardDetails={cardDetails}
              onCardDetailsChange={(field, val) =>
                setCardDetails((prev) => ({ ...prev, [field]: val }))
              }
              isProcessing={isSubmittingOrder}
              paymentError={localPaymentError || checkoutError}
              onClearPaymentError={() => {
                setLocalPaymentError(null);
                dispatch(clearCheckoutError());
              }}
              onBack={() => setCurrentStep(3)}
              onPay={handleAuthorizePayment}
            />
          )}
        </div>

        {/* Right Column (1 Col): Sticky Order Summary & Coupon */}
        <div className="lg:col-span-1">
          <CheckoutOrderSummary
            items={items}
            subtotal={subtotal}
            productSavings={productSavings}
            coupon={coupon}
            couponDiscount={couponDiscount}
            couponError={couponError}
            shippingFee={shippingFee}
            shippingMethodName={selectedShippingMethod.name}
            tax={tax}
            total={total}
            onApplyCoupon={applyPromoCode}
            onRemoveCoupon={removePromoCode}
            onClearCouponError={clearPromoError}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
