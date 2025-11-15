// /src/components/UserBoard/UserMessages.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createOrGetConversation,
  getInbox,
  getMessages,
  sendMessage,
  subscribeToNewMessages,
  subscribeToInbox,
} from "@/lib/chatService";
import { Search, CirclePlus, Smile } from "lucide-react";

export default function UserMessagesPage() {
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;

  const [inbox, setInbox] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingInbox, setLoadingInbox] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const subRef = useRef(null);
  const inboxSubRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ⭐ READ CID FROM URL
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cid = params.get("cid");

    if (cid) {
      console.log("Opening conversation from URL:", cid);
      setActiveConvId(cid);
    }
  }, [location]);

  // ⭐ Load inbox
  useEffect(() => {
    if (!userId) return;

    let mounted = true;

    (async () => {
      setLoadingInbox(true);

      const data = await getInbox(userId);
      if (!mounted) return;
      setInbox(Array.isArray(data) ? data : []);

      setLoadingInbox(false);
    })();

    // Real-time inbox update
    inboxSubRef.current = subscribeToInbox(userId, async () => {
      const updated = await getInbox(userId);
      setInbox(Array.isArray(updated) ? updated : []);
    });

    return () => {
      mounted = false;
      inboxSubRef.current?.remove?.();
    };
  }, [userId]);

  // ⭐ Load messages when conversation changes
  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }

    let mounted = true;

    setLoadingMessages(true);

    (async () => {
      const msgs = await getMessages(activeConvId);
      if (!mounted) return;
      setMessages(msgs || []);
      setLoadingMessages(false);

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    })();

    // Realtime messages
    const sub = subscribeToNewMessages(activeConvId, (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    subRef.current = sub;

    return () => {
      mounted = false;
      subRef.current?.remove?.();
    };
  }, [activeConvId]);

  // ⭐ Send message
  const handleSend = async () => {
    if (!text.trim() || !userId || !activeConvId) return;

    try {
      await sendMessage({
        conversation_id: activeConvId,
        sender_id: userId,
        content: text.trim(),
      });

      setText("");
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  const filtered = inbox.filter((c) =>
    (c.other_user_name || c.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header className="flex items-center justify-between whitespace-nowrap border-b px-6 py-5">
        <div className="flex items-center gap-2 text-sm text-primary">
          <Link className="text-semibold" to={"/user/overview"}>
            Dashboard
          </Link>
          <span>/</span>
          <Link to={"/user/messages"} className="font-semibold text-primary">
            Messages
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* LEFT SIDE → Inbox */}
        <div className="lg:col-span-1 border-r">
          <div className="p-5 flex items-center gap-3 border-b">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search conversations"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 px-3 w-full border rounded-sm"
            />
          </div>

          <div className="overflow-y-auto max-h-[70vh]">
            {loadingInbox ? (
              <div className="p-4 text-center">Loading...</div>
            ) : inbox.length === 0 ? (
              <div className="p-6 text-center">
                <p>No conversations yet</p>
              </div>
            ) : (
              (filtered.length > 0 ? filtered : inbox).map((conv) => {
                const otherName =
                  conv.other_user_name || conv.name || "Conversation";

                const isActive =
                  activeConvId === conv.conversation_id ||
                  activeConvId === conv.id;

                return (
                  <div
                    key={conv.conversation_id || conv.id}
                    onClick={() =>
                      setActiveConvId(conv.conversation_id || conv.id)
                    }
                    className={`flex items-center gap-3 p-3 cursor-pointer border-b hover:bg-amber-light ${
                      isActive ? "bg-amber-100" : ""
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-200">
                      <img
                        src={conv.other_user_avatar || ""}
                        alt={otherName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{otherName}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {conv.last_message}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT SIDE → Messages */}
        <div className="lg:col-span-2 flex flex-col min-h-[60vh]">
          <header className="p-5 border-b">
            {activeConvId ? (
              <h1 className="font-bold text-primary">
                {
                  inbox.find(
                    (c) =>
                      (c.conversation_id || c.id) === activeConvId
                  )?.other_user_name
                }
              </h1>
            ) : (
              <p className="text-gray-500">Select a conversation...</p>
            )}
          </header>

          <div className="flex-1 p-6 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500">
                No messages yet
              </div>
            ) : (
              messages.map((m) => {
                const mine = m.sender_id === userId;
                return (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${
                      mine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-[70%] ${
                        mine
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                );
              })
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* SEND MESSAGE */}
          <footer className="p-5 border-t flex gap-3 items-center">
            <input
              type="text"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={!activeConvId}
              className="flex-1 px-4 py-2 border rounded"
            />
            <button
              className={`px-4 py-2 rounded text-white ${
                activeConvId ? "bg-amber" : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleSend}
              disabled={!activeConvId}
            >
              Send
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
