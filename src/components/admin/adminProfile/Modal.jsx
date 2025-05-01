const Modal = ({ open, onClose, children }) => {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex items-center justify-center transition-colors ${open ? 'visible bg-black/20' : 'invisible'} z-50`}
    >
      <div
        className="justify-center items-center w-fit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
