import React, { useState, useEffect } from "react";
import supabase from "../api/supabase";

interface AuditLog {
  id: number;
  event: string;
  user: string;
  timestamp: string;
  details: string;
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase.from("audit_logs").select("*").order("timestamp", { ascending: false });
      if (error) {
        console.error("Error fetching logs:", error.message);
      } else {
        setLogs(data || []);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.event.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.timestamp.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#007BFF" }}>Auditoría y Logs</h1>

      {/* Búsqueda */}
      <input
        type="text"
        placeholder="Buscar por evento, usuario o fecha"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "10px", marginBottom: "20px", width: "100%", borderRadius: "4px", border: "1px solid #ccc" }}
      />

      {/* Tabla de logs */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ padding: "10px", backgroundColor: "#007BFF", color: "white", textAlign: "left" }}>Evento</th>
            <th style={{ padding: "10px", backgroundColor: "#007BFF", color: "white", textAlign: "left" }}>Usuario</th>
            <th style={{ padding: "10px", backgroundColor: "#007BFF", color: "white", textAlign: "left" }}>Fecha</th>
            <th style={{ padding: "10px", backgroundColor: "#007BFF", color: "white", textAlign: "left" }}>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{log.event}</td>
                <td style={{ padding: "10px" }}>{log.user}</td>
                <td style={{ padding: "10px" }}>{new Date(log.timestamp).toLocaleString()}</td>
                <td style={{ padding: "10px" }}>{log.details}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "10px" }}>
                No se encontraron registros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogs;
