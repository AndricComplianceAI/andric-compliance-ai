from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.extract import extract_text
from app.ai_review import review_document


app = FastAPI(title="Andric Compliance AI MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://andric-compliance-ai.vercel.app",
],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/review")
async def review(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text = extract_text(file.filename or "", content)

        if not text.strip():
            raise HTTPException(status_code=400, detail="No readable text found in document.")

        result = review_document(text)
        return result.model_dump()

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Review failed: {str(error)}")
