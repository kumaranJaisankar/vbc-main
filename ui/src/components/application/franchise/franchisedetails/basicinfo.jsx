import React, { Fragment, useEffect, useState } from "react"; //hooks
import {
  Container,
  Row,
  Col,
  Form,
  Label,
  FormGroup,
  Table,
  Input,
  Spinner,
} from "reactstrap";
import { adminaxios, franchiseaxios } from "../../../../axios";
import { toast } from "react-toastify";
import Multiselect from "../multiselectcheckbox";
import useFormValidation from "../../../customhooks/FormValidation";
import { NETWORK } from "../../../../utils/permissions";
import EditGstCodes from "./EditGstCodes"
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
const BasicInfo = (props) => {
  const [leadUser, setLeadUser] = useState(props.lead);
  const [formData, setFormData] = useState({});
  const [resetfield, setResetfield] = useState(false);
  //state for getting area,zone
  const [arealist, setArealist] = useState([]);
  const [branch, setBranch] = useState([]);
  const [errors, setErrors] = useState({});
  //state for franchise status
  const [loaderSpinneer, setLoaderSpinner] = useState(false);
  // sms toggle
  const [smsToggle, setSmsToggle] = useState("off");
  const [istelShow, setTelIsShow] = React.useState(false);
  function SMSToggle() {
    setSmsToggle(smsToggle === "off" ? "on" : "off");
    setTelIsShow(!istelShow);
  }
  const [gstCode, setGstCode] = useState([])
  // esits sms

  const [smsToggle1, setSmsToggle1] = useState("on");
  const [istelShow1, setTelIsShow1] = React.useState(true);
  function SMSToggle1() {
    setSmsToggle1(smsToggle1 === "on" ? "off" : "on");
    setTelIsShow1(!istelShow1);
  }


  // email toggle
  const [emailToggle, setEmailToggle] = useState('off');
  const [isShow, setIsshow] = React.useState(false);
  function EmailToggle() {
    setEmailToggle(emailToggle === "off" ? "on" : "off");
    setIsshow(!isShow)
  }
  // esits email
  const [emailToggle1, setEmailToggle1] = useState('on');
  const [isShow1, setIsshow1] = React.useState(true);
  function EmailToggle1() {
    setEmailToggle1(emailToggle1 === "on" ? "off" : "on");
    setIsshow1(!isShow1)
  }

  const [whatsappToggle, setWhatsappToggle] = useState("off");
  const [iswhatsShow, setWhatsIsShow] = React.useState(false);
  function WHATSAPPToggle() {
    setWhatsappToggle(whatsappToggle === "off" ? "on" : "off");
    setWhatsIsShow(!iswhatsShow);
  }

  const [whatsappToggle1, setWhatsappToggle1] = useState("on");
  const [iswhatsShow1, setWhatsIsShow1] = React.useState(true);
  function WHATSAPPToggle1() {
    setWhatsappToggle1(whatsappToggle1 === "on" ? "off" : "on");
    setWhatsIsShow1(!iswhatsShow1);
  }
  useEffect(() => {
    if (props.lead) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...props.lead.address,
        },
      }));
      if (props.lead && props.lead.branch) displayZone(props.lead.branch.id);
      // if(props.lead && props.lead.id) displayGstCode(props.lead.id);
    }
    setLeadUser(props.lead);
  }, [props.lead]);

  // useEffect(() => {
  //   franchiseaxios
  //     .get("franchise/display7")
  //     // .then((res) => setData(res.data))
  //     .then((res) => {
  //       console.log(res);
  //       setLeadUser(res.data);
  //     });
  // }, []);

  const handleChange = (e) => {
    const target = e.target;
    var value = target.value;
    const name = target.name;

    let addressList = [
      "house_no",
      "street",
      "landmark",
      "city",
      "district",
      "state",
      "pincode",
      "country",
    ];
    if (addressList.includes(e.target.name)) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [e.target.name]: e.target.value,
        },
      }));
      setLeadUser((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [e.target.name]: e.target.value,
        },
      }));
      // setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    //upon select branch display zone
    if (name == "branch") {
      // getZonebyBranch(value);
      displayZone(value);
    }
    // if(name == "name"){
    //   displayGstCode(value)
    // }
  };
  //new code for handle submit
  const formattedData_gst_codes = props.lead?.gst_codes?.map(item => item.id);
  const handleSubmit = (e, id) => {

    e.preventDefault();
    e = e.target.name;

    let newleadUser = { ...leadUser }
    newleadUser.franchise_code = newleadUser.code
    const validationErrors = validate(newleadUser);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      franchiseDetails(id);
    } else {
      console.log("errors try again", validationErrors);
    }
  };
  //end
  const franchiseDetails = (id) => {
    setLoaderSpinner(true);
    let data = { ...formData };
    data.email = leadUser?.email ? isShow1 : isShow;
    data.sms = leadUser?.sms ? istelShow1 : istelShow;
    data.whatsapp_flag=leadUser?.whatsapp_flag?iswhatsShow1:iswhatsShow;
    // data.franchise_wallet_limit =  leadUser?.franchise_wallet_limit ? leadUser?.franchise_wallet_limit : null;
    // data.customer_wallet_limit =  leadUser?.customer_wallet_limit ? leadUser?.customer_wallet_limit : null;
    // data.shifting_charges = leadUser?.shifting_charges ? leadUser?.shifting_charges : null;
    // data.gst_codes= formattedData_gst_codes;
    franchiseaxios
      .patch(`franchise/update/${id}`, data)
      .then((res) => {
        setLoaderSpinner(false);
        props.onUpdate(res.data);
        props.Refreshhandler()
        toast.success("Franchise was edited successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        props.setIsdisabled(true);
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
        console.error("franchiseerror", error);
      });
  };
  //old code for handle submit
  //   const handleSubmit = (e, id) => {
  //     // if (e.key === "Enter" || e.key === "NumpadEnter") {
  //     e.preventDefault();
  //     const validationErrors = validate(formData);
  //     const noErrors = Object.keys(validationErrors).length === 0;
  //     setErrors(validationErrors);
  //     if (noErrors) {
  //     let data = { ...formData };
  //     franchiseaxios
  //       .patch(`franchise/update/${id}`, data)
  //       .then((res) => {
  //         console.log(res);
  //         console.log(res.data);
  //         props.onUpdate(res.data);
  //         toast.success("Franchise was edited successfully", {
  //           position: toast.POSITION.TOP_RIGHT,
  //           autoClose: 1000,
  //         });
  //         props.setIsdisabled(true);
  //       })
  //       .catch(function (error) {
  //         if (error.response && error.response.data) {
  //           setErrors(error.response.data);
  //         }
  //         toast.error("Something went wrong", {
  //           position: toast.POSITION.TOP_RIGHT,
  //           autoClose: 1000,
  //         });
  //         console.error("franchiseerror", error);
  //       });
  //     // }
  //   };
  // }
  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }
  // branch api
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        setBranch([...res.data]);
      })
      .catch((error) => console.log(error));
  }, []);
  //end

  //integrate api for zone and area
  const displayZone = (id) => {
    adminaxios
      .get(`accounts/branch/${id}/zones/areas`)
      .then((res) => {
        // let { branch_name } = res.data;
        setArealist([...res.data]);
      })
      .catch((error) => console.log(error));
    props.setIsdisabled(true);
  };
  //end

  // gst codes
  // displaygstcode
  //  const  displayGstCode = (id)=>{
  //     franchiseaxios.get(`franchise/dropdown/gstedit/${id}`).then((res)=>{
  //       setGstCode([...res.data]);
  //     })
  //   }

  useEffect(() => {
    franchiseaxios
      .get('franchise/dropdown/gst')
      .then((res) => {
        setGstCode([...res.data]);
        console.log(res.data, "hiii")
      })
  }, [])


  const requiredFields = [
    "areas",
    "name",
    "franchise_code",
    "status",
    "street",
    "house_no",
    "landmark",
    "city",
    "pincode",
    "district",
    "state",
    "franchise_wallet_limit",
    "customer_wallet_limit",
    "country",
    "shifting_charges"
  ];

  const { validate } = useFormValidation(requiredFields);



  useEffect(() => {
    if (!props.rightSidebar) {
      setErrors({});
    }
  }, [props.rightSidebar]);

  useEffect(() => {
    if (props.openCustomizer) {
      setErrors({});
    }
  }, [props.openCustomizer]);


  return (
    <Fragment>
      <br />
      <Container fluid={true} id="custinfo">
        <Form
        >
          <Row>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">
                    Franchise Name *
                  </Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="name"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={leadUser && leadUser.name}
                    onChange={handleChange}
                    disabled={props.isDisabled}
                  ></input>

                  <span className="errortext">{errors.name}</span>
                </div>
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">
                    Franchise Code *
                  </Label>
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="code"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.code}
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={props.isDisabled}
                  ></input>

                  <span className="errortext">
                    {errors.franchise_code}
                  </span>
                </div>
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">Branch Name</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="nanme"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.branch && leadUser.branch.name}
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">Status *</Label>
                  <Input
                    type="select"
                    name="status"
                    // className="form-control digits not-empty"
                    className={`form-control ${leadUser && leadUser.name ? "not-empty" : "not-empty"
                      }`}
                    onBlur={checkEmptyValue}
                    onChange={handleChange}
                    disabled={props.isDisabled}
                    value={leadUser && leadUser.status && leadUser.status.id}
                    // onChange={handleChange}
                    id="afterfocus"
                    style={{ border: "none", outline: "none" }}
                  >
                    <option value="" style={{ display: "none" }}></option>
                    {props.franchisestatus.map((franchiseStatus) => (
                      <option
                        key={franchiseStatus.id}
                        value={franchiseStatus.id}
                      >
                        {franchiseStatus.name}
                      </option>
                    ))}
                  </Input>
                  <span className="errortext">
                    {errors.status && "Field is required"}
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup" >
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">Invoice Code</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="invoice_code"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.invoice_code}
                    onChange={handleChange}
                    // disabled={true}
                    // disabled={props.isDisabled}
                    disabled={token.permissions.includes(NETWORK.FRANCHISE_INVOICE_CODE_EDIT) ? props.isDisabled: true} 
                  ></input>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup" >
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">
                    Shifting Charges *
                  </Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="number"
                    name="shifting_charges"
                    min="0"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={leadUser && leadUser.shifting_charges}
                    onChange={handleChange}
                    disabled={props.isDisabled}
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
                  ></input>

                  <span className="errortext">{errors.shifting_charges}</span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup" >
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">
                    Franchise Wallet Limit *
                  </Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="number"
                    min="0"
                    name="franchise_wallet_limit"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={leadUser && leadUser.franchise_wallet_limit}
                    onChange={handleChange}
                    disabled={props.isDisabled}
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
                  ></input>

                  <span className="errortext">{errors.franchise_wallet_limit}</span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup" >
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">
                    Customer Wallet Limit *
                  </Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="number"
                    name="customer_wallet_limit"
                    min="0"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={leadUser && leadUser.customer_wallet_limit}
                    onChange={handleChange}
                    disabled={props.isDisabled}
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
                  ></input>

                  <span className="errortext">{errors.customer_wallet_limit}</span>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <br />
          <Row>
            <Col id="moveup" >
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">GST Code</Label>
                  <EditGstCodes arealist={gstCode}
                    placeholder="GST Codes"
                    setFormData={setFormData}
                    resetfield={resetfield}
                    setResetfield={setResetfield}
                    editRecord={props.lead}
                    onChange={handleChange} />
                </div>
              </FormGroup>
            </Col>
          </Row>
          <br />
          <Row >
            <Col id="moveup">
              <div style={{ fontSize: "19px", fontWeight: "600" }}>Configuration:</div>
            </Col>
          </Row>

          <Row>
            {leadUser?.email === true ? <Col sm="3">
              <Label className="kyc_label">Email</Label>
              <br />
              <div
                className={`franchise-switch ${emailToggle1}`}
                onClick={EmailToggle1}
              />
            </Col> :
              <Col sm="3">
                <Label className="kyc_label">Email</Label>
                <br />
                <div
                  className={`franchise-switch ${emailToggle}`}
                  onClick={EmailToggle}
                />
              </Col>
            }
            {/* sms */}
            {leadUser?.sms === true ?
              <Col sm="3">
                <Label className="kyc_label">SMS</Label>
                <br />
                <div
                  className={`franchise-switch ${smsToggle1}`}
                  onClick={SMSToggle1}
                />
              </Col> :

              <Col sm="3">
                <Label className="kyc_label">SMS</Label>
                <br />
                <div
                  className={`franchise-switch ${smsToggle}`}
                  onClick={SMSToggle}
                />
              </Col>}
              {leadUser?.whatsapp_flag === true ? (
              <Col sm="3">
                <Label className="kyc_label">Whatsapp</Label>
                <br />
                <div
                  className={`franchise-switch ${whatsappToggle1}`}
                  onClick={WHATSAPPToggle1}
                />
              </Col>
            ) : (
              <Col sm="3">
                <Label className="kyc_label">Whatsapp</Label>
                <br />
                <div
                  className={`franchise-switch ${whatsappToggle}`}
                  onClick={WHATSAPPToggle}
                />
              </Col>
            )}



          </Row>
          <br /><br />
          <Row>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">H.No</Label>
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="house_no"
                    style={{ border: "none", outline: "none" }}
                    value={
                      leadUser && leadUser.address && leadUser.address.house_no
                    }
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={props.isDisabled}
                  ></input>
                </div>
                <span className="errortext">{errors.house_no}</span>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">Street *</Label>
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="street"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={
                      leadUser && leadUser.address && leadUser.address.street
                    }
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={props.isDisabled}
                  ></input>
                  <span className="errortext">{errors.street}</span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">Landmark *</Label>
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="landmark"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={
                      leadUser && leadUser.address && leadUser.address.landmark
                    }
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={props.isDisabled}
                  ></input>
                  <span className="errortext">{errors.landmark}</span>
                </div>
              </FormGroup>
            </Col>

            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">City *</Label>
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="city"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={
                      leadUser && leadUser.address && leadUser.address.city
                    }
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={props.isDisabled}
                  ></input>
                  <span className="errortext">{errors.city}</span>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">District *</Label>
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="district"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={
                      leadUser && leadUser.address && leadUser.address.district
                    }
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={props.isDisabled}
                  ></input>
                  <span className="errortext">{errors.district}</span>
                </div>
              </FormGroup>
            </Col>

            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">State *</Label>
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="state"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={
                      leadUser && leadUser.address && leadUser.address.state
                    }
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={props.isDisabled}
                  ></input>
                  <span className="errortext">{errors.state}</span>
                </div>
              </FormGroup>
            </Col>

            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">Pincode *</Label>
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="pincode"
                    style={{ border: "none", outline: "none" }}
                    value={
                      leadUser && leadUser.address && leadUser.address.pincode
                    }
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={props.isDisabled}
                  ></input>
                  <span className="errortext">{errors.pincode}</span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">Country *</Label>
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="country"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={
                      leadUser && leadUser.address && leadUser.address.country
                    }
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={props.isDisabled}
                  ></input>
                  <span className="errortext">{errors.country}</span>
                </div>
              </FormGroup>
            </Col>
          </Row>

          {props.showarea ? (
            <Row>
              <Col sm="4">
                <FormGroup>
                  <Multiselect
                    onChange={handleChange}
                    arealist={arealist}
                    setFormData={setFormData}
                    resetfield={resetfield}
                    setResetfield={setResetfield}
                    editRecord={props.lead}
                  />
                  <span className="errortext">{errors.areas}</span>
                </FormGroup>
              </Col>
            </Row>
          ) : (
            ""
          )}
          <Row>
            <Col>
              <h6>Franchise Configuration</h6>
            </Col>
          </Row>
          <Row>
            <Table
              className="table-border-vertical"
              style={{ width: "max-content" }}
            >
              <thead>
                <tr>
                  <th scope="col">{"Areas"}</th>
                </tr>
              </thead>
              <tbody>
                {leadUser &&
                  leadUser.areas &&
                  leadUser.areas.map((plan) => {
                    return (
                      <tr>
                        <td scope="row">
                          <FormGroup>
                            <div className="input_wrap">
                              <input
                                className={`form-control digits not-empty`}
                                id="afterfocus"
                                type="text"
                                name="username"
                                style={{ border: "none", outline: "none" }}
                                value={plan.name}
                                onChange={handleChange}
                                // onBlur={blur}
                                disabled={true}
                              ></input>
                              {/* <Label className="desc_label">Franchise Name</Label> */}
                            </div>
                          </FormGroup>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Row>

          <br />

          <Row>
            <span
              className="sidepanel_border"
              style={{ position: "relative", top: "5px" }}
            ></span>
            <Col sm="4">
              <button
                type="submit"
                name="submit"
                class="btn btn-primary"
                id="save_button_loader"
                onClick={(e) => {
                  handleSubmit(e, props.lead.id);
                }}
                disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
              >
                {loaderSpinneer ? <Spinner size="sm"> </Spinner> : null} &nbsp;
                <b>Save</b>
              </button>
              &nbsp;
              &nbsp;

              <button
                type="button"
                name="Cancel"
                class="btn btn-secondary"
                onClick={props.dataClose}
                id="resetid"
              >
                Cancel
              </button>
            </Col>
          </Row>
        </Form>
      </Container>
    </Fragment>
  );
};

export default BasicInfo;
