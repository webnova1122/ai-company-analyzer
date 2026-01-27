import PDFDocument from 'pdfkit';

export async function generatePDF(plan) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: `${plan.companyData.companyName} - Business Plan`,
          Author: 'AI Company Analyzer',
          Subject: 'Business Plan',
          CreationDate: new Date()
        }
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const sections = plan.sections;
      const companyName = plan.companyData.companyName;

      // Cover Page
      addCoverPage(doc, companyName, plan.companyData.industry);
      
      // Table of Contents
      doc.addPage();
      addTableOfContents(doc, plan.tableOfContents);

      // Executive Summary
      doc.addPage();
      addSection(doc, 'Executive Summary', sections.executiveSummary);

      // Company Description
      doc.addPage();
      addSection(doc, 'Company Description', sections.companyDescription);

      // Market Analysis
      doc.addPage();
      addMarketAnalysis(doc, sections.marketAnalysis);

      // Organization Structure
      doc.addPage();
      addSection(doc, 'Organization & Management', sections.organizationStructure);

      // Products & Services
      doc.addPage();
      addSection(doc, 'Products & Services', sections.productsServices);

      // Marketing Strategy
      doc.addPage();
      addMarketingStrategy(doc, sections.marketingStrategy);

      // Financial Projections
      doc.addPage();
      addFinancialProjections(doc, sections.financialProjections);

      // Funding Requirements
      doc.addPage();
      addFundingRequirements(doc, sections.fundingRequirements);

      // Action Plan
      doc.addPage();
      addActionPlan(doc, sections.actionPlan);

      // Risk Assessment
      doc.addPage();
      addRiskAssessment(doc, sections.risks);

      // Footer on all pages
      addFooters(doc, companyName);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function addCoverPage(doc, companyName, industry) {
  doc.fontSize(36)
     .font('Helvetica-Bold')
     .text(companyName, { align: 'center' })
     .moveDown(0.5);

  doc.fontSize(24)
     .font('Helvetica')
     .fillColor('#666666')
     .text('Business Plan', { align: 'center' })
     .moveDown(2);

  doc.fontSize(14)
     .fillColor('#888888')
     .text(`Industry: ${industry}`, { align: 'center' })
     .moveDown(0.5);

  doc.text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' })
     .moveDown(4);

  doc.fontSize(12)
     .fillColor('#999999')
     .text('Prepared by AI Company Analyzer', { align: 'center' })
     .text('Your AI-Powered Business Consultant', { align: 'center' });

  doc.fillColor('#000000');
}

function addTableOfContents(doc, toc) {
  doc.fontSize(24)
     .font('Helvetica-Bold')
     .text('Table of Contents', { align: 'center' })
     .moveDown(2);

  doc.font('Helvetica').fontSize(12);

  toc.forEach(item => {
    const dots = '.'.repeat(60 - item.section.length - String(item.page).length);
    doc.text(`${item.section} ${dots} ${item.page}`, { align: 'left' })
       .moveDown(0.5);
  });
}

function addSection(doc, title, content) {
  doc.fontSize(20)
     .font('Helvetica-Bold')
     .fillColor('#2563eb')
     .text(title)
     .moveDown(1);

  doc.fontSize(11)
     .font('Helvetica')
     .fillColor('#333333')
     .text(content || 'Content not available', {
       align: 'justify',
       lineGap: 4
     });

  doc.fillColor('#000000');
}

function addMarketAnalysis(doc, marketAnalysis) {
  doc.fontSize(20)
     .font('Helvetica-Bold')
     .fillColor('#2563eb')
     .text('Market Analysis')
     .moveDown(1);

  doc.fillColor('#000000');

  if (marketAnalysis) {
    addSubsection(doc, 'Industry Overview', marketAnalysis.industryOverview);
    addSubsection(doc, 'Target Market', marketAnalysis.targetMarket);
    addSubsection(doc, 'Market Size & Growth', marketAnalysis.marketSize);
    addSubsection(doc, 'Competitive Analysis', marketAnalysis.competitiveAnalysis);
  } else {
    doc.fontSize(11).font('Helvetica').text('Market analysis data not available');
  }
}

function addSubsection(doc, title, content) {
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .fillColor('#1e40af')
     .text(title)
     .moveDown(0.5);

  doc.fontSize(11)
     .font('Helvetica')
     .fillColor('#333333')
     .text(content || 'Not specified', {
       align: 'justify',
       lineGap: 3
     })
     .moveDown(1);
}

function addMarketingStrategy(doc, strategy) {
  doc.fontSize(20)
     .font('Helvetica-Bold')
     .fillColor('#2563eb')
     .text('Marketing Strategy')
     .moveDown(1);

  doc.fillColor('#000000');

  if (strategy) {
    addSubsection(doc, 'Market Positioning', strategy.positioning);

    if (strategy.channels && strategy.channels.length > 0) {
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor('#1e40af')
         .text('Marketing Channels')
         .moveDown(0.5);

      doc.fontSize(11).font('Helvetica').fillColor('#333333');
      strategy.channels.forEach(channel => {
        doc.text(`• ${channel}`).moveDown(0.3);
      });
      doc.moveDown(0.5);
    }

    if (strategy.tactics && strategy.tactics.length > 0) {
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor('#1e40af')
         .text('Key Tactics')
         .moveDown(0.5);

      doc.fontSize(11).font('Helvetica').fillColor('#333333');
      strategy.tactics.forEach(tactic => {
        doc.text(`• ${tactic}`).moveDown(0.3);
      });
    }
  }
}

function addFinancialProjections(doc, financials) {
  doc.fontSize(20)
     .font('Helvetica-Bold')
     .fillColor('#2563eb')
     .text('Financial Projections')
     .moveDown(1);

  doc.fillColor('#000000');

  if (financials) {
    // Financial table
    const tableTop = doc.y;
    const col1 = 50, col2 = 170, col3 = 290, col4 = 410;

    // Header
    doc.fontSize(11)
       .font('Helvetica-Bold')
       .fillColor('#1e40af');
    doc.text('Year', col1, tableTop);
    doc.text('Revenue', col2, tableTop);
    doc.text('Expenses', col3, tableTop);
    doc.text('Profit', col4, tableTop);

    doc.moveTo(col1, tableTop + 15)
       .lineTo(500, tableTop + 15)
       .stroke();

    doc.font('Helvetica').fillColor('#333333');
    let y = tableTop + 25;

    ['year1', 'year2', 'year3'].forEach((year, index) => {
      const data = financials[year] || {};
      doc.text(`Year ${index + 1}`, col1, y);
      doc.text(data.revenue || 'N/A', col2, y);
      doc.text(data.expenses || 'N/A', col3, y);
      doc.text(data.profit || 'N/A', col4, y);
      y += 20;
    });

    doc.moveDown(4);

    if (financials.assumptions && financials.assumptions.length > 0) {
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor('#1e40af')
         .text('Key Assumptions', col1)
         .moveDown(0.5);

      doc.fontSize(11).font('Helvetica').fillColor('#333333');
      financials.assumptions.forEach(assumption => {
        doc.text(`• ${assumption}`).moveDown(0.3);
      });
    }
  }
}

function addFundingRequirements(doc, funding) {
  doc.fontSize(20)
     .font('Helvetica-Bold')
     .fillColor('#2563eb')
     .text('Funding Requirements')
     .moveDown(1);

  doc.fillColor('#000000');

  if (funding) {
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#1e40af')
       .text(`Total Funding Required: ${funding.amount || 'To be determined'}`)
       .moveDown(1);

    if (funding.use && funding.use.length > 0) {
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#333333')
         .text('Use of Funds:')
         .moveDown(0.5);

      doc.fontSize(11).font('Helvetica');
      funding.use.forEach(use => {
        doc.text(`• ${use}`).moveDown(0.3);
      });
      doc.moveDown(0.5);
    }

    if (funding.timeline) {
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text('Timeline:')
         .moveDown(0.3);

      doc.fontSize(11)
         .font('Helvetica')
         .text(funding.timeline);
    }
  }
}

function addActionPlan(doc, actionPlan) {
  doc.fontSize(20)
     .font('Helvetica-Bold')
     .fillColor('#2563eb')
     .text('Action Plan & Milestones')
     .moveDown(1);

  doc.fillColor('#000000');

  if (actionPlan && actionPlan.length > 0) {
    actionPlan.forEach((item, index) => {
      const priorityColor = item.priority === 'high' ? '#dc2626' : 
                           item.priority === 'medium' ? '#f59e0b' : '#22c55e';

      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#333333')
         .text(`${index + 1}. ${item.milestone}`)
         .moveDown(0.3);

      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#666666')
         .text(`Timeline: ${item.timeline || 'TBD'}`, { continued: true })
         .fillColor(priorityColor)
         .text(` | Priority: ${item.priority || 'medium'}`)
         .moveDown(0.8);
    });
  } else {
    doc.fontSize(11).font('Helvetica').text('Action plan to be developed');
  }
}

function addRiskAssessment(doc, risks) {
  doc.fontSize(20)
     .font('Helvetica-Bold')
     .fillColor('#2563eb')
     .text('Risk Assessment')
     .moveDown(1);

  doc.fillColor('#000000');

  if (risks && risks.length > 0) {
    risks.forEach((risk, index) => {
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#dc2626')
         .text(`Risk ${index + 1}: ${risk.risk}`)
         .moveDown(0.3);

      doc.fontSize(11)
         .font('Helvetica')
         .fillColor('#333333')
         .text(`Mitigation: ${risk.mitigation || 'To be developed'}`)
         .moveDown(1);
    });
  } else {
    doc.fontSize(11).font('Helvetica').text('Risk assessment to be conducted');
  }
}

function addFooters(doc, companyName) {
  const pages = doc.bufferedPageRange();
  
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    
    // Skip cover page
    if (i === 0) continue;
    
    doc.fontSize(9)
       .fillColor('#999999')
       .text(
         `${companyName} Business Plan | Page ${i + 1}`,
         50,
         doc.page.height - 40,
         { align: 'center', width: doc.page.width - 100 }
       );
  }
}
