import React, { useEffect } from "react";
import { Row, Col, FormGroup, Input, Label } from "reactstrap";
import {
  handleChangeFormInput,
  setPermanentAddressAsBillingAddress,
  setFormErrors,
  toggleSaveAsButton,
  togglePermanentAddress,
  setActiveBreadCrumb,
  setToggleState,
} from "../../../../../redux/kyc-form/actions";
import { connect } from "react-redux";
import useFormValidation from "../../../../customhooks/FormValidation";
import { requiredFieldsKYCForm } from "../../../../../utils";
import Grid from "@mui/material/Grid";
import FormStep9 from "../../KYCForm/Documents/FormStep9";

const FormStep3 = (props) => {
  const {
    address,
    permanent_address,
    handleChangeFormInput,
    setPermanentAddressAsBillingAddress,
    setFormErrors,
    errors,
    formData,
    toggleSaveAsButton,
    showPermanentAddress,
    togglePermanentAddress,
    setActiveBreadCrumb,
    toggleState,
    setToggleState, smsToggle, SMSToggle, emailToggle, EmailToggle,whatsappToggle,WHATSAPPToggle
  } = props;

  const { validate, Error } = useFormValidation(requiredFieldsKYCForm);

  const handleInputChange = (e, parent) => {
    const name = e.target.name;
    const value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
    handleChangeFormInput({
      name,
      value,
      parent: parent || null,
    });
    toggleState === "on" && setPermanentAddressAsBillingAddress(toggleState);
  };

  useEffect(() => {
    toggleState === "on" && setPermanentAddressAsBillingAddress(toggleState);
  }, []);

  const checkFieldValidity = (fieldName, parent) => {
    const doesHaveParent = Boolean(parent);
    const validationErrors = validate(formData);
    let vErrors = {};

    if (doesHaveParent && validationErrors[parent][fieldName]) {
      vErrors[parent] = {
        [fieldName]: validationErrors[parent][fieldName],
      };
    } else if (!doesHaveParent && validationErrors[fieldName]) {
      vErrors[fieldName] = validationErrors[fieldName];
    }

    console.log(formData,"formData")

    let noErrors = true;
    if (doesHaveParent)
      noErrors =
        !Boolean(vErrors[parent]) ||
        (vErrors[parent] && Object.keys(vErrors[parent]).length === 0);
    else noErrors = Object.keys(vErrors).length === 0;

    if (noErrors) {
      let newErrors = {};
      if (doesHaveParent)
        newErrors = {
          ...errors,
          [parent]: { ...errors[parent], [fieldName]: "" },
        };
      else newErrors = { ...errors, ...{ [fieldName]: "" } };

      setFormErrors({ ...newErrors });
    } else {
      let newErrors = {};
      if (doesHaveParent)
        newErrors = {
          ...errors,
          [parent]: {
            ...errors[parent],
            [fieldName]: vErrors[parent][fieldName],
          },
        };
      else newErrors = { ...errors, ...{ [fieldName]: vErrors[fieldName] } };
      setFormErrors(newErrors);
    }
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

  function togglefunc() {
    let toggle = toggleState === "off" ? "on" : "off";
    setToggleState(toggle);
    togglePermanentAddress(!showPermanentAddress);
    setActiveBreadCrumb(
      toggleState === "on" ? "permanent_address" : "billing_address"
    );
    setPermanentAddressAsBillingAddress(toggle);
    toggleSaveAsButton();
  }



  return (
    <React.Fragment>
      <React.Fragment>
        <Grid container spacing={4} style={{ marginTop: "2%" }}>
          <Grid item md={6}>
            <span className="info_cust"> Installation Address </span>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4} style={{ marginTop: "-2%" }}>
          <Grid item sm={3} md={3}>
            <FormGroup>
              <div className="input_wrap">
                <Label className="kyc_label">H.No </Label>
                <Input
                  className={`form-control ${address && !address.house_no ? "" : "not-empty"
                    }`}
                  type="text"
                  name="house_no"
                  onChange={(e) => handleInputChange(e, "address")}
                  onBlur={(e) => handleInputBlur(e, "house_no", "")}
                  value={(address && address.house_no) || ""}
                />
  <span className="errortext">{errors.house_no}</span>

              </div>
            </FormGroup>
          </Grid>
          <Grid item sm={3} md={3}>
            <FormGroup>
              <div className="input_wrap">
                <Label className="kyc_label">Street *</Label>
                <Input
                  className={`form-control ${address && !address.street ? "" : "not-empty"
                    }`}
                  style={{ textTransform: "capitalize" }}
                  type="text"
                  name="street"
                  onChange={(e) => handleInputChange(e, "address")}
                  onBlur={(e) => handleInputBlur(e, "street", "")}
                  value={(address && address.street) || ""}
                />

              </div>
              <span className="errortext">{errors.street}</span>
            </FormGroup>
          </Grid>
          <Grid item sm={3} md={3}>
            <FormGroup>
              <div className="input_wrap">
                <Label className="kyc_label">Pincode *</Label>
                <Input
                  className={`form-control ${address && !address.pincode ? "" : "not-empty"
                    }`}
                  type="text"
                  name="pincode"
                  onChange={(e) => handleInputChange(e, "address")}
                  onBlur={(e) => handleInputBlur(e, "pincode", "")}
                  value={(address && address.pincode) || ""}
                />

              </div>
              {errors.pincode && (
                <span className="errortext">{errors.pincode}</span>
              )}
            </FormGroup>
          </Grid>
          <Grid item sm={3} md={3}>
            <FormGroup>
              <div className="input_wrap">
                <Label className="kyc_label">Landmark *</Label>
                <Input
                  className={`form-control ${address && !address.landmark ? "" : "not-empty"
                    }`}
                  style={{ textTransform: "capitalize" }}
                  type="text"
                  name="landmark"
                  onChange={(e) => handleInputChange(e, "address")}
                  onBlur={(e) => handleInputBlur(e, "landmark", "")}
                  value={(address && address.landmark) || ""}
                />

              </div>
              <span className="errortext">{errors.landmark}</span>
            </FormGroup>
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          <Grid item sm={3} md={3}>
            <FormGroup>
              <div className="input_wrap">
                <Label className="kyc_label">City *</Label>
                <Input
                  className={`form-control ${address && !address.city ? "" : "not-empty"
                    }`}
                  style={{ textTransform: "capitalize" }}
                  type="text"
                  name="city"
                  onChange={(e) => handleInputChange(e, "address")}
                  onBlur={(e) => handleInputBlur(e, "city", "")}
                  value={address && address.city}
                />

              </div>
              <span className="errortext">{errors.city}</span>
            </FormGroup>
          </Grid>
          <Grid item sm={3} md={3}>
            <FormGroup>
              <div className="input_wrap">
                <Label className="kyc_label">District *</Label>
                <Input
                  className={`form-control ${address && !address.district ? "" : "not-empty"
                    }`}
                  style={{ textTransform: "capitalize" }}
                  type="text"
                  name="district"
                  onChange={(e) => handleInputChange(e, "address")}
                  onBlur={(e) => handleInputBlur(e, "district", "")}
                  value={address && address.district}
                />

              </div>
              <span className="errortext">{errors.district}</span>
            </FormGroup>
          </Grid>
          <Grid item sm={3} md={3}>
            <FormGroup>
              <div className="input_wrap">
                <Label className="kyc_label">State *</Label>
                <Input
                  className={`form-control ${address && !address.state ? "" : "not-empty"
                    }`}
                  style={{ textTransform: "capitalize" }}
                  type="text"
                  name="state"
                  onChange={(e) => handleInputChange(e, "address")}
                  onBlur={(e) => handleInputBlur(e, "state", "")}
                  value={address && address.state}
                />

              </div>
              <span className="errortext">{errors.state}</span>
            </FormGroup>
          </Grid>
          <Grid item sm={3} md={3}>
            <FormGroup>
              <div className="input_wrap">
                <Label className="kyc_label">Country *</Label>
                <Input
                  className={`form-control ${address && !address.country ? "" : "not-empty"
                    }`}
                  style={{ textTransform: "capitalize" }}
                  type="text"
                  name="country"
                  onChange={(e) => handleInputChange(e, "address")}
                  onBlur={(e) => handleInputBlur(e, "country", "")}
                  value={address && address.country}
                />

              </div>
              <span className="errortext">{errors.country}</span>
            </FormGroup>
          </Grid>
          <Grid container spacing={1}>
            <Grid item sm={3} md={3}>
              <Row>
                <Col sm="12" style={{ display: "flex", marginLeft: "6%" }}>
                  <p className="form-heading-style">{"Address Proof"}</p>
                </Col>
              </Row>
              <FormStep9 />
            </Grid>
          </Grid>
          <Grid container spacing={1} >
            <Grid item sm={12} md={12} style={{ paddingLeft: "40px" }}>
              <div className="dividing_line" ></div>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            style={{ marginTop: "0%", paddingLeft: "40px", marginTop: "2%" }}
          >
            <Grid item md={2}>
              <span className="permanent_address"> Permanent Address </span>
            </Grid>
            <Grid item md={4} >
              <div
                className={`franchise-switch ${toggleState}`}
                onClick={() => togglefunc()}
              />
              &nbsp;&nbsp;
            </Grid>
            <Grid item md={4}>
              <div
                style={{
                  paddingTop: "0.3rem",
                  marginLeft: "-82%",
                  whiteSpace: "nowrap",
                  fontFamily: "Open Sans",
                  fontStyle: "normal",
                  fontWeight: "600",
                  fontSize: "12px",
                  lineHeight: "20px",
                  position: "relative",
                  top: "-3%",
                }}
              >
                Same as Billing Address
              </div>
            </Grid>

          </Grid>
         
        </Grid>
      </React.Fragment>

      <React.Fragment>
        {showPermanentAddress ? (
          <>
            <Grid container spacing={4} style={{ marginTop: "0%" }}>
              <Grid item sm={3} md={3}>
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">H.No </Label>
                    <Input
                      className={`form-control ${permanent_address && !permanent_address.house_no
                        ? ""
                        : "not-empty"
                        }`}
                      type="text"
                      name="house_no"
                      onChange={(e) =>
                        handleInputChange(e, "permanent_address")
                      }
                      onBlur={(e) =>
                        handleInputBlur(e, "house_no", "permanent_address")
                      }
                      value={permanent_address && permanent_address.house_no}
                    />
  <span className="errortext">
                    {errors.permanent_address &&
                      errors.permanent_address.house_no}
                  </span>
                  </div>
                </FormGroup>
              </Grid>
              <Grid item sm={3} md={3}>

                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Landmark *</Label>
                    <Input
                      className={`form-control ${permanent_address && !permanent_address.landmark
                        ? ""
                        : "not-empty"
                        }`}
                      type="text"
                      name="landmark"
                      onChange={(e) =>
                        handleInputChange(e, "permanent_address")
                      }
                      onBlur={(e) =>
                        handleInputBlur(e, "landmark", "permanent_address")
                      }
                      value={permanent_address && permanent_address.landmark}
                    />

                  </div>
                  <span className="errortext">
                    {errors.permanent_address &&
                      errors.permanent_address.landmark}
                  </span>
                </FormGroup>
              </Grid>

              <Grid item sm={3} md={3}>
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Street *</Label>{" "}
                    <Input
                      className={`form-control ${permanent_address && !permanent_address.street
                        ? ""
                        : "not-empty"
                        }`}
                      type="text"
                      name="street"
                      onChange={(e) =>
                        handleInputChange(e, "permanent_address")
                      }
                      onBlur={(e) =>
                        handleInputBlur(e, "street", "permanent_address")
                      }
                      value={permanent_address && permanent_address.street}
                    />

                  </div>
                  <span className="errortext">
                    {errors.permanent_address &&
                      errors.permanent_address.street}
                  </span>
                </FormGroup>
              </Grid>
              <Grid item sm={3} md={3}>
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">City *</Label>
                    <Input
                      className={`form-control ${permanent_address && !permanent_address.city
                        ? ""
                        : "not-empty"
                        }`}
                      type="text"
                      name="city"
                      onChange={(e) =>
                        handleInputChange(e, "permanent_address")
                      }
                      onBlur={(e) =>
                        handleInputBlur(e, "city", "permanent_address")
                      }
                      value={permanent_address && permanent_address.city}
                    />

                  </div>
                  <span className="errortext">
                    {errors.permanent_address && errors.permanent_address.city}
                  </span>
                </FormGroup>
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item sm={3} md={3}>
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Pincode *</Label>
                    <Input
                      className={`form-control ${permanent_address && !permanent_address.pincode
                        ? ""
                        : "not-empty"
                        }`}
                      type="text"
                      name="pincode"
                      onChange={(e) =>
                        handleInputChange(e, "permanent_address")
                      }
                      onBlur={(e) =>
                        handleInputBlur(e, "pincode", "permanent_address")
                      }
                      value={permanent_address && permanent_address.pincode}
                    />

                    <span className="errortext">
                      {errors.permanent_address &&
                        errors.permanent_address.pincode}
                    </span>
                  </div>
                </FormGroup>
              </Grid>

              <Grid item sm={3} md={3}>
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">District *</Label>
                    <Input
                      className={`form-control ${permanent_address && !permanent_address.district
                        ? ""
                        : "not-empty"
                        }`}
                      type="text"
                      name="district"
                      onChange={(e) =>
                        handleInputChange(e, "permanent_address")
                      }
                      onBlur={(e) =>
                        handleInputBlur(e, "district", "permanent_address")
                      }
                      value={permanent_address && permanent_address.district}
                    />

                  </div>
                  <span className="errortext">
                    {errors.permanent_address &&
                      errors.permanent_address.district}
                  </span>
                </FormGroup>
              </Grid>
              <Grid item sm={3} md={3}>

                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">State *</Label>
                    <Input
                      className={`form-control ${permanent_address && !permanent_address.state
                        ? ""
                        : "not-empty"
                        }`}
                      type="text"
                      name="state"
                      onChange={(e) =>
                        handleInputChange(e, "permanent_address")
                      }
                      onBlur={(e) =>
                        handleInputBlur(e, "state", "permanent_address")
                      }
                      value={permanent_address && permanent_address.state}
                    />

                  </div>
                  <span className="errortext">
                    {errors.permanent_address && errors.permanent_address.state}
                  </span>
                </FormGroup>
              </Grid>
              <Grid item sm={3} md={3}>
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Country *</Label>
                    <Input
                      className={`form-control ${permanent_address && !permanent_address.country
                        ? ""
                        : "not-empty"
                        }`}
                      type="text"
                      name="country"
                      onChange={(e) =>
                        handleInputChange(e, "permanent_address")
                      }
                      onBlur={(e) =>
                        handleInputBlur(e, "country", "permanent_address")
                      }
                      value={permanent_address && permanent_address.country}
                    />

                  </div>
                  <span className="errortext">
                    {errors.permanent_address &&
                      errors.permanent_address.country}
                  </span>
                </FormGroup>
              </Grid>
            </Grid>
          </>
        ) : (
          <div></div>
        )}
      </React.Fragment>
      <React.Fragment>
        <>
      <Grid container spacing={1} >
            <Grid item sm={12} md={12} >
              <div className="dividing_line" ></div>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={1}
            style={{ marginTop: "0%",  marginTop: "2%" }}
          >
            <Grid item md={2}>
              <span className="permanent_address"> Configuration </span>
            </Grid>
          </Grid>
          <Grid container spacing={4} style={{ marginTop: "0%"}}>
          <Grid item sm={3} md={3}>
              <Label className="kyc_label">Email</Label>
              &nbsp;&nbsp; &nbsp;&nbsp;
              <div style={{position:"relative",top:"10px"}}
                className={`franchise-switch ${emailToggle}`}
                onClick={EmailToggle}
              />
            </Grid>
            <Grid item sm={3} md={3}>
              <Label className="kyc_label">SMS</Label> &nbsp;&nbsp; &nbsp;&nbsp;
              <div style={{position:"relative",top:"10px"}}
                className={`franchise-switch ${smsToggle}`}
                onClick={SMSToggle}
              />
            </Grid>
            <Grid item sm={3} md={3}>
              <Label className="kyc_label">Whatsapp</Label> &nbsp;&nbsp; &nbsp;&nbsp;
              <div style={{position:"relative",top:"10px"}}
                className={`franchise-switch ${whatsappToggle}`}
                onClick={WHATSAPPToggle}
              />
            </Grid>
          </Grid>
          </>
      </React.Fragment>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const {
    formData,
    errors,
    saveAsBillingAddress,
    showPermanentAddress,
    toggleState,
  } = state.KYCForm;
  const { address, permanent_address } = formData;
  return {
    address,
    permanent_address,
    errors,
    formData,
    saveAsBillingAddress,
    showPermanentAddress,
    toggleState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFormErrors: (payload) => dispatch(setFormErrors(payload)),
    handleChangeFormInput: (payload) =>
      dispatch(handleChangeFormInput(payload)),
    setPermanentAddressAsBillingAddress: (payload) =>
      dispatch(setPermanentAddressAsBillingAddress(payload)),
    toggleSaveAsButton: () => dispatch(toggleSaveAsButton()),
    togglePermanentAddress: (payload) =>
      dispatch(togglePermanentAddress(payload)),
    setActiveBreadCrumb: (payload) => dispatch(setActiveBreadCrumb(payload)),
    setToggleState: (payload) => dispatch(setToggleState(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormStep3);
