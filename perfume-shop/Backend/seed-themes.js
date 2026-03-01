require('dotenv').config();
const mongoose = require('mongoose');
const Theme = require('./Admin/models/Theme');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const seedThemes = async () => {
  try {
    await connectDB();

    // Clear existing themes
    await Theme.deleteMany({});
    console.log('🗑️  Cleared existing themes');

    // Theme 1: Sand Theme (Current)
    const sandTheme = await Theme.create({
      name: 'Sand Theme',
      colors: {
        50: '#f9f6ed',
        100: '#f0e9d1',
        200: '#e2d3a6',
        300: '#d1b573',
        400: '#c8a45d',
        500: '#b3873f',
        600: '#9a6b34',
        700: '#7c502c',
        800: '#68432b',
        900: '#5a3929',
        950: '#331e15'
      },
      isActive: true
    });
    console.log('✅ Created Sand Theme (Active)');

    // Theme 2: Dark Theme (New)
    const darkTheme = await Theme.create({
      name: 'Dark Theme',
      colors: {
        50: '#fafafa',
        100: '#f5f4f5',
        200: '#e6e5e6',
        300: '#d7d5d7',
        400: '#a7a4a7',
        500: '#777477',
        600: '#585558',
        700: '#444244',
        800: '#292829',
        900: '#1a191a',
        950: '#121112'
      },
      isActive: false
    });
    console.log('✅ Created Dark Theme');

    // Theme 3: Cyan Theme
    const cyanTheme = await Theme.create({
      name: 'Cyan Theme',
      colors: {
        50: '#fcf5f0',
        100: '#f6decc',
        200: '#f1ceb7',
        300: '#e8ac89',
        400: '#de8259',
        500: '#d76238',
        600: '#c94c2d',
        700: '#a73a27',
        800: '#863026',
        900: '#6c2a22',
        950: '#3a1310'
      },
      isActive: false
    });
    console.log('✅ Created Cyan Theme');

    // Theme 4: Pink Theme
    const pinkTheme = await Theme.create({
      name: 'Pink Theme',
      colors: {
        50: '#fef1f9',
        100: '#fde6f5',
        200: '#fecceb',
        300: '#fea3da',
        400: '#fc6ac0',
        500: '#f63ea5',
        600: '#e72387',
        700: '#c80e67',
        800: '#a50f55',
        900: '#8a114a',
        950: '#550228'
      },
      isActive: false
    });
    console.log('✅ Created Pink Theme');

    // Theme 5: Orange Theme
    const orangeTheme = await Theme.create({
      name: 'Orange Theme',
      colors: {
        50: '#f8f4ee',
        100: '#efe4d2',
        200: '#e0c9a8',
        300: '#cea776',
        400: '#c59460',
        500: '#b07642',
        600: '#975d37',
        700: '#79462f',
        800: '#663b2d',
        900: '#59332a',
        950: '#331915'
      },
      isActive: false
    });
    console.log('✅ Created Orange Theme');

    // Theme 6: Green Theme
    const greenTheme = await Theme.create({
      name: 'Green Theme',
      colors: {
        50: '#f6f7ee',
        100: '#eceed9',
        200: '#d9deb8',
        300: '#bbc485',
        400: '#a6b269',
        500: '#8a964c',
        600: '#6b7739',
        700: '#535c2f',
        800: '#434a2a',
        900: '#3b4027',
        950: '#1e2211'
      },
      isActive: false
    });
    console.log('✅ Created Green Theme');

    // Theme 7: Blue Theme
    const blueTheme = await Theme.create({
      name: 'Blue Theme',
      colors: {
        50: '#f6f7f9',
        100: '#ebedf3',
        200: '#d4d9e3',
        300: '#aeb8cb',
        400: '#8192af',
        500: '#627495',
        600: '#4d5d7c',
        700: '#414d67',
        800: '#374055',
        900: '#313849',
        950: '#212530'
      },
      isActive: false
    });
    console.log('✅ Created Blue Theme');

    console.log('\n🎨 Theme seeding completed successfully!');
    console.log(`Total themes: 7`);
    console.log(`Active theme: ${sandTheme.name}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding themes:', error);
    process.exit(1);
  }
};

seedThemes();
