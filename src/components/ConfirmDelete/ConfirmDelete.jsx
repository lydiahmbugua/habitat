import Modal from "../Modal/Modal";
import styles from "./ConfirmDelete.module.css";

function ConfirmDeleteModal({ isOpen, habitName, onCancel, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className={styles.container}>
        <div className={styles.icon}>🗑️</div>

        <h2>Delete habit?</h2>

        <p>
          Are you sure you want to delete <strong>{habitName}</strong>?
        </p>

        <p className={styles.warning}>
          This will permanently remove the habit and all of its progress.
        </p>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>

          <button className={styles.delete} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteModal;
