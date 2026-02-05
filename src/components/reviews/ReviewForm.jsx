import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { reviewsService } from '@/services/api/reviewsService';
import { supabase } from '@/lib/supabase/client';

/**
 * Comprehensive Review Form Component
 * Allows customers to submit detailed reviews with photos
 */
export function ReviewForm({ product, onSuccess, onCancel }) {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useUIStore();

  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    wouldRecommend: null,
    fit: '', // For jewelry: perfect, too-small, too-large
    quality: '', // excellent, good, average, poor
  });

  const [hoveredRating, setHoveredRating] = useState(0);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle star rating
  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
    setErrors({ ...errors, rating: null });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 5 images
    if (imageFiles.length + files.length > 5) {
      showError('Maximum 5 images allowed');
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        showError(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        showError(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    // Create previews
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

    setImageFiles([...imageFiles, ...validFiles]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  // Remove image
  const handleRemoveImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Revoke old preview URL
    URL.revokeObjectURL(imagePreviews[index]);

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  // Upload images to Supabase Storage
  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];

    const uploadedUrls = [];

    try {
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(7)}_${Date.now()}.${fileExt}`;
        const filePath = `reviews/${fileName}`;

        const { data, error } = await supabase.storage
          .from('review-images')
          .upload(filePath, file);

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('review-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload images');
    }

    return uploadedUrls;
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.rating) {
      newErrors.rating = 'Please select a rating';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Please add a title';
    }
    if (!formData.comment.trim()) {
      newErrors.comment = 'Please write a review';
    }
    if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      showError('Please fill in all required fields');
      return;
    }

    if (!user) {
      showError('Please log in to submit a review');
      return;
    }

    try {
      setLoading(true);

      // Upload images first
      const imageUrls = await uploadImages();

      // Prepare review data
      const reviewData = {
        product_id: product.id,
        user_id: user.id,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        images: imageUrls,
        would_recommend: formData.wouldRecommend,
        fit: formData.fit || null,
        quality: formData.quality || null,
        verified_purchase: true, // Could check if user actually bought the product
        status: 'pending', // Admin needs to approve
      };

      // Submit to database
      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single();

      if (error) throw error;

      showSuccess('Thank you! Your review has been submitted and is pending approval.');

      // Cleanup
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));

      if (onSuccess) onSuccess(data);
    } catch (error) {
      console.error('Submit review error:', error);
      showError(error.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Info */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        {product.images?.[0] && (
          <img
            src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
        )}
        <div>
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500">Share your experience with this product</p>
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Overall Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  'h-8 w-8 transition-colors',
                  (hoveredRating || formData.rating) >= star
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                )}
              />
            </button>
          ))}
          {formData.rating > 0 && (
            <span className="ml-2 text-sm text-gray-600">
              {formData.rating === 5 && 'Excellent!'}
              {formData.rating === 4 && 'Great!'}
              {formData.rating === 3 && 'Good'}
              {formData.rating === 2 && 'Fair'}
              {formData.rating === 1 && 'Poor'}
            </span>
          )}
        </div>
        {errors.rating && (
          <p className="text-sm text-red-600 mt-1">{errors.rating}</p>
        )}
      </div>

      {/* Review Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Review Title <span className="text-red-500">*</span>
        </label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Sum up your experience in one line"
          maxLength={100}
          error={errors.title}
        />
        <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100</p>
      </div>

      {/* Review Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          placeholder="Tell us about your experience with this product. What did you like or dislike? How was the quality?"
          className={cn(
            'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent',
            errors.comment ? 'border-red-300' : 'border-gray-300'
          )}
          rows={6}
          maxLength={1000}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.comment && (
            <p className="text-sm text-red-600">{errors.comment}</p>
          )}
          <p className="text-xs text-gray-500 ml-auto">{formData.comment.length}/1000</p>
        </div>
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Photos (Optional)
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Help other customers by showing how the product looks. Max 5 images, 5MB each.
        </p>

        {/* Preview Grid */}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-5 gap-3 mb-3">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        {imageFiles.length < 5 && (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/png,image/jpeg,image/jpg"
              multiple
              onChange={handleImageChange}
            />
          </label>
        )}
      </div>

      {/* Additional Questions */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900">Help Others Choose</h4>

        {/* Would Recommend */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Would you recommend this product?
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, wouldRecommend: true })}
              className={cn(
                'flex-1 py-2 px-4 rounded-lg border-2 transition-all',
                formData.wouldRecommend === true
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-green-300'
              )}
            >
              <CheckCircle className="h-5 w-5 inline mr-2" />
              Yes
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, wouldRecommend: false })}
              className={cn(
                'flex-1 py-2 px-4 rounded-lg border-2 transition-all',
                formData.wouldRecommend === false
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-red-300'
              )}
            >
              <X className="h-5 w-5 inline mr-2" />
              No
            </button>
          </div>
        </div>

        {/* Fit (for jewelry) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How was the fit/size?
          </label>
          <select
            value={formData.fit}
            onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="">Select fit</option>
            <option value="too-small">Too Small</option>
            <option value="perfect">Perfect Fit</option>
            <option value="too-large">Too Large</option>
          </select>
        </div>

        {/* Quality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How would you rate the quality?
          </label>
          <select
            value={formData.quality}
            onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="">Select quality</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="average">Average</option>
            <option value="poor">Poor</option>
          </select>
        </div>
      </div>

      {/* Guidelines */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Review Guidelines</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Be honest and share your genuine experience</li>
              <li>Focus on the product, not shipping or customer service</li>
              <li>Avoid inappropriate language or personal information</li>
              <li>Photos should clearly show the product</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          loading={loading}
          className="flex-1"
          size="lg"
        >
          Submit Review
        </Button>
      </div>
    </form>
  );
}

export default ReviewForm;
