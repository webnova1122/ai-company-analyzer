# AI Company Analyzer

An AI-powered business consultant web application that analyzes company data and generates comprehensive business plans using OpenAI's GPT-4.

## Features

- **Company Analysis**: Input your company data and receive AI-powered insights including:
  - SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats)
  - Market Analysis & Competitive Positioning
  - Risk Assessment with mitigation strategies
  - Growth Potential Scoring
  - Actionable Recommendations

- **Business Plan Generation**: Generate comprehensive business plans with:
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

- **PDF Export**: Download your business plan as a professionally formatted PDF document.

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

1. **Enter Company Information**: Fill out the multi-step form with your company details:
   - Company basics (name, industry, stage)
   - Products & market information
   - Financial metrics & team size
   - Goals & challenges

2. **Review Analysis**: Get AI-powered insights about your company including strengths, weaknesses, opportunities, threats, and recommendations.

3. **Generate Business Plan**: Click "Generate Full Business Plan" to create a comprehensive business plan.

4. **Download PDF**: Export your business plan as a professional PDF document.

## License

MIT
