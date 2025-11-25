"use client";

import { useState } from "react";
import QRPreview from "./QRPreview";
import { v4 as uuidv4 } from "uuid";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [creating, setCreating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const handleCreateEstateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { alert("Enter email"); return; }
    setCreating(true);

    // Simulate creating a user account (estate admin) and generating estate invite token
    await new Promise((r) => setTimeout(r, 700));
    const token = uuidv4();
    const tokenObj = {
      token,
      type: "estateInvite",
      email,
      createdAt: Date.now(),
      used: false,
    };

    const invites = JSON.parse(localStorage.getItem("ochiga_invites") || "[]");
    invites.push(tokenObj);
    localStorage.setItem("ochiga_invites", JSON.stringify(invites));

    // create basic user record for this admin (no estate yet)
    const users = JSON.parse(localStorage.getItem("ochiga_users") || "[]");
    users.push({ id: uuidv4(), email, password: "", role: "estate_admin", estates: [] });
    localStorage.setItem("ochiga_users", JSON.stringify(users));

    // The link in the email:
    const link = `${location.origin}/auth/estate-complete?token=${token}`;
    setGeneratedLink(link);
    setCreating(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-xl w-full max-w-md p-5 border border-gray-800 relative">
        <button
          className="absolute top-3 right-4 text-gray-400"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-3 text-center">Create Estate (Sign up)</h2>
        <p className="text-sm text-gray-400 mb-4 text-center">
          Enter manager email — we&apos;ll send a sign-up link to complete estate registration.
        </p>

        {!generatedLink ? (
          <form onSubmit={handleCreateEstateInvite} className="space-y-3">
            <input
              type="email"
              placeholder="Manager&apos;s email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2 rounded bg-emerald-600 hover:bg-emerald-700"
              >
                {creating ? "Creating..." : "Create Invite"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-3 rounded bg-gray-800 border border-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-300">
              Mock email sent. Share this link with manager (demo):
            </p>
            <div className="p-3 bg-gray-800 border border-gray-700 rounded">
              <a className="text-emerald-300 break-all" href={generatedLink}>{generatedLink}</a>
            </div>

            <div>
              <p className="text-sm text-gray-300">QR preview (optional):</p>
              <div className="mt-2"><QRPreview text={generatedLink} /></div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { navigator.clipboard.writeText(generatedLink); alert("Link copied"); }}
                className="flex-1 py-2 rounded bg-gray-800 border border-gray-700"
              >
                Copy Link
              </button>
              <button
                onClick={() => { onClose(); }}
                className="py-2 px-4 rounded bg-emerald-600"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
