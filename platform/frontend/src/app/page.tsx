'use client';

import { useEffect, useState } from 'react';

type Company = {
  id: number;
  name: string;
  description: string;
};

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/companies')
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching companies:', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : companies.length > 0 ? (
        <ul>
          {companies.map((company) => (
            <li key={company.id}>
              <strong>{company.name}</strong>: {company.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No companies found.</p>
      )}
    </>
  );
}
