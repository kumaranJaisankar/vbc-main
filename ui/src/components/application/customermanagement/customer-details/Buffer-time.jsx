import React, { useState } from "react";
import MUIButton from "@mui/material/Button";
import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";
import { toast } from "react-toastify";
import { customeraxios } from "../../../../axios";

const BufferTime = (props) => {
  const [bufferModal, setBufferModal] = useState(false);
  const bufferTimeModal = () => setBufferModal(!bufferModal);
  const [bufferStatus, setBufferStatus] = useState(true);
{/*changed buffer api */}

  const bufferSubmit = () => {
    const obj = {time_period : 48}
    customeraxios
    .patch(`customers/buffer/${props.profileDetails && props.profileDetails.id}`,obj )
    // .patch(`buffer/${props.profileDetails && props.profileDetails.id}` )
    .then((res) => {
      setBufferModal(false);
      setBufferStatus(false)
      toast.success('Plan extended successfully', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000
      })
      props.setProfileDetails
      ((preState) => {
        return {
          ...preState,
          account_status: "Active",
        };
      });
    })
    .catch(function (error) {
      const errorString = JSON.stringify(error);
      const is500Error = errorString.includes("500");
      const is404Error = errorString.includes("404");
      if (error.response && error.response.data.detail) {
        toast.error(error.response && error.response.data.detail, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      } else if (is500Error) {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      } else if (is404Error) {
        toast.error("API mismatch", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      } else {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      }
    });
  };
  return (
    <>
{props.profileDetails?.account_status === "Expired" ?   
<>
<MUIButton variant="outlined" size="medium" onClick={bufferTimeModal} disabled={!bufferStatus} className="cust_action">
        Buffer Time
      </MUIButton>
{/* {props.profileDetails && props.profileDetails.last_renewal === null ? 
    <MUIButton variant="outlined" size="medium" onClick={bufferTimeModal} disabled={!bufferStatus} className="cust_action">
        Buffer Time
      </MUIButton>: <MUIButton variant="outlined" size="medium" disabled={true} className="cust_action">
        Buffer Time
      </MUIButton>
    } */}
    </>
    :""}

      {/* <MUIButton variant="outlined" size="medium" onClick={bufferTimeModal}>
        Buffer Time
      </MUIButton> */}

      {/* Buffer time modal */} 
      <Modal isOpen={bufferModal} toggle={bufferTimeModal} centered>
        <ModalBody>
          <p className="modal_text" style={{textAlign: "center"}}>Do you want to enable <b>BUFFER TIME</b> to this user?</p>
          <p  style={{textAlign: "end"}}><span>(*Applicable for 2 days only)</span> </p>
        </ModalBody>
        <ModalFooter>
        <Button
            color="primary"
            onClick={bufferSubmit}
            id="yes_button"
          >
            {"Yes"}
          </Button>
          <Button color="secondary" onClick={bufferTimeModal} id="resetid">
            {"Cancel"}
          </Button>
        
        </ModalFooter>
      </Modal>
    </>
  );
};
export default BufferTime;
