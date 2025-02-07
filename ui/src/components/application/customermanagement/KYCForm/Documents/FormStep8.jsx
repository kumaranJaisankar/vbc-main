import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import SignatureUploadSideBar from "../SignatureUploadSideBar";
import FormIconComponent from "../../../../utilitycomponents/formiconcomponent/FormIconComponent";
import { Row, Col, FormGroup , Button} from "reactstrap";
import {
  toggleSignatureUploadSideBar,
  handleChangeFormInput,
  handleChangeDisplayImage,
  setFormErrors,
} from "../../../../../redux/kyc-form/actions";
import useFormValidation from "../../../../customhooks/FormValidation";
import { requiredFieldsKYCForm } from "../../../../../utils";
import ADD from "../../../../../assets/images/Customer-Circle-img/add_cust.png";
import Grid from "@mui/material/Grid";


const documentName = "signature";

const FormStep8 = (props) => {
  const { validate, Error } = useFormValidation(requiredFieldsKYCForm);
  const {
    toggleSignatureUploadSideBar,
    customer_images,
    handleChangeDisplayImage,
    handleChangeFormInput,
    formTitle,
    errors,
    setFormErrors,
    formData,
  } = props;

  const clear = (e) => {
    handleChangeDisplayImage({ name: documentName, value: null });
    handleChangeFormInput({
      name: documentName,
      value: null,
      parent: "customer_documents",
    });
  };

  const closeCustomizer = () => {
    toggleSignatureUploadSideBar();
    document.querySelector(".customizer-contain").classList.remove("open");
  };

  const openCustomizer = () => {
    toggleSignatureUploadSideBar();
    document.querySelector(".customizer-contain").classList.add("open");
  };

  let dependency = formData["customer_documents"][documentName];

  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      console.log("called");
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
      <SignatureUploadSideBar
        closeCustomizer={closeCustomizer}
        documentName={documentName}
        parent={"customer_documents"}
      />
      <Row style={{ border:"1px solid #E5E5E5",height:"100px",marginLeft:"1%",marginRight:"1%"}}>
      <FormIconComponent
                handleClearImageClick={clear}
                // iconName={displayImage ? "signatureUpload" : "addSignature"}
                // textBelowIcon={"Add Signature"}
                onClick={() => openCustomizer()}
                imageData={displayImage ? displayImage : null}
                alt={"Signature"}
              />
      </Row>
      <p style={{textAlign: "center" }}>
        {/* (or) */}
        <br/>
      </p>
      <Row>

      <Col sm="12">
        <FormGroup className="form-image-upload">
          <div className="input_wrap">
           <br/>
                <img src={ADD} style={{position: "relative"}}/>
                <br/><br/>
              <span>
                <Button
                  color="btn btn-primary"
                  type="button"
                  className="mr-3"
                  id="new_add_2"
                  onClick={() => openCustomizer()}
                  handleClearImageClick={clear}
                  alt={"Signature"}
                >
                  {"Add Signature"}
                </Button>
              </span>
              <br/>
              <br />
              <span className="errortext" id="error_sign">{errors.signature}</span>   
          </div>
        </FormGroup>
      </Col>
      </Row>
    </React.Fragment>
  
  );
};
//added line 159  by Marieya
const mapStateToProps = (state) => {
  const { showImageUploadModal, customer_images, formData, errors } =
    state.KYCForm;
  return {
    showImageUploadModal,
    customer_images,
    formData,
    errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFormErrors: (payload) => dispatch(setFormErrors(payload)),
    toggleSignatureUploadSideBar: () =>
      dispatch(toggleSignatureUploadSideBar()),
    handleChangeFormInput: (payload) =>
      dispatch(handleChangeFormInput(payload)),
    handleChangeDisplayImage: (payload) =>
      dispatch(handleChangeDisplayImage(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormStep8);
