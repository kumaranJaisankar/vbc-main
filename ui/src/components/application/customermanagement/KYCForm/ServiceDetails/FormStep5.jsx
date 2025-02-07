import React from "react";
import { handleChangeFormInput, setFormErrors } from "../../../../../redux/kyc-form/actions";
import { Row, Col, FormGroup, Input, Label } from "reactstrap";
import { connect } from "react-redux";
import useFormValidation from "../../../../customhooks/FormValidation";
import { requiredFieldsKYCForm } from "../../../../../utils";

const FormStep5 = (props) => {
  const { handleChangeFormInput, formData, setFormErrors, errors } = props;
  const { validate } = useFormValidation(requiredFieldsKYCForm);

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    handleChangeFormInput({
      name,
      value,
    });
  };

  const checkFieldValidity = (fieldName, parent) => {
    const validationErrors = validate(formData);
    let vErrors = {};
    if(validationErrors[fieldName]){
      vErrors[fieldName] = validationErrors[fieldName];
    }

    const noErrors = Object.keys(vErrors).length === 0;
    
    if(noErrors) {
      setFormErrors({...errors, ...{[fieldName]: ""}})
    }
    setFormErrors({...errors, ...{[fieldName] : vErrors[fieldName]}});
  }

  function checkEmptyValue(e) {
    if (e.target.value === "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  //This function will be used for validation of individual fields
  const handleInputBlur = (e, fieldName, parent) => {
      checkEmptyValue(e);
      checkFieldValidity(fieldName, parent);
  }

  return (
    <React.Fragment>
      <Row >
        <Col sm="12" style={{ display: "flex" }}>
          <p
            className="form-heading-style"
            style={{ marginTop: "7px"}}
          >
            {"Installation Charges"}
          </p>
        </Col>
      </Row>
      <br />
      <Row >
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
            <Label className="kyc_label">
                Installation Charges *
              </Label>
              <Input
                className={`form-control ${
                  formData && !formData.installation_charges ? "" : "not-empty"
                }`}
                type="text"
                name="installation_charges"
                onChange={handleInputChange}
                onBlur={(e) => handleInputBlur(e, "installation_charges", "")}
                value={formData.installation_charges}
              />
             
            </div>
            <span className="errortext">{errors.installation_charges}</span>
          </FormGroup>
        </Col>
        <Col sm="3">
          <FormGroup>
            <div className="input_wrap">
            <Label className="kyc_label">Security Deposit *</Label>
              <Input
                className={`form-control ${
                  formData && !formData.security_deposit ? "" : "not-empty"
                }`}
                type="text"
                name="security_deposit"
                onChange={handleInputChange}
                onBlur={(e) => handleInputBlur(e, "security_deposit", "")}
                value={formData.security_deposit}
              />
            
            </div>
            <span className="errortext">{errors.security_deposit}</span>
          </FormGroup>
        </Col>
      </Row>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { formData, errors } = state.KYCForm;
  return {
    formData,
    errors
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFormErrors: (payload) => dispatch(setFormErrors(payload)),
    handleChangeFormInput: (payload) =>
      dispatch(handleChangeFormInput(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormStep5);
