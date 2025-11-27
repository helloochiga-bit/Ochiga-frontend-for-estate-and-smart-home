import dynamic from "next/dynamic";

// Dynamically import the client page to disable SSR
const VerifyPage = dynamic(() => import("./VerifyPageClient"), { ssr: false });

export default VerifyPage;
