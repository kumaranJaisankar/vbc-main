import React, { Fragment, useState, useRef, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Spinner
} from "reactstrap";
import moment from "moment";
import ExistingCustomer from "./Exiting-customer";
import { Typeahead } from "react-bootstrap-typeahead";
import { UserPlus } from "react-feather";
import { helpdeskaxios, adminaxios } from "../../../axios";
import { toast } from "react-toastify";
import { pick } from "lodash";
import { withRouter } from "react-router-dom";
import OpenForComponent from "./openFor";
import useFormValidation from "../../customhooks/FormValidation";
import { HELP_DESK } from "../../../utils/permissions";
// Sailaja imported common component Sorting on 10th April 2023
import { Sorting } from "../../common/Sorting";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
const AddTicket = (props, initialValues) => {
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const Verticalcentermodaltoggle = () => setVerticalcenter(!Verticalcenter);
  const [isReset, setIsReset] = useState(false);
  const [assignedTo, setAssignedTo] = useState([]);
  const [assignToFilter, setAssignToFilter] = useState([]);
  const [ticketCategory, setTicketCategory] = useState([]);
  const [prioritySla, setPrioritySla] = useState([]);
  const [ticketSubcategory, setTicketSubcategory] = useState([]);
  const [ticketStatus, setTicketStatus] = useState([]);
  const [assigntoselected, setAssigntoselected] = useState([]);
  const [showprovisionfields, setShowprovisionfields] = useState();
  const [formData, setFormData] = useState({
    status: "OPN",
    priority_sla: "1",
    notes: ''
  });
  const [name, setName] = useState("");
  const authenticated = JSON.parse(localStorage.getItem("authenticated"));
  const auth0_profile = JSON.parse(localStorage.getItem("auth0_profile"));

  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [selectedWatchlist, setselectedWatchlist] = useState([]);
  //taking state for open data
  // const [dateRange, setDateRange] = useState(moment().format("l LT"));
 
  const [dateRange, setDateRange] = useState(moment().format("l LT"));
  // ("YYYY-MM-DDThh:mm"));
  
  const [userTypeText, setUserTypeText] = useState([]);
  const [loaderSpinneer, setLoaderSpinner] = useState(false)
  const [exitcustomer, setExitcustomer] = useState(false)
  const exitingCustomer = () => setExitcustomer(!exitcustomer)
  const [errormessage, setErrormessage] = useState()
  const ref = useRef();
  // draft
  useEffect(() => {
    if (props.lead) {
      setFormData((prevState) => {
        return {
          ...prevState,
          ...props.lead,
          open_for: props.openforcustomer
        };
      });
    }
  }, [props.lead, props.openforcustomer]);
  //end

  const handleInputChange = (event) => {
    setIsReset(false);
    if (event.target.name == 'assigned_to') {
      setAssigntoselected(event.target.value);
      setFormData((prev) => {
        if (!prev.assigned_to) {
          return ({ ...prev, [event.target.name]: event.target.value, status: 'ASN' });
        }
        else {
          return ({ ...prev, [event.target.name]: event.target.value });
        }
      });
    } else {

      setFormData((preState) => ({
        ...preState
      }));
    }


    event.persist();
    // draft
    // props.setIsDirtyFun(true);
    //end
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;

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
      //draft
      // props.setformDataForSaveInDraft((preState) => ({
      //   ...preState,
      //   [name]: value,
      // }));
    }
    let val = event.target.value;

    if (name == "ticket_category") {
      getsubCategory(val)
    }
  };


  // auto populate
  useEffect(() => {
    adminaxios
      .get("accounts/user/" + assigntoselected + "/details/ticket/populate")
      .then((res) => {
        let department = [];
        if (res.data.department) {
          res.data.department.forEach((dept) => {
            // department = department + dept.name + ",";
            department.push(dept.name)
          });
        }
        let branch = "";
        if (res.data.branch) {
          branch = res.data.branch.name;
        }
        setFormData({ ...formData, department: department.join(","), branch: branch });
      });
  }, [assigntoselected]);

  //options api's

  useEffect(() => {
    helpdeskaxios
      .get(`create/options/ticket`)
      .then((res) => {
        let { category, priority_sla, status } =
          res.data;
        // setTicketCategory([...category]);
        // Sailaja sorting the Complaints Module -> New Panel-> Category * Dropdown data as alphabetical order on 10th April 2023
        setTicketCategory(Sorting(([...category]),"category"));

        setPrioritySla([...priority_sla]);
        // setTicketSubcategory([...subcategory]);
        setTicketStatus([...status]);
      })
      .catch((err) =>
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000
        }));

  }, []);

  const getsubCategory = (val) => {
    helpdeskaxios.get(`sub/ticketcategory/${val}`)
      .then((res) => 
      // setTicketSubcategory(res.data))
       // Sailaja sorting the Complaints -> New Panel-> Sub Category * Dropdown data as alphabetical order on 10th April 2023
        setTicketSubcategory(Sorting(((res.data)),"name"))
      )}

  const addDetails = () => {
    formData.watchlists = selectedWatchlist.map((user) => {
      return { user: user.id };
    });
    setLoaderSpinner(true);
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let work_note_bkp = formData.work_notes;
    formData.work_notes = [];
    // formData.status="OPN";

    formData.opened_by = authenticated ? auth0_profile.id : 1;
    formData.open_for = props.openforcustomer ? props.openforcustomer : formData.open_for;
    console.log(formData, "helpdeskdata")
    delete formData.department
    helpdeskaxios
      .post("enh/create", formData, config)
      .then((response) => {
        setLoaderSpinner(false);
        props.onUpdate(response.data);
        toast.success("Ticket was added successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000
        });
        if (props.fetchComplaints)
          props.fetchComplaints()
        resetformmanually();
      })
      .catch(function (error) {
        console.log(error, "helpdesk")
        setErrormessage(error.response.data)
        setLoaderSpinner(false);
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is400Error = errorString.includes("400");
        if (error.response && error.response.data?.non_field_errors[0]) {
          setExitcustomer(true)
          toast.error(error.response && error.response.data?.non_field_errors[0], {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        } else if (is500Error) {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        } else if (is400Error) {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        } else {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        }
      });
  };

  const submit = (e, id) => {
    e.preventDefault();
    e = e.target.name;
let dataNew =  {...formData}
dataNew.worknotes = formData.notes
    const validationErrors = validate(dataNew);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      addDetails(id);
    }
    //  else {
    //   toast.error("Something went wrong", {
    //     position: toast.POSITION.TOP_RIGHT,
    //     autoClose: 1000
    //   });
    // }
  };

  const requiredFields = [
    "customer_notes",
    "worknotes",
    // "assigned_date",
    "ticket_category",
    "sub_category",
    "priority_sla",
    // "status",
    // "assigned_to",
    "open_for"
  ];

  const { validate } = useFormValidation(requiredFields);

  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
    }
    // setFormData(props.lead);
  }, [props.rightSidebar]);

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  const resetInputField = () => { };
  const resetForm = function () {
    setIsReset(true);
    setselectedWatchlist([]);
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

  useEffect(() => {
    setName(localStorage.getItem("Name"));
  }, []);



  useEffect(() => {
    // props.setformDataForSaveInDraft(formData);
    if (formData && formData.ticket_category) {
      setShowprovisionfields(formData.ticket_category)
    }
  }, [formData])

  const resetformmanually = () => {
    setFormData({
      customer_notes: "",
      // assigned_date: "",
      open_for: props.openforcustomer ? props.openforcustomer : formData.open_for,
      watchlists: "",
      notes: "",
      status: "OPN",
      ticket_category: "",
      priority_sla: "1",
      sub_category: "",
      work_notes: "",
      opened_by: "",
      open_date: "",
    });
    //calling reset after draft
    // props.setformDataForSaveInDraft({
    //   customer_notes: "",
    //   assigned_date: "",
    //   open_for: "",
    //   watchlists: "",
    //   notes: "",
    //   status: "",
    //   ticket_category: "",
    //   priority_sla: "",
    //   sub_category: "",
    //   work_notes: "",
    //   opened_by: "",
    //   open_date: "",
    // });
    localStorage.removeItem("ticket/");
    localStorage.removeItem("ticketDraftSaveKey");
    // props.setLead({});
    //Sailaja modified clear_form_data on 26th July
    document.getElementById("resetid").click();
    document.getElementById("myForm").reset();


    setShowprovisionfields('')
  };
  //end

  // assign to list

  // const franchId =
  //   JSON.parse(localStorage.getItem("token"))?.franchise?.id ? JSON.parse(localStorage.getItem("token"))?.franchise?.id : 0;
  // const branchId = JSON.parse(localStorage.getItem("token"))?.branch?.id ? JSON.parse(localStorage.getItem("token"))?.branch?.id : 0;
  useEffect(() => {
    // customeraxios.get(`customers/display/users`).then((res) => {
    //   let { assigned_to } = res.data;

    //   setAssignedTo([...assigned_to]);
    // });
    adminaxios.get(`accounts/staff`).then((res) => {
      //  setAssignedTo(res.data)
// Sailaja sorting the Complaints -> New Panel-> Assign To * Dropdown data as alphabetical order on 10th April 2023
      setAssignedTo(Sorting((res.data),"username"))

    })
  }, []);
  // end

  useEffect(() => {
    const obj = pick(formData, "open_for", "assigned_to");
    const userTypeTextNew = Object.values(obj).length > 0 ? Object.values(obj).filter(o => o != undefined) : [];
    setUserTypeText(userTypeTextNew)
  }, [formData])

  const toggle = () => {
    setVerticalcenter(!Verticalcenter);
    setselectedWatchlist([])
  };
  return (
    <Fragment>
      <Container fluid={true}>
        <Row className="form_layout">
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form} >
              <Row>
                {props.openforcustomer ?
                  <>
                    <Col sm="3" >
                      <FormGroup>

                        <div className="input_wrap">
                          <Label className="kyc_label">Customer ID</Label>
                          <Input
                            className="form-control not-empty"
                            type="text"
                            name="open_for"
                            onChange={handleInputChange}
                            onBlur={checkEmptyValue}
                            maxLength="15"
                            disabled={true}
                            value={props?.openforcustomer}
                          />
                        </div>
                      </FormGroup>
                    </Col>
                    <p className="cust_input_mt10"></p>
                  </>
                  :

                  <Col sm="3" style={{ position: "relative", marginTop: "8px" }}>
                    <OpenForComponent
                      setFormData={setFormData}
                      handleInputChange={handleInputChange}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      formData={formData}
                      errors={errors}
                    />

                  </Col>
                }
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label for="meeting-time" className="kyc_label">
                        Open Date
                      </Label>
                      <Input
                        className="form-control not-empty"
                        type="datetime"
                        id="meeting-time"
                        value={dateRange}
                        // value={dateRange.format("YYYY-MM-DDThh:mm")}
                        name="open_date"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        maxLength="15"
                        disabled={true}
                      />

                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "14%",
                        left: "73%",
                      }}
                    ></div>
                  </FormGroup>
                </Col>
                <span></span>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Open by</Label>
                      <Input
                        className="form-control not-empty"
                        type="text"
                        name="opened_by"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        maxLength="15"
                        disabled={true}
                        value={authenticated ? auth0_profile.name : name}
                      />
                      {/* <option>{authenticated ? auth0_profile.name : name}</option> */}


                    </div>
                  </FormGroup>
                </Col>
                {/* <Col sm="3">
                <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">
                        {" "}
                        Assigned Date *
                      </Label>
                      <Input
                        type="datetime-local"
                        id="meeting-time"
                        name="assigned_date"
                        onChange={handleInputChange}
                        min={dateRange}
                        maxLength="15"
                        className={`form-control digits not-empty ${formData && formData.assigned_date ? "not-empty" : ""
                          }`}
                        value={formData && formData.assigned_date}
                      />
                     
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "14%",
                        left: "73%",
                      }}
                    ></div>
                    <span className="errortext">
                      {errors.assigned_date && "Select Assigned Date"}
                    </span>
                  </FormGroup>
 
                </Col> */}
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Category *</Label>
                      <Input
                        type="select"
                        name="ticket_category"
                        onChange={(event) => {
                          handleInputChange(event)
                          // setShowprovisionfields(event.target.value)
                        }}
                        onBlur={checkEmptyValue}
                        className={`form-control digits ${formData && formData.ticket_category
                          ? "not-empty"
                          : ""
                          }`}
                        value={formData && formData.ticket_category}
                      >
                        <option style={{ display: "none" }}></option>

                        {ticketCategory.map((categories) => (
                          <option key={categories.id} value={categories.id}>
                            {categories.category}
                          </option>
                        ))}
                      </Input>

                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "14%",
                        left: "73%",
                      }}
                    ></div>
                    <span className="errortext">
                      {" "}
                      {errors.ticket_category && "Selection is required"}
                    </span>
                  </FormGroup>
                </Col>
              </Row>
              <Row >
                <Col sm="3" style={{ position: "relative", top: "-20px" }}>
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">
                        Sub Category *
                      </Label>
                      <Input
                        type="select"
                        name="sub_category"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        className={`form-control digits ${formData && formData.sub_category ? "not-empty" : ""
                          }`}
                        value={formData && formData.sub_category}
                      >
                        <option style={{ display: "none" }}></option>
                        {ticketSubcategory.map((subcategories) => (
                          <option
                            key={subcategories.id}
                            value={subcategories.id}
                          >
                            {subcategories.name}
                          </option>
                        ))}
                      </Input>

                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "14%",
                        left: "73%",
                      }}
                    ></div>
                    <span className="errortext">
                      {" "}
                      {errors.sub_category && "Selection is required"}
                    </span>
                  </FormGroup>
                </Col>
                {token.permissions.includes(HELP_DESK.HELPDESK_TICKET_ASSIGN) ?
                  <Col sm="3" id="moveup">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">
                          {" "}
                          Assign To *
                        </Label>
                        <Input
                          type="select"
                          name="assigned_to"
                          onChange={handleInputChange}
                          onBlur={checkEmptyValue}
                          className={`form-control digits ${formData && formData.assigned_to ? "not-empty" : ""
                            }`}
                          value={formData && formData.assigned_to}
                        >
                          <option style={{ display: "none" }}></option>
                          {assignedTo.map((assignedto) => (
                            <option key={assignedto.id} value={assignedto.id}>
                              {assignedto.username}
                            </option>
                          ))}
                        </Input>
                      </div>
                      {/* <span className="errortext">
                      {errors.assigned_to && "Selection is required"}
                    </span> */}
                    </FormGroup>
                  </Col> : <Col sm="3" id="moveup">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">
                          {" "}
                          Assign To *
                        </Label>
                        <Input
                          type="select"
                          name="assigned_to"
                          onChange={handleInputChange}
                          onBlur={checkEmptyValue}
                          className={`form-control digits ${formData && formData.assigned_to ? "not-empty" : ""
                            }`}
                          value={formData && formData.assigned_to}
                          disabled={true}
                        >
                          <option style={{ display: "none" }}></option>
                          {assignedTo.map((assignedto) => (
                            <option key={assignedto.id} value={assignedto.id}>
                              {assignedto.username}
                            </option>
                          ))}
                        </Input>
                      </div>
                    </FormGroup>
                  </Col>}
                {/* <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Department</Label>
                      <Input
                        type="text"
                        name="department"
                        className="form-control digits not-empty"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        value={formData.department}
                        readOnly={true}
                      ></Input>
                    </div>
                  </FormGroup>
                </Col> */}
                <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Branch</Label>
                      <Input
                        type="text"
                        name="branche"
                        className="form-control digits not-empty"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        value={formData.branch}
                        readOnly={true}
                      ></Input>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>

                <Col sm="3" style={{ position: "relative", marginTop: "-35px" }}>
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label"> Priority *</Label>
                      <Input
                        type="select"
                        name="priority_sla"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        className={`form-control digits ${formData && formData.priority_sla ? "not-empty" : ""
                          }`}
                        value={formData && formData.priority_sla}
                      >
                        <option style={{ display: "none" }}></option>
                        {prioritySla.map((prioritysla, index) => (
                          <option key={index[1]} value={prioritysla.id}>
                            {prioritysla.name}
                          </option>
                        ))}
                      </Input>

                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "14%",
                        left: "73%",
                      }}
                    ></div>
                    <span className="errortext">
                      {errors.priority_sla && "Select Priority"}
                    </span>
                  </FormGroup>
                </Col>
                {JSON.parse(localStorage.getItem("token")).user_type ===
                  "Help Desk" &&
                // JSON.parse(localStorage.getItem("token")).roles[0] === 26 ? (
                // JSON.parse(localStorage.getItem("token")).roles[0] === 6 ? (
                JSON.parse(localStorage.getItem("token")).roles[0] === 28 ? (
                  <Col
                    sm="3"
                    style={{ position: "relative", marginTop: "-35px" }}
                  >
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label"> Status *</Label>
                        <Input
                          type="select"
                          name="status"
                          onChange={handleInputChange}
                          onBlur={checkEmptyValue}
                          className={`form-control digits ${
                            formData && formData.status ? "not-empty" : ""
                          }`}
                          value={formData && formData.status}
                        >
                          <option value={"OPN"}>Open</option>
                          <option value="CLD" key={"CLD"}>Closed</option>
                        </Input>
                      </div>
                      <span className="errortext">
                        {errors.status && "Select Status"}
                      </span>
                    </FormGroup>
                  </Col>
                ) : JSON.parse(localStorage.getItem("token")).user_type ===
                    "Help Desk" &&
                  // JSON.parse(localStorage.getItem("token")).roles[0] === 6 ? (
                  // JSON.parse(localStorage.getItem("token")).roles[0] === 30 ? (
                  JSON.parse(localStorage.getItem("token")).roles[0] === 30 ? (
                  <Col
                    sm="3"
                    style={{ position: "relative", marginTop: "-35px" }}
                  >
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label"> Status *</Label>
                        <Input
                          type="select"
                          name="status"
                          onChange={handleInputChange}
                          onBlur={checkEmptyValue}
                          className={`form-control digits ${
                            formData && formData.status ? "not-empty" : ""
                          }`}
                          value={formData && formData.status}
                        >
                          <option value="ASN" key={"ASN"}>
                            Assigned
                          </option>
                        </Input>
                      </div>
                      <span className="errortext">
                        {errors.status && "Select Status"}
                      </span>
                    </FormGroup>
                  </Col>
                ) : JSON.parse(localStorage.getItem("token")).user_type === "Help Desk" ? (
                  <Col sm="3" style={{ position: "relative", marginTop: "-35px" }}>
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label"> Status *</Label>
                        <Input
                          type="select"
                          name="status"
                          onChange={handleInputChange}
                          onBlur={checkEmptyValue}
                          className={`form-control digits ${formData && formData.status ? "not-empty" : ""
                            }`}
                          value={formData && formData.status}
                        >
                          <option value={"OPN"}>Open</option>
                          <option value="ASN" key={"ASN"}>Assigned</option>
                          <option value="CLD" key={"CLD"}>Closed</option>

                        </Input>
                      </div>
                      <span className="errortext">
                        {errors.status && "Select Status"}
                      </span>
                    </FormGroup>
                  </Col>
                ) : JSON.parse(localStorage.getItem("token")).user_type === "Zonal Manager" ? (
                  <Col sm="3" style={{ position: "relative", marginTop: "-35px" }}>
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label"> Status *</Label>
                        <Input
                          type="select"
                          name="status"
                          onChange={handleInputChange}
                          onBlur={checkEmptyValue}
                          className={`form-control digits ${formData && formData.status ? "not-empty" : ""
                            }`}
                          value={formData && formData.status}
                        >
                          <option value={"OPN"}>Open</option>
                          <option value="ASN" key={"ASN"}>Assigned</option>

                        </Input>
                      </div>
                      <span className="errortext">
                        {errors.status && "Select Status"}
                      </span>
                    </FormGroup>
                  </Col>
                ) : JSON.parse(localStorage.getItem("token")).user_type === "Staff" ? (
                  <Col sm="3" style={{ position: "relative", marginTop: "-35px" }}>
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label"> Status *</Label>
                        <Input
                          type="select"
                          name="status"
                          onChange={handleInputChange}
                          onBlur={checkEmptyValue}
                          className={`form-control digits ${formData && formData.status ? "not-empty" : ""
                            }`}
                          value={formData && formData.status}
                        >
                          {/* <option value={"OPN"}>Open</option> */}
                          {/* <option value="ASN" key={"ASN"}>Assigned</option> */}
                          <option value="INP">In-Progress</option>
                          <option value="RSL">Resolved</option>

                        </Input>
                      </div>
                      <span className="errortext">
                        {errors.status && "Select Status"}
                      </span>
                    </FormGroup>
                  </Col>
                ) : (
                  <Col sm="3" style={{ position: "relative", marginTop: "-35px" }}>
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label"> Status *</Label>
                        <Input
                          type="select"
                          name="status"
                          onChange={handleInputChange}
                          onBlur={checkEmptyValue}
                          className={`form-control digits ${formData && formData.status ? "not-empty" : ""
                            }`}
                          value={formData && formData.status}
                        >
                          {ticketStatus.map((statuses, index) => (
                            <option key={index[0]} value={statuses.id}>
                              {statuses.name}
                            </option>
                          ))}

                        </Input>
                      </div>
                      <span className="errortext">
                        {errors.status && "Select Status"}
                      </span>
                    </FormGroup>
                  </Col>
                )}

              </Row>
              <Row id="watchlist">
                <Col sm="2" style={{ display: "contents" }}>
                  <label type="text" value="">
                    <Col id="watchlist_size">
                      <p style={{ fontSize: "18px", }}>
                        Watchlist &nbsp; &nbsp;
                        <span
                          onClick={Verticalcentermodaltoggle}
                          style={{ cursor: "pointer" }}
                        >
                          &nbsp; <UserPlus className="user-plus" style={{ color: "#377DF6" }} />

                        </span>
                      </p>
                    </Col>
                  </label>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup style={{ marginTop: "-16px" }}>
                    <div className="input_wrap ">
                      <Typeahead
                        style={{ border: "none" }}
                        id="multiple-typeahead"
                        disabled={true}
                        multiple
                        selected={userTypeText}
                        name="watchlists"
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "14%",
                        left: "73%",
                      }}
                    ></div>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup style={{ marginTop: "-16px" }}>
                    <div className="input_wrap">
                      <Typeahead
                        open={false}
                        id="multiple-typeahead"
                        labelKey={"username"}
                        name="watchlists"
                        multiple
                        selected={selectedWatchlist}
                        onChange={(selected) => setselectedWatchlist(selected)}
                        options={assignedTo}
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "14%",
                        left: "73%",
                      }}
                    ></div>
                  </FormGroup>
                </Col>
              </Row>
              <Row >
                <Modal
                  isOpen={Verticalcenter}
                  toggle={Verticalcentermodaltoggle}
                  centered
                  backdrop="static"
                >
                  {/* <ModalHeader toggle={Verticalcentermodaltoggle}>
                    Add Users
                  </ModalHeader> */}
                  <ModalBody>
                    <h5> Add Users</h5>
                    <hr />
                    <FormGroup style={{ marginTop: "10px" }}>
                      <div className="input_wrap">
                        <Typeahead
                          id="multiple-typeahead"
                          clearButton
                          labelKey={"username"}
                          name="watchlists"
                          multiple
                          selected={selectedWatchlist}
                          onChange={(selected) =>
                            setselectedWatchlist(selected)
                          }
                          options={assignToFilter}
                          onInputChange={(text) => {
                            if (text !== "") {
                              let arrFilter = assignedTo.filter(
                                (a) =>
                                  a.username
                                    .toLowerCase()
                                    .indexOf(text.toLowerCase()) !== -1
                              );
                              setAssignToFilter(arrFilter);
                            } else {
                              setAssignToFilter([]);
                            }
                          }}
                          onFocus={() => setAssignToFilter([])}
                          placeholder="Select User"
                        />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: "14%",
                          left: "73%",
                        }}
                      ></div>
                    </FormGroup>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={Verticalcentermodaltoggle} id="save_button">
                      Add
                    </Button>
                    <Button color="secondary" id="resetid" onClick={toggle}>
                      {"Cancel"}
                    </Button>
                  </ModalFooter>
                </Modal>
              </Row>
              <Row id="watchlist1">
                <Col sm="6">
                  <div className="input_wrap">
                    <Label className="kyc_label">
                      Customer Notes *
                    </Label>
                    <Input
                      name="customer_notes"
                      type="text"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      value={formData && formData.customer_notes}
                      className={`form-control digits ${formData && formData.customer_notes ? "not-empty" : ""
                        }`}
                      style={{ textTransform: "capitalize" }}
                    />

                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "5%",
                      left: "2%",
                    }}
                  ></div>
                  <span className="errortext">
                    {errors.customer_notes }
                  </span>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Work Notes</Label>
                      <Input
                        type="text"
                        name="notes"
                        value={formData && formData.notes}
                        rows="3"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        className={`form-control digits ${formData && formData.notes ? "not-empty" : ""
                          }`}
                        style={{ textTransform: "capitalize" }}
                      />

                    </div>
                    <span className="errortext">
                    {errors.worknotes }
                  </span>
                  </FormGroup>
                </Col>
              </Row>
              <br />
              <br />

              <br />
              {/*Added spinner to create button in lead by Marieya on 28.8.22*/}
              <Row>
                <span className="sidepanel_border" style={{ position: "relative", top: "0px" }}></span>
                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="submit"
                      className="mr-3"
                      onClick={resetInputField}
                      id="create_button"
                      disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
                    >
                      {loaderSpinneer ? <Spinner size="sm" id="spinner"></Spinner> : null} &nbsp;
                      Create
                    </Button>

                    <Button
                      type="reset"
                      color="btn btn-primary"
                      id="resetid"
                      //calling reset after draft
                      onClick={() => resetformmanually()}
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
      <ExistingCustomer exitcustomer={exitcustomer} exitingCustomer={exitingCustomer} errormessage={errormessage} dataClose={props.dataClose} />
    </Fragment>
  );
};
export default withRouter(AddTicket);
