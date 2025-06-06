import React, { useEffect, useRef } from "react";

interface DialogBoxProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const DialogBox: React.FC<DialogBoxProps> = ({ open, onClose, children }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [open]);

  // Close dialog when user clicks outside or presses Esc
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog ref={dialogRef} style={{
      background: "#222",
      color: "#fff",
      borderRadius: "8px",
      minWidth: "300px",
      minHeight: "100px",
      padding: "2rem",
      border: "none",
      boxShadow: "0 2px 16px rgba(0,0,0,0.3)"
    }}>
      {children}
      <form method="dialog">
        <button onClick={onClose} style={{ marginTop: "1rem" }}>Close</button>
      </form>
    </dialog>
  );
};

export default DialogBox;
