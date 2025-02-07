import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { toast } from "react-toastify";
import { adminaxios } from "../../../axios";
import MUIButton from "@mui/material/Button";
import { Modal, ModalBody, ModalFooter, Button, Spinner } from "reactstrap";
import { CUSTOMER_LIST } from "../../../utils/permissions";
import RENEW from "../../../assets/images/Customer-Circle-img/renew.png";
import DISCONNECT from "../../../assets/images/Customer-Circle-img/Disconnect.png";
import ACTION from "../../../assets/images/circle.png"

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}


const MoreActions = ({ row, refresh, changePlanClickHandler, permissions }) => {
  //to disable button
  const [disable, setDisable] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [disconnectModal, setDisconnectModal] = useState(false);
  const disconnectMOdalopen = () => setDisconnectModal(!disconnectModal);
  const open = Boolean(anchorEl);

  // dropdown
  const onActionClickHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  // disconnect function

  const disconnectCustomer = (e) => {
    setDisable(true)
    e.preventDefault();
    adminaxios
      .post(`accounts/customer/${row.username}/deactivate`)
      .then((res) => {
        setDisable(false)
        setDisconnectModal(false);
        toast.success(res.data.detail, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      })
      .catch(function (_) {
        setDisable(false)
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      })
      .finally(function () {
        refresh();
        handleClose();
      });
  };

  //  call renew and change plan modal
  const handleChangePlan = () => {
    const { service_plan, area_id } = row;
    const service_plan_id = service_plan;
    const area = area_id;
    changePlanClickHandler(service_plan_id, row.id, area);
    sessionStorage.setItem("customerInfDetails", JSON.stringify(row));
    handleClose();
  };
  //removed change plans from More Actions by Marieya
  return (
    <>

      <img src={ACTION} onClick={onActionClickHandler} className="action_Drop" />

      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {token.permissions.includes(CUSTOMER_LIST.RENEW_PLAN) ? (
          <>
            <MenuItem onClick={handleChangePlan}>
              <span className="more_actions">
                {" "}
                <img src={RENEW} />
                &nbsp;&nbsp;Renew{" "}
              </span>
            </MenuItem>
            <hr style={{ marginTop: "2px", marginBottom: "1px" }} />
          </>
        ) : <>
          <MenuItem >
            <span className="more_actions">
              {" "}
              &nbsp;&nbsp;No Action{" "}
            </span>
          </MenuItem>
        </>}
        {/* {token.permissions.includes(CUSTOMER_LIST.CHANGE_PLAN) && (
          <>
            <MenuItem onClick={handleChangePlan}>
              {" "}
              <span className="more_actions">
                <img src={CHANGE} />
                &nbsp;&nbsp;Change Plan
              </span>
            </MenuItem>
            <hr style={{ marginTop: "2px", marginBottom: "1px" }} />
          </>
        )} */}




        {permissions.includes(CUSTOMER_LIST.DISCONNECT) && (
          <>
            <MenuItem onClick={disconnectMOdalopen}>
              <span className="more_actions">
                <img src={DISCONNECT} /> &nbsp;Disconnect
              </span>
            </MenuItem>
          </>
        )}
      </Menu>
      {/* disconnect modal */}
      <Modal isOpen={disconnectModal} toggle={disconnectMOdalopen} centered>
        <ModalBody>
          <p>{"Are you sure you want to Disconnect ?"}</p>
        </ModalBody>
        <ModalFooter>
          {/* Added New ID for Yes Button in Disconnect Yes Button on 14th April 2023 #@ */}
          <MUIButton  variant="" onClick={disconnectCustomer} id="yes_button" disabled={disable}>
            {disable ? <Spinner size="sm"> </Spinner> : null}
            {"Yes"}
          </MUIButton>
          <Button color="" onClick={disconnectMOdalopen} id="resetid">
            {"Cancel"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default MoreActions;
