import json
from openai import OpenAI
from openai.lib._pydantic import to_strict_json_schema

from app.config import settings
from app.schemas import ComplianceReview
from app.prompts import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE


client = OpenAI(api_key=settings.openai_api_key)


def review_document(document_text: str) -> ComplianceReview:
    if len(document_text) > 60000:
        document_text = document_text[:60000]

    prompt = USER_PROMPT_TEMPLATE.format(document_text=document_text)
    schema = to_strict_json_schema(ComplianceReview)

    response = client.responses.create(
        model=settings.openai_model,
        instructions=SYSTEM_PROMPT,
        input=prompt,
        text={
            "format": {
                "type": "json_schema",
                "name": "compliance_review",
                "schema": schema,
                "strict": True,
            }
        },
    )

    raw_text = response.output_text
    data = json.loads(raw_text)
    return ComplianceReview.model_validate(data)
