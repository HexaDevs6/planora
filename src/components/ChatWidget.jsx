import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import PlanoraAi from "@/pages/PlanoraAi";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-50  text-white rounded-full p-4 shadow-lg flex items-center justify-center"
      >
        <img
          src="/favPlanora.svg"
          alt="Chat Icon"
          className="w-9 h-9"
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
className="fixed bottom-16 right-4 sm:bottom-20 sm:right-6 z-50 
  w-[90%] max-w-[380px] h-[70vh] sm:h-[520px] 
  bg-white dark:bg-background border border-border shadow-2xl 
  rounded-2xl overflow-hidden flex flex-col"          >
            <div className="flex items-center justify-between px-4 bg-amber text-white">
              <h3 className="text-sm font-semibold">Planora AI Assistant</h3>
              <button
                onClick={() => setOpen(false)}
                className="hover:bg-violet-700 p-1 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="h-full">
                <PlanoraAi /> 
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
