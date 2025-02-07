import React from "react";
import { Row, Col, FormGroup, Input, Label, Button } from "reactstrap";
import PhotoUploadModal from "../PhotoUploadModal";
import { connect } from "react-redux";
import {
  handleChangeFormInput,
  handleChangeDisplayImage,
  setFormErrors,
  toggleImageUploadModal,
} from "../../../../../redux/kyc-form/actions";

const documentName = "cheque";

const FormStep12 = (props) => {
  const {
    formTitle,
    showImageUploadModal,
    errors,
    handleChangeFormInput,
    selectedPlan,
    toggleImageUploadModal,
    customer_images,
  } = props;

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  const handleImageClear = (e) => {
    handleChangeDisplayImage({ name: documentName, value: null });
    handleChangeFormInput({
      name: documentName,
      value: null,
      parent: "pictures",
    });
  };

  const displayImage = customer_images[documentName];

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
                  props.formData && !props.formData.total_plan_cost
                    ? ""
                    : "not-empty"
                }`}
                type="number"
                name="total_plan_cost"
                onChange={({ name, value }) =>
                  handleChangeFormInput({
                    name,
                    value,
                    parent: null,
                  })
                }
                onBlur={checkEmptyValue}
                value={parseFloat(selectedPlan.total_plan_cost).toFixed(0)}
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
                Total Payable Amount *
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
              <Input className="form-control" type="text" name="username" />
              <Label className="placeholder_styling">Enter Cheque number</Label>
            </div>
          </FormGroup>
        </Col>
      </Row>
      <Row style={{ paddingLeft: "13%", paddingRight: "10%" }}>
        <Button color="primary" onClick={toggleImageUploadModal}>
          Upload pic
        </Button>
      </Row>
      <Row style={{ paddingLeft: "13%", paddingRight: "10%" }}>
      {displayImage ? (
        <img
          src={displayImage}
          alt="Cheque"
          style={{
            display: "inline-flex",
            margin: "0",
            border: "1px solid #ced4da",
            width: "150px",
          }}
        />
      ) : null}
      </Row>

      <Col sm="6" style={{ paddingLeft: "10%", paddingRight: "10%" }}>
        {showImageUploadModal && (
          <PhotoUploadModal documentName={"cheque"} parent={"payments"} />
        )}
      </Col>
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

export default connect(mapStateToProps, mapDispatchToProps)(FormStep12);
