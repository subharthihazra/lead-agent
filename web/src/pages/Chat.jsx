import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoSend } from "react-icons/io5";
import api from "../api";

export default function Chat() {
  const { sessionId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const chatEndRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) return;

    async function fetchChat() {
      try {
        const { data } = await api.get(`/session/${sessionId}`);
        setMessages(data.messages || []);
        if (data.exited) setChatEnded(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchChat();
  }, [sessionId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || isSending) return;

    const userMsg = { role: "user", content: input };
    const placeholder = { role: "agent", content: "..." };

    setMessages((prev) => [...prev, userMsg, placeholder]);
    setInput("");
    setIsSending(true);

    try {
      const res = await api.post(`/session/${sessionId}/message`, {
        message: userMsg.content,
      });

      // Replace the "..." placeholder with actual reply
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "agent",
          content: res.data.reply,
        };
        return updated;
      });
      if (res.data.exited) setChatEnded(true);
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "agent",
          content: "[Error fetching response]",
        };
        return updated;
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-shrink-0 bg-white p-4 shadow-md">
        <h2 className="text-lg font-semibold text-gray-800">Chat with us</h2>
      </div>
      <div className="flex justify-center h-full overflow-y-auto">
        <div className="flex-1 px-4 py-2 space-y-2 max-w-3xl my-2">
          {loading ? (
            <div className="text-center text-gray-500 mt-4">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center mt-4">{error}</div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    msg.role === "user"
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none shadow"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          <div className="h-2" ref={chatEndRef}></div>
        </div>
      </div>

      <div className=" bg-white border-t w-full">
        <div className="p-4 max-w-3xl mx-auto">
          {chatEnded || !!error ? (
            <div className="flex flex-col items-center gap-2">
              <p className="px-6 py-2 rounded-full text-sm">
                {chatEnded ? "Thank you!" : "Error!"}
              </p>
              <div
                to="/"
                className="text-green-600 underline text-sm cursor-pointer"
                onClick={() => navigate("/")}
              >
                Go to Home
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message"
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring focus:ring-green-400"
                disabled={isSending}
              />
              <button
                onClick={sendMessage}
                disabled={isSending}
                className={`p-3 rounded-full text-lg text-white ${
                  isSending ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                <IoSend />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
