"use client";

import React, { useState } from "react";

type Tx = { id: string; type: "charge" | "payment"; amount: number; date: string; note?: string };

export default function EstateAccountingPanel() {
  const [balance, setBalance] = useState(125_400);
  const [txs, setTxs] = useState<Tx[]>([
    { id: "1", type: "charge", amount: 50000, date: "Nov 10", note: "Service charge" },
    { id: "2", type: "payment", amount: 20000, date: "Nov 12", note: "Resident payment" },
  ]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const addInvoice = () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return;
    const newTx: Tx = { id: String(Date.now()), type: "charge", amount: amt, date: new Date().toLocaleDateString(), note };
    setTxs((s) => [newTx, ...s]);
    setBalance((b) => b + amt);
    setAmount("");
    setNote("");
  };

  return (
    <div className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-maroon-400 font-semibold">Accounting</div>
          <div className="text-gray-400 text-xs">Estate finances & invoices</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Available</div>
          <div className="font-medium text-green-400">₦ {balance.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-3">
        <div className="text-xs text-gray-300 mb-2">Create charge / invoice</div>
        <div className="flex gap-2 items-center">
          <input value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount (₦)" className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white"/>
          <input value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Note" className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white"/>
          <button onClick={addInvoice} className="px-3 py-1 rounded bg-maroon-600 text-white text-xs">Create</button>
        </div>
      </div>

      <div className="text-xs text-gray-400 mb-2">Recent transactions</div>
      <div className="space-y-2">
        {txs.map((t) => (
          <div key={t.id} className="flex justify-between items-center bg-gray-850 p-2 rounded border border-gray-700 text-xs">
            <div>
              <div className={`${t.type === "payment" ? "text-green-300" : "text-yellow-300"} font-medium`}>
                {t.type === "payment" ? "Payment" : "Charge"} • ₦ {t.amount.toLocaleString()}
              </div>
              <div className="text-gray-400 text-[11px]">{t.note ?? ""}</div>
            </div>
            <div className="text-gray-400 text-[11px]">{t.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
