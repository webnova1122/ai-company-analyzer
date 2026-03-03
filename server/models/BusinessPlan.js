import db, { saveDatabase } from '../config/database.js';

class BusinessPlan {
  static create(data) {
    const {
      planId,
      userId,
      companyData,
      executiveSummary,
      companyDescription,
      marketAnalysis,
      organizationStructure,
      productsServices,
      marketingStrategy,
      financialProjections,
      fundingRequirements,
      actionPlan,
      riskAssessment
    } = data;

    const stmt = db.prepare(`
      INSERT INTO business_plans (
        planId, userId, companyData, executiveSummary, companyDescription,
        marketAnalysis, organizationStructure, productsServices,
        marketingStrategy, financialProjections, fundingRequirements,
        actionPlan, riskAssessment
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.bind([
      planId,
      userId || null,
      JSON.stringify(companyData),
      executiveSummary || null,
      companyDescription || null,
      marketAnalysis || null,
      organizationStructure || null,
      productsServices || null,
      marketingStrategy || null,
      financialProjections || null,
      fundingRequirements || null,
      actionPlan || null,
      riskAssessment || null
    ]);

    stmt.step();
    stmt.free();
    saveDatabase();

    return this.findById(planId);
  }

  static findById(planId) {
    const stmt = db.prepare('SELECT * FROM business_plans WHERE planId = ?');
    stmt.bind([planId]);
    
    if (!stmt.step()) {
      stmt.free();
      return null;
    }

    const row = stmt.getAsObject();
    stmt.free();

    return this._rowToObject(row);
  }

  static findAll() {
    const stmt = db.prepare('SELECT * FROM business_plans ORDER BY createdAt DESC');
    const results = [];
    
    while (stmt.step()) {
      results.push(this._rowToObject(stmt.getAsObject()));
    }
    
    stmt.free();
    return results;
  }

  static findByUserId(userId) {
    const stmt = db.prepare('SELECT * FROM business_plans WHERE userId = ? ORDER BY createdAt DESC');
    stmt.bind([userId]);
    const results = [];

    while (stmt.step()) {
      results.push(this._rowToObject(stmt.getAsObject()));
    }

    stmt.free();
    return results;
  }

  static _rowToObject(row) {
    return {
      id: row.id,
      planId: row.planId,
      userId: row.userId || null,
      companyData: JSON.parse(row.companyData),
      executiveSummary: row.executiveSummary,
      companyDescription: row.companyDescription,
      marketAnalysis: row.marketAnalysis,
      organizationStructure: row.organizationStructure,
      productsServices: row.productsServices,
      marketingStrategy: row.marketingStrategy,
      financialProjections: row.financialProjections,
      fundingRequirements: row.fundingRequirements,
      actionPlan: row.actionPlan,
      riskAssessment: row.riskAssessment,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  static delete(planId) {
    const stmt = db.prepare('DELETE FROM business_plans WHERE planId = ?');
    stmt.bind([planId]);
    stmt.step();
    stmt.free();
    saveDatabase();
    return { changes: 1 };
  }
}

export default BusinessPlan;
