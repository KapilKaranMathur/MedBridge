"use client";
import { useEffect, useState } from "react";

export default function RecordThread({ params }) {
  const { id } = params;
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [posting, setPosting] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/medical-records/${id}`);
    if (res.ok) {
      const j = await res.json();
      setRecord(j);
    } else {
      setRecord(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function postFollowup() {
    if (!newMessage.trim()) return;
    setPosting(true);
    const res = await fetch(`/api/medical-records/${id}/followups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: newMessage }),
    });
    if (res.ok) {
      setNewMessage("");
      load();
    } else {
      const j = await res.json().catch(() => ({}));
      alert(j.message || "Failed to post");
    }
    setPosting(false);
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (!record) return <div className="p-6">Medical record not found or forbidden.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold">Medical Record</h1>
      <div className="mt-4 bg-white border p-4 rounded">
        <div className="text-sm text-gray-600">Doctor: {record.doctor?.name}</div>
        <div className="text-sm text-gray-600">Patient: {record.patient?.name}</div>
        <div className="mt-2"><strong>Problem:</strong> {record.problem}</div>
        <div className="mt-2"><strong>Prescription:</strong> {record.prescription || "—"}</div>
        <div className="mt-2"><strong>Status:</strong> {record.status}</div>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold mb-2">Conversation</h2>

        <div className="space-y-3">
          {record.followUps && record.followUps.map((f) => (
            <div key={f.id} className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-500">{f.authorRole} — {new Date(f.createdAt).toLocaleString()}</div>
              <div className="mt-1">{f.message}</div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={3}
            placeholder="Write follow-up..."
          />
          <div className="mt-2 flex gap-2">
            <button onClick={postFollowup} disabled={posting} className="bg-blue-600 text-white px-4 py-2 rounded">
              {posting ? "Posting…" : "Post Follow-up"}
            </button>
            <button onClick={() => setNewMessage("")} className="px-4 py-2 border rounded">Clear</button>
          </div>
        </div>
      </div>
    </div>
  );
}
