import React, { Fragment, useState, useRef, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Spinner,
  Input,
  Card,
  CardBody,
  Media,
  InputGroupAddon,
  InputGroup,
  Button,
  Modal,
  ModalBody,
} from "reactstrap";
import { HELP_DESK } from "../../../utils/permissions";
import moment from "moment";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import { adminaxios, helpdeskaxios,networkaxios } from "../../../axios";
import get from "lodash/get";
import NewComplaintAdding from "./NewComplaitAdding";
import OPEN from "../../../assets/images/open.png";
import RESOLVED from "../../../assets/images/res.png";
import INPROGRESS from "../../../assets/images/inp.png";
import CLOSED from "../../../assets/images/cls.png";
import ASSIGNED from "../../../assets/images/asn.png";
import Resendcode from "./resendcode";
import AddNetwork from "./addnetwork";
import Resendcodeforrefund from "./resendcodeforrefund";


var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
const Comaplint360 = (props) => {
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [loaderSpinneer, setLoaderSpinner] = useState(false);
  const [ticektData, setTicketData] = useState(props.complaintData);
  const [ticketCategory, setTicketCategory] = useState([]);
  const [ticketSubcategory, setTicketSubcategory] = useState([]);
  const [prioritySla, setPrioritySla] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  const [ticketStatus, setTicketStatus] = useState([]);
  const [assigntoselected, setAssigntoselected] = useState([]);
  const [worknoteState, setWorknoteState] = useState([]);
  const [worknoteEditId, setWorknoteEditId] = useState();
  const [loaderSpinneer1, setLoaderSpinner1] = useState(false);
  const [otpverify, setOtpverify] = useState(false);
  const [otpverifyforrefund, setOtpverifyforrefund] = useState(false);

    // oltlist
    const [oltList, setOltList] = useState([]);
    // dplist
    const [dplist, setDpList] = useState([]);
    // port list
    const [portlist, setPortList] = useState([]);
    // nas
    const [nasList, setNaList] = useState([]);
  const [formData, setFormData] = useState({
    work_notes :""
  });

  const OTpverifytoggle = () => setOtpverify(!otpverify);
  useEffect(() => {
    // setIsEditDisabled(true);
    setTicketData(ticektData);
  }, [ticektData]);
  console.log(ticektData, "ticektData");

  // const OTpverifytoggleforrefund = () => setOtpverifyforrefund(!otpverifyforrefund);
  // useEffect(() => {
  //   setIsEditDisabled(true);
  //   updateSelectedLeadForSubmit(leadForSubmit);
  // }, [selectedLeadForEdit]);

  const OTpverifytoggleforrefund = () => setOtpverifyforrefund(!otpverifyforrefund);
  useEffect(() => {
    // setIsEditDisabled(true);
    setTicketData(ticektData);
  }, [ticektData]);
  console.log(ticektData, "ticektData");

  useEffect(() => {
    setIsEditDisabled(true);
    setTicketData(props.lead);
  }, [props.rightSidebar]);

  useEffect(() => {
    setTicketData(props.complaintData);
  }, [props.complaintData]);

  useEffect(() => {
    adminaxios.get(`accounts/staff`).then((res) => {
      setAssignedTo(res.data);
    });
  }, []);

  useEffect(() => {
    helpdeskaxios
      .get("create/options/ticket")
      .then((res) => {
        let { category, priority_sla, status } = res.data;
        setTicketCategory([...category]);
        setPrioritySla([...priority_sla]);
        setTicketStatus([...status]);
      })

      .catch((err) =>
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        })
      );
  }, []);

  useEffect(() => {
    if (ticektData && ticektData?.ticket_category?.id) {
      helpdeskaxios
        .get(`sub/ticketcategory/${ticektData.ticket_category?.id}`)
        .then((res) => setTicketSubcategory(res.data));
    }
  }, [ticektData?.ticket_category]);

  const editClicked = (e) => {
    e.preventDefault();
    setIsEditDisabled(false);
  };

  const form = useRef(null);

  //start
  const handleSubmit = (e, id) => {
      setLoaderSpinner(true);
    e && e.preventDefault();
    let openybyId = get(ticektData?.opened_by, "id", ticektData?.opened_by);
    let assinegtodata = get(
      ticektData.assigned_to,
      "id",
      ticektData.assigned_to
    );

    let technicianId = get(
      ticektData.technician_comment,
      "id",
      ticektData.technician_comment
    );
    console.log(technicianId, "technicianId");
    let category = ticketCategory.find(
      (c) => c.id == ticektData?.ticket_category.id
    );
    const oltobj = oltList.find((t) => t.id == ticektData.olt);
    const dpobj = dplist.find((d) => d.id == ticektData.dp);
    const portobj = portlist.find((p) => p.id == ticektData.port);
    const nasobj = nasList.find((n) => n.id == ticektData.nas);
    let leaddata = {
      ...ticektData,

      ticket_category: {
        ...category,
      },
      sub_category: {
        id: ticektData.sub_category.id,
        name: ticektData.sub_category.name,
      },
      opened_by: openybyId,
      assigned_to: assinegtodata,
      priority_sla: {
        id: ticektData?.priority_sla?.id
          ? ticektData?.priority_sla?.id
          : ticektData?.priority_sla,
      },

      technician_comment: technicianId
        ? {
            id: technicianId,
          }
        : null,
        network_info: {
          extension_no: ticektData.extension_no,
          serial_no: ticektData.serial_no,
          onu_mac: ticektData.onu_mac,
          nas: { ...nasobj },
          olt: { ...oltobj },
          dp: { ...dpobj },
          port: { ...portobj },
        },
      assigned_by:
        ticektData.status === "ASN"
          ? JSON.parse(localStorage.getItem("token"))?.id
          : ticektData.assigned_by?.id,
      inprogress_by:
        ticektData.status === "INP"
          ? JSON.parse(localStorage.getItem("token"))?.id
          : ticektData.inprogress_by?.id,
      resolved_by:
        ticektData.status === "RSL"
          ? JSON.parse(localStorage.getItem("token"))?.id
          : ticektData.resolved_by?.id,
      closed_by:
        ticektData.status === "CLD"
          ? JSON.parse(localStorage.getItem("token"))?.id
          : ticektData.assigned_by?.id,
    };
    delete leaddata.status_name;
    delete leaddata?.priority_sla?.id?.id;
    delete leaddata?.priority_sla?.id?.name;

    helpdeskaxios
      .patch("enh/" + ticektData?.id, leaddata)
      .then((res) => {
        setLoaderSpinner(false);
  // Sailaja Modified Toast message from update successfully to Updated successfully on 28th March 2023
        toast.success("Updated successfully", {        
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        let newData = { ...res.data };
        delete newData["extension_no"];
        delete newData["serial_no"];
        delete newData["onu_mac"];
        delete newData["nas"];
        delete newData["olt"];
        delete newData["dp"];
        delete newData["port"];

        props.onUpdate(newData);
        setIsEditDisabled(true);
        setWorknoteEditId();
        props.setStaticToggle('off')
        props.setTelIsShow(false)
        props.fetchComplaints()
        // resetformmanually()
      })
      .catch(() => {
        setLoaderSpinner(false);
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      });
    
  };

  //end

  const handleChange = (e) => {
    const { assigned_to } = ticektData;
    if (e.target.name == "assigned_to") {
      setAssigntoselected(e.target.value);
      setTicketData((prev) => {
        if (!prev.assigned_to) {
          return { ...prev, [e.target.name]: e.target.value, status: "ASN" };
        } else {
          return { ...prev, [e.target.name]: e.target.value };
        }
      });
    } else {
      setTicketData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
    if (e.target.name == "assigned_to") {
      setTicketData((prev)=>({
        ...prev,
        assigned_to: { id: e.target.value },
        status: "ASN",
      }));
    }
    let val = e.target.value;

    const target = e.target;
    const name = target.name;
    if (name == "nas") {
      getlistofolt(val);
    }
    if (name == "olt") {
      getlistofdp(val);
    }

    // portlist
    if (name == "dp") {
      getlistofport(val);
    }
  };

  useEffect(() => {
    getUpdatedNotes(ticektData?.id);
  }, [ticektData?.id]);

  const getUpdatedNotes = () => {
    if (ticektData && ticektData.id) {
      helpdeskaxios.get("ticket/" + ticektData.id + "/worknote").then((res) => {
        setWorknoteState(res.data.work_notes);
      });
    }
  };

  const handleSaveWorkNotes = (multiple) => {
    setLoaderSpinner1(true);
    var worknote = {};
    worknote = {
      note: formData.work_notes,
      status: ticektData.status,
    };
    helpdeskaxios
      .post("ru/" + ticektData.id + "/worknote", worknote)
      .then((res) => {
        getUpdatedNotes();
        resetformmanually()
        setLoaderSpinner1(false);
        props.onUpdate(
          {
            ...ticektData,
            work_notes: res.data.work_notes,
          },
          false
        );
      })
      .catch((error) => {
        setLoaderSpinner1(false);
      });
   
  };

  const resetformmanually = () => {
    document.getElementById('myInput').value = ('');

  };
  // const requiredFields =[
  //     "assigned_to"
  // ];

  // const { validate } = useFormValidation(requiredFields);

  const handleUpdate = (e) => {
    if (
      ticektData.status === "CLD" &&
      ticektData.ticket_category.id == 4
    ) {
      console.log("ticketstatus");
      OTpverifytoggle();
    }
    if (
      ticektData.status === "CLD" &&
      ticektData.ticket_category.category === "Provisioning_for_refund"
    ) {
      console.log("ticketstatus");
      OTpverifytoggleforrefund();
    }
  };

  // nas list

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("token")) &&
      JSON.parse(localStorage.getItem("token")).branch === null
    ) {
    } else {
      networkaxios
        .get(
          `network/nas/filter?branch=${JSON.parse(localStorage.getItem("token")) &&
          JSON.parse(localStorage.getItem("token")).branch &&
          JSON.parse(localStorage.getItem("token")).branch.id
          }`
        )
        .then((response) => {
          console.log(response.data);
          setNaList(response.data);
        })
        .catch(function (error) {
          console.error("Something went wrong!", error);
        });
    }
  }, []);
  // olt list
  const getlistofolt = (nasid) => {
    networkaxios
      .get(`/network/olt/filter?parent_nas__id=${nasid}`)
      .then((response) => {
        console.log(response.data);
        setOltList(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };

  // dp list
  const getlistofdp = (oltid) => {
    networkaxios
      .get(`/network/olt/childdp/${oltid}/filter`)
      .then((res) => {
        setDpList(res.data);
      })
      .catch(function (error) {
        console.error("Something went wrong");
      });
  };

  // portlist
  const getlistofport = (dpid) => {
    networkaxios
      .get(`/network/childdpport/${dpid}/filter`)
      .then((res) => {
        setPortList(res.data);
      })
      .catch(function (error) {
        console.error("Something went wrong");
      });
  };

  return (
    <Fragment>
      <div>
        <Row>
          {token.permissions.includes(HELP_DESK.UPDATE) && (
            <EditIcon
              className="icofont icofont-edit"
              style={{ top: "8px", right: "64px" }}
              onClick={editClicked}
            />
          )}
        </Row>
      </div>
      <br />
      <Container fluid={true} style={{ marginTop: "10px" }}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            !otpverify &&  !otpverifyforrefund && handleSubmit(e);
          }}
          ref={form}
          // id="resetid"
        >
          <Row>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Open Date</Label>
                  <input
                    className={`form-control digits not-empty`}
                    type="datetime-local"
                    name="meeting-time"
                    value={moment(ticektData && ticektData?.open_date).format(
                      "YYYY-MM-DDThh:mm"
                    )}
                    style={{ border: "none", outline: "none" }}
                    onChange={handleChange}
                    id="afterfocus"
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Open By</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="opened_by"
                    style={{ border: "none", outline: "none" }}
                    value={
                      ticektData &&
                      ticektData.opened_by &&
                      ticektData.opened_by.username
                    }
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>
            {/* <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Department</Label>
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="departments"
                    style={{ border: "none", outline: "none" }}
                    value={ticektData?.department}
                    onChange={handleChange}
                    id="afterfocus"
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col> */}
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Category *</Label>
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="ticket_category"
                    style={{ border: "none", outline: "none" }}
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    disabled={true}
                  >
                    {ticketCategory.map((categories) => {
                      if (
                        !!categories &&
                        ticektData &&
                        ticektData?.ticket_category
                      ) {
                        return (
                          <option
                            key={categories.id}
                            value={categories.id}
                            selected={
                              categories.id == ticektData?.ticket_category.id
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
                </div>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Sub Category *</Label>

                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="sub_category"
                    style={{ border: "none", outline: "none" }}
                    value={
                      ticektData &&
                      ticektData.sub_category &&
                      ticektData.sub_category.id
                    }
                    onChange={handleChange}
                    disabled={isEditDisabled}
                  >
                    {ticketSubcategory.map((subcategories) => {
                      if (
                        !!subcategories &&
                        ticektData &&
                        ticektData.sub_category
                      ) {
                        return (
                          <option
                            key={subcategories.id}
                            value={subcategories.id}
                            selected={
                              subcategories.id == ticektData?.sub_category.id
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
                </div>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Priority *</Label>
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="priority_sla"
                    style={{ border: "none", outline: "none" }}
                    value={ticektData && ticektData?.priority_sla?.id}
                    // value={
                    //   leadForSubmit1 &&
                    //   leadForSubmit1.priority_sla &&
                    //   leadForSubmit1.priority_sla.id
                    // }
                    onChange={handleChange}
                    disabled={isEditDisabled}
                  >
                    {prioritySla.map((prioritysla) => {
                      if (
                        !!prioritysla &&
                        ticektData &&
                        ticektData?.priority_sla
                      ) {
                        return (
                          <option
                            key={prioritysla.id}
                            value={prioritysla.id}
                            selected={
                              prioritysla.id == ticektData?.priority_sla.id
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
                </div>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Customer ID *</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="open_for"
                    style={{ border: "none", outline: "none" }}
                    value={ticektData && ticektData?.open_for}
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>
            {props?.complaintData?.status === "ASN" ||
            props?.complaintData?.status === "RSL" ||
            props?.complaintData?.status === "INP" ||
            props?.complaintData?.status === "CLD" ? (
              <>
                <Col md="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Assigned To *</Label>
                      <select
                        className={`form-control digits not-empty`}
                        id="afterfocus"
                        type="select"
                        name="assigned_to"
                        style={{ border: "none", outline: "none" }}
                        value={ticektData && ticektData.assigned_to &&ticektData.assigned_to.id }
                        // value={
                        //   ticektData &&
                        //   ticektData.assigned_to &&
                        //     !!ticektData.assigned_to.id
                        //     ? ticektData &&
                        //     ticektData.assigned_to &&
                        //     ticektData.assigned_to.id
                        //     : ""
                        // }
                        onChange={handleChange}
                        disabled={props?.istelShow ? false : true}
                      >
                        <option key="" value="">
                          {" "}
                          Select Below
                        </option>
                        {assignedTo.map((assignedto) => {
                          if (assignedto && ticektData) {
                            return (
                              <option
                                key={assignedto && assignedto.id}
                                value={assignedto && assignedto.id}
                                selected={
                                  ticektData?.assignedto &&
                                  assignedto.id == ticektData &&
                                  ticektData?.assigned_to &&
                                  ticektData?.assigned_to.id
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
                      
                    </div>
                  </FormGroup>
                </Col>
              </>
            ) : (
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Assigned To *</Label>
                    <select
                      className={`form-control digits not-empty`}
                      id="afterfocus"
                      type="select"
                      name="assigned_to"
                      style={{ border: "none", outline: "none" }}
                      value={ticektData && ticektData.assigned_to && ticektData.assigned_to.id}
                      //   value={
                      //     ticektData &&
                      //     ticektData?.assigned_to &&
                      //     !!ticektData?.assigned_to.id
                      //       ? ticektData &&
                      //         ticektData?.assigned_to &&
                      //         ticektData?.assigned_to.id
                      //       : ""
                      //   }
                      onChange={handleChange}
                      disabled={isEditDisabled}
                    >
                      <option key="" value="">
                        {" "}
                        Select Below
                      </option>
                      {assignedTo.map((assignedto) => {
                        if (assignedto && ticektData) {
                          return (
                            <option
                              key={assignedto && assignedto.id}
                              value={assignedto && assignedto.id}
                              selected={
                                ticektData?.assignedto &&
                                assignedto.id == ticektData &&
                                ticektData?.assigned_to &&
                                ticektData?.assigned_to.id
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
                  </div>
                </FormGroup>
              </Col>
            )}
{/* 
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Status *</Label>
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="status"
                    style={{ border: "none", outline: "none" }}
                    value={ticektData && ticektData?.status}
                    onChange={handleChange}
                    disabled={isEditDisabled}
                  >
                    {ticketStatus.map((ticketstatus) => {
                      if (!!ticketstatus && ticektData && ticektData?.status) {
                        return (
                          <option
                            key={ticketstatus.id}
                            value={ticketstatus.id}
                            selected={
                              ticketstatus.id === ticektData?.status
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
                </div>
              </FormGroup>
            </Col> */}
                        {JSON.parse(localStorage.getItem("token")).user_type ===
              "Help Desk" &&
              JSON.parse(localStorage.getItem("token")).roles[0] === 28 ? (
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Status *</Label>
                    <Input
                      className={`form-control digits not-empty`}
                      id="afterfocus"
                      type="select"
                      name="status"
                      style={{ border: "none", outline: "none" }}
                      value={ticektData && ticektData.status}
                      onChange={handleChange}
                      disabled={isEditDisabled}
                    >
                      {(ticektData?.status === "ASN" &&
                        ticektData?.status === "ASN") ||
                        (ticektData?.status === "INP" &&
                        ticektData?.status === "INP") ||
                        (ticektData?.status === "RSL" &&
                        ticektData?.status === "RSL") ? (
                        <>
                          <option value={ticektData.status}>
                            {ticektData.status_name}{" "}
                          </option>
                          {/* <option value="ASN" key={"ASN"}>
                            Assigned
                          </option> */}
                             <option value="OPN" key={"OPN"}>
                            Open
                          </option>
                          <option value="CLD" key={"CLD"}>
                            Closed
                          </option>
                        </>
                      ) : (
                        <>
                          <option value="ASN" key={"ASN"}>
                            Assigned
                          </option>
                          <option value="CLD" key={"CLD"}>
                            Closed
                          </option>
                        </>
                      )}
                    </Input>
                  </div>
                </FormGroup>
              </Col>
              ): JSON.parse(localStorage.getItem("token")).user_type ===
              "Help Desk" &&
            // JSON.parse(localStorage.getItem("token")).roles[0] === 6 ? (
            // JSON.parse(localStorage.getItem("token")).roles[0] === 30 ? (
            JSON.parse(localStorage.getItem("token")).roles[0] === 30 ? (
              <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Status *</Label>
                  <Input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="status"
                    style={{ border: "none", outline: "none" }}
                    value={ticektData && ticektData.status}
                    onChange={handleChange}
                    disabled={isEditDisabled}
                  >
                    {(ticektData?.status === "OPN" &&
                      ticektData?.status === "OPN") ||
                      (ticektData?.status === "INP" &&
                      ticektData?.status === "INP") ||
                      (ticektData?.status === "RSL" &&
                      ticektData?.status === "RSL") ||
                        (ticektData?.status === "CLD" &&
                        ticektData?.status === "CLD") 
                        ? (
                      <>
                        <option value={ticektData.status}>
                          {ticektData.status_name}{" "}
                        </option>
                        <option value="ASN" key={"ASN"}>
                          Assigned
                        </option>
                        {/* <option value="CLD" key={"CLD"}>
                          Closed
                        </option> */}
                      </>
                    ) : (
                      <>
                        <option value="ASN" key={"ASN"}>
                          Assigned
                        </option>
                        <option value="CLD" key={"CLD"}>
                          Closed
                        </option>
                      </>
                    )}
                  </Input>
                </div>
              </FormGroup>
            </Col>
             ) : JSON.parse(localStorage.getItem("token")).user_type === "Help Desk" ? (
              <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Status *</Label>
                  <Input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="status"
                    style={{ border: "none", outline: "none" }}
                    value={ticektData && ticektData.status}
                    onChange={handleChange}
                    disabled={isEditDisabled}
                  >
                    {(ticektData?.status === "OPN" &&
                      ticektData?.status === "OPN") ||
                      (ticektData?.status === "INP" &&
                      ticektData?.status === "INP") ||
                      (ticektData?.status === "RSL" &&
                      ticektData?.status === "RSL") ? (
                      <>
                        <option value={ticektData.status}>
                          {ticektData.status_name}{" "}
                        </option>
                        <option value="ASN" key={"ASN"}>
                          Assigned
                        </option>
                        <option value="CLD" key={"CLD"}>
                          Closed
                        </option>
                      </>
                    ) : (
                      <>
                        <option value="ASN" key={"ASN"}>
                          Assigned
                        </option>
                        <option value="CLD" key={"CLD"}>
                          Closed
                        </option>
                      </>
                    )}
                  </Input>
                </div>
              </FormGroup>
            </Col>
            ) : JSON.parse(localStorage.getItem("token")).user_type ===
              "Staff" ? (
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Status *</Label>
                    <select
                      className={`form-control digits not-empty`}
                      id="afterfocus"
                      type="select"
                      name="status"
                      style={{ border: "none", outline: "none" }}
                      value={ticektData && ticektData.status}
                      onChange={handleChange}
                      disabled={isEditDisabled}
                    >
                      {ticektData?.status === "OPN" &&
                        ticektData?.status === "OPN" ||
                        (ticektData?.status === "CLD" &&
                        ticektData?.status === "CLD") ||
                        (ticektData?.status === "ASN" &&
                        ticektData?.status === "ASN") ? (
                        <>
                          <option value={ticektData.status}>
                            {ticektData.status_name}{" "}
                          </option>
                          {/* <option value="ASN" key={"ASN"}>
                            Assigned
                          </option> */}
                          <option value="INP">In-Progress</option>
                          <option value="RSL">Resolved</option>
                          {/* <option value="CLD">Closed</option> */}
                        </>
                      ) : (
                        <>
                          {/* <option value="ASN" key={"ASN"}>
                            Assigned
                          </option> */}
                          <option value="INP">In-Progress</option>
                          <option value="RSL">Resolved</option>
                          {/* <option value="CLD">Closed</option> */}
                        </>
                      )}
                    </select>
                  </div>
                </FormGroup>
              </Col>
            ) : JSON.parse(localStorage.getItem("token")).user_type ===
              "Zonal Manager" ? (
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Status *</Label>
                    <select
                      className={`form-control digits not-empty`}
                      id="afterfocus"
                      type="select"
                      name="status"
                      style={{ border: "none", outline: "none" }}
                      value={ticektData && ticektData.status}
                      onChange={handleChange}
                      disabled={isEditDisabled}
                    >
                      {(ticektData?.status === "OPN" &&
                        ticektData?.status === "OPN") ||
                        (ticektData?.status === "INP" &&
                        ticektData?.status === "INP") ||
                        (ticektData?.status === "RSL" &&
                        ticektData?.status === "RSL") ||
                        (ticektData?.status === "CLD" &&
                        ticektData?.status === "CLD") ? (
                        <>
                          <option value={ticektData.status}>
                            {ticektData.status_name}{" "}
                          </option>
                          <option value="ASN">Assigned</option>
                        </>
                      ) : (
                        <>
                          <option value="ASN">Assigned</option>
                        </>
                      )}
                    </select>
                  </div>
                </FormGroup>
              </Col>
            ) : (
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Status *</Label>
                    <select
                      className={`form-control digits not-empty`}
                      id="afterfocus"
                      type="select"
                      name="status"
                      style={{ border: "none", outline: "none" }}
                      value={ticektData && ticektData.status}
                      onChange={handleChange}
                      disabled={isEditDisabled}
                    >
                      {ticketStatus.map((ticketstatus) => {
                        if (
                          !!ticketstatus &&
                          ticektData &&
                          ticektData.status
                        ) {
                          return (
                            <option
                              key={ticketstatus.id}
                              value={ticketstatus.id}
                              selected={
                                ticketstatus.id === ticektData?.status
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
                  </div>
                </FormGroup>
              </Col>
            )}
            {token.permissions.includes(HELP_DESK.HELPDESK_TICKET_REASSIGN) && (
              <>
                {props?.complaintData?.status != "OPN" && (
                  <Col>
                    <div>
                      <b>ReAssign</b>
                    </div>
                    <>
                      <div
                        className={`franchise-switch ${props?.staticToggle}`}
                        onClick={props?.staticIpToggle}
                      />
                    </>
                  </Col>
                )}
              </>
            )}
          </Row>
          {ticektData?.status === "RSL" ? (
            <NewComplaintAdding
              ticketCategory={ticketCategory}
              leadForSubmit={ticektData}
              handleChange={handleChange}
              ticketSubcategory={ticketSubcategory}
              isEditDisabled={isEditDisabled}
              techniciandata={props.techniciandata}
              setTechnicianData={props.setTechnicianData}
            />
          ) : (
            ""
          )}
          <Row>
          {ticektData?.ticket_category?.id == 3 &&
            ticektData.status === "ASN" ? (
            <>
              <Row>
                <Col>
                  <h6>Network Info:</h6>
                </Col>
              </Row>
              <Row>
                <>
                  {props && ticektData ? (
                    <AddNetwork
                      lead={ticektData}
                      handleChange={handleChange}
                      oltList={oltList}
                      dplist={dplist}
                      portlist={portlist}
                      nasList={nasList}
                      isEditDisabled={isEditDisabled}
                    />
                  ) : null}
                </>
              </Row>
            </>
          ) : (
            ""
          )}
            <Col md="12">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Customer Notes</Label>
                  <input
                    className={`form-control digits not-empty afterfocus`}
                    type="textarea"
                    name="customer_notes"
                    style={{ border: "none", outline: "none" }}
                    value={ticektData?.customer_notes? ticektData?.customer_notes: ''}
                    onChange={handleChange}
                    id="afterfocus"
                    disabled={isEditDisabled}
                  ></input>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <p style={{ fontSize: "17px" }}>
                <b>Address</b>:{" "}
                <span>
                  {ticektData?.address?.house_no
                    ? ticektData.address?.house_no + ","
                    : ""}
                  <br />
                </span>
                <span style={{ position: "relative", left: "80px" }}>
                  {ticektData?.address
                    ? ticektData?.address.landmark + ","
                    : ""}
                  {ticektData?.address ? ticektData?.address.street + "," : ""}
                  <br />
                  {ticektData?.address ? ticektData?.address.city + "," : ""}
                  {ticektData?.address
                    ? ticektData?.address.district + ","
                    : ""}
                  <br />
                  {ticektData?.address ? ticektData?.address.state + "," : ""}
                  {ticektData?.address ? ticektData?.address.country + "," : ""}
                  {ticektData?.address ? ticektData?.address.pincode : ""}
                </span>
              </p>
            </Col>
          </Row>
          <Label className="kyc_label">Work Notes</Label>
          <Row>
            <Col className="call-chat-body" id="myForm">
              <Card>
                <CardBody className="p-0">
                  <Row className="chat-box">
                    <Col className="pr-0 chat-right-aside">
                      <div className="chat">
                        <div className="chat-header clearfix">
                          <div className="about">
                            <div className="name">{"Activity"}</div>
                            <div className="status digits"></div>
                          </div>
                        </div>
                        <div className="chat-history chat-msg-box custom-scrollbar">
                          <Col className="call-chat-body">
                            <>
                              <Card>
                                <br />

                                <Col>
                                  {worknoteState === 0 ? (
                                    "No worknotes"
                                  ) : (
                                    <>
                                      {ticektData &&
                                        worknoteState &&
                                        worknoteState.map((notes, index) => {
                                          return (
                                            <Media>
                                              <Label className="d-block"></Label>
                                              <div className="media-size-email">
                                                <Media body className="mr-3 ">
                                                  <div class="firstletter">
                                                    {notes &&
                                                      notes.created_by_username}
                                                  </div>
                                                </Media>
                                              </div>
                                              <Media body>
                                                <p
                                                  className="digits"
                                                  style={{
                                                    fontWeight: 500,
                                                    fontSize: "13px",
                                                    textTransform: "capitalize",
                                                    marginBottom: "6px",
                                                  }}
                                                >
                                                  {notes &&
                                                    notes.created_by_username}{" "}
                                                  &nbsp;&nbsp;
                                                  <span
                                                    className="digits"
                                                    style={{
                                                      textTransform: "initial",
                                                    }}
                                                  >
                                                    ({" "}
                                                    {moment(
                                                      notes.updated_at
                                                    ).format(
                                                      "MMMM Do YYYY, h:mm:ss a"
                                                    )}
                                                    )
                                                  </span>
                                                  &nbsp; &nbsp; &nbsp;
                                                  <div
                                                    style={{
                                                      textAlign: "end",
                                                      position: "relative",
                                                      top: "-25px",
                                                    }}
                                                  >
                                                    Status :{" "}
                                                    <span>
                                                      {notes.status ===
                                                      "OPN" ? (
                                                        <span>
                                                          <img src={OPEN} />
                                                          &nbsp; Open
                                                        </span>
                                                      ) : notes.status ===
                                                        "ASN" ? (
                                                        <span>
                                                          <img src={ASSIGNED} />
                                                          &nbsp; Assigned
                                                        </span>
                                                      ) : notes.status ===
                                                        "RSL" ? (
                                                        <span>
                                                          <img src={RESOLVED} />
                                                          &nbsp; Resolved
                                                        </span>
                                                      ) : notes.status ===
                                                        "INP" ? (
                                                        <span>
                                                          {" "}
                                                          <img
                                                            src={INPROGRESS}
                                                          />
                                                          &nbsp; In-Progress
                                                        </span>
                                                      ) : notes.status ===
                                                        "CLD" ? (
                                                        <span>
                                                          <img src={CLOSED} />
                                                          &nbsp; Closed
                                                        </span>
                                                      ) : (
                                                        ""
                                                      )}
                                                    </span>
                                                  </div>
                                                </p>
                                                <p>
                                                  {worknoteEditId ==
                                                  notes.id ? (
                                                    <input
                                                    // id="myInput"
                                                      type="textarea"
                                                      rows="3"
                                                      name="work_notesEdit"
                                                      style={{
                                                        border: "none",
                                                        outline: "none",
                                                      }}
                                                      value={notes.note}
                                                      id="afterfocus"
                                                    ></input>
                                                  ) : (
                                                    <p
                                                      style={{
                                                        lineHeight: "0",
                                                        fontWeight: 500,
                                                        fontSize: "16px",
                                                        marginBottom: "-7px",
                                                      }}
                                                    >
                                                      {notes.note}
                                                    </p>
                                                  )}
                                                  <br />
                                                  <hr />
                                                </p>
                                              </Media>
                                            </Media>
                                          );
                                        })}
                                    </>
                                  )}
                                </Col>
                              </Card>
                            </>
                          </Col>
                        </div>
                        <div className="chat-message clearfix">
                          <Row>
                            <Col xl="12" className="d-flex">
                              <InputGroup className="text-box">
                                <Input
                                  type="text"
                                  className="form-control input-txt-bx"
                                  placeholder="Type here......"
                                  name="work_notes"
                                  id="myInput"
                                  onChange={handleChange}
                                />
                                <InputGroupAddon addonType="append">
                                  <Button
                                    color="primary"
                                    onClick={handleSaveWorkNotes}
                                    disabled={
                                      loaderSpinneer1
                                        ? loaderSpinneer1
                                        : loaderSpinneer1
                                    }
                                  >
                                    {loaderSpinneer1 ? (
                                      <Spinner size="sm"> </Spinner>
                                    ) : null}

                                    {"Save"}
                                  </Button>
                                </InputGroupAddon>
                              </InputGroup>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <br />
          <br />
          <button
            type="submit"
            name="submit"
            class="btn btn-primary"
            onClick={() => {
              handleUpdate();
              // handleSubmit();

            }}
            id="update_button"
            disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
          >
            {loaderSpinneer ? <Spinner size="sm"> </Spinner> : null}
            Update
          </button>
          &nbsp; &nbsp;
          <button
            type="button"
            name="submit"
            class="btn btn-secondary"
            onClick={props.dataClose}
            id="resetid"
          >
            Cancel
          </button>
        </Form>
        <br />
      </Container>
      <>
        {otpverify && (
          <Modal isOpen={otpverify} toggle={OTpverifytoggle} centered   backdrop="static">
              <div style={{ textAlign: "right", 
  
  textAlign: "end",
  marginTop:"20px",
  marginRight:"20px" 
}}>
  <i
    className="icon-close"
    style={{ cursor: "pointer", fontWeight: 500 }}
    onClick={(e) => {
      // setOtpverifyforrefund(!otpverifyforrefund);
      setOtpverify(!otpverify);
            props.dataClose();
    }}
  ></i>
</div>
            <ModalBody>
              <p>
                <Resendcode
                  leadForSubmit={ticektData}
                  handleSubmit={handleSubmit}
                  OTpverifytoggle={OTpverifytoggle}
                />
              </p>
            </ModalBody>
          </Modal>
        )}
      </>

      <>
        {otpverifyforrefund && (
          <Modal isOpen={otpverifyforrefund} toggle={OTpverifytoggle} centered   backdrop="static">
              <div style={{ textAlign: "right", 
  
  textAlign: "end",
  marginTop:"20px",
  marginRight:"20px" 
}}>
  <i
    className="icon-close"
    style={{ cursor: "pointer", fontWeight: 500 }}
    onClick={(e) => {
      setOtpverifyforrefund(!otpverifyforrefund);
      props.dataClose();
    }}
  ></i>
</div>
            <ModalBody>
              <p>
                <Resendcodeforrefund
                  leadForSubmit={ticektData}
                  handleSubmit={handleSubmit}
                  OTpverifytoggle={OTpverifytoggleforrefund}
                />
              </p>
            </ModalBody>
          </Modal>
        )}
      </>
    </Fragment>
  );
};
export default Comaplint360;
