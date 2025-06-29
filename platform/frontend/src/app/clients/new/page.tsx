'use client';

import React, { useState } from 'react';

type Company = {
  id: number;
  name: string;
  description: string;
};

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:3001/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) {
        throw new Error("Failed to add a company");
      }

      const newCompany = await res.json();
      setCompanies((prev) => [...prev, newCompany]);
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Error adding company:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Company name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Adding..." : "Add Company"}
        </button>
      </form>
    </div>
  );
}
