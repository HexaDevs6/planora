// /src/pages/HostMessages.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
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
  const hostId = user?.id || user?.host_id || user?.user_id; // try host_id fallback
  const [inbox, setInbox] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const subRef = useRef(null);
  const inboxSubRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!hostId) return;
    let mounted = true;
    (async () => {
      const data = await getInbox(hostId);
      if (!mounted) return;
      setInbox(Array.isArray(data) ? data : []);
    })();

    inboxSubRef.current = subscribeToInbox(hostId, async (payload) => {
      const updated = await getInbox(hostId);
      setInbox(Array.isArray(updated) ? updated : []);
    });

    return () => {
      mounted = false;
      inboxSubRef.current?.remove?.();
    };
  }, [hostId]);

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

      (async () => {
        const updated = await getInbox(hostId);
        setInbox(Array.isArray(updated) ? updated : []);
      })();

      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    });

    subRef.current = sub;
    return () => {
      mounted = false;
      subRef.current?.remove?.();
    };
  }, [activeConvId, hostId]);

  const openConversationWith = async (otherUserId) => {
    if (!hostId) return;
    const convId = await createOrGetConversation(hostId, otherUserId);
    setActiveConvId(convId);
  };

  const handleSend = async () => {
    if (!text.trim() || !hostId || !activeConvId) return;
    try {
      await sendMessage({ conversation_id: activeConvId, sender_id: hostId, content: text.trim() });
      setText("");
    } catch (err) {
      console.error("send error:", err);
    }
  };

  const filtered = inbox.filter((c) =>
    (c.other_user_name || c.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-white px-6 py-5 bg-content-light dark:bg-content-dark shadow-subtle">
        <div className="flex items-center gap-2 text-sm text-primary ">
          <Link className="text-semibold" to={"/host/overview"}>
            Dashboard
          </Link>
          <span className="text-primary">/</span>
          <Link to={"/host/messages"} className="font-semibold text-primary ">
            Messages
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className={`lg:col-span-1`}>
          <div className={`p-5 flex items-center gap-3 border-b border-gray-200 dark:border-white`}>
            <Search size={18} />
            <input
              type="search"
              placeholder="Search conversations"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 px-3 w-full placeholder:text-text placeholder:text-[12px] border rounded-sm focus:outline-amber-300"
            />
          </div>

          <div className={`border-gray-200 dark:border-white flex flex-row md:flex-col overflow-y-auto max-h-[70vh]`}>
            {inbox.length === 0 ? (
              <div className="p-6 text-center">No conversations yet</div>
            ) : (
              (filtered.length > 0 ? filtered : inbox).map((conv) => {
                const otherName = conv.other_user_name || conv.user_name || conv.name || "Conversation";
                const isActive = activeConvId === conv.conversation_id || activeConvId === conv.id;
                return (
                  <div
                    key={conv.conversation_id || conv.id}
                    onClick={() => setActiveConvId(conv.conversation_id || conv.id)}
                    className={`flex items-center cursor-pointer gap-3 p-3 border-b hover:bg-amber-light ${isActive ? "bg-amber-100" : ""}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      <img src={conv.other_user_avatar || conv.avatar || ""} alt={otherName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-primary truncate">{otherName}</p>
                      <p className="text-xs text-text truncate">{conv.last_message_text || conv.last_message || ""}</p>
                    </div>
                    <div className="text-sm text-text">
                      {conv.last_message_at && <div className="text-[12px] hidden md:block">{new Date(conv.last_message_at).toLocaleString()}</div>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col min-h-[60vh]">
          <header className="flex justify-between items-center p-5 md:border-b border-1 border-gray-200 dark:border-white">
            {activeConvId ? (
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  <img src={(inbox.find((c) => (c.conversation_id || c.id) === activeConvId)?.other_user_avatar) || ""} alt="other" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <h1 className="font-bold text-primary">
                    {inbox.find((c) => (c.conversation_id || c.id) === activeConvId)?.other_user_name || "Conversation"}
                  </h1>
                </div>
              </div>
            ) : (
              <p className="text-text">Select a conversation...</p>
            )}
          </header>

          <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-chat-bg-light dark:bg-chat-bg-dark">
            {messages.length === 0 ? (
              <div className="text-center text-text">No messages yet</div>
            ) : (
              messages.map((m) => {
                const mine = m.sender_id === hostId;
                return (
                  <div key={m.id} className={`flex gap-3 ${mine ? "justify-end" : "justify-start"}`}>
                    {!mine && (
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={inbox.find((c) => (c.conversation_id || c.id) === activeConvId)?.other_user_avatar || ""} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className={`${mine ? "bg-primary text-white" : "bg-white dark:bg-violet text-violet"} p-3 rounded-lg max-w-[70%]`}>
                      <div className="text-sm">{m.content || m.message || m.text}</div>
                      <div className="text-[10px] text-muted-foreground mt-1 text-right">{new Date(m.created_at || m.createdAt).toLocaleTimeString()}</div>
                    </div>
                    {mine && (
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={user.avatar || user.photoURL || ""} alt="me" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <footer className="flex items-center gap-3 p-5 border-t bg-content-light dark:bg-content-dark">
            <div className="flex items-center gap-3 w-full p-4 bg-gray-100 dark:bg-gray-700 rounded-sm">
              <CirclePlus size={20} />
              <input
                type="text"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-sm focus:outline-amber-300"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
              />
              <Smile size={20} />
              <button className="bg-amber text-white px-4 py-2 rounded-sm" onClick={handleSend}>
                Send
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
