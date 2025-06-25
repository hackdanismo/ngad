'use client';

import React, { useEffect, useState } from 'react';

type Company = {
  id: number;
  name: string;
  description: string;
};

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch("http://localhost:3001/companies");
      const data = await res.json();
      setCompanies(data);
    } catch (err) {
      console.error("Error fetching companies:", err);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div>
        <input
          type="text"
          placeholder="Search companies by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredCompanies.length > 0 ? (
        <ul>
          {filteredCompanies.map((company) => (
            <li key={company.id}>
              <strong>{company.name}</strong>: {company.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No companies found.</p>
      )}
    </div>
  );
}
