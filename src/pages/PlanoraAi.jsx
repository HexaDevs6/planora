import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle, Settings, Info } from "lucide-react";
import VoiceChat from "@/components/VoiceChat";
import {
   initializeGemini,
   sendMessage,
} from "../services/geminiService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const PlanoraAi = () => {
   const { t, i18n } = useTranslation();
   const currentLang = i18n.language;

   const [messages, setMessages] = useState([]);
   const [isProcessing, setIsProcessing] = useState(false);
   const [isInitialized, setIsInitialized] = useState(false);
   const [apiKeyMissing, setApiKeyMissing] = useState(false);
   const [showInfo, setShowInfo] = useState(false);

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
         const response = await sendMessage(userMessage, messages, currentLang);

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

   // Show error screen if API key is missing
   if (apiKeyMissing) {
      return (
         <div className="min-h-screen bg-background flex items-center justify-center p-4 p-20">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="max-w-2xl w-full"
            >
               <div className="bg-card border-2 border-destructive rounded-2xl p-8 shadow-xl">
                  <div className="flex items-center justify-center mb-6">
                     <div className="relative">
                        <AlertCircle className="w-20 h-20 text-destructive" />
                     </div>
                  </div>

                  <h1 className="text-3xl font-bold text-center mb-2 text-destructive">
                     {currentLang === "ar"
                        ? "مفتاح API مفقود"
                        : "API Key Missing"}
                  </h1>
                  <p className="text-center text-muted-foreground mb-6">
                     {currentLang === "ar"
                        ? "يرجى إعداد مفتاح Gemini API في ملف .env.local"
                        : "Please configure Gemini API Key in .env.local file"}
                  </p>

                  <div className="bg-muted rounded-lg p-6 mb-6">
                     <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-amber" />
                        {currentLang === "ar"
                           ? "خطوات الإعداد:"
                           : "Setup Instructions:"}
                     </h3>

                     <ol className="space-y-3 text-sm">
                        <li className="flex gap-3">
                           <span className="font-bold text-amber">1.</span>
                           <div>
                              {currentLang === "ar"
                                 ? "احصل على مفتاح API من"
                                 : "Get your API key from"}{" "}
                              <a
                                 href="https://makersuite.google.com/app/apikey"
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-amber hover:underline font-medium"
                              >
                                 Google AI Studio
                              </a>
                           </div>
                        </li>

                        <li className="flex gap-3">
                           <span className="font-bold text-amber">2.</span>
                           <div>
                              {currentLang === "ar"
                                 ? "أنشئ ملف .env.local في المجلد الجذري للمشروع"
                                 : "Create a .env.local file in the project root directory"}
                           </div>
                        </li>

                        <li className="flex gap-3">
                           <span className="font-bold text-amber">3.</span>
                           <div>
                              {currentLang === "ar"
                                 ? "أضف السطر التالي إلى الملف:"
                                 : "Add this line to the file:"}
                              <div className="mt-2 p-3 bg-background rounded font-mono text-xs">
                                 VITE_GEMINI_API_KEY=your_api_key_here
                              </div>
                           </div>
                        </li>

                        <li className="flex gap-3">
                           <span className="font-bold text-amber">4.</span>
                           <div>
                              {currentLang === "ar"
                                 ? "أعد تشغيل خادم التطوير:"
                                 : "Restart the development server:"}
                              <div className="mt-2 p-3 bg-background rounded font-mono text-xs">
                                 npm run dev
                              </div>
                           </div>
                        </li>
                     </ol>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-amber/10 border border-amber/30 rounded-lg">
                     <Info className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" />
                     <p className="text-sm text-muted-foreground">
                        {currentLang === "ar"
                           ? "ملف .env.local موجود في .gitignore ولن يتم رفعه إلى Git. احتفظ بمفتاح API الخاص بك آمناً!"
                           : "The .env.local file is in .gitignore and will not be committed to Git. Keep your API key secure!"}
                     </p>
                  </div>
               </div>
            </motion.div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-background ">
         {/* Header */}
         <div className="border-b border-border bg-card/50 backdrop-blur">
            <div className="container mx-auto px-4 py-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                           duration: 20,
                           repeat: Infinity,
                           ease: "linear",
                        }}
                     >
                        <Sparkles className="w-8 h-8 text-amber" />
                     </motion.div>
                     <div>
                        <h1 className="text-2xl font-bold text-gradient-amber">
                           {t("planoraAi.title")}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                           {t("planoraAi.subtitle")}
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center gap-2">
                     <button
                        onClick={() => setShowInfo(!showInfo)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title={t("common.buttons.info") || "Information"}
                     >
                        <Info className="w-5 h-5" />
                     </button>
                  </div>
               </div>

               {/* Info Panel */}
               {showInfo && (
                  <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: "auto" }}
                     exit={{ opacity: 0, height: 0 }}
                     className="mt-4 p-4 bg-muted rounded-lg"
                  >
                     <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                           <h3 className="font-semibold mb-2 text-amber">
                              {t("planoraAi.info.whatICanHelp")}
                           </h3>
                           <ul className="space-y-1 text-muted-foreground">
                              <li>• {t("planoraAi.info.help1")}</li>
                              <li>• {t("planoraAi.info.help2")}</li>
                              <li>• {t("planoraAi.info.help3")}</li>
                              <li>• {t("planoraAi.info.help4")}</li>
                              <li>• {t("planoraAi.info.help5")}</li>
                           </ul>
                        </div>
                        <div>
                           <h3 className="font-semibold mb-2 text-violet">
                              {t("planoraAi.info.howToUse")}
                           </h3>
                           <ul className="space-y-1 text-muted-foreground">
                              <li>• {t("planoraAi.info.usage1")}</li>
                              <li>• {t("planoraAi.info.usage2")}</li>
                              <li>• {t("planoraAi.info.usage3")}</li>
                              <li>• {t("planoraAi.info.usage4")}</li>
                           </ul>
                        </div>
                     </div>
                  </motion.div>
               )}
            </div>
         </div>

         {/* Main Chat Area */}
         <div className="container mx-auto px-4 py-6">
            <div className="max-w-4xl mx-auto">
               <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden h-[calc(100vh-200px)]">
                  <VoiceChat
                     onSendMessage={handleSendMessage}
                     isProcessing={isProcessing}
                     messages={messages}
                     onClearChat={handleClearChat}
                  />
               </div>
            </div>
         </div>

         {/* Footer Info */}
         <div className="container mx-auto px-4 pb-6">
            <div className="max-w-4xl mx-auto">
               <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  <p>{t("planoraAi.footer.scopeNote")}</p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default PlanoraAi;
