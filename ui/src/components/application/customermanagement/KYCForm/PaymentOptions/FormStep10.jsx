import React, { useState } from "react";
import { Row, Col, FormGroup, Input, Label } from "reactstrap";
import { connect } from "react-redux";
import {
  handleChangeFormInput,
  setFormErrors,
  toggleImageUploadModal,
} from "../../../../../redux/kyc-form/actions";
import PaymentList from "../../paymentlist";
import OfflinePayment from "../../offlinepayment";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CASH from "../../../../../assets/images/cash.png";
import { Nav, NavItem, NavLink } from "reactstrap";

const FormStep10 = (props) => {
  const {
    errors,
    selectedPlan,
    submitdata,
    setSelectedPaymentId,
    setShowPayment,
    showPayment,isEmailShow,istelShow,iswhatsShow
  } = props;
  // const [showpaymenttype, SetShowpaymenttype] = useState(false);
  const [paymentRadiovalue, setPaymentRadiovalue] = useState("Offline");
  // const Paymentmodaltoggle = () => SetShowpaymenttype(!showpaymenttype);
  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }
  // if 3 month plan is slected static_ip_cost is multiplied with time_unit(3m)

  const totalGSTS = props?.selectedPlan?.plan_cgst === 0 &&  props.isShow === true ? ( props?.selectedPlan?.total_plan_cost) *.18:0;
  let totalPayableAmount =
    parseFloat(selectedPlan.final_total_plan_cost) +
    parseFloat(props.formData.installation_charges) +
    parseFloat(props.formData.security_deposit)
    + parseFloat(
      props.staticIPCost?.cost_per_ip
        ? props.staticIPCost?.cost_per_ip
        : 0
    ) * selectedPlan.time_unit + totalGSTS

  const withoutStaticCost =  parseFloat(props.totalAmountCal?.amount) +
  parseFloat(props.formData?.installation_charges) +
  parseFloat(props.formData?.security_deposit)


  const basedOnstatic = withoutStaticCost

  const [BasicLineTab, setBasicLineTab] = useState("3");
  // removed above space for line 123 payment details by Marieya
  return (
    <React.Fragment>
      <Box>
        <Grid>
          <Nav className="border-tab1" tabs>
            <NavItem>
              <NavLink>{"PERSONAL DETAILS"}</NavLink>
            </NavItem>
            <NavItem>
              <NavLink>{"SERVICE DETAILS"}</NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="#javascript"
                className={BasicLineTab === "3" ? "active" : ""}
                onClick={() => setBasicLineTab("3")}
              >
                {"PAYMENT OPTIONS"}
              </NavLink>
            </NavItem>
          </Nav>
        </Grid>
      </Box>
      <Row>
        <Col sm="12" style={{ display: "flex" }}>
          <p className="form-heading-style" style={{ marginTop: "7px" }}>
            {"Payment Details"}
          </p>
        </Col>
      </Row>
      <br />
      <Row>
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Total Payable Amount</Label>
              <Input
                className={`form-control ${props.formData && !props.formData.plan_cost ? "" : "not-empty"
                  }`}
                type="number"
                name="plan_cost"
                onChange={({ name, value }) =>
                  handleChangeFormInput({
                    name,
                    value,
                    parent: null,
                  })
                }
                onBlur={checkEmptyValue}
                disabled={true}
                value={parseFloat(basedOnstatic).toFixed(0)}
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
              {errors.total_plan_cost && "Field is required"}
            </span>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <p className="payment_method">Payment Method</p>
        </Col>
      </Row>
      <Row
        style={{
          marginLeft: "0.5rem",
        }}
      >
        <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <div className="radio radio-primary">
                <Input
                  id="radio11"
                  type="radio"
                  name="radio1"
                  value="option1"
                  checked={paymentRadiovalue === "send to phone"}
                  onClick={(e) => {
                    if (e.target.checked) setPaymentRadiovalue("send to phone");
                  }}
                />
                <Label for="radio11">
                  {Option}
                  <span style={{ color: "#2b2b2b" }}>Online</span>
                </Label>
              </div>
            </div>
          </FormGroup>
        </Col>
        <Col sm="4">
          <FormGroup>
            <div className="input_wrap">
              <div className="radio radio-primary">
                <Input
                  id="radio33"
                  type="radio"
                  name="radio1"
                  value="option1"
                  defaultChecked
                  checked={paymentRadiovalue === "Offline"}
                  onClick={() => {
                    setPaymentRadiovalue("Offline");
                  }}
                />

                <Label for="radio33">
                  {Option}
                  <span style={{ color: "#2b2b2b" }}>Offline</span>
                </Label>
              </div>
            </div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        {paymentRadiovalue === "Offline" ? (
          <>
            <Col sm="4"></Col>
            <Col sm="4">
              <img src={CASH} />
              <OfflinePayment
                isShow={props.isShow}
                selectedPlan={selectedPlan}
                totalPayableAmount={basedOnstatic}
                // showpaymenttype={showpaymenttype}
                // Paymentmodaltoggle={Paymentmodaltoggle}
                formData={props.formData}
                staticIPCost={props.staticIPCost}
                istelShow={istelShow}
                iswhatsShow={iswhatsShow}
                isEmailShow={isEmailShow}
                totalAmountCal={props.totalAmountCal}
              // setPaymentRadiovalue={setPaymentRadiovalue}
              />
            </Col>
          </>
        ) : paymentRadiovalue === "send to phone" ? (
          <>
            <Col sm="6">
              <PaymentList
                priorCheck={props.priorCheck}
                setSelectedPaymentId={setSelectedPaymentId}
                setShowPayment={setShowPayment}
                showPayment={showPayment}
                submitdata={submitdata}
                formData={props.formData}
              />
            </Col>
            <Col sm="6"></Col>
          </>
        ) : (
          ""
        )}
      </Row>

      <br />
      <Row
        style={{
          paddingLeft: "10%",
          paddingRight: "10%",
          marginLeft: "0.2rem",
        }}
      >
        {/* {showPayment && (
          <PaymentList
            setSelectedPaymentId={setSelectedPaymentId}
            setShowPayment={setShowPayment}
            showPayment={showPayment}
            submitdata={submitdata}
            
           
          />)} */}
        {/* {showpaymenttype === "Online" ? (
<>
        {showPayment && (
          <PaymentList
            setSelectedPaymentId={setSelectedPaymentId}
            setShowPayment={setShowPayment}
            showPayment={showPayment}
            submitdata={submitdata}
            
           
          />
        )}
        </>): showpaymenttype === "Offline" ? (
                     <OfflinePayment
                     selectedPlan={selectedPlan}
                     totalPayableAmount={totalPayableAmount}
                     setSelectedPaymentId={setSelectedPaymentId}
                     setShowPayment={setShowPayment}
                     showPayment={showPayment}
                     submitdata={submitdata}/>
                     
                    ):""} */}

        {/* <Modal isOpen={showpaymenttype} toggle={Paymentmodaltoggle} centered backdrop="static">
                    <OfflinePayment
                     selectedPlan={selectedPlan}
                     totalPayableAmount={totalPayableAmount}  
                     showpaymenttype={showpaymenttype}  
                     Paymentmodaltoggle={Paymentmodaltoggle} 
                     formData={props.formData}
                     setPaymentRadiovalue={setPaymentRadiovalue}
                     /> 
                    </Modal> */}
      </Row>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const {
    formData,
    errors,
    showImageUploadModal,
    customer_images,
    selectedPlan,
  } = state.KYCForm;
  return {
    errors,
    formData,
    showImageUploadModal,
    customer_images,
    selectedPlan,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFormErrors: (payload) => dispatch(setFormErrors(payload)),
    toggleImageUploadModal: () => dispatch(toggleImageUploadModal()),
    handleChangeFormInput: (payload) =>
      dispatch(handleChangeFormInput(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormStep10);
