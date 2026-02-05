import { useState } from 'react';
import { Calendar, Clock, Tag, Search, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Ultimate Guide to Jewelry Care and Maintenance',
    excerpt: 'Learn the best practices for keeping your jewelry sparkling and beautiful for years to come. From daily care to professional cleaning tips.',
    category: 'Care Tips',
    date: '2026-01-15',
    readTime: '5 min read',
    image: 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: 'Priya Sharma',
  },
  {
    id: 2,
    title: '10 Trending Jewelry Styles for 2026',
    excerpt: 'Discover the hottest jewelry trends of the year, from layered necklaces to statement rings. Stay ahead of the fashion curve.',
    category: 'Trends',
    date: '2026-01-10',
    readTime: '7 min read',
    image: 'https://images.pexels.com/photos/1927257/pexels-photo-1927257.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: 'Anjali Desai',
  },
  {
    id: 3,
    title: 'How to Choose the Perfect Engagement Ring',
    excerpt: 'A comprehensive guide to selecting the ideal engagement ring. Learn about the 4 Cs, ring settings, and how to find the right size.',
    category: 'Buying Guide',
    date: '2026-01-05',
    readTime: '10 min read',
    image: 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: 'Rahul Mehta',
  },
  {
    id: 4,
    title: 'Understanding Gold Purity: 14K vs 18K vs 22K',
    excerpt: 'Confused about gold karats? This guide breaks down the differences between gold purities and helps you choose the right one for your needs.',
    category: 'Education',
    date: '2025-12-28',
    readTime: '6 min read',
    image: 'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: 'Kavita Reddy',
  },
  {
    id: 5,
    title: 'Styling Tips: How to Layer Necklaces Like a Pro',
    excerpt: 'Master the art of necklace layering with our expert styling tips. Create stunning looks by combining different lengths and styles.',
    category: 'Style Guide',
    date: '2025-12-20',
    readTime: '4 min read',
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: 'Sneha Patel',
  },
  {
    id: 6,
    title: 'The History and Significance of Traditional Indian Jewelry',
    excerpt: 'Explore the rich heritage of Indian jewelry, from ancient designs to their cultural and symbolic meanings.',
    category: 'Culture',
    date: '2025-12-15',
    readTime: '8 min read',
    image: 'https://images.pexels.com/photos/1408221/pexels-photo-1408221.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: 'Meera Iyer',
  },
  {
    id: 7,
    title: 'Budget-Friendly Jewelry: Looking Expensive on a Budget',
    excerpt: 'Discover how to build a stunning jewelry collection without breaking the bank. Smart shopping tips and affordable alternatives.',
    category: 'Shopping Tips',
    date: '2025-12-10',
    readTime: '5 min read',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: 'Pooja Gupta',
  },
  {
    id: 8,
    title: 'Gemstone Guide: Properties, Meanings, and Care',
    excerpt: 'Learn about popular gemstones, their unique properties, symbolic meanings, and how to care for each type properly.',
    category: 'Education',
    date: '2025-12-05',
    readTime: '9 min read',
    image: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: 'Riya Kapoor',
  },
];

const CATEGORIES = ['All', 'Trends', 'Care Tips', 'Buying Guide', 'Style Guide', 'Education', 'Culture', 'Shopping Tips'];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredPost = BLOG_POSTS[0];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Jewelry Blog
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tips, trends, and insights about jewelry, fashion, and style from our experts.
          </p>
        </div>

        {/* Featured Post */}
        <Card className="mb-12 overflow-hidden hover:shadow-xl transition-shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-video md:aspect-auto">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <Badge variant="default" className="w-fit mb-4">
                <TrendingUp className="h-3 w-3 mr-1" />
                Featured Post
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {featuredPost.title}
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{featuredPost.readTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <span>{featuredPost.category}</span>
                </div>
              </div>
              <Button>Read Full Article</Button>
            </div>
          </div>
        </Card>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {filteredPosts.length === 0 ? (
          <Card className="p-12 text-center">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter to find articles.
            </p>
            <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
              Clear Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <Badge variant="outline" size="sm" className="mb-3">
                    {post.category}
                  </Badge>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-amber-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">By {post.author}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Newsletter Signup */}
        <Card className="mt-12 p-8 bg-gradient-to-br from-amber-50 to-orange-50 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Never Miss an Article
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest jewelry tips, trends, and exclusive
            content delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
            />
            <Button>Subscribe</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
