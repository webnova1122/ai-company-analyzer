# AI Company Analyzer — Task Board

## How to Use This File
1. Find a task you want to work on
2. Edit this file on GitHub and replace `[ ]` with `[x]` and add your name + date next to it
3. Create a new branch locally: `git checkout -b feature/<task-name>`
4. Code the feature with AI help in Cursor
5. Push and open a Pull Request to `main`

**Branch naming examples:**
- `feature/user-auth`
- `feature/database-persistence`
- `fix/pdf-export-bug`

---

## What's Already Built
- [x] Multi-step company input form (CompanyForm.jsx)
- [x] AI company analysis via OpenAI GPT-4 (SWOT, risks, recommendations)
- [x] Business plan generation (9-section full plan)
- [x] PDF download of business plan
- [x] Basic Express API (analyze, business-plan, pdf endpoints)
- [x] Basic UI with Tailwind CSS
- [x] Header with "Start Over" navigation

---

## Features To Build

### Database & Persistence
- [ ] **Set up SQLite database** — Replace in-memory Map with a real SQLite DB so plans survive server restarts. Files: `server/config/database.js`, `server/models/BusinessPlan.js`
- [ ] **Save analyses to DB** — Store company analysis results (not just business plans) so they can be retrieved later
- [ ] **List all saved plans** — API endpoint `GET /api/business-plans` returning all stored plans

### User Accounts & Auth
- [ ] **User registration & login** — Add JWT-based auth so each user has their own account. New files: `server/routes/auth.js`, `server/middleware/auth.js`
- [ ] **Protect routes** — Only logged-in users can generate and view plans
- [ ] **Link plans to users** — Each plan belongs to a user account

### Dashboard & History
- [ ] **Plans history page** — New frontend page showing all previously generated plans for the logged-in user
- [ ] **Dashboard component** — Summary stats: total analyses done, plans generated, industries analyzed
- [ ] **Delete a plan** — Button to delete a saved business plan (`DELETE /api/business-plan/:id`)

### UI & UX Improvements
- [ ] **Loading skeletons** — Replace plain "loading..." text with animated skeleton placeholders while AI is working
- [ ] **Toast notifications** — Show success/error pop-up messages instead of silent failures
- [ ] **Dark mode toggle** — Add a light/dark theme switch in the header
- [ ] **Mobile responsive fixes** — Audit and fix layout on small screens (< 640px)
- [ ] **Form validation feedback** — Show inline error messages on required fields before submission
- [ ] **Progress bar** — Show a progress indicator while the AI is generating (can take 10–20 seconds)

### Analysis & Plan Enhancements
- [ ] **Competitor comparison** — Allow inputting 2 companies and comparing their analyses side by side
- [ ] **Industry benchmarks** — Show how the company scores vs industry average in the analysis results
- [ ] **Charts & visualizations** — Add a bar/radar chart for SWOT scores and growth potential using Chart.js or Recharts
- [ ] **Analysis history timeline** — Show how a company's analysis changed over multiple submissions

### Export & Sharing
- [ ] **Share plan via link** — Generate a public read-only URL for a business plan
- [ ] **Export to Word (.docx)** — Download the business plan as a Word document using `docx` npm package
- [ ] **Email business plan** — Send the PDF to an email address directly from the app using Nodemailer

### Backend & Infrastructure
- [ ] **Input sanitization & rate limiting** — Add `express-rate-limit` and sanitize all user inputs to prevent abuse
- [ ] **Error logging** — Integrate a logger (e.g. `winston`) for structured server-side error tracking
- [ ] **Environment config for production** — Set up `.env.production` and update Vite config for deployment
- [ ] **API response caching** — Cache identical analysis requests for 1 hour to save OpenAI API costs

### Testing
- [ ] **Backend unit tests** — Write tests for `analyzer.js` and `pdfGenerator.js` using Jest
- [ ] **Frontend component tests** — Test `CompanyForm.jsx` and `AnalysisResults.jsx` using React Testing Library
- [ ] **API integration tests** — Test all API endpoints end-to-end

### Deployment
- [ ] **Dockerize the app** — Create `Dockerfile` and `docker-compose.yml` for easy deployment
- [ ] **Deploy to Railway/Render** — Deploy the backend to a cloud platform
- [ ] **Deploy frontend to Vercel** — Deploy the React app and connect it to the live backend URL
- [ ] **Set up CI/CD with GitHub Actions** — Auto-run tests and deploy on every push to `main`

---

## Bugs to Fix
- [ ] **Plans lost on server restart** — Currently stored in memory (`Map`), need DB persistence (see Database tasks above)
- [ ] **No error boundary in React** — App crashes with a white screen on unhandled errors; add an `ErrorBoundary` component
- [ ] **PDF styling is minimal** — Improve PDF layout, add company logo placeholder, better fonts and spacing

---

## Priority Order (Suggested)
1. Database & Persistence
2. Loading/UX improvements  
3. User Auth
4. Dashboard & History
5. Enhancements & Export
6. Testing & Deployment
