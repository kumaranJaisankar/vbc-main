import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import PhotoUploadModal1 from "../addressproof";
import FormIconComponent from "../../../../utilitycomponents/formiconcomponent/FormIconComponent";
import { Row, Col, FormGroup, Button } from "reactstrap";
import {
  toggleImageUploadModal1,
  handleChangeFormInput1,
  handleChangeDisplayImage1,
  setFormErrors,
} from "../../../../../redux/kyc-form/actions";
import useFormValidation from "../../../../customhooks/FormValidation";
import { requiredFieldsKYCForm } from "../../../../../utils";
import ADD from "../../../../../assets/images/Customer-Circle-img/add_cust.png";

const documentName = "address_proof";

const FormStep9 = (props) => {
  const { validate, Error } = useFormValidation(requiredFieldsKYCForm);
  const {
    toggleImageUploadModal1,
    showImageUploadModal1,
    customer_images,
    handleChangeDisplayImage1,
    handleChangeFormInput1,
    formTitle,
    errors,
    setFormErrors,
    formData,
  } = props;

  const handleImageClear = (e) => {
    handleChangeDisplayImage1({ name: documentName, value: null });
    handleChangeFormInput1({
      name: documentName,
      value: null,
      parent: "customer_documents",
    });
  };

  let dependency = formData["customer_documents"][documentName];

  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      checkFieldValidity(documentName, "");
    }
  }, [dependency]);

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

  const displayImage = customer_images[documentName];
  return (
    <React.Fragment>
      <FormGroup style={{ textAlign: "center" }}>
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
        <div className="address_input form-image-upload">
          <div className="input_wrap">
            {displayImage ? (
              <FormIconComponent
                handleClearImageClick={(e) => {
                  handleImageClear(e);
                }}
                iconName={displayImage ? "addressImageUpload" : "addressProof"}
                imageData={displayImage ? displayImage : null}
                alt={"Aadhar"}
                textBelowIcon={"Add address proof"}
                onClick={toggleImageUploadModal1}
              />
            ) : (
              <>
                <br />
                <img src={ADD} style={{ position: "relative" }} />
                <br />
                <br />
                <span style={{ position: "relative" }}>
                  <Button
                    color="btn btn-primary"
                    type="button"
                    className="mr-3"
                    id="new_add_3"
                    onClick={() => toggleImageUploadModal1()}
                    handleClearImageClick={(e) => {
                      handleImageClear(e);
                    }}
                    alt={"Aadhar"}
                  >
                    {"Add Address Proof"}
                  </Button>
                </span>
              </>
            )}
          </div>
        </div>
        <br />
        <span className="errortext" id="error_address">{errors.address_proof}</span>

        {showImageUploadModal1 && (
          <PhotoUploadModal1
            documentName={"address_proof"}
            parent={"customer_documents"}
          />
        )}
      </FormGroup>
    </React.Fragment>
  );
};
// error_address css added by marieya on line 156
const mapStateToProps = (state) => {
  const { showImageUploadModal1, customer_images, formData, errors } =
    state.KYCForm;
  return {
    showImageUploadModal1,
    customer_images,
    formData,
    errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFormErrors: (payload) => dispatch(setFormErrors(payload)),
    toggleImageUploadModal1: () => dispatch(toggleImageUploadModal1()),
    handleChangeFormInput1: (payload) =>
      dispatch(handleChangeFormInput1(payload)),
    handleChangeDisplayImage1: (payload) =>
      dispatch(handleChangeDisplayImage1(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormStep9);
