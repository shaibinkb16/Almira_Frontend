/**
 * File Upload API Service
 * Handles image and document uploads to Supabase Storage
 */
import { apiClient } from './apiClient';

export const uploadService = {
  // ==========================================
  // IMAGE UPLOADS
  // ==========================================

  /**
   * Upload a single image
   * @param {File} file - Image file to upload
   * @param {string} bucket - Storage bucket (products, reviews, support, avatars)
   * @returns {Promise<Object>} Upload result with public URL
   */
  async uploadImage(file, bucket = 'reviews') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);

      const response = await apiClient.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: { bucket },
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Image upload error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Upload multiple images (max 5)
   * @param {File[]} files - Array of image files
   * @param {string} bucket - Storage bucket
   * @returns {Promise<Object>} Upload results with URLs array
   */
  async uploadMultipleImages(files, bucket = 'reviews') {
    try {
      if (files.length > 5) {
        return {
          success: false,
          error: 'Maximum 5 images allowed per upload',
        };
      }

      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await apiClient.post('/upload/images/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: { bucket },
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Multiple images upload error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Delete an image
   * @param {string} filePath - Full file path in storage
   * @param {string} bucket - Storage bucket
   */
  async deleteImage(filePath, bucket = 'reviews') {
    try {
      const response = await apiClient.delete('/upload/image', {
        params: {
          file_path: filePath,
          bucket,
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Image delete error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  /**
   * Validate image file before upload
   * @param {File} file - File to validate
   * @param {number} maxSizeMB - Maximum size in MB (default: 5)
   * @returns {Object} Validation result
   */
  validateImage(file, maxSizeMB = 5) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File too large. Maximum size: ${maxSizeMB}MB`,
      };
    }

    return { valid: true };
  },

  /**
   * Validate multiple images
   * @param {File[]} files - Files to validate
   * @param {number} maxCount - Maximum number of files
   * @param {number} maxSizeMB - Maximum size per file in MB
   * @returns {Object} Validation result
   */
  validateMultipleImages(files, maxCount = 5, maxSizeMB = 5) {
    if (files.length === 0) {
      return {
        valid: false,
        error: 'No files selected',
      };
    }

    if (files.length > maxCount) {
      return {
        valid: false,
        error: `Maximum ${maxCount} files allowed`,
      };
    }

    // Validate each file
    for (const file of files) {
      const validation = this.validateImage(file, maxSizeMB);
      if (!validation.valid) {
        return validation;
      }
    }

    return { valid: true };
  },

  /**
   * Preview image before upload
   * @param {File} file - Image file
   * @returns {Promise<string>} Data URL for preview
   */
  async previewImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  /**
   * Compress image before upload (optional, requires canvas)
   * @param {File} file - Image file
   * @param {number} maxWidth - Maximum width
   * @param {number} quality - Quality (0-1)
   * @returns {Promise<Blob>} Compressed image blob
   */
  async compressImage(file, maxWidth = 1920, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            file.type,
            quality
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  },
};

export default uploadService;
