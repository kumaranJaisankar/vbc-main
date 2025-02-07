import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import PhotoUploadModal from "../PhotoUploadModal";
import FormIconComponent from "../../../../utilitycomponents/formiconcomponent/FormIconComponent";
import FormStep8 from "../../KYCForm/Documents/FormStep8";
import FormStep2 from "../../KYCForm/PersonalDetails/FormStep2";
import FormStep3 from "../../KYCForm/PersonalDetails/FormStep3";
import FormStep7 from "../../KYCForm/Documents/FormStep7";
import { Col, FormGroup, Button } from "reactstrap";
import { Nav, NavItem, NavLink } from "reactstrap";

import {
  toggleImageUploadModal,
  handleChangeFormInput,
  handleChangeDisplayImage,
  setFormErrors,
} from "../../../../../redux/kyc-form/actions";
import useFormValidation from "../../../../customhooks/FormValidation";
import { requiredFieldsKYCForm } from "../../../../../utils";
import ADD from "../../../../../assets/images/Customer-Circle-img/add_cust.png";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import { styled } from "@mui/material/styles";

// const documentName = "customer_pic";

const Formstep1 = (props) => {
  const {
    toggleImageUploadModal,
    showImageUploadModal,
    customer_images,
    handleChangeDisplayImage,
    handleChangeFormInput,
    errors,
    formData,
    setFormErrors,
    smsToggle,
    SMSToggle,
    emailToggle,
    EmailToggle,
    showError,
    WHATSAPPToggle,
    whatsappToggle,
  } = props;

  const { validate, Error } = useFormValidation(requiredFieldsKYCForm);
  const [idproof, setIdproof] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [BasicLineTab, setBasicLineTab] = useState("1");
  const handleImageClear = (e, documentName) => {
    handleChangeDisplayImage({ name: documentName, value: null });
    handleChangeFormInput({
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
      console.log("called");
      checkFieldValidity(documentName, "customer_documents");
    }
  }, [dependency, formData]);

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

  //radio button css
  const BpIcon = styled("span")(({ theme }) => ({
    borderRadius: "50%",
    width: 16,
    height: 16,
    padding: 0,
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

  const handleInputChange = (e, parent, field) => {
    const name = e.target.name;
    const value = e.target.value;

    if (field == "idproof") setIdproof(e.target.value);

    handleChangeFormInput({
      name,
      value,
      parent: parent || null,
    });
  };

  const displayImage = (name) => customer_images[name];

  return (
    <>
      <Box>
        <Grid>
          <Nav className="border-tab1" tabs>
            <NavItem>
              <NavLink
                href="#javascript"
                className={BasicLineTab === "1" ? "active" : ""}
                onClick={() => setBasicLineTab("1")}
              >
                {"PERSONAL DETAILS"}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink>{"SERVICE DETAILS"}</NavLink>
            </NavItem>
            <NavItem>
              <NavLink>{"PAYMENT OPTIONS"}</NavLink>
            </NavItem>
          </Nav>
        </Grid>
      </Box>

      <br />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} columns={12}>
          <Grid item xs={3}>
            <p className="form-heading-style">{"Customer Photo *"}</p>
            <FormGroup style={{ textAlign: "center" }}>
              <FormIconComponent
                handleClearImageClick={(e) => {
                  handleImageClear(e, "customer_pic");
                }}
                style={{ marginTop: "0rem" }}
                iconName={
                  displayImage("customer_pic") ? "profilePicture" : "personLogo"
                }
                imageData={
                  displayImage("customer_pic")
                    ? displayImage("customer_pic")
                    : null
                }
                alt={"Customer Photo"}
                textBelowIcon={""}
              ></FormIconComponent>
            </FormGroup>

            <Col md="12">
              <FormGroup className="form-image-upload">
                <br />
                <img src={ADD} style={{ position: "relative" }} />
                <Button
                  color="btn btn-primary"
                  type="button"
                  className="mr-3"
                  id="new_add"
                  onClick={() => {
                    setDocumentName("customer_pic");
                    toggleImageUploadModal();
                  }}
                >
                  {displayImage("customer_pic") ? "Edit Photo " : "Add Photo"}
                </Button>
                <br />
                <span
                  className="errortext"
                  style={{ position: "relative", top: "24px" }}
                >
                  {/* {displayImage("customer_pic") ? "" : errors.customer_pic} */}
                </span>
              </FormGroup>
              <br />
              <span className="errortext" id="error_cust_photo">
                {/* {errors.customer_pic} */}
                {showError &&
                  !displayImage("customer_pic") &&
                  errors.customer_pic}
              </span>
            </Col>
            {showImageUploadModal && (
              <PhotoUploadModal
                documentName={documentName}
                parent={"customer_documents"}
              />
            )}
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={3}>
            <p className="form-heading-style">
              {" "}
              &nbsp; &nbsp;{"Identity Proof *"}
            </p>

            <FormStep7 />
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={3}>
            <p className="form-heading-style">{"Signature *"}</p>

            <FormStep8 formTitle={"Signature *"} />
          </Grid>
        </Grid>
      </Box>
      <div className="dividing_line"></div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} columns={12}>
          <Grid item xs={12}>
            <FormStep2 formTitle={"Personal Information"} />
          </Grid>
        </Grid>
      </Box>
      <div className="dividing_line"></div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} columns={12}>
          <Grid item xs={12}>
            <FormStep3
              formTitle={"Billing"}
              smsToggle={smsToggle}
              SMSToggle={SMSToggle}
              EmailToggle={EmailToggle}
              emailToggle={emailToggle}
              WHATSAPPToggle={WHATSAPPToggle}
              whatsappToggle={whatsappToggle}
            />
          </Grid>
        </Grid>
      </Box>

      <br />
    </>
  );
};
// line 257 added by Marieya
const mapStateToProps = (state) => {
  const { showImageUploadModal, customer_images, errors, formData } =
    state.KYCForm;
  return {
    showImageUploadModal,
    customer_images,
    errors,
    formData,
    first_name: formData.first_name || "",
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFormErrors: (payload) => dispatch(setFormErrors(payload)),
    toggleImageUploadModal: () => dispatch(toggleImageUploadModal()),
    handleChangeFormInput: (payload) =>
      dispatch(handleChangeFormInput(payload)),
    handleChangeDisplayImage: (payload) =>
      dispatch(handleChangeDisplayImage(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Formstep1);
