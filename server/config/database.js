import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create database file in the server directory
const dbPath = path.join(__dirname, '../data', 'business-plans.db');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQL.js
let db;
let SQL;

async function initDatabase() {
  SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`
  });

  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
    console.log('✅ SQLite database loaded from file');
  } else {
    db = new SQL.Database();
    console.log('✅ SQLite database created');
  }

  // Create business_plans table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS business_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      planId TEXT UNIQUE NOT NULL,
      companyData TEXT NOT NULL,
      executiveSummary TEXT,
      companyDescription TEXT,
      marketAnalysis TEXT,
      organizationStructure TEXT,
      productsServices TEXT,
      marketingStrategy TEXT,
      financialProjections TEXT,
      fundingRequirements TEXT,
      actionPlan TEXT,
      riskAssessment TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create index on planId for faster lookups
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_planId ON business_plans(planId)
  `);

  // Save database to file
  saveDatabase();

  console.log(`📁 Database location: ${dbPath}`);
}

function saveDatabase() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

// Auto-save database every 5 seconds
setInterval(() => {
  if (db) {
    saveDatabase();
  }
}, 5000);

// Save database on process exit
process.on('SIGINT', () => {
  if (db) {
    saveDatabase();
    db.close();
  }
  process.exit();
});

process.on('SIGTERM', () => {
  if (db) {
    saveDatabase();
    db.close();
  }
  process.exit();
});

// Initialize database
await initDatabase();

// Export database instance and save function
export default db;
export { saveDatabase };
