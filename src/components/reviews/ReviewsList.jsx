import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  ThumbsUp,
  Flag,
  CheckCircle,
  Image as ImageIcon,
  ChevronDown,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { reviewsService } from '@/services/api/reviewsService';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

/**
 * Reviews List Component
 * Displays product reviews with photos and interaction
 */
export function ReviewsList({ productId, onWriteReview }) {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useUIStore();

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedImages, setSelectedImages] = useState(null);

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [productId, filter]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { rating: parseInt(filter) } : {};
      const result = await reviewsService.getProductReviews(productId, params);

      if (result.success) {
        setReviews(result.data.map((r) => reviewsService.formatReview(r)));
      }
    } catch (error) {
      console.error('Load reviews error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    const result = await reviewsService.getReviewStats(productId);
    if (result.success) {
      setStats(result.data);
    }
  };

  const handleHelpful = async (reviewId) => {
    if (!user) {
      showError('Please log in to mark reviews as helpful');
      return;
    }

    const result = await reviewsService.markHelpful(reviewId, user.id);
    if (result.success) {
      showSuccess(result.message);
      loadReviews(); // Reload to update counts
    }
  };

  const handleReport = async (reviewId) => {
    if (!user) {
      showError('Please log in to report reviews');
      return;
    }

    const reason = prompt('Please tell us why you\'re reporting this review:');
    if (!reason) return;

    const result = await reviewsService.reportReview(reviewId, user.id, reason);
    if (result.success) {
      showSuccess(result.message);
    } else {
      showError(result.error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      {stats && stats.total > 0 && (
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Average Rating */}
            <div className="text-center md:border-r md:pr-8">
              <div className="text-5xl font-bold text-gray-900 mb-2">{stats.average}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'h-5 w-5',
                      star <= Math.round(stats.average)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">{stats.total} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.distribution[rating] || 0;
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

                return (
                  <button
                    key={rating}
                    onClick={() => setFilter(rating.toString())}
                    className="flex items-center gap-3 w-full py-1 hover:bg-gray-50 rounded transition-colors"
                  >
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Recommendation Rate */}
            {stats.recommendationRate > 0 && (
              <div className="text-center md:border-l md:pl-8">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats.recommendationRate}%
                </div>
                <p className="text-sm text-gray-600">Would recommend</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter & Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Reviews
          </Button>
          <Button
            size="sm"
            variant={filter === 'photos' ? 'default' : 'outline'}
            onClick={() => setFilter('photos')}
          >
            <ImageIcon className="h-4 w-4 mr-1" />
            With Photos
          </Button>
          {filter !== 'all' && filter !== 'photos' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setFilter('all')}
            >
              Clear Filter
            </Button>
          )}
        </div>

        {onWriteReview && (
          <Button onClick={onWriteReview}>
            Write a Review
          </Button>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600 mb-4">Be the first to review this product!</p>
          {onWriteReview && (
            <Button onClick={onWriteReview}>Write the First Review</Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 border"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-semibold text-lg flex-shrink-0">
                    {review.customerName[0]}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {review.customerName}
                      </span>
                      {review.verified_purchase && (
                        <Badge variant="success" size="sm">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified Purchase
                        </Badge>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              'h-4 w-4',
                              star <= review.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{review.timeAgo}</span>
                    </div>
                  </div>
                </div>

                {/* Report Button */}
                <button
                  onClick={() => handleReport(review.id)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  title="Report review"
                >
                  <Flag className="h-4 w-4" />
                </button>
              </div>

              {/* Review Title */}
              {review.title && (
                <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
              )}

              {/* Review Content */}
              <p className="text-gray-700 mb-4 whitespace-pre-line">{review.comment}</p>

              {/* Photos */}
              {review.images && review.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {review.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImages({ images: review.images, index })}
                      className="aspect-square rounded-lg overflow-hidden hover:opacity-75 transition-opacity"
                    >
                      <img
                        src={image}
                        alt={`Review photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Additional Info */}
              <div className="flex flex-wrap gap-3 mb-4 text-sm">
                {review.would_recommend !== null && (
                  <span className={cn(
                    'px-3 py-1 rounded-full',
                    review.would_recommend
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  )}>
                    {review.would_recommend ? '👍 Recommends' : '👎 Does not recommend'}
                  </span>
                )}
                {review.fit && (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    Fit: {review.fit.replace('-', ' ')}
                  </span>
                )}
                {review.quality && (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
                    Quality: {review.quality}
                  </span>
                )}
              </div>

              {/* Helpful Button */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <button
                  onClick={() => handleHelpful(review.id)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>Helpful ({review.helpful_count || 0})</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Image Lightbox */}
      {selectedImages && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImages(null)}
        >
          <button
            onClick={() => setSelectedImages(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={selectedImages.images[selectedImages.index]}
            alt="Review photo"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default ReviewsList;
