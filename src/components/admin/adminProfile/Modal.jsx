


const Modal = ({ open, onClose, children}) => {
    return (
        <div onClick={onClose} className={`fixed inset-0 flex items-center justify-center transition-colors ${open ? "visible bg-black/20" : "invisible" }`}>
            <div className="justify-center items-center w-fit" onClick={(e)=>e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

export default Modal