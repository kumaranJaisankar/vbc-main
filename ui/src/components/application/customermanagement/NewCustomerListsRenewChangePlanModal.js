import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  FormGroup,
  Label,
} from "reactstrap";

import Renew from "./renew";
import ChangePlan from "./changeplan";
import isEmpty from "lodash/isEmpty"
import { adminaxios } from "../../../axios";
import { CUSTOMER_LIST } from "../../../utils/permissions";
import UpgradeOPtion from "./upgrade"
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

export const NewCustomerListsRenewChangePlanModal = (props) => {
  const {
    isRenewChangePlanModalOpen,
    toggleRenewChangePlanModalOpen,
    serviceObjData,
    setServiceObjData,
    RefreshHandler,
    selectID,
    changeplan,
    setChangeplan,
    changeplanListBkp,
    setChangeplanListBkp,
    serviceplanobj,
    setServiceplanobj,
    serviceplanobjbkp,
    setServiceplanobjbkp,
    setUpdateInfoCount,
  } = props;
  const [currentPlan, setCurrentPlan] = useState({});
  // Sailaja Created a new object to replace hardcoded heading, when you select Renew/ Change Plan/ Upgrade Plan on 3rd April 2023
  const NameChange = {
    renew: "Renew Plan",
    changeplan: "Change Plan",
    upgrade: "Upgrade Plan",
  };


  const [upgradeRenewChangePlan, setUpgradeRenewChangePlan] = useState("renew");
  useEffect(() => {
    if (isEmpty(serviceObjData))
      setUpgradeRenewChangePlan('renew')

    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
    if (customerInfo) {
      datasubmit(customerInfo.service_plan, customerInfo.area_id);
      changeplanSubmit(customerInfo.service_plan, customerInfo.area_id);
      upgradeDayssubmit(customerInfo.service_plan, customerInfo.area_id);
    }

  }, [isRenewChangePlanModalOpen])

  //upgrade plan

  const datasubmit = (id, area) => {
    if (isRenewChangePlanModalOpen && !renderAfterCalled) {
      adminaxios
        .get(`accounts/loggedin/${area}/plans/${id}`)
        .then((res) => {
          setServiceplanobj(res.data);
          setServiceplanobjbkp(res.data);
        })
        .catch(function (error) {
        });
    }
  };

  // upgrade days
  const [upgradeDays, setUpgradeDays] = useState([]);
  const [upgradeDayskp, setUpgradeDayskp] = useState([]);
  const upgradeDayssubmit = (id, area) => {
    if (isRenewChangePlanModalOpen) {
      adminaxios
        .get(`accounts/loggedin/${area}/speedplans/${id}`)
        .then((res) => {
          setUpgradeDays(res.data);
          setUpgradeDayskp(res.data);
        })
        .catch(function (error) {
        });
    }
  };




  // change plan
  const renderAfterCalled = useRef(false);

  const changeplanSubmit = (id, area) => {
    if (isRenewChangePlanModalOpen && !renderAfterCalled) {
      let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
      adminaxios
        .get(`accounts/area/${area}/otherplans/${id}/${customerInfo.id}`)
        .then((res) => {
          setChangeplan(res.data);
          setChangeplanListBkp(res.data);
        })
        .catch((error) => console.log(error));
    }
  };



  return (
    <React.Fragment>
      <Modal
        isOpen={isRenewChangePlanModalOpen}
        toggle={toggleRenewChangePlanModalOpen}
        centered
        className="renew-change-plan-modal"
      >
        <ModalBody
          className="renew-change-plan-modal-body"
          style={{
            padding: "35px",
            maxHeight: "600px",
            overflow: "auto",
          }}
        >
          <ModalHeader style={{ padding: "1rem 0rem" }}>
            <b style={{ fontSize: "20px" }}>
              {/* Renew Plan or Change Plan : {customerInfo?.username}
               */}
              {/* Renew Plan or Change Plan : {JSON.parse(localStorage.getItem("customerInfDetails")) && JSON.parse(localStorage.getItem("customerInfDetails")).username} */}
              {/* Sailaja Modified above hardcoded name to dynamically changenames when you click on Renew/ Change Plan/ Upgrade Plan on 3rd April 2023              {NameChange[upgradeRenewChangePlan]} : {JSON.parse(localStorage.getItem("customerInfDetails")) && JSON.parse(localStorage.getItem("customerInfDetails")).username} */}
              {NameChange[upgradeRenewChangePlan]} : {JSON.parse(sessionStorage.getItem("customerInfDetails")) && JSON.parse(sessionStorage.getItem("customerInfDetails")).username}

            </b>
          </ModalHeader>
          <Row>
            <Col>
              <FormGroup
                className="m-t-15 m-checkbox-inline mb-0 custom-radio-ml"
                style={{ display: "flex", marginLeft: "0px" }}
              >
                {token.permissions.includes(CUSTOMER_LIST.RENEW_PLAN) && (

                  <div>
                    <Input
                      className="radio_animated"
                      id="radioinlinerenew"
                      type="radio"
                      name="renew"
                      value="renew"
                      checked={upgradeRenewChangePlan === "renew"}
                      onClick={() => setUpgradeRenewChangePlan("renew")}
                    />

                    <Label className="mb-0" for="radioinlinerenew">
                      {Option}
                      <span className="digits"> {"Renew"}</span>
                    </Label>
                  </div>
                )}
                {token.permissions.includes(CUSTOMER_LIST.CHANGE_PLAN) && (
                  <>
                    <div>
                      <Input
                        className="radio_animated"
                        id="radioinlinechange"
                        type="radio"
                        name="changeplan"
                        value="changeplan"
                        checked={upgradeRenewChangePlan === "changeplan"}
                        onClick={() => setUpgradeRenewChangePlan("changeplan")}
                      />

                      <Label className="mb-0" for="radioinlinechange">
                        {Option}
                        <span className="digits">{"Change Plan"}</span>
                      </Label>
                    </div>

                    <div>
                      <Input
                        className="radio_animated"
                        id="radioinlineupgrade"
                        type="radio"
                        name="upgrade"
                        value="upgrade"
                        checked={upgradeRenewChangePlan === "upgrade"}
                        onClick={() => setUpgradeRenewChangePlan("upgrade")}
                      />

                      <Label className="mb-0" for="radioinlineupgrade">
                        {Option}
                        <span className="digits">{"Upgrade Plan"}</span>
                      </Label>
                    </div>
                  </>
                )}
              </FormGroup>
            </Col>
          </Row>
          {upgradeRenewChangePlan === "upgrade" ? (
            <>
              {isRenewChangePlanModalOpen && (
                <>
                  {token.permissions.includes(CUSTOMER_LIST.CHANGE_PLAN) && (
                    <>
                      {/* <UpgradePlan
                      upgradeRenewChangePlan={upgradeRenewChangePlan}
                      serviceobj={isRenewChangePlanModalOpen}
                      Verticalcentermodaltoggle1={toggleRenewChangePlanModalOpen}
                      setServiceobjdata={setServiceObjData}
                      serviceobjdata={serviceObjData}
                      serviceplanobj={serviceplanobj}
                      serviceplanobjbkp={serviceplanobjbkp}
                      setServiceplanobj={setServiceplanobj}
                      id={selectID}
                      Refreshhandler={RefreshHandler}
                    /> */}
                      <UpgradeOPtion
                        upgradeRenewChangePlan={upgradeRenewChangePlan}
                        isRenewChangePlanModalOpen={isRenewChangePlanModalOpen}
                        toggleRenewChangePlanModalOpen={toggleRenewChangePlanModalOpen}
                        setServiceObjData={setServiceObjData}
                        serviceObjData={serviceObjData}
                        serviceplanobj={serviceplanobj}
                        serviceplanobjbkp={serviceplanobjbkp}
                        setServiceplanobj={setServiceplanobj}
                        selectID={selectID}
                        RefreshHandler={RefreshHandler}
                        upgradeDays={upgradeDays}
                        upgradeDayskp={upgradeDayskp}
                        setUpgradeDays={setUpgradeDays}
                        setUpgradeDayskp={setUpgradeDayskp}
                        fetchComplaints={props.fetchComplaints}
                      />
                    </>
                  )}
                </>
              )}
            </>
          ) : upgradeRenewChangePlan === "renew" ? (
            <>
              {token.permissions.includes(CUSTOMER_LIST.RENEW_PLAN) && (
                <Renew
                  setCurrentPlan={setCurrentPlan}
                  Refreshhandler={RefreshHandler}
                  serviceobj={isRenewChangePlanModalOpen}
                  Verticalcentermodaltoggle1={toggleRenewChangePlanModalOpen}
                  setServiceobjdata={setServiceObjData}
                  serviceobjdata={serviceObjData}
                  serviceplanobj={serviceplanobj}
                  id={selectID}
                  fetchComplaints={props.fetchComplaints}
                />
              )}
            </>
          ) : (
            <>
              {token.permissions.includes(CUSTOMER_LIST.CHANGE_PLAN) && (
                <ChangePlan
                  upgradeRenewChangePlan={upgradeRenewChangePlan}
                  Refreshhandler={RefreshHandler}
                  serviceobj={isRenewChangePlanModalOpen}
                  Verticalcentermodaltoggle1={toggleRenewChangePlanModalOpen}
                  setServiceobjdata={setServiceObjData}
                  serviceobjdata={serviceObjData}
                  changeplanlist={changeplan}
                  changeplanlistBkp={changeplanListBkp}
                  setChangeplan={setChangeplan}
                  id={selectID}
                  setUpdateInfoCount={setUpdateInfoCount}
                  fetchComplaints={props.fetchComplaints}
                />
              )}
            </>
          )}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};
