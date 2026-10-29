import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/product.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function run() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is missing from backend/.env');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // 1. Find all unassigned legacy products
    const unassignedFilter = {
      $or: [{ user: { $exists: false } }, { user: null }],
    };

    const unassigned = await Product.find(unassignedFilter).lean();

    if (unassigned.length === 0) {
      console.log('No unassigned legacy products found. All products have assigned owners.');
      await mongoose.disconnect();
      return;
    }

    console.log(`Found ${unassigned.length} unassigned legacy product(s) in the database.`);

    const targetEmail = process.argv[2];
    const isConfirmed = process.argv.includes('--confirm');

    if (!targetEmail || targetEmail.startsWith('--')) {
      console.log('\n--- Legacy Product Migration Utility ---');
      console.log('This utility safely claims unassigned products and assigns them to an account.');
      console.log('\nUsage:');
      console.log('  node backend/scripts/claimLegacyProducts.js <user_email> [--confirm]');
      console.log('\nExample:');
      console.log('  node backend/scripts/claimLegacyProducts.js alice@example.com --confirm');
      await mongoose.disconnect();
      return;
    }

    const normalizedEmail = targetEmail.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.error(`\nError: User with email "${normalizedEmail}" was not found.`);
      console.error('Please create/register this account first before migrating products.');
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`\nTarget User: ${user.name} (${user.email}) [ID: ${user._id}]`);

    if (!isConfirmed) {
      console.log('\n[PREVIEW MODE] No database changes have been made.');
      console.log(`To create a backup and assign ${unassigned.length} product(s) to ${user.email}, run:`);
      console.log(`  node backend/scripts/claimLegacyProducts.js ${targetEmail} --confirm\n`);
      await mongoose.disconnect();
      return;
    }

    // 2. Perform safe backup before migration
    const backupDir = path.resolve(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `legacy-products-backup-${timestamp}.json`);

    fs.writeFileSync(backupPath, JSON.stringify(unassigned, null, 2), 'utf8');
    console.log(`\n✓ Backup saved safely to: ${backupPath} (${unassigned.length} records)`);

    // 3. Execute assignment
    const result = await Product.updateMany(unassignedFilter, {
      $set: { user: user._id },
    });

    console.log(`✓ Migration complete: ${result.modifiedCount} product(s) successfully assigned to ${user.email}!`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Migration failed:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

run();
