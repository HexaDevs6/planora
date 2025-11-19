import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Sparkle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import VoiceChat from "./VoiceChat";
import { initializeGemini, sendMessage } from "@/services/geminiService";
import { MissingApiKeyScreen } from "@/pages/PlanoraAi";
import AiPlanoraWidget from "./AiPlanoraWidget";
import { useDirection } from "@/hooks/useDirection";

const userData = {
   name: "Mahmoud",
   userType: "client",
   interests: ["Music Concerts", "Tech Conferences"],
   eventPreferences:
      "I'm a frontend developer and I love tech events and music concerts",
   phone: "+20123456789",
};

const ChatWidget = () => {
   const { t, i18n } = useTranslation();
   const currentLang = i18n.language;
   const { lang } = useDirection();
   const [open, setOpen] = useState(false);
   const [isProcessing, setIsProcessing] = useState(false);
   const [messages, setMessages] = useState([]);
   const [isInitialized, setIsInitialized] = useState(false);

   const [apiKeyMissing, setApiKeyMissing] = useState(false);

   const handleSendMessage = async (userMessage) => {
      if (!isInitialized) {
         toast.error(t("planoraAi.toast.requireInit"));
         return;
      }

      // Add user message to chat
      const newUserMessage = {
         role: "user",
         content: userMessage,
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setIsProcessing(true);

      try {
         // Send to Gemini AI with current language
         const response = await sendMessage(
            userMessage,
            messages,
            currentLang,
            userData
         );

         // Add AI response to chat
         const newAIMessage = {
            role: "assistant",
            content: response.text,
            isRestricted: response.isRestricted,
         };

         setMessages((prev) => [...prev, newAIMessage]);

         if (response.isRestricted) {
            toast.warning(t("planoraAi.toast.outsideScope"));
         }
      } catch (error) {
         console.error("Error sending message:", error);
         toast.error(t("planoraAi.toast.errorResponse"));

         // Add error message
         const errorMsg =
            currentLang === "ar"
               ? "أعتذر، لكن واجهت خطأ. يرجى إعادة طرح سؤالك مرة أخرى."
               : "I apologize, but I encountered an error. Please try asking your question again.";
         setMessages((prev) => [
            ...prev,
            {
               role: "assistant",
               content: errorMsg,
            },
         ]);
      } finally {
         setIsProcessing(false);
      }
   };

   const handleClearChat = () => {
      const clearMsg =
         currentLang === "ar"
            ? "تم مسح المحادثة! كيف يمكنني مساعدتك في فعاليات بلانورا اليوم؟"
            : "Chat cleared! How can I help you with Planora events today?";
      setMessages([
         {
            role: "assistant",
            content: clearMsg,
         },
      ]);
      toast.success(t("planoraAi.toast.chatCleared"));
   };

   useEffect(() => {
      // Get API key from environment variable (required)
      const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!envApiKey) {
         setApiKeyMissing(true);
         console.error("❌ VITE_GEMINI_API_KEY not found in .env.local file");
         return;
      }

      // Initialize Gemini AI
      const success = initializeGemini(envApiKey, currentLang);
      if (success) {
         setIsInitialized(true);
         // toast.success(t('planoraAi.toast.ready'));

         // Send welcome message
         setMessages([
            {
               role: "assistant",
               content: t("planoraAi.welcomeMessage"),
            },
         ]);
      } else {
         toast.error(t("planoraAi.toast.initError"));
         setApiKeyMissing(true);
      }
   }, []);

   return (
      <>
         {/* <motion.button
            onClick={() => setOpen(!open)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="fixed bottom-6 bg-gradient-amber right-6 z-50 size-14  text-white rounded-full p-4 shadow-xl flex items-center justify-center"
         >
            <Sparkles className="text-violet" />
         </motion.button> */}

            <AiPlanoraWidget open={open} setOpen={setOpen} />


         <AnimatePresence>
            {open && (
               <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className={`fixed bottom-20 ${lang === "ar" ? "left-4" : "right-4"} sm:bottom-20 sm:${lang === "ar" ? "left-6" : "right-6"} z-50 
  w-[90%] max-w-[480px] h-[80vh] sm:h-[520px] 
  bg-background/50 backdrop-blur-md border border-border shadow-2xl 
  rounded-2xl overflow-hidden flex flex-col`}
               >
                  <div className="flex items-center py-2 justify-between px-4 bg-amber/50 text-white">
                     <h3 className="text-sm font-semibold text-foreground">
                        {t("planoraAi.title")}
                     </h3>
                     <button
                        onClick={() => setOpen(false)}
                        className="hover:bg-violet/20 p-1 rounded-full transition"
                     >
                        <X className="w-4 h-4" />
                     </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                     <div className="h-full">
                        {apiKeyMissing ? (
                           <MissingApiKeyScreen currentLang={currentLang} />
                        ) : (
                           <VoiceChat
                              onSendMessage={handleSendMessage}
                              isProcessing={isProcessing}
                              messages={messages}
                              onClearChat={handleClearChat}
                           />
                        )}
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </>
   );
};

export default ChatWidget;
