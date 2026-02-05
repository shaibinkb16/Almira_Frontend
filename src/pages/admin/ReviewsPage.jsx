import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { Search, Star, Check, X, Eye, Image as ImageIcon } from 'lucide-react';
import { adminService } from '@/services/api/adminService';
import { supabase } from '@/lib/supabase/client';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [moderationNote, setModerationNote] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          product:products(id, name, slug),
          user:profiles(id, full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setModerationNote(review.moderation_note || '');
    setShowModal(true);
  };

  const handleModerate = async (reviewId, status) => {
    try {
      const result = await adminService.moderateReview(reviewId, {
        status,
        moderation_note: moderationNote,
      });
      if (result.success) {
        await fetchReviews();
        setShowModal(false);
        setSelectedReview(null);
        setModerationNote('');
      }
    } catch (error) {
      console.error('Error moderating review:', error);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || review.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved').length;
  const rejectedCount = reviews.filter((r) => r.status === 'rejected').length;

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-600 mt-1">Moderate customer product reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <Star className="text-amber-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Check className="text-green-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <X className="text-red-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <CardTitle>All Reviews ({filteredReviews.length})</CardTitle>
            <div className="flex gap-2 items-center">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No reviews found</div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {renderStars(review.rating)}
                        <Badge
                          variant={
                            review.status === 'approved'
                              ? 'success'
                              : review.status === 'rejected'
                              ? 'destructive'
                              : 'warning'
                          }
                        >
                          {review.status}
                        </Badge>
                        {review.is_verified_purchase && (
                          <Badge variant="primary">Verified Purchase</Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">{review.user?.full_name || 'Anonymous'}</span>
                          <span>•</span>
                          <span>{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>

                        <div className="font-medium text-gray-900">
                          Product: {review.product?.name || 'Unknown Product'}
                        </div>

                        {review.title && (
                          <div className="font-medium text-gray-900">{review.title}</div>
                        )}

                        {review.comment && (
                          <p className="text-gray-700 text-sm">{review.comment}</p>
                        )}

                        {review.images && review.images.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <ImageIcon size={16} />
                            <span>{review.images.length} image(s)</span>
                          </div>
                        )}

                        {review.helpful_count > 0 && (
                          <div className="text-sm text-gray-600">
                            {review.helpful_count} people found this helpful
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewReview(review)}
                        className="p-2"
                      >
                        <Eye size={16} />
                      </Button>
                      {review.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleModerate(review.id, 'approved')}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <Check size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleModerate(review.id, 'rejected')}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <X size={16} />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedReview(null);
          setModerationNote('');
        }}
        title="Review Details"
      >
        {selectedReview && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Product</label>
              <p className="mt-1 text-gray-900">{selectedReview.product?.name || 'Unknown'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Customer</label>
              <p className="mt-1 text-gray-900">
                {selectedReview.user?.full_name || 'Anonymous'}
              </p>
              <p className="text-sm text-gray-600">{selectedReview.user?.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Rating</label>
              <div className="mt-1">{renderStars(selectedReview.rating)}</div>
            </div>

            {selectedReview.title && (
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <p className="mt-1 text-gray-900">{selectedReview.title}</p>
              </div>
            )}

            {selectedReview.comment && (
              <div>
                <label className="text-sm font-medium text-gray-700">Comment</label>
                <p className="mt-1 text-gray-900">{selectedReview.comment}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="mt-1">
                <Badge
                  variant={
                    selectedReview.status === 'approved'
                      ? 'success'
                      : selectedReview.status === 'rejected'
                      ? 'destructive'
                      : 'warning'
                  }
                >
                  {selectedReview.status}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Moderation Note</label>
              <textarea
                value={moderationNote}
                onChange={(e) => setModerationNote(e.target.value)}
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows="3"
                placeholder="Add a note about this review..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
              {selectedReview.status !== 'approved' && (
                <Button
                  onClick={() => handleModerate(selectedReview.id, 'approved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check size={16} className="mr-2" />
                  Approve
                </Button>
              )}
              {selectedReview.status !== 'rejected' && (
                <Button
                  onClick={() => handleModerate(selectedReview.id, 'rejected')}
                  variant="destructive"
                >
                  <X size={16} className="mr-2" />
                  Reject
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReviewsPage;
