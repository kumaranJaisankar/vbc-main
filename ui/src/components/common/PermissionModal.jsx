import React from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalFooter,
    ModalBody,
  } from "reactstrap";

const PermissionModal = ({visible, handleVisible, content})=>{
    return (
        <Modal
        isOpen={visible}
        toggle={handleVisible}
        centered
      >
        <ModalHeader toggle={handleVisible}>
          {/* Insufficient Permissions */}
        </ModalHeader>
        <ModalBody>
          <p>{content}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleVisible}>
            Ok
          </Button>
        </ModalFooter>
      </Modal>
    )
}
export default PermissionModal;