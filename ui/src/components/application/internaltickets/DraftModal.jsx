import React from "react";

import { Button, Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";

const DraftModal = (props) => {
  const { openDraftModal, closeDraftModal, toggleDraftModal, handleSaveClick } =
    props;
  return (
    <React.Fragment>
      <Modal
        isOpen={openDraftModal}
        toggle={() => toggleDraftModal(!openDraftModal)}
        className="modal-body"
        centered={true}
      >
        <ModalHeader toggle={() => toggleDraftModal(!openDraftModal)}>
          {"Confirmation"}
        </ModalHeader>
        <ModalBody>Do you want to save this data in draft?</ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="notification"
            onClick={handleSaveClick}
          >
            {"Save as draft"}
          </Button>
{/* Sailaja Changed close button Styles (Line Number 30)on 13th July */}

          <Button id ="resetid" onClick={() => closeDraftModal()}>
            {"Close"}
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default DraftModal;
