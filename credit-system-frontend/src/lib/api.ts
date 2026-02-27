const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCredits() {
  const res = await fetch(`${API_URL}/credit-requests`);
  return res.json();
}

export async function getCredit(id: string) {
  const res = await fetch(`${API_URL}/credit-requests/${id}`);
  return res.json();
}

export async function createCredit(data: any) {
  const res = await fetch(`${API_URL}/credit-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}
