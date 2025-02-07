import React, { useEffect, useState } from "react";
import { Row, Col, FormGroup, Input, Label } from "reactstrap";
import { connect } from "react-redux";
import {
  clearService,
  handleChangeFormInput,
  setService,
  openCustomiser,
  closeCustomiser,
  setSelectedPlan,
  clearSelectedPlan,
  setFormErrors,
  setDueDate,
} from "../../../../../redux/kyc-form/actions";
import moment from "moment";
import { adminaxios, customeraxios } from "../../../../../axios";
import AllPlansRightSidePanel from "../AllPlansRightSidePanel";
import useFormValidation from "../../../../customhooks/FormValidation";
import { requiredFieldsKYCForm, isValueZero } from "../../../../../utils";
import FormStep5 from "../../KYCForm/ServiceDetails/FormStep5";
import FormStep6 from "../../KYCForm/ServiceDetails/FormStep6";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Nav, NavItem, NavLink } from "reactstrap";
import { networkaxios } from "../../../../../axios";

const FormStep4 = (props) => {
  const [isformclose, setIsformclose] = useState(false);
  const {
    handleChangeFormInput,
    formData,
    setService,
    service,
    closeCustomiser,
    openCustomiser,
    setSelectedPlan,
    selectedPlan,
    errors,
    setFormErrors,
    setDueDate,
  } = props;

  const { validate } = useFormValidation(requiredFieldsKYCForm);

  const checkFieldValidity = (fieldName, parent) => {
    const validationErrors = validate(formData);
    let vErrors = {};
    if (validationErrors[fieldName]) {
      vErrors[fieldName] = validationErrors[fieldName];
    }

    const noErrors = Object.keys(vErrors).length === 0;

    if (noErrors) {
      setFormErrors({ ...errors, ...{ [fieldName]: "" } });
    }
    setFormErrors({ ...errors, ...{ [fieldName]: vErrors[fieldName] } });
  };

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }
  console.log(formData, "formDataformData");

  //This function will be used for validation of individual fields
  const handleInputBlur = (e, fieldName, parent) => {
    checkEmptyValue(e);
    checkFieldValidity(fieldName, parent);
  };

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    handleChangeFormInput({
      name,
      value,
    });
    if (event.target.name == "ippool") {
      getStaticIP(event.target.value);
    }
  };

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  useEffect(() => {
    adminaxios
      .get(`accounts/area/${props.formData && props.formData.area}/plans`)
      // .get(`franchise/${JSON.parse(localStorage.getItem("token")).franchise.id}/plans`)
      .then((res) => {
        setService([...res.data]);
      })
      .catch((error) => console.log(error, "errors in getting service data"));
  }, []);

  const close = () => {
    setIsformclose(true);
    closeCustomiser(true);
    document.querySelector(".customizer-contain").classList.remove("open");
  };

  const open = () => {
    openCustomiser();
    document.querySelector(".customizer-contain").classList.add("open");
  };

  const handleSelectedPlanChange = (e) => {
    e.persist();
    const target = e.target;
    handleChangeFormInput({
      name: "plan_name",
      value: target.children[target.selectedIndex].textContent,
    });
    handleChangeFormInput({
      name: "service_plan",
      value: target.value,
    });
    let ID = target.value;
    let currentSelectedPlan = service.filter((item) => item.id == ID)[0];
    setSelectedPlan({
      ...currentSelectedPlan,
      final_total_plan_cost: currentSelectedPlan.total_plan_cost,
      // discount_amount_total_plan_cost: currentSelectedPlan.total_plan_cost
    });
  };
  const packvaliditycal =
    (selectedPlan.time_unit ? selectedPlan.time_unit : "") +
    (selectedPlan.offer_time_unit ? selectedPlan.offer_time_unit : "");

  const getNewDateForDueDate = () => {
    const { unit_type, time_unit, offer_time_unit } = selectedPlan;
    let addUnitType = "days";
    switch (unit_type) {
      case "mon":
        addUnitType = "M";
        break;
      case "week":
        addUnitType = "W";
        break;
      case "day":
        addUnitType = "d";
        break;
      case "hour":
        addUnitType = "h";
        break;
      case "min":
        addUnitType = "m";
        break;
      default: {
        addUnitType = "h";
      }
    }

    const new_date = moment(props.startDate)
      .add(time_unit + offer_time_unit, addUnitType)
      .format("YYYY-MM-DD");
    return new_date;
  };

  var due_date = moment(getNewDateForDueDate(formData))
    .subtract(0, "days")
    .format("YYYY-MM-DD");

  useEffect(() => {
    setDueDate(due_date);
  }, [formData.time_unit]);

  // ip address
  const ipAddress = {
    guide: true,
    mask: (value) => {
      let result = [];
      const chunks = value.split(".");

      for (let i = 0; i < 4; ++i) {
        const chunk = (chunks[i] || "").replace(/_/gi, "");

        if (chunk === "") {
          result.push(/\d/, /\d/, /\d/, ".");
          continue;
        } else if (+chunk === 0) {
          result.push(/\d/, ".");
          continue;
        } else if (
          chunks.length < 4 ||
          (chunk.length < 3 && chunks[i].indexOf("_") !== -1)
        ) {
          if (
            (chunk.length < 2 && +`${chunk}00` > 255) ||
            (chunk.length < 3 && +`${chunk}0` > 255)
          ) {
            result.push(/\d/, /\d/, ".");
            continue;
          } else {
            result.push(/\d/, /\d/, /\d/, ".");
            continue;
          }
        } else {
          result.push(...new Array(chunk.length).fill(/\d/), ".");
          continue;
        }
      }

      result = result.slice(0, -1);
      return result;
    },
    pipe: (value) => {
      if (value === "." || value.endsWith("..")) return false;

      const parts = value.split(".");

      if (
        parts.length > 4 ||
        parts.some((part) => part === "00" || part < 0 || part > 255)
      ) {
        return false;
      }

      return value;
    },
  };

  // static ip

  const [BasicLineTab, setBasicLineTab] = useState("2");
  function togglesnmp() {
    props.setTogglesnmpState(props.togglesnmpState === "off" ? "on" : "off");
    handleChangeFormInput({
      name: "static_ip_switch",
      value: props?.togglesnmpState === "off" ? "on" : "off",
    });
    handleChangeFormInput({
      name: "static_ip_cost",
      value: "",
    });
    handleChangeFormInput({
      name: "static_ip_bind",
      value: "",
    });
    handleChangeFormInput({
      name: "ippool",
      value: "",
    });
    props.setIsShow(!props.isShow);
  }

  // useEffect(() => {
  //   console.log(selectedPlan?.is_static_ip,"selectedPlan?.is_static_ip")
  //   if (selectedPlan?.is_static_ip === 1) {
  //     props.setTogglesnmpState("on");
  //     props.setIsShow(true)
  //     console.log("hii")
  //   }else if(selectedPlan?.is_static_ip === 0){
  //     props.setTogglesnmpState("off");
  //     props.setIsShow(false)
  //   }
  // }, [selectedPlan]);

  useEffect(() => {

    if (selectedPlan?.is_static_ip === 1) {
      props.setTogglesnmpState(props.togglesnmpState === "on" ? "on" : "on");
    handleChangeFormInput({
      name: "static_ip_switch",
      value: props?.togglesnmpState === "on" ? "on" : "on",
    });
    handleChangeFormInput({
      name: "static_ip_cost",
      value: "",
    });
    handleChangeFormInput({
      name: "static_ip_bind",
      value: "",
    });
    handleChangeFormInput({
      name: "ippool",
      value: "",
    });
    props.setIsShow(true);
    } else if( selectedPlan?.is_static_ip === 0) {
      props.setTogglesnmpState(props.togglesnmpState === "off" ? "off" : "off");
    handleChangeFormInput({
      name: "static_ip_switch",
      value: props?.togglesnmpState === "off" ? "off" : "off",
    });
    handleChangeFormInput({
      name: "static_ip_cost",
      value: "",
    });
    handleChangeFormInput({
      name: "static_ip_bind",
      value: "",
    });
    handleChangeFormInput({
      name: "ippool",
      value: "",
    });
    props.setIsShow(false);
    }
  }, [selectedPlan]);

  // serial number
  const [serialNumber, setSerialNumber] = useState("off");
  const [serialShow, setSerailShow] = useState(false);
  function serialtoggle() {
    setSerialNumber(serialNumber === "off" ? "on" : "off");
    handleChangeFormInput({
      name: "serial_no_switch",
      value: serialNumber === "off" ? "on" : "off",
    });
    handleChangeFormInput({
      name: "static_ip_cost",
      value: "",
    });
    setSerailShow(!serialShow);
  }
  // function for discounted amount

  const [discountisShow, setDiscountisShow] = useState(false);

  //state and api for IP POOL
  const [ipPool, setIpPool] = useState([]);
  // pool list
  useEffect(() => {
  
    networkaxios
      .get(`network/ippool/${props.formData && props.formData.area}/get`)
      .then((res) => {
        setIpPool([...res.data]);
      });
  }, []);

  // sttaic iplist
  const [staticIP, setStaticIP] = useState([]);
  // static ip
  const getStaticIP = (val) => {
    networkaxios.get(`network/ippool/used_ips/${val}`).then((res) => {
      let { available_ips } = res.data;
      setStaticIP([...available_ips]);
      props.setStaticIPCost(res.data);
    });
  };
  // sorting staticip's
  const strAscending = [...staticIP]?.sort((a, b) => (a.ip > b.ip ? 1 : -1));

  //use effect for discount
  useEffect(() => {
    let finalAmountdiscount =
      (props.ondiscountcheckupgradeplan *
        Number(selectedPlan.total_plan_cost)) /
        //  +
        // Number(formData.static_ip_cost ? formData.static_ip_cost : 0)
      100;

    setSelectedPlan({
      ...selectedPlan,
      final_total_plan_cost:
        Number(selectedPlan.total_plan_cost) - finalAmountdiscount.toFixed(2),
      discount_amount_total_plan_cost: finalAmountdiscount,
    });
  }, [props.ondiscountcheckupgradeplan]);
  //end

  function discount() {
    props.setDiscountAmount(props?.discountAmount === "off" ? "on" : "off");
    handleChangeFormInput({
      name: "discount_switch",
      value: props?.discountAmount === "off" ? "on" : "off",
    });
    handleChangeFormInput({
      name: "final_total_plan_cost",
      value: "",
    });
    handleChangeFormInput({
      name: "discount",
      value: "",
    });
    handleChangeFormInput({
      name: "discount_amount_total_plan_cost",
      value: "",
    });

    setDiscountisShow(!discountisShow);
    if (props.discountAmount === "on") {
      props.setOndiscountcheckupgradeplan(0);
    }
  }
  // removed space from top line 349 by Marieya
  //mac address regex function code
  var macAddress = document.getElementById("macAddress");

  function formatMAC(e) {
    var r = /([a-f0-9]{2})/i;
    var str = e.target.value.replace(/[^a-f0-9:]/gi, "");
    if (e.keyCode != 8 && r.test(str.slice(-2))) {
      str = str.concat(":");
    }
    e.target.value = str.slice(0, 17);
  }
  macAddress && macAddress.addEventListener("keyup", formatMAC, false);

  return (
    <React.Fragment>
      <Box>
        <Grid>
          <Nav className="border-tab1" tabs>
            <NavItem>
              <NavLink>{"PERSONAL DETAILS"}</NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="#javascript"
                className={BasicLineTab === "2" ? "active" : ""}
                onClick={() => setBasicLineTab("2")}
              >
                {"SERVICE DETAILS"}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink>{"PAYMENT OPTIONS"}</NavLink>
            </NavItem>
          </Nav>
        </Grid>
      </Box>
      <AllPlansRightSidePanel
        closeCustomizer={close}
        setSelectedPlan={setSelectedPlan}
        handleChangeFormInput={handleChangeFormInput}
        isformclose={isformclose}
      />

      <Row>
        <Col sm="3" style={{ position: "relative", right: "6px" }}>
          <p className="form-heading-style">{"Service Plans"}</p>
        </Col>
      </Row>
      <Row>
        <Col sm="1" style={{ position: "relative", top: "10px" }}>
          <p className="service_plan" onClick={() => open()}>
            All Plans
          </p>
        </Col>
        <Col sm="6">
          <>
            <div
              className={`franchise-switch ${
                formData && formData.static_ip_switch
                  ? formData.static_ip_switch
                  : "off"
              }`}
              onClick={togglesnmp}
              style={{ top: "9px" }}
            />{" "}
            <Label className="KYC_togglename">Static IP </Label>
          </>
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          <>
            <div
              className={`franchise-switch ${props.discountAmount}`}
              onClick={discount}
              style={{ top: "9px" }}
            />{" "}
            <Label className="KYC_togglename">Discount</Label>
          </>
        </Col>
      </Row>
      <br />
      <Row>
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label" style={{ whiteSpace: "nowrap" }}>
                Plan *
              </Label>
              <Input
                type="select"
                name="service_plan"
                className={`form-control digits ${
                  formData && !formData.service_plan ? "" : "not-empty"
                }`}
                onChange={(event) => {
                  handleSelectedPlanChange(event);
                }}
                onBlur={checkEmptyValue}
                value={formData && formData.service_plan}
              >
                <option style={{ display: "none" }}></option>

                {service.map((typesplan) => (
                  <option key={typesplan.id} value={typesplan.id}>
                    {typesplan.package_name}
                  </option>
                ))}
              </Input>
            </div>
            <span className="errortext">
              {errors.service_plan && "Selection is required"}
            </span>
          </FormGroup>
        </Col>
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Pack Validity *</Label>
              <Input
                disabled={true}
                className={`form-control ${
                  formData && !formData.time_unit ? "" : "not-empty"
                }`}
                type="text"
                name="time_unit"
                // value={
                //   packvaliditycal &&
                //   packvaliditycal + " " + selectedPlan.unit_type + "(s)"
                // }
                 // Sailaja modified  mon(s) to Month(s) in KYC Form-> Service Details (Service Plans)-> Pack Validity Dropdown on 4th April 2023
                 value={
                  packvaliditycal &&
                  packvaliditycal + " " + selectedPlan.unit_type.charAt(0).toUpperCase() + selectedPlan.unit_type.slice(1) + "th" + "(s)"
                }
                onBlur={(e) => handleInputBlur(e, "Service Plan", "")}
              />
            </div>
            <span className="errortext">
              {errors.time_unit && "Field is required"}
            </span>
          </FormGroup>
        </Col>
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Upload Speed *</Label>
              <Input
                className={`form-control ${
                  formData && !formData.upload_speed ? "" : "not-empty"
                }`}
                type="number"
                name="upload_speed"
                value={selectedPlan.upload_speed}
                onBlur={(e) => handleInputBlur(e, "upload_speed", "")}
                min="0"
                disabled={true}
                onKeyDown={(evt) =>
                  (evt.key === "e" ||
                    evt.key === "E" ||
                    evt.key === "." ||
                    evt.key === "-") &&
                  evt.preventDefault()
                }
              />
            </div>
            <span className="errortext">
              {errors.upload_speed && "Field is required"}
            </span>
          </FormGroup>
        </Col>
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Download Speed *</Label>
              <Input
                className={`form-control ${
                  formData && !formData.download_speed ? "" : "not-empty"
                }`}
                type="number"
                name="download_speed"
                disabled={true}
                value={selectedPlan.download_speed}
                onBlur={(e) => handleInputBlur(e, "download_speed", "")}
                min="0"
                onKeyDown={(evt) =>
                  (evt.key === "e" ||
                    evt.key === "E" ||
                    evt.key === "." ||
                    evt.key === "-") &&
                  evt.preventDefault()
                }
              />
            </div>
            <span className="errortext">
              {errors.download_speed && "Field is required"}
            </span>
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Data Limit</Label>
              <Input
                className={`form-control ${
                  formData && !formData.data_limit ? "" : "not-empty"
                }`}
                type="number"
                name="data_limit"
                value={selectedPlan.fup_limit}
                onChange={handleInputChange}
                min="0"
                disabled={true}
                onKeyDown={(evt) =>
                  (evt.key === "e" ||
                    evt.key === "E" ||
                    evt.key === "." ||
                    evt.key === "-") &&
                  evt.preventDefault()
                }
                onBlur={(e) => handleInputBlur(e, "data_limit", "")}
              />
            </div>
            <span className="errortext">
              {errors.data_limit && "Field is required"}
            </span>
          </FormGroup>
        </Col>
        <Col sm="3">
          <FormGroup>
            <div class="input_wrap">
              <Label className="kyc_label">Plan Cost</Label>
              <Input
                className={`form-control ${
                  formData && isValueZero(formData.plan_cost)
                    ? "not-empty"
                    : !formData.plan_cost
                    ? ""
                    : "not-empty"
                }`}
                type="number"
                min="0"
                class="form-control"
                disabled={true}
                name="plan_cost"
                value={Number(selectedPlan.plan_cost)}
                onChange={handleInputChange}
                onBlur={(e) => handleInputBlur(e, "plan_cost", "")}
              />
            </div>
            <span className="errortext">{errors.plan_cost}</span>
          </FormGroup>
        </Col>
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Plan SGST</Label>
              <Input
                className={`form-control ${
                  formData && isValueZero(formData.plan_SGST)
                    ? "not-empty"
                    : !formData.plan_SGST
                    ? ""
                    : "not-empty"
                }`}
                value={selectedPlan.plan_sgst}
                type="number"
                name="plan_SGST"
                onChange={handleInputChange}
                min="0"
                disabled={true}
                onKeyDown={(evt) =>
                  (evt.key === "e" ||
                    evt.key === "E" ||
                    evt.key === "." ||
                    evt.key === "-") &&
                  evt.preventDefault()
                }
                onBlur={(e) => handleInputBlur(e, "plan_SGST", "")}
              />
            </div>
            <span className="errortext">
              {errors.plan_SGST && "Field is required"}
            </span>
          </FormGroup>
        </Col>
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Plan CGST</Label>
              <Input
                className={`form-control ${
                  formData && isValueZero(formData.plan_CGST)
                    ? "not-empty"
                    : !formData.plan_CGST
                    ? ""
                    : "not-empty"
                }`}
                type="number"
                name="plan_CGST"
                disabled={true}
                onChange={handleInputChange}
                onBlur={(e) => handleInputBlur(e, "plan_CGST", "")}
                value={selectedPlan.plan_cgst}
                min="0"
                onKeyDown={(evt) =>
                  (evt.key === "e" ||
                    evt.key === "E" ||
                    evt.key === "." ||
                    evt.key === "-") &&
                  evt.preventDefault()
                }
              />
            </div>
            <span className="errortext">
              {errors.plan_CGST && "Field is required"}
            </span>
          </FormGroup>
        </Col>
      </Row>

      <Row></Row>

      <Row>
        {" "}
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Total Cost</Label>
              <Input
                // className={`form-control ${
                //   formData && !formData.total_plan_cost ? "" : "not-empty"
                // }`}
                className={`form-control ${
                  formData && isValueZero(formData.total_plan_cost)
                    ? "not-empty"
                    : !formData.total_plan_cost
                    ? ""
                    : "not-empty"
                }`}
                type="number"
                name="total_plan_cost"
                onChange={handleInputChange}
                onBlur={(e) => handleInputBlur(e, "total_plan_cost", "")}
                value={Number(selectedPlan.total_plan_cost)}
                min="0"
                onKeyDown={(evt) =>
                  (evt.key === "e" ||
                    evt.key === "E" ||
                    evt.key === "." ||
                    evt.key === "-") &&
                  evt.preventDefault()
                }
                disabled={true}
              />
            </div>
            <span className="errortext">
              {errors.total_plan_cost && "Field is required"}
            </span>
          </FormGroup>
        </Col>
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              {/* Sailaja Changed Mac ID to MAC ID on 27th March 2023  */}
              <Label className="kyc_label">MAC ID</Label>
              <Input
                id="macAddress"
                className={`form-control ${
                  formData && isValueZero(formData.mac_bind)
                    ? "not-empty"
                    : !formData.mac_bind
                    ? ""
                    : "not-empty"
                }`}
                value={selectedPlan.mac_bind}
                name="mac_bind"
                onChange={handleInputChange}
                onBlur={(e) => handleInputBlur(e, "mac_bind", "")}
              />
            </div>
          </FormGroup>
        </Col>
        {formData && formData.static_ip_switch == "on" ? (
          <>
            <Col sm="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">IP Pool</Label>
                  <Input
                    type="select"
                    // className="form-control digits"
                    className={`form-control digits ${
                      formData && formData.ip_pool_name ? "not-empty" : ""
                    }`}
                    onChange={handleInputChange}
                    name="ippool"
                    value={formData && formData.ippool}
                  >
                    <option style={{ display: "none" }}></option>
                    {ipPool.map((ipPools) => (
                      <option key={ipPools.id} value={ipPools.id}>
                        {ipPools.name}
                      </option>
                    ))}
                  </Input>
                </div>
              </FormGroup>
            </Col>
            <>
              <Col sm="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Static IP</Label>
                    <Input
                      type="select"
                      // className="form-control digits"
                      className={`form-control  ${
                        formData && formData.static_ip_bind ? "not-empty" : ""
                      }`}
                      onChange={(event) => {
                        handleInputChange(event);
                        props.setSelectStatic(event.target.value);
                      }}
                      name="static_ip_bind"
                      value={formData && formData.static_ip_bind}
                    >
                      <option style={{ display: "none" }}></option>
                      {strAscending.map((staticIPs) => (
                        <option key={staticIPs.ip} value={staticIPs.ip}>
                          {staticIPs.ip}
                        </option>
                      ))}
                    </Input>
                  </div>
                </FormGroup>
              </Col>
            </>

            {/*Static Ip Cost with autopopulated cost*/}

            <Col sm="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Static IP Cost</Label>
                  <Input
                    type="text"
                    // className="form-control digits"
                    className={`form-control  ${
                      formData && formData.static_ip_cost ? "not-empty" : ""
                    }`}
                    onChange={handleInputChange}
                    name="static_ip_cost"
                    disabled={true}
                    // value={props.staticIPCost.cost_per_ip}
                    value={props?.totalAmountCal?.radius_info?.static_ip_total_cost}
                  ></Input>
                </div>
              </FormGroup>
            </Col>
          </>
        ) : (
          ""
        )}
        {/*commented off static ip addition in line 946*/}
        {formData.discount_switch === "on" ? (
          <>
            <Col sm="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Final Amount To Be Paid</Label>
                  <Input
                    type="number"
                    disabled={true}
                    className="form-control digits not-empty"
                    name="final_total_plan_cost"
                    value={
                      props?.totalAmountCal?.amount
                      // Number(selectedPlan.final_total_plan_cost)
                      //  +  Number(formData.static_ip_cost || 0)
                    }
                  />
                </div>
              </FormGroup>
            </Col>
            <Col sm="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Enter Discount</Label>
                  <Input
                    // className="not-empty"
                    className={`form-control ${
                      formData && !formData.discount ? "not-empty" : ""
                    }`}
                    type="number"
                    name="discount"
                    onBlur={checkEmptyValue}
                    min="0"
                    max="100"
                    onKeyDown={(evt) =>
                      (evt.key === "e" ||
                        evt.key === "E" ||
                        evt.key === "." ||
                        evt.key === "-") &&
                      evt.preventDefault()
                    }
                    onChange={(e) => {
                      const value = e.target.value <= 100 ? e.target.value : 100;
                      props.setOndiscountcheckupgradeplan(value);
                    }}
                    value={props.ondiscountcheckupgradeplan}
                  />
                </div>
              </FormGroup>
            </Col>
            <Col sm="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Total Amount Discounted</Label>
                  <Input
                    type="number"
                    disabled={true}
                    className="form-control digits not-empty"
                    name="discount_amount_total_plan_cost"
                    value={Number(selectedPlan.discount_amount_total_plan_cost)}
                  />
                </div>
              </FormGroup>
            </Col>
          </>
        ) : (
          ""
        )}
      </Row>
      <Row>
        <Col sm="12">
          <div className="dividing_line"></div>
        </Col>
      </Row>

      <FormStep5 formTitle={"Installation Charges"} />
      <Row>
        <Col sm="12">
          <div className="dividing_line"></div>
        </Col>
      </Row>
      <FormStep6 formTitle={"Billing"} />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { formData, showCustomizer, selectedPlan, service, errors, startDate } =
    state.KYCForm;
  return {
    formData,
    showCustomizer,
    selectedPlan,
    service,
    errors,
    startDate,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFormErrors: (payload) => dispatch(setFormErrors(payload)),
    handleChangeFormInput: (payload) =>
      dispatch(handleChangeFormInput(payload)),
    setService: (payload) => dispatch(setService(payload)),
    clearService: () => dispatch(clearService()),
    openCustomiser: () => dispatch(openCustomiser()),
    closeCustomiser: () => dispatch(closeCustomiser()),
    clearSelectedPlan: () => dispatch(clearSelectedPlan()),
    setSelectedPlan: (payload) => dispatch(setSelectedPlan(payload)),
    setDueDate: (payload) => dispatch(setDueDate(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormStep4);
