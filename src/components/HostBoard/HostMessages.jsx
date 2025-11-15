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

export default function HostMessagesPage() {
  const user = useSelector((state) => state.auth.user);
  const hostId = user?.id || user?.host_id || user?.user_id;

  const [inbox, setInbox] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const subRef = useRef(null);
  const inboxSubRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ⭐ READ CID FROM URL
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cid = params.get("cid");

    if (cid) {
      console.log("Host opening conversation from URL:", cid);
      setActiveConvId(cid);
    }
  }, [location]);

  // ⭐ Load Inbox
  useEffect(() => {
    if (!hostId) return;

    let mounted = true;

    (async () => {
      const data = await getInbox(hostId);
      if (!mounted) return;
      setInbox(Array.isArray(data) ? data : []);
    })();

    inboxSubRef.current = subscribeToInbox(hostId, async () => {
      const updated = await getInbox(hostId);
      setInbox(Array.isArray(updated) ? updated : []);
    });

    return () => {
      mounted = false;
      inboxSubRef.current?.remove?.();
    };
  }, [hostId]);

  // ⭐ Load Messages
  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }

    let mounted = true;

    (async () => {
      const msgs = await getMessages(activeConvId);
      if (!mounted) return;
      setMessages(msgs || []);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    })();

    const sub = subscribeToNewMessages(activeConvId, (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });

      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    });

    subRef.current = sub;

    return () => {
      mounted = false;
      subRef.current?.remove?.();
    };
  }, [activeConvId, hostId]);

  // ⭐ SEND MESSAGE
  const handleSend = async () => {
    if (!text.trim() || !hostId || !activeConvId) return;

    try {
      await sendMessage({
        conversation_id: activeConvId,
        sender_id: hostId,
        content: text.trim(),
      });

      setText("");
    } catch (err) {
      console.error("send error:", err);
    }
  };

  const filtered = inbox.filter((c) =>
    (c.other_user_name || c.user_name || c.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header className="flex items-center justify-between border-b px-6 py-5">
        <div className="flex items-center gap-2 text-sm text-primary ">
          <Link to="/host/overview">Dashboard</Link>
          <span>/</span>
          <Link to="/host/messages" className="font-semibold">
            Messages
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* LEFT — Inbox */}
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
            {inbox.length === 0 ? (
              <div className="p-6 text-center">No conversations yet</div>
            ) : (
              (filtered.length > 0 ? filtered : inbox).map((conv) => {
                const otherName =
                  conv.other_user_name || conv.user_name || conv.name;

                const isActive =
                  activeConvId === conv.conversation_id ||
                  activeConvId === conv.id;

                return (
                  <div
                    key={conv.conversation_id || conv.id}
                    onClick={() => setActiveConvId(conv.conversation_id || conv.id)}
                    className={`flex items-center gap-3 p-3 cursor-pointer border-b hover:bg-amber-light ${
                      isActive ? "bg-amber-100" : ""
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src={conv.other_user_avatar || ""}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{otherName}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {conv.last_message_text || conv.last_message || ""}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT — Messages */}
        <div className="lg:col-span-2 flex flex-col min-h-[60vh]">
          <header className="p-5 border-b">
            {activeConvId ? (
              <h1 className="font-bold text-primary">
                {
                  inbox.find((c) => (c.conversation_id || c.id) === activeConvId)
                    ?.other_user_name
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
                const mine = m.sender_id === hostId;
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

          {/* SEND */}
          <footer className="p-5 border-t flex gap-3">
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
