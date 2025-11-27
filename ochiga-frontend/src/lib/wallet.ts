// src/lib/wallet.ts

// Fetch logged-in user wallet
export async function getWallet() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallets`, {
    credentials: "include",
  });

  if (!res.ok) return null;
  return await res.json();
}

// Start Paystack top-up
export async function initiateTopup(amount: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/wallets/paystack/initiate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ amount }),
    }
  );

  return await res.json();
}

// Verify Paystack payment (called after redirect)
export async function verifyPayment(reference: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/wallets/paystack/verify`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ reference }),
    }
  );

  return await res.json();
}

// Load wallet transactions
export async function getTransactions() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/wallets/transactions`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) return [];
  return await res.json();
}
