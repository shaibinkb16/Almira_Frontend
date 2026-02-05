import { Modal } from '@/components/ui/Modal';
import { ReviewForm } from './ReviewForm';

/**
 * Review Modal Component
 * Wraps the review form in a modal for easy integration
 */
export function ReviewModal({ isOpen, onClose, product, onSuccess }) {
  const handleSuccess = (review) => {
    if (onSuccess) onSuccess(review);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Write a Review"
      size="lg"
    >
      <ReviewForm
        product={product}
        onSuccess={handleSuccess}
        onCancel={onClose}
      />
    </Modal>
  );
}

export default ReviewModal;
