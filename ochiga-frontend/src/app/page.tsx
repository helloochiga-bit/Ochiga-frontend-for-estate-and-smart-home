"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import OyiLoader from "../components/OyiLoader"; 

export default function Landing() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.push("/auth");
    }, 2600); // after animation finishes

    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <OyiLoader size={260} />
      </motion.div>
    </div>
  );
}
