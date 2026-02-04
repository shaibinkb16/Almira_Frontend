// Sample Data with Working Image URLs (Pexels CDN)

// Product Images
const IMAGES = {
  necklace1: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600',
  necklace2: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600',
  necklace3: 'https://images.pexels.com/photos/10151193/pexels-photo-10151193.jpeg?auto=compress&cs=tinysrgb&w=600',
  earrings1: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=600',
  earrings2: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=600',
  earrings3: 'https://images.pexels.com/photos/8128069/pexels-photo-8128069.jpeg?auto=compress&cs=tinysrgb&w=600',
  ring1: 'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=600',
  ring2: 'https://images.pexels.com/photos/1616096/pexels-photo-1616096.jpeg?auto=compress&cs=tinysrgb&w=600',
  bangles1: 'https://images.pexels.com/photos/10983783/pexels-photo-10983783.jpeg?auto=compress&cs=tinysrgb&w=600',
  bangles2: 'https://images.pexels.com/photos/8285483/pexels-photo-8285483.jpeg?auto=compress&cs=tinysrgb&w=600',
  saree1: 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=600',
  saree2: 'https://images.pexels.com/photos/3264235/pexels-photo-3264235.jpeg?auto=compress&cs=tinysrgb&w=600',
  dress1: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=600',
  dress2: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600',
  anklet: 'https://images.pexels.com/photos/12194854/pexels-photo-12194854.jpeg?auto=compress&cs=tinysrgb&w=600',
  pendant: 'https://images.pexels.com/photos/1030946/pexels-photo-1030946.jpeg?auto=compress&cs=tinysrgb&w=600',
};

// Avatar Images
const AVATARS = {
  woman1: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
  woman2: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
  woman3: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100',
  woman4: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
  man1: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
  man2: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
};

// Sample Products
export const sampleProducts = [
  {
    id: 1,
    name: 'Kundan Necklace Set with Earrings',
    slug: 'kundan-necklace-set',
    basePrice: 15999,
    salePrice: 12999,
    images: [
      { url: IMAGES.necklace1 },
      { url: IMAGES.necklace2 },
    ],
    status: 'active',
    isNewArrival: true,
    category: 'necklaces',
    rating: 4.8,
    reviewCount: 124,
    stockQuantity: 15,
  },
  {
    id: 2,
    name: 'Gold Plated Temple Jhumkas',
    slug: 'gold-plated-temple-jhumkas',
    basePrice: 4999,
    salePrice: null,
    images: [
      { url: IMAGES.earrings1 },
    ],
    status: 'active',
    isFeatured: true,
    category: 'earrings',
    rating: 4.6,
    reviewCount: 89,
    stockQuantity: 20,
  },
  {
    id: 3,
    name: 'Designer Silk Saree - Banarasi',
    slug: 'designer-silk-saree-banarasi',
    basePrice: 24999,
    salePrice: 19999,
    images: [
      { url: IMAGES.saree1 },
    ],
    status: 'active',
    category: 'ethnic-wear',
    rating: 4.9,
    reviewCount: 256,
    stockQuantity: 8,
  },
  {
    id: 4,
    name: 'Pearl Drop Earrings - Sterling Silver',
    slug: 'pearl-drop-earrings',
    basePrice: 3499,
    salePrice: null,
    images: [
      { url: IMAGES.earrings2 },
    ],
    status: 'active',
    isNewArrival: true,
    category: 'earrings',
    rating: 4.5,
    reviewCount: 67,
    stockQuantity: 25,
  },
  {
    id: 5,
    name: 'Antique Gold Bangles Set',
    slug: 'antique-gold-bangles',
    basePrice: 8999,
    salePrice: 7499,
    images: [
      { url: IMAGES.bangles1 },
    ],
    status: 'active',
    category: 'bangles',
    rating: 4.7,
    reviewCount: 145,
    stockQuantity: 12,
  },
  {
    id: 6,
    name: 'Diamond Studded Ring',
    slug: 'diamond-studded-ring',
    basePrice: 45999,
    salePrice: null,
    images: [
      { url: IMAGES.ring1 },
    ],
    status: 'active',
    isFeatured: true,
    category: 'rings',
    rating: 4.9,
    reviewCount: 312,
    stockQuantity: 5,
  },
  {
    id: 7,
    name: 'Embroidered Lehenga Choli',
    slug: 'embroidered-lehenga-choli',
    basePrice: 35999,
    salePrice: 29999,
    images: [
      { url: IMAGES.saree2 },
    ],
    status: 'active',
    isNewArrival: true,
    category: 'ethnic-wear',
    rating: 4.8,
    reviewCount: 178,
    stockQuantity: 6,
  },
  {
    id: 8,
    name: 'Oxidized Silver Anklets',
    slug: 'oxidized-silver-anklets',
    basePrice: 1999,
    salePrice: null,
    images: [
      { url: IMAGES.anklet },
    ],
    status: 'out_of_stock',
    category: 'anklets',
    rating: 4.4,
    reviewCount: 56,
    stockQuantity: 0,
  },
];

// Sample Product Detail
export const sampleProductDetail = {
  id: 1,
  name: 'Kundan Necklace Set with Matching Earrings',
  slug: 'kundan-necklace-set',
  description: `This exquisite Kundan necklace set showcases traditional Indian craftsmanship at its finest. Each piece is meticulously handcrafted by skilled artisans using premium quality stones and gold plating.

The set includes a stunning necklace and matching jhumka earrings, perfect for weddings, festivals, or special occasions. The intricate design features beautiful Kundan stones set in a gold-plated base with delicate meenakari work on the reverse side.`,
  basePrice: 15999,
  salePrice: 12999,
  images: [
    { url: IMAGES.necklace1, alt: 'Front view' },
    { url: IMAGES.necklace2, alt: 'Detail view' },
    { url: IMAGES.necklace3, alt: 'Side view' },
    { url: IMAGES.pendant, alt: 'Close up' },
  ],
  status: 'active',
  isNewArrival: true,
  isFeatured: true,
  stockQuantity: 15,
  category: 'Necklaces',
  material: 'Gold Plated Brass',
  purity: '1 gram gold plating',
  weight: '85 grams',
  dimensions: 'Necklace: 18 inches, Earrings: 2.5 inches',
  rating: 4.8,
  reviewCount: 124,
  colors: [
    { name: 'Gold', value: '#D4AF37' },
    { name: 'Rose Gold', value: '#B76E79' },
    { name: 'Antique Gold', value: '#996515' },
  ],
  features: [
    'Handcrafted by skilled artisans',
    'Premium Kundan stones',
    'Meenakari work on reverse',
    'Comes in designer box',
    'Certificate of authenticity',
  ],
};

// Sample Reviews
export const sampleReviews = [
  {
    id: 1,
    user: 'Priya Sharma',
    avatar: AVATARS.woman1,
    rating: 5,
    date: '2 weeks ago',
    title: 'Absolutely stunning!',
    content: 'This necklace set exceeded my expectations. The craftsmanship is impeccable and it looks even better in person. Wore it to my sister\'s wedding and received so many compliments!',
    helpful: 24,
    images: [IMAGES.necklace1],
  },
  {
    id: 2,
    user: 'Anjali Patel',
    avatar: AVATARS.woman2,
    rating: 5,
    date: '1 month ago',
    title: 'Perfect for special occasions',
    content: 'Beautiful piece of jewelry. The Kundan work is intricate and the gold plating is of excellent quality. Fast delivery and great packaging.',
    helpful: 18,
  },
  {
    id: 3,
    user: 'Meera Reddy',
    avatar: AVATARS.woman3,
    rating: 4,
    date: '1 month ago',
    title: 'Good quality',
    content: 'Nice necklace set, slightly heavier than expected but the quality is good. The earrings are comfortable to wear.',
    helpful: 12,
  },
];

// Sample Orders
export const sampleOrders = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 15999,
    items: [
      { name: 'Kundan Necklace Set', quantity: 1, price: 12999, image: IMAGES.necklace1 },
      { name: 'Pearl Earrings', quantity: 1, price: 3000, image: IMAGES.earrings2 },
    ],
    customer: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      avatar: AVATARS.woman1,
    },
    shipping: {
      address: '123 Main Street, Mumbai, Maharashtra 400001',
      method: 'Express Delivery',
    },
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-20',
    status: 'shipped',
    total: 8499,
    items: [
      { name: 'Antique Gold Bangles Set', quantity: 1, price: 7499, image: IMAGES.bangles1 },
      { name: 'Oxidized Silver Anklets', quantity: 1, price: 1000, image: IMAGES.anklet },
    ],
    customer: {
      name: 'Anjali Patel',
      email: 'anjali@example.com',
      avatar: AVATARS.woman2,
    },
    shipping: {
      address: '456 Park Avenue, Delhi 110001',
      method: 'Standard Delivery',
    },
  },
  {
    id: 'ORD-2024-003',
    date: '2024-01-25',
    status: 'processing',
    total: 45999,
    items: [
      { name: 'Diamond Studded Ring', quantity: 1, price: 45999, image: IMAGES.ring1 },
    ],
    customer: {
      name: 'Meera Reddy',
      email: 'meera@example.com',
      avatar: AVATARS.woman3,
    },
    shipping: {
      address: '789 Lake View, Bangalore 560001',
      method: 'Express Delivery',
    },
  },
];

// Sample Testimonials
export const sampleTestimonials = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    text: 'Absolutely loved my Kundan necklace! The quality is exceptional and delivery was super fast. Will definitely shop again.',
    rating: 5,
    image: AVATARS.woman1,
  },
  {
    name: 'Anjali Patel',
    location: 'Delhi',
    text: 'The bridal collection is stunning. Found the perfect set for my wedding. Customer service was very helpful too!',
    rating: 5,
    image: AVATARS.woman2,
  },
  {
    name: 'Meera Reddy',
    location: 'Bangalore',
    text: 'Great selection of ethnic wear and jewelry. The prices are reasonable and the quality exceeds expectations.',
    rating: 5,
    image: AVATARS.woman3,
  },
];

// Sample Categories
export const sampleCategories = [
  {
    id: 1,
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Elegant designs for every occasion',
    image: IMAGES.necklace1,
    href: '/categories/necklaces',
  },
  {
    id: 2,
    name: 'Earrings',
    slug: 'earrings',
    description: 'Statement pieces to complete your look',
    image: IMAGES.earrings1,
    href: '/categories/earrings',
  },
  {
    id: 3,
    name: 'Rings',
    slug: 'rings',
    description: 'From everyday wear to engagement',
    image: IMAGES.ring1,
    href: '/categories/rings',
  },
  {
    id: 4,
    name: 'Ethnic Wear',
    slug: 'ethnic-wear',
    description: 'Traditional elegance redefined',
    image: IMAGES.saree1,
    href: '/categories/ethnic-wear',
  },
  {
    id: 5,
    name: 'Western Wear',
    slug: 'western-wear',
    description: 'Contemporary fashion essentials',
    image: IMAGES.dress1,
    href: '/categories/western-wear',
  },
];

// Export images for direct use
export { IMAGES, AVATARS };
