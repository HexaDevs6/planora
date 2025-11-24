import React, { useState, useEffect, useRef } from "react";
import {
   Mic,
   MicOff,
   Volume2,
   VolumeX,
   Loader2,
   MessageCircle,
   Trash2,
   Send,
   Keyboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
   textToSpeech,
   initializeElevenLabs,
} from "@/services/elevenLabsService";
import ChatEventCard from "./ChatEventCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const VoiceChat = ({ onSendMessage, isProcessing, messages, onClearChat }) => {
   const { t, i18n } = useTranslation();
   const currentLang = i18n.language;

   const [isListening, setIsListening] = useState(false);
   const [isSpeaking, setIsSpeaking] = useState(false);
   const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
   const [transcript, setTranscript] = useState("");
   const [isSpeechSupported, setIsSpeechSupported] = useState(true);
   const [speechEnabled, setSpeechEnabled] = useState(false);
   const [interimTranscript, setInterimTranscript] = useState("");
   const [elevenLabsReady, setElevenLabsReady] = useState(false);
   const [textInput, setTextInput] = useState("");
   const [inputMode, setInputMode] = useState("voice"); // 'voice' or 'text'

   const recognitionRef = useRef(null);
   const currentAudioRef = useRef(null);
   const messagesEndRef = useRef(null);
   const messagesContainerRef = useRef(null);
   const textInputRef = useRef(null);
   const finalTranscriptRef = useRef("");

   useEffect(() => {
      // Check for speech recognition support
      const SpeechRecognition =
         window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
         setIsSpeechSupported(false);
         console.error("Speech recognition not supported");
         return;
      }

      // Initialize speech recognition
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      // Set language based on current app language
      recognitionRef.current.lang = currentLang === "ar" ? "ar-EG" : "en-US";

      recognitionRef.current.onstart = () => {
         setIsListening(true);
         setTranscript("");
         setInterimTranscript("");
         finalTranscriptRef.current = "";
      };

      recognitionRef.current.onresult = (event) => {
         let interim = "";
         let final = "";

         for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
               final += transcript;
            } else {
               interim += transcript;
            }
         }

         setInterimTranscript(interim);
         if (final) {
            finalTranscriptRef.current = final;
            setTranscript(final);
         }
      };

      recognitionRef.current.onend = () => {
         setIsListening(false);
         setInterimTranscript("");

         // If we have a transcript, send it
         if (finalTranscriptRef.current.trim()) {
            console.log(
               "📤 Auto-submitting transcript:",
               finalTranscriptRef.current
            );
            handleSendTranscript(finalTranscriptRef.current);
            setTranscript("");
            finalTranscriptRef.current = "";
         }
      };

      recognitionRef.current.onerror = (event) => {
         console.error("Speech recognition error:", event.error);
         setIsListening(false);
         setInterimTranscript("");
      };

      return () => {
         if (recognitionRef.current) {
            recognitionRef.current.stop();
         }
         // Stop any ongoing audio
         if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current = null;
         }
      };
   }, [transcript]);

   // Update speech recognition language when language changes
   useEffect(() => {
      if (recognitionRef.current) {
         recognitionRef.current.lang = currentLang === "ar" ? "ar-EG" : "en-US";
      }
   }, [currentLang]);

   // Initialize ElevenLabs TTS
   useEffect(() => {
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
      if (apiKey) {
         const success = initializeElevenLabs(apiKey);
         setElevenLabsReady(success);
         console.log(
            "🔊 ElevenLabs TTS:",
            success ? "Initialized ✅" : "Failed to initialize ❌"
         );
      } else {
         console.warn(
            "⚠️ VITE_ELEVENLABS_API_KEY not found - Voice responses disabled"
         );
         setElevenLabsReady(false);
      }

      return () => {
         // Stop any playing audio on unmount
         if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current = null;
         }
      };
   }, []);

   // Auto-scroll to bottom when new messages arrive
   useEffect(() => {
      scrollToBottom();
   }, [messages, isSpeaking, isGeneratingSpeech, isListening]);

   const scrollToBottom = () => {
      if (messagesContainerRef.current) {
         messagesContainerRef.current.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: "smooth",
         });
      }
   };

   const handleSendTranscript = (text) => {
      if (text.trim() && onSendMessage) {
         onSendMessage(text.trim());
      }
   };

   const handleTextSubmit = (e) => {
      e?.preventDefault();
      if (textInput.trim() && !isProcessing) {
         // Send message
         onSendMessage(textInput.trim());

         // Clear input
         setTextInput("");
      }
   };

   const toggleInputMode = () => {
      const newMode = inputMode === "voice" ? "text" : "voice";
      setInputMode(newMode);

      // Focus text input when switching to text mode
      if (newMode === "text" && textInputRef.current) {
         setTimeout(() => textInputRef.current.focus(), 100);
      }

      // Stop any ongoing voice activity when switching
      if (isListening) {
         stopListening();
      }
   };

   const startListening = () => {
      if (!isSpeechSupported) {
         alert(
            t("planoraAi.voiceChat.speechNotSupported") +
               ". Please use Chrome, Edge, or Safari."
         );
         return;
      }

      // Stop any ongoing audio
      stopSpeaking();

      try {
         recognitionRef.current.start();
      } catch (error) {
         console.error("Error starting recognition:", error);
      }
   };

   const stopListening = () => {
      if (recognitionRef.current) {
         recognitionRef.current.stop();
      }
   };

   const speakText = async (text) => {
      if (!speechEnabled || !elevenLabsReady) {
         if (!elevenLabsReady && speechEnabled) {
            console.warn("⚠️ ElevenLabs not initialized - cannot speak");
         }
         return;
      }

      // Stop any currently playing audio
      if (currentAudioRef.current) {
         currentAudioRef.current.pause();
         currentAudioRef.current = null;
      }

      try {
         // Show generating speech loading
         setIsGeneratingSpeech(true);
         console.log("🗣️ Generating speech with ElevenLabs:", {
            language: currentLang,
            text: text.substring(0, 50) + "...",
         });

         // Generate speech with ElevenLabs
         const audioBlob = await textToSpeech(text, currentLang);

         // Speech generated, now playing
         setIsGeneratingSpeech(false);
         setIsSpeaking(true);

         // Create audio element and play
         const audioUrl = URL.createObjectURL(audioBlob);
         const audio = new Audio(audioUrl);
         currentAudioRef.current = audio;

         audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            setIsSpeaking(false);
            currentAudioRef.current = null;
            console.log("✅ Speech completed");
         };

         audio.onerror = (error) => {
            console.error("❌ Audio playback error:", error);
            URL.revokeObjectURL(audioUrl);
            setIsSpeaking(false);
            currentAudioRef.current = null;
         };

         await audio.play();
      } catch (error) {
         console.error("❌ ElevenLabs TTS Error:", error);
         setIsGeneratingSpeech(false);
         setIsSpeaking(false);

         // Handle specific errors
         if (error.name === "NotAllowedError") {
            console.warn(
               "⚠️ Audio playback blocked by browser autoplay policy. Speech will work after user interaction (click mic, type, etc.)."
            );
         } else if (error.message.includes("quota")) {
            console.error(
               "⚠️ ElevenLabs quota exceeded. Voice responses temporarily disabled."
            );
         }
      }
   };

   const stopSpeaking = () => {
      if (currentAudioRef.current) {
         currentAudioRef.current.pause();
         currentAudioRef.current = null;
      }
      setIsSpeaking(false);
      setIsGeneratingSpeech(false);
   };

   const toggleSpeech = () => {
      if (isSpeaking) {
         stopSpeaking();
      }
      setSpeechEnabled(!speechEnabled);
   };

   // Auto-speak AI responses
   useEffect(() => {
      if (messages.length > 0) {
         const lastMessage = messages[messages.length - 1];
         if (lastMessage.role === "assistant" && speechEnabled) {
            speakText(lastMessage.content);
         }
      }
   }, [messages, speechEnabled]);

   return (
      <div className="flex flex-col h-full">
         {/* Messages Area */}
         <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
         >
            <AnimatePresence mode="popLayout">
               {messages.length === 0 ? (
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="text-center text-muted-foreground py-12"
                  >
                     <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                     <h3 className="text-xl font-semibold mb-2">
                        {t("planoraAi.voiceChat.startConversation")}
                     </h3>
                     <p className="text-sm">
                        {t("planoraAi.voiceChat.tapMic")}
                     </p>
                  </motion.div>
               ) : (
                  messages.map((message, index) => (
                     <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${
                           message.role === "user"
                              ? "justify-end"
                              : "justify-start"
                        }`}
                     >
                        <div
                           className={`max-w-[80%] ${
                              message.role === "user" ? "" : "w-full"
                           }`}
                        >
                           <div
                              className={`rounded-2xl px-5 py-3 border shadow-lg ${
                                 message.role === "user"
                                    ? "bg-gradient-amber border-amber-dark text-violet-dark"
                                    : "bg-gradient-violet border-violet-light text-white"
                              }`}
                           >
                              <p className="text-sm leading-relaxed">
                                 {message.content}
                              </p>
                                 {message.events &&
                                    message.role === "assistant" && (
                                       <div className="space-y-2">
                                          {message.events
                                             .slice(0, 3)
                                             .map((event, eventIndex) => (
                                                <ChatEventCard
                                                   key={event.id || eventIndex}
                                                   event={event}
                                                   lang={currentLang}
                                                />
                                             ))}
                                       </div>
                                    )}
                              {message.isRestricted && (
                                 <p className="text-xs mt-2 opacity-75 italic">
											{lang === ar ? "(هذا الاستعلام خارج نطاق بلانورا!)" : "(This query is outside Planora's scope)"}
                                 </p>
                              )}
                           </div>
                        </div>
                     </motion.div>
                  ))
               )}
            </AnimatePresence>

            {/* Processing Indicator */}
            {isProcessing && (
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
               >
                  <div className="bg-card border border-border rounded-2xl px-5 py-3">
                     <div className="flex items-center gap-2 text-muted-foreground">
                        {[...Array(5)].map((_, i) => (
                           <motion.div
                              key={i}
                              className="w-1 bg-amber rounded-full"
                              animate={{
                                 height: [8, 24, 8],
                              }}
                              transition={{
                                 duration: 0.6,
                                 repeat: Infinity,
                                 ease: "easeInOut",
                                 delay: (4 - i) * 0.1,
                              }}
                           />
                        ))}
                     </div>
                  </div>
               </motion.div>
            )}

            {/* Generating Speech Indicator */}
            {isGeneratingSpeech && (
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex justify-center my-4"
               >
                  <div className="relative bg-violet/20 backdrop-blur border-2 border-violet rounded-2xl px-6 py-3 shadow-lg shadow-violet/30">
                     <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        <span className="text-sm font-medium text-primary">
                           {currentLang === "ar"
                              ? "جاري تحضير الصوت..."
                              : "Generating voice..."}
                        </span>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* Speaking Indicator - Awesome Animation */}
            {isSpeaking && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center my-4"
               >
                  <div className="relative bg-gradient-amber/20 backdrop-blur border-2 border-amber rounded-2xl px-6 py-4 shadow-lg shadow-amber/30 overflow-hidden">
                     {/* Animated Background Pulse */}
                     <motion.div
                        className="absolute inset-0 bg-amber/10 rounded-2xl"
                        animate={{
                           opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                           duration: 2,
                           repeat: Infinity,
                           ease: "easeInOut",
                        }}
                     />

                     {/* Content */}
                     <div className="relative z-10 flex items-center gap-4">
                        {/* Animated Waveform Bars (Left) */}
                        <div className="flex items-center gap-1 h-6">
                           {[...Array(5)].map((_, i) => (
                              <motion.div
                                 key={i}
                                 className="w-1 bg-amber rounded-full"
                                 animate={{
                                    height: [8, 24, 8],
                                 }}
                                 transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.1,
                                 }}
                              />
                           ))}
                        </div>

                        {/* Speaking Text with Pulsing Icon */}
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-medium text-amber">
                              {currentLang === "ar"
                                 ? "بلانورا تتحدث..."
                                 : "Planora is speaking..."}
                           </span>
                        </div>

                        {/* Animated Waveform Bars (Right) */}
                        <div className="flex items-center gap-1">
                           {[...Array(5)].map((_, i) => (
                              <motion.div
                                 key={i}
                                 className="w-1 bg-amber rounded-full"
                                 animate={{
                                    height: [8, 24, 8],
                                 }}
                                 transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: (4 - i) * 0.1,
                                 }}
                              />
                           ))}
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* Live Transcript */}
            {isListening && (transcript || interimTranscript) && (
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
               >
                  <div className="max-w-[80%] rounded-2xl px-5 py-3 bg-amber/20 border border-amber">
                     <p className="text-sm">
                        {transcript || interimTranscript}
                        <span className="inline-block w-1 h-4 ml-1 bg-amber animate-pulse"></span>
                     </p>
                  </div>
               </motion.div>
            )}

            <div ref={messagesEndRef} />
         </div>

         {/* Controls Area */}
         <div className="border-t border-border p-4 bg-card/50 backdrop-blur">
            {inputMode === "voice" ? (
               // Voice Mode Controls
               <>
                  <div className="flex items-center justify-center gap-4">
                     {/* Clear Chat Button */}
                     {messages.length > 0 && (
                        <motion.button
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }}
                           onClick={onClearChat}
                           className="p-3 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                           title={t("planoraAi.voiceChat.clearChat")}
                        >
                           <Trash2 className="w-5 h-5" />
                        </motion.button>
                     )}

                     {/* Main Mic Button */}
                     <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={isListening ? stopListening : startListening}
                        disabled={isProcessing || !isSpeechSupported}
                        className={`relative p-5 rounded-full transition-all duration-300 ${
                           isListening
                              ? "bg-destructive text-white shadow-lg shadow-destructive/50"
                              : "bg-gradient-amber text-violet-dark shadow-lg shadow-amber/50"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        animate={isSpeaking ? { scale: [1, 1.05, 1] } : {}}
                        transition={
                           isSpeaking ? { duration: 1.5, repeat: Infinity } : {}
                        }
                     >
                        {isListening ? (
                           <>
                              <MicOff />
                              <motion.div
                                 className="absolute inset-0 rounded-full border-4 border-white"
                                 animate={{ scale: [1, 1.2, 1] }}
                                 transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                 }}
                              />
                           </>
                        ) : (
                           <Mic />
                        )}

                        {/* Pulsing ring when speaking */}
                        {isSpeaking && (
                           <motion.div
                              className="absolute inset-0 rounded-full border-4 border-amber"
                              animate={{
                                 scale: [1, 1.3, 1],
                                 opacity: [1, 0, 1],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                           />
                        )}
                     </motion.button>

                     {/* Speech Toggle Button */}
                     <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleSpeech}
                        className={`p-3 rounded-full transition-colors ${
                           speechEnabled
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                        title={
                           speechEnabled
                              ? t("planoraAi.voiceChat.disableVoice")
                              : t("planoraAi.voiceChat.enableVoice")
                        }
                     >
                        {speechEnabled ? (
                           isSpeaking ? (
                              <motion.div
                                 animate={{ scale: [1, 1.2, 1] }}
                                 transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                 }}
                              >
                                 <Volume2 className="w-5 h-5" />
                              </motion.div>
                           ) : (
                              <Volume2 className="w-5 h-5" />
                           )
                        ) : (
                           <VolumeX className="w-5 h-5" />
                        )}
                     </motion.button>
                  </div>

                  {/* Status Text */}
                  <div className="text-center mt-4">
                     {!isSpeechSupported ? (
                        <p className="text-sm text-destructive">
                           {t("planoraAi.voiceChat.speechNotSupported")}
                        </p>
                     ) : isListening ? (
                        <motion.p
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           className="text-sm text-foreground font-medium"
                        >
                           {t("planoraAi.voiceChat.listening")}
                        </motion.p>
                     ) : isProcessing ? (
                        <p className="text-sm text-muted-foreground">
                           {t("planoraAi.voiceChat.processing")}
                        </p>
                     ) : (
                        <p className="text-sm text-muted-foreground">
                           {t("planoraAi.voiceChat.tapToStart")}
                        </p>
                     )}
                  </div>
               </>
            ) : (
               // Text Mode Controls
               <form onSubmit={handleTextSubmit} className="space-y-4">
                  <div className="flex items-center gap-3">
                     {/* Clear Chat Button */}
                     {messages.length > 0 && (
                        <motion.button
                           type="button"
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }}
                           onClick={onClearChat}
                           className="p-3 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex-shrink-0"
                           title={t("planoraAi.voiceChat.clearChat")}
                        >
                           <Trash2 className="w-5 h-5" />
                        </motion.button>
                     )}

                     {/* Text Input */}
                     <div className="flex-1 relative">
                        <Input
                           ref={textInputRef}
                           type="text"
                           value={textInput}
                           onChange={(e) => setTextInput(e.target.value)}
                           placeholder={
                              currentLang === "ar"
                                 ? "اكتب رسالتك هنا..."
                                 : "Type your message..."
                           }
                           disabled={isProcessing}
                           className={`w-full`}
                           dir={currentLang === "ar" ? "rtl" : "ltr"}
                        />
                     </div>

                     {/* Send Button */}
                     <Button
                        variant="amber"
                        type="submit"
                        disabled={!textInput.trim() || isProcessing}
                        className="disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                     >
                        {isProcessing ? (
                           <Loader2 className="animate-spin" />
                        ) : (
                           <Send className="" />
                        )}
                     </Button>

                     {/* Speech Toggle Button */}
                     <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleSpeech}
                        className={`p-3 rounded-full transition-colors flex-shrink-0 ${
                           speechEnabled
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                        title={
                           speechEnabled
                              ? t("planoraAi.voiceChat.disableVoice")
                              : t("planoraAi.voiceChat.enableVoice")
                        }
                     >
                        {speechEnabled ? (
                           isSpeaking ? (
                              <motion.div
                                 animate={{ scale: [1, 1.2, 1] }}
                                 transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                 }}
                              >
                                 <Volume2 className="w-5 h-5" />
                              </motion.div>
                           ) : (
                              <Volume2 className="w-5 h-5" />
                           )
                        ) : (
                           <VolumeX className="w-5 h-5" />
                        )}
                     </motion.button>
                  </div>
               </form>
            )}

            {/* Mode Toggle Button */}
            <div className="flex justify-center mt-4">
               <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleInputMode}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm font-medium"
               >
                  {inputMode === "voice" ? (
                     <>
                        <Keyboard className="w-4 h-4" />
                        <span>
                           {currentLang === "ar"
                              ? "التبديل إلى الكتابة"
                              : "Switch to Text"}
                        </span>
                     </>
                  ) : (
                     <>
                        <Mic className="w-4 h-4" />
                        <span>
                           {currentLang === "ar"
                              ? "التبديل إلى الصوت"
                              : "Switch to Voice"}
                        </span>
                     </>
                  )}
               </motion.button>
            </div>
         </div>
      </div>
   );
};

export default VoiceChat;
