import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import PhotoUploadModal2 from "../identity";
import FormIconComponent from "../../../../utilitycomponents/formiconcomponent/FormIconComponent";
import { Col, FormGroup, Input, Label, Button } from "reactstrap";
import {
  toggleImageUploadModal2,
  handleChangeFormInput2,
  handleChangeDisplayImage2,
  setFormErrors,
} from "../../../../../redux/kyc-form/actions";
import useFormValidation from "../../../../customhooks/FormValidation";
import { requiredFieldsKYCForm } from "../../../../../utils";
import Radio from "@mui/material/Radio";
import { styled } from "@mui/material/styles";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import ADD from "../../../../../assets/images/Customer-Circle-img/add_cust.png";
import Grid from "@mui/material/Grid";

const documentName = "identity_proof";

const FormStep7 = (props) => {
  const { validate } = useFormValidation(requiredFieldsKYCForm);
  const {
    toggleImageUploadModal2,
    showImageUploadModal2,
    customer_images,
    handleChangeDisplayImage2,
    handleChangeFormInput2,
    formData,
    setFormErrors,
    errors,
  } = props;
 const [radioSelected,setRadio]=useState(formData?.customer_documents?.pan_card ?'pan' : 'aadhar');

  const handleImageClear = (e) => {
    handleChangeDisplayImage2({ name: documentName, value: null });
    handleChangeFormInput2({
      name: documentName,
      value: null,
      parent: "customer_documents",
    });
  };

  const handleInputChange = (e, parent) => {
    // if(e.target.name == "pan_card"){
    //   e.target.customer_documents.Aadhar_Card_No =""
    // }else if (e.target.name == "Aadhar_Card_No"){
    //   e.target.customer_documents.pan_card =""

    // }
    const name = e.target.name;
    const value = e.target.value;

    handleChangeFormInput2({
      name,
      value,
      parent: parent || null,
    });
  };

  let dependency = formData["customer_documents"][documentName];
console.log(formData,"formDataadd")
  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      checkFieldValidity(documentName, "customer_documents");
    }
  }, [dependency]);

  const checkFieldValidity = (fieldName) => {
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

  //radio button css
  const BpIcon = styled("span")(({ theme }) => ({
    borderRadius: "50%",
    width: 16,
    height: 16,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 0 0 1px rgb(16 22 26 / 40%)"
        : "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
    backgroundColor: theme.palette.mode === "dark" ? "#394b59" : "#f5f8fa",
    backgroundImage:
      theme.palette.mode === "dark"
        ? "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))"
        : "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    ".Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: theme.palette.mode === "dark" ? "#30404d" : "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background:
        theme.palette.mode === "dark"
          ? "rgba(57,75,89,.5)"
          : "rgba(206,217,224,.5)",
    },
  }));

  const BpCheckedIcon = styled(BpIcon)({
    backgroundColor: "#285295",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 16,
      height: 16,
      backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: "#285295",
    },
  });

  function BpRadio(props) {
    return (
      <Radio
        sx={{
          "&:hover": {
            bgcolor: "transparent",
          },
        }}
        disableRipple
        color="default"
        checkedIcon={<BpCheckedIcon />}
        icon={<BpIcon />}
        {...props}
      />
    );
  }
  // end of radio  button css
  const displayImage = customer_images[documentName];
  return (
    <React.Fragment>
      <Grid container spacing={2} columns={12}>
        <Grid item xs={4} style={{position: "relative",left:"10px"}}>
          <RadioGroup
            defaultValue={formData?.customer_documents?.pan_card ?'pan' : 'aadhar'}
            aria-labelledby="demo-customized-radios"
            name="customized-radios"
            id="kyc_radio"
          >
            {/* <Col md="4"> */}
            <FormControlLabel
              value="aadhar"
              control={
                <BpRadio style={{ position: "relative" ,left:"-10px"}} onClick={(e)=>{setRadio(e.target.value)}}/>
              } 
              label={"Aadhar"}
            />
            <FormControlLabel
              value="pan"
              control={
                <BpRadio style={{ position: "relative" ,left:"-10px"}} onClick={(e)=>{setRadio(e.target.value)}}/>
              } 
              label={"Pan Card"}
              className="form_panCard"
            />
          </RadioGroup>
        </Grid>
      </Grid>
      <FormGroup>

        < Grid container spacing={2} columns={12}
          // className="form-image-upload"
          className="identityProof_input"
        >
        {radioSelected
        ==='aadhar' &&   <Grid item xs={12}
          style={{position: "relative",marginLeft:"5%"}}
          >
            <Label style={{ position:"relative",top:"8%"}}className="desc_label">Aadhar Number *</Label>
            <br/>
            <Input
              className={`form-control ${
                formData && !formData.customer_documents.Aadhar_Card_No
                  ? ""
                  : "not-empty"
              } ${errors.email ? "error" : ""}`}
              onChange={(e) => handleInputChange(e, "customer_documents")}
              type="text"
              name="Aadhar_Card_No"
              onBlur={(e) =>
                handleInputBlur(e, "Aadhar_Card_No", "customer_documents")
              }
              value={
                formData &&
                formData.customer_documents &&
                formData.customer_documents.Aadhar_Card_No
              }
              style={{ display: "block", paddingTop: "3px",}}
            />
            <span className="errortext">{errors.Aadhar_Card_No}</span>
          </Grid>}
          {radioSelected
        ==='pan' && <Grid item xs={12}
          style={{position: "relative",marginLeft:"5%"}}
          >
            {/* Sailaja Modified Pan Number * to PAN Number * on 3rd April 2023 */}
            <Label style={{ position:"relative",top:"8%"}}className="desc_label">PAN Number *</Label>
            <br/>
            <Input
              className={`form-control ${
                formData && !formData.customer_documents.pan_card
                  ? ""
                  : "not-empty"
              } ${errors.email ? "error" : ""}`}
              onChange={(e) => handleInputChange(e, "customer_documents")}
              type="text"
              name="pan_card"
              onBlur={(e) =>
                handleInputBlur(e, "pan_card", "customer_documents")
              }
              value={
                formData &&
                formData.customer_documents &&
                formData.customer_documents.pan_card
              }
              style={{ display: "block", paddingTop: "3px",}}
            />
            <span className="errortext">{errors.pan_card}</span>
          </Grid>}
          {/* <div className="adhaar_input form-image-upload">
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
                  onClick={() => toggleImageUploadModal2()}
                  handleClearImageClick={(e) => {
                    handleImageClear(e);
                  }}
                  alt={"Aadhar"}
                >
                  {"Add ID Proof"}
                </Button>
              </span>
              <br/>
              <br />
          <span className="errortext" style={{position: "relative", top: "20px"}}>{errors.identity_proof}</span>
           
          </div>
          </div> */}
        </Grid>
      
        <Col sm="12" style={{ textAlign: "center", marginTop:"2%" ,marginBottom:"10%",position:"relative",top:"6%"}}>
          {/* <br/> */}
             <div className="adhaar_input form-image-upload">
          <div className="input_wrap">
          {displayImage ? (
            <FormIconComponent
              handleClearImageClick={(e) => {
                handleImageClear(e);
              }}
              iconName={displayImage ? "idProofUpload" : "addIdentityProof"}
              imageData={displayImage ? displayImage : null}
              alt={"Aadhar"}
              // textBelowIcon={"Add identity proof1"}
              onClick={toggleImageUploadModal2}
            />
          ) : (
            <>
              <br/>
                <img src={ADD} style={{position: "relative"}}/>
                <br/>
                <br/>
            <span style={{position:"relative"}}>
              <Button
                color="btn btn-primary"
                type="button"
                className="mr-3"
                id="new_add_2"
                onClick={() => toggleImageUploadModal2()}
                handleClearImageClick={(e) => {
                  handleImageClear(e);
                }}
                alt={"Aadhar"}
                >
                {"Add ID Proof"}
              </Button>
            </span>
            </>
          )}
          </div>
          </div>
          <span className="errortext" id="error_id">{errors.identity_proof}</span>
        </Col>
        {showImageUploadModal2 && (
          <PhotoUploadModal2
            documentName={"identity_proof"}
            parent={"customer_documents"}
          />
        )}
      </FormGroup>
    </React.Fragment>
  );
};
//added line 289 by marieya
const mapStateToProps = (state) => {
  const { showImageUploadModal2, customer_images, formData, errors } =
    state.KYCForm;
  return {
    showImageUploadModal2,
    customer_images,
    formData,
    errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFormErrors: (payload) => dispatch(setFormErrors(payload)),
    toggleImageUploadModal2: () => dispatch(toggleImageUploadModal2()),
    handleChangeFormInput2: (payload) =>
      dispatch(handleChangeFormInput2(payload)),
    handleChangeDisplayImage2: (payload) =>
      dispatch(handleChangeDisplayImage2(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormStep7);
