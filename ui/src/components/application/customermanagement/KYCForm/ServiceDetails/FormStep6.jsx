import React, { useState } from "react";
import moment from "moment";
import { Row, Col, FormGroup, Input, Label } from "reactstrap";
import { connect } from "react-redux";
import {
  handleChangeFormInput,
  setFormErrors,
  setStartDate,
} from "../../../../../redux/kyc-form/actions";
import useFormValidation from "../../../../customhooks/FormValidation";
import { requiredFieldsKYCForm } from "../../../../../utils";

const FormStep6 = (props) => {
  const { validate, Error } = useFormValidation(requiredFieldsKYCForm);
  const [reccur, setReccur] = useState("");
  const [planreccur, setPlanReccur] = useState("");

  const {
    formTitle,
    handleChangeFormInput,
    formData,
    errors,
    setFormErrors,
    previousDay,
    setStartDate,
    startDate,
  } = props;
  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    handleChangeFormInput({
      name,
      value,
    });
  };

  const handleChange = (date) => {
    setStartDate(date.target.value);
  };

  const handlePlanTypeChange = (event) => {
    handleInputChange(event);
    let typeValue = event.target.value;
    setReccur(typeValue);
    setPlanReccur(typeValue);
    if (typeValue === "prepaid") {
      handleChangeFormInput({ name: "plan_recurring", value: "" });
      handleChangeFormInput({ name: "plan_recurring_period", value: "" });
    }
    if (typeValue == "") checkFieldValidity("plan_type", "");
  };

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

  //This function will be used for validation of individual fields
  const handleInputBlur = (e, fieldName, parent) => {
    checkEmptyValue(e);
    checkFieldValidity(fieldName, parent);
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm="12" style={{ display: "flex" }}>
          <p className="form-heading-style" style={{ marginTop: "7px" }}>
            {"Billing Dates"}
          </p>
        </Col>
      </Row>
      <br />
      <Row>
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
            <Label className="kyc_label">Plan Type *</Label>
              <Input
                type="select"
                name="plan_type"
                className={`form-control ${
                  formData && !formData.plan_type ? "" : "not-empty"
                }`}
                onChange={(event) => {
                  handlePlanTypeChange(event);
                }}
                value={formData.plan_type}
                onBlur={(e) => handleInputBlur(e, "plan_type", "")}
              >
                <option value="" style={{ display: "none" }}></option>

                <option value="prepaid">Prepaid</option>
                <option value="postpaid">Postpaid</option>
                {/* <option value="postpaid">One Time</option> */}
              </Input>
             
            </div>
            <span className="errortext">
              {errors.plan_type && "Selection is required"}
            </span>
          </FormGroup>
        </Col>
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
            <Label className="kyc_label">Notifications</Label>
              <Input
                type="select"
                name="notifications"
                className={`form-control ${
                  formData && !formData.notifications ? "" : "not-empty"
                }`}
                onChange={(event) => {
                  handleInputChange(event);
                }}
                value={formData.notifications}
                onBlur={(e) => handleInputBlur(e, "notifications", "")}
              >
                <option value="" style={{ display: "none" }}></option>

                <option value="email">Email</option>
                <option value="sms">SMS</option>
                {/* <option value="postpaid">Push Notifications</option>
                <option value="postpaid">IVR Calls</option> */}
              </Input>
             
            </div>
          </FormGroup>
        </Col>
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Billing Date</Label>

              <Input
                className="form-control digits"
                type="date"
                value={startDate}
                name="billing_date"
                onChange={handleChange}
                disabled={true}
              />
            </div>
          </FormGroup>
        </Col>
        <Col sm="3" >
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Due Date</Label>

              <Input
                className="form-control digits"
                type="date"
                name="duedate"
                value={previousDay}
                disabled={true}
              />
            </div>
          </FormGroup>
        </Col>
        
       
      </Row>
      <Row>

      <Col sm="3">
          <FormGroup>
            <div className="input_wrap" hidden={formData.plan_type != "prepaid"}>
            <Label className="kyc_label">Recurring Invoice</Label>
              <Input
                type="select"
                name="plan_recurring"
                onChange={(event) => {
                  handleInputChange(event);
                }}
                value={formData.plan_recurring}
                onBlur={(e) => handleInputBlur(e, "plan_recurring", "")}
                className={`form-control ${
                  formData && !formData.plan_recurring ? "" : "not-empty"
                }`}
              >
                <option value="" style={{ display: "none" }}></option>

                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Input>
             
            </div>
          </FormGroup>
        </Col>
        <Col sm="3" hidden={formData.plan_type != "prepaid"}>
          <FormGroup>
            <div className="input_wrap">
            <Label className="kyc_label">Recurring Period</Label>
              <Input
                type="select"
                name="plan_recurring_period"
                className="form-control digits not-empty"
                onChange={(event) => {
                  handleInputChange(event);
                }}
                value={formData.plan_recurring_period}
                onBlur={(e) => handleInputBlur(e, "plan_recurring_period", "")}
                disabled={true}
              >
                <option value="monthly" selected>
                  Monthly
                </option>
                <option value="3 months">3 Months</option>
                <option value="6 months">6 Months</option>
                <option value="anually">Annually</option>
              </Input>
             
            </div>
          </FormGroup>
        </Col>
      </Row>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { formData, errors, previousDay, startDate } = state.KYCForm;
  return {
    formData,
    errors,
    previousDay,
    startDate,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFormErrors: (payload) => dispatch(setFormErrors(payload)),
    handleChangeFormInput: (payload) =>
      dispatch(handleChangeFormInput(payload)),
    setStartDate: (payload) => dispatch(setStartDate(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormStep6);
