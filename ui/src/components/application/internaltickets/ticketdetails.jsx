import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import {
  Container,
  Row,
  Col,
  Form,
  Label,
  CardHeader,
  Card,
  CardBody,
  Media,
  Modal,
  ModalFooter,
  FormGroup,
  ModalBody,
  Button,
  ModalHeader,
} from "reactstrap";
import { UserPlus } from "react-feather";
import { Accordion } from "react-bootstrap";
import { default as axiosBaseURL, customeraxios } from "../../../axios";
import { helpdeskaxios } from "../../../axios";
import get from "lodash/get";
import { Typeahead } from "react-bootstrap-typeahead";
import isEmpty from "lodash/isEmpty";
import { connect } from "react-redux";
import { setSelectedLeadForEdit } from "../../../redux/internal-tickets/actions";
import { toast } from "react-toastify";
import EditIcon from '@mui/icons-material/Edit';

const TicketDetails = (props) => {
  const { id } = useParams();
  //  
  // 
  const [formData, setFormData] = useState({});
  const [assigntoselected, setAssigntoselected] = useState([]);
  const [workeNotes, setWorkNotes] = useState();
  const [leadUser, setLeadUser] = useState({});
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [expanded1, setexpanded1] = useState(true);
  const [expanded2, setexpanded2] = useState(false);
  const [expanded3, setexpanded3] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({});
  const [ticketCategory, setTicketCategory] = useState([]);
  const [ticketSubcategory, setTicketSubcategory] = useState([]);
  const [prioritySla, setPrioritySla] = useState([]);
  const [ticketStatus, setTicketStatus] = useState([]);
  const Verticalcentermodaltoggle = () => setVerticalcenter(!Verticalcenter);
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [assignToFilter, setAssignToFilter] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedWatchlist, setselectedWatchlist] = useState();
  const [selectedWatchlistAddUser, setselectedWatchlistAddUser] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  const [worknoteActivities, setWorknotesActivities] = useState([]);

  useEffect(() => {
    // if (props.lead.assigned_date) {
    //   var now = new Date(props.lead.assigned_date);
    //   now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    //   const opendateFomated = now.toISOString().slice(0, 16);
    //   let d = new Date(props.lead.updated_at);
    //   let dStr = d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    //   new Date(dStr).toString();
    //   const watchlist = props.lead.watchlists
    //     .map((u) => u.user.username)
    //     .join(",");
    //   setselectedWatchlist(props.lead.watchlists.map((u) => u.user));
    //   setLeadUser({
    //     ...props.lead,
    //     assigned_date: opendateFomated,
    //     updated_at: dStr,
    //     watchlist: watchlist,
    //   });
    //   setWorkNotes("");
    //   if (props.lead.open_for) {
    //     const id = props.lead.open_for.replace("L00", "");
    //     axiosBaseURL.get("/radius/lead/" + id + "/read").then((res) => {
    //       setCustomerDetails(res.data);
    //     });
    //   }
    // } else {
    //   let watchlist = "";
    //   if (!isEmpty(props.lead) && !isEmpty(props.lead.watchlists)) {
    //     setselectedWatchlist(props.lead.watchlists.map((u) => u.user));
    //     watchlist = props.lead.watchlists.map((u) => u.user.username).join(",");
    //   }
    //   setLeadUser({
    //     ...props.lead,
    //     watchlist: watchlist,
    //   });
    //   setWorkNotes("");
    // }
  }, [props.lead]);

  useEffect(() => {
    setIsEditDisabled(true);
    let watchlist = "";
    if (!isEmpty(props.lead)) {
      setselectedWatchlist(props.lead.watchlists.map((u) => u.user));
      watchlist = props.lead.watchlists.map((u) => u.user.username).join(",");
    }
    setLeadUser({
      ...props.lead,
      watchlist: watchlist,
    });
    setWorkNotes("");
  }, [props.rightSidebar]);

  useEffect(() => {
    helpdeskaxios.get("rud/" + props.lead.id + "/ticket").then((res) => {
      setLeadUser(res.data);
      setWorkNotes("");
    });
  }, []);

  useEffect(() => {
    if (leadUser && leadUser.id) {
      helpdeskaxios.get("ru/" + leadUser.id + "/worknote").then((res) => {
        setWorknotesActivities(res.data.work_notes);
      });
    }
  }, [leadUser]);

  const handleChange = (e) => {
    if (
      e.target.name == "ticket_category" ||
      e.target.name == "sub_category" ||
      e.target.name == "priority_sla"
    ) {
      setLeadUser((prev) => ({
        ...prev,
        [e.target.name]: { id: e.target.value },
      }));
    } else {
      if (e.target.name == "assigned_to") {
        setLeadUser((prev) => {
          if (!prev.assigned_to) {
            return { ...prev, [e.target.name]: e.target.value, status: "ASN" };
          } else {
            return { ...prev, [e.target.name]: e.target.value };
          }
        });
      } else {
        setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      }
    }
    if (e.target.name == "assigned_to") {
      setAssigntoselected(e.target.value);
      setFormData((preState) => ({
        ...preState,
      }));
    }
  };

  const handleChangeWorkNotes = (e) => {
    setWorkNotes(e.target.value);
  };

  const saveworknotes = () => {
    console.log(workeNotes);
    console.log(props.lead.id);
    var worknote = {
      work_notes: [
        {
          note: workeNotes,
        },
      ],
    };
    helpdeskaxios
      .patch("ru/" + props.lead.id + "/worknote", worknote)
      .then((res) => {
        setWorknotesActivities([...res.data.work_notes]);
        setWorkNotes("");
        props.onUpdate(
          {
            ...props.lead,
            work_notes: res.data.work_notes,
          },
          false
        );
        console.log(res);
      });
  };

  useEffect(() => {
    helpdeskaxios
      .get("create/options/ticket")
      .then((res) => {
        let { category, subcategory, priority_sla, status } = res.data;
        setTicketCategory([...category]);
        setTicketSubcategory([...subcategory]);
        setPrioritySla([...priority_sla]);
        setTicketStatus([...status]);
      })
      .catch((err) => console.log(err));
  }, []);

  // patch api for ticekt detils update
  const handleSubmit = (e, id) => {
    e.preventDefault();
    let openybyId = get(leadUser.opened_by, "id", leadUser.opened_by);
    let assinegtodata = get(leadUser.assigned_to, "id", leadUser.assigned_to);
    const worknoteIds = worknoteActivities.map((worknote) => worknote.id);
    let category = ticketCategory.find(
      (c) => c.id == leadUser.ticket_category.id
    );
    let leaddata = {
      ...leadUser,
      ticket_category: {
        ...category,
      },
      sub_category: {
        id: leadUser.sub_category.id,
        name: leadUser.sub_category.name,
      },
      opened_by: openybyId,
      work_notes: [...worknoteIds],
      assigned_to: assinegtodata,
      priority_sla: {
        id: leadUser.priority_sla.id,
        name: leadUser.priority_sla.name,
      },
    };

    leaddata.watchlists = selectedWatchlist.map((user) => {
      return { user: user.id };
    });

    helpdeskaxios
      .patch("rud/" + props.lead.id + "/ticket", leaddata)
      .then((res) => {
        console.log(res);
        console.log(res.data);
        props.onUpdate(res.data);
        setIsEditDisabled(true);
        toast.success("Ticket was edited successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      })
      .catch(function (error) {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        console.error("Something went wrong!", error);
      });
    // }
  };
  const editClicked = (e) => {
    e.preventDefault();
    setIsEditDisabled(false);
  };

  const Accordion2 = () => {
    setexpanded2(!expanded2);
    setexpanded1(false);
    setexpanded3(false);
  };

  useEffect(() => {
    customeraxios.get(`customers/display/users`).then((res) => {
      let { assigned_to } = res.data;

      setAssignedTo([...assigned_to]);
    });
  }, []);


  useEffect(()=>{
    if(props.openCustomizer){
      setErrors({});
    }
  }, [props.openCustomizer]);
  
  return (
    <Fragment>
      <div>
        <Row>
          <EditIcon style={{top:"10px", right:"56px"}} onClick={editClicked}/>
          <i className="icofont-ui-edit"   ></i>
        </Row>
      </div>
      <br />
      <Container fluid={true}>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <input
                    className={`form-control digits not-empty`}
                    type="datetime-local"
                    name="meeting-time"
                    value={moment().format("YYYY-MM-DDThh:mm")}
                    style={{ border: "none", outline: "none" }}
                    // value={leadUser && leadUser.open_date}
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={true}
                  ></input>
                  <Label className="placeholder_styling">Open Date :</Label>
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
                    name="opened_by"
                    style={{ border: "none", outline: "none" }}
                    value={
                      leadUser &&
                      leadUser.opened_by &&
                      leadUser.opened_by.username
                    }
                    onChange={handleChange}
                    // onBlur={blur}
                    disabled={true}
                  ></input>
                  <Label className="placeholder_styling">Open By</Label>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="branches"
                    style={{ border: "none", outline: "none" }}
                    value={
                      leadUser && leadUser.branches && leadUser.branches.name
                    }
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={true}
                  ></input>
                  <Label className="placeholder_styling">Branch</Label>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="departments"
                    style={{ border: "none", outline: "none" }}
                    value={
                      leadUser &&
                      leadUser.departments &&
                      leadUser.departments.name
                    }
                    onChange={handleChange}
                    id="afterfocus"
                    // onBlur={blur}
                    disabled={true}
                  ></input>
                  <Label className="placeholder_styling">Department</Label>
                </div>
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="ticket_category"
                    style={{ border: "none", outline: "none" }}
                    value={
                      leadUser &&
                      leadUser.ticket_category &&
                      leadUser.ticket_category.id
                    }
                    onChange={handleChange}
                    // onBlur={blur}
                    disabled={isEditDisabled}
                  >
                    {ticketCategory.map((categories) => {
                      console.log("categories", categories);
                      console.log("categories", leadUser);
                      if (
                        !!categories &&
                        leadUser &&
                        leadUser.ticket_category
                      ) {
                        return (
                          <option
                            key={categories.id}
                            value={categories.id}
                            selected={
                              categories.id == leadUser.ticket_category.id
                                ? "selected"
                                : ""
                            }
                          >
                            {categories.category}
                          </option>
                        );
                      }
                    })}
                  </select>
                  <Label className="placeholder_styling">Category</Label>
                </div>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="sub_category"
                    style={{ border: "none", outline: "none" }}
                    value={
                      leadUser &&
                      leadUser.sub_category &&
                      leadUser.sub_category.id
                    }
                    onChange={handleChange}
                    // onBlur={blur}
                    disabled={isEditDisabled}
                  >
                    {ticketSubcategory.map((subcategories) => {
                      console.log("categories", subcategories);
                      console.log("categories", leadUser);
                      if (
                        !!subcategories &&
                        leadUser &&
                        leadUser.sub_category
                      ) {
                        return (
                          <option
                            key={subcategories.id}
                            value={subcategories.id}
                            selected={
                              subcategories.id == leadUser.sub_category.id
                                ? "selected"
                                : ""
                            }
                          >
                            {subcategories.name}
                          </option>
                        );
                      }
                    })}
                  </select>
                  <Label className="placeholder_styling">Sub Category</Label>
                </div>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="priority_sla"
                    style={{ border: "none", outline: "none" }}
                    value={
                      leadUser &&
                      leadUser.priority_sla &&
                      leadUser.priority_sla.id
                    }
                    onChange={handleChange}
                    // onBlur={blur}
                    disabled={isEditDisabled}
                  >
                    {prioritySla.map((prioritysla) => {
                      console.log("categories", prioritysla);
                      console.log("categories", leadUser);
                      if (!!prioritysla && leadUser && leadUser.priority_sla) {
                        return (
                          <option
                            key={prioritysla.id}
                            value={prioritysla.id}
                            selected={
                              prioritysla.id == leadUser.priority_sla.id
                                ? "selected"
                                : ""
                            }
                          >
                            {prioritysla.name}
                          </option>
                        );
                      }
                    })}
                  </select>
                  <Label className="placeholder_styling">Priority</Label>
                </div>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="open_for"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.open_for}
                    onChange={handleChange}
                    // onBlur={blur}
                    disabled={isEditDisabled}
                  ></input>
                  <Label className="placeholder_styling">Open For</Label>
                </div>
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="assigned_to"
                    style={{ border: "none", outline: "none" }}
                    value={
                      leadUser && leadUser.assigned_to
                        ? leadUser.assigned_to.id
                        : ""
                    }
                    onChange={handleChange}
                    // onBlur={blur}
                    disabled={isEditDisabled}
                  >
                    <option> Select Below</option>
                    {assignedTo.map((assignedto) => {
                      if (assignedto && leadUser) {
                        return (
                          <option
                            key={assignedto.id}
                            value={assignedto.id}
                            selected={
                              leadUser.assignedto &&
                              assignedto.id == leadUser.assigned_to.id
                                ? "selected"
                                : ""
                            }
                          >
                            {assignedto.username}
                          </option>
                        );
                      }
                    })}
                  </select>
                  <Label className="placeholder_styling">Assigned To</Label>
                </div>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="status"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.status}
                    onChange={handleChange}
                    // onBlur={blur}
                    disabled={isEditDisabled}
                  >
                    {ticketStatus.map((ticketstatus) => {
                      if (!!ticketstatus && leadUser && leadUser.status) {
                        return (
                          <option
                            key={ticketstatus.id}
                            value={ticketstatus.id}
                            selected={
                              ticketstatus.id == leadUser.status.id
                                ? "selected"
                                : ""
                            }
                          >
                            {ticketstatus.name}
                          </option>
                        );
                      }
                    })}
                  </select>
                  <Label className="placeholder_styling">Status</Label>
                </div>
              </FormGroup>
            </Col>
            <Col sm="3">
              <FormGroup>
                <div className="input_wrap">
                  <input
                    className={`form-control digits not-empty afterfocus`}
                    style={{ border: "none", outline: "none" }}
                    // className="form-control afterfocus"
                    type="datetime-local"
                    id="meeting-times"
                    name="assigned_date"
                    // name="assigned_date"
                    onChange={handleChange}
                    // value={inputs.first_name}
                    maxLength="15"
                    value={
                      leadUser &&
                      moment
                        .utc(leadUser.assigned_date)
                        .format("YYYY-MM-DDThh:mm")
                    }
                    disabled={isEditDisabled}
                  />
                  <Label className="placeholder_styling">Assigned Date</Label>

                  {/* <Label
                    for="meeting-times"
                    className="placeholder_styling"
                  ></Label> */}
                </div>
              </FormGroup>
            </Col>
         
            <Col md="4" id="moveup">
              <Label>
                Watchlist:
                <span
                  onClick={() => {
                    setselectedWatchlistAddUser([]);
                    Verticalcentermodaltoggle();
                  }}
                  style={{
                    cursor: isEditDisabled ? "not-allowed" : "pointer",
                    pointerEvents: isEditDisabled ? "none" : "auto",
                  }}
                >
                  &nbsp; <UserPlus className="user-plus" />
                </span>
              </Label>{" "}
              &nbsp;
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Typeahead
                open={false}
                //  clearButton={true}
                id="multiple-typeahead"
                // defaultSelected={options.slice(0, 5)}
                labelKey={"username"}
                name="watch_list"
                multiple
                selected={selectedWatchlist}
                onChange={(selected) => setselectedWatchlist(selected)}
                options={assignedTo}
                value={leadUser && leadUser.watch_list}
                disabled={isEditDisabled}
              />

              <Modal
                isOpen={Verticalcenter}
                toggle={Verticalcentermodaltoggle}
                centered
              >
                <ModalHeader toggle={Verticalcentermodaltoggle}>
                  Add Users
                </ModalHeader>
                <ModalBody>
                  <FormGroup style={{ marginTop: "10px" }}>
                    <div className="input_wrap">
                      <Typeahead
                        id="multiple-typeahead"
                        clearButton
                        defaultSelected={options.slice(0, 5)}
                        labelKey={"username"}
                        name="watch_list"
                        multiple
                        selected={selectedWatchlistAddUser}
                        onChange={(selected) => {
                          setselectedWatchlistAddUser(selected);
                        }}
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
                  <Button
                    color="primary"
                    onClick={() => {
                      setselectedWatchlist((prevState) => {
                        return [...prevState, ...selectedWatchlistAddUser];
                      });
                      Verticalcentermodaltoggle();
                    }}
                  >
                    Add
                  </Button>
                </ModalFooter>
              </Modal>
            </Col>
          </Row>
          <br />
          <Row>
            <Col md="12">
              <FormGroup>

            <div className="input_wrap">
                 
           
              <input
                className={`form-control digits not-empty`}
                type="textarea"
                name="customer_notes"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.customer_notes}
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isEditDisabled}
              ></input>
                  <Label className="placeholder_styling">Customer Notes</Label>

              </div>
              </FormGroup>

            </Col>
         
            <Col id="moveup">
            <FormGroup>

<div className="input_wrap">
              <Label className="kyc_label">Work Notes :</Label>
              <input
                type="textarea"
                rows="3"
                name="work_notes"
                style={{ border: "none", outline: "none" }}
                value={workeNotes}
                onChange={handleChangeWorkNotes}
                id="afterfocus"
                // onBlur={blur}
                // disabled={isEditDisabled}
              ></input>
              </div>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col id="moveup" style={{marginTop:"-11px"}}>
              <button
                type="button"
                name="submit"
                class="btn btn-primary"
                id="save_button"
                onClick={saveworknotes}
              >
                Save
              </button>
            </Col>
          </Row>
          
          <Row style={{ marginLeft: "-36px", marginRight: "0px" }}>
            <Accordion defaultActiveKey="0" style={{ width: "100%" }}>
              <div className="default-according style-1" id="accordionoc">
                <Card style={{ boxShadow: "none" }}>
                  <CardHeader className="" style={{ border: "none" }}>
                    <h5 className="mb-0">
                      <Accordion.Toggle
                        as={Card.Header}
                        className="btn btn-link txt-white "
                        color="primary"
                        onClick={Accordion2}
                        eventKey="1"
                        aria-expanded={expanded2}
                        style={{ color: "black" }}
                      >
                        {}
                        <span className="digits">Activity</span>
                      </Accordion.Toggle>
                    </h5>
                  </CardHeader>
                  <Accordion.Collapse eventKey="1">
                    <CardBody
                      style={{
                        border: "none",
                        paddingTop: "0px",
                        paddingLeft: "50px",
                      }}
                    >
                      <Row>
                        <Col>
                          {leadUser &&
                            worknoteActivities &&
                            worknoteActivities.map((notes, index) => {
                              return (
                                <Media>
                                  <Label className="d-block"></Label>
                                  <div className="media-size-email">
                                    <Media body className="mr-3 ">
                                      <div class="firstletter">
                                        {leadUser &&
                                          leadUser.opened_by &&
                                          leadUser.opened_by.username}
                                      </div>
                                    </Media>
                                  </div>
                                  <Media body>
                                    <p
                                      style={{
                                        fontWeight: 500,
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      {leadUser &&
                                        leadUser.opened_by &&
                                        leadUser.opened_by.username}{" "}
                                      &nbsp;&nbsp;
                                      <small>
                                        <span
                                          className="digits"
                                          style={{ textTransform: "initial" }}
                                        >
                                          ({" "}
                                          {moment(notes.updated_at).format(
                                            "MMMM Do YYYY, h:mm:ss a"
                                          )}
                                          )
                                        </span>
                                      </small>
                                    </p>
                                    <p
                                      style={{
                                        lineHeight: "0",
                                        fontWeight: 500,
                                      }}
                                    >
                                      {notes.note}
                                    </p>
                                    <p>
                                      <span>
                                        <i
                                          className="fa fa-pencil"
                                          style={{ color: "blue" }}
                                        ></i>{" "}
                                        &nbsp;Edit
                                      </span>{" "}
                                      &nbsp;&nbsp;&nbsp;
                                      <span>
                                        <i
                                          className="icofont icofont-ui-delete"
                                          style={{ color: "red" }}
                                        ></i>{" "}
                                        &nbsp;Delete
                                      </span>
                                    </p>
                                  </Media>
                                </Media>
                              );
                            })}
                        </Col>
                      </Row>
                    </CardBody>
                  </Accordion.Collapse>
                </Card>
              </div>
            </Accordion>
          </Row>
          <Row style={{ marginLeft: "-36px", marginRight: "0px" ,marginTop:"-20px"}}>
            <Accordion defaultActiveKey="0" style={{ width: "100%" }}>
              <div className="default-according style-1" id="accordionoc">
                <Card style={{ boxShadow: "none" }}>
                  <CardHeader className="" style={{ border: "none" }}>
                    <h5 className="mb-0">
                      <Accordion.Toggle
                        as={Card.Header}
                        className="btn btn-link txt-white "
                        color="primary"
                        onClick={Accordion2}
                        eventKey="1"
                        aria-expanded={expanded2}
                        style={{ color: "black" }}
                      >
                        {}
                        <span className="digits">Customer Details</span>
                      </Accordion.Toggle>
                    </h5>
                  </CardHeader>
                  <Accordion.Collapse eventKey="1">
                    <CardBody
                      style={{
                        border: "none",
                        paddingTop: "0px",
                        paddingLeft: "50px",
                      }}
                    >
                      <p style={{ fontSize: "14px" }}>
                        First Name :
                        <b>{customerDetails && customerDetails.first_name}</b>
                      </p>

                      <p style={{ fontSize: "14px" }}>
                        Mobile:{" "}
                        <b>{customerDetails && customerDetails.mobile_no}</b>
                      </p>

                      <p style={{ fontSize: "14px" }}>
                        Email: <b>{customerDetails && customerDetails.email}</b>
                      </p>
                      <p style={{ fontSize: "14px" }}>
                        Address:{" "}
                        <b>
                          {customerDetails &&
                            customerDetails.house_no +
                              "," +
                              customerDetails.street +
                              "," +
                              customerDetails.landmark +
                              "," +
                              customerDetails.city +
                              "," +
                              customerDetails.district +
                              "," +
                              customerDetails.pincode +
                              "," +
                              customerDetails.district +
                              "," +
                              customerDetails.state}
                        </b>
                      </p>
                    </CardBody>
                  </Accordion.Collapse>
                </Card>
              </div>
            </Accordion>
          </Row>
          
          {/* <i class="icofont-tick-mark"></i> */}
          <button type="submit" name="submit" class="btn btn-primary">
            Update
          </button>
          &nbsp;
          <button
            type="submit"
            name="submit"
            class="btn btn-danger"
            onClick={props.dataClose}
          >
            Cancel
          </button>
        </Form>
      </Container>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  const { selectedLeadForEdit } = state.InternalTickets;
  return {
    selectedLeadForEdit,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedLeadForEdit: (payload) =>
      dispatch(setSelectedLeadForEdit(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TicketDetails);
