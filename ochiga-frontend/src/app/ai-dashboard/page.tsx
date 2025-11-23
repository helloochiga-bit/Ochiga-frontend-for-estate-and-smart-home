"use client";

import { useRef, useState, useEffect } from "react";
import ChatFooter from "./components/ChatFooter";
import DynamicSuggestionCard from "./components/DynamicSuggestionCard";
import HamburgerMenu from "./components/HamburgerMenu";
import LayoutWrapper from "./layout/LayoutWrapper";
import ResidentTour from "./components/ResidentTour";

import useSpeechRecognition from "./hooks/useSpeechRecognition";

import {
  LightControl,
  WalletPanel,
  CCTVPanel,
  EstatePanel,
  HomePanel,
  RoomPanel,
  VisitorsPanel,
  PaymentsPanel,
  UtilitiesPanel,
  CommunityPanel,
  NotificationsPanel,
  HealthPanel,
  MessagePanel,
  IoTPanel,
  AiPanel,
  AssistantPanel,
  DeviceDiscoveryPanel,
} from "./components/Panels";

import { detectPanelType } from "./utils/panelDetection";
import { speak } from "./utils/speak";
import { FaArrowDown } from "react-icons/fa";

import { aiService } from "./services/aiService";
import { deviceService } from "./services/deviceService";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  panel?: string | null;
  panelTag?: string | null;
  time: string;
};

export default function AIDashboard() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "sys-1",
      role: "assistant",
      content: "Hello! I’m Ochiga AI — how can I assist you today?",
      panel: null,
      panelTag: null,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { listening, startListening, stopListening } = useSpeechRecognition(handleSend);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<any[]>([]);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const createId = () => Math.random().toString(36).substring(2, 9);

  const isAtBottom = () => {
    if (!chatRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    return scrollTop + clientHeight >= scrollHeight - 100;
  };

  useEffect(() => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 50;
    setShowScrollDown(!atBottom);
  }, [messages]);

  const handleScroll = () => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 50;
    setShowScrollDown(!atBottom);
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (!chatRef.current) return;
    chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior });
    setShowScrollDown(false);
  };

  const handleMicClick = () => (listening ? stopListening() : startListening());

  const movePanelBlockToBottom = (panelTag: string) => {
    setMessages((prev) => {
      const grouped = prev.filter((m) => m.panelTag === panelTag);
      if (!grouped.length) return prev;

      const filtered = prev.filter((m) => m.panelTag !== panelTag);

      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const updatedGroup = grouped.map((m) => ({ ...m, time: now }));

      return [...filtered, ...updatedGroup];
    });

    setTimeout(() => {
      if (isAtBottom()) scrollToBottom();
      else setShowScrollDown(true);
    }, 120);
  };

  const appendPanelBlock = (userText: string, assistantReply: string, panel: string) => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const tag = panel;

    const userMsg: ChatMessage = {
      id: createId(),
      role: "user",
      content: userText,
      panel: null,
      panelTag: tag,
      time: now,
    };

    const assistantMsg: ChatMessage = {
      id: createId(),
      role: "assistant",
      content: assistantReply,
      panel: null,
      panelTag: tag,
      time: now,
    };

    const panelMsg: ChatMessage = {
      id: createId(),
      role: "assistant",
      content: "",
      panel,
      panelTag: tag,
      time: now,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg, panelMsg]);

    setTimeout(() => {
      if (isAtBottom()) scrollToBottom();
      else setShowScrollDown(true);
    }, 120);
  };

  const handleAction = (
    actions: Array<{ type: string; action: string; target: string }>,
    userMessage?: string
  ) => {
    actions.forEach((a) => {
      let reply = "I didn’t quite get that. Can you say it again?";
      let panel: string | null = null;

      if (a.type === "device") {
        if (a.action === "turn_on" && a.target === "light") {
          reply = "Turning on the lights.";
          panel = "lights";
        } else if (a.action === "turn_on" && a.target === "ac") {
          reply = "Switching on the AC.";
          panel = "lights";
        } else if (a.action === "open" && a.target === "door") {
          reply = "Opening the door now.";
          panel = null;
        } else if (a.action === "turn_on" && a.target === "camera") {
          reply = "Turning on your security cameras.";
          panel = "cctv";
        } else if (a.action === "discover" && a.target === "devices") {
          reply = "Scanning for nearby devices…";
          panel = "devices";
        }
      }

      if (a.type === "schedule" && a.target === "visitor") {
        reply = "Sure. What time should I schedule your visitor?";
        panel = "visitors";
      }

      if (a.type === "info" && a.target === "status") {
        reply = "Your home is secure, power is stable, and the network is strong.";
        panel = null;
      }

      if (a.type === "system" && a.target === "assistant") {
        reply = "Alright. Ochiga Assistant signing off.";
        panel = null;
      }

      const userText = userMessage ?? `${a.action} ${a.target}`;

      if (panel) {
        const exists = messages.some((m) => m.panelTag === panel);
        if (exists) movePanelBlockToBottom(panel);
        else appendPanelBlock(userText, reply, panel);

        setActivePanel(panel);

        // If discovering devices, fetch from backend
        if (panel === "devices") {
          (async () => {
            const estateId = typeof window !== "undefined" ? localStorage.getItem("ochiga_estate") : undefined;
            const devices = await deviceService.getDevices(estateId ?? undefined);
            setDiscoveredDevices(devices || []);
          })();
        }
      } else {
        const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const userMsg: ChatMessage = {
          id: createId(),
          role: "user",
          content: userText,
          panel: null,
          panelTag: null,
          time: now,
        };

        const assistantMsg: ChatMessage = {
          id: createId(),
          role: "assistant",
          content: reply,
          panel: null,
          panelTag: null,
          time: now,
        };

        setMessages((prev) => [...prev, userMsg, assistantMsg]);

        setTimeout(() => {
          if (isAtBottom()) scrollToBottom();
          else setShowScrollDown(true);
        }, 120);

        speak(reply);
      }
    });
  };

  async function handleSend(text?: string, spoken = false) {
    const messageText = (text ?? input).trim();
    if (!messageText) return;

    setInput("");

    const panel = detectPanelType(messageText);

    const actions: Array<{ type: string; action: string; target: string }> = [];
    const lower = messageText.toLowerCase();

    if (lower.includes("light")) actions.push({ type: "device", action: "turn_on", target: "light" });
    if (lower.includes("ac")) actions.push({ type: "device", action: "turn_on", target: "ac" });
    if (lower.includes("door")) actions.push({ type: "device", action: "open", target: "door" });
    if (lower.includes("camera")) actions.push({ type: "device", action: "turn_on", target: "camera" });
    if (lower.includes("visitor")) actions.push({ type: "schedule", action: "create", target: "visitor" });
    if (lower.includes("status")) actions.push({ type: "info", action: "query", target: "status" });
    if (lower.includes("shut down") || lower.includes("sleep"))
      actions.push({ type: "system", action: "shutdown", target: "assistant" });

    if (
      lower.includes("connect device") ||
      lower.includes("add device") ||
      lower.includes("scan") ||
      lower.includes("discover") ||
      lower.includes("pair")
    ) {
      actions.push({ type: "device", action: "discover", target: "devices" });
    }

    if (actions.length) {
      handleAction(actions, messageText);
      return;
    }

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg: ChatMessage = {
      id: createId(),
      role: "user",
      content: messageText,
      panel: null,
      panelTag: null,
      time: now,
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const aiResp = await aiService.chat(messageText);
      const replyText = aiResp.reply || `Okay — I processed: "${messageText}".`;
      const panelFromAI = aiResp.panel ?? panel ?? null;

      const replyMsg: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: replyText,
        panel: panelFromAI ?? null,
        panelTag: panelFromAI ?? null,
        time: now,
      };

      if (panelFromAI) {
        const exists = messages.some((m) => m.panelTag === panelFromAI);
        if (exists) movePanelBlockToBottom(panelFromAI);
        else appendPanelBlock(messageText, replyText, panelFromAI);

        setActivePanel(panelFromAI);

        if (panelFromAI === "devices") {
          const estateId = typeof window !== "undefined" ? localStorage.getItem("ochiga_estate") : undefined;
          const devices = await deviceService.getDevices(estateId ?? undefined);
          setDiscoveredDevices(devices || []);
        }
      } else {
        setMessages((prev) => [...prev, replyMsg]);
      }

      if (spoken) speak(replyText);
    } catch (err) {
      console.error("AI error", err);
      const fallback: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: `Sorry, I couldn't reach the AI service.`,
        panel: null,
        panelTag: null,
        time: now,
      };
      setMessages((prev) => [...prev, fallback]);
    }

    setTimeout(() => {
      if (isAtBottom()) scrollToBottom();
      else setShowScrollDown(true);
    }, 120);
  }

  const suggestions = [
    "Turn on living room lights",
    "Fund my wallet",
    "View CCTV feed",
    "Check device status",
    "Lock all doors",
    "Connect new device",
  ];

  const renderPanel = (panel: string | null | undefined) => {
    switch (panel) {
      case "lights":
        return <LightControl />;
      case "wallet":
        return <WalletPanel />;
      case "cctv":
        return <CCTVPanel />;
      case "estate":
        return <EstatePanel />;
      case "home":
        return <HomePanel />;
      case "room":
        return <RoomPanel />;
      case "visitors":
        return <VisitorsPanel />;
      case "payments":
        return <PaymentsPanel />;
      case "utilities":
        return <UtilitiesPanel />;
      case "community":
        return <CommunityPanel />;
      case "notifications":
        return <NotificationsPanel />;
      case "health":
        return <HealthPanel />;
      case "message":
        return <MessagePanel />;
      case "iot":
        return <IoTPanel />;
      case "assistant":
        return <AssistantPanel />;
      case "ai":
        return <AiPanel />;
      case "devices":
        return <DeviceDiscoveryPanel devices={discoveredDevices} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (isAtBottom()) scrollToBottom("auto");
  }, [messages.length]);

  return (
    <LayoutWrapper menuOpen={menuOpen}>
      {/* HAMBURGER */}
      <header className="absolute top-4 left-4 z-50">
        <HamburgerMenu onToggle={(o: boolean) => setMenuOpen(o)} />
      </header>

      {/* FIXED PAGE */}
      <div className="fixed inset-0 flex flex-col w-full h-full">
        {/* CHAT + PANELS */}
        <main
          className="flex-1 flex flex-col overflow-hidden"
          style={{
            transform: menuOpen ? "translateX(70%)" : "translateX(0)",
            filter: menuOpen ? "blur(2px)" : "none",
            transition: "all 0.5s",
          }}
        >
          <div
            ref={chatRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 md:px-10 pt-20 pb-32 space-y-4 scroll-smooth"
            data-tour-id="chatArea"
          >
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
              {messages.map((msg, i) => {
                const isPanelBlock = Boolean(msg.panel);
                return (
                  <div
                    key={msg.id}
                    ref={(el) => (messageRefs.current[i] = el)}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex flex-col max-w-[80%]" data-tour-id={msg.panel === "devices" ? "devicesPanel" : undefined}>
                      {msg.content && (
                        <div
                          className={`px-4 py-3 rounded-2xl text-sm md:text-base shadow-sm ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-gray-900 text-gray-100 border border-gray-700 rounded-bl-none"
                          }`}
                        >
                          {msg.content}
                          {msg.role === "user" && (
                            <span className="text-[10px] text-gray-300 ml-2">{msg.time}</span>
                          )}
                        </div>
                      )}
                      {isPanelBlock && <div className="mt-1 w-full">{renderPanel(msg.panel)}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* DYNAMIC SUGGESTION CARD */}
        <div className="w-full px-4 z-40 pointer-events-none" data-tour-id="suggestionsCard">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            <DynamicSuggestionCard
              suggestions={suggestions}
              onSend={handleSend}
              isTyping={input.length > 0}
            />
          </div>
        </div>

        {/* CHAT FOOTER FULL WIDTH */}
        <div className="w-full px-4 py-2 bg-gray-900 border-t border-gray-700 flex justify-center items-center z-50">
          <ChatFooter
            input={input}
            setInput={setInput}
            listening={listening}
            onMicClick={handleMicClick}
            onSend={() => handleSend(undefined, false)}
            onAction={handleAction}
          />
        </div>
      </div>

      {showScrollDown && (
        <button
          onClick={() => scrollToBottom("smooth")}
          className="fixed bottom-24 right-6 z-50 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg"
        >
          <FaArrowDown />
        </button>
      )}

      {/* RESIDENT TOUR */}
      <ResidentTour />
    </LayoutWrapper>
  );
}
