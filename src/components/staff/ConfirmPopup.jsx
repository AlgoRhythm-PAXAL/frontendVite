import { useEffect, useState } from "react";

const ConfirmPopup = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
const [confirm, setConfirm] = useState(false);

 useEffect(() => {
    if (!isOpen) setConfirm(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setConfirm(true);
    await onConfirm(); 
    setConfirm(false);
  };
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md animate-fade-in">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
          disabled={confirm}
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
          disabled={confirm}
            onClick={handleConfirm}
            className="px-4 py-2 rounded-md bg-Primary text-white font-semibold hover:bg-Primary-dark transition"
          >
            {confirm ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  Updating..
                </div>
              ) : (
                "Confirm"
              )}
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
