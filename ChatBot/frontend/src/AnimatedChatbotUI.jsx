import { useState } from "react";
import { motion } from "framer-motion";
import { SendHorizonal, Bot, User, Sparkles } from "lucide-react";

export default function AnimatedChatbotUI() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = {
      role: "user",
      content: message,
    };

    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      const botMsg = {
        role: "assistant",
        content: data.reply,
      };

      setChat((prev) => [...prev, botMsg]);

   
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {});
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden flex items-center justify-center relative">
      {/* Animated gradient blobs */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 60, 0],
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30"
      />

      <motion.div
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 100, -60, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-30"
      />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-3xl h-[85vh] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{ perspective: 1000 }}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 p-3 rounded-2xl shadow-lg"
            >
              <Bot className="text-white" />
            </motion.div>

            <div>
              <h1 className="text-white font-bold text-xl tracking-wide">
                AI Assistant
              </h1>
              <p className="text-sm text-gray-300 flex items-center gap-1">
                <Sparkles size={14} /> Online 
              </p>
            </div>
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 [&::-webkit-scrollbar]:hidden">
          {chat.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`flex items-start gap-3 max-w-[75%] ${
                  msg.role === "user"
                    ? "flex-row-reverse"
                    : "flex-row"
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={`p-2 rounded-xl ${
                    msg.role === "user"
                      ? "bg-blue-500"
                      : "bg-gradient-to-r from-purple-500 to-cyan-500"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="text-white w-4 h-4" />
                  ) : (
                    <Bot className="text-white w-4 h-4" />
                  )}
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className={`px-4 py-3 rounded-2xl text-white text-sm shadow-xl backdrop-blur-md ${
                    msg.role === "user"
                      ? "bg-blue-500"
                      : "bg-white/10"
                  }`}
                >
                  {msg.content}
                </motion.div>
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-300 text-sm"
            >
              AI is typing...
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="p-5 border-t border-white/20 flex gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Ask anything..."
            className="flex-1 px-5 py-3 rounded-2xl bg-white/10 text-white placeholder-gray-300 outline-none backdrop-blur-md"
          />

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center justify-center"
          >
            <SendHorizonal size={18} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
