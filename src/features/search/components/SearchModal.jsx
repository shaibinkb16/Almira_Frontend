import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { useUIStore } from '@/stores/uiStore';
import { useDebounce } from '@/hooks/useDebounce';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/config/routes';

const trendingSearches = [
  { query: 'Gold Necklace', icon: '✨' },
  { query: 'Diamond Ring', icon: '💍' },
  { query: 'Silver Earrings', icon: '💎' },
  { query: 'Wedding Collection', icon: '👰' },
  { query: 'Ethnic Wear', icon: '🎀' },
  { query: 'Designer Sarees', icon: '👗' },
];

function SearchModal() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { isSearchOpen, closeSearch } = useUIStore();

  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useLocalStorage(
    'almira-recent-searches',
    []
  );
  const debouncedQuery = useDebounce(query, 300);

  // Focus input when modal opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  // Reset query when modal closes
  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeSearch();
      }
    };

    if (isSearchOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isSearchOpen, closeSearch]);

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;

    // Add to recent searches
    const updatedSearches = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5);
    setRecentSearches(updatedSearches);

    // Navigate to search page
    navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery.trim())}`);
    closeSearch();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  return (
    <Modal
      isOpen={isSearchOpen}
      onClose={closeSearch}
      size="2xl"
      showClose={false}
      className="!rounded-3xl overflow-hidden shadow-2xl"
      contentClassName="!p-0"
    >
      <div className="bg-white">
        {/* Search Input Header */}
        <div className="relative border-b border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-4 px-6 py-5">
              <Search className="h-6 w-6 text-amber-600 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for jewelry, fashion, sarees..."
                className="flex-1 text-lg bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-gray-400"
              />
              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    type="button"
                    onClick={() => setQuery('')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </motion.button>
                )}
              </AnimatePresence>
              <button
                type="button"
                onClick={closeSearch}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span>ESC</span>
              </button>
            </div>
          </form>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {!query ? (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        Recent Searches
                      </h3>
                      <button
                        onClick={handleClearRecent}
                        className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSearch(search)}
                          className="group px-4 py-2.5 text-sm font-medium bg-gray-50 text-gray-700 rounded-xl hover:bg-amber-50 hover:text-amber-600 transition-all duration-200 hover:scale-105"
                        >
                          {search}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
                    <TrendingUp className="h-4 w-4 text-amber-600" />
                    Trending Searches
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {trendingSearches.map((item, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSearch(item.query)}
                        className="group relative overflow-hidden px-4 py-3.5 text-left border-2 border-gray-100 rounded-xl hover:border-amber-200 hover:bg-amber-50/50 transition-all duration-200 hover:scale-105"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-amber-600 transition-colors">
                            {item.query}
                          </span>
                        </div>
                        <div className="absolute top-0 right-0 w-8 h-8 bg-amber-100 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    Quick Links
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        navigate('/new-arrivals');
                        closeSearch();
                      }}
                      className="px-4 py-3 text-sm font-medium text-left bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-700 rounded-xl hover:shadow-md transition-all duration-200 hover:scale-105"
                    >
                      🆕 New Arrivals
                    </button>
                    <button
                      onClick={() => {
                        navigate('/sale');
                        closeSearch();
                      }}
                      className="px-4 py-3 text-sm font-medium text-left bg-gradient-to-br from-red-50 to-pink-50 text-red-700 rounded-xl hover:shadow-md transition-all duration-200 hover:scale-105"
                    >
                      🔥 Sale Items
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="searching"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Press <kbd className="px-2 py-1 bg-amber-100 text-amber-700 rounded font-medium">Enter</kbd> to search for
                  </p>
                  <p className="text-xl font-semibold text-gray-900">&quot;{debouncedQuery}&quot;</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-amber-50/30 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="font-medium">Press Enter to search</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-600 font-mono">
                ↑
              </kbd>
              <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-600 font-mono">
                ↓
              </kbd>
              <span>to navigate</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default SearchModal;
