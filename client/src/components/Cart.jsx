export const Cart = ({ isOpen, onClose }) => {
  return (
    <div className={`cart bg-light p-3 ${isOpen ? "open" : ""}`}>
      <i className="bi bi-x fs-1 cursor-pointer" onClick={onClose}></i>
    </div>
  );
};
