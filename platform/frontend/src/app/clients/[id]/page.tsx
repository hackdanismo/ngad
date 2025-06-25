import React from 'react';

type Company = {
  id: number;
  name: string;
  description: string;
};

async function getCompany(id: string): Promise<Company | null> {
  try {
    const res = await fetch(`http://localhost:3001/companies/${id}`, {
      next: { revalidate: 10 } // Optional: ISR for fresh data every 10s
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
}

export default async function ClientPage({ params }: { params: { id: string } }) {
  const company = await getCompany(params.id);

  if (!company) {
    return <div>Client not found.</div>;
  }

  return (
    <div>
      <h1>{company.name}</h1>
      <p>{company.description}</p>
    </div>
  );
}
