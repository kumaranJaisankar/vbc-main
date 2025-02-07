import React, { useState } from "react";
import MUIButton from "@mui/material/Button";
import { adminaxios } from "../../../../axios";
import { Modal, ModalBody, ModalFooter, Button,Spinner } from "reactstrap";
import { toast } from "react-toastify";

const Deactive = (props) => {
  const [deactivemodal, setDeactivemodal] = useState(false);

  const deactiveModalopen = () => setDeactivemodal(!deactivemodal);
  const [loaderSpinneer, setLoaderSpinner ] = useState(false)

  const removeondeactivate = () => {
    setLoaderSpinner(true)
    adminaxios
      .post(
        `accounts/customer/${props?.profileDetails && props?.profileDetails?.user?.username}/deactivate`,
        { account_status: "DCT" }
      )
      .then((res) => {
        setLoaderSpinner(false)
        props.fetchComplaints()
        setDeactivemodal(false);
        props.setProfileDetails((preState) => {
          return {
            ...preState,
            account_status:
              res.data && res.data.account_status == "DCT"
                ? "Deactive"
                : res.data.account_status,
          };
        });
        toast.success("Account has been Deactivated", {
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

  const removeonactivate = () => {
    setLoaderSpinner(true)
    adminaxios
      .post(
        `accounts/customer/${props?.profileDetails && props?.profileDetails?.user?.username}/reactivate`
      )
      .then((res) => {
        setLoaderSpinner(false)
        setDeactivemodal(false);
        props.fetchComplaints()
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
                : res.data && res.data.account_status === "EXP"
                ? "Expired"
                : res.data && res.data.account_status === "SPD"
                ? "Suspended"
                : res.data && res.data.account_status === "EXP"
                ? "Expired"
                : res.data && res.data.account_status,
          };
        });
        toast.success("Account has been Activated", {
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
        {console.log(props.profileDetails,"props.profileDetails")}
        {props.profileDetails && props.profileDetails.account_status === "ACT" && (
        <MUIButton variant="outlined" size="medium" onClick={deactiveModalopen} className="cust_action">
          Deactivate
        </MUIButton>
      )}
      {props.profileDetails && props.profileDetails.account_status === "DCT" && (
        <MUIButton variant="outlined" size="medium" onClick={deactiveModalopen} className="cust_action">
          Activate
        </MUIButton>
      )}
      {/* modal for hold */}
      <Modal isOpen={deactivemodal} toggle={deactiveModalopen} centered>
        <ModalBody>
          <p className="modal_text">{`Are you sure you want to ${
            props.profileDetails && props.profileDetails.account_status !== "DCT"
              ? "Deactivate"
              : "Activate"
          } ?`}</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color=""
            id="yes_button"
            onClick={() => {
              if (
                props.profileDetails &&
                props.profileDetails.account_status !== "DCT"
              ) {
                removeondeactivate();
              } else {
                removeonactivate();
              }
            }}
            disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
          >
           {loaderSpinneer ?  <Spinner size="sm"> </Spinner> :null} &nbsp;  {"Yes"}
          </Button>
          <Button color="" onClick={deactiveModalopen} id="resetid">
            {"Cancel"}
          </Button>
        </ModalFooter>
      </Modal>
      {/* end */}
    </div>
  );
};

export default Deactive;