import React from "react";
import { Row, Col, FormGroup, Input, Label } from "reactstrap";
import { connect } from "react-redux";
import {
    handleChangeFormInput,
    setFormErrors,
    toggleImageUploadModal
  } from "../../../../../redux/kyc-form/actions";

const FormStep11 = (props) => {
  const { formTitle, errors, formData, selectedPlan } = props;

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  const handleInputChange = (e) => {
      const name = e.target.name;
      const value = e.target.value;
      handleChangeFormInput({
          name,
          value,
          parent : null
      })
  }

  return (
    <React.Fragment>
      <Row style={{ paddingLeft: "10%", paddingRight: "10%" }}>
        <Col sm="12" style={{ display: "flex" }}>
          <h6
            className="form-heading-style"
            style={{ marginTop: "7px", color: "#7366ff" }}
          >
            {formTitle}
          </h6>
        </Col>
      </Row>
      <Row style={{ paddingLeft: "10%", paddingRight: "10%" }}>
        <Col sm="12">
          <FormGroup>
            <div className="input_wrap">
              <Input
                className={`form-control ${
                  formData && !formData.total_plan_cost ? "" : "not-empty"
                }`}
                type="number"
                name="total_plan_cost"
                onChange={handleInputChange}
                onBlur={checkEmptyValue}
                value={parseFloat(selectedPlan.total_plan_cost).toFixed(
                  0
                )}
                min="0"
                onKeyDown={(evt) =>
                  (evt.key === "e" ||
                    evt.key === "E" ||
                    evt.key === "." ||
                    evt.key === "-") &&
                  evt.preventDefault()
                }
              />
              <Label className="placeholder_styling">
                Total Payable Amount
              </Label>
            </div>
            <span className="errortext">
              {errors.total_plan_cost && "Field is required"}
            </span>
          </FormGroup>
        </Col>
      </Row>
      <Row style={{ paddingLeft: "10%", paddingRight: "10%" }}>
        <Col sm="12">
          <FormGroup>
            <div className="input_wrap">
              <Input
                className="form-control"
                type="number"
                name=""
                onChange={handleInputChange}
                onBlur={checkEmptyValue}
                min="0"
                onKeyDown={(evt) =>
                  (evt.key === "e" ||
                    evt.key === "E" ||
                    evt.key === "." ||
                    evt.key === "-") &&
                  evt.preventDefault()
                }
              />
              <Label
                className="placeholder_styling"
                style={{ whiteSpace: "nowrap" }}
              >
                Given Amount
              </Label>
            </div>
          </FormGroup>
        </Col>
      </Row>
      <Row style={{ paddingLeft: "10%", paddingRight: "10%" }}>
        <Col sm="12">
          <FormGroup>
            <div className="input_wrap">
              <Input
                className="form-control"
                type="number"
                name=""
                onChange={handleInputChange}
                onBlur={checkEmptyValue}
                min="0"
                onKeyDown={(evt) =>
                  (evt.key === "e" ||
                    evt.key === "E" ||
                    evt.key === "." ||
                    evt.key === "-") &&
                  evt.preventDefault()
                }
              />
              <Label
                className="placeholder_styling"
                style={{ whiteSpace: "nowrap" }}
              >
                Return Amount
              </Label>
            </div>
          </FormGroup>
        </Col>
      </Row>

      <Row style={{ paddingLeft: "10%", paddingRight: "10%" }}>
        <Col sm="6" style={{ marginLeft: "1.3rem" }}>
          <FormGroup>
            <div className="input_wrap">
              <div className="radio radio-primary">
                <Input
                  id="radio33"
                  type="radio"
                  name="radio1"
                  value="option1"
                  defaultChecked
                />

                <Label for="radio33">
                  {Option}
                  <span style={{ color: "#2b2b2b" }}>Add to wallet</span>
                </Label>
              </div>
            </div>
          </FormGroup>
        </Col>
      </Row>
      <Row style={{ paddingLeft: "10%", paddingRight: "10%" }}>
        <Col sm="6" style={{ marginLeft: "1.3rem" }}>
          <FormGroup>
            <div className="input_wrap">
              <div className="radio radio-primary">
                <Input
                  id="radio44"
                  type="radio"
                  name="radio1"
                  value="option1"
                />

                <Label for="radio44">
                  {Option}
                  <span style={{ color: "#2b2b2b" }}>Given to customer</span>
                </Label>
              </div>
            </div>
          </FormGroup>
        </Col>
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

export default connect(mapStateToProps, mapDispatchToProps)(FormStep11);
