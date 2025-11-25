"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";

export default function QRPreview({ text }: { text: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!text) return;
    QRCode.toDataURL(text).then(setDataUrl).catch(console.error);
  }, [text]);

  return (
    <div className="w-40 h-40 bg-white p-1 rounded relative">
      {dataUrl ? (
        <Image
          src={dataUrl}
          alt="QR Code"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      ) : (
        <div className="w-full h-full bg-gray-200" />
      )}
    </div>
  );
}
