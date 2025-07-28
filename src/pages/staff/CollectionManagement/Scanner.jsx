import { useState } from "react";
import QRScanner from "../../../components/staff/QRScanner";

const Scanner = () => {
      const [showScanner, setShowScanner] = useState(false);
    
    return (
        <>
         {/* QR Scanner */}
            <button
        onClick={() => setShowScanner(true)}
        className="bg-Primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
      >
        Scan Parcel QR Code
      </button>

      {showScanner && <QRScanner onClose={() => setShowScanner(false)} />}
   
        </>
    )
}

export default Scanner;