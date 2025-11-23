"use client";

import React, { useState } from "react";

type Announcement = { id: string; title: string; body: string; date: string };

export default function EstateCommunityPanel() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: "a1", title: "Security Drill", body: "Security drill on Friday at 10:00am", date: "Nov 14" },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  const post = () => {
    if (!newTitle || !newBody) return;
    setAnnouncements((s) => [{ id: String(Date.now()), title: newTitle, body: newBody, date: new Date().toLocaleDateString() }, ...s]);
    setNewTitle(""); setNewBody("");
  };

  return (
    <div className="p-3 bg-gray-900 border border-gray-700 rounded-xl text-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-maroon-400 font-semibold">Community</div>
          <div className="text-gray-400 text-xs">Announcements, visitors & community actions</div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-3">
        <input value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} placeholder="Announcement title" className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white mb-2"/>
        <textarea value={newBody} onChange={(e)=>setNewBody(e.target.value)} placeholder="Body" className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white mb-2" rows={3}/>
        <div className="flex justify-end">
          <button onClick={post} className="px-3 py-1 rounded bg-maroon-600 text-white text-xs">Post</button>
        </div>
      </div>

      <div className="space-y-2">
        {announcements.map((a) => (
          <div key={a.id} className="p-2 bg-gray-850 rounded border border-gray-700 text-xs">
            <div className="font-medium text-gray-100">{a.title}</div>
            <div className="text-gray-400 text-[12px]">{a.body}</div>
            <div className="text-gray-500 text-[11px] mt-1">{a.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
