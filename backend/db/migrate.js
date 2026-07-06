require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

const runMigrations = async () => {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  console.log('Starting migrations...');
  for (const file of files) {
    if (file.endsWith('.sql')) {
      console.log(`Running migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      try {
        await pool.query(sql);
        console.log(`Successfully completed migration: ${file}`);
      } catch (err) {
        console.error(`Error running migration ${file}:`, err);
        process.exit(1);
      }
    }
  }
  console.log('All migrations completed successfully.');
  process.exit(0);
};

runMigrations();
