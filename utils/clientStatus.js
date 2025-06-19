export function getClientStatus(status) {
  if (status === "Healthy") {
    return {
      label: "✅ Healthy",
      bg: "var(--client-card-status-healthy-bg)",
      color: "var(--client-card-status-healthy-text)"
    };
  }
  if (status === "At Risk") {
    return {
      label: "⚠️ At Risk",
      bg: "var(--client-card-status-risk-bg)",
      color: "var(--client-card-status-risk-text)"
    };
  }
  if (status === "Poor") {
    return {
      label: "❌ Poor",
      bg: "var(--client-card-status-poor-bg)",
      color: "var(--client-card-status-poor-text)"
    };
  }
  return {
    label: status,
    bg: "var(--client-card-status-healthy-bg)",
    color: "var(--client-card-status-healthy-text)"
  };
}