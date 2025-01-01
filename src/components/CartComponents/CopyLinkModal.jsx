import React from "react";
import { Modal, Button } from "react-bootstrap";

const ShareModal = ({ show, handleClose, shareLink, handleCopyLink }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Share this product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="text"
          value={shareLink}
          readOnly
          className="form-control"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant=""
          style={{ background: "#FFC35B", color: "#fff" }}
          onClick={handleCopyLink}
        >
          Copy Link
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareModal;
