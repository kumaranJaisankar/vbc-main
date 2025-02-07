import React, { Fragment, useEffect, useState, useRef } from "react";
import moment from "moment";
import {
  Container, Row, Col, Form, Label,
  Card, CardBody, Media, Modal, ModalFooter, FormGroup, ModalBody, Button, ModalHeader, Spinner, Input, InputGroup, InputGroupAddon,
} from "reactstrap";
import { UserPlus } from "react-feather";
import get from "lodash/get";
import { Typeahead } from "react-bootstrap-typeahead";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import Resendcode from "./resendcode";
import Resendcodeforrefund from "./resendcodeforrefund";
import {
  setSelectedLeadForEdit,
  updateSelectedLeadForSubmit,
  setSelectedLeadAdditionalInfo,
  setSelectedLeadCustomerLists,
} from "../../../redux/internal-tickets/actions";
import NewComplaintAdding from "./NewComplaitAdding"
import { adminaxios, networkaxios, helpdeskaxios } from "../../../axios";
import AddNetwork from "./addnetwork";
import EditIcon from "@mui/icons-material/Edit";
import { HELP_DESK } from "../../../utils/permissions";
import OPEN from "../../../assets/images/open.png";
import RESOLVED from "../../../assets/images/res.png";
import INPROGRESS from "../../../assets/images/inp.png";
import CLOSED from "../../../assets/images/cls.png";
import ASSIGNED from "../../../assets/images/asn.png";
// import WATCHLIST from "../../../assets/images/watchlist.png"

// Sailaja imported common component Sorting on 29th March 2023
import { Sorting } from "../../common/Sorting";


var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
const TicketDetails = (props) => {
  const {
    selectedLeadForEdit,
    leadForSubmit,
    updateSelectedLeadForSubmit,
    setSelectedLeadAdditionalInfo,
    workNotes,
    worknoteActivities,
    customerDetails,
    selectedWatchList,
    workNotesEdit,
    setErrors,
  } = props;

  const [defaultActiveKeyWorkNote, setDefaultActiveKeyWorkNote] = useState("0");
  const [defaultActiveKeyCustomers, setDefaultActiveKeyCustomers] =
    useState("0");
  const [assigntoselected, setAssigntoselected] = useState([]);
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [noteEdit, setNoteEdit] = useState(true);
  const [expanded1, setexpanded1] = useState(false);
  const [expanded2, setexpanded2] = useState(false);
  const [ticketCategory, setTicketCategory] = useState([]);
  const [ticketSubcategory, setTicketSubcategory] = useState([]);
  const [prioritySla, setPrioritySla] = useState([]);
  const [ticketStatus, setTicketStatus] = useState([]);
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [assignToFilter, setAssignToFilter] = useState([]);
  const [selectedWatchlistAddUser, setselectedWatchlistAddUser] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  const [otpverify, setOtpverify] = useState(false);
  const [otpverifyforrefund, setOtpverifyforrefund] = useState(false);
  const [worknoteEditId, setWorknoteEditId] = useState();
  const [worknoteState, setWorknoteState] = useState([]);
  // oltlist
  const [oltList, setOltList] = useState([]);
  // dplist
  const [dplist, setDpList] = useState([]);
  // port list
  const [portlist, setPortList] = useState([]);
  // nas
  const [nasList, setNaList] = useState([]);
  const [loaderSpinneer, setLoaderSpinner] = useState(false);
  const [loaderSpinneer1, setLoaderSpinner1] = useState(false);
  const [macAddress, setMacAddress] = useState('');
  const [macAddressParts, setMacAddressParts] = useState(['', '', '', '', '', '']);
  const [separator, setSeparator] = useState(':'); // State to store the separator choice (default: colon)

  const OTpverifytoggle = () => setOtpverify(!otpverify);
  useEffect(() => {
    setIsEditDisabled(true);
    updateSelectedLeadForSubmit(leadForSubmit);
    const delimiter = /[:\-]/;
    setMacAddressParts(leadForSubmit?.mac_id?.split(delimiter)?leadForSubmit?.mac_id?.split(delimiter) :['', '', '', '', '', ''])
  }, [selectedLeadForEdit]);

  const OTpverifytoggleforrefund = () => setOtpverifyforrefund(!otpverifyforrefund);
  useEffect(() => {
    setIsEditDisabled(true);
    updateSelectedLeadForSubmit(leadForSubmit);
    const delimiter = /[:\-]/;
    setMacAddressParts(leadForSubmit?.mac_id?.split(delimiter)?leadForSubmit?.mac_id?.split(delimiter) :['', '', '', '', '', ''])
  }, [selectedLeadForEdit]);
  


  useEffect(() => {

    getUpdatedNotes(leadForSubmit.id)

  }, [selectedLeadForEdit, updateSelectedLeadForSubmit]);


  const getUpdatedNotes = () => {
    if (leadForSubmit && leadForSubmit.id) {
      helpdeskaxios
        .get("ticket/" + leadForSubmit.id + "/worknote")
        // .get("ru/" + selectedLeadForEdit.id + "/worknote")
        .then((res) => {
          setWorknoteState(res.data.work_notes,
          )
          console.log(worknoteState, "checkstatee")
          setSelectedLeadAdditionalInfo({
            worknoteActivities: res.data.work_notes,
          });
          updateSelectedLeadForSubmit({
            ...leadForSubmit,
            worknoteActivities: worknoteActivities
          });
        });
    }
  }


  // useEffect(() => {
  //   if (selectedLeadForEdit && selectedLeadForEdit.id) {
  //     helpdeskaxios
  //       .get("ru/" + selectedLeadForEdit.id + "/worknote")
  //       .then((res) => {
  //         setSelectedLeadAdditionalInfo({
  //           worknoteActivities: res.data.work_notes,
  //         });
  //       });
  //   }
  // }, [selectedLeadForEdit]);
  useEffect(() => {
    if (selectedLeadForEdit && selectedLeadForEdit.ticket_category.id) {
      helpdeskaxios
        .get(`sub/ticketcategory/${selectedLeadForEdit.ticket_category.id}`)
        .then((res) =>
        //  setTicketSubcategory(res.data));
        // Sailaja sorting the Complaints -> Sub Category Dropdown data as alphabetical order on 29th March 2023
        setTicketSubcategory(Sorting((res.data),'name')));
    }
  }, [selectedLeadForEdit]);

  const handleChange = (e) => {
    const { assigned_to } = leadForSubmit;
    if (
      e.target.name == "ticket_category" ||
      e.target.name == "sub_category" ||
      e.target.name == "priority_sla"
    ) {
      updateSelectedLeadForSubmit({
        [e.target.name]: { id: e.target.value },
      });
    } else {
      if (e.target.name == "assigned_to") {
        setAssigntoselected(e.target.value);
        //         updateSelectedLeadForSubmit((prevData) =>
        //     !assigned_to ?
        //         { ...prevData, [e.target.name]: e.target.value, status: { id: "ASN" } } :
        //         { ...prevData, [e.target.name]: e.target.value, assigned_to: { id: e.target.value } }
        // )
        updateSelectedLeadForSubmit(() => {
          if (!assigned_to) {
            return { [e.target.name]: e.target.value, status: "ASN" };
          } else {
            return {
              [e.target.name]: e.target.value,
              assigned_to: { id: e.target.value },
              // status: {id: "ASN",
              // name: "Assigned"
              // }
            };
          }
        });
      } else {
        updateSelectedLeadForSubmit({ [e.target.name]: e.target.value });
      }
    }
    if (e.target.name == "assigned_to") {
      updateSelectedLeadForSubmit({
        assigned_to: { id: e.target.value },
        status: "ASN",
      });
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

    // if(e.target.name == "ticket_category"){
    //   getsubCategory(e.target.value)
    // }
  };

  const handleChangeWorkNotes = (e) => {
    e.persist();
    const { value } = e.target;
    setSelectedLeadAdditionalInfo({ workNotes: value });
  };

  const handleChangeWorkNotesEdit = (e, id) => {
    e.persist();
    const { value } = e.target;
    let worknoteActivitiesNew = [...worknoteActivities];
    let worknote = worknoteActivitiesNew.find((w) => w.id == id);
    let worknoteIndex = worknoteActivitiesNew.findIndex((w) => w.id == id);

    worknote.note = value;
    worknoteActivitiesNew[worknoteIndex] = worknote;

    setSelectedLeadAdditionalInfo({
      worknoteActivities: [...worknoteActivitiesNew],
    });
  };

  const handleChangeWorkNotesDelete = (e, id) => {
    e.persist();

    let worknoteActivitiesNew = [...worknoteActivities];
    let worknotes = worknoteActivitiesNew.filter((w) => w.id !== id);

    setSelectedLeadAdditionalInfo({ worknoteActivities: [...worknotes] });
  };

  const handleSaveWorkNotes = (multiple) => {
    setLoaderSpinner1(true);
    const { workNotes } = props;
    var worknote = {};
    // console.log(leadForSubmit,"leadForSubmit")
    if (multiple === true) {
      worknote = {
        work_notes: [...worknoteActivities],
      };
    } else {
      worknote = {
        // work_notes: [
        // {
        note: workNotes,
        status: leadForSubmit.status,
        // created_by: JSON.parse(localStorage.getItem("token"))?.id,
        // },
        // ],
      };
    }

    helpdeskaxios
      .post("ru/" + leadForSubmit.id + "/worknote", worknote)
      .then((res) => {
        getUpdatedNotes()
        // props.onUpdate(leadForSubmit);
        // props.dataClose();
        setLoaderSpinner1(false);
        // setWorknoteState([]);
        // setWorknoteState({
        //   workNotes: "",
        //   worknoteActivities: [],
        //   selectedWatchList: [],
        // });
        if (multiple === true) {
          setSelectedLeadAdditionalInfo({
            workNotes: "",
            // worknoteActivities: [...worknoteActivities, ...res.data.work_notes],
          });
        } else {
          setSelectedLeadAdditionalInfo({
            workNotes: "",
            worknoteActivities: [...worknoteActivities, ...res.data.work_notes],
          });
        }

        props.onUpdate(
          {
            ...leadForSubmit,
            work_notes: res.data.work_notes,
          },
          false
        );
      }).catch((error) => {
        setLoaderSpinner1(false);
      })
    setDefaultActiveKeyWorkNote("1");


    // updateSelectedLeadForSubmit(leadForSubmit)
    setexpanded1(true);
  };

  useEffect(() => {
    helpdeskaxios
      .get("create/options/ticket")
      .then((res) => {
        let { category, priority_sla, status } = res.data;
        setTicketCategory([...category]);
        // setTicketSubcategory([...subcategory]);
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

  // patch api for ticekt detils update
  const handleSubmit = (e, id) => {
    console.log(leadForSubmit,"leadForSubmit")
    setLoaderSpinner(true);
    e && e.preventDefault();
    let openybyId = get(leadForSubmit.opened_by, "id", leadForSubmit.opened_by);
    let assinegtodata = get(
      leadForSubmit.assigned_to,
      "id",
      leadForSubmit.assigned_to
    );

    let technicianId = get(leadForSubmit.technician_comment, 'id', leadForSubmit.technician_comment)
    console.log(technicianId, "technicianId")
    const worknoteIds = worknoteActivities.map((worknote) => worknote.id);
    if (worknoteEditId) handleSaveWorkNotes(true);
    let category = ticketCategory.find(
      (c) => c.id == leadForSubmit.ticket_category.id
    );

    const oltobj = oltList.find((t) => t.id == leadForSubmit.olt);
    const dpobj = dplist.find((d) => d.id == leadForSubmit.dp);
    const portobj = portlist.find((p) => p.id == leadForSubmit.port);
    const nasobj = nasList.find((n) => n.id == leadForSubmit.nas);
    let leaddata = {
      ...leadForSubmit,

      ticket_category: {
        ...category,
      },
      sub_category: {
        id: leadForSubmit.sub_category.id,
        name: leadForSubmit.sub_category.name,
      },
      opened_by: openybyId,
      work_notes: [...worknoteIds],
      assigned_to: assinegtodata,
      priority_sla: {
        id: leadForSubmit.priority_sla.id,
        name: leadForSubmit.priority_sla.name,
      },



      technician_comment: technicianId ? {
        id: technicianId

      } : null,

      // open_date: moment().format("YYYY-MM-DDThh:mm"),
      // assigned_date: moment().format("YYYY-MM-DDThh:mm"),
      network_info: {
        extension_no: leadForSubmit.extension_no,
        serial_no: leadForSubmit.serial_no,
        onu_mac: leadForSubmit.onu_mac,
        nas: { ...nasobj },
        olt: { ...oltobj },
        dp: { ...dpobj },
        port: { ...portobj },
      },
      assigned_by:
        leadForSubmit.status === "ASN"
          ? JSON.parse(localStorage.getItem("token"))?.id
          : selectedLeadForEdit.assigned_by?.id,
      inprogress_by:
        leadForSubmit.status === "INP"
          ? JSON.parse(localStorage.getItem("token"))?.id
          : selectedLeadForEdit.inprogress_by?.id,
      resolved_by:
        leadForSubmit.status === "RSL"
          ? JSON.parse(localStorage.getItem("token"))?.id
          : selectedLeadForEdit.resolved_by?.id,
      closed_by:
        leadForSubmit.status === "CLD"
          ? JSON.parse(localStorage.getItem("token"))?.id
          : selectedLeadForEdit.assigned_by?.id,
          mac_id:macAddressParts.join(separator)
    };

    delete leaddata.open_date;
    delete leaddata.assigned_date;
    delete leaddata.extension_no;
    delete leaddata.serial_no;
    delete leaddata.onu_mac;
    delete leaddata.nas;
    delete leaddata.olt;
    delete leaddata.dp;
    delete leaddata.port;
    delete leaddata.department;
    leaddata.watchlists = selectedWatchList.map((user) => {
      return { user: user.id };
    });

    helpdeskaxios
      .patch("enh/" + selectedLeadForEdit.id , leaddata)
      .then((res) => {
        setLoaderSpinner(false);
        setMacAddressParts(['', '', '', '', '', ''])
        // Sailaja Modified Complaints Module updated closed ticket Toast message from update successfully to Updated successfully on 28th March 2023
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
  const editClicked = (e) => {
    e.preventDefault();
    setIsEditDisabled(false);
  };

  const worknoteEdit = (e) => {
    e.preventDefault();
    setNoteEdit(false);
  };

  const handleAccordionWorkNotes = () => {
    setexpanded1(!expanded1);
    const toggleValue = defaultActiveKeyWorkNote === "0" ? "1" : "0";
    setDefaultActiveKeyWorkNote(toggleValue);
  };

  const handleAccordionCustomer = () => {
    setexpanded2(!expanded2);
    const toggleValue = defaultActiveKeyCustomers === "0" ? "1" : "0";
    setDefaultActiveKeyCustomers(toggleValue);
  };
  // const franchId = JSON.parse(localStorage.getItem("token"))?.franchise?.id
  // ? JSON.parse(localStorage.getItem("token"))?.franchise?.id
  // : 0;
  // const branchId = JSON.parse(localStorage.getItem("token"))?.branch?.id
  //   ? JSON.parse(localStorage.getItem("token"))?.branch?.id
  //   : 0;

  useEffect(() => {
    adminaxios.get(`accounts/staff`).then((res) => {
      // setAssignedTo(res.data);
    // Sailaja sorting the Complaints(Edit) -> Assigned To * Dropdown data as alphabetical order on 29th March 2023
      setAssignedTo(Sorting((res.data),'username'));

    });

  }, []);

  const handleCancelAction = () => {
    props.dataClose();
    setSelectedLeadForEdit({});
    updateSelectedLeadForSubmit({});
    setSelectedLeadAdditionalInfo({
      workNotes: "",
      worknoteActivities: [],
      selectedWatchList: [],
    });
  };

  const handleChangeSelectedWatchlist = (selected) => {
    setSelectedLeadAdditionalInfo({
      workNotes: "",
      selectedWatchList: selected,
    });
  };

  const handleAddWatchlist = () => {
    setSelectedLeadAdditionalInfo({
      selectedWatchList: [...selectedWatchList, ...selectedWatchlistAddUser],
    });
    Verticalcentermodaltoggle();
  };

  const Verticalcentermodaltoggle = () => setVerticalcenter(!Verticalcenter);

  const handleUpdate = (e) => {
    if (
      leadForSubmit.status === "CLD" &&
      leadForSubmit.ticket_category.id == 4
    ) {
      console.log("ticketstatus");
      OTpverifytoggle();
    }
    // console.log(leadForSubmit.ticket_category,"ticket_category")
    if (
      leadForSubmit.status === "CLD" &&
      leadForSubmit.ticket_category.category === "Provisioning_for_refund"
    ) {
      console.log("ticketstatus");
      OTpverifytoggleforrefund();
    }
    
    // leadForSubmit.status === "CLD" && OTpverifytoggle();
  };

  // auto populate
  useEffect(() => {
    adminaxios
      .get(
        "accounts/user/" +
        leadForSubmit.assigned_to?.id +
        "/details/ticket/populate"
      )
      .then((res) => {
        let department = [];
        if (res.data.department) {
          res.data.department.forEach((dept) => {
            // department = department + dept.name + ",";
            department.push(dept.name);
          });
        }
        let branch = "";
        if (res.data.branch) {
          branch = res.data.branch.name;
        }
        updateSelectedLeadForSubmit({
          ...leadForSubmit,
          department: department.join(","),
          branch: branch,
        });
      });
  }, [leadForSubmit.assigned_to?.id]);

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
  // const [macAddressParts, setMacAddressParts] = useState(['', '', '', '', '', '']);

  // // Function to handle input change for each box
  // const handlePartChange = (event, index) => {
  //   const { value } = event.target;
  //   if (/^[0-9A-Fa-f]{0,2}$/.test(value)) {
  //     // If the input is valid, update the corresponding part in the state
  //     const newParts = [...macAddressParts];
  //     newParts[index] = value.toUpperCase(); // Convert to uppercase
  //     setMacAddressParts(newParts);
      
  //     // Move focus to the next input box if needed
  //     if (value.length === 2 && index < 5) {
  //       document.getElementById(`part-${index + 1}`).focus();
  //     }
  //   }
  // };
  // const [macAddress, setMacAddress] = useState(''); // Initialize with an empty Mac address

  // Function to handle input change

  // Function to handle input change for each box
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
      }
      else if (value === '' && index > 0) {
        // If Backspace is pressed and the input is empty, move focus to the previous input box
        document.getElementById(`part-${index - 1}`).focus();
      }
    }
  };
  const handleSeparatorChange = (event) => {
    setSeparator(event.target.value);
  };
  // const handleMacAddressChange = (event) => {
  //   // Get the raw input value
  //   let inputValue = event.target.value;

  //   // Remove any non-hexadecimal characters (e.g., colons, spaces)
  //   if (event.target.value.length >= 1){
  //     inputValue = inputValue.replace(/[^0-9A-Fa-f]/g, '');

  //     // Add colons in the desired format
  //     const formattedMacAddress = inputValue
  //       .match(/.{1,2}/g) // Split the string into pairs of two characters
  //       .join(':'); // Join the pairs with colons
  //       setMacAddress(formattedMacAddress);
  //   }else{
  //     const formattedMacAddress = inputValue
  //     setMacAddress(formattedMacAddress);
  //   }
    
   
  // };
  // reset

  const resetformmanually = () => {
    updateSelectedLeadForSubmit({
      onu_mac: "",
    });
    document.getElementById("resetid").click();
  };
  // useEffect(()=>{
  //   if(props.openCustomizer){
  //     setErrors({});
  //   }
  // }, [props.openCustomizer]);
  const form = useRef(null);

  // subcatgory list api call

  // const getsubCategory = (val)=>{
  //   helpdeskaxios.get(`sub/ticketcategory/${val}`)
  //   .then((res) =>setTicketSubcategory(res.data))
  // }

  // const tokenInfo = JSON.parse(localStorage.getItem("token"));
  // let Showpassword = false;
  // if (
  //   (tokenInfo && tokenInfo.user_type === "Staff") 
  // ) {
  //   Showpassword = true;
  // }
  return (
    <Fragment>
      <div>
        <Row>
          {token.permissions.includes(HELP_DESK.UPDATE) && (
            <EditIcon
              className="icofont icofont-edit"
              style={{ top: "8px", right: "64px" }}
              onClick={editClicked}
            // disabled={isDisabled}
            />
          )}
        </Row>
      </div>
      <br />
      <Container fluid={true} style={{ marginTop: "10px" }}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            !otpverify && !otpverifyforrefund && handleSubmit(e);
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
                    type="datetime"
                    name="meeting-time"
                    value={moment(
                      leadForSubmit && leadForSubmit.open_date
                    ).format("l LT")}
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
                      leadForSubmit &&
                      leadForSubmit.opened_by &&
                      leadForSubmit.opened_by.username
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
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="branches"
                    style={{ border: "none", outline: "none" }}
                    // value={
                    //   leadForSubmit &&
                    //   leadForSubmit.branches &&
                    //   leadForSubmit.branches.name
                    // }
                    value={leadForSubmit.branch}
                    onChange={handleChange}
                    id="afterfocus"
                    disabled={true}
                  ></input>
                  <Label className="placeholder_styling">Branch</Label>
                </div>
              </FormGroup>
            </Col> */}
            {/* <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Department</Label>
                  <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="departments"
                    style={{ border: "none", outline: "none" }}
                    // value={
                    //   leadForSubmit &&
                    //   leadForSubmit.departments &&
                    //   leadForSubmit.departments.name
                    // }
                    value={leadForSubmit.department}
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
                    value={
                      leadForSubmit &&
                      leadForSubmit.ticket_category &&
                      leadForSubmit.ticket_category.id
                    }
                    // onChange={handleChange}
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    disabled={true}
                  >
                    {ticketCategory.map((categories) => {
                      if (
                        !!categories &&
                        leadForSubmit &&
                        leadForSubmit.ticket_category
                      ) {
                        return (
                          <option
                            key={categories.id}
                            value={categories.id}
                            selected={
                              categories.id == leadForSubmit.ticket_category.id
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
                      leadForSubmit &&
                      leadForSubmit.sub_category &&
                      leadForSubmit.sub_category.id
                    }
                    onChange={handleChange}
                    disabled={isEditDisabled}
                  >
                    {ticketSubcategory.map((subcategories) => {
                      if (
                        !!subcategories &&
                        leadForSubmit &&
                        leadForSubmit.sub_category
                      ) {
                        return (
                          <option
                            key={subcategories.id}
                            value={subcategories.id}
                            selected={
                              subcategories.id == leadForSubmit.sub_category.id
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
                    value={
                      leadForSubmit &&
                      leadForSubmit.priority_sla &&
                      leadForSubmit.priority_sla.id
                    }
                    onChange={handleChange}
                    disabled={isEditDisabled}
                  >
                    {prioritySla.map((prioritysla) => {
                      if (
                        !!prioritysla &&
                        leadForSubmit &&
                        leadForSubmit.priority_sla
                      ) {
                        return (
                          <option
                            key={prioritysla.id}
                            value={prioritysla.id}
                            selected={
                              prioritysla.id == leadForSubmit.priority_sla.id
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
                    value={leadForSubmit && leadForSubmit.open_for}
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                </div>
              </FormGroup>
            </Col>

            {selectedLeadForEdit.status === "ASN" ||
              selectedLeadForEdit.status === "RSL" ||
              selectedLeadForEdit.status === "INP" ||
              selectedLeadForEdit.status === "CLD" ? (
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
                      value={
                        leadForSubmit &&
                          leadForSubmit.assigned_to &&
                          !!leadForSubmit.assigned_to.id
                          ? leadForSubmit &&
                          leadForSubmit.assigned_to &&
                          leadForSubmit.assigned_to.id
                          : ""
                      }
                      onChange={handleChange}
                      disabled={props?.istelShow ? false : true}
                    >
                      <option key="" value="">
                        {" "}
                        Select Below
                      </option>
                      {assignedTo.map((assignedto) => {
                        if (assignedto && leadForSubmit) {
                          return (
                            <option
                              key={assignedto && assignedto.id}
                              value={assignedto && assignedto.id}
                              selected={
                                leadForSubmit.assignedto &&
                                  assignedto.id == leadForSubmit &&
                                  leadForSubmit.assigned_to &&
                                  leadForSubmit.assigned_to.id
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
                      value={
                        leadForSubmit &&
                          leadForSubmit.assigned_to &&
                          !!leadForSubmit.assigned_to.id
                          ? leadForSubmit &&
                          leadForSubmit.assigned_to &&
                          leadForSubmit.assigned_to.id
                          : ""
                      }
                      onChange={handleChange}
                      disabled={isEditDisabled}
                    >
                      <option key="" value="">
                        {" "}
                        Select Below
                      </option>
                      {assignedTo.map((assignedto) => {
                        if (assignedto && leadForSubmit) {
                          return (
                            <option
                              key={assignedto && assignedto.id}
                              value={assignedto && assignedto.id}
                              selected={
                                leadForSubmit.assignedto &&
                                  assignedto.id == leadForSubmit &&
                                  leadForSubmit.assigned_to &&
                                  leadForSubmit.assigned_to.id
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
                      value={leadForSubmit && leadForSubmit.status}
                      onChange={handleChange}
                      disabled={isEditDisabled}
                    >
                      {(leadForSubmit?.status === "ASN" &&
                        selectedLeadForEdit?.status === "ASN") ||
                        (leadForSubmit?.status === "INP" &&
                          selectedLeadForEdit?.status === "INP") ||
                        (leadForSubmit?.status === "RSL" &&
                          selectedLeadForEdit?.status === "RSL") ? (
                        <>
                          <option value={selectedLeadForEdit.status}>
                            {selectedLeadForEdit.status_name}{" "}
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
                    value={leadForSubmit && leadForSubmit.status}
                    onChange={handleChange}
                    disabled={isEditDisabled}
                  >
                    {(leadForSubmit?.status === "OPN" &&
                      selectedLeadForEdit?.status === "OPN") ||
                      (leadForSubmit?.status === "INP" &&
                        selectedLeadForEdit?.status === "INP") ||
                      (leadForSubmit?.status === "RSL" &&
                        selectedLeadForEdit?.status === "RSL") ||
                        (leadForSubmit?.status === "CLD" &&
                        selectedLeadForEdit?.status === "CLD") 
                        ? (
                      <>
                        <option value={selectedLeadForEdit.status}>
                          {selectedLeadForEdit.status_name}{" "}
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
                    value={leadForSubmit && leadForSubmit.status}
                    onChange={handleChange}
                    disabled={isEditDisabled}
                  >
                    {(leadForSubmit?.status === "OPN" &&
                      selectedLeadForEdit?.status === "OPN") ||
                      (leadForSubmit?.status === "INP" &&
                        selectedLeadForEdit?.status === "INP") ||
                      (leadForSubmit?.status === "RSL" &&
                        selectedLeadForEdit?.status === "RSL") ? (
                      <>
                        <option value={selectedLeadForEdit.status}>
                          {selectedLeadForEdit.status_name}{" "}
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
                      value={leadForSubmit && leadForSubmit.status}
                      onChange={handleChange}
                      disabled={isEditDisabled}
                    >
                      {leadForSubmit?.status === "OPN" &&
                        selectedLeadForEdit?.status === "OPN" ||
                        (leadForSubmit?.status === "CLD" &&
                          selectedLeadForEdit?.status === "CLD") ||
                        (leadForSubmit?.status === "ASN" &&
                          selectedLeadForEdit?.status === "ASN") ? (
                        <>
                          <option value={selectedLeadForEdit.status}>
                            {selectedLeadForEdit.status_name}{" "}
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
                      value={leadForSubmit && leadForSubmit.status}
                      onChange={handleChange}
                      disabled={isEditDisabled}
                    >
                      {(leadForSubmit?.status === "OPN" &&
                        selectedLeadForEdit?.status === "OPN") ||
                        (leadForSubmit?.status === "INP" &&
                          selectedLeadForEdit?.status === "INP") ||
                        (leadForSubmit?.status === "RSL" &&
                          selectedLeadForEdit?.status === "RSL") ||
                        (leadForSubmit?.status === "CLD" &&
                          selectedLeadForEdit?.status === "CLD") ? (
                        <>
                          <option value={selectedLeadForEdit.status}>
                            {selectedLeadForEdit.status_name}{" "}
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
                      value={leadForSubmit && leadForSubmit.status}
                      onChange={handleChange}
                      disabled={isEditDisabled}
                    >
                      {ticketStatus.map((ticketstatus) => {
                        if (
                          !!ticketstatus &&
                          leadForSubmit &&
                          leadForSubmit.status
                        ) {
                          return (
                            <option
                              key={ticketstatus.id}
                              value={ticketstatus.id}
                              selected={
                                ticketstatus.id === leadForSubmit.status
                                  ? "selected"
                                  : ""
                              }
                            >
                              {ticketstatus.name}
                              {console.log(ticketstatus, "ticketstatus")}
                            </option>
                          );
                        }
                      })}
                    </select>
                  </div>
                </FormGroup>
              </Col>
            )}
            {leadForSubmit?.status === "CLD" ?
            <Col md="6">
              <Label className="kyc_label">Mac ID</Label>
              <FormGroup>
                
                <div className="input_wrap">
                  
                  {/* <input
                    className={`form-control digits not-empty`}
                    type="text"
                    name="open_for"
                    id="macAddress"
                    value={macAddress}
                    onChange={handleMacAddressChange}
                    placeholder="XX:XX:XX:XX:XX:XX"
                    maxLength="17"
                  ></input> */}
                    {macAddressParts?.map((part, index) => (
        <React.Fragment key={index}>
          <input
            type="text"
            id={`part-${index}`}
            value={part}
            onChange={(event) => handlePartChange(event, index)}
            maxLength="2"
            className="macIdInput"
            disabled={isEditDisabled}
          />
          {index < 5 && <span>{separator}</span>}
        </React.Fragment>
      ))}
         <select style={{marginLeft:"5px",borderRadius: "0.25rem"}}  value={separator} onChange={handleSeparatorChange}  disabled={isEditDisabled}>
          <option value=":">Colon</option>
          <option value="-">Dash</option>
        </select>
                </div>
              </FormGroup>
            </Col>
            :''}
            {token.permissions.includes(HELP_DESK.HELPDESK_TICKET_REASSIGN) &&
              <>
                {selectedLeadForEdit?.status === "OPN" ?
                "":   <Col>
                <div><b>ReAssign</b></div>
                <>
                  <div
                    className={`franchise-switch ${props?.staticToggle}`}
                    onClick={props?.staticIpToggle}
                  />
                </>
              </Col> 
                }
              </>
            }
            {/* <Col sm="3">
              <FormGroup>
                <div className="input_wrap">
                <Label className="kyc_label">Assigned Date *</Label>
                  <input
                    className={`form-control digits not-empty afterfocus`}
                    style={{ border: "none", outline: "none" }}
                    type="datetime-local"
                    id="meeting-times"
                    name="assigned_date"
                    onChange={handleChange}
                    value={moment().format("YYYY-MM-DDThh:mm")}
                    maxLength="15"
                    // value={
                    //   leadForSubmit &&
                    //   moment
                    //     .utc(leadForSubmit.assigned_date)
                    //     .format("YYYY-MM-DDThh:mm")
                    // }
                    disabled={true}
                  />
                 
                </div>
              </FormGroup>
            </Col>
            */}
          </Row>
          {leadForSubmit.status === "RSL" ?

            <NewComplaintAdding ticketCategory={ticketCategory} leadForSubmit={leadForSubmit}
              handleChange={handleChange} ticketSubcategory={ticketSubcategory} isEditDisabled={isEditDisabled} techniciandata={props.techniciandata} setTechnicianData={props.setTechnicianData} />
            : ""
          }
          {leadForSubmit.ticket_category.id == 3 &&
            selectedLeadForEdit.status === "ASN" ? (
            <>
              <Row>
                <Col>
                  <h6>Network Info:</h6>
                </Col>
              </Row>
              <Row>
                <>
                  {props && leadForSubmit ? (
                    <AddNetwork
                      lead={leadForSubmit}
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
          <br />
          <Row>
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
                  &nbsp;
                  <UserPlus
                    className="user-plus"
                    style={{ color: "#377DF6" }}
                  />
                  {/* <img src={WATCHLIST}/> */}
                </span>
              </Label>{" "}
              &nbsp;
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Typeahead
                open={false}
                id="multiple-typeahead"
                labelKey={"username"}
                name="watch_list"
                multiple
                selected={selectedWatchList}
                onChange={handleChangeSelectedWatchlist}
                options={assignedTo}
                value={leadForSubmit && leadForSubmit.watch_list}
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
                  <Button color="primary" onClick={handleAddWatchlist}>
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
                  <Label className="kyc_label">Customer Notes</Label>
                  <input
                    className={`form-control digits not-empty afterfocus`}
                    type="textarea"
                    name="customer_notes"
                    style={{ border: "none", outline: "none" }}
                    value={leadForSubmit && leadForSubmit.customer_notes}
                    onChange={handleChange}
                    id="afterfocus"
                    disabled={isEditDisabled}
                  ></input>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            {/* <Col>
              <p style={{ fontSize: "17px" }}>
                <b>Address</b>:{" "}
                <span>
                  {leadForSubmit.address.house_no ? leadForSubmit.address.house_no + "," :""}
                  <br />
                </span>
                <span style={{ position: "relative", left: "80px" }}>
                  {leadForSubmit.address
                    ? leadForSubmit.address.landmark + ","
                    : ""}
                  {leadForSubmit.address
                    ? leadForSubmit.address.street + ","
                    : ""}
                  <br />
                  {leadForSubmit.address
                    ? leadForSubmit.address.city + ","
                    : ""}
                  {leadForSubmit.address
                    ? leadForSubmit.address.district + ","
                    : ""}
                  <br />
                  {leadForSubmit.address
                    ? leadForSubmit.address.state + ","
                    : ""}
                  {leadForSubmit.address
                    ? leadForSubmit.address.country + ","
                    : ""}
                  {leadForSubmit.address ? leadForSubmit.address.pincode : ""}
                </span>
              </p>
            </Col> */}
          </Row>
          <Label className="kyc_label">Work Notes</Label>

          <Row>
            <Col className="call-chat-body">
              <Card>
                <CardBody className="p-0">
                  <Row className="chat-box">
                    <Col className="pr-0 chat-right-aside">
                      <div className="chat">
                        <div className="chat-header clearfix">
                          <div className="about">
                            <div className="name">{"Activity"}</div>
                            <div className="status digits">
                              {/* {selectedUser.online ? 'online' : selectedUser.lastSeenDate} */}
                            </div>
                          </div>
                        </div>
                        <div className="chat-history chat-msg-box custom-scrollbar">
                          {/* {worknoteState === 0 ? "noDATAAAA": */}
                          <Col className="call-chat-body">
                            <>

                              <Card>

                                <br />

                                <Col>
                                  {
                                    // leadForSubmit &&
                                    // worknoteActivities.
                                    worknoteState === 0 ?
                                      "No worknotes"
                                      // <Spinner size="lg" className="dashboard_spinner"> </Spinner>
                                      :
                                      <>
                                        {leadForSubmit &&
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
                                                      marginBottom: "6px"
                                                      // textTransform: "uppercase",
                                                    }}
                                                  >
                                                    {notes &&
                                                      notes.created_by_username}{" "}
                                                    &nbsp;&nbsp;
                                                    {/* <small> */}
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
                                                    &nbsp; &nbsp;
                                                    &nbsp;
                                                    <div style={{ textAlign: "end", position: "relative", top: "-25px" }}>
                                                      Status :    <span>
                                                        {notes.status === "OPN" ? (
                                                          <span>
                                                            <img src={OPEN} />
                                                            &nbsp; Open
                                                          </span>
                                                        ) : notes.status === "ASN" ? (
                                                          <span>
                                                            <img src={ASSIGNED} />
                                                            &nbsp; Assigned
                                                          </span>
                                                        ) : notes.status === "RSL" ? (
                                                          <span>
                                                            <img src={RESOLVED} />
                                                            &nbsp; Resolved
                                                          </span>
                                                        ) : notes.status === "INP" ? (
                                                          <span>
                                                            {" "}
                                                            <img src={INPROGRESS} />
                                                            &nbsp; In-Progress
                                                          </span>
                                                        ) : notes.status === "CLD" ? (
                                                          <span>
                                                            <img src={CLOSED} />
                                                            &nbsp;  Closed
                                                          </span>
                                                        ) : (
                                                          ""
                                                        )}

                                                        {/* Status : {notes.status} */}
                                                      </span>
                                                    </div>
                                                    {/* </small>   */}
                                                  </p>
                                                  <p>
                                                    {worknoteEditId == notes.id ? (
                                                      <input
                                                        type="textarea"
                                                        rows="3"
                                                        name="work_notesEdit"
                                                        style={{
                                                          border: "none",
                                                          outline: "none",
                                                        }}
                                                        value={notes.note}
                                                        onChange={(e) =>
                                                          handleChangeWorkNotesEdit(
                                                            e,
                                                            notes.id
                                                          )
                                                        }
                                                        id="afterfocus"
                                                      ></input>
                                                    ) : (
                                                      <p
                                                        style={{
                                                          lineHeight: "0",
                                                          fontWeight: 500,
                                                          fontSize: "16px",
                                                          marginBottom: "-7px",
                                                          // textTransform: "capitalize",

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
                                  }
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
                                  value={workNotes}
                                  onChange={handleChangeWorkNotes}
                                />
                                <InputGroupAddon addonType="append">
                                  <Button
                                    color="primary"
                                    onClick={handleSaveWorkNotes}
                                    disabled={loaderSpinneer1 ? loaderSpinneer1 : loaderSpinneer1}

                                  >
                                    {loaderSpinneer1 ? <Spinner size="sm"> </Spinner> : null}

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
              // handleSaveWorkNotes();
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

//  position: "relative",
//  left: "-32px",
//  top:"42px"
}}>
  <i
    className="icon-close"
    style={{ cursor: "pointer", fontWeight: 500 }}
    onClick={(e) => {
      setOtpverify(!otpverify);      props.dataClose();
    }}
  ></i>
</div>
            <ModalBody>
              <p>
                <Resendcode
                  leadForSubmit={leadForSubmit}
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
          <Modal isOpen={otpverifyforrefund} toggle={OTpverifytoggleforrefund} centered   backdrop="static">
            {/* <ModalBody/> */}
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
  {/* </ModalBody> */}
  <ModalBody>
              <p>
                <Resendcodeforrefund
                  leadForSubmit={leadForSubmit}
                  handleSubmit={handleSubmit}
                  OTpverifytoggle={OTpverifytoggleforrefund}
                  dataClose={props.dataClose}
                />
              </p>
            </ModalBody>
          </Modal>
        )}
      </>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  const {
    selectedLeadForEdit,
    leadForSubmit,
    workNotes,
    worknoteActivities,
    customerDetails,
    selectedWatchList,
    workNotesEdit,
  } = state.InternalTickets;
  return {
    selectedLeadForEdit,
    leadForSubmit,
    workNotes,
    worknoteActivities,
    customerDetails,
    selectedWatchList,
    workNotesEdit,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedLeadForEdit: (payload) =>
      dispatch(setSelectedLeadForEdit(payload)),
    setSelectedLeadAdditionalInfo: (payload) =>
      dispatch(setSelectedLeadAdditionalInfo(payload)),
    setSelectedLeadCustomerLists: (payload) =>
      dispatch(setSelectedLeadCustomerLists(payload)),
    updateSelectedLeadForSubmit: (payload) =>
      dispatch(updateSelectedLeadForSubmit(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TicketDetails);
