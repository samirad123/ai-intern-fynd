'use client';

import { useState } from 'react';

export default function UserDashboard() {
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!rating) {
      setError('Please select a rating.');
      return;
    }

    setLoading(true);
    setError(null);
    setAiResponse(null);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setAiResponse(data.ai_response);
      setReview('');
      setRating(null);
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#f7f7f7',
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        color: '#000',
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: '0 auto',
          backgroundColor: '#ffffff',
          padding: 30,
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ marginBottom: 8 }}>User Feedback</h1>
        <p style={{ marginBottom: 20 }}>
          Please rate your experience and leave a short review.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Rating */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 'bold' }}>Rating:</label>
            <div style={{ marginTop: 8 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    marginRight: 8,
                    fontSize: 18,
                    padding: '6px 10px',
                    cursor: 'pointer',
                    backgroundColor: rating === star ? '#ffd700' : '#eaeaea',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                  }}
                >
                  {star} ★
                </button>
              ))}
            </div>
          </div>

          {/* Review */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 'bold' }}>
              Review (optional):
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                marginTop: 8,
                padding: 8,
                border: '1px solid #ccc',
                borderRadius: 4,
                color: '#000',
              }}
              placeholder="Write your feedback here..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 16px',
              backgroundColor: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <p style={{ color: 'red', marginTop: 20 }}>
            ❌ {error}
          </p>
        )}

        {/* AI Response */}
        {aiResponse && (
          <div
            style={{
              marginTop: 30,
              padding: 16,
              backgroundColor: '#f0f0f0',
              borderRadius: 6,
            }}
          >
            <h3>AI Response</h3>
            <p>{aiResponse}</p>
          </div>
        )}
      </div>
    </main>
  );
}
