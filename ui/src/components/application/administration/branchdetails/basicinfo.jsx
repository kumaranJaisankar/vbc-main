import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Input,
  Form,
  Label,
  Table,
  FormGroup,
  Spinner,
} from "reactstrap";
import { adminaxios, franchiseaxios } from "../../../../axios";
import useFormValidation from "../../../customhooks/FormValidation";
import { NETWORK } from "../../../../utils/permissions";
import { toast } from "react-toastify";
import isEmpty from "lodash/isEmpty";
import AddressComponentDetailsPage from "../../../common/AddressComponentDetailsPage";
import EditGstCodes from "../../franchise/franchisedetails/EditGstCodes";
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
const BranchInfo = (props, initialValues) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});

  const [errors, setErrors] = useState({});
  //gst code state
  const [gstCode, setGstCode] = useState([]);
  const [resetfield, setResetfield] = useState(false);

  const [leadUser, setLeadUser] = useState(props.lead);
  const [resetStatus, setResetStatus] = useState(false);
  const [inputs, setInputs] = useState(initialValues);
  //to disable button
  const [disable, setDisable] = useState(false);
  // sms toggle
  const [smsToggle, setSmsToggle] = useState("off");
  const [istelShow, setTelIsShow] = React.useState(false);
  function SMSToggle() {
    setSmsToggle(smsToggle === "off" ? "on" : "off");
    setTelIsShow(!istelShow);
  }
  // esits sms
  // const [ownerlist, setOwnerlist] = useState([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState(props?.lead?.owner?.id);
  const [ownerlist, setOwnerlist] = useState([]);


  // useEffect(() => {
  //   adminaxios
  //     .get("accounts/options/all")
  //     .then((res) => {
  //       console.log("API Response: ", res.data);
  //       let { role_wise_users } = res.data;
  //       //   setOwnerlist([...role_wise_users.branch_owners]);
  //       // Sailaja sorting the Branch Module -> New Panel-> User * Dropdown data as alphabetical order on 28th March 2023
  //       setOwnerlist([...role_wise_users.branch_owners]);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);

  const [smsToggle1, setSmsToggle1] = useState("on");
  const [istelShow1, setTelIsShow1] = React.useState(true);
  function SMSToggle1() {
    setSmsToggle1(smsToggle1 === "on" ? "off" : "on");
    setTelIsShow1(!istelShow1);
  }

  // email toggle
  const [emailToggle, setEmailToggle] = useState("off");
  const [isShow, setIsshow] = React.useState(false);
  function EmailToggle() {
    setEmailToggle(emailToggle === "off" ? "on" : "off");
    setIsshow(!isShow);
  }
  // esits email
  const [emailToggle1, setEmailToggle1] = useState("on");
  const [isShow1, setIsshow1] = React.useState(true);
  function EmailToggle1() {
    setEmailToggle1(emailToggle1 === "on" ? "off" : "on");
    setIsshow1(!isShow1);
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

  //gst api
  useEffect(() => {
    franchiseaxios.get("franchise/dropdown/gst").then((res) => {
      setGstCode([...res.data]);
      console.log(res.data, "hiii");
    });
  }, []);

  useEffect(() => {
    if (!!props.lead)
      setLeadUser((prevState) => {
        return {
          ...prevState,
          ...props.lead,
        };
      });
  }, [props.lead]);

  useEffect(() => {
    props.setIsdisabled(true);

    if (!isEmpty(props.lead)) {
      let leadData = { ...props.lead };
      for (let key in leadData.address) {
        if (key !== "id") {
          leadData[key] = leadData.address[key];
        }
      }
      if (!!props.lead)
        setLeadUser((prevState) => {
          return {
            ...prevState,
            ...props.lead,
          };
        });
    }
  }, [props.rightSidebar]);

  const handleChange = (e) => {
    console.log('handleChange triggered');
    const target = e.target;
    const name = target.name;
    let val = e.target.value;
    const value = target.value; // You should add this line
    if (
      e.target.name == "street" ||
      e.target.name == "city" ||
      e.target.name == "landmark" ||
      e.target.name == "country" ||
      e.target.name == "pincode" ||
      e.target.name == "district" ||
      e.target.name == "state" ||
      e.target.name == "house_no"
    ) {
      let address = { ...leadUser.address, [e.target.name]: e.target.value };
      setLeadUser(() => ({ ...leadUser, address: address }));
    } else {
      setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    if (name === "owner") {
      setSelectedOwnerId(value);
      
      setLeadUser(prevState => {
        const updatedState = { ...prevState, owner: { id: value } };
        console.log("Updated State", updatedState); // Debugging line
        return updatedState;
      });
    }
    // if (name === "branch"){
    //   owner(val);
    // }
    // setUpdate(() => ({ [e.target.name]: e.target.value }));
  };

  const branchDetails = (id) => {
    if (!props.isDisabled) {
      setDisable(true);
      // delete leadUser.owner;
      let data = { ...leadUser };
      data.owner = selectedOwnerId;
      console.log(leadUser,"testtt")

      data.email = leadUser?.email ? isShow1 : isShow;
      data.sms = leadUser?.sms ? istelShow1 : istelShow;
      data.whatsapp_flag=leadUser?.whatsapp_flag?iswhatsShow1:iswhatsShow;
      console.log(leadUser, "leadUser");
      if (leadUser.gst_code && typeof leadUser.gst_code === "object") {
        data.gst_code = leadUser.gst_code.id;
      } else {
        // If gst_code is already an ID (not an object), send it as is
        data.gst_code = leadUser.gst_code;
      }

      // If gst_codes is an array of objects, send an array of their IDs
      if (Array.isArray(leadUser.gst_codes) && leadUser.gst_codes.length > 0) {
        if (typeof leadUser.gst_codes[0] === "object") {
          data.gst_codes = leadUser.gst_codes.map((item) => item.id);
        }
      }
      // const formattedData_gst_codes = props.lead?.gst_codes?.map(item => item.id);
      // data.gst_code_new =formattedData_gst_codes

      adminaxios
        .patch(`/accounts/branch/${id}/rud`, data)
        .then((res) => {
          setDisable(false);
          props.onUpdate(res.data);
          // props.detailsUpdate(res.data);
          toast.success("Branch updated successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          props.setIsdisabled(true);
        })
        .catch(function (error) {
          setDisable(false);
          if (error.response && error.response.data) {
            setErrors(error.response.data);
          }
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        });
    }
  };
  const handleSubmit = (e, id) => {
    console.log("clickedd");
    e.preventDefault();
    e = e.target.name;
    const validationErrors = validate(leadUser);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      branchDetails(id);
    } else {
      console.log("errors try again", validationErrors);
    }
  };

  //  useEffect(() => {
    const owner = () =>{
      adminaxios
      .get(`accounts/options/branchowner/${props?.lead?.id}`)
      .then((res) => {
        console.log("API Response: ", res.data);
        let { role_wise_users } = res.data;
        //   setOwnerlist([...role_wise_users.branch_owners]);
        // Sailaja sorting the Branch Module -> New Panel-> User * Dropdown data as alphabetical order on 28th March 2023
        setOwnerlist([...role_wise_users.branch_owners]);
      })
      .catch((error) => console.log(error));
    }
  // }, []);

  useEffect(()=>{
    owner()
  },[])
  //validation
  const requiredFields = [
    "house_no",
    "street",
    "landmark",
    "city",
    "pincode",
    "district",
    "state",
    "country",
    "branch_wallet_limit",
    "customer_wallet_limit",
    "shifting_charges",
  ];
  const { validate, Error } = useFormValidation(requiredFields);

  useEffect(() => {
    if (props.openCustomizer) {
      setErrors({});
      setInputs(prevState => ({
        ...prevState,
        owner: "" // resetting the owner to an empty string
      }));
      owner()
    }
  }, [props.openCustomizer]);
  // removed extra edit icon by Marieya
  return (
    <Fragment>
      <Container fluid={true}>
        <br />
        <Form
        // onSubmit={(e) => {
        //   handleSubmit(e, props.lead.id);
        // }}
        >
          <Row style={{ marginTop: "2%" }}>
            <Col md="3" id="moveup">
              <div className="input_wrap">
                <Label className="kyc_label">Branch</Label>

                <Input
                  className={`form-control digits not-empty`}
                  id="afterfocus"
                  type="text"
                  name="name"
                  style={{ border: "none", outline: "none" }}
                  value={leadUser && leadUser.name}
                  onChange={handleChange}
                  // onBlur={blur}
                  // disabled={true}
                  disabled={props.isDisabled}
                />
              </div>
            </Col>
            <span className="errortext">{errors.name}</span>

            <Col md="3" id="moveup">
              {console.log(leadUser,"leadUser")}
              <div className="input_wrap">
                <Label className="kyc_label">Owner</Label>

                <Input
                  className={`form-control digits not-empty`}
                  id="afterfocus"
                  type="select"
                  name="owner"
                  style={{ border: "none", outline: "none" }}
                  value={leadUser && leadUser.owner && leadUser.owner.id}
                  onChange={handleChange}
                  // onBlur={blur}
                  disabled={props.isDisabled}
                >
                  <option value="" style={{ display: "none" }}></option>
                  {ownerlist.map((branchowner) => (
                    <option key={branchowner.id} value={branchowner.id}>
                      {branchowner.username}
                    </option>
                  ))}
                </Input>
              </div>
            </Col>

            <Col md="3" id="moveup">
              <div className="input_wrap">
                <Label className="kyc_label">Branch Code</Label>

                <Input
                  className={`form-control digits not-empty`}
                  id="afterfocus"
                  type="text"
                  name="code"
                  style={{ border: "none", outline: "none" }}
                  value={leadUser && leadUser.code}
                  onChange={handleChange}
                  // onBlur={blur}
                  // disabled={true}
                  // disabled={props.isDisabled}
                  disabled={
                    token.permissions.includes(NETWORK.BRANCH_CODE_EDIT)
                      ? props.isDisabled
                      : true
                  }
                />
              </div>
            </Col>
            <Col md="3" id="moveup" style={{ marginLeft: "-10px" }}>
              <div className="input_wrap">
                <Label className="kyc_label">Invoice Code</Label>
                <Input
                  className={`form-control digits not-empty`}
                  id="afterfocus"
                  type="text"
                  name="invoice_code"
                  style={{ border: "none", outline: "none" }}
                  value={leadUser && leadUser.invoice_code}
                  onChange={handleChange}
                  // onBlur={blur}
                  // disabled={true}
                  // disabled={props.isDisabled}
                  disabled={
                    token.permissions.includes(NETWORK.BRANCH_INVOICE_CODE_EDIT)
                      ? props.isDisabled
                      : true
                  }
                />
              </div>
            </Col>
          </Row>
          <br />
          <Row>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">Shifting Charges *</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="number"
                    min="0"
                    name="shifting_charges"
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
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label
                    className="desc_label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Branch Wallet Limit *
                  </Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="number"
                    min="0"
                    name="branch_wallet_limit"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={leadUser && leadUser.branch_wallet_limit}
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

                  <span className="errortext">
                    {errors.branch_wallet_limit}
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label
                    className="desc_label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Customer Wallet Limit *
                  </Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="number"
                    min="0"
                    name="customer_wallet_limit"
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

                  <span className="errortext">
                    {errors.customer_wallet_limit}
                  </span>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <div style={{ fontSize: "19px", fontWeight: "600" }}>
                Configuration:
              </div>
            </Col>
          </Row>
          <Row>
            {leadUser?.email === true ? (
              <Col sm="3">
                <Label className="kyc_label">Email</Label>
                <br />
                <div
                  className={`franchise-switch ${emailToggle1}`}
                  onClick={EmailToggle1}
                />
              </Col>
            ) : (
              <Col sm="3">
                <Label className="kyc_label">Email</Label>
                <br />
                <div
                  className={`franchise-switch ${emailToggle}`}
                  onClick={EmailToggle}
                />
              </Col>
            )}

            {/* sms */}
            {leadUser?.sms === true ? (
              <Col sm="3">
                <Label className="kyc_label">SMS</Label>
                <br />
                <div
                  className={`franchise-switch ${smsToggle1}`}
                  onClick={SMSToggle1}
                />
              </Col>
            ) : (
              <Col sm="3">
                <Label className="kyc_label">SMS</Label>
                <br />
                <div
                  className={`franchise-switch ${smsToggle}`}
                  onClick={SMSToggle}
                />
              </Col>
            )}
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
          <br />
          <Row>
            <Col id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="desc_label">GST Code</Label>
                  <EditGstCodes
                    arealist={gstCode}
                    placeholder="GST Codes"
                    setFormData={setLeadUser}
                    resetfield={resetfield}
                    setResetfield={setResetfield}
                    editRecord={props.lead}
                    onChange={handleChange}
                  />
                </div>
              </FormGroup>
            </Col>
          </Row>
          <br />
          <Row id="reaarangeaddress">
            <Col>
              <AddressComponentDetailsPage
                handleInputChange={handleChange}
                errors={errors}
                setFormData={setLeadUser}
                formData={leadUser}
                setInputs={setInputs}
                resetStatus={resetStatus}
                setResetStatus={setResetStatus}
                isDisabled={props.isDisabled}
              />
            </Col>
          </Row>
          <Row id="moveup">
            <Col>
              <h6>Branch Configuration</h6>
            </Col>
          </Row>
          <div style={{ display: "flex" }}>
            <Row>
              <Table
                className="table table-bordered"
                style={{ width: "max-content", borderRightColor: "white" }}
              >
                <thead>
                  <tr>
                    <th scope="col">{"Areas"}</th>
                    <th scope="col">{"Zones"}</th>
                  </tr>
                </thead>

                <tbody>
                  <td>
                    {leadUser &&
                      leadUser.areas &&
                      leadUser.areas.map((plan) => {
                        return (
                          <tr>
                            <td
                              scope="row"
                              style={{
                                marginTop: "0px",
                                borderColor: "white",
                                padding: "0.1rem",
                              }}
                            >
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
                                </div>
                              </FormGroup>
                            </td>
                          </tr>
                        );
                      })}
                  </td>
                  <td>
                    <tbody>
                      {leadUser &&
                        leadUser.zones &&
                        leadUser.zones.map((zoneunderbranch) => {
                          return (
                            <tr>
                              <td
                                scope="row"
                                style={{
                                  marginTop: "0px",
                                  borderColor: "white",
                                  padding: "0.1rem",
                                }}
                              >
                                <FormGroup>
                                  <div className="input_wrap">
                                    <input
                                      className={`form-control digits not-empty`}
                                      id="afterfocus"
                                      type="text"
                                      name="username"
                                      style={{
                                        border: "none",
                                        outline: "none",
                                      }}
                                      value={zoneunderbranch.name}
                                      onChange={handleChange}
                                      // onBlur={blur}
                                      disabled={true}
                                    ></input>
                                  </div>
                                </FormGroup>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </td>
                </tbody>
              </Table>
            </Row>

            {/* zone config */}
            {/* <Row>
              <Table
                className="table-border-vertical"
                style={{ width: "max-content" }}
              >
                <thead>
                  <tr>
                    <th scope="col">{"Zones"}</th>
                  </tr>
                </thead>
                <tbody>
                  {leadUser &&
                    leadUser.zones &&
                    leadUser.zones.map((zoneunderbranch) => {
                      return (
                        <tr>
                          <td scope="row" style={{ marginTop: "0px" }}>
                            <FormGroup>
                              <div className="input_wrap">
                                <input
                                  className={`form-control digits not-empty`}
                                  id="afterfocus"
                                  type="text"
                                  name="username"
                                  style={{ border: "none", outline: "none" }}
                                  value={zoneunderbranch.name}
                                  onChange={handleChange}
                                  // onBlur={blur}
                                  disabled={true}
                                ></input>
                              </div>
                            </FormGroup>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Row> */}
          </div>
          <Row>
            <span
              className="sidepanel_border"
              style={{ position: "relative", top: "19px" }}
            ></span>
          </Row>
          <br />
          <button
            type="button"
            name="submit"
            class="btn btn-primary"
            id="save_button"
            onClick={(e) => {
              handleSubmit(e, props.lead.id);
            }}
            disabled={disable}
          >
            {disable ? <Spinner size="sm"> </Spinner> : null}
            Save
          </button>
          &nbsp; &nbsp;
          <button
            type="button"
            name="Cancel"
            class="btn btn-secondary"
            onClick={props.dataClose}
            id="resetid"
          >
            Cancel
          </button>
        </Form>
      </Container>
    </Fragment>
  );
};

export default BranchInfo;
