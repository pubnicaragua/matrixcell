import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";

const BlockDevice = () => {
  const [devices, setDevices] = useState<
    { id: number; imei: string; status: string; owner: string }[]
  >([]);
  const [newDevice, setNewDevice] = useState({ imei: "", owner: "" });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const devicesPerPage = 5;

  useEffect(() => {
    const fetchDevices = async () => {
      const data = [
        { id: 1, imei: "123456789012345", status: "Unlocked", owner: "Cliente 1" },
        { id: 2, imei: "987654321098765", status: "Blocked", owner: "Cliente 2" },
        { id: 3, imei: "543216789012345", status: "Unlocked", owner: "Cliente 3" },
        { id: 4, imei: "789012345678901", status: "Blocked", owner: "Cliente 4" },
        { id: 5, imei: "321098765432109", status: "Unlocked", owner: "Cliente 5" },
        { id: 6, imei: "654987321012345", status: "Blocked", owner: "Cliente 6" },
      ];
      setDevices(data);
      setLoading(false);
    };

    fetchDevices();
  }, []);

  const handleBlockUnblock = (id: number, newStatus: string) => {
    setDevices(
      devices.map((device) =>
        device.id === id ? { ...device, status: newStatus } : device
      )
    );
    alert(
      `El dispositivo ha sido ${
        newStatus === "Blocked" ? "bloqueado" : "desbloqueado"
      } con éxito.`
    );
  };

  const handleAddDevice = () => {
    if (newDevice.imei && newDevice.owner) {
      const newDeviceId = devices.length + 1;
      setDevices([
        ...devices,
        { id: newDeviceId, imei: newDevice.imei, status: "Unlocked", owner: newDevice.owner },
      ]);
      setNewDevice({ imei: "", owner: "" });
      alert("Dispositivo agregado exitosamente.");
    } else {
      alert("Por favor completa todos los campos.");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const csvHeader = "ID,IMEI,Status,Owner\n";
    const csvRows = devices.map((device) =>
      [device.id, device.imei, device.status, device.owner].join(",")
    );
    const csvContent = [csvHeader, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "devices.csv");
  };

  const filteredDevices = devices.filter(
    (device) =>
      device.imei.includes(search) ||
      device.owner.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastDevice = currentPage * devicesPerPage;
  const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
  const currentDevices = filteredDevices.slice(indexOfFirstDevice, indexOfLastDevice);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatistics = () => {
    const totalDevices = devices.length;
    const blockedDevices = devices.filter((device) => device.status === "Blocked").length;
    const unlockedDevices = totalDevices - blockedDevices;

    return {
      totalDevices,
      blockedDevices,
      unlockedDevices,
    };
  };

  const { totalDevices, blockedDevices, unlockedDevices } = getStatistics();

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontFamily: "var(--font-primary)", color: "var(--color-primary)" }}>
        Gestión de Dispositivos
      </h1>

      {/* Estadísticas */}
      <div style={styles.statisticsContainer}>
        <div style={styles.statCard}>
          <h2 style={styles.statTitle}>Total</h2>
          <p style={styles.statValue}>{totalDevices}</p>
        </div>
        <div style={styles.statCard}>
          <h2 style={styles.statTitle}>Bloqueados</h2>
          <p style={{ ...styles.statValue, color: "red" }}>{blockedDevices}</p>
        </div>
        <div style={styles.statCard}>
          <h2 style={styles.statTitle}>Desbloqueados</h2>
          <p style={{ ...styles.statValue, color: "green" }}>{unlockedDevices}</p>
        </div>
      </div>

      {/* Exportar datos */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={exportToCSV} style={styles.exportButton}>
          Exportar CSV
        </button>
      </div>

      {/* Búsqueda */}
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Buscar por IMEI o propietario"
          value={search}
          onChange={handleSearch}
          style={styles.searchInput}
        />
      </div>

      {/* Tabla de dispositivos */}
      {loading ? (
        <p style={{ fontFamily: "var(--font-primary)", color: "var(--color-secondary)" }}>
          Cargando dispositivos...
        </p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ background: "var(--color-secondary)", color: "var(--color-white)" }}>
              <th style={styles.tableHeader}>IMEI</th>
              <th style={styles.tableHeader}>Propietario</th>
              <th style={styles.tableHeader}>Estado</th>
              <th style={styles.tableHeader}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentDevices.map((device) => (
              <tr key={device.id} style={styles.tableRow}>
                <td style={styles.tableCell}>{device.imei}</td>
                <td style={styles.tableCell}>{device.owner}</td>
                <td style={styles.tableCell}>
                  <span
                    style={{
                      color: device.status === "Blocked" ? "red" : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {device.status}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  {device.status === "Blocked" ? (
                    <button
                      style={styles.unblockButton}
                      onClick={() => handleBlockUnblock(device.id, "Unlocked")}
                    >
                      Desbloquear
                    </button>
                  ) : (
                    <button
                      style={styles.blockButton}
                      onClick={() => handleBlockUnblock(device.id, "Blocked")}
                    >
                      Bloquear
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Paginación */}
      <div style={styles.pagination}>
        {Array.from({ length: Math.ceil(filteredDevices.length / devicesPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            style={{
              ...styles.paginationButton,
              backgroundColor: currentPage === i + 1 ? "var(--color-primary)" : "#ccc",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  searchInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  tableHeader: {
    padding: "10px",
    textAlign: "left" as const,
    borderBottom: "2px solid var(--color-background)",
  },
  tableRow: {
    borderBottom: "1px solid var(--color-background)",
  },
  tableCell: {
    padding: "10px",
  },
  blockButton: {
    background: "red",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  unblockButton: {
    background: "green",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  paginationButton: {
    margin: "0 5px",
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  statisticsContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    padding: "20px",
    background: "var(--color-white)",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  statCard: {
    flex: 1,
    textAlign: "center" as const,
    padding: "10px",
  },
  statTitle: {
    fontFamily: "var(--font-primary)",
    color: "var(--color-secondary)",
    fontSize: "1.2rem",
  },
  statValue: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "var(--color-primary)",
  },
  exportButton: {
    background: "var(--color-primary)",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default BlockDevice;
