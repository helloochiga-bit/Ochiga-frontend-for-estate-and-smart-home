// -------------- FULL FILE BELOW --------------
"use client";

import { useRef, useState, useEffect } from "react";
import ChatFooter from "./components/ChatFooter";
import DynamicSuggestionCard from "./components/DynamicSuggestionCard";
import HamburgerMenu from "./components/HamburgerMenu";
import LayoutWrapper from "./layout/LayoutWrapper";
import ResidentTour from "./components/Onboarding/ResidentTour";

import useSpeechRecognition from "./hooks/useSpeechRecognition";

import {
  LightControl,
  ACPanel,
  TVPanel,
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
  SmartMeterPanel,
  IRSensorPanel,
  SensorPanel
} from "./components/Panels";

import { detectPanelType } from "./utils/panelDetection";
import { speak } from "./utils/speak";
import { FaArrowDown } from "react-icons/fa";

import { aiService } from "./services/aiService";
import { deviceService } from "./services/deviceService";

/* ---------------------------------------------
   TS Types
--------------------------------------------- */
type Suggestion = {
  id: string;
  title: string;
  subtitle?: string;
  payload?: string;
};

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

  // Chat window + messages ref
  const chatRef = useRef<HTMLDivElement | null>(null);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [showScrollDown, setShowScrollDown] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<any[]>([]);

  const createId = () => Math.random().toString(36).substring(2, 9);

  /* CHECK BOTTOM */
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

  const handleMicClick = () =>
    listening ? stopListening() : startListening();

  /* MOVE PANEL BLOCK */
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

  /* APPEND PANEL BLOCK */
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

  /* --------- HANDLE ACTIONS FROM TEXT ---------- */
  const handleAction = (
    actions: Array<{ type: string; action: string; target: string }>,
    userMessage?: string
  ) => {
    actions.forEach((a) => {
      let reply = "Hmm… I didn’t quite get that. Try rephrasing.";
      let panel: string | null = null;

      if (a.type === "device") {
        switch (a.target) {
          case "light": reply = a.action === "turn_on" ? "Turning on your lights." : "Turning off your lights."; panel = "lights"; break;
          case "ac": reply = a.action === "turn_on" ? "Switching on the AC." : "Turning off the AC."; panel = "ac_panel"; break;
          case "tv": reply = a.action === "turn_on" ? "Turning on the TV." : "Turning off the TV."; panel = "tv_panel"; break;
          case "camera": reply = "Accessing CCTV cameras."; panel = "cctv"; break;
          case "smart_meter": reply = "Here’s your meter reading."; panel = "smart_meter"; break;
          case "ir_sensor": reply = "Opening IR devices."; panel = "ir_sensor"; break;
          case "sensors": reply = "Showing sensors."; panel = "sensors"; break;
          case "devices": reply = "Scanning for devices…"; panel = "devices"; break;
          case "door": reply = "Opening your door."; panel = null; break;
        }
      }

      if (a.type === "schedule" && a.target === "visitor") {
        reply = "Okay — what time should the visitor arrive?";
        panel = "visitors";
      }

      if (a.type === "info" && a.target === "status") {
        reply = "Status is good — home is secure, power stable.";
        panel = null;
      }

      const userText = userMessage ?? `${a.action} ${a.target}`;

      if (panel) {
        const exists = messages.some((m) => m.panelTag === panel);
        if (exists) movePanelBlockToBottom(panel);
        else appendPanelBlock(userText, reply, panel);

        setActivePanel(panel);

        if (panel === "devices") {
          (async () => {
            const estateId = localStorage.getItem("ochiga_estate") ?? undefined;
            const devices = await deviceService.getDevices(estateId);
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
        speak(reply);
      }
    });
  };

  /* ---------- HANDLE SEND ---------- */
  async function handleSend(text?: string, spoken = false) {
    const messageText = (text ?? input).trim();
    if (!messageText) return;
    setInput("");

    const panel = detectPanelType(messageText);
    const actions: Array<{ type: string; action: string; target: string }> = [];
    const lower = messageText.toLowerCase();

    // Device keywords
    if (lower.includes("turn on") && lower.includes("ac")) actions.push({ type: "device", action: "turn_on", target: "ac" });
    if (lower.includes("turn off") && lower.includes("ac")) actions.push({ type: "device", action: "turn_off", target: "ac" });

    if (lower.includes("turn on") && lower.includes("tv")) actions.push({ type: "device", action: "turn_on", target: "tv" });
    if (lower.includes("turn off") && lower.includes("tv")) actions.push({ type: "device", action: "turn_off", target: "tv" });

    if (lower.includes("light")) actions.push({ type: "device", action: "turn_on", target: "light" });
    if (lower.includes("lights off")) actions.push({ type: "device", action: "turn_off", target: "light" });

    if (lower.includes("camera") || lower.includes("cctv")) actions.push({ type: "device", action: "turn_on", target: "camera" });
    if (lower.includes("door")) actions.push({ type: "device", action: "open", target: "door" });

    if (lower.includes("visitor")) actions.push({ type: "schedule", action: "create", target: "visitor" });
    if (lower.includes("status")) actions.push({ type: "info", action: "query", target: "status" });

    if (lower.includes("meter")) actions.push({ type: "device", action: "view", target: "smart_meter" });
    if (lower.includes("ir")) actions.push({ type: "device", action: "view", target: "ir_sensor" });
    if (lower.includes("sensor")) actions.push({ type: "device", action: "view", target: "sensors" });

    if (lower.includes("connect") || lower.includes("add") || lower.includes("discover") || lower.includes("scan"))
      actions.push({ type: "device", action: "discover", target: "devices" });

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
      const replyText = aiResp.reply || `Okay — processed: "${messageText}".`;
      const panelFromAI = aiResp.panel ?? panel ?? null;

      const replyMsg: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: replyText,
        panel: panelFromAI,
        panelTag: panelFromAI,
        time: now,
      };

      if (panelFromAI) {
        const exists = messages.some((m) => m.panelTag === panelFromAI);
        if (exists) movePanelBlockToBottom(panelFromAI);
        else appendPanelBlock(messageText, replyText, panelFromAI);

        setActivePanel(panelFromAI);

        if (panelFromAI === "devices") {
          const estateId = localStorage.getItem("ochiga_estate") ?? undefined;
          const devices = await deviceService.getDevices(estateId);
          setDiscoveredDevices(devices || []);
        }
      } else {
        setMessages((prev) => [...prev, replyMsg]);
      }

      if (spoken) speak(replyText);
    } catch (err) {
      console.error(err);
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

  /* SUGGESTIONS */
  const suggestions: Suggestion[] = [
    { id: "1", title: "Turn on living room lights" },
    { id: "2", title: "Turn on AC" },
    { id: "3", title: "Turn on TV" },
    { id: "4", title: "Fund my wallet" },
    { id: "5", title: "View CCTV feed" },
    { id: "6", title: "Check device status" },
    { id: "7", title: "Lock all doors" },
    { id: "8", title: "Connect new device" },
    { id: "9", title: "Load electricity meter" },
    { id: "10", title: "Check IR devices" },
    { id: "11", title: "View sensors" }
  ];

  /* PANEL SELECTOR */
  const renderPanel = (panel: string | null | undefined) => {
    switch (panel) {
      case "lights": return <LightControl />;
      case "ac_panel": return <ACPanel />;
      case "tv_panel": return <TVPanel />;
      case "wallet": return <WalletPanel />;
      case "cctv": return <CCTVPanel />;
      case "estate": return <EstatePanel />;
      case "home": return <HomePanel />;
      case "room": return <RoomPanel />;
      case "visitors": return <VisitorsPanel />;
      case "payments": return <PaymentsPanel />;
      case "utilities": return <UtilitiesPanel />;
      case "community": return <CommunityPanel />;
      case "notifications": return <NotificationsPanel />;
      case "health": return <HealthPanel />;
      case "message": return <MessagePanel />;
      case "iot": return <IoTPanel />;
      case "assistant": return <AssistantPanel />;
      case "ai": return <AiPanel />;
      case "devices": return <DeviceDiscoveryPanel devices={discoveredDevices} />;
      case "smart_meter": return <SmartMeterPanel />;
      case "ir_sensor": return <IRSensorPanel />;
      case "sensors": return <SensorPanel />;
      default: return null;
    }
  };

  /* AUTO-SCROLL NEW MESSAGE */
  useEffect(() => {
    if (isAtBottom()) scrollToBottom("auto");
  }, [messages.length]);

  return (
    <LayoutWrapper menuOpen={menuOpen}>
      
      {/* MENU */}
      <header className="absolute top-4 left-4 z-50">
        <HamburgerMenu isOpen={menuOpen} onToggle={(o: boolean) => setMenuOpen(o)} />
      </header>

      {/* MAIN WRAPPER */}
      <div className="fixed inset-0 flex flex-col w-full h-full">
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
          >
            <div className="max-w-3xl mx-auto flex flex-col gap-4">

              {messages.map((msg, i) => (
                <div
                  key={msg.id}
                  ref={(el) => { messageRefs.current[i] = el; }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex flex-col max-w-[80%]">

                    {/* TEXT BUBBLE */}
                    {msg.content && (
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm md:text-base shadow-sm ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-gray-900 text-gray-100 border border-gray-700 rounded-bl-none"
                        }`}
                      >
                        {msg.content}
                      </div>
                    )}

                    {/* PANEL BLOCK */}
                    {msg.panel && (
                      <div className="mt-1 w-full">{renderPanel(msg.panel)}</div>
                    )}

                  </div>
                </div>
              ))}

            </div>
          </div>
        </main>

        {/* SUGGESTIONS */}
        <div className="w-full px-4 z-40 pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            <DynamicSuggestionCard
              suggestions={suggestions}
              onSend={handleSend}
              isTyping={input.length > 0}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="w-full px-4 py-2 bg-gray-900 border-t border-gray-700 flex justify-center items-center z-50">
          <ChatFooter
  input={input}
  setInput={setInput}
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

      <ResidentTour />
    </LayoutWrapper>
  );
}
