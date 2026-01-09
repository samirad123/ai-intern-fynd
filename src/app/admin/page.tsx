'use client';

import { useEffect, useState } from 'react';

type Feedback = {
  id: string;
  rating: number;
  review: string | null;
  ai_summary: string;
  ai_recommended_action: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [data, setData] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchFeedback() {
    try {
      const res = await fetch('/api/admin/feedback');
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to load data');
      }

      setData(json.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeedback();
    const interval = setInterval(fetchFeedback, 10000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#f7f7f7',
        padding: 40,
        fontFamily: 'Arial, sans-serif',
        color: '#000',
      }}
    >
      <h1 style={{ marginBottom: 20 }}>Admin Dashboard</h1>
      <p style={{ marginBottom: 20 }}>
        Showing {data.length} feedback submissions
      </p>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      {!loading && !error && (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: '#fff',
            }}
          >
            <thead>
              <tr>
                <th style={th}>Rating</th>
                <th style={th}>Review</th>
                <th style={th}>AI Summary</th>
                <th style={th}>Recommended Action</th>
                <th style={th}>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td style={td}>{item.rating} ★</td>
                  <td style={td}>
                    {item.review || <em>No review</em>}
                  </td>
                  <td style={td}>{item.ai_summary}</td>
                  <td style={td}>{item.ai_recommended_action}</td>
                  <td style={td}>
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

const th: React.CSSProperties = {
  border: '1px solid #ddd',
  padding: 10,
  backgroundColor: '#f0f0f0',
  textAlign: 'left',
};

const td: React.CSSProperties = {
  border: '1px solid #ddd',
  padding: 10,
  verticalAlign: 'top',
};
