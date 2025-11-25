import { useEffect, useRef, useState, useCallback } from "react";

export default function useSpeechRecognition(
  onResult: (text: string, spoken?: boolean) => void
) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const silenceTimer = useRef<number | null>(null);

  // Stable onResult ref
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);

  const resetSilenceTimer = useCallback((recognition: any) => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    silenceTimer.current = window.setTimeout(() => {
      try { recognition.stop(); } catch {}
    }, 1800);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return console.warn("SpeechRecognition not supported");

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
      resetSilenceTimer(recognition);
    };

    recognition.onresult = (e: any) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      if (transcript) onResultRef.current(transcript, true);
      resetSilenceTimer(recognition);
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = (err: any) => {
      console.warn("recognition error", err);
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, [resetSilenceTimer]); // ✅ added to dependencies

  const startListening = () => recognitionRef.current?.start();
  const stopListening = () => recognitionRef.current?.stop();

  return { listening, startListening, stopListening };
}
