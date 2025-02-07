import React from 'react';
import { Modal, ModalBody, ModalFooter, Button, Spinner } from 'reactstrap';
// Added By Marieya
const ZoneModal = ({ isOpen, toggle, title, message, action, isProcessing,iscontinue }) => {
    return (
        <Modal isOpen={isOpen} toggle={toggle} centered backdrop="static">
            <ModalBody>
                {title && <h5>{title}</h5>}
                {message}
            </ModalBody>
            <ModalFooter>
            <Button
                    variant="contained"
                    type="button"
                    onClick={iscontinue}
                    disabled={isProcessing}
                >
                    {isProcessing ? <Spinner size="sm" /> : null} &nbsp;&nbsp;
                    {"Yes"}
                </Button>
                <Button
                    variant="contained"
                    type="button"
                    onClick={action}
                    disabled={isProcessing}
                >
                    {isProcessing ? <Spinner size="sm" /> : null} &nbsp;&nbsp;
                    {"No"}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ZoneModal;
