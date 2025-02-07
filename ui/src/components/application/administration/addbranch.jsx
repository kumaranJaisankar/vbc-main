import React, { Fragment, useState, useRef, useEffect } from "react";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Spinner } from "reactstrap";
import useFormValidation from "../../customhooks/FormValidation";
import { adminaxios ,franchiseaxios} from "../../../axios";
import { Add } from "../../../constant";
import { toast } from "react-toastify";
import { isEmpty } from "lodash";
import AddressComponent from "../../common/AddressComponent";
import GstCodes from "../franchise/GstCodes"

// Sailaja imported common component Sorting on 28th March 2023
import { Sorting } from "../../common/Sorting";

const AddBranch = (props, initialValues) => {
  const [gstCode, setGstCode] = React.useState([])
  const [formData, setFormData] = useState({
    name: "",
    franchise: "",
    // district: '',
    // pincode: '',
    // street: '',
    // state: '',
    // city:'',
    // country:"India",
    // landmark:'',
    house_no: "",
    googleAddress: "",
    // franchise: 1,
  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const [loaderSpinneer, setLoaderSpinner] = useState(false)

  //address component google api
  const [resetStatus, setResetStatus] = useState(false);
  const [ownerlist, setOwnerlist] = useState([]);

  // sms toggle
  const [smsToggle, setSmsToggle] = useState("on");
  const [istelShow, setTelIsShow] = React.useState(true);
  function SMSToggle() {
    setSmsToggle(smsToggle === "on" ? "off" : "on");
    setTelIsShow(!istelShow);
  }

  const [whatsappToggle, setWhatsappToggle] = useState("on");
  const [iswhatsShow, setWhatsIsShow] = React.useState(true);
  function WHATSAPPToggle() {
    setWhatsappToggle(whatsappToggle === "on" ? "off" : "on");
    setWhatsIsShow(!iswhatsShow);
  }
  


  // email toggle
  const [emailToggle, setEmailToggle] = useState('on');
  const [isShow, setIsshow] = React.useState(true);
  function EmailToggle() {
    setEmailToggle(emailToggle === "on" ? "off" : "on");
    setIsshow(!isShow)
  }

  // draft
  useEffect(() => {
    if (props.lead) {
      setFormData((prevState) => {
        return {
          ...prevState,
          ...props.lead,
        };
      });
    }
  }, [props.lead]);
  //end

  const handleInputChange = (event) => {
    event.persist();
    // draft
    props.setIsDirtyFun(true);
    //end
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;
    if (target.name === "roles" || target.name === "permissions") {
      value = [target.value];
    }

    if (target.type === "checkbox") {
      if (target.checked) {
        formData.hobbies[value] = value;
      } else {
        formData.hobbies.splice(value, 1);
      }
    } else {
      setFormData((preState) => ({
        ...preState,
        [name]: value.charAt(0).toUpperCase() + value.slice(1),
      }));
    }
  };
  //draft
  useEffect(() => {
    props.setformDataForSaveInDraft(formData);
  }, [formData]);



  // const branchAdd = () => {
  //   var config = {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   };
  //   let address = {
  //     h_no: formData["address.h_no"],
  //     city: formData["address.city"],

  //     district: formData["address.district"],
  //     area: formData["address.area"],

  //     country: formData["address.country"],
  //   };

  //   formData.address = { ...address };

  //   adminaxios
  //     .post("accounts/branch/create", formData, config)
  //     .then((response) => {
  //       console.log(response.data);
  //       props.onUpdate(response.data);
  //       resetformmanually();
  //       toast.success("Branch was added successfully", {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //     })
  //     .catch(function (error) {
  //       console.error("Something went wrong!", error);
  //       // this.setState({ errorMessage: error });
  //     });
  // };

  const resetformmanually = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      landline: "",
      street: "",
      googleAddress: "",
      franchise: "",
      code: "",
      owner: "",
      street: "",
      landmark: "",
      district: "",
      city: "",
      pincode: "",
      state: "",
      country: "",
      latitude: "",
      longitude: "",
      house_no: "",
      invoice_code: "",
      customer_wallet_limit :""
    });
    //Sailaja modified clear_form_data on 26th July
    document.getElementById("resetid").click();
    document.getElementById("myForm").reset();
    setResetStatus((preState) => !preState);
  };
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
    }
    //draft
    setFormData(props.lead);
  }, [props.rightSidebar]);

  const branchAdd = (e) => {
    // e.preventDefault();
    setLoaderSpinner(true);
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let address = {
      house_no: !isEmpty(formData.house_no) ? formData.house_no : "N/A",
      city: formData["city"],
      landmark: formData["landmark"],
      district: formData["district"],
      pincode: formData["pincode"],
      street: formData["street"],
      country: formData["country"],
      state: formData["state"],
    };

    formData.address = { ...address };
    // formData.franchise = 1;
    formData.sms = istelShow;
    formData.email = isShow;
    formData.whatsapp_flag=iswhatsShow;
    const andhraPradeshId = gstCode.find(item => item.name === "Andhra Pradesh")?.id;
// console.log(andhraPradeshId,"andhraPradeshId")
formData.gst_codes = formData.gst_codes ? formData.gst_codes : [andhraPradeshId];
    if(formData.branch_wallet_limit===""){
      delete formData.branch_wallet_limit
    } else if (formData.customer_wallet_limit === ""){
      delete formData.customer_wallet_limit
    } else if (formData.shifting_charges){
      delete formData.shifting_charges
    } 
    adminaxios
      .post("accounts/branch/create", formData, config)
      .then((response) => {
        setLoaderSpinner(false);
        props.onUpdate(response.data);
        resetformmanually();
        toast.success("Branch was added successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      })
      .catch(function (error) {
        setLoaderSpinner(false);
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        }
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        console.error("Something went wrong!", error);
      });
  };

  //validdations

  const submit = (e) => {
    e.preventDefault();
    e = e.target.name;
    let newbranchinput = { ...inputs }
    newbranchinput.branch_code = newbranchinput.code
    console.log(formData);
    const validationErrors = validate(newbranchinput);
    // const validationErrors = validate(formData);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      branchAdd();
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

  const resetForm = function () {
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
//validation
// Sailaja modified Branch code in requiredFields on 4th March 
  const requiredFields = [
    "name",
    "city",
    "district",
    "state",
    "country",
    "pincode",
    "street",
    "house_no",
    "latitude",
    "longitude",
    "landmark",
    "owner",
    "code",
    "invoice_code",
     "branch_code", 
    "branch_code",
    // "branch_wallet_limit"
    // Sailaja modified Branch code in requiredFields on 4th March 
  ];


  const { validate, Error } = useFormValidation(requiredFields);
  //owners api
  useEffect(() => {
    adminaxios
      .get("accounts/options/all")
      .then((res) => {
        let { role_wise_users } = res.data;
        //   setOwnerlist([...role_wise_users.branch_owners]);
        // Sailaja sorting the Branch Module -> New Panel-> User * Dropdown data as alphabetical order on 28th March 2023
        setOwnerlist(Sorting(([...role_wise_users.branch_owners]),"username"));
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    franchiseaxios
      .get('franchise/dropdown/gst')
      .then((res) => {
        setGstCode([...res.data]);
      })
  }, [])

  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <Row style={{ marginTop: "2%", marginLeft: "-2%" }}>
          <Col sm="12">
            <Form
              id="myForm"
              onReset={resetForm}
              ref={form}
              style={{ marginTop: "-2%" }}
            >
              <Row>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Branch Name *</Label>
                      <Input
                        // className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        // draft
                        className={`form-control digits ${formData && formData.name ? "" : "not-empty"
                          }`}
                        // value={formData && formData.name}
                        style={{ textTransform: "capitalize" }}
                      />
                    </div>
                    <span className="errortext">{errors.name}</span>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">User *</Label>

                      <Input
                        type="select"
                        name="owner"
                        className="form-control digits"
                        onBlur={checkEmptyValue}
                        onChange={handleInputChange}
                        value={formData && formData.owner}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        {ownerlist.map((branchowner) => (
                          <option key={branchowner.id} value={branchowner.id}>
                            {branchowner.username}
                          </option>
                        ))}
                      </Input>
                    </div>
                    <span className="errortext">
                      {errors.owner && "Selection is required"}
                    </span>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Branch Code *</Label>
                      <Input
                        type="text"
                        name="code"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        // draft
                        className={`form-control digits ${formData && formData.name ? "" : "not-empty"
                          }`}
                        style={{ textTransform: "capitalize" }}
                      // value={formData && formData.code}
                      />
                    </div>
                    {/* Sailaja modified Branch code for unique validations on 4th March */}
                    <span className="errortext">
                      {errors.branch_code}
                    </span>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Invoice Code *</Label>
                      <Input
                        type="text"
                        name="invoice_code"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        onInput={(e) => e.target.value = ("" + e.target.value).toUpperCase()}
                        // draft
                        className={`form-control digits ${formData && formData.invoice_code ? "" : "not-empty"
                          }`}
                        style={{ textTransform: "capitalize" }}
                      />
                    </div>
                    <span className="errortext">{errors.invoice_code}</span>
                  </FormGroup>
                </Col>
                <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label" >Branch Wallet Limit </Label>
                      <Input
                        style={{ textTransform: "capitalize" }}
                        name="branch_wallet_limit"
                        type="number"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        min="0"
                        // onKeyDown={(evt) =>
                        //   (evt.key === "e" ||
                        //     evt.key === "E" ||
                        //     evt.key === "." ||
                        //     evt.key === "-") &&
                        //   evt.preventDefault()
                        // }
                        onKeyDown={(evt) => {
                          if (evt.target.value === "" && evt.key === "0") {
                            evt.preventDefault();
                          }
                          if (
                            evt.key === "e" ||
                            evt.key === "E" ||
                            evt.key === "." ||
                            evt.key === "-" ||
                            (evt.key === "0" && evt.target.value === "0")
                          ) {
                            evt.preventDefault();
                          }
                        }}
                        className={`form-control digits ${formData && formData.branch_wallet_limit ? "" : "not-empty"
                          }`}
                      />
                    </div>
                    {/* <span className="errortext">{errors.branch_wallet_limit}</span> */}
                  </FormGroup>
                </Col>
                <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Shifting Charges  </Label>
                      <Input
                        style={{ textTransform: "capitalize" }}
                        name="shifting_charges"
                        type="number"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        min="0"
                        // onKeyDown={(evt) =>
                        //   (evt.key === "e" ||
                        //     evt.key === "E" ||
                        //     evt.key === "." ||
                        //     evt.key === "-") &&
                        //   evt.preventDefault()
                        // }
                        onKeyDown={(evt) => {
                          if (evt.target.value === "" && evt.key === "0") {
                            evt.preventDefault();
                          }
                          if (
                            evt.key === "e" ||
                            evt.key === "E" ||
                            evt.key === "." ||
                            evt.key === "-" ||
                            (evt.key === "0" && evt.target.value === "0")
                          ) {
                            evt.preventDefault();
                          }
                        }}
                        // draft
                        className={`form-control digits ${formData && formData.shifting_charges ? "" : "not-empty"
                          }`}
                      />
                    </div>
                    {/* <span className="errortext">{errors.shifting_charges}</span> */}
                  </FormGroup>
                </Col>
                <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label" >Customer Wallet Limit </Label>
                      <Input
                        style={{ textTransform: "capitalize" }}
                        name="customer_wallet_limit"
                        type="number"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        min="0"
                        // onKeyDown={(evt) =>
                        //   (evt.key === "e" ||
                        //     evt.key === "E" ||
                        //     evt.key === "." ||
                        //     evt.key === "-") &&
                        //   evt.preventDefault()
                        // }
                        onKeyDown={(evt) => {
                          if (evt.target.value === "" && evt.key === "0") {
                            evt.preventDefault();
                          }
                          if (
                            evt.key === "e" ||
                            evt.key === "E" ||
                            evt.key === "." ||
                            evt.key === "-" ||
                            (evt.key === "0" && evt.target.value === "0")
                          ) {
                            evt.preventDefault();
                          }
                        }}
                        className={`form-control digits ${formData && formData.customer_wallet_limit ? "" : "not-empty"
                          }`}
                      />
                    </div>
                    {/* <span className="errortext">{errors.customer_wallet_limit}</span> */}
                  </FormGroup>
                </Col>


                {/* <Col sm="4">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="franchise"
                    className={`form-control digits ${formData && formData.franchise ? 'not-empty' :''}`}
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={formData && formData.franchise}
                  >
                    <option style={{ display: "none" }}></option>

                    {franchiselist.map((franchise) => (
                      <option key={franchise.id} value={franchise.id}>
                        {franchise.franchise_name}
                      </option>
                    ))}
                  </Input>

                  <Label
                    className="placeholder_styling"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Select Franchise
                  </Label>
                </div>
                <span className="errortext">{errors.franchise && 'Select franchise'}</span>
              </FormGroup>
            </Col> */}
              </Row>
              <Row >
                <Col id="moveup">
                  <div style={{ fontSize: "19px", fontWeight: "600" }}>Configuration:</div>
                </Col>
              </Row>
              <Row >
                <Col sm="3">
                  <Label className="kyc_label">Email</Label>
                  <br />
                  <div
                    className={`franchise-switch ${emailToggle}`}
                    onClick={EmailToggle}
                  />
                </Col>
                <Col sm="3">
                  <Label className="kyc_label">SMS</Label>
                  <br />
                  <div
                    className={`franchise-switch ${smsToggle}`}
                    onClick={SMSToggle}
                  />
                </Col>
                <Col sm="3">
                  <Label className="kyc_label">Whatsapp</Label>
                  <br />
                  <div
                    className={`franchise-switch ${whatsappToggle}`}
                    onClick={WHATSAPPToggle}
                  />
                </Col>
              </Row>
              <br /><br />
              <Row>
                <Col id="moveup">
                  <FormGroup>
                    <Label className="kyc_label">GST Codes </Label>
                    {console.log(gstCode,"inputs.gstCode")}
                    <GstCodes
                      data={gstCode}
                      fieldNames={inputs.gstCode}
                      placeholder="GST Codes"
                      setFormData={setFormData}
                    />
                    {/* <span className="errortext">{errors.gst_codes && "Selection is required"}</span> */}
                  </FormGroup>
                </Col>
              </Row>
              <br/>
              {/* <Row>
                <h6 style={{ paddingLeft: "20px" }}>Address</h6>
              </Row> */}
              {/* //address component google api calling */}

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
                resetformmanually={resetformmanually}
              />
              {/*Spinner added to create button by Marieya on 25.8.22*/}

              <Row>
                <span
                  className="sidepanel_border"
                  style={{ position: "relative", top: "0px" }}
                ></span>
                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="button"
                      className="mr-3"
                      onClick={submit}
                      id="create_button"
                      disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
                    >
                      {loaderSpinneer ? <Spinner size="sm" id="spinner"></Spinner> : null} &nbsp;
                      {Add}
                    </Button>
                    <Button
                      type="reset"
                      color="btn btn-secondary"
                      id="resetid"
                      onClick={resetformmanually}
                    >
                      Reset
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default AddBranch;
