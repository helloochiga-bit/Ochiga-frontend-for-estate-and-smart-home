"use client";

import { useRef, useState, useEffect } from "react";
import LayoutWrapper from "./layout/LayoutWrapper";
import HamburgerMenu from "./components/HamburgerMenu";
import EstateChatFooter from "./components/EstateChatFooter";
import DynamicSuggestionCard from "./components/DynamicSuggestionCard";

import EstateDevicePanel from "./components/panels/EstateDevicePanel";
import EstatePowerPanel from "./components/panels/EstatePowerPanel";
import EstateAccountingPanel from "./components/panels/EstateAccountingPanel";
import EstateCommunityPanel from "./components/panels/EstateCommunityPanel";
import EstateHomeCreationPanel from "./components/panels/EstateHomeCreationPanel";

import { detectEstatePanelType } from "./utils/estatePanelDetection";
import { FaArrowDown, FaLightbulb, FaWallet, FaVideo, FaBolt } from "react-icons/fa";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  panel?: string | null;
  panelTag?: string | null;
  time: string;
};

export default function EstateDashboard() {
  const createId = () => Math.random().toString(36).substring(2, 9);

  const [menuOpen, setMenuOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "sys-1",
      role: "assistant",
      content: "Welcome, Estate Admin! How can I assist you today?",
      panel: null,
      panelTag: null,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const chatRef = useRef<HTMLDivElement | null>(null);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const nowTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const isAtBottom = () => {
    if (!chatRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    return scrollTop + clientHeight >= scrollHeight - 100;
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (!chatRef.current) return;
    chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior });
    setShowScrollDown(false);
  };

  const handleScroll = () => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    setShowScrollDown(scrollTop + clientHeight < scrollHeight - 50);
  };

  const movePanelGroupToBottom = (panelTag: string) => {
    setMessages((prev) => {
      const group = prev.filter((m) => m.panelTag === panelTag);
      if (!group.length) return prev;
      const rest = prev.filter((m) => m.panelTag !== panelTag);
      const t = nowTime();
      const updatedGroup = group.map((m) => ({
        ...m,
        time: t,
        id: createId(),
      }));
      return [...rest, ...updatedGroup];
    });

    setTimeout(() => {
      if (isAtBottom()) scrollToBottom();
      else setShowScrollDown(true);
    }, 120);
  };

  const appendPanelGroup = (userText: string, assistantText: string, panel: string) => {
    const tag = panel;
    const t = nowTime();

    const userMsg: ChatMessage = {
      id: createId(),
      role: "user",
      content: userText,
      panel: null,
      panelTag: tag,
      time: t,
    };
    const assistantMsg: ChatMessage = {
      id: createId(),
      role: "assistant",
      content: assistantText,
      panel: null,
      panelTag: tag,
      time: t,
    };
    const panelMsg: ChatMessage = {
      id: createId(),
      role: "assistant",
      content: "",
      panel,
      panelTag: tag,
      time: t,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg, panelMsg]);

    setTimeout(() => {
      if (isAtBottom()) scrollToBottom();
      else setShowScrollDown(true);
    }, 120);
  };

  const handleAction = (actions: Array<{ type: string; action: string; target: string }>, userMessage?: string) => {
    actions.forEach((a) => {
      let reply = "I didn't quite get that. Can you repeat?";
      let panel: string | null = null;

      if (a.type === "device") {
        panel = "estate_devices";
        reply = "Opening estate devices panel.";
      }

      const userText = userMessage ?? `${a.action} ${a.target}`;

      if (panel) {
        const exists = messages.some((m) => m.panelTag === panel);
        if (exists) movePanelGroupToBottom(panel);
        else appendPanelGroup(userText, reply, panel);
      } else {
        const t = nowTime();
        const userMsg: ChatMessage = {
          id: createId(),
          role: "user",
          content: userText,
          panel: null,
          panelTag: null,
          time: t,
        };
        const assistantMsg: ChatMessage = {
          id: createId(),
          role: "assistant",
          content: reply,
          panel: null,
          panelTag: null,
          time: t,
        };
        setMessages((prev) => [...prev, userMsg, assistantMsg]);
      }
    });
  };

  function handleSend(text?: string) {
    const messageText = (text ?? input).trim();
    if (!messageText) return;

    setInput("");

    const panel = detectEstatePanelType(messageText);

    if (panel && panel !== "device_discovery") {
      const reply =
        panel === "estate_devices"
          ? "Estate device panel opened."
          : panel === "estate_power"
          ? "Estate power control opened."
          : panel === "estate_accounting"
          ? "Estate accounting opened."
          : panel === "estate_community"
          ? "Estate community panel opened."
          : panel === "home_creation"
          ? "Home creation panel opened."
          : `Opened ${panel}.`;

      const exists = messages.some((m) => m.panelTag === panel);

      if (exists) movePanelGroupToBottom(panel);
      else appendPanelGroup(messageText, reply, panel);

      return;
    }

    const t = nowTime();
    const userMsg: ChatMessage = {
      id: createId(),
      role: "user",
      content: messageText,
      panel: null,
      panelTag: null,
      time: t,
    };
    const assistantMsg: ChatMessage = {
      id: createId(),
      role: "assistant",
      content: `Okay — I processed: "${messageText}".`,
      panel: null,
      panelTag: null,
      time: t,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);

    setTimeout(() => {
      if (isAtBottom()) scrollToBottom();
      else setShowScrollDown(true);
    }, 120);
  }

  const suggestions = [
    { title: "View estate devices", icon: FaLightbulb, description: "Scan and assign devices to homes" },
    { title: "View power status", icon: FaBolt, description: "Monitor estate power and consumption" },
    { title: "Open accounting panel", icon: FaWallet, description: "Track estate finances and payments" },
    { title: "Open community panel", icon: FaVideo, description: "Manage visitor and community interactions" },
  ].map((s) => ({ ...s, id: crypto.randomUUID() }));

  const renderPanel = (panel: string | null | undefined) => {
    switch (panel) {
      case "estate_devices":
        return <EstateDevicePanel devices={[]} onAction={(id, action) => handleSend(`Device ${id} ${action}`)} />;
      case "estate_power":
        return <EstatePowerPanel />;
      case "estate_accounting":
        return <EstateAccountingPanel />;
      case "estate_community":
        return <EstateCommunityPanel />;
      case "home_creation":
        return <EstateHomeCreationPanel />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (isAtBottom()) scrollToBottom("auto");
  }, [messages.length]);

  return (
    <LayoutWrapper menuOpen={menuOpen}>
      <header className="absolute top-4 left-4 z-50">
        <HamburgerMenu onToggle={(o: boolean) => setMenuOpen(o)} />
      </header>

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
              {messages.map((msg, i) => {
                const isPanelBlock = Boolean(msg.panel);

                return (
                  <div
                    key={msg.id}
                    ref={(el) => { messageRefs.current[i] = el; }} // ✅ FIXED
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex flex-col max-w-[80%]">
                      {msg.content && !isPanelBlock && (
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

                      {isPanelBlock && (
                        <div className="mt-1 w-full">
                          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-3 shadow-sm">
                            {renderPanel(msg.panel)}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-2 mb-2 px-2">{msg.time}</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        <div className="w-full px-4 z-40 pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            <DynamicSuggestionCard
              suggestions={suggestions}
              onSend={handleSend}
              isTyping={input.length > 0}
            />
          </div>
        </div>

        <div className="w-full px-4 py-2 bg-gray-900 border-t border-gray-700 flex justify-center items-center z-50">
          <EstateChatFooter input={input} setInput={setInput} onSend={() => handleSend()} onAction={handleAction} />
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
    </LayoutWrapper>
  );
}
