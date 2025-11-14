// /src/pages/UserMessages.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import i18n from "@/i18n";
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
  const userId = user?.id || user?.user_id || user?.uid; // fallback fields
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

    // subscribe inbox updates (optional, will deliver new message events globally)
    inboxSubRef.current = subscribeToInbox(userId, (payload) => {
      // payload contains new message; best practice: refresh inbox RPC once
      (async () => {
        const updated = await getInbox(userId);
        setInbox(Array.isArray(updated) ? updated : []);
      })();
    });

    return () => {
      mounted = false;
      inboxSubRef.current?.remove?.();
    };
  }, [userId]);

  // when activeConvId changes, fetch messages and subscribe to real-time for this conv
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
      // scroll
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    })();

    // subscribe
    const sub = subscribeToNewMessages(activeConvId, (newMsg) => {
      // push new message if not duplicate
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });

      // also refresh inbox quick (optional)
      (async () => {
        const updated = await getInbox(userId);
        setInbox(Array.isArray(updated) ? updated : []);
      })();

      // scroll
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    });

    subRef.current = sub;

    return () => {
      mounted = false;
      subRef.current?.remove?.();
    };
  }, [activeConvId, userId]);

  const openConversationWith = async (otherUserId) => {
    if (!userId) return;
    const convId = await createOrGetConversation(userId, otherUserId);
    setActiveConvId(convId);
  };

  const handleSend = async () => {
    if (!text.trim() || !userId || !activeConvId) return;
    try {
      await sendMessage({ conversation_id: activeConvId, sender_id: userId, content: text.trim() });
      setText("");
      // messages will arrive via realtime subscription; optional: optimistic update
    } catch (err) {
      console.error("send error:", err);
      // optionally show toast
    }
  };

  const filtered = inbox.filter((c) =>
    (c.other_user_name || c.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-white px-6 py-5 bg-content-light dark:bg-content-dark shadow-subtle">
        <div className="flex items-center gap-2 text-sm text-primary ">
          <Link className="text-semibold" to={"/user/overview"}>
            Dashboard
          </Link>
          <span className="text-primary">/</span>
          <Link to={"/user/messages"} className="font-semibold text-primary ">
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
            {loadingInbox ? (
              <div className="p-4 text-center">Loading...</div>
            ) : inbox.length === 0 ? (
              <div className="p-6 text-center">
                <p>No conversations yet</p>
              </div>
            ) : (
              (filtered.length > 0 ? filtered : inbox).map((conv) => {
                // structure depends on your RPC; adapt field names
                const otherName = conv.other_user_name || conv.name || conv.display_name || "Conversation";
                const otherId = conv.other_user_id || conv.other_id || conv.participant_id;
                const lastMessage = conv.last_message_text || conv.last_message || conv.last_message_content;
                const unread = conv.unread_count || conv.unread || 0;
                const isActive = activeConvId === conv.conversation_id || activeConvId === conv.id;

                return (
                  <div
                    onClick={() => {
                      setActiveConvId(conv.conversation_id || conv.id);
                    }}
                    key={conv.conversation_id || conv.id}
                    className={`flex items-center cursor-pointer gap-3 p-3 border-b hover:bg-amber-light ${isActive ? "bg-amber-100" : ""}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                      <img src={conv.other_user_avatar || conv.avatar} alt={otherName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-primary truncate">{otherName}</p>
                      <p className="text-xs text-text truncate">{lastMessage}</p>
                    </div>
                    <div className="text-sm text-text">
                      {conv.last_message_at && <div className="text-[12px] hidden md:block">{new Date(conv.last_message_at).toLocaleString()}</div>}
                      {unread > 0 && <div className="w-5 h-5 flex items-center justify-center rounded-full bg-amber text-white text-xs">{unread}</div>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* messages area */}
        <div className="lg:col-span-2 flex flex-col min-h-[60vh]">
          <header className="flex justify-between items-center p-5 md:border-b border-1 border-gray-200 dark:border-white">
            {activeConvId ? (
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  {/* try to show other party avatar from selected inbox item */}
                  <img
                    src={(inbox.find((c) => (c.conversation_id || c.id) === activeConvId)?.other_user_avatar) || ""}
                    alt="other"
                    className="w-full h-full object-cover"
                  />
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
            {loadingMessages ? (
              <div>Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center text-text">No messages yet</div>
            ) : (
              messages.map((m) => {
                const mine = m.sender_id === userId;
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

          {/* footer send */}
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
