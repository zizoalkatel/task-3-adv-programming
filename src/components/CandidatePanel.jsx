import { useEffect, useState } from "react";
import { gatherCandidates } from "../lib/gatherCandidates";

// ==================================================
// 1. STUN SERVER CONFIGURATIONS
// ==================================================

const CONFIGS = {
  none: [],
  stun: [
    { urls: "stun:stun.l.google.com:19302" },
  ],
  wrong: [
    { urls: "stun:stun.invalid.example:3478" },
  ],
};

// ==================================================
// 2. CANDIDATE COLORS
// ==================================================

const COLORS = {
  host: "#d5f0ec",
  srflx: "#fdecc8",
  relay: "#fbd9cf",
};

// ==================================================
// 3. REACT COMPONENT
// ==================================================

export default function CandidatePanel() {
  const [configName, setConfigName] = useState("stun");
  const [candidates, setCandidates] = useState([]);
  const [state, setState] = useState("new");
  const [elapsed, setElapsed] = useState(null);

  const iceServers = CONFIGS[configName];

  // ==================================================
  // 4. USE EFFECT - START GATHERING
  // ==================================================

  useEffect(() => {
    setCandidates([]);
    setElapsed(null);
    setState("new");

    const t0 = performance.now();

    const stop = gatherCandidates({
      iceServers,
      onCandidate: (c) => setCandidates((prev) => [...prev, c]),
      onDone: () => setElapsed(Math.round(performance.now() - t0)),
      onStateChange: (s) => setState(s),
    });

    return stop;
  }, [iceServers]);

  // ==================================================
  // 5. SORT CANDIDATES BY PRIORITY (HIGHEST FIRST)
  // ==================================================

  const sorted = [...candidates].sort(
    (a, b) => b.priority - a.priority
  );

  // ==================================================
  // 6. RENDER THE USER INTERFACE
  // ==================================================

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "24px", fontFamily: "Arial, sans-serif", textAlign: "left" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "16px", color: "#111827" }}>
        ICE Candidate Panel
      </h1>

      {/* CONFIGURATION SWITCH */}
      <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
        <label htmlFor="config-select" style={{ fontWeight: "bold", color: "#374151" }}>
          Configuration:
        </label>
        <select
          id="config-select"
          value={configName}
          onChange={(e) => setConfigName(e.target.value)}
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            background: "#ffffff",
            color: "#111827",
          }}
        >
          <option value="none">none</option>
          <option value="stun">stun</option>
          <option value="wrong">wrong</option>
        </select>
      </div>

      {/* TIMER AND GATHERING STATE */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "24px", color: "#374151", fontSize: "15px" }}>
        <p>
          Gathering State:{" "}
          <strong
            style={{
              padding: "3px 8px",
              borderRadius: "4px",
              background: state === "complete" ? "#dcfce7" : "#e0e7ff",
              color: state === "complete" ? "#166534" : "#3730a3",
            }}
          >
            {state}
          </strong>
        </p>
        <p>
          Gathering Time:{" "}
          <strong>
            {elapsed !== null ? `${elapsed} ms` : "Gathering..."}
          </strong>
        </p>
      </div>

      {/* CANDIDATES TABLE */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <thead>
          <tr style={{ background: "#f8fafc", textAlign: "left" }}>
            <th style={{ padding: "12px 14px", border: "1px solid #e2e8f0", color: "#1e293b" }}>Type</th>
            <th style={{ padding: "12px 14px", border: "1px solid #e2e8f0", color: "#1e293b" }}>Protocol</th>
            <th style={{ padding: "12px 14px", border: "1px solid #e2e8f0", color: "#1e293b" }}>Address : Port</th>
            <th style={{ padding: "12px 14px", border: "1px solid #e2e8f0", color: "#1e293b" }}>Priority</th>
            <th style={{ padding: "12px 14px", border: "1px solid #e2e8f0", color: "#1e293b" }}>Foundation</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((c) => (
            <tr
              key={c.candidate}
              style={{
                background: COLORS[c.type] ?? "#ffffff",
                color: "#0f172a",
              }}
            >
              <td style={{ padding: "10px 14px", border: "1px solid #cbd5e1", fontWeight: "bold" }}>
                {c.type}
              </td>
              <td style={{ padding: "10px 14px", border: "1px solid #cbd5e1" }}>
                {c.protocol}
              </td>
              <td style={{ padding: "10px 14px", border: "1px solid #cbd5e1", fontFamily: "Consolas, monospace" }}>
                {c.address} : {c.port}
              </td>
              <td style={{ padding: "10px 14px", border: "1px solid #cbd5e1", fontFamily: "Consolas, monospace" }}>
                {c.priority}
              </td>
              <td style={{ padding: "10px 14px", border: "1px solid #cbd5e1", fontFamily: "Consolas, monospace" }}>
                {c.foundation}
              </td>
            </tr>
          ))}

          {sorted.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: "20px", textAlign: "center", color: "#64748b", border: "1px solid #cbd5e1" }}>
                Waiting for candidates...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
