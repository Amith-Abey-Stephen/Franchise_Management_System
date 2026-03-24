import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/lib/models/User.ts';
import Franchise from '../src/lib/models/Franchise.ts';
import Product from '../src/lib/models/Product.ts';
import Organization from '../src/lib/models/Organization.ts';
import Activity from '../src/lib/models/Activity.ts';
import Commission from '../src/lib/models/Commission.ts';
import Order from '../src/lib/models/Order.ts';

dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/franchise_db';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Seed: Connected to MongoDB');

        // 1. Clear ALL existing data to ensure a fresh start
        await User.deleteMany();
        await Franchise.deleteMany();
        await Product.deleteMany();
        await Organization.deleteMany();
        await Activity.deleteMany();
        await Commission.deleteMany();
        await Order.deleteMany();
        console.log('Seed: Cleared all global data (Users, Franchises, Orgs, Activities, etc.)');

        // 2. Create System Super-Admin (The Universal Boss)
        await User.create({
            name: 'boss',
            email: 'boss@gmail.com',
            password: '123456789',
            role: 'system-superadmin',
            isApproved: true
        });
        
        console.log('\n🚀 SEEDING SUCCESSFUL');
        console.log('--------------------');
        console.log('Super-Admin Account Created:');
        console.log('Email: boss@gmail.com');
        console.log('Password: 123456789');
        console.log('--------------------');
        console.log('System is now ready for organization onboarding.');
        
        process.exit(0);
    } catch (error) {
        console.error('Seed fatal error:', error);
        process.exit(1);
    }
};

seedData();
