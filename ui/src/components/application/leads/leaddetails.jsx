import React, { Fragment, useEffect, useState } from "react";
import { Container, Row, Col, Form, Label, Input, FormGroup,Spinner } from "reactstrap";
import moment from "moment";
// import { toast } from "react-toastify";
import { default as axiosBaseURL, adminaxios } from "../../../axios";
import useFormValidation from "../../customhooks/FormValidation";
import {
  assignUser,
  frequency,
  leadStatus as leadStatusJson,
} from "./ConstatantData";
import AddressComponent from "./AddressComponent";
import EditIcon from "@mui/icons-material/Edit";
import { isEmpty } from "lodash";
import { LEAD } from "../../../utils/permissions";
import ErrorModal from "../../common/ErrorModal";

// Sailaja imported common component Sorting on 27th March 2023
import { Sorting } from "../../common/Sorting";

var storageToken = localStorage.getItem("token");
// var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  // var tokenAccess = token?.access;
}

const LeadDetails = (props, initialValues) => {
  const [assignedTo, setAssignedTo] = useState([]);
  const [errors, setErrors] = useState({});
  const [inputs, setInputs] = useState(initialValues);
  const [Qualified, setQualified] = useState();
  const [assign, setAssign] = useState("");
  const [date, setDate] = useState();

  const [sourceby, setSourceby] = useState([]);
  const [typeby, setTypeby] = useState([]);
  const [selectdept, setSelectdept] = useState([]);
  const [leadUser, setLeadUser] = useState(props.lead);
  const [selectZone, setSelectZone] = useState([]);
  const [isDisabled, setIsdisabled] = useState(true);
  const [resetStatus, setResetStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
   //to disable button
   const [disable, setDisable] = useState(false);
  useEffect(() => {
    if (props.lead) {
      setLeadUser(() => {
        return {
          ...props.lead,
        };
      });
      if (props.lead.status == "QL") {
        setAssign(props.lead.assign);
      } else {
        setAssign("");
      }
    }
  }, [props.lead]);

  useEffect(() => {
    setIsdisabled(true);
    setLeadUser(() => {
      return {
        ...props.lead,
      };
    });
    setQualified(props.lead.status);
    setDate(props.lead.status);
    if (props.lead.status == "QL") {
      setAssign(props.lead.assign);
    } else {
      setAssign("");
    }
  }, [props.rightSidebar]);

  const handleChange = (e) => {
    if (e.target.name == "type" || e.target.name == "lead_source") {
      setLeadUser((prev) => ({
        ...prev,
        [e.target.name]: { id: e.target.value },
      }));
    } else {
      setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value.charAt(0).toUpperCase() +  e.target.value.slice(1) }));
    }
  };

  useEffect(() => {
    axiosBaseURL
      .get("/radius/lead/options")
      .then((res) => {
        let { lead_source, type, status } = res.data;
        // setSourceby([...lead_source]);
         // Sailaja sorting the Leads (Edit Panel)->Lead Source Dropdown data as alphabetical order on 27th March 2023
         setSourceby(Sorting(([...lead_source]),"name"));
        // setTypeby([...type]);
        // Sailaja sorting the Leads(Edit Panel) ->Type Dropdown data as alphabetical order on 27th March 2023
        setTypeby(Sorting(([...type]),"name"));
      })
      // .catch((err) =>
      // toast.error("Something went wrong", {
      //   position: toast.POSITION.TOP_RIGHT,
      //   autoClose: 1000,
      // })
      // );
      .catch((err) => {
        // Set the error message
        setModalMessage('Something went wrong');
        // Show the error modal
        setShowModal(true);
      });
      
  }, []);

  const leadDetails = (id) => {
    console.log("leadDetails is used")
    setDisable(true)
    if (!isDisabled) {
      setIsdisabled(true);
      let assign = "";
      let assigned_to = null;
      let department = null;
      if (leadUser.status == "QL") {
        assign = leadUser.assign;
        if (assign == "NOW") {
          const user = assignedTo.find(
            (u) => u.username == leadUser.assigned_to
          );
          assigned_to = user?.id;
          // const dept = selectdept.find((u) => u.name == leadUser.department);
          // department = dept.id;
        }
      }
      let selectedZone = selectZone.find((z) => z.name == leadUser.area);
      console.log(selectedZone,"checkthearea")
      let leaddata = {
        ...leadUser,
        lead_source: { id: leadUser.lead_source.id },
        area: selectedZone?.id,
        assign: assign,
        assigned_to: assigned_to,
        // department: department,
        house_no: !isEmpty(leadUser.house_no) ? leadUser.house_no : "N/A",
      };
      if(leaddata.alternate_mobile_no === ""){
        delete leaddata.alternate_mobile_no;
      }
      delete leaddata.department
console.log("api is hiting")
      axiosBaseURL
        .put("radius/lead/" + id + "/rud", leaddata)
        .then((res) => {
          setDisable(false)
          props.onUpdate(res.data);
          // toast.success("Lead was edited successfully", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          setShowModal(true);
          setModalMessage("Lead was edited successfully");
          setIsdisabled(true);
        })
        // .catch(function (e) {
        //   setDisable(false)
        //   console.log(e, "error1");
        //   toast.error("Something went wrong", {
        //     position: toast.POSITION.TOP_RIGHT,
        //     autoClose: 1000,
        //   });
        // });
        .catch((e) => {
          setIsdisabled(false);
          // Reactivate any disabled elements
          setDisable(false);
          // Log the error to console
          console.log(e, "error1");
          // Set the error message for the modal
          setModalMessage("Something went wrong");
          // Display the modal
          setShowModal(true);
        });
        
    }
  };

  const clicked = (e) => {
    e.preventDefault();
    setIsdisabled(false);
  };

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  const requiredFields = [
    "first_name",
    "mobile_no",
    "house_no",
    "last_name",
    "district",
    "lead_source",
    "type",
    "notes",
    "status",
    "city",
    "landmark",
    "street",
    // "alternate_mobile_no",
    "state",
    "pincode",
    "email",
  ];

  const { validate } = useFormValidation(requiredFields);

  const handleSubmit = (e, id) => {
    e.preventDefault();
    e = e.target.name;

    const validationErrors = validate(leadUser);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    console.log("Validation Errors:", validationErrors); // Here's the console log for errors
    if (noErrors) {
      leadDetails(id);
    } else {
      // toast.error("errors try again", {
      //   position: toast.POSITION.TOP_RIGHT,
      //   autoClose: 1000,
      // });
      // Modified by Marieya
      setModalMessage("Errors occurred. Please try again.");
      // display the modal
      setShowModal(true);
    }
  };

 
  useEffect(() => {
    adminaxios
      .get("accounts/staff")
      .then((res) => {
        // let { users } = res.data;
        setAssignedTo([...res.data]);
      })
      // .catch((err) =>
      //   toast.error("errors try again", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 1000,
      //   })
      // );
      .catch((err) => {
        // Set the error message for the modal
        setModalMessage("Error occurred. Please try again.");
        // Display the modal
        setShowModal(true);
      });
  }, []);

  //zone list
  useEffect(() => {
    adminaxios
      .get("accounts/loggedin/areas")
      .then((res) => {
        let { areas } = res.data;
        // setSelectZone([...areas]);
      // Sailaja sorting the Leads(Edit Panel) ->Area Dropdown data as alphabetical order on 27th March 2023
        setSelectZone(Sorting(([...areas]),'name'));

      })
      // .catch(() =>
      //   toast.error("Something went wrong", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 1000,
      //   })
      // );
      .catch((error) => {
        // set the error message for the modal
        setModalMessage("Something went wrong");
        // display the modal
        setShowModal(true);
      });

    // adminaxios
    //   .get("accounts/department/list")
    //   .then((res) => {
    //     setSelectdept([...res.data]);
    //   })
    //   // .catch(() =>
    //   //   toast.error("Something went wrong", {
    //   //     position: toast.POSITION.TOP_RIGHT,
    //   //     autoClose: 1000,
    //   //   })
    //   // );
    //   .catch((error) => {
    //     // set the error message for the modal
    //     setModalMessage("Something went wrong");
    //     // display the modal
    //     setShowModal(true);
    //   });
  }, []);

  useEffect(() => {
    if (!props.rightSidebar) {
      setErrors({});
    }
  }, [props.rightSidebar]);
  

  useEffect(()=>{
    if(props.openCustomizer){
      setErrors({});
    }
  }, [props.openCustomizer]);
  
  return (
    <Fragment>
      <Container fluid={true}>
        <Row>
          {token.permissions.includes(LEAD.UPDATE) && (
            <EditIcon
              className="icofont icofont-edit"
              style={{ top: "8px", right: "64px" }} id="edit_icon"
              onClick={clicked}
              // disabled={isDisabled}
            />
          )}
        </Row>
        <Form>
          <Row style={{marginTop:"12px"}}>
            <Col md="3">
              <FormGroup >
                <div className="input_wrap">
                <Label className="kyc_label">First Name *</Label>

                  <input
                    // className={`form-control digits not-empty`}
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    id="afterfocus"
                    type="text"
                    name="first_name"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={leadUser && leadUser.first_name}
                    onChange={handleChange}
                    // onBlur={checkEmptyValue}
                    disabled={isDisabled}
                  ></input>
                </div>
                <span className="errortext">{errors.first_name}</span>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup >
                <div className="input_wrap">
                <Label className="kyc_label">Last Name *</Label>

                  <input
                    // className="form-control digits not-empty"
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    id="afterfocus"
                    type="text"
                    name="last_name"
                    style={{
                      border: "none",
                      outline: "none",
                      textTransform: "capitalize",
                    }}
                    value={leadUser && leadUser.last_name}
                    onChange={handleChange}
                    // onBlur={checkEmptyValue}
                    disabled={isDisabled}
                  ></input>
                  {/* <Label className="kyc_label">Last Name *</Label> */}
                </div>
                <span className="errortext">{errors.last_name}</span>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">Mobile Number *</Label>

                  <input
                    // className="form-control digits not-empty"
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    id="afterfocus"
                    disabled={isDisabled}
                    type="text"
                    name="mobile_no"
                    style={{ border: "none" }}
                    value={leadUser && leadUser.mobile_no}
                    onChange={handleChange}
                  ></input>
                </div>
                <span className="errortext">{errors.mobile_no}</span>
              </FormGroup>
            </Col>
            <Col md="3">
            {/* Sailaja gave style={{ whiteSpace: "nowrap" }} Alternate Mobile Number  on 11th July Ref LED-02 */}
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label" style={{ whiteSpace: "nowrap" }}> Alternate Mobile Number </Label>

                  <input
                    // className="form-control digits not-empty"
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    type="text"
                    name="alternate_mobile_no"
                  // Sailaja Added width Style (Line Number 356)on 13th July */}
                    style={{ border: "none", outline: "none", width:"110%" }}
                    value={leadUser && leadUser.alternate_mobile_no}
                    onChange={handleChange}
                    id="afterfocus"
                    disabled={isDisabled}
                  ></input>
                </div>
                {/* <span className="errortext">{errors.alternate_mobile_no}</span> */}
              </FormGroup>
            </Col>

            <Col md="3" id="moveup">
              <div className="input_wrap">
              <Label className="kyc_label"> Email ID * </Label>

                <input
                  // className="form-control digits not-empty"
                  className={`form-control ${
                    leadUser && leadUser.name ? "not-empty" : "not-empty"
                  }`}
                  type="email"
                  name="email"
                  style={{ border: "none", outline: "none" }}
                  value={leadUser && leadUser.email?.toLowerCase()}
                  onChange={handleChange}
                  id="afterfocus"
                  disabled={isDisabled}
                ></input>
              </div>
              <span className="errortext">{errors.email}</span>
            </Col>

            <Col md="3" id="moveup">
              <div className="input_wrap">
              <Label className="kyc_label">Area *</Label>

                <select
                  // className="form-control digits not-empty"
                  className={`form-control ${
                    leadUser && leadUser.name ? "not-empty" : "not-empty"
                  }`}
                  id="afterfocus"
                  type="select"
                  name="area"
                  style={{ border: "none", outline: "none" }}
                  value={leadUser && leadUser.area && leadUser.area}
                  onChange={handleChange}
                  disabled={isDisabled}
                >
                  {selectZone.map((zonelist) => {
                    if (!!zonelist && leadUser && leadUser.area) {
                      return (
                        <option
                          key={zonelist.name}
                          value={zonelist.name}
                          selected={
                            zonelist.name == leadUser.area && leadUser.area
                              ? "selected"
                              : ""
                          }
                        >
                          {zonelist.name}
                        </option>
                      );
                    }
                  })}
                </select>
              </div>
            </Col>
          </Row>
          <br />
          <AddressComponent
            handleInputChange={handleChange}
            errors={errors}
            setFormData={setLeadUser}
            formData={leadUser}
            setInputs={setInputs}
            resetStatus={resetStatus}
            setResetStatus={setResetStatus}
            isDisabled={isDisabled}
          />
          <Row>
            <Col md="3" id="moveup">
              <div className="input_wrap">
              <Label className="kyc_label">Source *</Label>

                <select
                  // className="form-control digits not-empty"
                  className={`form-control ${
                    leadUser && leadUser.name ? "not-empty" : "not-empty"
                  }`}
                  id="afterfocus"
                  type="select"
                  name="lead_source"
                  style={{ border: "none", outline: "none" }}
                  value={
                    leadUser && leadUser.lead_source && leadUser.lead_source.id
                  }
                  onChange={handleChange}
                  disabled={isDisabled}
                >
                  {sourceby.map((leadsource) => {
                    if (!!leadsource && leadUser && leadUser.lead_source) {
                      return (
                        <option
                          key={leadsource.id}
                          value={leadsource.id}
                          selected={
                            leadsource.id == leadUser.lead_source.id
                              ? "selected"
                              : ""
                          }
                        >
                          {leadsource.name}
                        </option>
                      );
                    }
                  })}
                </select>
              </div>
            </Col>
            <Col md="3" id="moveup">
              <div className="input_wrap">
              <Label className="kyc_label">Type *</Label>

                <select
                  // className="form-control digits not-empty"
                  className={`form-control ${
                    leadUser && leadUser.name ? "not-empty" : "not-empty"
                  }`}
                  id="afterfocus"
                  type="select"
                  name="type"
                  style={{ border: "none", outline: "none" }}
                  value={leadUser && leadUser.type && leadUser.type.id}
                  onChange={handleChange}
                  disabled={isDisabled}
                >
                  {typeby.map((leadtype) => {
                    if (!!leadtype && leadUser && leadUser.type) {
                      return (
                        <option
                          key={leadtype.id}
                          value={leadtype.id}
                          selected={
                            leadtype.id == leadUser.type.id ? "selected" : ""
                          }
                        >
                          {leadtype.name}
                        </option>
                      );
                    }
                  })}
                </select>
              </div>
            </Col>
            <Col md="3" id="moveup">
              <div className="input_wrap">
              <Label className="kyc_label">Status *</Label>

                <select
                  // className="form-control digits not-empty"
                  className={`form-control ${
                    leadUser && leadUser.name ? "not-empty" : "not-empty"
                  }`}
                  id="afterfocus"
                  type="select"
                  name="status"
                  style={{ border: "none", outline: "none" }}
                  value={leadUser && leadUser.status}
                  onChange={(event) => {
                    setQualified(event.target.value);
                    handleChange(event);
                    setDate(event.target.value);
                    setAssign("");
                  }}
                  disabled={isDisabled}
                >
                  {leadStatusJson.map((leadstatuses) => {
                    if (!!leadstatuses && leadUser && leadUser.status) {
                      return (
                        <option
                          key={leadstatuses.id}
                          value={leadstatuses.id}
                          selected={
                            leadstatuses.id == leadUser.status.id
                              ? "selected"
                              : ""
                          }
                        >
                          {leadstatuses.name}
                        </option>
                      );
                    }
                  })}
                </select>
              </div>
            </Col>
          </Row>
          <br />
          <Row></Row>
          <br />
          <Row>
            <Col sm="3" hidden={Qualified != "QL"} id="moveup">
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">Assign Status</Label>

                  <Input
                    // className="form-control digits not-empty afterfocus"
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    type="select"
                    style={{ border: "none", outline: "none" }}
                    name="assign"
                    id="afterfocus"
                    disabled={isDisabled}
                    value={assign}
                    onChange={(event) => {
                      handleChange(event);
                      setAssign(event.target.value);
                    }}
                    onBlur={checkEmptyValue}
                  >
                    <option value="" style={{ display: "none" }}></option>

                    {assignUser.map((assigningUser) => {
                      return (
                        <option
                          key={assigningUser.id}
                          value={assigningUser.id}
                          selected={
                            assigningUser.id == leadUser.assign
                              ? "selected"
                              : ""
                          }
                        >
                          {assigningUser.name}
                        </option>
                      );
                    })}
                  </Input>
                </div>
              </FormGroup>
            </Col>

            {/* <Col sm="3" hidden={assign != "NOW"} id="moveup">
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">
                    Select Department
                  </Label>
                  <Input
                    // className="form-control digits not-empty"
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    type="select"
                    onChange={handleChange}
                    onBlur={checkEmptyValue}
                    name="department"
                    disabled={isDisabled}
                    value={leadUser && leadUser.department}
                  >
                    <option style={{ display: "none" }}></option>

                    {selectdept.map((selectdept) => {
                      if (selectdept && leadUser) {
                        return (
                          <option
                            key={selectdept.name}
                            value={selectdept.name}
                            selected={
                              leadUser.department &&
                              selectdept.name == leadUser.department
                                ? "selected"
                                : ""
                            }
                          >
                            {selectdept.name}
                          </option>
                        );
                      }
                    })}
                  </Input>
             
                </div>
              </FormGroup>
            </Col> */}

            <Col sm="3" hidden={assign != "NOW"} id="moveup">
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">Assigned To</Label>

                  <Input
                    type="select"
                    name="assigned_to"
                    // className="form-control digits not-empty"
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    onChange={handleChange}
                    disabled={isDisabled}
                    value={leadUser && leadUser.assigned_to}
                    // onBlur={checkEmptyValue}
                  >
                    <option style={{ display: "none" }}></option>

                    {assignedTo.map((assignedto) => {
                      return (
                        <option
                          key={assignedto.username}
                          value={assignedto.username}
                          selected={
                            leadUser.assigned_to &&
                            assignedto.username == leadUser.assigned_to
                              ? "selected"
                              : ""
                          }
                        >
                          {assignedto.username}
                        </option>
                      );
                    })}
                  </Input>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm="3" hidden={date != "QL"} id="moveup">
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">Follow Up</Label>

                  <Input
                    // className="form-control digits not-empty afterfocus"
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    style={{ border: "none", outline: "none" }}
                    type="datetime-local"
                    // id="meeting-time"
                    id="afterfocus"
                    name="follow_up"
                    value={
                      leadUser &&
                      moment.utc(leadUser.follow_up).format("YYYY-MM-DDThh:mm")
                    }
                    onChange={handleChange}
                    // onBlur={checkEmptyValue}
                    maxLength="15"
                    disabled={isDisabled}
                  />
                </div>
              </FormGroup>
            </Col>

            <Col sm="3" hidden={date != "QL"} id="moveup">
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">Frequency</Label>

                  <Input
                    type="select"
                    name="frequency"
                    id="afterfocus"
                    // className="form-control digits not-empty afterfocus"
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    onChange={handleChange}
                    onBlur={checkEmptyValue}
                    disabled={isDisabled}
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.frequency}
                  >
                    <option value="" style={{ display: "none" }}></option>

                    {frequency.map((freq) => {
                      return (
                        <option
                          key={freq.id}
                          value={freq.id}
                          selected={
                            freq.id == leadUser.frequency ? "selected" : ""
                          }
                        >
                          {freq.name}
                        </option>
                      );
                    })}
                  </Input>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm="3" hidden={date != "OPEN"} id="moveup">
              <FormGroup>
                <div className="input_wrap">
                <Label for="meeting-times" className="kyc_label ">
                    Follow Up
                  </Label>
                  
                  <Input
                    // className="form-control digits not-empty afterfocus"
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    type="datetime-local"
                    id="meeting-times"
                    name="follow_up"
                    // style={{ border: "none", outline: "none" }}
                    //Above Style commented off by Sailaja on 11th July Ref LED-10
                    onChange={handleChange}
                    // onBlur={checkEmptyValue}
                    maxLength="15"
                    value={
                      leadUser &&
                      moment.utc(leadUser.follow_up).format("YYYY-MM-DDThh:mm")
                    }
                    disabled={isDisabled}
                  />
                 
                </div>
              </FormGroup>
            </Col>

            <Col sm="3" hidden={date != "OPEN"} id="moveup">
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">Frequency</Label>
                    
                  <Input
                    type="select"
                    name="frequency"
                    // className="form-control digits not-empty afterfocus"
                    className={`form-control ${
                      leadUser && leadUser.name ? "not-empty" : "not-empty"
                    }`}
                    onChange={handleChange}
                    // onBlur={checkEmptyValue}
                    disabled={isDisabled}
                    value={leadUser && leadUser.frequency}
                    // style={{ border: "none", outline: "none" }} 
                    //Above Style commented off by Sailaja on 11th July Ref LED-10
                  >
                    <option value="" style={{ display: "none" }}></option>

                    {frequency.map((freq) => {
                      return (
                        <option
                          key={freq.id}
                          value={freq.id}
                          selected={
                            freq.id == leadUser.frequency ? "selected" : ""
                          }
                        >
                          {freq.name}
                        </option>
                      );
                    })}
                  </Input>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <br />
          <Row style={{marginTop:"3%"}}>
            <Col md="6" id="notes_moveup">
              <Label className="pass_notes">Notes *</Label>
              <Input
                type="textarea"
                name="notes"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.notes}
                onChange={handleChange}
                id="afterfocus"
                disabled={isDisabled}
              ></Input>
              <span className="errortext">{errors.notes}</span>
            </Col>
            {/* <span className="sidepanel_border" style={{position:"relative", top:"42px"}}></span> */}
          </Row>
          <br />
          <div style={{marginTop:"-77px"}}>
          <Row>
          <span className="sidepanel_border" style={{position:"relative", top:"23px"}}></span>

          </Row>
          <br />
          <button
            type="button"
            name="submit"
            className="btn btn-primary"
            id="save_button"
            onClick={(e) => {
              handleSubmit(e, props.lead.id);
            }}
            disabled={isDisabled}
          >
             {disable ? <Spinner size="sm"> </Spinner> : null}
            Save
          </button>
          &nbsp;
          &nbsp;
          <button
            type="button"
            name="submit"
            className="btn btn-secondary"
            id="resetid"
            onClick={props.dataClose}
          >
            Cancel
          </button>
          </div>
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

export default LeadDetails;
