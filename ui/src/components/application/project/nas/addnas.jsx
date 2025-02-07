import React, { Fragment, useState, useRef, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button, Spinner
} from "reactstrap";
import { nasType, statusType } from "./nasdropdown";
import { adminaxios, networkaxios } from "../../../../axios";
import { toast } from "react-toastify";
import { passwordStrength } from 'check-password-strength';
import { isEmpty } from "lodash";
import {
  Add,
} from "../../../../constant";
import ErrorModal from "../../../common/ErrorModal";
import useFormValidation from "../../../customhooks/FormValidation";
import MaskedInput from "react-text-mask";
// Sailaja imported common component Sorting on 24th March 2023
import { Sorting } from "../../../common/Sorting";
import AddressComponent from "../../../common/AddressComponent";

const AddNas = (props, initialValues) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [formData, setFormData] = useState({
    //added Branch owner autopopulate in Add Nas by Marieya on 8/8/22
    // branch: JSON.parse(localStorage.getItem("token"))?.branch?.id ? JSON.parse(localStorage.getItem("token")).branch.id : "" ,
    branch: "",
    nas_type: "",
    name: "",
    ip_address: "",
    secret: "",
    status: "",
    accounting_interval_time: "",
    serial_no: "",
    house_no: "",
    street: "",
    city: "",
    landmark: "",
    pincode: "",
    district: "",
    state: "",
    country: "",
    latitude: "",
    longitude: "",
  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [branch, setBranch] = useState([]);
  const [resetStatus, setResetStatus] = useState(false);

  const [naspasswordScore, setNasPasswordScrore] = useState({});
  //to disable button
  const [disable, setDisable] = useState(false);
  useEffect(() => {
    if (props.lead) {
      setFormData((prevState) => {
        return {
          ...prevState,
          ...props.lead
        }
      })
    }
  }, [props.lead])

  const ipprops = {
    guide: true,
    mask: (value) => {
      let result = [];
      const chunks = value.split(".");

      for (let i = 0; i < 4; ++i) {
        const chunk = (chunks[i] || "").replace(/_/gi, "");

        if (chunk === "") {
          result.push(/\d/, /\d/, /\d/, ".");
          continue;
        } else if (+chunk === 0) {
          result.push(/\d/, ".");
          continue;
        } else if (
          chunks.length < 4 ||
          (chunk.length < 3 && chunks[i].indexOf("_") !== -1)
        ) {
          if (
            (chunk.length < 2 && +`${chunk}00` > 255) ||
            (chunk.length < 3 && +`${chunk}0` > 255)
          ) {
            result.push(/\d/, /\d/, ".");
            continue;
          } else {
            result.push(/\d/, /\d/, /\d/, ".");
            continue;
          }
        } else {
          result.push(...new Array(chunk.length).fill(/\d/), ".");
          continue;
        }
      }

      result = result.slice(0, -1);
      return result;
    },
    pipe: (value) => {
      if (value === "." || value.endsWith("..")) return false;

      const parts = value.split(".");

      if (
        parts.length > 4 ||
        parts.some((part) => part === "00" || part < 0 || part > 255)
      ) {
        return false;
      }

      return value;
    },
  };

  // Sailaja changed validation message on 2nd March 
  const handleInputChange = (event) => {
    // if( event.target.name == "ip_address" )
    if (event.target.name == "ip_address" && event.target.value.includes("_")) {
      setErrors((prevState) => {
        return {
          ...prevState,
          ip_address: "Enter valid IP address",
        };
      });
    } else {
      setErrors((prevState) => {
        return {
          ...prevState,
          // ip_address: "please enter valid ip address",
        };
      });
    }

    event.persist();
    setResetStatus(false);
    props.setIsDirtyFun('nas');
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;

    setFormData((preState) => ({
      ...preState,
      [name]: value,
    }));
    props.setformDataForSaveInDraft((preState) => ({
      ...preState,
      [name]: value,
    }));
    if (name == 'secret')
      validatePassword(name, value);
  };

  // password
  const passwordScoreObj = [
    {
      id: 0,
      value: "Bad",
      minDiversity: 0,
      minLength: 0
    },
    {
      id: 1,
      value: "Weak",
      minDiversity: 2,
      minLength: 4
    },
    {
      id: 2,
      value: "Medium",
      minDiversity: 3,
      minLength: 6
    },
    // {
    //   id: 3,
    //   value: "Strong",
    //   minDiversity: 4,
    //   minLength: 8
    // }
  ]
  const validatePassword = (name, value) => {
    const passwordStrengthObj = passwordStrength(value, passwordScoreObj)
    setNasPasswordScrore((prevState) => {
      return {
        ...prevState,
        [name]: passwordStrengthObj
      }
    })
  }

  const getPasswordStatus = (current) => {
    switch (current && current.id) {
      case 0:
        return <span> Strength : <span className="password-bad">{current.value} </span></span>
      case 1:
        return <span> Strength : <span className="password-weak">{current.value}</span></span>
      case 2:
        return <span> Strength : <span className="password-medium">{current.value}</span></span>
      // case 3:
      //   return  <span> Strength : <span className="password-strong">{current.value}</span></span>
      default:
        return null
    }
  }

  // password end

  // branch api
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        // setBranch([...res.data]);
        // Sailaja sorting the Optical network -> Add NAS->Select Branch & Branch Dropdowns data as alphabetical order on 24th March 2023
        setBranch(Sorting([...res.data], 'name'));

      })
      .catch(() =>
        toast.error("error branch list", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000
        })
      );
  }, []);

  const resetformmanually = () => {
    setFormData({
      branch: "",
      nas_type: "",
      name: "",
      ip_address: "",
      secret: "",
      status: "",
      accounting_interval_time: "",
      serial_no: "",
      house_no: "",
      street: "",
      city: "",
      landmark: "",
      pincode: "",
      district: "",
      state: "",
      country: "",
      latitude: "",
      longitude: "",
    });
    props.setformDataForSaveInDraft({
      branch: "",
      nas_type: "",
      name: "",
      ip_address: "",
      secret: "",
      status: "",
      accounting_interval_time: "",
      serial_no: "",
      house_no: "",
      street: "",
      city: "",
      landmark: "",
      pincode: "",
      district: "",
      state: "",
      country: "",
      latitude: "",
      longitude: "",
    });
    localStorage.removeItem('network/nas');
    localStorage.removeItem('networkDraftSaveKey');
    props.setLead({})
    props.setformDataForSaveInDraft({})
    props.setIsDirtyFun('');
    setNasPasswordScrore({})
    document.getElementById("resetid").click();
  };
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
    }
    if (!!localStorage.getItem('network/nas'))
      setFormData(props.lead);

  }, [props.rightSidebar]);

  //add nas call
  const addnas = () => {
    setDisable(true);
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let data = { ...formData };
    data.serial_no = { name: formData.serial_no };
    data.house_no = !isEmpty(formData.house_no) ? formData.house_no : "N/A";

    data.branch = JSON.parse(localStorage.getItem("token")) &&
      JSON.parse(localStorage.getItem("token")).branch &&
      JSON.parse(localStorage.getItem("token")).branch.id ? JSON.parse(localStorage.getItem("token")) &&
      JSON.parse(localStorage.getItem("token")).branch &&
    JSON.parse(localStorage.getItem("token")).branch.id : formData.branch;
    networkaxios
      .post("network/nas/create", data, config)
      .then((response) => {
        setDisable(false);
        toast.success("Nas was added successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000
        });
        props.Refreshhandler();
        props.dataClose()
        resetformmanually();
      })
      .catch(function (error) {
        setDisable(false);
        console.log(error, "errors");
    
        let errorMessage = "";
    
        if (error.response && error.response.data) {
            setErrors(error.response.data);
    
            if (error.response.data.detail) {
                errorMessage = error.response.data.detail;
            } 
            else if (error.response.data["name"] && error.response.data["name"].length > 0) {
                errorMessage = error.response.data["name"][0];
            } 
            else {
                errorMessage = "An error occurred";
            }
        } 
        else {
            const errorString = JSON.stringify(error);
            const is500Error = errorString.includes("500");
            if (is500Error) {
                errorMessage = "Internal server error. Something went wrong.";
            } 
            else {
                errorMessage = "Something went wrong";
            }
        }
    
        // Set the error message to be displayed in the modal and open the modal
        setModalMessage(errorMessage);  // Assuming you have a state updater called setModalMessage
        setShowModal(true);
    });     
      // .catch(function (error) {
      //   setDisable(false);
      //   console.log(error, "errors")
      //   const errorString = JSON.stringify(error);
      //   const is500Error = errorString.includes("500");
      //   if (error.response && error.response.data) {
      //     setErrors(error.response.data);
      //   } else if (is500Error) {

      //     toast.error("Something went wrong", {
      //       position: toast.POSITION.TOP_RIGHT,
      //     });
      //   }
      //   else {
      //     toast.error("Something went wrong", {
      //       position: toast.POSITION.TOP_RIGHT,
      //     });
      //   }

      //   if (error.response && error.response.data) {
      //     if (error.response.data["name"].length > 0) {
      //       toast.error(error.response.data["name"][0]);
      //     }
      //   }
      // });

  };

  const submit = (e) => {
    e.preventDefault();
    e = e.target.name;
    let dataNew = { ...formData }
    dataNew.nas_hardware_name = dataNew.name;
    const validationErrors = validate(dataNew);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      addnas();
    } else {
      console.log("errors try again", validationErrors);
    }
  };

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  const resetInputField = () => { };
  const resetForm = function () {
    setNasPasswordScrore({})
    setResetStatus(true);

    setInputs((inputs) => {
      var obj = {};
      for (var name in inputs) {
        obj[name] = "";
      }
      return obj;
    });
    setErrors({});
  };

  const form = useRef(null);

  const requiredFields = [
    "nas_hardware_name",
    // "branch",
    "nas_type",
    "ip_address",
    "secret",
    "status",
    "accounting_interval_time",
    "serial_no",
    "house_no",
    "street",
    "city",
    "pincode",
    "district",
    "state",
    "country",
    "landmark",
    "latitude",
    "longitude",
  ];
  const { validate, Error } = useFormValidation(requiredFields);

  // Form Validation Starts from here
  let dependency = formData["customer_documents"];
  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      console.log("called");
      checkFieldValidity("customer_documents");
    }
  }, [dependency]);

  const checkFieldValidity = (fieldName, parent) => {
    console.log("called");
    const validationErrors = validate(formData);
    let vErrors = {};
    if (validationErrors[fieldName]) {
      vErrors[fieldName] = validationErrors[fieldName];
    }

    console.log(vErrors);

    const noErrors = Object.keys(vErrors).length === 0;

    if (noErrors) {
      setErrors({ ...errors, ...{ [fieldName]: "" } });
    }
    setErrors({ ...errors, ...{ [fieldName]: vErrors[fieldName] } });
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
  // end of IP Address code by Marieya

  return (
    <Fragment>
      <Col sm="12">
        <Form onSubmit={submit} onReset={resetForm} id="myForm" ref={form}>
          <Row>

            {/* <Time/> */}
            {JSON.parse(localStorage.getItem("token")) &&
              JSON.parse(localStorage.getItem("token")).branch &&
              JSON.parse(localStorage.getItem("token")).branch.name ?


              <Col sm="4" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Branch *</Label>
                    <Input
                      // draft
                      className={`form-control digits not-empty`}
                      value={
                        JSON.parse(localStorage.getItem("token")) &&
                        JSON.parse(localStorage.getItem("token")).branch &&
                        JSON.parse(localStorage.getItem("token")).branch.name
                      }
                      type="text"
                      name="branch"
                      onChange={props.handleChange}
                      style={{ textTransform: "capitalize" }}
                      disabled={true}
                    />

                  </div>
                </FormGroup>
              </Col>
              : <Col sm="4" id="moveup">
                <FormGroup>
                  <div className="input_wrap">
                    <Label
                      className="kyc_label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Select Branch *
                    </Label>
                    <Input
                      type="select"
                      name="branch"
                      className={`form-control digits ${formData && formData.branch ? 'not-empty' : ''}`}
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      value={formData && formData.branch}
                    >
                      <option style={{ display: "none" }}></option>

                      {branch.map((types) => (
                        <option key={types.id} value={types.id}>
                          {types.name}
                        </option>
                      ))}
                    </Input>


                  </div>
                  <span className="errortext">{errors.branch && "Field is required"}</span>
                </FormGroup>
              </Col>}

            <Col sm="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">NAS Type *</Label>
                  <Input
                    type="select"
                    name="nas_type"
                    className={`form-control digits ${formData && formData.nas_type ? 'not-empty' : ''}`}
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={formData && formData.nas_type}
                  >
                    <option value="" style={{ display: "none" }}></option>

                    {nasType.map((nasedType) => {
                      return (
                        <option value={nasedType.id}>{nasedType.name}</option>
                      );
                    })}
                  </Input>
                </div>
                <span className="errortext">{errors.nas_type && "Selection is required"}</span>
              </FormGroup>
            </Col>
            <Col sm="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Name *</Label>
                  <Input
                    className={`form-control  ${formData && formData.name ? 'not-empty' : ''}`}
                    type="text"
                    name="name"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={formData && formData.name}
                  />
                </div>
                <span className="errortext">{errors.nas_hardware_name}</span>
              </FormGroup>
            </Col>
          </Row>
          <Row id="nas_field">
            <Col sm="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label
                    className="kyc_label"
                    style={{ left: "0% " }}
                  >
                    IP Address *
                  </Label>
                  <MaskedInput
                    {...ipprops}
                    style={{
                      width: "100%",
                      height: "calc(1.5em + 0.75rem + 2px)",
                      padding: "0.375rem 0.75rem",
                      fontSize: "1rem",
                      padding: "0.375rem 0.75rem",
                      fontWweight: "400",
                      lineHeight: "1.5",
                      color: "#495057",
                      backgroundColor: "#fff",
                      borderRadius: "0.25rem",
                      borderTopColor: "rgb(206, 212, 218)",
                      borderLeftColor: "rgb(206, 212, 218)",
                      borderTopWidth: "1px",
                      borderBottomColor: "rgb(206, 212, 218)",
                      borderRightColor: "rgb(206, 212, 218)",
                    }}
                    // (Start)Remove Error msg by Clicking next tab validation for IP address Field
                    // onBlur={checkEmptyValue}
                    onBlur={(e) =>
                      handleInputBlur(e, "ip_address")
                    }
                    name="ip_address"
                    onChange={handleInputChange}
                    value={formData && formData.ip_address}
                    className={`form-control  ${formData && formData.ip_address ? 'not-empty' : ''}${errors.email ? "error" : ""}`}
                  />


                </div>
                <span className="errortext"> {errors.ip_address && (
                  <span className="errortext">
                    {errors && errors.ip_address != ""
                      ? errors.ip_address
                      : ""}
                  </span>
                ) && <span>{errors.ip_address}</span>
                }
                  {/* // "IP Address is required"} */}
                </span>
                {/*(End) Remove Error msg by Clicking next tab validation for IP address Field */}

                {/* <span className="errortext">{errors.ip_address}</span> */}

              </FormGroup>
            </Col>
            <Col sm="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Secret *</Label>
                  <Input
                    type="text"
                    name="secret"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={formData && formData.secret}
                    className={`form-control  ${formData && formData.secret ? 'not-empty' : ''}`}
                  />
                </div>
                {/* {getPasswordStatus(naspasswordScore ? naspasswordScore.secret : null)}<br/> */}
                <span className="errortext">{errors.secret}</span>
              </FormGroup>
            </Col>
            <Col sm="4" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Status *</Label>
                  <Input
                    type="select"
                    name="status"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={formData && formData.status}
                    className={`form-control  ${formData && formData.status ? 'not-empty' : ''}`}
                  >
                    <option value="" style={{ display: "none" }}></option>

                    {statusType.map((status) => {
                      return <option value={status.id} >{status.name}</option>;
                    })}
                  </Input>
                </div>
                <span className="errortext">{errors.status}</span>
              </FormGroup>
            </Col>
          </Row>
          <Row style={{ marginTop: "-7%" }}>
            <Col sm="4" style={{ marginTop: "3%" }}>
              {/* Sailaja fixed position of validation message and respective text box on 22nd July Ref NET_18 */}
              <FormGroup style={{ paddingBottom: "1%", paddingTop: "5%" }}>
                <Label className="nas_label">Accounting Interval *</Label>

                <Input
                  type="time"
                  min="0"
                  step="1"
                  name="accounting_interval_time"
                  value={formData && formData.accounting_interval_time}
                  className={`form-control  ${formData && formData.accounting_interval_time ? 'not-empty' : ''} without`}
                  onChange={handleInputChange}
                  onBlur={checkEmptyValue}
                ></Input>


              </FormGroup>
              <span className="errortext" style={{ position: "relative", top: "-25px" }}>
                {errors.accounting_interval_time}
              </span>
            </Col>
            {/* Sailaja fixed position of validation message and respective text box on 22nd July Ref NET_18 */}
            <Col sm="4" style={{ paddingTop: "2.5%" }}>
              <FormGroup style={{ paddingBottom: "1%", paddingTop: "5%" }}>
                <div className="input_wrap" >
                  <Label className="nas_label">Serial Number *</Label>
                  <Input
                    type="text"
                    name="serial_no"
                    value={formData && formData.serial_no}
                    // .split(" ").join("")
                    className={`form-control  ${formData && formData.serial_no ? 'not-empty' : ''}`}
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                  />
                </div>

                <span className="errortext">{errors.serial_no}</span>

              </FormGroup>
            </Col>

          </Row>
          {props.accordionActiveKey == "0" && (
            <AddressComponent
              handleInputChange={handleInputChange}
              checkEmptyValue={checkEmptyValue}
              errors={errors}
              setFormData={setFormData}
              formData={formData}
              setInputs={setInputs}
              resetStatus={resetStatus}
              setResetStatus={setResetStatus}
              setIsDirtyFun={props.setIsDirtyFun}
              googleSearchId="pac-input-olt"
            />
          )}
          {/* <div className="password-notes" style={{position:"relative"}}>
               <div className="nas_field_strength">Secret Field Strength :</div>
               <ul>
                <li>At least 8 characters—the more characters, the better</li>
                <li>A mixture of both uppercase and lowercase letters</li>
                <li>A mixture of letters and numbers</li>
                <li>Inclusion of at least one special character, e.g., ! @ # ? ]</li>
              </ul> 
             </div> */}
          <br />
          <Row>
            <Col sm="2">
              <FormGroup className="mb-0">
                <Button
                  // id="bringcenter"
                  id="create_button"
                  color="btn btn-primary"
                  type="submit"
                  className="mr-3"
                  onClick={resetInputField}
                  // disabled={
                  //   !naspasswordScore ||
                  //   !naspasswordScore.secret ||
                  //   (naspasswordScore &&
                  //     naspasswordScore.secret &&
                  //     naspasswordScore.secret.id != 2) 
                  //   // !passwordScore.password2 ||
                  //   // (passwordScore &&
                  //   //   passwordScore.password2 &&
                  //   //   passwordScore.password2.id != 3)
                  // }
                  style={{ textAlign: "center !important" }}
                  disabled={disable}
                >
                  {disable ? <Spinner size="sm"> </Spinner> : null}
                  {Add}
                </Button>
              </FormGroup>
            </Col>
            {/* Sailaja fixed Reset button styles on 22nd July Ref NET_19 */}
            {/*Changes in reset button css by marieya on 20/8/22*/}

            <Col sm="2" >
              <FormGroup className="mb-0" >
                <Button
                  type="reset"
                  onClick={resetformmanually}
                  color="btn btn-primary"
                  // class="center1"
                  id="resetid"
                  style={{
                    width: '103px',
                    height: '40px'
                  }}

                >
                  Reset
                </Button>
              </FormGroup>
            </Col>
          </Row>
          <ErrorModal
        isOpen={showModal}
        toggle={() => setShowModal(false)}
        message={modalMessage}
        action={() => setShowModal(false)}
      />
        </Form>
      </Col>
    </Fragment>
  );
};

export default AddNas;
