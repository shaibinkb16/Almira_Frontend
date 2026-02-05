import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn, X, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Product Image Gallery with Zoom and Lightbox
 * Supports multiple images with thumbnails and 2x-4x zoom
 */
export function ImageGallery({ images = [], productName = '' }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  // Handle array of image objects or strings
  const imageList = images.map(img =>
    typeof img === 'string' ? img : (img?.url || img)
  ).filter(Boolean);

  // Fallback to placeholder if no images
  const displayImages = imageList.length > 0
    ? imageList
    : ['https://via.placeholder.com/800x800?text=No+Image'];

  const currentImage = displayImages[selectedImageIndex];

  const handlePrevious = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
        <motion.div
          className="relative w-full h-full cursor-zoom-in"
          onClick={() => setIsZoomed(!isZoomed)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <motion.img
            key={currentImage}
            src={currentImage}
            alt={`${productName} - Image ${selectedImageIndex + 1}`}
            className={cn(
              'w-full h-full object-cover transition-transform duration-300',
              isZoomed && 'scale-200'
            )}
            style={
              isZoomed
                ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    transform: 'scale(2.5)',
                  }
                : {}
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Zoom Indicator */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
            <ZoomIn className="h-4 w-4" />
            <span className="text-sm">Click to zoom</span>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <Maximize2 className="h-5 w-5" />
          </button>

          {/* Navigation Arrows (for multiple images) */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1.5 rounded-lg text-sm">
              {selectedImageIndex + 1} / {displayImages.length}
            </div>
          )}
        </motion.div>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                'relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
                selectedImageIndex === index
                  ? 'border-amber-500 ring-2 ring-amber-200'
                  : 'border-gray-200 hover:border-amber-300'
              )}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
              aria-label="Close lightbox"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Image Counter */}
            {displayImages.length > 1 && (
              <div className="absolute top-4 left-4 text-white text-lg">
                {selectedImageIndex + 1} / {displayImages.length}
              </div>
            )}

            {/* Main Image */}
            <motion.img
              key={currentImage}
              src={currentImage}
              alt={`${productName} - Image ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />

            {/* Navigation */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Thumbnail Strip */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleThumbnailClick(index);
                    }}
                    className={cn(
                      'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                      selectedImageIndex === index
                        ? 'border-white ring-2 ring-white/50'
                        : 'border-white/30 hover:border-white/60'
                    )}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Compact image gallery for product cards
 */
export function CompactImageGallery({ images = [], productName = '', className }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageList = images.map(img =>
    typeof img === 'string' ? img : (img?.url || img)
  ).filter(Boolean);

  const displayImages = imageList.length > 0
    ? imageList
    : ['https://via.placeholder.com/400x400?text=No+Image'];

  if (displayImages.length === 1) {
    return (
      <div className={cn('relative aspect-square bg-gray-100 rounded-lg overflow-hidden', className)}>
        <img
          src={displayImages[0]}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={cn('relative aspect-square bg-gray-100 rounded-lg overflow-hidden group', className)}>
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={displayImages[currentIndex]}
          alt={`${productName} - ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentIndex((prev) => prev === 0 ? displayImages.length - 1 : prev - 1);
          }}
          className="bg-white/90 hover:bg-white text-gray-900 p-1 rounded-full shadow-lg"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentIndex((prev) => prev === displayImages.length - 1 ? 0 : prev + 1);
          }}
          className="bg-white/90 hover:bg-white text-gray-900 p-1 rounded-full shadow-lg"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {displayImages.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            className={cn(
              'w-1.5 h-1.5 rounded-full transition-all',
              currentIndex === index
                ? 'bg-white w-4'
                : 'bg-white/50 hover:bg-white/75'
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;
