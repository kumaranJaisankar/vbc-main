import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "../../../../mui/accordian";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import AddTicket from "../../internaltickets/addticket";
import { TabContent, TabPane } from "reactstrap";
import Comaplint360 from "../../internaltickets/customer360complaints"
import {
  toggleDraftModal,
  closeDraftModal,
  togglePermissionModal,
  closePermissionModal,
  setPermissionModalText,
  setSelectedLeadForEdit,
  setSelectedLeadAdditionalInfo,
  setSelectedLeadCustomerLists,
} from "../../../../redux/internal-tickets/actions";
import { connect } from "react-redux";
import { classes } from "../../../../data/layouts";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import { CUSTOMER_LIST } from "../../../../utils/permissions";
import { helpdeskaxios } from "../../../../axios";
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const complaintsHeader = {
  id: "Complaint ID",
  category: "Category",
  sub_category: "Sub Category",
  status: "Status",
  created: "Created On",
  rating: "Rating"
};

const Complaints = ({ username, profileDetails, fetchComplaints }, props) => {
  const history = useHistory();
  const complaints = profileDetails?.tickets.map((item) => ({
    id: item?.id,
    open_for: item?.open_for,
    status: item?.status,
    category: item?.ticket_category.category,
    sub_category: item?.sub_category.name,
    created: item?.created,
    rating: item?.rating
  }));
  const [modal, setModal] = useState();
  // draft
  const [isDirty, setIsDirty] = useState(false);

  const {
    toggleDraftModal,
    selectedLeadForEdit,
    setSelectedLeadForEdit,
  } = props;

  // useEffect(() => {
  //   if(!!profileDetails)
  //   fetchComplaints(username);
  // }, [profileDetails]);


  const [expanded, setExpanded] = React.useState("panel2");
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [lead, setLead] = useState([]);
  const [data, setData] = useState([]);
  const[complaintData,setComplaintData]= useState({});
  console.log(complaintData, "lead")
  const [filteredData, setFiltereddata] = useState(data);
  //technician state
  const [techniciandata, setTechnicianData] = useState([])
  // show reassigned toggle
  const [staticToggle, setStaticToggle] = useState("off");
  const [istelShow, setTelIsShow] = React.useState(false);
  function staticIpToggle() {
    setStaticToggle(staticToggle === "off" ? "on" : "off");
    setTelIsShow(!istelShow);
  }
  const [formDataForSaveInDraft, setformDataForSaveInDraft] = useState({});

  //Api Call for Technician Comment
  useEffect(() => {
    helpdeskaxios
      .get(`/technician/list`)
      .then((res) => setTechnicianData(res.data));
  }, []);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    history.push(key);
  };

  const dispatch = useDispatch();

  const toggle = () => {
    setModal(!modal);
  };

  //draft customizers
  const closeCustomizer = (value) => {
    // draft
    if (isDirty && value) {
      toggleDraftModal();
    } else {
      handleCloseDraftModal();
    }
    setStaticToggle('off')
    setTelIsShow(false)
  };

  const openCustomizer = (type, id) => {
    if (id) {
      setLead(id);
    }
    // draft store value
    const getLocalDraftKey = localStorage.getItem("ticketDraftSaveKey");
    if (!!getLocalDraftKey) {
      const getLocalDraftData = localStorage.getItem(getLocalDraftKey);
      setLead(JSON.parse(getLocalDraftData));
    }
    setActiveTab1(type);
    setRightSidebar(true);
    if (rightSidebar) {
      document.querySelector(".customizer-content-complaint").classList.add("open");
    }
  };

  const setIsDirtyFun = (val) => {
    setIsDirty(val);
  };
  const handleCloseDraftModal = () => {
    // closeDraftModal();
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-content-complaint").classList.remove("open");
    localStorage.removeItem("ticket/");
    localStorage.removeItem("ticketDraftSaveKey");
    setIsDirty(false);
    setLead({});
  };

  const update = (newRecord) => {
    setData([newRecord, ...data]);
    closeCustomizer(false);
  };

  const detailsUpdate = (updatedata, isClose = true) => {
    setFiltereddata((prevFilteredData) =>
      prevFilteredData.map((data) =>
        data.id == updatedata.id ? updatedata : data
      )
    );
    if (isClose) {
      closeCustomizer(false);
    }
  };

  // useEffect(() => {
  //   helpdeskaxios.get(`create/options/ticket`).then((res) => {
  //     let tObj = {};
  //     console.log(res.data, "res.data")
  //     res.data.status.map(item => {
  //       tObj[item.id] = item.name
  //     })
  //     setTicketStatus(tObj);
  //     console.log(tObj, "tObj");
  //   })
  // }, [])

  const [leadForSubmit, updateSelectedLeadForSubmit] = useState([])
  console.log(leadForSubmit,"leadForSubmit1")
  const handleCellClick = (e) => {

    console.log(e.target.textContent, "hii");
    openCustomizer("3", e.target.textContent)
    helpdeskaxios.get(`get/customer/${e.target.textContent}/tickets`).then((res)=>{
      updateSelectedLeadForSubmit(res.data)
      setComplaintData(res.data)
      setSelectedLeadForEdit(res.data)
      console.log(res.data,"checkdata")
    })
  
  }


  return (
    <div>
      <div
        className="customizer-content-complaint customizer-contain"
        style={{
          borderTopLeftRadius: "20px",
          borderBottomLeftRadius: "20px",
        }}
      >
        <div className="tab-content" id="c-pills-tabContent">
          <div
            className="customizer-header"
            style={{
              border: "none",
              borderTopLeftRadius: "20px",
            }}
          >
            <br />
            <i className="icon-close" onClick={() => closeCustomizer(true)}></i>
            <br />
          </div>
          <div className="customizer-body custom-scrollbar">
            <TabContent activeTab={activeTab1}>
            <TabPane tabId="2">
                <div id="headerheading"> Add New Complaint  </div>
                {activeTab1 == "2" && (
                  <ul
                    className="layout-grid layout-types"
                    style={{ border: "none" }}
                  >
                    <li
                      data-attr="compact-sidebar"
                      onClick={(e) => handlePageLayputs(classes[0])}
                    >
                      <div className="layout-img">
                        <AddTicket
                          dataClose={closeCustomizer}
                          onUpdate={(data) => update(data)}
                          rightSidebar={rightSidebar}
                          // draft passing data
                          setIsDirtyFun={setIsDirtyFun}
                          setformDataForSaveInDraft={setformDataForSaveInDraft}
                          lead={lead}
                          //calling reset after draft
                          setLead={setLead}
                          openforcustomer={username}
                          fetchComplaints={fetchComplaints}
                        />
                      </div>
                    </li>
                  </ul>
                )}
              </TabPane>
              <TabPane tabId="3">
                <div id="headerheading">
                  {" "}
                 {console.log( selectedLeadForEdit,"selectedLeadForEdit123")}
                  Complaint Information : {leadForSubmit?.id}
                </div>
                {console.log(leadForSubmit,"leadForSubmit99")}

                {activeTab1 == "3" && (
                  <Comaplint360
                  onUpdate={(data, isClose) =>
                        detailsUpdate(data, isClose)
                      }
                      dataClose={closeCustomizer}
                      openCustomizer={openCustomizer}
                      setTechnicianData={setTechnicianData}
                      techniciandata={techniciandata}
                      istelShow={istelShow}
                      staticToggle={staticToggle}
                      staticIpToggle={staticIpToggle}
                      leadForSubmit1={leadForSubmit}
                      rightSidebar={rightSidebar}
                      complaintData={complaintData}
                      setStaticToggle={setStaticToggle}
                      setTelIsShow={setTelIsShow}
                      fetchComplaints={fetchComplaints}
                  />
                )}
              </TabPane>
            </TabContent>
          </div>
        </div>
      </div>

      <Accordion
        style={{
          borderRadius: "15px",
          boxShadow: "0 0.2rem 1rem rgba(0, 0, 0, 0.15)",
        }}
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >


          <Typography variant="h6" className="customerdetailsheading">
            Complaints
          </Typography>
              {/* Sailaja  modified marginLeft Style for New Complaints Button on 6th March 2023 */}
          <p style={{ marginLeft: "45%", fontSize: "13px", fontWeight: "600", fontFamily: "Open Sans", position: "relative", top: "7px" }}>Overall Rating : {profileDetails?.overall_rating}</p>
          {token.permissions.includes(CUSTOMER_LIST.NEW_COMPLAINT) && (

            <Button
              variant="outlined"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                openCustomizer("2");
              }}
              id="new_complaints"
              style={{ whiteSpace: "nowrap" }}
            >
              {/* Sailaja Added  whiteSpace style for New Complaints Button on 6th March 2023 */}
              New Complaint
            </Button>
          )}
        </AccordionSummary>

        <AccordionDetails>
          {complaints?.length > 0 ? (
            <TableContainer>

              <Table aria-label="simple table">
                <TableHead sx={{ background: "rgba(196, 196, 196, 0.15)", fontFamily: "Open Sans", fontWeight: "400", fontSize: "14px" }}>
                  <TableRow>
                    {Object.values(complaintsHeader).map((item, key) => (
                      <TableCell
                        key={key}
                        sx={{ borderBottom: 0, padding: "5px 16px" }}
                      >
                        {item}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {complaints?.map((complaint, row) => (
                    <TableRow
                      key={complaint.id}
                      sx={{ "td, th": { border: 0 } }}
                    >
                      <TableCell align="left" onClick={handleCellClick}><a id="columns_alignment"
                      className="openmodal">
                         <span id="columns_alignment" className="openmodal">{complaint?.id}</span>
                        </a></TableCell>
                      <TableCell align="left">{complaint?.category}</TableCell>
                      <TableCell align="left">
                        {complaint?.sub_category}
                      </TableCell>
                      <TableCell align="left">

                        {complaint?.status === "OPN" ? (
                          <span>Open</span>

                        ) : complaint?.status === "ASN" ? (
                          <span>Assigned</span>
                        ) : complaint.status === "RSL" ? (
                          <span>Resolved</span>

                        ) : complaint?.status === "INP" ? (
                          <span>In-Progress</span>

                        ) : complaint?.status === "CLD" ? (
                          <span>Closed</span>

                        ) : (
                          ""
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {moment(complaint?.created).format("DD MMM YYYY")}
                      </TableCell>
                      <TableCell align="left">
                        {complaint?.rating === "VP" ? (
                          <span><StarIcon style={{ color: "#FFD700" }} /><StarOutlineIcon /><StarOutlineIcon /><StarOutlineIcon /><StarOutlineIcon /></span>

                        ) : complaint?.rating === "P" ? (
                          <span><StarIcon style={{ color: "#FFD700" }} /><StarIcon style={{ color: "#FFD700" }} /><StarOutlineIcon /><StarOutlineIcon /><StarOutlineIcon /></span>
                        ) : complaint.rating === "AVG" ? (
                          <span><StarIcon style={{ color: "#FFD700" }} /><StarIcon style={{ color: "#FFD700" }} /><StarIcon style={{ color: "#FFD700" }} /><StarOutlineIcon /><StarOutlineIcon /></span>

                        ) : complaint?.rating === "GD" ? (
                          <span><StarIcon style={{ color: "#FFD700" }} /><StarIcon style={{ color: "#FFD700" }} /><StarIcon style={{ color: "#FFD700" }} /><StarIcon style={{ color: "#FFD700" }} /><StarOutlineIcon /></span>

                        ) : complaint?.rating === "VG" ? (
                          <span><StarIcon style={{ color: "#FFD700" }} /><StarIcon style={{ color: "#FFD700" }} /><StarIcon style={{ color: "#FFD700" }} /><StarIcon style={{ color: "#FFD700" }} /><StarIcon style={{ color: "#FFD700" }} /></span>

                        ) : (
                          <span><StarOutlineIcon /><StarOutlineIcon /><StarOutlineIcon /><StarOutlineIcon /><StarOutlineIcon /></span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow>

                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            "No Complaints"
          )}
        </AccordionDetails>

      </Accordion>
    </div>
  );
};


const mapStateToProps = (state) => {
  const {
    openDraftModal,
    openPermissionModal,
    permissionModalText,
    selectedLeadForEdit,
  } = state.InternalTickets;
  return {
    openDraftModal,
    openPermissionModal,
    permissionModalText,
    selectedLeadForEdit,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    toggleDraftModal: () => dispatch(toggleDraftModal()),
    closeDraftModal: () => dispatch(closeDraftModal()),
    togglePermissionModal: () => dispatch(togglePermissionModal()),
    closePermissionModal: () => dispatch(closePermissionModal()),
    setPermissionModalText: (payload) =>
      dispatch(setPermissionModalText(payload)),
    setSelectedLeadForEdit: (payload) =>
      dispatch(setSelectedLeadForEdit(payload)),
    setSelectedLeadAdditionalInfo,
    setSelectedLeadAdditionalInfo: (payload) =>
      dispatch(setSelectedLeadAdditionalInfo(payload)),
    setSelectedLeadCustomerLists: (payload) =>
      dispatch(setSelectedLeadCustomerLists(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Complaints);
