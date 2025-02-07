import React, { useState } from "react";
import MUIButton from "@mui/material/Button";
import { customeraxios } from "../../../../axios";
import { Modal, ModalBody, ModalFooter, Button,Spinner } from "reactstrap";
import { toast } from "react-toastify";

const Hold = (props) => {
  const [holdmodal, setHoldmodal] = useState(false);

  const holdModalopen = () => setHoldmodal(!holdmodal);
  const [loaderSpinneer, setLoaderSpinner ] = useState(false)

  const removeonhold = () => {
    setLoaderSpinner(true)
    customeraxios
      .patch(
        `customers/hold/${props?.profileDetails && props?.profileDetails?.user?.id}`,
        { account_status: "HLD" }
      )
      .then((res) => {
        setLoaderSpinner(false)
        props.fetchComplaints()
        setHoldmodal(false);
        props.setProfileDetails((preState) => {
          return {
            ...preState,
            account_status:
              res.data && res.data.account_status == "HLD"
                ? "Hold"
                : res.data.account_status,
            hold_at: res.data && res.data.hold_at,
          };
        });
        toast.success("Account has been kept on hold", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      })
      .catch(function (error) {
        setLoaderSpinner(false)
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

  const removeonunhold = () => {
    setLoaderSpinner(true)
    props.fetchComplaints()
    customeraxios
      .patch(
        `customers/hold/${
          props.profileDetails && props.profileDetails?.user?.id
        }/release`
      )
      .then((res) => {
        setLoaderSpinner(false)
        setHoldmodal(false);
        props.setProfileDetails((preState) => {
          return {
            ...preState,
            account_status:
              res.data && res.data.account_status === "ACT"
                ? "Active"
                : res.data && res.data.account_status === "KYC"
                ? "KYC Confirmed"
                : res.data && res.data.account_status === "PROV"
                ? "Provisioning"
                : res.data && res.data.account_status === "INS"
                ? "Installation"
                : res.data && res.data.account_status === "DCT"
                ? "Deactive"
                : res.data && res.data.account_status === "EXP"
                ? "Expired"
                : res.data && res.data.account_status === "SPD"
                ? "Suspended"
                : res.data && res.data.account_status === "EXP"
                ? "Expired"
                : res.data && res.data.account_status,

            hold_at: null,
          };
        });
        toast.success("Account has been unhold", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      })
      .catch(function (error) {
        setLoaderSpinner(false)
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
    <div>
      {props.profileDetails && props.profileDetails.hold_at === null ? (
       props?.profileDetails?.account_status === "ACT" &&(
        <MUIButton variant="outlined" size="medium" onClick={holdModalopen} className="cust_action"  >
          Hold
        </MUIButton>)
      ) : (
        <MUIButton variant="outlined" size="medium" onClick={holdModalopen} className="cust_action">
          Unhold
        </MUIButton>
      )}
      {/* modal for hold */}
      <Modal isOpen={holdmodal} toggle={holdModalopen} centered>
        <ModalBody>
          <p className="modal_text">{`Are you sure you want to ${
            props.profileDetails && props.profileDetails.hold_at === null
              ? "Hold"
              : "Unhold"
          } ?`}</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color=""
            id="yes_button"
            onClick={() => {
              if (
                props.profileDetails &&
                props.profileDetails.hold_at === null
              ) {
                removeonhold();
              } else {
                removeonunhold();
              }
            }}
            disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
          >
           {loaderSpinneer ?  <Spinner size="sm"> </Spinner> :null} &nbsp;  {"Yes"}
          </Button>
          <Button color="" onClick={holdModalopen} id="resetid">
            {"Cancel"}
          </Button>
        </ModalFooter>
      </Modal>
      {/* end */}
    </div>
  );
};

export default Hold;
