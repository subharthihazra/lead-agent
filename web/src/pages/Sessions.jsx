import { useEffect, useState } from "react";
import api from "../api";
import { IoMdClose } from "react-icons/io";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [popupLoading, setPopupLoading] = useState(false);

  useEffect(() => {
    api
      .get("/sessions")
      .then((res) => setSessions(res.data))
      .catch(() => setError("❌ Failed to load sessions."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setPopupLoading(true);
    api
      .get(`/session/${selected.sessionId}`)
      .then((res) => {
        setTranscript(res.data.messages || []);
      })
      .catch(() => {
        setTranscript([]);
      })
      .finally(() => setPopupLoading(false));
  }, [selected]);

  const statusBadge = (status) => {
    const base = "inline-block px-2 py-1 rounded text-xs font-semibold";
    switch (status) {
      case "Hot":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>🔥 Hot</span>
        );
      case "Cold":
        return (
          <span className={`${base} bg-blue-100 text-blue-700`}>❄️ Cold</span>
        );
      case "Invalid":
        return (
          <span className={`${base} bg-red-100 text-red-700`}>🚫 Invalid</span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-700`}>
            ⏳ Pending
          </span>
        );
    }
  };

  if (loading)
    return <div className="p-6 text-gray-500">Loading sessions...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        🧾 All Lead Sessions
      </h1>

      {sessions.length === 0 ? (
        <div className="text-gray-500">No sessions found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div
              key={session.sessionId}
              onClick={() => setSelected(session)}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg cursor-pointer"
            >
              <div className="mb-2 text-lg font-semibold text-gray-900">
                {session.lead.name}
              </div>
              <div className="text-sm text-gray-500 mb-2">
                {session.lead.source}
              </div>
              <div className="mb-2">
                {statusBadge(session.summary?.classification?.status)}
              </div>
              {session.summary?.metadata?.location && (
                <div className="text-sm text-gray-600">
                  📍 {session.summary.metadata.location}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-2 truncate">
                ID: {session.sessionId}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.4)] bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => {
            setSelected(null);
            setTranscript([]);
          }}
        >
          <div
            className="bg-white max-w-2xl w-full rounded-lg p-6 shadow-lg relative overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setSelected(null);
                setTranscript([]);
              }}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-lg cursor-pointer"
            >
              <IoMdClose />
            </button>
            <h2 className="text-xl font-semibold mb-2">{selected.lead.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{selected.lead.source}</p>

            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-2">📝 Summary</h3>
              <div className="space-y-1 text-sm text-gray-700">
                <div>
                  <strong>Status: </strong>
                  {selected.summary?.classification?.status || "N/A"}
                </div>
                <div>
                  <strong>Location: </strong>
                  {selected.summary?.metadata?.location || "Unknown"}
                </div>
                <div>
                  <strong>Product: </strong>
                  {selected.summary?.metadata?.product || "N/A"}
                </div>
                <div>
                  <strong>Budget: </strong>
                  {selected.summary?.metadata?.budget || "Not specified"}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">
                💬 Chat Transcript
              </h3>
              {popupLoading ? (
                <p className="text-gray-500 text-sm">Loading transcript...</p>
              ) : transcript.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {transcript.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.role === "agent" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 text-sm max-w-xs ${
                          msg.role === "agent"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No transcript available.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
