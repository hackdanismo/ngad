'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link'

type Company = {
  id: number;
  name: string;
  description: string;
};

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
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

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
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
              <Link href={`/clients/${company.id}`}>
                <strong>{company.name}</strong>: {company.description}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No companies found.</p>
      )}
    </div>
  );
}
