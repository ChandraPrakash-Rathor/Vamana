require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./Admin/models/Product');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => { console.error('❌ MongoDB Error:', err); process.exit(1); });

const products = [
  // ─── PERFUMES ───────────────────────────────────────────────────
  {
    name: 'Vamana Noir Intense',
    description: 'A bold and sophisticated fragrance with deep notes of oud, black pepper, and smoked vanilla. Perfect for evening wear and special occasions.',
    subLine: 'Dark & Mysterious',
    volume: '100ml',
    category: 'perfume',
    actualPrice: 2499,
    discount: 10,
    stock: 50,
    mainImage: 'placeholder.jpg',
    subImages: [],
    featured: true,
    bestseller: true,
    status: 'active'
  },
  {
    name: 'Rose Elixir EDP',
    description: 'A romantic blend of Bulgarian rose, jasmine, and warm musk. Delicate yet long-lasting, this fragrance blooms on the skin throughout the day.',
    subLine: 'Floral Romance',
    volume: '75ml',
    category: 'perfume',
    actualPrice: 1899,
    discount: 15,
    stock: 35,
    mainImage: 'placeholder.jpg',
    subImages: [],
    featured: true,
    bestseller: false,
    status: 'active'
  },
  {
    name: 'Aqua Marine Homme',
    description: 'A fresh aquatic fragrance for men featuring sea breeze, cedarwood, and bergamot. Light and invigorating for everyday wear.',
    subLine: 'Fresh & Bold',
    volume: '100ml',
    category: 'perfume',
    actualPrice: 1699,
    discount: 0,
    stock: 40,
    mainImage: 'placeholder.jpg',
    subImages: [],
    featured: false,
    bestseller: true,
    status: 'active'
  },
  {
    name: 'Oud Royale EDP',
    description: 'A luxurious oriental fragrance combining premium Arabian oud with saffron, rose, and amber. Rich, opulent and long-lasting.',
    subLine: 'Royal Oriental',
    volume: '50ml',
    category: 'perfume',
    actualPrice: 3499,
    discount: 5,
    stock: 20,
    mainImage: 'placeholder.jpg',
    subImages: [],
    featured: true,
    bestseller: true,
    status: 'active'
  },
  {
    name: 'Citrus Bloom',
    description: 'A bright and uplifting fragrance with notes of lemon zest, neroli, and green tea. Light and refreshing for daytime wear.',
    subLine: 'Fresh & Citrusy',
    volume: '75ml',
    category: 'perfume',
    actualPrice: 1299,
    discount: 20,
    stock: 60,
    mainImage: 'placeholder.jpg',
    subImages: [],
    featured: false,
    bestseller: false,
    status: 'active'
  },

  // ─── ATTARS ─────────────────────────────────────────────────────
  {
    name: 'Jannat Ul Firdaus Attar',
    description: 'A classic Indian attar inspired by the fragrance of paradise. Rich blend of rose, jasmine and warm musky base. Alcohol-free and long-lasting on skin.',
    subLine: 'Pure & Natural',
    volume: '12ml',
    category: 'attar',
    actualPrice: 599,
    discount: 10,
    stock: 80,
    mainImage: 'placeholder.jpg',
    subImages: [],
    featured: true,
    bestseller: true,
    status: 'active'
  },
  {
    name: 'Mitti Attar',
    description: 'Captures the essence of first rain on dry earth (petrichor). This rare alcohol-free attar is steam distilled from baked clay — an iconic Indian fragrance.',
    subLine: 'Earthy & Rare',
    volume: '10ml',
    category: 'attar',
    actualPrice: 799,
    discount: 0,
    stock: 30,
    mainImage: 'placeholder.jpg',
    subImages: [],
    featured: true,
    bestseller: false,
    status: 'active'
  },
  {
    name: 'Shamama Attar',
    description: 'A royal Mughal-era attar with over 40 natural ingredients including saffron, sandalwood, and exotic flowers. Deep, warm and incredibly rich.',
    subLine: 'Mughal Heritage',
    volume: '6ml',
    category: 'attar',
    actualPrice: 1199,
    discount: 5,
    stock: 25,
    mainImage: 'placeholder.jpg',
    subImages: [],
    featured: false,
    bestseller: true,
    status: 'active'
  },
  {
    name: 'Kesar Chandan Attar',
    description: 'A smooth blend of pure sandalwood and saffron. Calming, meditative and skin-nourishing. Ideal for daily use and meditation.',
    subLine: 'Calm & Spiritual',
    volume: '12ml',
    category: 'attar',
    actualPrice: 899,
    discount: 10,
    stock: 45,
    mainImage: 'placeholder.jpg',
    subImages: [],
    featured: false,
    bestseller: false,
    status: 'active'
  },
  {
    name: 'Gulab Premium Attar',
    description: 'Steam distilled from fresh Kannauj roses, this pure rose attar is a timeless classic. No alcohol, no chemicals — just pure floral bliss.',
    subLine: 'Pure Rose Kannauj',
    volume: '10ml',
    category: 'attar',
    actualPrice: 999,
    discount: 15,
    stock: 55,
    mainImage: 'placeholder.jpg',
    subImages: [],
    featured: true,
    bestseller: true,
    status: 'active'
  },

  // ─── COMBOS ──────────────────────────────────────────────────────
  {
    name: 'Signature Duo — Noir + Rose',
    description: 'The perfect gift set pairing our bestselling Vamana Noir Intense EDP with the romantic Rose Elixir EDP. Presented in a premium gift box.',
    subLine: 'Perfect Gift Set',
    volume: '100ml + 75ml',
    category: 'combo',
    actualPrice: 3999,
    discount: 20,
    stock: 15,
    mainImage: 'placeholder.jpg',
    subImages: [],
    featured: true,
    bestseller: false,
    status: 'active'
  },
  {
    name: 'Attar Collection Box — 5 Miniatures',
    description: 'Explore the world of natural attars with this curated set of 5 miniature attars: Gulab, Mitti, Chandan, Shamama, and Jannat Ul Firdaus. Great for gifting.',
    subLine: 'Explore & Discover',
    volume: '5 x 4ml',
    category: 'combo',
    actualPrice: 1499,
    discount: 10,
    stock: 20,
    mainImage: 'placeholder.jpg',
    subImages: [],
    featured: true,
    bestseller: true,
    status: 'active'
  },
  {
    name: 'His & Hers Gift Set',
    description: 'A romantic duo featuring Aqua Marine Homme for him and Rose Elixir EDP for her. Beautifully packaged in a premium black box with ribbon.',
    subLine: 'Romantic Gift',
    volume: '100ml + 75ml',
    category: 'combo',
    actualPrice: 3299,
    discount: 15,
    stock: 12,
    mainImage: 'placeholder.jpg',
    subImages: [],
    featured: false,
    bestseller: true,
    status: 'active'
  }
];

async function seedProducts() {
  try {
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    const inserted = await Product.insertMany(products);
    console.log(`✅ ${inserted.length} products inserted successfully!\n`);

    const categories = { perfume: 0, attar: 0, combo: 0 };
    inserted.forEach(p => {
      categories[p.category]++;
      console.log(`📦 ${p.category.toUpperCase()} — ${p.name} | ₹${p.finalPrice} (${p.discount}% off)`);
    });

    console.log('\n📊 Summary:');
    console.log(`   Perfumes : ${categories.perfume}`);
    console.log(`   Attars   : ${categories.attar}`);
    console.log(`   Combos   : ${categories.combo}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seedProducts();
