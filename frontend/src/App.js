import React, { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "https://punch-in-app-544x.onrender.com/api";

function App() {
  const [punches, setPunches] = useState([]);
  const [manualTime, setManualTime] = useState("");
  const [useLocal, setUseLocal] = useState(true);
  const [note, setNote] = useState("");

  const fetchPunches = async () => {
    try {
      const res = await fetch(`${API_BASE}/punches`);
      const data = await res.json();
      setPunches(data.reverse());
    } catch (err) {
      console.error("Error fetching punches:", err);
    }
  };

  useEffect(() => {
    fetchPunches();
  }, []);

  const handlePunch = async () => {
    const time = useLocal
      ? new Date().toLocaleString()
      : manualTime || new Date().toLocaleString();

    try {
      await fetch(`${API_BASE}/punches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time, note }),
      });
      setManualTime("");
      setNote("");
      fetchPunches();
    } catch (err) {
      console.error("Error saving punch:", err);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">⏰ Punch In</h1>
      <p className="subtitle">🌞 Good morning! Have a productive day ahead.</p>

      <div className="punch-card">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={useLocal}
            onChange={() => setUseLocal(!useLocal)}
          />
          Use local time ({new Date().toLocaleString()})
        </label>

        {!useLocal && (
          <input
            type="text"
            placeholder="Enter manual time"
            value={manualTime}
            onChange={(e) => setManualTime(e.target.value)}
            className="input"
          />
        )}

        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="input"
        />

        <button className="btn" onClick={handlePunch}>
          Punch In
        </button>
        <button className="btn-secondary" onClick={fetchPunches}>
          Refresh
        </button>
      </div>

      <div className="table-container">
        <h2 className="table-title">📅 Recent Punches</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Punch Time</th>
              <th>Note</th>
              <th>Recorded At</th>
            </tr>
          </thead>
          <tbody>
            {punches.map((p, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{p.time}</td>
                <td>{p.note || "—"}</td>
                <td>{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="footer-note">
          Times stored in UTC (ISO). Displayed in your local time zone.
        </p>
      </div>
    </div>
  );
}

export default App;
