import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {FormGroup, Input, Label } from "reactstrap";
import {
  handleChangeFormInput,
  setAreaByZone,
  setFormErrors,
  setZoneByBranch,
} from "../../../../../redux/kyc-form/actions";
import { adminaxios } from "../../../../../axios";
import useFormValidation from "../../../../customhooks/FormValidation";
import { requiredFieldsKYCForm } from "../../../../../utils";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Radio from "@mui/material/Radio";

import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
// Sailaja imported common component Sorting on 27th March 2023
import { Sorting } from "../../../../common/Sorting";

const FormStep2 = (props) => {
  const [arealist, setArealist] = useState([]);
  const [franchiseInfo, setFranchiseInfo] = useState({});
  const [branchzonelist, setBranchzonelist] = useState([]);

  const [gstinmandatory, setGstinmandatory] = useState(false);
  const [individualgstinmandatory, setIndividualgstinmandatory] =
    useState(true);

  const { validate, Error } = useFormValidation(requiredFieldsKYCForm);
  const {
    zonename,
    formTitle,
    first_name,
    last_name,
    registered_email,
    register_mobile,
    alternate_mobile,
    alternate_email,
    branch,
    handleChangeFormInput,
    setFormErrors,
    formData,
    errors,
    
  } = props;

  // Move this useEffect to index.js file later on
  // useEffect(() => {
  //   adminaxios
  //     .get("accounts/branch/list")
  //     .then((res) => {
  //       setBranchOptions([...res.data]);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);

  // area listOfDataFound

  useEffect(() => {
    adminaxios
      .get("accounts/loggedin/areas")
      // .get(
      //   `franchise/${
      //     JSON.parse(localStorage.getItem("token")).franchise?.id
      //   }/areas`
      // )
      .then((res) => {
        let { areas } = res.data;
        setArealist([...areas]);
        // Sailaja sorting the KYC Form -> Area Dropdown data as alphabetical order on 27th March 2023
        setArealist(Sorting([...areas],"name"));
      })
      .catch((error) => console.log(error));
  }, []);
  // zone and branch list
  const zonelist = (id) => {
    adminaxios
      .get(`franchise/area/${id}/zone/branch`)
      .then((res) => {
        if (res.data.branch || res.data.zone) {
          let branch = res.data.branch.name;
          let zone = res.data.zone.name;
          setBranchzonelist({ ...res.data, branch: branch, zone: zone });
          let name = "zonename";
          let value = zone;
          handleChangeFormInput({ name, value });
          name = "branch";
          value = branch;
          handleChangeFormInput({ name, value });
        }
      })
      .catch((error) => console.log(error));
  };

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    // .charAt(0).toUpperCase() +   e.target.value.slice(1);
    e.preventDefault();
    handleChangeFormInput({
      name,
      value,
    });

    // call branchzone api
    if (name == "area") {
      zonelist(value);
    }

    //upon select branch display zone
    if (name == "branch") {
      getZonebyBranch(value);
    }
    //upon select zone display area
    if (name == "zone") {
      getAreabyZone(value);
    }
  };

  //get zone options based on branch selection
  const getZonebyBranch = (val) => {
    adminaxios
      .get(`accounts/branch/${val}/zones`)
      .then((response) => {
        props.setZoneByBranch(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };
  //end
  //get area options based on zone
  const getAreabyZone = (val) => {
    adminaxios
      .get(`accounts/zone/${val}/areas`)
      .then((response) => {
        props.setAreaByZone(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
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

  useEffect(() => {
    const franchiseDetails = JSON.parse(localStorage.getItem("token"));
    if (franchiseDetails) setFranchiseInfo({ ...franchiseDetails });
  }, []);

  const tokenInfo = JSON.parse(localStorage.getItem("token"));
  let Serviceplanshow = false;
  if (tokenInfo && tokenInfo.user_type === "Franchise Owner") {
    Serviceplanshow = true;
  }

  const mandatory = () => {
    setGstinmandatory(true);
    setIndividualgstinmandatory(false);
  };
  const individual = () => {
    setIndividualgstinmandatory(true);
    setGstinmandatory(false);
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
// Made change for first & last name error msg by Marieya on line 306 and 410
// Removed input_error_state from className by Marieya for red border
  return (
    <React.Fragment>
      {/* <Row>
        <Col sm="12" >
          <h6
            // className="form-heading-style"
            // style={{ marginTop: "7px", color: "#7366ff" }}
          >
            {formTitle}
          </h6>

        </Col>
      </Row> */}
      {/* <Grid container spacing={1}>
          <Grid item md={4}>
      <span className="info_cust"> Personal Information</span>
          </Grid>
          </Grid> */}
        <Grid>
        </Grid>
      
         <Grid item md={12} style={{marginTop:"3%"}}>
          <span className="info_cust"> Personal Information</span>
        </Grid>
       
        <Grid container spacing={1} >
          <Grid item sm={4} style={{marginTop:"1%",marginLeft:"1%"}}>
            <RadioGroup
            defaultValue="female"
            aria-labelledby="demo-customized-radios"
            name="customized-radios"
           id="kyc_radio1"
           style={{display:"block"}}
          >
            
            <FormControlLabel
              value="female"
              control={<BpRadio style={{position:"relative", left:"-11px"}}/>}
              label={"Individual"}
              onClick={individual}
              checked={individualgstinmandatory}
            />
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  

            <FormControlLabel
              value="other"
              control={<BpRadio style={{position:"relative", left:"-11px"}}/>}
              label="Business"  
              onClick={mandatory}
              checked={gstinmandatory}
            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          
          </RadioGroup>
               {/* <Input
                className="radio_animated"
                id="radioinline4"
                type="radio"
                defaultChecked
               onClick={individual}
                checked={individualgstinmandatory}
              />

              <Label className="mb-0" for="radioinline4">
                {Option}
                <span className="digits">Individual</span>
              </Label> */}
          </Grid>
          {/* <Grid tem sm={4} style={{marginTop:"1%"}}>
     
              radio radio-primary
              <Input
                className="radio_animated"
                id="radioinline3"
                type="radio"
                onClick={mandatory}
                checked={gstinmandatory}
              />

              <Label className="mb-0" for="radioinline3">
                {Option}
                <span className="digits">Business</span>
              </Label>
          </Grid> */}
        </Grid>

        {/* <Col sm="3">
          <Input
            type="checkbox"
            className="checkbox_animated"
            onClick={() => setIndividualgstinmandatory(!individualgstinmandatory)}
          />
          <Label>
            <b>Individual</b>
          </Label>
        </Col>

        <Col sm="3">
          <Input
            type="checkbox"
            className="checkbox_animated"
            onClick={() => setGstinmandatory(!gstinmandatory)}
          />
          <Label>
            <b>Business</b>
          </Label>
        </Col> */}

        <Grid container spacing={4} >
          <Grid item sm={3} md={3}>
            <FormGroup>
              <div className="input_wrap">
              <Label className="kyc_label">First Name *</Label>
                <Input
                  className={`form-control ${!first_name ? "" : "not-empty"} ${
                    errors.first_name ? "" : ""
                  }`}
                  style={{ textTransform: "capitalize" }}
                  type="text"
                  name="first_name"
                  onChange={(e) => handleInputChange(e)}
                  value={first_name}
                  onBlur={(e) => handleInputBlur(e, "first_name", "")}
                  // onBlur={handleInputBlur}
                />
               
              </div>
              {props.errors.first_name && (
                <span className="errortext">
                  {props.errors.first_name}
                </span>
              )}
            </FormGroup>
          </Grid>
          <Grid item sm={3}  md={3}>
            <FormGroup>
              <div className="input_wrap">
              <Label className="kyc_label">Last Name *</Label>
                <Input
                  className={`form-control ${!last_name ? "" : "not-empty"} ${
                    errors.last_name ? "" : ""
                  }`}
                  style={{ textTransform: "capitalize" }}
                  type="text"
                  name="last_name"
                  onChange={(e) => handleInputChange(e)}
                  value={last_name}
                  onBlur={(e) => handleInputBlur(e, "last_name", "")}
                />
             
              </div>
              {errors.last_name && (
                <span className="errortext">
                  {errors.last_name}
                </span>
              )}
            </FormGroup>
          </Grid>
          <Grid item sm={3}  md={3}>
            <FormGroup>
              <div className="input_wrap">
              <Label className="kyc_label">Mobile Number *</Label>
                <Input
                  className={`form-control ${
                    !register_mobile ? "" : "not-empty"
                  }
                ${errors.register_mobile ? "" : ""}`}
                  type="text"
                  name="register_mobile"
                  onChange={(e) => handleInputChange(e)}
                  onBlur={(e) => handleInputBlur(e, "register_mobile", "")}
                  value={register_mobile}
                />
              
              </div>
              {errors.register_mobile && (
                <span className="errortext">{errors.register_mobile}</span>
              )}
            </FormGroup>
          </Grid>
          <Grid item sm={3}  md={3}>
            <FormGroup>
              <div className="input_wrap">
              <Label className="kyc_label">Alternate Mobile Number</Label>
                <Input
                  className={`form-control ${
                    !alternate_mobile ? "" : "not-empty"
                  }
                ${errors.alternate_mobile ? "" : ""}`}
                  type="text"
                  name="alternate_mobile"
                  onChange={(e) => handleInputChange(e)}
                  onBlur={(e) => handleInputBlur(e, "alternate_mobile", "")}
                  value={alternate_mobile}
                />
              
              </div>
              {errors.alternate_mobile && (
                <span className="errortext">{errors.alternate_mobile}</span>
              )}
            </FormGroup>
          </Grid>
        </Grid>
        <Grid container spacing={4}>
        <Grid item sm={3}  md={3}>
            <FormGroup>
              <div className="input_wrap">
              <Label className="kyc_label">Email *</Label>
                <Input
                  className={`form-control ${
                    !registered_email ? "" : "not-empty"
                  }
                ${errors.registered_email ? "" : ""}`}
                  type="email"
                  name="registered_email"
                  onChange={(e) => handleInputChange(e)}
                  onBlur={(e) => handleInputBlur(e, "registered_email", "")}
                  value={registered_email}
                  style={{
                     textTransform: "lowercase"
                  }}
                />
               
              </div>
              {errors.registered_email && (
                <span className="errortext">{errors.registered_email}</span>
              )}
            </FormGroup>
          </Grid>
          <Grid item sm={3}  md={3}>
            <FormGroup>
              <div className="input_wrap">
              <Label className="kyc_label">Alternate Email </Label>
                <Input
                  className={`form-control ${
                    !alternate_email ? "" : "not-empty"
                  }
                ${errors.alternate_email ? "" : ""}`}
                  type="email"
                  name="alternate_email"
                  onChange={(e) => handleInputChange(e)}
                  onBlur={(e) => handleInputBlur(e, "alternate_email", "")}
                  value={alternate_email.toLowerCase()}
                  // style={{
                  //    textTransform: "lowercase"
                  // }}
                />
               
              </div>
              {errors.alternate_email && (
                <span className="errortext">{errors.alternate_email}</span>
              )}
            </FormGroup>
          </Grid>
          <Grid item sm={3}  md={3}>
            <FormGroup>
              <div className="input_wrap">
              <Label className="kyc_label" style={{ whiteSpace: "nowrap" }}>
                  Area *
                </Label>
                <Input
                  type="select"
                  name="area"
                  className={`form-control digits ${
                    formData && !formData.area ? "" : "not-empty"
                  }
                  ${errors.area ? "" : ""}`}
                  onChange={(e) => handleInputChange(e)}
                  onBlur={checkEmptyValue}
                  value={formData && formData.area}
                >
                  <option style={{ display: "none" }}></option>

                  {arealist.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </Input>              
              </div>
              {/* Sailaja changed validation msg text as guided by QA team on 3rd August  */}
              {/* Sailaja changed validation msg text as Selection is required on 31st March 2023  */}
              {errors.area && (
                <span className="errortext">
                      {errors.area && 'Selection is required'}
                </span>
              )}
              {/* <span className="errortext">{errors.area}</span> */}
            </FormGroup>
          </Grid>
          <Grid item sm={3} md={3}>
            <FormGroup>
              <div className="input_wrap">
              <Label className="kyc_label">Branch *</Label>
                <Input
                  className="form-control not-empty"
                  type="text"
                  name="branch"
                  onChange={(e) => handleInputChange(e)}
                  onBlur={(e) => handleInputBlur(e, "branch", "")}
                  disabled={true}
                  value={branch}
                />
              
              </div>
            </FormGroup>
          </Grid>
          </Grid>
        <Grid container spacing={4}>
         
         
          <Grid item sm={3} md={3}>
            <FormGroup>
              <div className="input_wrap">
              <Label className="kyc_label">Zone *</Label>
                <Input
                  className="form-control not-empty"
                  type="text"
                  name="zone"
                  onChange={(e) => handleInputChange(e)}
                  onBlur={(e) => handleInputBlur(e, "zone", "")}
                  disabled={true}
                  value={zonename}
                />
               
              </div>
            </FormGroup>
          </Grid>

          {Serviceplanshow ? (
            <Grid item sm={3}  md={3}>
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">Franchise *</Label>
                  <Input
                    className="form-control not-empty"
                    type="text"
                    name=""
                    maxLength="15"
                    disabled={true}
                    value={franchiseInfo ? franchiseInfo.username : " "}
                  />
                
                </div>
              </FormGroup>
            </Grid>
          ) : (
            ""
          )}
          {gstinmandatory ? (
            <Grid item sm={3}  md={3}>
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">GSTIN * </Label>
                  <Input
                    className={`form-control `}
                    type="text"
                    name="GSTIN"
                    onChange={(e) => handleInputChange(e)}
                    onBlur={(e) => handleInputBlur(e, "GSTIN", "")}
                  />
                 
                </div>
              </FormGroup>
            </Grid>
          ) : (
            ""
          )}          
          {individualgstinmandatory ? (
            <Grid item sm={3}  md={3}>
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">GSTIN</Label>
                  <Input
                    className={`form-control`}
                    type="text"
                    name="GSTIN"
                    value={formData.GSTIN}
                    onChange={(e) => handleInputChange(e)}
                    onBlur={(e) => handleInputBlur(e, "GSTIN", "")}

                  />
                
                </div>
              </FormGroup>
            </Grid>
          ) : (
            ""
          )}
          {/* <Col sm="12">
          <FormGroup>
            <div className="input_wrap">
              <Input
                type="select"
                name="branch"
                className={`form-control ${!branch ? "" : "not-empty"}
                ${errors.branch ? "input_error_state" : ""}`}
                onChange={(e) => handleInputChange(e)}
                onBlur={(e) => handleInputBlur(e, "branch", "")}
                value={branch}
              >
                <option style={{ display: "none" }}></option>
                {branchOptions.map((types) => (
                  <option key={types.id} value={types.id}>
                    {types.name}
                  </option>
                ))}
              </Input>
              <Label
                className="placeholder_styling"
                style={{ whiteSpace: "nowrap" }}
              >
                Branch *
              </Label>
            </div>
            <span className="errortext">
              {errors.branch && "Select branch"}
            </span>
          </FormGroup>
        </Col> */}
          {/* <Col sm="12">
          <FormGroup>
            <div className="input_wrap">
              <Input
                type="select"
                name="zone"
                className="form-control digits"
                onChange={(e) => handleInputChange(e)}
                onBlur={checkEmptyValue}
              >
                <option style={{ display: "none" }}></option>

                {zone.map((typeee) => (
                  <option key={typeee.id} value={typeee.id}>
                    {typeee.name}
                  </option>
                ))}
              </Input>

              <Label className="placeholder_styling">Zone *</Label>
            </div>

            <span className="errortext">{errors.zone && "Select Zone"}</span>
          </FormGroup>
        </Col> */}
        </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { formData, errors, zone, area } = state.KYCForm;
  return {
    first_name: formData.first_name || "",
    last_name: formData.last_name || "",
    registered_email: formData.registered_email || "",
    register_mobile: formData.register_mobile || "",
    alternate_mobile: formData.alternate_mobile || "",
    alternate_email: formData.alternate_email || "",
    branch: formData.branch || [],
    errors,
    formData,
    zone,
    areazone: area,
    zonename: formData.zonename,
    branch: formData.branch,
    id: formData.id,
    GSTIN: formData.GSTIN,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFormErrors: (payload) => dispatch(setFormErrors(payload)),
    handleChangeFormInput: (payload) =>
      dispatch(handleChangeFormInput(payload)),
    setZoneByBranch: (payload) => dispatch(setZoneByBranch(payload)),
    setAreaByZone: (payload) => dispatch(setAreaByZone(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormStep2);
