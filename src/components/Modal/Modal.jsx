import "./Modal.css";
function Modal({ title, message, onOk, onCancel }) {
    const handleOk = () => {
        onOk();
        closeModal();
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        closeModal();
    };

    const closeModal = () => {
        const modalOverlay = document.getElementById('custom-modal');
        modalOverlay.classList.add('hidden');
    };

    return (
        <div id="custom-modal" className="modal-overlay">
            <div className="modal-card">
                <h3 id="modal-title" className="modal-title">{title}</h3>
                <p id="modal-message" className="modal-message">{message}</p>
                <div className="modal-actions">
                    {onCancel && (
                        <button type="button" id="modal-cancel-btn" className="modal-btn cancel" onClick={handleCancel}>キャンセル</button>
                    )}
                    <button type="button" id="modal-ok-btn" className="modal-btn ok" onClick={handleOk}>OK</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
