"use client";

import { useState } from "react";

type Finding = {
  title: string;
  risk_level: string;
  issue: string;
  why_it_matters: string;
  suggested_fix: string;
  evidence_quote?: string | null;
};

type Review = {
  document_type_guess: string;
  executive_summary: string;
  overall_risk_level: string;
  likely_regulatory_areas: string[];
  missing_or_weak_disclosures: Finding[];
  flagged_clauses_or_sections: Finding[];
  suggested_next_actions: string[];
  questions_for_client: string[];
  human_review_required: boolean;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submitReview() {
    if (!file) return;

    const uses = Number(localStorage.getItem("free_reviews_used") || 0);

    if (uses >= 1) {
      setError("Free limit reached. Upgrade to Pro for more compliance reviews.");
      return;
    }

    setLoading(true);
    setError("");
    setReview(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://andric-compliance-ai-production.up.railway.app/review", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Review failed");
      }

      localStorage.setItem("free_reviews_used", String(uses + 1));
      setReview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <div className="header">
        <h1>Andric Compliance AI</h1>
        <p>
          Get 1 free compliance review. Upgrade to Pro for unlimited document reviews.
        </p>
      </div>

      <div className="card grid">
        <div className="upload">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
          <p>{file ? file.name : "PDF, DOCX, or TXT supported"}</p>
        </div>

        <button className="primary" onClick={submitReview} disabled={!file || loading}>
          {loading ? "Reviewing..." : "Run compliance review"}
        </button>

        <button
          className="primary"
          onClick={() => window.location.href = "https://paypal.me/YOURNAME"}
        >
          Upgrade to Pro, 39.99 CHF/month
        </button>

        {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      </div>

      {review && (
        <div className="card grid" style={{ marginTop: 24 }}>
          <div>
            <span className="badge">{review.overall_risk_level} risk</span>
            <h2>{review.document_type_guess}</h2>
            <p>{review.executive_summary}</p>
          </div>

          <FindingList title="Missing or weak disclosures" items={review.missing_or_weak_disclosures} />
          <FindingList title="Flagged clauses or sections" items={review.flagged_clauses_or_sections} />
        </div>
      )}
    </main>
  );
}

function FindingList({ title, items }: { title: string; items: Finding[] }) {
  return (
    <div>
      <h2 className="section-title">{title}</h2>
      <div className="grid">
        {items.map((item, index) => (
          <div className="finding" key={`${item.title}-${index}`}>
            <span className="badge">{item.risk_level}</span>
            <h3>{item.title}</h3>
            <p><strong>Issue:</strong> {item.issue}</p>
            <p><strong>Why it matters:</strong> {item.why_it_matters}</p>
            <p><strong>Suggested fix:</strong> {item.suggested_fix}</p>
            {item.evidence_quote && (
              <p><strong>Evidence:</strong> “{item.evidence_quote}”</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
