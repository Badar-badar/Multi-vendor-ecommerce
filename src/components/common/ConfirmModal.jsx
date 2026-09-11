import React from 'react';
import { AlertTriangle, AlertCircle, Info, Trash2, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Spinner from './Loader';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone. Please confirm to proceed.',
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'primary'
  isLoading = false,
  icon: CustomIcon,
  confirmButtonProps = {},
}) => {
  const effectiveMessage = description || message;

  const variantStyles = {
    danger: {
      iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
      icon: Trash2,
      buttonVariant: 'danger',
    },
    warning: {
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
      icon: AlertTriangle,
      buttonVariant: 'primary',
    },
    primary: {
      iconBg: 'bg-primary/10 text-primary border-primary/20',
      icon: Info,
      buttonVariant: 'primary',
    },
  };

  const currentStyle = variantStyles[variant] || variantStyles.danger;
  const IconComponent = CustomIcon || currentStyle.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? undefined : onClose}
      size="sm"
      closeOnBackdrop={!isLoading}
      closeOnEscape={!isLoading}
      showCloseButton={!isLoading}
    >
      <div className="flex flex-col items-center text-center p-2">
        {/* Warning / Alert Icon Badge */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-4 shadow-subtle ${currentStyle.iconBg}`}
        >
          <IconComponent className="w-7 h-7 stroke-[1.75]" />
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg sm:text-xl font-bold text-text-main mb-2">
          {title}
        </h3>

        {/* Descriptive Consequence */}
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-sm mb-6">
          {effectiveMessage}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            size="md"
            className="flex-1 justify-center"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant={variant === 'danger' ? 'danger' : 'primary'}
            size="md"
            className="flex-1 justify-center"
            onClick={onConfirm}
            isLoading={isLoading}
            {...confirmButtonProps}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
