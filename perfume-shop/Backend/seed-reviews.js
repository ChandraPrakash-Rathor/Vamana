require('dotenv').config();
const mongoose = require('mongoose');
const Review = require('./Admin/models/Review');
const Product = require('./Admin/models/Product');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => { console.error('❌ MongoDB Error:', err); process.exit(1); });

const reviews = [
  {
    name: 'Arjun Sharma',
    role: 'Verified Buyer',
    location: 'Mumbai, Maharashtra',
    image: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    review: 'Vamana Noir Intense is absolutely stunning! The oud and vanilla combination is intoxicating. I wore it to a wedding and received compliments all night. Worth every rupee.',
    product: 'Vamana Noir Intense',
    verified: true
  },
  {
    name: 'Priya Nair',
    role: 'Fragrance Enthusiast',
    location: 'Kochi, Kerala',
    image: 'https://i.pravatar.cc/150?img=5',
    rating: 5,
    review: 'The Rose Elixir EDP is everything I dreamed of. It smells like fresh Bulgarian roses and lasts well over 8 hours on my skin. Light, feminine and absolutely beautiful.',
    product: 'Rose Elixir EDP',
    verified: true
  },
  {
    name: 'Rahul Mehta',
    role: 'Verified Buyer',
    location: 'Ahmedabad, Gujarat',
    image: 'https://i.pravatar.cc/150?img=3',
    rating: 4,
    review: 'Aqua Marine Homme is my daily go-to fragrance now. Fresh, clean and professional. Great for office wear. Lasts about 6 hours which is decent for a fresh scent.',
    product: 'Aqua Marine Homme',
    verified: true
  },
  {
    name: 'Fatima Khan',
    role: 'Attar Collector',
    location: 'Hyderabad, Telangana',
    image: 'https://i.pravatar.cc/150?img=9',
    rating: 5,
    review: 'Jannat Ul Firdaus is a legendary attar and Vamana has done it justice. Pure, alcohol-free and incredibly long-lasting. Just one drop on the wrist lasts all day. Highly recommended!',
    product: 'Jannat Ul Firdaus Attar',
    verified: true
  },
  {
    name: 'Deepak Verma',
    role: 'Verified Buyer',
    location: 'Lucknow, Uttar Pradesh',
    image: 'https://i.pravatar.cc/150?img=7',
    rating: 5,
    review: 'Mitti Attar brought back childhood memories of the first rain. This is the most authentic petrichor scent I have ever experienced. The quality and packaging were excellent.',
    product: 'Mitti Attar',
    verified: true
  },
  {
    name: 'Sneha Patil',
    role: 'Gift Shopper',
    location: 'Pune, Maharashtra',
    image: 'https://i.pravatar.cc/150?img=16',
    rating: 5,
    review: 'Bought the Signature Duo as an anniversary gift for my husband and myself. The packaging was luxurious and both fragrances are gorgeous. We absolutely love it. Will order again!',
    product: 'Signature Duo — Noir + Rose',
    verified: true
  },
  {
    name: 'Mohammed Irfan',
    role: 'Oud Lover',
    location: 'Chennai, Tamil Nadu',
    image: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    review: 'Oud Royale is the best oud fragrance I have tried from an Indian brand. The saffron and rose blend perfectly with the oud base. Rich, deep and very royal. Exceptional quality.',
    product: 'Oud Royale EDP',
    verified: true
  },
  {
    name: 'Ananya Singh',
    role: 'Beauty Blogger',
    location: 'Delhi, NCR',
    image: 'https://i.pravatar.cc/150?img=20',
    rating: 4,
    review: 'The Attar Collection Box is such a thoughtful gift idea! All 5 attars are unique and high quality. Mitti and Shamama are my personal favourites from the set. Great value for money.',
    product: 'Attar Collection Box — 5 Miniatures',
    verified: true
  },
  {
    name: 'Vikram Reddy',
    role: 'Verified Buyer',
    location: 'Bengaluru, Karnataka',
    image: 'https://i.pravatar.cc/150?img=6',
    rating: 5,
    review: 'Shamama Attar is a masterpiece. You can literally smell dozens of different notes evolving over time. This is pure art in a bottle. I feel like royalty wearing it.',
    product: 'Shamama Attar',
    verified: true
  },
  {
    name: 'Kavitha Iyer',
    role: 'Verified Buyer',
    location: 'Coimbatore, Tamil Nadu',
    image: 'https://i.pravatar.cc/150?img=25',
    rating: 4,
    review: 'Gulab Premium Attar smells like fresh roses straight from a garden. The Kannauj origin makes all the difference. Gentle, natural and perfect for daily use. Lovely product!',
    product: 'Gulab Premium Attar',
    verified: true
  },
  {
    name: 'Suresh Nambiar',
    role: 'Verified Buyer',
    location: 'Thrissur, Kerala',
    image: 'https://i.pravatar.cc/150?img=8',
    rating: 5,
    review: 'Kesar Chandan Attar is perfect for morning meditation and yoga. The sandalwood and saffron combination is deeply calming. I love that it is alcohol-free and skin-safe.',
    product: 'Kesar Chandan Attar',
    verified: true
  },
  {
    name: 'Ritu Agarwal',
    role: 'Couple Goals',
    location: 'Jaipur, Rajasthan',
    image: 'https://i.pravatar.cc/150?img=30',
    rating: 5,
    review: 'Gifted the His & Hers set to my partner on Valentine\'s Day and he loved it! Both fragrances complement each other beautifully. The gift box presentation was absolutely stunning.',
    product: 'His & Hers Gift Set',
    verified: true
  }
];

async function seedReviews() {
  try {
    await Review.deleteMany({});
    console.log('🗑️  Cleared existing reviews');

    const inserted = await Review.insertMany(reviews);
    console.log(`✅ ${inserted.length} reviews inserted successfully!\n`);

    // Update product rating and review count
    const productNames = [...new Set(reviews.map(r => r.product))];
    for (const productName of productNames) {
      const productReviews = reviews.filter(r => r.product === productName);
      const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;

      await Product.findOneAndUpdate(
        { name: { $regex: productName.substring(0, 10), $options: 'i' } },
        {
          rating: Math.round(avgRating * 10) / 10,
          reviews: productReviews.length
        }
      );
    }
    console.log('✅ Product ratings updated\n');

    inserted.forEach(r => {
      console.log(`⭐ ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}  ${r.name} — "${r.product}"`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seedReviews();
