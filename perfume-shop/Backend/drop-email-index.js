const mongoose = require('mongoose');
require('dotenv').config();

const dropEmailIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('members');

    // Drop the email_1 index
    try {
      await collection.dropIndex('email_1');
      console.log('✅ Dropped email_1 index successfully');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️  Index email_1 does not exist');
      } else {
        throw error;
      }
    }

    // List all indexes
    const indexes = await collection.indexes();
    console.log('\n📋 Current indexes:');
    indexes.forEach(index => {
      console.log(`  - ${JSON.stringify(index.key)}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Done! Email is now optional and non-unique.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

dropEmailIndex();
