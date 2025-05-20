export const capitalize = (str) => {
  if (!str) return "-";
  return (
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ") || "-"
  );
};

export const camelToSentenceCase = (str) => {
  if (!str) return "-";
  const spaced = str.replace(/([a-z])([A-Z])/g, "$1 $2");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "-";
  }
};

export const getStatusStyle = (status) => {
  switch (status) {
    case "Delivered":
    case "PickedUp":
    case "ArrivedAtDistributionCenter":
    case "ShipmentAssigned":
    case "InTransit":
    case "ArrivedAtCollectionCenter":
      return {
        color: "bg-green-100 text-green-800",
        icon: "✅",
      };

    case "OrderPlaced":
    case "PendingPickup":
    case "DeliveryDispatched":
      return {
        color: "bg-yellow-100 text-yellow-800",
        icon: "⚠️",
      };

    case "NotAccepted":
    case "WrongAddress":
    case "Return":
      return {
        color: "bg-red-100 text-red-800",
        icon: "❌",
      };

    default:
      return {
        color: "bg-gray-100 text-gray-800",
        icon: "ℹ️",
      };
  }
};
