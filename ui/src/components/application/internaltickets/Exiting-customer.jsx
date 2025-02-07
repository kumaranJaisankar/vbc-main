import React from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
} from "reactstrap";
const ExistingCustomer = (props) => {
    const { exitingCustomer, exitcustomer, errormessage,dataClose } = props
    return (
        <>

            <Modal
                isOpen={exitcustomer}
                toggle={exitingCustomer}
                centered
                backdrop="static"
            >
                <ModalBody>
                    <h5> {errormessage?.non_field_errors}</h5>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={()=>{exitingCustomer();dataClose()}} id="save_button">
                        ok
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    )
}
export default ExistingCustomer;