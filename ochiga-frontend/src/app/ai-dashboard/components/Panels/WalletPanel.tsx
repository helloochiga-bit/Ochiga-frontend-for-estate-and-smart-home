"use client";

import { useEffect, useState } from "react";
import { getWallet, getTransactions, initiateTopup } from "@/lib/wallet";
import { toast } from "sonner";

export default function WalletPanel() {
  const [activeTab, setActiveTab] = useState<"add" | "transactions" | null>(null);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWallet();
    loadTransactions();
  }, []);

  // Load wallet balance
  async function loadWallet() {
    try {
      const data = await getWallet();
      if (data?.balance !== undefined) {
        setBalance(data.balance);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Load transaction history
  async function loadTransactions() {
    try {
      const tx = await getTransactions();
      if (Array.isArray(tx)) setTransactions(tx);
    } catch (err) {
      console.error(err);
    }
  }

  // Start Paystack payment
  const handleAddFunds = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setLoading(true);

    const res = await initiateTopup(amt);

    setLoading(false);

    if (!res?.data?.authorization_url) {
      toast.error("Unable to start payment");
      return;
    }

    // Redirect user to Paystack Checkout
    window.location.href = res.data.authorization_url;
  };

  return (
    <div className="mt-2 p-3 bg-gray-900 border border-gray-700 rounded-xl text-xs md:text-sm animate-fadeIn transition-all duration-300">
      <p className="mb-2 text-purple-400 font-semibold">💳 Wallet</p>

      {/* Wallet Balance */}
      <div className="flex justify-between mb-2">
        <span>Balance:</span>
        <span className="font-semibold text-green-400">
          ₦ {Number(balance).toLocaleString()}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setActiveTab(activeTab === "add" ? null : "add")}
          className={`px-3 py-1 rounded-full transition ${
            activeTab === "add"
              ? "bg-purple-600 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-gray-200"
          }`}
        >
          Add Funds
        </button>

        <button
          onClick={() =>
            setActiveTab(activeTab === "transactions" ? null : "transactions")
          }
          className={`px-3 py-1 rounded-full transition ${
            activeTab === "transactions"
              ? "bg-purple-600 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-gray-200"
          }`}
        >
          Transactions
        </button>
      </div>

      {/* Add Funds Form */}
      {activeTab === "add" && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 mt-2 space-y-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full bg-gray-900 border border-gray-700 rounded-md px-2 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <button
            onClick={handleAddFunds}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 rounded-md py-1 text-xs font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Pay with Paystack"}
          </button>
        </div>
      )}

      {/* Transaction List */}
      {activeTab === "transactions" && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 mt-2 max-h-52 overflow-y-auto">
          {transactions.length === 0 && (
            <p className="text-gray-400 text-xs">No transactions yet.</p>
          )}

          {transactions.map((tx: any) => (
            <div
              key={tx.id}
              className="flex justify-between text-[11px] py-1 border-b border-gray-700 last:border-none"
            >
              <span
                className={`${
                  tx.type === "credit" ? "text-green-400" : "text-red-400"
                }`}
              >
                {tx.type}
              </span>
              <span>₦ {Number(tx.amount).toLocaleString()}</span>
              <span className="text-gray-400">
                {new Date(tx.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
