export const perfumes = [
  {
    id: 1,
    name: 'Eternal Rose',
    brand: 'Vamana',
    price: 2899,
    originalPrice: 3499,
    discount: 17,
    rating: 4.8,
    reviews: 156,
    image: '/product1.jpg',
    images: ['/product1.jpg', '/product2.jpg', '/product3.jpg'],
    description: 'A timeless floral masterpiece that captures the essence of blooming roses at dawn. Perfect for romantic evenings and special occasions.',
    category: 'perfume',
    fragranceType: 'Floral',
    gender: 'Women',
    stock: 45,
    sizes: [
      { ml: 50, price: 2899 },
      { ml: 100, price: 4999 }
    ],
    notes: {
      top: ['Rose', 'Bergamot', 'Pink Pepper'],
      middle: ['Jasmine', 'Peony', 'Lily'],
      base: ['Musk', 'Amber', 'Sandalwood']
    },
    isNew: false,
    isBestSeller: true
  },
  {
    id: 2,
    name: 'Ocean Breeze',
    brand: 'Vamana',
    price: 2499,
    originalPrice: 2999,
    discount: 17,
    rating: 4.6,
    reviews: 98,
    image: '/product2.jpg',
    images: ['/product2.jpg', '/product3.jpg', '/product4.jpg'],
    description: 'Fresh marine notes combined with citrus and aquatic accords. Ideal for daily wear and summer days.',
    category: 'perfume',
    fragranceType: 'Fresh',
    gender: 'Unisex',
    stock: 62,
    sizes: [
      { ml: 50, price: 2499 },
      { ml: 100, price: 4299 }
    ],
    notes: {
      top: ['Sea Salt', 'Lemon', 'Mint'],
      middle: ['Marine Accord', 'Lavender', 'Rosemary'],
      base: ['Driftwood', 'Musk', 'Amber']
    },
    isNew: true,
    isBestSeller: false
  },
  {
    id: 3,
    name: 'Midnight Oud',
    brand: 'Vamana',
    price: 3299,
    originalPrice: 3999,
    discount: 18,
    rating: 4.9,
    reviews: 203,
    image: '/product3.jpg',
    images: ['/product3.jpg', '/product4.jpg', '/product5.jpg'],
    description: 'Rich and luxurious oud fragrance with spicy undertones. A sophisticated choice for evening wear.',
    category: 'perfume',
    fragranceType: 'Woody',
    gender: 'Men',
    stock: 28,
    sizes: [
      { ml: 50, price: 3299 },
      { ml: 100, price: 5699 }
    ],
    notes: {
      top: ['Saffron', 'Cardamom', 'Black Pepper'],
      middle: ['Oud', 'Rose', 'Patchouli'],
      base: ['Leather', 'Amber', 'Vetiver']
    },
    isNew: false,
    isBestSeller: true
  },
  {
    id: 4,
    name: 'Golden Amber',
    brand: 'Vamana',
    price: 2799,
    originalPrice: 3299,
    discount: 15,
    rating: 4.7,
    reviews: 134,
    image: '/product4.jpg',
    images: ['/product4.jpg', '/product5.jpg', '/product1.jpg'],
    description: 'Warm oriental fragrance with amber and vanilla. Perfect for cold weather and intimate gatherings.',
    category: 'perfume',
    fragranceType: 'Oriental',
    gender: 'Women',
    stock: 51,
    sizes: [
      { ml: 50, price: 2799 },
      { ml: 100, price: 4799 }
    ],
    notes: {
      top: ['Orange Blossom', 'Cinnamon', 'Bergamot'],
      middle: ['Amber', 'Vanilla', 'Tonka Bean'],
      base: ['Sandalwood', 'Musk', 'Benzoin']
    },
    isNew: false,
    isBestSeller: true
  },
  {
    id: 5,
    name: 'Royal Saffron',
    brand: 'Vamana',
    price: 3499,
    originalPrice: 4299,
    discount: 19,
    rating: 4.9,
    reviews: 187,
    image: '/product5.jpg',
    images: ['/product5.jpg', '/product1.jpg', '/product2.jpg'],
    description: 'Premium attar with pure saffron essence. A traditional fragrance with royal heritage.',
    category: 'attar',
    fragranceType: 'Oriental',
    gender: 'Unisex',
    stock: 18,
    sizes: [
      { ml: 12, price: 3499 },
      { ml: 25, price: 6499 }
    ],
    notes: {
      top: ['Saffron', 'Rose', 'Cardamom'],
      middle: ['Agarwood', 'Sandalwood', 'Amber'],
      base: ['Musk', 'Patchouli', 'Cedarwood']
    },
    isNew: true,
    isBestSeller: true
  },
  {
    id: 6,
    name: 'Mystic Musk',
    brand: 'Vamana',
    price: 2999,
    originalPrice: 3599,
    discount: 17,
    rating: 4.8,
    reviews: 142,
    image: '/product1.jpg',
    images: ['/product1.jpg', '/product3.jpg', '/product5.jpg'],
    description: 'Deep and earthy musk attar with intense longevity. A classic choice for connoisseurs.',
    category: 'attar',
    fragranceType: 'Woody',
    gender: 'Men',
    stock: 33,
    sizes: [
      { ml: 12, price: 2999 },
      { ml: 25, price: 5499 }
    ],
    notes: {
      top: ['White Musk', 'Bergamot'],
      middle: ['Black Musk', 'Amber', 'Patchouli'],
      base: ['Cedarwood', 'Vetiver', 'Sandalwood']
    },
    isNew: false,
    isBestSeller: false
  },
  {
    id: 7,
    name: 'Citrus Bloom',
    brand: 'Vamana',
    price: 2299,
    originalPrice: 2799,
    discount: 18,
    rating: 4.5,
    reviews: 89,
    image: '/product2.jpg',
    images: ['/product2.jpg', '/product4.jpg', '/product1.jpg'],
    description: 'Vibrant citrus fragrance with floral undertones. Energizing and uplifting for everyday wear.',
    category: 'perfume',
    fragranceType: 'Fresh',
    gender: 'Unisex',
    stock: 74,
    sizes: [
      { ml: 50, price: 2299 },
      { ml: 100, price: 3999 }
    ],
    notes: {
      top: ['Lemon', 'Orange', 'Grapefruit'],
      middle: ['Neroli', 'Jasmine', 'Green Tea'],
      base: ['White Musk', 'Cedarwood', 'Amber']
    },
    isNew: true,
    isBestSeller: false
  },
  {
    id: 8,
    name: 'Velvet Rose',
    brand: 'Vamana',
    price: 3199,
    originalPrice: 3999,
    discount: 20,
    rating: 4.9,
    reviews: 221,
    image: '/product3.jpg',
    images: ['/product3.jpg', '/product1.jpg', '/product4.jpg'],
    description: 'Luxurious rose fragrance with velvety smooth texture. Elegant and sophisticated.',
    category: 'perfume',
    fragranceType: 'Floral',
    gender: 'Women',
    stock: 39,
    sizes: [
      { ml: 50, price: 3199 },
      { ml: 100, price: 5499 }
    ],
    notes: {
      top: ['Bulgarian Rose', 'Peach', 'Bergamot'],
      middle: ['Turkish Rose', 'Violet', 'Iris'],
      base: ['Vanilla', 'Musk', 'Patchouli']
    },
    isNew: false,
    isBestSeller: true
  },
  {
    id: 9,
    name: 'Sandalwood Pure',
    brand: 'Vamana',
    price: 3799,
    originalPrice: 4599,
    discount: 17,
    rating: 4.8,
    reviews: 165,
    image: '/product4.jpg',
    images: ['/product4.jpg', '/product2.jpg', '/product5.jpg'],
    description: 'Pure sandalwood attar with calming properties. Sacred and meditative fragrance.',
    category: 'attar',
    fragranceType: 'Woody',
    gender: 'Unisex',
    stock: 22,
    sizes: [
      { ml: 12, price: 3799 },
      { ml: 25, price: 6999 }
    ],
    notes: {
      top: ['Sandalwood', 'Cardamom'],
      middle: ['Mysore Sandalwood', 'Rose', 'Jasmine'],
      base: ['Cedarwood', 'Musk', 'Amber']
    },
    isNew: false,
    isBestSeller: true
  },
  {
    id: 10,
    name: 'Lavender Dreams',
    brand: 'Vamana',
    price: 2599,
    originalPrice: 3099,
    discount: 16,
    rating: 4.6,
    reviews: 112,
    image: '/product5.jpg',
    images: ['/product5.jpg', '/product3.jpg', '/product2.jpg'],
    description: 'Soothing lavender fragrance with herbal notes. Perfect for relaxation and sleep.',
    category: 'perfume',
    fragranceType: 'Fresh',
    gender: 'Unisex',
    stock: 58,
    sizes: [
      { ml: 50, price: 2599 },
      { ml: 100, price: 4499 }
    ],
    notes: {
      top: ['Lavender', 'Mint', 'Eucalyptus'],
      middle: ['Chamomile', 'Rosemary', 'Sage'],
      base: ['Vanilla', 'Tonka Bean', 'Musk']
    },
    isNew: true,
    isBestSeller: false
  },
  {
    id: 11,
    name: 'Spice Route',
    brand: 'Vamana',
    price: 2899,
    originalPrice: 3499,
    discount: 17,
    rating: 4.7,
    reviews: 145,
    image: '/product1.jpg',
    images: ['/product1.jpg', '/product4.jpg', '/product3.jpg'],
    description: 'Exotic spicy fragrance inspired by ancient trade routes. Bold and adventurous.',
    category: 'perfume',
    fragranceType: 'Oriental',
    gender: 'Men',
    stock: 41,
    sizes: [
      { ml: 50, price: 2899 },
      { ml: 100, price: 4999 }
    ],
    notes: {
      top: ['Black Pepper', 'Cardamom', 'Ginger'],
      middle: ['Cinnamon', 'Nutmeg', 'Clove'],
      base: ['Tobacco', 'Leather', 'Amber']
    },
    isNew: false,
    isBestSeller: false
  },
  {
    id: 12,
    name: 'White Jasmine',
    brand: 'Vamana',
    price: 2699,
    originalPrice: 3199,
    discount: 16,
    rating: 4.8,
    reviews: 178,
    image: '/product2.jpg',
    images: ['/product2.jpg', '/product5.jpg', '/product1.jpg'],
    description: 'Pure white jasmine with green notes. Delicate and feminine fragrance.',
    category: 'perfume',
    fragranceType: 'Floral',
    gender: 'Women',
    stock: 67,
    sizes: [
      { ml: 50, price: 2699 },
      { ml: 100, price: 4699 }
    ],
    notes: {
      top: ['Green Leaves', 'Bergamot', 'Lemon'],
      middle: ['Jasmine Sambac', 'Tuberose', 'Orange Blossom'],
      base: ['White Musk', 'Sandalwood', 'Amber']
    },
    isNew: true,
    isBestSeller: true
  }
];
