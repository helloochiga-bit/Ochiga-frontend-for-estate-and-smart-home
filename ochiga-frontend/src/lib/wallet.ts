// src/lib/wallet.ts

// Fetch logged-in user wallet
export async function getWallet() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallets`, {
      credentials: "include",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error loading wallet:", err);
    return null;
  }
}

// Start Paystack top-up
export async function initiateTopup(amount: number) {
  try {
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
  } catch (err) {
    console.error("Error initiating topup:", err);
    return null;
  }
}

// Verify Paystack payment (called after redirect)
export async function verifyPayment(reference: string) {
  try {
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
  } catch (err) {
    console.error("Error verifying payment:", err);
    return null;
  }
}

// Load wallet transactions
export async function getTransactions() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/wallets/transactions`,
      {
        credentials: "include",
      }
    );

    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Error loading transactions:", err);
    return [];
  }
}
