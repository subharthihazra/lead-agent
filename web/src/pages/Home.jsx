import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import api from "../api";

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    source: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function startSession() {
    try {
      setSubmitting(true);
      const res = await api.post("/session/start", form);

      navigate(`/chat/${res.data.sessionId}`);
    } catch (err) {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md space-y-6">
        <h3 className="text-2xl font-semibold text-stone-800 text-center">
          Start a New Lead Session
        </h3>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            startSession();
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="mb-1 text-sm font-medium text-stone-600"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter name (e.g. Tim Cook)"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="phone"
                className="mb-1 text-sm font-medium text-stone-600"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="Enter phone (e.g. 1234XXXXXX)"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="source"
                className="mb-1 text-sm font-medium text-stone-600"
              >
                Source
              </label>
              <input
                id="source"
                type="text"
                placeholder="Enter source (e.g. Facebook, X, Website etc.)"
                required
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="message"
                className="mb-1 text-sm font-medium text-stone-600"
              >
                Message
              </label>
              <textarea
                id="message"
                placeholder="What's on your mind? ..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none h-24"
              />
            </div>
          </div>

          <div className="flex flex-row justify-end">
            <button
              disabled={submitting}
              className={`py-2 px-3.5 rounded-md w-fit flex place-items-center gap-2 transition-all ${
                submitting
                  ? "bg-stone-400 text-white cursor-not-allowed"
                  : "bg-stone-800 text-white hover:bg-stone-700"
              }`}
            >
              <div>Start</div>
              <FaArrowRight />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
