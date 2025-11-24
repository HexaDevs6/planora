import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
   getInbox,
   getMessages,
   sendMessage,
   subscribeToNewMessages,
   subscribeToInbox,
} from "@/lib/chatService";
import { Search, Triangle } from "lucide-react";
import avatarPlaceholderImg from "@/assets/user_placeholder2.png";
import { useDirection } from "@/hooks/useDirection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function MessagesPage() {
   const user = useSelector((state) => state.auth.user);
   const userId = user?.id;
   const { lang } = useDirection();
   const { t } = useTranslation();
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
            // Check if message already exists
            if (prev.some((m) => m.id === newMsg.id)) return prev;

            // Remove any temporary message with same content from same sender
            const withoutTemp = prev.filter(
               (m) =>
                  !(
                     m.id.toString().startsWith("temp-") &&
                     m.content === newMsg.content &&
                     m.sender_id === newMsg.sender_id
                  )
            );

            return [...withoutTemp, newMsg];
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
   const handleSend = useCallback(async () => {
      if (!text.trim() || !userId || !activeConvId) return;

      const messageContent = text.trim();
      const tempId = `temp-${Date.now()}`; // Temporary ID for optimistic update

      // Optimistic update - add message immediately
      const optimisticMessage = {
         id: tempId,
         conversation_id: activeConvId,
         sender_id: userId,
         content: messageContent,
         created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      setText("");

      // Scroll to bottom
      setTimeout(() => {
         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

      try {
         await sendMessage({
            conversation_id: activeConvId,
            sender_id: userId,
            content: messageContent,
         });
      } catch (err) {
         console.error("Send error:", err);
         // Remove optimistic message on error
         setMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
   }, [text, userId, activeConvId]);

   const filtered = inbox.filter((c) =>
      (c.other_user_name || c.name || "")
         .toLowerCase()
         .includes(searchTerm.toLowerCase())
   );

   return (
      <div className="container">
         <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
               <h1 className="text-3xl font-bold text-primary mb-2">
                  {lang === "ar" ? "الرسائل" : "Messages"}
               </h1>
               <p className="text-muted-foreground">
                  {lang === "ar"
                     ? "إدارة وتتبع جميع الرسائل في مكان واحد"
                     : "Manage and track all your messages in one place"}
               </p>
            </div>
         </header>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* RIGHT SIDE → Messages */}
            <div className="md:col-span-2 flex flex-col min-h-[60vh] border rounded-lg bg-background">
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
                     <p className="text-gray-500">
                        {lang === "ar"
                           ? "اختر محادثة..."
                           : "Select a conversation..."}
                     </p>
                  )}
               </header>

               <div className="flex-1 p-6 overflow-y-auto max-h-[70vh] space-y-3">
                  {loadingMessages ? (
                     <div className="text-center text-gray-500">
                        {t("common.loading")}
                     </div>
                  ) : (
                     messages.length === 0 ? (
                     <div className="text-center text-gray-500">
                        {t("common.messages.noMessages")}
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
                                 className={`p-3 rounded-lg max-w-[70%] relative ${
                                    mine
                                       ? "bg-primary text-background rounded-br-none"
                                       : "bg-gray-200 text-gray-800 rounded-bl-none"
                                 }`}
                              >
                                    {/* <Triangle
                                       className={`size-6 absolute bottom-0 ${
                                          mine ? "rotate-0 fill-amber stroke-amber right-0 translate-x-1/2" : "rotate-270 fill-gray-200 stroke-gray-200 left-0 -translate-x-1/2"
                                       }`}
                                    /> */}
                                 {m.content}
                              </div>
                           </div>
                        );
                     })
                  ))}

                  <div ref={messagesEndRef} />
               </div>

               {/* SEND MESSAGE */}
               <footer className="p-5 border-t flex gap-3 items-center">
                  <Input
                     type="text"
                     placeholder={t("common.messages.typeMessage")}
                     value={text}
                     onChange={(e) => setText(e.target.value)}
                     onKeyDown={(e) => e.key === "Enter" && handleSend()}
                     disabled={!activeConvId}
                     className="flex-1 bg-sidebar-content"
                  />
                  <Button
                     variant="amber"
                     onClick={handleSend}
                     disabled={!activeConvId}
                  >
                     {t("common.buttons.send")}
                  </Button>
               </footer>
            </div>
            {/* LEFT SIDE → Inbox */}
            <div className="md:col-span-1 border rounded-lg bg-background">
               <div className="p-5 flex items-center gap-3 border-b">
                  <Search size={18} />
                  <Input
                     type="search"
                     placeholder={t("common.messages.searchConversation")}
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="bg-sidebar-content"
                  />
               </div>

               <div className="overflow-y-auto max-h-[70vh]">
                  {loadingInbox ? (
                     <div className="p-4 text-center">
                        {t("common.loading")}
                     </div>
                  ) : inbox.length === 0 ? (
                     <div className="p-6 text-center">
                        <p>{t("common.messages.noConversations")}</p>
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
                                 setActiveConvId(
                                    conv.conversation_id || conv.id
                                 )
                              }
                              className={`flex items-center gap-3 p-3 cursor-pointer border-b hover:bg-amber-light/20 ${
                                 isActive ? "bg-amber/20" : ""
                              }`}
                           >
                              <div className="w-12 h-12 rounded-full bg-gray-200">
                                 <img
                                    src={
                                       conv.other_user_avatar ||
                                       avatarPlaceholderImg
                                    }
                                    alt={otherName}
                                    className="w-full h-full object-cover rounded-full"
                                 />
                              </div>

                              <div className="flex-1 min-w-0">
                                 <p className="font-bold truncate">
                                    {otherName}
                                 </p>
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
         </div>
      </div>
   );
}
