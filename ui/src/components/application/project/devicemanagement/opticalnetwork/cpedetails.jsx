import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Container,
  Row,
  Col,

  Form,
  Label,
  FormGroup, Spinner
} from "reactstrap";
import pick from "lodash/pick";
import { isEmpty } from "lodash";
import EditIcon from '@mui/icons-material/Edit';
// import {Globe} from "feather-icons";
import useFormValidation from "../../../../customhooks/FormValidation";
import { networkaxios } from "../../../../../axios";
import AddressComponent from "../../../../common/AddressComponent";
import moment from "moment";
import { NETWORK } from "../../../../../utils/permissions";
import ErrorModal from "../../../../common/ErrorModal";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}


const Cpedetails = (props, initialValues) => {
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [leadUser, setLeadUser] = useState(props.lead);
  // const [branch, setBranch] = useState([]);
  const [isDisabled, setIsdisabled] = useState(true);
  const [inputs, setInputs] = useState(initialValues);
  const [resetStatus, setResetStatus] = useState(false);
  //to disable button
  const [disable, setDisable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");  
  const [macAddress, setMacAddress] = useState("");
  const [macAddressParts, setMacAddressParts] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [separator, setSeparator] = useState(":");
  useEffect(() => {
    setLeadUser(props.lead);
    const delimiter = /[:\-]/;
    setMacAddressParts(props.lead?.mac_bind?.split(delimiter)?props.lead?.mac_bind?.split(delimiter) :['', '', '', '', '', ''])

  }, [props.lead]);

  useEffect(() => {
    setIsdisabled(true);
    setLeadUser(props.lead);
    const delimiter = /[:\-]/;
    setMacAddressParts(props.lead?.mac_bind?.split(delimiter)?props.lead?.mac_bind?.split(delimiter) :['', '', '', '', '', ''])
  }, [props.rightSidebar]);

  // useEffect(() => {
  //   networkaxios
  //     .get(`network/v2/cpe/display`)
  //     // .then((res) => setData(res.data))
  //     .then((res) => {
  //       // console.log(res);
  //       setLeadUser(res.data);
  //     });
  // }, []);

  const handleChange = (e) => {
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const cpedetails = (id) => {
    setDisable(true)
    if (!isDisabled) {
      setIsdisabled(true);
      const data = pick(leadUser,
        [
          "make",
          "model",
          "specification",
          "notes",
          "street",
          "landmark",
          "city",
          "district",
          "pincode",
          "state",
          "country",
          "customer_name",
          "mobile_no",
          "hardware_name",
          "longitude",
          "latitude",
          "serial_no",
          "mac_bind"
        ])
      data.mac_bind=macAddressParts.join(separator);
      data.house_no = !isEmpty(
        data && data.house_no
      )
        ? data && data.house_no
        : "N/A";
      networkaxios
        .put(`network/cpe/update/${id}`, data)
        .then((res) => {
          setDisable(false)
          console.log(res);
          console.log(res.data);
          props.onUpdate({ ...res.data, parent_dpe: leadUser.parent_dpe });
          toast.success("CPE was edited successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });

          setIsdisabled(true);
          props.Refreshhandler()
        })
        .catch(function (error) {
          setIsdisabled(false);
          setDisable(false);
          let message = "Something went wrong";  
          // Check if there's an error response
          if (error.response) {
              // Handle specific HTTP status codes
              if (error.response.status === 500) {
                  message = "Something went wrong";
              } else if (error.response.data) {
                  setErrors(error.response.data);
                  if (error.response.data.detail) {
                      message = error.response.data.detail;
                  } else {
                      // Extract the first error message if 'detail' doesn't exist
                      const errorDataKeys = Object.keys(error.response.data);
                      if (errorDataKeys.length > 0) {
                          const firstErrorMessage = error.response.data[errorDataKeys[0]];
                          if (Array.isArray(firstErrorMessage)) {
                              message = firstErrorMessage[0];
                          } else {
                              message = firstErrorMessage;
                          }
                      }
                  }
              }
          } 
          // Update the modal message and display the modal
          setModalMessage(message);
          setShowModal(true);
      });
      
        // .catch(function (error) {
        //   setDisable(false)
        //   if (error.response && error.response.data) {
        //     setErrors(error.response.data);
        //   }
        //   toast.error("Something went wrong", {
        //     position: toast.POSITION.TOP_RIGHT,
        //     autoClose: 1000,
        //   });
        //   console.error("Something went wrong!", error);
        // });
    }
  };

  const handleSubmit = (e, id) => {
    // if (e.key === "Enter" || e.key === "NumpadEnter") {
    e.preventDefault();
    //
    const data = pick(leadUser, [
      "make",
      "model",
      "specification",
      "notes",
      "street",
      "landmark",
      "city",
      "district",
      "pincode",
      "state",
      "longitude",
      "latitude",
      "country",
      "customer_name",
      "mobile_no",
      "hardware_name",
      "serial_no",
      "mac_bind"
    ]);
    const validationErrors = validate(data);
    let noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (macAddressParts.some((part) => !part)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mac_bind: "Field is required",
      }));
      noErrors = false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mac_bind: "",
      }));
      noErrors=true;
    }
    if (noErrors) {
      console.log(data);
      cpedetails(id);
    } else {
      console.log("errors try again", validationErrors);
    }

    // const data = pick(leadUser, [
    //   "make",
    //   "model",
    //   "specification",
    //   "notes",
    //   "house_no",
    //   "street",
    //   "landmark",
    //   "city",
    //   "district",
    //   "pincode",
    //   "state",
    //   "country",
    //   "customer_name",
    //   "mobile_no",
    //   "hardware_name"
    // ]);
    //
    // networkaxios.patch(`network/cpe/update/${id}`, data).then((res) => {
    //   console.log(res);
    //   console.log(res.data);
    //   props.onUpdate({...res.data,parent_dpe:leadUser.parent_dpe});
    //   setIsdisabled(true);
    // });
    // }
  };

  // const handleSubmit = (e, id) => {

  //   e.preventDefault();

  //   e = e.target.name;

  //   const validationErrors = validate(leadUser);
  //   const noErrors = Object.keys(validationErrors).length === 0;
  //   setErrors(validationErrors);
  //   if (noErrors) {
  //     deptDetails(id);
  //   } else {
  //     console.log("errors try again", validationErrors);
  //   }
  // };
  const clicked = (e) => {
    e.preventDefault();
    console.log("u clicked");
    setIsdisabled(false);
  };

  const requiredFields = [
    "landmark",
    "street",
    "city",
    "pincode",
    "district",
    "country",
    "state",
    "longitude",
    "latitude",
    // "hardware_name",
    "make",
    "model",
    "specification",
    "notes",
    "serial_no",
  ];
  const { validate, Error } = useFormValidation(requiredFields);
  // useEffect(() => {
  //   axios
  //     .get("https://sparkradius.in:7007/network/extended/options")
  //     .then((res) => {
  //       let { branches } = res.data;
  //       setBranch([...branches]);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);

  // useEffect(() => {
  //   axios
  //     .get("https://sparkradius.in:7007/network/extended/options")
  //     .then((res) => {
  //       console.log(res);
  //       // let { branch_name } = res.data;
  //       setBranch([...res.data]);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);
  // useEffect(() => {
  //   networkaxios
  //     .get("network/extended/options")
  //     .then((res) => {
  //       console.log(res);
  //       // let { branch_name } = res.data;
  //       setBranch([...res.data]);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);

  useEffect(() => {
    if (!props.rightSidebar) {
      setErrors({});
    }
  }, [props.rightSidebar]);

  // useEffect(()=>{
  //   if(props.openCustomizer){
  //     setErrors({});
  //   }
  // }, [props.openCustomizer]);
  const handlePartChange = (event, index) => {
    const { value } = event.target;
    // let inputValue = value.replace(/[^0-9A-Fa-f]/g, '');
    if (/^[0-9A-Fa-f]{0,2}$/.test(value)) {
      // If the input is valid, update the corresponding part in the state
      const newParts = [...macAddressParts];
      newParts[index] = value.toUpperCase(); // Convert to uppercase
      setMacAddressParts(newParts);

      // Move focus to the next input box if needed
      if (value.length === 2 && index < 5) {
        document.getElementById(`part-${index + 1}`).focus();
      } else if (value === "" && index > 0) {
        // If Backspace is pressed and the input is empty, move focus to the previous input box
        document.getElementById(`part-${index - 1}`).focus();
      }
    }
  };
  const handleSeparatorChange = (event) => {
    setSeparator(event.target.value);
  };
  return (
    <Fragment>
      {token.permissions.includes(NETWORK.OPTICALCPEUPDATE) && (

        <EditIcon className="icofont icofont-edit" style={{ top: "7px", right: "64px" }} onClick={clicked}
        // disabled={isDisabled} 
        />
      )}
      <Container fluid={true}>
        {/* <Row>
          <Col sm="5"> */}
        {/* </Col>
          <Col>
            <h6>ID : CPE{props.lead && props.lead.id}</h6>
          </Col>
        </Row> */}
        <br />
        <Form
        // onSubmit={(e) => {
        //   handleSubmit(e, props.lead.id);
        // }}
        >
          <Row style={{ marginTop: "1%" }}>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Customer ID</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="customer_id"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.customer_id}
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>
            {/* <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="customer_name"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.customer_name}
                    onChange={handleChange}
                    disabled={isDisabled}
                  ></input>
                  <Label className="placeholder_styling">Customer Name</Label>

                  <span className="errortext">{errors.customer_name}</span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="mobile_no"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.mobile_no}
                    onChange={handleChange}
                    disabled={isDisabled}
                  ></input>
                  <Label className="placeholder_styling">Mobile No.</Label>

                  <span className="errortext">{errors.mobile_no}</span>
                </div>
              </FormGroup>
            </Col> */}

            {/* <Col md="4">
              <Label>Branch</Label>
              <input
                id="afterfocus"
                type="text"
                name="branch"
                style={{ border: "none", outline: "none" }}
                value={
                  leadUser &&
                  leadUser.parent_dpe &&
                  leadUser.parent_dpe.parent_oltport &&
                  leadUser.parent_dpe.parent_oltport.parent_olt &&
                  leadUser.parent_dpe.parent_oltport.parent_olt.nas &&
                  leadUser.parent_dpe.parent_oltport.parent_olt.nas.branch
                }
                onChange={handleChange}
                disabled={true}
              ></input>
            </Col> */}
            {/* <Col md="4">
              <Label>Nas Name</Label>
              <input
                id="afterfocus"
                type="text"
                name="name"
                style={{ border: "none", outline: "none" }}
                value={
                  leadUser &&
                  leadUser.parent_dpe &&
                  leadUser.parent_dpe.parent_oltport &&
                  leadUser.parent_dpe.parent_oltport.parent_olt &&
                  leadUser.parent_dpe.parent_oltport.parent_olt.nas &&
                  leadUser.parent_dpe.parent_oltport.parent_olt.nas.name
                }
                onChange={handleChange}
                disabled={true}
              ></input>
            </Col>
            <Col md="4">
              <Label>Olt</Label>
              <input
                id="afterfocus"
                type="text"
                name="hardware_name"
                style={{ border: "none", outline: "none" }}
                value={
                  leadUser &&
                  leadUser.parent_dpe &&
                  leadUser.parent_dpe.parent_oltport &&
                  leadUser.parent_dpe.parent_oltport.parent_olt &&
                  leadUser.parent_dpe.parent_oltport.parent_olt.hardware_name
                }
                onChange={handleChange}
                disabled={true}
              ></input>
            </Col> */}

            {/* <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Serial Name</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="serial_no.name"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.serial_no}
                    onChange={handleChange}
                    disabled={isDisabled}
                  ></input>
                </div>
              </FormGroup>
            </Col> */}
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Serial Number</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="serial_no"
                    style={{ border: "none", outline: "none" }}
                    value={
                      leadUser && leadUser.serial_no
                    }
                    onChange={handleChange}
                    disabled={isDisabled}
                  ></input>
               <span className="errortext">{errors.make}</span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Make</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="make"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.make}
                    onChange={handleChange}
                    disabled={isDisabled}
                  ></input>
                  <span className="errortext">{errors.make}</span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Branch</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="branch"
                    style={{ border: "none", outline: "none" }}
                    value={
                      leadUser && leadUser.branch
                    }
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Franchise</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="franchise"
                    style={{ border: "none", outline: "none" }}
                    value={
                      leadUser && leadUser.franchise
                    }
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Zone</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="zone"
                    style={{ border: "none", outline: "none" }}
                    value={
                      leadUser && leadUser.zone
                    }
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Area</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="area"
                    style={{ border: "none", outline: "none" }}
                    value={
                      leadUser && leadUser.area
                    }
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>
            {/* <Col md="4">
              <Label>Serial Category</Label>
              <input
                id="afterfocus"
                type="text"
                name="serial_no.category"
                style={{ border: "none", outline: "none" }}
                value={
                  leadUser &&
                  leadUser.serial_no &&
                  leadUser.serial_no.category

              
               
                }
                onChange={handleChange}
                disabled={isDisabled}
              ></input>

              <span className="errortext">{errors.hardware_name}</span>
            </Col> */}

            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Model</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="model"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.model}
                    onChange={handleChange}
                    disabled={isDisabled}
                  ></input>

                  <span className="errortext">{errors.model}</span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Created At</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="created_at"
                    style={{ border: "none", outline: "none" }}
                    value={moment(leadUser && leadUser.created_at).format("DD MMM YY")}
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>

            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Updated At</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="updated_at"
                    style={{ border: "none", outline: "none" }}
                    value={moment(leadUser && leadUser.updated_at).format("DD MMM YY")}
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">
                    Parent Child DP Port
                  </Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="parent_child_dpport"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.parent_child_dpport}
                    onChange={handleChange}
                    disabled={true}
                  ></input>

                </div>
              </FormGroup>
            </Col>
           <Col md="6">
                <Label className="kyc_label">Mac ID *</Label>
                <FormGroup>
                  <div className="input_wrap">
                    {macAddressParts?.map((part, index) => (
                      <React.Fragment key={index}>
                        <input
                          type="text"
                          id={`part-${index}`}
                          value={part}
                          name="mac_bind"
                          onChange={(event) => handlePartChange(event, index)}
                          maxLength="2"
                          className="macIdInput"
                          disabled={isDisabled}
                        />
                        {index < 5 && <span>{separator}</span>}
                      </React.Fragment>
                    ))}
                    <select
                      style={{ marginLeft: "5px", borderRadius: "0.25rem" }}
                      value={separator}
                      onChange={handleSeparatorChange}
                      disabled={isDisabled}
                    >
                      <option value=":">Colon</option>
                      <option value="-">Dash</option>
                    </select>
                  </div>
                  <span className="errortext">{errors.mac_bind}</span>
                </FormGroup>
              </Col>
            <Col sm="12">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Specification</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="specification"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.specification}
                    onChange={handleChange}
                    // onBlur={blur}
                    disabled={isDisabled}
                  ></input>

                  <span className="errortext">{errors.specification}</span>
                </div>
              </FormGroup>
            </Col>

            <Col sm="12">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Notes</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="notes"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.notes}
                    onChange={handleChange}
                    // onBlur={blur}
                    disabled={isDisabled}
                  ></input>

                  <span className="errortext">{errors.notes}</span>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row style={{ position: "relative", top: "-25px" }}>
            <h6 style={{ paddingLeft: "20px" }}>Address</h6>
          </Row>
          {props.lead && props.lead.id && (
            <AddressComponent
              handleInputChange={handleChange}
              errors={errors}
              setFormData={setLeadUser}
              formData={leadUser}
              setInputs={setInputs}
              resetStatus={resetStatus}
              setResetStatus={setResetStatus}
              isDisabled={isDisabled}
              networkState={props.networkState}
            />
          )}
          <Row style={{ marginTop: "-2%" }}>
            <span className="sidepanel_border" style={{ position: "relative", top: "25px" }}></span>
          </Row>
          <br />
          <button
            type="button"
            name="submit"
            class="btn btn-primary"
            onClick={(e) => handleSubmit(e, props.lead.id)}
            id="save_button"
            disabled={isDisabled}
          >  {disable ? <Spinner size="sm"> </Spinner> : null}
            Save
          </button>
          &nbsp;
          &nbsp;
          &nbsp;
          <button
            type="button"
            name="cancel"
            class="btn btn-secondary"
            onClick={props.dataClose}
            id="resetid"
          >
            Cancel
          </button>
        </Form>
        <ErrorModal
        isOpen={showModal}
        toggle={() => setShowModal(false)}
        message={modalMessage}
        action={() => setShowModal(false)}
      />
      </Container>
    </Fragment>
  );
};

export default Cpedetails;

// import React, { Fragment, useEffect, useState } from "react"; //hooks
// import { useParams, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   CardHeader,
//   CardBody,
//   TabPane,
//   Nav,
//   NavItem,
//   NavLink,
//   TabContent,
//   Form,
//   Label,
//   FormGroup,
//   Input,
// } from "reactstrap";
// import pick from "lodash/pick";
// import get from "lodash/get";
// import axios from "axios";
// // import {Globe} from "feather-icons";
// import useFormValidation from "../../../../customhooks/FormValidation";
// import { networkaxios } from "../../../../../axios";

// const Cpedetails = (props, initialValues) => {
//   const { id } = useParams();
//   const [errors, setErrors] = useState({});
//   const [leadUser, setLeadUser] = useState(props.lead);
//   const [branch, setBranch] = useState([]);
//   const [isDisabled, setIsdisabled] = useState(true);
//   const [inputs, setInputs] = useState(initialValues);

//   useEffect(() => {
//     setLeadUser(props.lead);
//   }, [props.lead]);

//   useEffect(() => {
//     setIsdisabled(true);
//     setLeadUser(props.lead);
//   }, [props.rightSidebar]);

//   useEffect(() => {
//     networkaxios
//       .get(`network/cpe/display`)
//       // .then((res) => setData(res.data))
//       .then((res) => {
//         // console.log(res);
//         setLeadUser(res.data);
//       });
//   }, []);

//   const handleChange = (e) => {
//     setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const cpedetails = (id) => {
//     if (!isDisabled) {
//       const data = pick(leadUser, [
//         "make",
//         "model",
//         "specification",
//         "notes",
//         "house_no",
//         "street",
//         "landmark",
//         "city",
//         "district",
//         "pincode",
//         "state",
//         "country",
//         "customer_name",
//         "mobile_no",
//         "hardware_name",
//       ]);

//       networkaxios
//         .patch(`network/cpe/update/${id}`, data)
//         .then((res) => {
//           console.log(res);
//           console.log(res.data);
//           props.onUpdate({ ...res.data, parent_dpe: leadUser.parent_dpe });
//           toast.success("Cpe was edited successfully", {
//             position: toast.POSITION.TOP_RIGHT,
//           });

//           setIsdisabled(true);
//         })
//         .catch(function (error) {
//           if (error.response && error.response.data) {
//             setErrors(error.response.data);
//           }
//           toast.error("Something went wrong", {
//             position: toast.POSITION.TOP_RIGHT,
//           });
//           console.error("Something went wrong!", error);
//         });
//     }
//   };

//   const handleSubmit = (e, id) => {
//     // if (e.key === "Enter" || e.key === "NumpadEnter") {
//     e.preventDefault();
//     //
//     const data = pick(leadUser, [
//       "make",
//       "model",
//       "specification",
//       "notes",
//       "house_no",
//       "street",
//       "landmark",
//       "city",
//       "district",
//       "pincode",
//       "state",
//       "country",
//       "customer_name",
//       "mobile_no",
//       "hardware_name",
//     ]);
//     const validationErrors = validate(data);
//     const noErrors = Object.keys(validationErrors).length === 0;
//     setErrors(validationErrors);
//     if (noErrors) {
//       console.log(data);
//       cpedetails(id);
//     } else {
//       console.log("errors try again", validationErrors);
//     }

//     // const data = pick(leadUser, [
//     //   "make",
//     //   "model",
//     //   "specification",
//     //   "notes",
//     //   "house_no",
//     //   "street",
//     //   "landmark",
//     //   "city",
//     //   "district",
//     //   "pincode",
//     //   "state",
//     //   "country",
//     //   "customer_name",
//     //   "mobile_no",
//     //   "hardware_name"
//     // ]);
//     //
//     // networkaxios.patch(`network/cpe/update/${id}`, data).then((res) => {
//     //   console.log(res);
//     //   console.log(res.data);
//     //   props.onUpdate({...res.data,parent_dpe:leadUser.parent_dpe});
//     //   setIsdisabled(true);
//     // });
//     // }
//   };

//   // const handleSubmit = (e, id) => {

//   //   e.preventDefault();

//   //   e = e.target.name;

//   //   const validationErrors = validate(leadUser);
//   //   const noErrors = Object.keys(validationErrors).length === 0;
//   //   setErrors(validationErrors);
//   //   if (noErrors) {
//   //     deptDetails(id);
//   //   } else {
//   //     console.log("errors try again", validationErrors);
//   //   }
//   // };
//   const clicked = (e) => {
//     e.preventDefault();
//     console.log("u clicked");
//     setIsdisabled(false);
//   };

//   const requiredFields = [
//     "house_no",
//     "landmark",
//     "street",
//     "city",
//     "pincode",
//     "district",
//     "country",
//     "state",
//     "customer_name",
//     "hardware_name",
//     "make",
//     "model",
//     "specification",
//     "notes",
//   ];
//   const { validate, Error } = useFormValidation(requiredFields);
//   // useEffect(() => {
//   //   axios
//   //     .get("https://sparkradius.in:7007/network/extended/options")
//   //     .then((res) => {
//   //       let { branches } = res.data;
//   //       setBranch([...branches]);
//   //     })
//   //     .catch((error) => console.log(error));
//   // }, []);

//   // useEffect(() => {
//   //   axios
//   //     .get("https://sparkradius.in:7007/network/extended/options")
//   //     .then((res) => {
//   //       console.log(res);
//   //       // let { branch_name } = res.data;
//   //       setBranch([...res.data]);
//   //     })
//   //     .catch((error) => console.log(error));
//   // }, []);
//   useEffect(() => {
//     networkaxios
//       .get("network/extended/options")
//       .then((res) => {
//         console.log(res);
//         // let { branch_name } = res.data;
//         setBranch([...res.data]);
//       })
//       .catch((error) => console.log(error));
//   }, []);
//   return (
//     <Fragment>
//       <Container fluid={true}>
//         <Row>
//           <Col sm="5">
//             <i
//               className="icofont icofont-edit"
//               // disabled={isDisabled}
//               onClick={clicked}
//               style={{
//                 fontSize: "27px",
//                 cursor: "pointer",
//               }}
//             ></i>
//           </Col>
//           <Col>
//             <h6>ID : CPE{props.lead && props.lead.id}</h6>
//           </Col>
//         </Row>
//         <br />
//         <Form
//           onSubmit={(e) => {
//             handleSubmit(e, props.lead.id);
//           }}
//         >
//           <Row>
//             <Col md="4">
//               <Label>Customer Id</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="customer_id"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.customer_id}
//                 onChange={handleChange}
//                 disabled={true}
//               ></input>
//             </Col>
//             <Col md="4">
//               <Label>Customer Name</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="customer_name"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.customer_name}
//                 onChange={handleChange}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.customer_name}</span>
//             </Col>
//             <Col md="4">
//               <Label>Mobile No.</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="mobile_no"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.mobile_no}
//                 onChange={handleChange}
//                 disabled={isDisabled}
//               ></input>
//             </Col>
//           </Row>
//           <Row>
//             {/* <Col md="4">
//               <Label>Branch</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="branch"
//                 style={{ border: "none", outline: "none" }}
//                 value={
//                   leadUser &&
//                   leadUser.parent_dpe &&
//                   leadUser.parent_dpe.parent_oltport &&
//                   leadUser.parent_dpe.parent_oltport.parent_olt &&
//                   leadUser.parent_dpe.parent_oltport.parent_olt.nas &&
//                   leadUser.parent_dpe.parent_oltport.parent_olt.nas.branch
//                 }
//                 onChange={handleChange}
//                 disabled={true}
//               ></input>
//             </Col> */}
//             {/* <Col md="4">
//               <Label>Nas Name</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="name"
//                 style={{ border: "none", outline: "none" }}
//                 value={
//                   leadUser &&
//                   leadUser.parent_dpe &&
//                   leadUser.parent_dpe.parent_oltport &&
//                   leadUser.parent_dpe.parent_oltport.parent_olt &&
//                   leadUser.parent_dpe.parent_oltport.parent_olt.nas &&
//                   leadUser.parent_dpe.parent_oltport.parent_olt.nas.name
//                 }
//                 onChange={handleChange}
//                 disabled={true}
//               ></input>
//             </Col>
//             <Col md="4">
//               <Label>Olt</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="hardware_name"
//                 style={{ border: "none", outline: "none" }}
//                 value={
//                   leadUser &&
//                   leadUser.parent_dpe &&
//                   leadUser.parent_dpe.parent_oltport &&
//                   leadUser.parent_dpe.parent_oltport.parent_olt &&
//                   leadUser.parent_dpe.parent_oltport.parent_olt.hardware_name
//                 }
//                 onChange={handleChange}
//                 disabled={true}
//               ></input>
//             </Col> */}
//           </Row>
//           <Row>
//             <Col md="4">
//               <Label>Serial name</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="serial_no.name"
//                 style={{ border: "none", outline: "none" }}
//                 value={
//                   leadUser &&
//                   leadUser.serial_no &&
//                   leadUser.serial_no.name

//                   // leadUser.parent_dpe.parent_oltport &&
//                   // leadUser.parent_dpe.parent_oltport.port_name
//                 }
//                 onChange={handleChange}
//                 disabled={true}
//               ></input>
//             </Col>
//             <Col md="4">
//               <Label>Serial Id</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="serial_no.id"
//                 style={{ border: "none", outline: "none" }}
//                 value={
//                   leadUser &&
//                   leadUser.serial_no &&
//                   leadUser.serial_no.id

//                 }
//                 onChange={handleChange}
//                 disabled={true}
//               ></input>
//             </Col>
//             <Col md="4">
//               <Label>Make</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="make"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.make}
//                 onChange={handleChange}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.make}</span>
//             </Col>
//             {/* <Col md="4">
//               <Label>Serial Category</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="serial_no.category"
//                 style={{ border: "none", outline: "none" }}
//                 value={
//                   leadUser &&
//                   leadUser.serial_no &&
//                   leadUser.serial_no.category

//                 }
//                 onChange={handleChange}
//                 disabled={isDisabled}
//               ></input>

//               <span className="errortext">{errors.hardware_name}</span>
//             </Col> */}
//           </Row>
//           <Row>

//             <Col md="4">
//               <Label>Model</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="model"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.model}
//                 onChange={handleChange}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.model}</span>
//             </Col>
//             <Col md="4">
//               <Label>Created At</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="created_at"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.created_at}
//                 onChange={handleChange}
//                 disabled={true}
//               ></input>
//             </Col>
//           </Row>
//           <Row>
//             <Col md="4">
//               <Label>Updated At</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="updated_at"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.updated_at}
//                 onChange={handleChange}
//                 disabled={true}
//               ></input>
//             </Col>
//             <Col md="4">
//               <Label>Parent childdpport</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="parent_child_dpport"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.parent_child_dpport}
//                 onChange={handleChange}
//                 disabled={true}
//               ></input>
//             </Col>
//           </Row>
//           <Row>
//             <Col sm="12">
//               <Label>Specification</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="specification"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.specification}
//                 onChange={handleChange}
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.specification}</span>
//             </Col>
//           </Row>
//           <Row>
//             <Col sm="12">
//               <Label>Notes</Label>
//               <input
//                 id="afterfocus"
//                 type="text"
//                 name="notes"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.notes}
//                 onChange={handleChange}
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.notes}</span>
//             </Col>
//           </Row>
//           <Row>
//             <h6 style={{ paddingLeft: "20px" }}>Address</h6>
//           </Row>
//           <Row>
//             <Col md="4">
//               <Label>H.No :</Label>
//               <input
//                 type="text"
//                 name="house_no"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.house_no}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.house_no}</span>
//             </Col>
//             <Col md="4">
//               <Label>Landmark</Label>
//               <input
//                 type="text"
//                 name="landmark"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.landmark}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.landmark}</span>
//             </Col>
//             <Col md="4">
//               <Label>Street</Label>
//               <input
//                 type="text"
//                 name="street"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.street}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.street}</span>
//             </Col>
//           </Row>
//           <Row>
//             <Col md="4">
//               <Label>City</Label>
//               <input
//                 type="text"
//                 name="city"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.city}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.city}</span>
//             </Col>
//             <Col md="4">
//               <Label>Pin Code</Label>
//               <input
//                 type="text"
//                 name="pincode"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.pincode}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.pincode}</span>
//             </Col>
//             <Col md="4">
//               <Label>District</Label>
//               <input
//                 type="text"
//                 name="district"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.district}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.district}</span>
//             </Col>
//           </Row>
//           <Row>
//             <Col md="4">
//               <Label>State</Label>
//               <input
//                 type="text"
//                 name="state"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.state}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.state}</span>
//             </Col>
//             <Col md="4">
//               <Label>Country</Label>
//               <input
//                 type="text"
//                 name="country"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.country}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               <span className="errortext">{errors.country}</span>
//             </Col>
//             <Col md="4">
//               <Label>Latitude</Label>
//               <input
//                 type="text"
//                 name="latitude"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.latitude}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               {/* <span className="errortext">{errors.latitude}</span> */}
//             </Col>
//           </Row>
//           <Row>
//             <Col md="4">
//               <Label>Longitude</Label>
//               <input
//                 type="text"
//                 name="longitude"
//                 style={{ border: "none", outline: "none" }}
//                 value={leadUser && leadUser.longitude}
//                 onChange={handleChange}
//                 id="afterfocus"
//                 // onBlur={blur}
//                 disabled={isDisabled}
//               ></input>
//               {/* <span className="errortext">{errors.longitude}</span> */}
//             </Col>
//           </Row>
//           <br />
//           <button type="submit" name="submit" class="btn btn-primary">
//             Save
//           </button>
//           &nbsp;
//           <button
//             type="submit"
//             name="submit"
//             class="btn btn-danger"
//             onClick={props.dataClose}
//           >
//             Cancel
//           </button>
//         </Form>
//       </Container>
//     </Fragment>
//   );
// };

// export default Cpedetails;
