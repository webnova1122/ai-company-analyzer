# AI Company Analyzer

An AI-powered business consultant web application that analyzes company data and generates comprehensive business plans and strategic plans using OpenAI's GPT-4.

## Features

### 📊 **Comprehensive Analysis** (Premium Feature)
- **Enhanced Multi-Step Form**: Collects detailed company information including:
  - Contact information & email (receive 20% discount code!)
  - Company basics (name, industry, stage, location)
  - Products & market details
  - Operations & strategy
  - Financials & team structure
  - Marketing & sales channels
  - Goals, challenges & success metrics

- **AI-Powered Analysis**: Receive detailed insights including:
  - SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats)
  - Market Analysis & Competitive Positioning
  - Risk Assessment with mitigation strategies
  - Growth Potential Scoring (1-10)
  - Actionable Recommendations

### 📋 **Business Plan Generation** (Premium/Enterprise)
Generate comprehensive business plans with:
- Executive Summary
- Company Description
- Market Analysis
- Organization Structure
- Products & Services
- Marketing Strategy
- Financial Projections
- Funding Requirements
- Action Plan & Milestones
- Risk Assessment

### 🎯 **Strategic Plan Generation** (Premium/Enterprise)
Get a detailed strategic roadmap with:
- Vision & Mission statements
- Strategic Objectives & Key Results
- Growth Strategy
- Competitive Strategy
- Operational Strategy
- Financial Strategy
- Milestones & Timeline
- Risks & Mitigation

### 💳 **Payment & Pricing**
- **Basic Plan** ($49): Complete analysis with SWOT, market analysis, and recommendations
- **Premium Plan** ($149, save $50!): Everything + full business plan & strategic plan
- **Enterprise Plan** ($299, save $100!): Everything + 3-year strategic plan, consultation call

### 📧 **Email Integration**
- Automatic 20% discount code sent to email
- Receipt and transaction confirmations
- Analysis delivery via email

### 📄 **PDF Export**
Download your business plans and strategic plans as professionally formatted PDF documents.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **AI**: OpenAI GPT-4
- **PDF Generation**: PDFKit

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd ai-company-analyzer
   ```

2. Install all dependencies:
   ```bash
   npm run install-all
   ```

3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

4. Add your OpenAI API key to the `.env` file:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   ```

### Running the Application

Start both the frontend and backend with a single command:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Start the backend
npm run server

# Terminal 2 - Start the frontend
npm run client
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze company data and return insights |
| POST | `/api/business-plan` | Generate a full business plan |
| GET | `/api/business-plan/:id` | Retrieve a stored business plan |
| GET | `/api/business-plan/:id/pdf` | Download business plan as PDF |

## Project Structure

```
ai-company-analyzer/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── Header.jsx
│   │   │   ├── CompanyForm.jsx
│   │   │   ├── AnalysisResults.jsx
│   │   │   └── BusinessPlanViewer.jsx
│   │   ├── services/       # API client
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── server/                 # Express backend
│   ├── routes/
│   │   └── analysis.js     # API routes
│   ├── services/
│   │   ├── openai.js       # OpenAI integration
│   │   ├── analyzer.js     # Business logic
│   │   └── pdfGenerator.js # PDF creation
│   ├── index.js
│   └── package.json
├── .env                    # Environment variables
├── .env.example            # Example env file
├── .gitignore
├── package.json            # Root package.json
└── README.md
```

## Usage

1. **Enter Contact Information**: Start by entering your email (receive a 20% discount code!) and full name.

2. **Complete Detailed Form**: Fill out the comprehensive multi-step form:
   - Company basics (name, industry, stage, location)
   - Products & market information
   - Operations & business model
   - Financial metrics & team structure
   - Marketing & sales strategy
   - Goals, challenges & success metrics

3. **Choose Your Plan**: Select from Basic, Premium, or Enterprise packages based on your needs.

4. **Secure Payment**: Complete payment securely (simulated - ready for Stripe integration).

5. **Receive Analysis**: Get instant AI-powered analysis with SWOT, market insights, and recommendations.

6. **Generate Plans**: (Premium/Enterprise) Create comprehensive business and strategic plans.

7. **Download PDFs**: Export all documents as professional PDFs.

8. **Email Delivery**: Receive all materials via email with your discount code for future purchases.

## License

MIT
