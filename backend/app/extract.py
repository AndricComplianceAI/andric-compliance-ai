from io import BytesIO
from pypdf import PdfReader
from docx import Document


def extract_text(filename: str, content: bytes) -> str:
    lower = filename.lower()

    if lower.endswith(".pdf"):
        return extract_pdf(content)

    if lower.endswith(".docx"):
        return extract_docx(content)

    if lower.endswith(".txt"):
        return content.decode("utf-8", errors="ignore")

    raise ValueError("Unsupported file type. Please upload PDF, DOCX, or TXT.")


def extract_pdf(content: bytes) -> str:
    reader = PdfReader(BytesIO(content))
    pages = []
    for index, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        pages.append(f"\n\n--- Page {index} ---\n{text}")
    return "\n".join(pages).strip()


def extract_docx(content: bytes) -> str:
    document = Document(BytesIO(content))
    paragraphs = [p.text for p in document.paragraphs if p.text.strip()]
    return "\n".join(paragraphs).strip()
