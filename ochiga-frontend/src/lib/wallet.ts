export async function getWallet() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallets`, {
    credentials: "include",
  });
  return await res.json();
}

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
