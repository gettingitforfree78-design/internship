const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Internship = require('../models/Internship');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    await Internship.deleteMany({});
    console.log('🗑️  Cleared internships');

    // Seed admin user
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Platform Admin',
        email: process.env.ADMIN_EMAIL || 'admin@launchpad.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@Launchpad2024',
        phone: '9999999999',
        role: 'admin',
      });
      console.log('👤 Admin user created');
    } else {
      console.log('👤 Admin user already exists');
    }

    // Seed internships
    const internships = [
      {
        title: 'Digital Marketing',
        slug: 'digital-marketing',
        description: 'Master the art of digital marketing with hands-on experience in SEO, SEM, Social Media Marketing, Email Marketing, Content Marketing, and Analytics. Work on real campaigns for real brands and build a portfolio that stands out.',
        shortDescription: 'Learn SEO, SEM, Social Media & Content Marketing with real campaigns',
        category: 'digital-marketing',
        duration: '6 weeks',
        price: 999,
        originalPrice: 2499,
        icon: '📱',
        skills: ['SEO', 'Google Ads', 'Social Media', 'Content Marketing', 'Analytics', 'Email Marketing'],
        features: [
          'Live project experience',
          'Industry mentor guidance',
          'Certificate of completion',
          'Letter of recommendation',
          'Flexible timing',
          'Lifetime resource access',
        ],
        syllabus: [
          { week: 1, title: 'Marketing Fundamentals', topics: ['Digital Marketing Overview', 'Market Research', 'Target Audience Analysis'] },
          { week: 2, title: 'SEO & SEM', topics: ['On-page SEO', 'Off-page SEO', 'Google Ads Setup'] },
          { week: 3, title: 'Social Media Marketing', topics: ['Instagram Strategy', 'LinkedIn Marketing', 'Facebook Ads'] },
          { week: 4, title: 'Content Marketing', topics: ['Blog Writing', 'Video Content', 'Copywriting'] },
          { week: 5, title: 'Email & Analytics', topics: ['Email Campaigns', 'Google Analytics', 'Reporting'] },
          { week: 6, title: 'Live Project', topics: ['Campaign Planning', 'Execution', 'Performance Review'] },
        ],
        maxStudents: 100,
        enrolledCount: 47,
      },
      {
        title: 'Web Development',
        slug: 'web-development',
        description: 'Build modern, responsive web applications from scratch using the latest technologies. Learn HTML, CSS, JavaScript, React, Node.js, and databases. Deploy real projects and contribute to open source.',
        shortDescription: 'Full-stack development with React, Node.js & modern web technologies',
        category: 'web-development',
        duration: '8 weeks',
        price: 1499,
        originalPrice: 3999,
        icon: '💻',
        skills: ['HTML/CSS', 'JavaScript', 'React.js', 'Node.js', 'MongoDB', 'Git'],
        features: [
          'Build 3+ real projects',
          'GitHub portfolio development',
          'Code reviews by seniors',
          'Certificate of completion',
          'Job referral support',
          'Community access',
        ],
        syllabus: [
          { week: 1, title: 'HTML & CSS Mastery', topics: ['Semantic HTML', 'Flexbox & Grid', 'Responsive Design'] },
          { week: 2, title: 'JavaScript Core', topics: ['ES6+', 'DOM Manipulation', 'Async/Await'] },
          { week: 3, title: 'React Fundamentals', topics: ['Components', 'State & Props', 'Hooks'] },
          { week: 4, title: 'Advanced React', topics: ['Context API', 'Routing', 'API Integration'] },
          { week: 5, title: 'Backend with Node.js', topics: ['Express.js', 'REST APIs', 'Authentication'] },
          { week: 6, title: 'Database & Deployment', topics: ['MongoDB', 'Mongoose', 'Cloud Deployment'] },
          { week: 7, title: 'Full Stack Project', topics: ['Planning', 'Development', 'Testing'] },
          { week: 8, title: 'Polish & Deploy', topics: ['Performance', 'Security', 'CI/CD'] },
        ],
        maxStudents: 80,
        enrolledCount: 63,
      },
      {
        title: 'Business Development',
        slug: 'business-development',
        description: 'Learn the fundamentals of business development, sales strategy, client acquisition, and partnership management. Gain practical experience in market analysis, pitch deck creation, and closing deals.',
        shortDescription: 'Master sales, client acquisition & strategic business growth',
        category: 'business-development',
        duration: '4 weeks',
        price: 1299,
        originalPrice: 2999,
        icon: '📈',
        skills: ['Sales Strategy', 'Market Analysis', 'Client Relations', 'Pitch Decks', 'CRM Tools', 'Negotiation'],
        features: [
          'Real client interaction',
          'Sales pitch training',
          'Industry connections',
          'Certificate of completion',
          'Performance bonus opportunity',
          'Mentorship program',
        ],
        syllabus: [
          { week: 1, title: 'Business Fundamentals', topics: ['Business Models', 'Market Analysis', 'Competitive Research'] },
          { week: 2, title: 'Sales & Outreach', topics: ['Cold Calling', 'Email Outreach', 'LinkedIn Strategy'] },
          { week: 3, title: 'Client Management', topics: ['CRM Tools', 'Client Relations', 'Pitch Presentations'] },
          { week: 4, title: 'Live Project', topics: ['Lead Generation', 'Deal Closing', 'Performance Report'] },
        ],
        maxStudents: 120,
        enrolledCount: 85,
      },
    ];

    await Internship.insertMany(internships);
    console.log(`🎓 ${internships.length} internships seeded`);

    console.log('\n✅ Seeding complete!');
    console.log(`📧 Admin email: ${process.env.ADMIN_EMAIL}`);
    console.log(`🔑 Admin password: (from .env ADMIN_PASSWORD)`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
