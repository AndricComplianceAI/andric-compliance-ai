# Andric Compliance AI MVP

A starter AI assistant for financial-services compliance.

It lets a user upload a PDF, DOCX, or TXT file and returns:
- executive summary
- risk level
- missing disclosures
- flagged clauses
- suggested fixes
- follow-up questions for the consultant

This is an MVP. Do not treat the output as legal or regulatory advice without human review.

## Stack

- Backend: FastAPI
- AI: OpenAI Responses API
- Frontend: Next.js
- File parsing: pypdf, python-docx

## Run backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# Mac/Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Add your OPENAI_API_KEY inside .env

uvicorn app.main:app --reload --port 8000
```

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## First commercial focus

Start with shareholder disclosure and regulatory transformation support for financial-services firms.

Good first users:
- boutique asset managers
- compliance consultancies
- investment firms
- family offices
- fintechs

## Suggested first paid offer

“AI-assisted shareholder disclosure review with consultant validation.”

Price test:
- 99 to 249 CHF per document review
- 499 to 1500 CHF per month for repeat clients

## Important

Keep a human compliance expert in the loop. The assistant should speed up review, not replace professional judgment.
