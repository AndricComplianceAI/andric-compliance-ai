from typing import List, Literal
from pydantic import BaseModel, Field


RiskLevel = Literal["low", "medium", "high", "critical"]


class Finding(BaseModel):
    title: str
    risk_level: RiskLevel
    issue: str
    why_it_matters: str
    suggested_fix: str
    evidence_quote: str | None = None


class ComplianceReview(BaseModel):
    document_type_guess: str
    executive_summary: str
    overall_risk_level: RiskLevel
    likely_regulatory_areas: List[str]
    missing_or_weak_disclosures: List[Finding]
    flagged_clauses_or_sections: List[Finding]
    suggested_next_actions: List[str]
    questions_for_client: List[str]
    human_review_required: bool = Field(default=True)
