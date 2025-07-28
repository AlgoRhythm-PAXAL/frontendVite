import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import toast from "react-hot-toast";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const QRScanner = ({ onClose }) => {
  const [statusMessage, setStatusMessage] = useState("Waiting for QR code...");
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250,
      rememberLastUsedCamera: false,
    });

    scanner.render(
      async (decodedText) => {
        setStatusMessage(`Updating parcel status for ${decodedText}...`);

        try {
          scanner.clear();
          const response = await axios.put(
            `${backendURL}/staff/collection-management/qr-code/update-to-parcel-arrived`,
            { decodedText },
            { withCredentials: true }
          );
          if (response.data.success) {
            toast.success(`Parcel ${decodedText} marked as arrived`);
            setStatusMessage("Status updated successfully.");
            setTimeout(() => onClose(), 2000);
          }
        } catch (error) {
          scanner.clear();
          console.error("Error updating parcel status:", error);
          toast.error("Failed to update parcel status");
          setStatusMessage(error.response.data.message);
        }
      },
      (error) => {
        console.warn("QR scan error:", error);
      }
    );

    return () => {
      scanner
        .clear()
        .catch((err) => console.error("Failed to clear scanner", err));
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              Scan Parcel QR Code
            </h2>
            <p className="text-sm text-gray-500">
              Use your camera to scan and update parcel status
            </p>
          </div>
          <div
            id="reader"
            ref={scannerRef}
            className="rounded-md overflow-hidden w-full"
          />
          <p className="text-sm text-gray-700 font-medium">{statusMessage}</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
