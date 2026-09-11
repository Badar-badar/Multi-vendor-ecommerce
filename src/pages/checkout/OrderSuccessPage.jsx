import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import OrderConfirmationView from '../../components/checkout/OrderConfirmationView';
import { selectPlacedOrder } from '../../features/checkout/checkoutSelectors';
import { orderApi } from '../../api/orderApi';
import Button from '../../components/common/Button';

export const OrderSuccessPage = () => {
  const { id } = useParams();
  const placedOrder = useSelector(selectPlacedOrder);
  const currentOrder = useSelector((state) => state.orders?.currentOrder);

  const [order, setOrder] = useState(placedOrder || currentOrder || null);
  const [loading, setLoading] = useState(!placedOrder && !currentOrder && Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    // If order already available from checkout state, use it
    if (placedOrder && (placedOrder.id === id || placedOrder._id === id || !id)) {
      setOrder(placedOrder);
      return;
    }
    if (currentOrder && (currentOrder.id === id || currentOrder._id === id)) {
      setOrder(currentOrder);
      return;
    }

    // Otherwise fetch from API
    if (id) {
      let isMounted = true;
      setLoading(true);
      orderApi
        .getOrderById(id)
        .then((res) => {
          if (isMounted) {
            setOrder(res.data?.data || res.data);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setError(err.response?.data?.message || 'Unable to retrieve order details.');
            setLoading(false);
          }
        });

      return () => {
        isMounted = false;
      };
    }
  }, [id, placedOrder, currentOrder]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
        <p className="text-sm font-serif text-text-muted">
          Retrieving Sovereign Acquisition Record...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
          Acquisition Record Not Found
        </h1>
        <p className="text-xs text-text-muted max-w-md mx-auto">
          {error || 'We could not locate this order session. You can review your orders in your account dashboard.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/account/orders">
            <Button variant="primary" size="lg">
              View Order History
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="secondary" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <OrderConfirmationView order={order} />;
};

export default OrderSuccessPage;
