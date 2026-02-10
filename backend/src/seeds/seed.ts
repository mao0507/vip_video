import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'vip_platform',
  synchronize: true,
  entities: ['src/entities/*.entity.ts'],
});

async function seed() {
  console.log('Starting seed...');

  try {
    await AppDataSource.initialize();
    console.log('Database connected.');

    const userRepository = AppDataSource.getRepository('User');

    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { username: 'admin' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists. Skipping...');
    } else {
      // Create admin user
      const adminPassword = await bcrypt.hash('admin123', 10);
      await userRepository.save({
        username: 'admin',
        password: adminPassword,
        email: 'admin@example.com',
        vipLevel: 6,
        isAdmin: true,
        isActive: true,
      });
      console.log('Admin user created: admin / admin123');
    }

    // Create VIP test users
    const testUsers = [
      { username: 'vip1user', vipLevel: 1 },
      { username: 'vip2user', vipLevel: 2 },
      { username: 'vip3user', vipLevel: 3 },
      { username: 'vip4user', vipLevel: 4 },
      { username: 'vip5user', vipLevel: 5 },
      { username: 'vip6user', vipLevel: 6 },
    ];

    const testPassword = await bcrypt.hash('test123', 10);

    for (const testUser of testUsers) {
      const existing = await userRepository.findOne({
        where: { username: testUser.username },
      });

      if (existing) {
        console.log(`User ${testUser.username} already exists. Skipping...`);
        continue;
      }

      await userRepository.save({
        username: testUser.username,
        password: testPassword,
        email: `${testUser.username}@example.com`,
        vipLevel: testUser.vipLevel,
        isAdmin: false,
        isActive: true,
      });
      console.log(
        `Test user created: ${testUser.username} / test123 (VIP ${testUser.vipLevel})`,
      );
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
