import React, { Fragment, useEffect, useState, useRef, useMemo } from "react";
import moment from "moment";
import { TicketFilterContainer } from "./TicketFilter/TicketFilterContainer";
import {
  Container, Row, Col, Card, Button, Modal, ModalHeader, ModalFooter, TabContent, TabPane, ModalBody,
} from "reactstrap";
// import Skeleton from "react-loading-skeleton";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { Spinner } from "reactstrap";
import KYCCIRCLE from "../../../assets/images/Customer-Circle-img/KycCircle.png";
import { downloadExcelFile, downloadPdf } from "./Export";
import { default as axiosBaseURL, helpdeskaxios, adminaxios, } from "../../../axios";
import Grid from "@mui/material/Grid";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import AddTicket from "./addticket";
import TicketDetails from "./ticketdetailsnew";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { ModalTitle, CopyText, Cancel, Close } from "../../../constant";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import { classes } from "../../../data/layouts";
import PermissionModal from "../../common/PermissionModal";
import DeleteModal from "./DeleteModal";
import DraftModal from "./DraftModal";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import Allfilter from "./allfilters"
import Tooltip from '@mui/material/Tooltip';
import Select from "@mui/material/Select";
import {
  toggleDraftModal,
  closeDraftModal,
  togglePermissionModal,
  closePermissionModal,
  setPermissionModalText,
  setSelectedLeadForEdit,
  setSelectedLeadAdditionalInfo,
  setSelectedLeadCustomerLists,
} from "../../../redux/internal-tickets/actions";
import MUIButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { HELP_DESK } from "../../../utils/permissions";
import useDataTable from "../../../custom-hooks/use-data-table";
import { filterSchemaToApply } from "./ticket.constants";
import Ticketutilitybadge from "../../utilitycomponents/ticketutilitybadge";
import debounce from "lodash.debounce";
import REFRESH from "../../../assets/images/refresh.png";
import EXPORT from "../../../assets/images/export.png";
import OPEN from "../../../assets/images/open.png";
import RESOLVED from "../../../assets/images/res.png";
import INPROGRESS from "../../../assets/images/inp.png";
import CLOSED from "../../../assets/images/cls.png";
import ASSIGNED from "../../../assets/images/asn.png";
import EXPCIRCLE from "../../../assets/images/Customer-Circle-img/ExpiredCircle.png";

// Sailaja imported common component Sorting on 27th March 2023
import { Sorting } from "../../common/Sorting";


var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}

const AllTickets = (props) => {
  const {
    toggleDraftModal,
    closeDraftModal,
    togglePermissionModal,
    selectedLeadForEdit,
    setSelectedLeadForEdit,
    setSelectedLeadAdditionalInfo,
    setSelectedLeadCustomerLists,
  } = props;

  const [helpDeskFilters, setHelpDeskFilters] = useState(null);

  const { history } = useHistory();
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [assignedTo, setAssignedTo] = useState([]);
  const [area, setArea] = useState([]);
  const [franchise, setFranchise] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [lead, setLead] = useState([]);
  const [modal, setModal] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [isChecked, setIsChecked] = useState([]);

  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  //filter show and hide menu
  const [levelMenu, setLevelMenu] = useState(false);
  // draft
  const [isDirty, setIsDirty] = useState(false);
  const [formDataForSaveInDraft, setformDataForSaveInDraft] = useState({});
  const configDB = useSelector((content) => content.Customizer.customizer);
  const [clearSelection, setClearSelection] = useState(false);
  const [openforcustomer, setOpenforcustomer] = useState("");
  const [ticketStatus, setTicketStatus] = useState(null);
  const [ticketSattaus1, setTicketStatus1] = useState([]);
  const [ticketPriority, setTicketPriority] = useState([]);
  const [searchUser, setSearchUser] = useState({ value: "", name: "open_for" });
  //state for area api only for zonalmanager
  const [getareas, setGetAreas] = useState([]);

  const [getzoneareas, setGetZoneAreas] = useState([]);
  const location = useLocation();
  // tabs
  //technician state
  const [techniciandata, setTechnicianData] = useState([])

  //zone and area state

  const [selectedTab, setSelectedtab] = useState(location?.state?.billingDateRange || "all");
  //new states for filters 

  // show reassigned toggle
  const [staticToggle, setStaticToggle] = useState("off");
  const [istelShow, setTelIsShow] = React.useState(false);
  function staticIpToggle() {
    setStaticToggle(staticToggle === "off" ? "on" : "off");
    setTelIsShow(!istelShow);
  }

  const {
    loadingTable,
    tableData,
    appliedFilterSchema,
    fetchTableData,
    handleSearch,
    myArray,
    setAppliedFilterSchema,
    handlePageChange,
    handlePerRowsChange,
    getQueryParams1,
    activeTab,
    setTableData,
    // debouncedChangeHandler
    categoryList,
    setCategoryList,
    inputs,
    setInputs, customstartdate,
    customenddate,
    setCustomstartdate,
    setCustomenddate, setAssignTOFIlter,
    assigntoFilter,
    zoneValue,
    setZoneValue,
    ShowAreas, complaiCount,
    handleBranchSelect,
    handleFranchiseSelect,
    handleZoneSelect,
    handleAreaSelect,
    loader

    // loading
  } = useDataTable({
    filterSchema: filterSchemaToApply,
    // api: "v2/list/ticket",
    api: "/v2/enh/list",
    fetch: helpdeskaxios,
    activeTab: selectedTab,
  });

  console.log(complaiCount, "complaiCount1")
  const handleModalToggle = () => {
    if (modalVisible == true) {
      setIsChecked([]);
      setClearSelection(true);
    }

    if (isChecked.length > 0) {
      setModalVisible(!modalVisible);
    } else {
      toast.error("Please select any record", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    }
  };

  const dispatch = useDispatch();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const update = (newRecord) => {
    fetchTableData('');
    setData([newRecord, ...data]);
    closeCustomizer(false);
    setTelIsShow(false)
    setStaticToggle('off')
  };

  const detailsUpdate = (updatedata, isClose = true) => {
    fetchTableData('');
    setFiltereddata((prevFilteredData) =>
      prevFilteredData.map((data) =>
        data.id == updatedata.id ? updatedata : data
      )
    );
    if (isClose) {
      closeCustomizer(false);
    }
  };

  // new search
  const changeHandler = (event) => {
    setSearchUser((prevState) => {
      return {
        ...prevState,
        value: event.target.value,
      };
    });
  };

  const debouncedChangeHandler = useMemo(() => {
    return debounce(changeHandler, 500);
  }, []);

  // useEffect(() => {
  //   setTableData((prevState) => ({
  //     ...prevState,
  //     appliedFilterSchema: {
  //       ...prevState.appliedFilterSchema,
  //       status: {
  //         ...prevState.appliedFilterSchema.status,
  //         value: {
  //           ...prevState.appliedFilterSchema.status.value,
  //           strVal: searchUser || "",
  //           label: searchUser,
  //           // name: searchUser.name,
  //         },
  //       },
  //     },
  //   }));
  // }, [searchUser]);

  useEffect(() => {
    setTableData((prevState) => ({
      ...prevState,
      appliedHelpdeskFilters: {
        ...prevState.appliedHelpdeskFilters,
        open_for: {
          ...prevState.appliedHelpdeskFilters.open_for,
          value: {
            ...prevState.appliedHelpdeskFilters.open_for.value,
            strVal: searchUser.value || "",
            label: searchUser.value,
            name: searchUser.name,
            // strVal: searchUser || "",
            // label: searchUser,
            // name: searchUser.name,
          },
        },
      },
    }));
  }, [searchUser]);

  // const changeHandler = (event) => {
  //   // setSearchUser(event.target.value);
  //   // (prevState) => {
  //   //   return {
  //   //     ...prevState,
  //   //     value: event.target.value,
  //   //   };
  //   // });
  // };

  // const debouncedChangeHandler = useMemo(() => {
  //   return debounce(changeHandler, 500);
  // }, []);

  // end
  //   //filter
  const handlesearchChange = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = data.filter((data) => {
      if (
        data.open_for.toLowerCase().search(value) != -1 ||
        data.ticket_category.category.toLowerCase().search(value) != -1 ||
        data.sub_category.name.toLowerCase().search(value) != -1
      )
        return data;
    });
    setFiltereddata(result);
  };

  //delete
  const deleteRows = (selected) => {
    setClearSelection(false);
    let rows = selected.map((ele) => ele.id);
    setIsChecked([...rows]);
  };

  const toggle = () => {
    setModal(!modal);
  };

  //draft customizers
  const closeCustomizer = (value) => {
    console.log("clicked")
    // draft
    // fetchTableData();
    setTelIsShow(false)
    setStaticToggle('off')
    if (isDirty && value) {
      toggleDraftModal();
    } else {
      handleCloseDraftModal();
    }
    setOpenforcustomer("");
  };

  const openCustomizer = (type, id) => {
    if (id) {
      setLead(id);
    }
    setActiveTab1(type);
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.add("open");
  };

  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    history && history.push(key);
  };

  const handleRowIdClick = async (row) => {
    openCustomizer("3");
    const lead = row;
    if (lead.assigned_date) {
      const now = new Date(lead.assigned_date);
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      const opendateFomated = now.toISOString().slice(0, 16);
      let d = new Date(lead.updated_at);

      let dStr = d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      new Date(dStr).toString();
      const watchlist = lead.watchlists.map((u) => u.user.username).join(",");
      const selectedWatchList = lead.watchlists.map((u) => u.user);
      setSelectedLeadAdditionalInfo({ selectedWatchList, workNotes: "" });
      setSelectedLeadForEdit({
        ...lead,
        assigned_date: opendateFomated,
        updated_at: dStr,
        watchlist: watchlist,
      });

      if (lead.open_for) {
        const id = lead.open_for.replace("L00", "");

        const response = await axiosBaseURL.get("/radius/lead/" + id + "/read");
        setSelectedLeadCustomerLists(response.data);
      }
    } else {
      let watchlist = "";
      if (!isEmpty(lead) && !isEmpty(lead.watchlists)) {
        const selectedWatchList = lead.watchlists.map((u) => u.user);
        setSelectedLeadAdditionalInfo({ selectedWatchList, workNotes: "" });
        watchlist = lead.watchlists.map((u) => u.user.username).join(",");
      }
      setSelectedLeadForEdit({
        ...lead,
        watchlist: watchlist,
      });
    }
  };

  const stickyColumnStyles = {
    whiteSpace: "nowrap",
    position: "sticky",
    zIndex: "1",
    backgroundColor: "white",
  };



  const redirectToCustomerDetails = (row) => {
    if (!!row) {
      sessionStorage.setItem("customerInfDetails", JSON.stringify(row));
      window.open(
        `${process.env.PUBLIC_URL}/app/customermanagement/customerlists/customerdetails/${row.user}/${row.username}/${row.radius_info}/${process.env.REACT_APP_API_URL_Layout_Name}`
      );
    }
  };
  const columns = useMemo(
    () => [

      {
        name: <b className="Table_columns" id="columns_alignment" style={{ whiteSpace: "nowrap" }}>{"Ticket ID"}</b>,
        selector: "id",
        style: {
          ...stickyColumnStyles,
          left: "48px !important",
        },
        width: "80px",
        cell: (row) => (
          <>
            {token.permissions.includes(HELP_DESK.READ) ? (
              <a
                onClick={() => handleRowIdClick(row)}
                id="columns_alignment"
                className="openmodal"
              >
                T{row.id}
              </a>
            ) : (
              <span id="columns_alignment">T{row.id}</span>
            )}
          </>
        ),
        sortable: false,
      },
      {
        name: <b className="CustomerTable_columns" style={{ whiteSpace: "pre" }}>{"Customer ID"}</b>,
        width: "130px",
        style: {
          ...stickyColumnStyles,
          left: "128px !important",
        },
        cell: (row) => {
          return (
            <span>
              {row?.username ?
                <a onClick={() => redirectToCustomerDetails(row)} href="#" style={{ whiteSpace: "initial" }}>
                  {row.username}
                </a>
                // <Link to={`${process.env.PUBLIC_URL}/app/customermanagement/customerlists/customerdetails/${row?.user}/${row?.username}/${row?.radius_info_id}/vbc`}>
                //   {row.open_for}
                // </Link> 

                : <>
                  {row.open_for}
                </>}

            </span>

          )
        },
        sortable: false,
      },


      {
        selector: "online_status",
        name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }} >{"Current Status"}</b>,

        cell: (row) => {
          return (
            <div style={{ display: "flex", width: "100%" }}>
              {row.online_status === "Online" ? (
                <>
                  <img src={KYCCIRCLE} style={{ position: "relative", top: "7px", height: "16px" }} />
                  &nbsp; &nbsp;
                  <p style={{ position: "relative", top: "6px" }}>Online</p>
                </>
              ) : row.online_status === "NYL" ? (
                <>
                  <img src={EXPCIRCLE} style={{ position: "relative", top: "7px", height: "16px" }} />
                  &nbsp; &nbsp;
                  <p style={{ position: "relative", top: "6px" }}>Offline</p>
                </>
              ) : row.online_status === "Offline" ? (
                <>
                  <img src={EXPCIRCLE} style={{ position: "relative", top: "7px", height: "16px" }} />
                  &nbsp; &nbsp;
                  <p style={{ position: "relative", top: "6px" }}>Offline</p>
                </>
              ) : (
                <>
                  <img src={EXPCIRCLE} style={{ position: "relative", top: "7px", height: "16px" }} />
                  &nbsp; &nbsp;
                  <p style={{ position: "relative", top: "6px" }}>Offline</p>
                </>
              )}
            </div>

          );
        },
        style: {
          ...stickyColumnStyles,
          left: "255px !important",
        },
      },

      {
        name: <b className="Table_columns">{"Mobile"}</b>,
        selector: "mobile_number",
        cell: (row) => (
          <span style={{ whiteSpace: "initial" }} className="First_Letter">{row?.mobile_number}</span>
        ),
        style: {
          ...stickyColumnStyles,
          left: "360px !important",
          // left: "255px !important",
          borderRight: "1px solid #CECCCC",
        },
        sortable: false,
      },
      {

        name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Complaint Status"}</b>,
        selector: "status",
        sortable: true,

        cell: (row) => (
          <div style={{ whiteSpace: "nowrap" }}>
            {row.status === "OPN" ? (
              <span>
                <img src={OPEN} />
                &nbsp; Open
              </span>
            ) : row.status === "ASN" ? (
              <span>
                <img src={ASSIGNED} />
                &nbsp; Assigned
              </span>
            ) : row.status === "RSL" ? (
              <span>
                <img src={RESOLVED} />
                &nbsp; Resolved
              </span>
            ) : row.status === "INP" ? (
              <span>
                {" "}
                <img src={INPROGRESS} />
                &nbsp; In-Progress
              </span>
            ) : row.status === "CLD" ? (
              <span>
                <img src={CLOSED} />
                &nbsp; Closed
              </span>
            ) : (
              ""
            )}
          </div>
        ),
      },

      {
        name: <b className="Table_columns" >{"Name"}</b>,
        selector: "name",
        cell: (row) => (
          <span > {row?.name}</span>
        ),

        sortable: false,
      },
      {
        name: <b className="Table_columns">{"Category"}</b>,
        selector: "ticket_category.category",
        cell: (row) => (
          <div className="ellipsis" title={row.ticket_category?.category}>
            {row.ticket_category?.category}
          </div>
        ),
        sortable: true,
      },
      {
        name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Sub Category"}</b>,
        selector: "sub_category.name",
        cell: (row) => (
          <div className="ellipsis" title={row.sub_category?.name}>
            {row.sub_category?.name}
          </div>
        ),
        sortable: true,
      },





      // Sailaja Modified Year Format As YYYY  for Complaints-> Opened Date column on 20th March 2023

      {
        name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Opened Date"}</b>,
        selector: "open_date",
        sortable: true,
        cell: (row) => (
          <span className="digits" style={{ textTransform: "initial" }}>
            {" "}
            {/* {moment(row.open_date).format("DD MMM YY")} */}
            {row.open_date ? moment(row.open_date).format("DD MMM YYYY, h:mm a") : "---"}
          </span>
        ),
      },
      // Sailaja Modified Year Format As YYYY  for Complaints-> Resolved Date column on 20th March 2023

      {
        name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Assigned Date"}</b>,
        selector: "assigned_date",
        sortable: true,
        cell: (row) => (
          <span className="digits" style={{ textTransform: "initial" }}>
            {" "}
            {/* {moment(row.open_date).format("DD MMM YY")} */}
            {row.assigned_date ? moment(row.assigned_date).format("DD MMM YYYY, h:mm a") : "---"}
          </span>
        ),
      },
      {
        name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Closed Date"}</b>,
        selector: "closed_date",
        sortable: true,
        cell: (row) => (
          <span className="digits" style={{ textTransform: "initial" }}>
            {" "}
            {/* {moment(row.open_date).format("DD MMM YY")} */}
            {row.closed_date ? moment(row.closed_date).format("DD MMM YYYY, h:mm a") : "---"}
          </span>
        ),
      },
      // {
      //   name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Assigned Date"}</b>,
      //   selector: "assigned_date",
      //   cell: (row) => (
      //     <span className="digits" style={{ textTransform: "initial" }}>
      //       {" "}
      //       {/* {moment(row.assigned_date).format("DD MMM YY")} */}
      //       {row.assigned_date
      //         ? moment(row.assigned_date).format("DD MMM YY")
      //         : "---"}
      //     </span>
      //   ),
      //   sortable: true,
      // },

      // {
      //   name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Customer Notes"}</b>,
      //   selector: "customer_notes",
      //   sortable: true,
      //   cell: (row) => (
      //     <div className="ellipsis" title={row.customer_notes}>
      //       {row.customer_notes}
      //     </div>
      //   ),
      // },

      // {
      //   name: <b className="Table_columns">{"Watchlist"}</b>,
      //   selector: "watchlists",
      //   sortable: true,
      //   cell: (row) => {
      //     const users = row.watchlists.map((list) => list.user.username);
      //     return <span>{users.join(",")}</span>;
      //   },
      // },

      // {
      //   name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Created"}</b>,
      //   selector: "created",
      //   sortable: true,
      //   cell: (row) => (
      //     <span className="digits" style={{ textTransform: "initial" }}>
      //       {" "}
      //       {row.created ? moment(row.created).format("DD MMM YY") : "---"}
      //     </span>
      //   ),
      // },
      // Sailaja Removed function displayTotaltime in Resolution Time column in complaints module on 23rd March 2023 (Bcz calculation coming from backend also)
      {
        name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Resolution Time"}</b>,
        selector: "open_date",

        cell: (row) => (
          <span>{row.resolved_time ? (row.resolved_time) : "---"}</span>

        ),
      },



      {
        name: <b className="Table_columns">{"Zone"}</b>,
        cell: (row) => (
          <span>{row?.zone?.name}</span>
        )
      },
      {
        name: <b className="Table_columns">{"Area"}</b>,
        cell: (row) => (
          <span>{row?.area?.name}</span>
        )
      },
      //Sailaja Updated nowrap for Assigned By Data Column on 19th July
      {
        name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Assigned By"}</b>,
        selector: "created_by",
        sortable: true,
        cell: (row) => {
          return (
            <span style={{ whiteSpace: "nowrap" }}>
              {row.created_by
                ? row.created_by && row.created_by.username
                : "--"}
            </span>
          );
        },
      },
      {
        name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Assigned To"}</b>,
        selector: "assigned_to",
        sortable: true,
        cell: (row) => {
          return (
            <span>
              {row.assigned_to
                ? row.assigned_to && row.assigned_to.username
                : "N/A"}
            </span>
          );
        },
      },
      {
        name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Resolved By"}</b>,
        selector: "resolved_by",
        sortable: true,
        cell: (row) => {
          return (
            <span>
              {row.resolved_by
                ? row.resolved_by && row.resolved_by.username
                : "N/A"}
            </span>
          );
        },
      },
      {
        name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Closed By"}</b>,
        selector: "closed_by",
        sortable: true,
        cell: (row) => {
          return (
            <span>
              {row.closed_by
                ? row.closed_by && row.closed_by.username
                : "N/A"}
            </span>
          );
        },
      },
      {
        name: <b className="Table_columns" style={{ whiteSpace: "nowrap", position: "relative", left: "-19px" }}>{"Technician Comment"}</b>,
        selector: "technician_comment",
        // sortable: true,
        cell: (row) => {
          return (
            <span style={{ whiteSpace: "nowrap", position: "relative", left: "-7px" }}>
              {row.technician_comment
                ? row.technician_comment && row.technician_comment.name
                : "---"}
            </span>
          );
        },
      },
      // {
      //   name: <b className="Table_columns">{"Notes"}</b>,
      //   selector: "notes",
      //   sortable: true,

      // },
      {
        name: <b className="Table_columns">{"Notes"}</b>,
        selector: row => row.notes  ? row.notes  : "---",
        sortable: true,
      },
      

      {
        name: <b className="Table_columns">{"Franchise"}</b>,
        cell: (row) => (
          <span>{row?.franchise?.name ? row?.franchise?.name : "---"}</span>
        )
      },


      {
        name: <b className="Table_columns">{"Branch"}</b>,
        cell: (row) => (
          <span>{row?.branch?.name ? row?.branch?.name : "---"}</span>
        )
      },

      // {
      //   name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Address"}</b>,
      //   cell: (row) => (
      //     <div className="ellipsis First_Letter1 " title={`${row?.address?.house_no ? row?.address?.house_no : ""}${row && row.address && row.address.landmark
      //       },${row && row.address && row.address.street},${row && row.address && row.address.city
      //       },${row && row.address && row.address.district},${row && row.address && row.address.state
      //       },${row && row.address && row.address.pincode},${row && row.address && row.address.country
      //       }`}>
      //       <span>


      //         {row?.address ? (`${row?.address?.house_no ? row?.address?.house_no : ""}${row && row.address && row.address.landmark
      //           },${row && row.address && row.address.street},${row && row.address && row.address.city
      //           },${row && row.address && row.address.district},${row && row.address && row.address.state
      //           },${row && row.address && row.address.pincode},${row && row.address && row.address.country
      //           }`) : "---"}
      //       </span>

      //     </div>
      //   ),
      // },
    ],
    [handleRowIdClick, helpDeskFilters, ticketStatus]
  );

  const handleNewClick = () => {
    //Get saved values from Local Storage
    const getLocalDraftKey = localStorage.getItem("ticketDraftSaveKey");
    if (!!getLocalDraftKey) {
      const getLocalDraftData = localStorage.getItem(getLocalDraftKey);
      setSelectedLeadForEdit(JSON.parse(getLocalDraftData));
    } else setSelectedLeadForEdit({});
    openCustomizer("2");
  };
  // Sailaja Worked on Complaints Export Columns on 27th July
  // Sailaja changed mobile_no key  on 28th July
  const headersForExportFile = [
    ["all", "All"],
    ["id", "Ticket ID"],
    ["open_for", "Customer ID"],
    ["mobile_number", "Mobile"],
    ["status_name", "Complaint Status"],
    ["name", "Name"],
    ["ticket_category", "Category"],
    ["sub_category", "Sub Category"],
    ["open_date", "Opened Date"],
    ["closed_date", "Closed Date"],
    ["resolved_date", "Resolution Time"],
    ["zone", "Zone"],
    ["area", "Area"],
    ["created_by", "Assigned By"],
    ["assigned_to", "Assigned To"],
    ["resolved_by", "Resolved By"],
    ["closed_by", "Closed By"],
    ["franchise", "Franchise"],
    ["branch", "Branch"],
    ["notes", "Notes"],

  ];
const headersForExcel =[
  ["all", "All"],
  ["id", "Ticket ID"],
  ["open_for", "Customer ID"],
  ["mobile_number", "Mobile"],
  ["status_name", "Complaint Status"],
  ["name", "Name"],
  ["ticket_category", "Category"],
  ["sub_category", "Sub Category"],
  ["open_date", "Opened Date"],
  ["closed_date", "Closed Date"],
  ["resolved_date", "Resolution Time"],
  ["zone", "Zone"],
  ["area", "Area"],
  ["created_by", "Assigned By"],
  ["assigned_to", "Assigned To"],
  ["resolved_by", "Resolved By"],
  ["closed_by", "Closed By"],
  ["franchise", "Franchise"],
  ["branch", "Branch"],
  ["notes", "Notes"],
]
  //filter show and hide level menu
  const OnLevelMenu = (menu) => {
    setLevelMenu(!menu);
  };

  document.addEventListener("mousedown", (event) => {
    const concernedElement = document.querySelector(".filter-container");

    if (concernedElement && concernedElement.contains(event.target)) {
      setLevelMenu(true);
      // setImportDivStatus(true);
    } else {
      if (event.target.className !== "btn btn-primary nav-link") {
        if (event.target.className !== "icon-filter") {
          setLevelMenu(false);
          var element = document.getElementById("departmentNameId");
          if (element) {
            element.classList.remove("showcard");
          }

          //   setImportDivStatus(true);
        }
      }
    }
  });

  //Api Call for Technician Comment
  useEffect(() => {
    helpdeskaxios
      .get(`/technician/list`)
      .then((res) =>
        // setTechnicianData(res.data));
        // Sailaja sorting the Complaints->  Technician Comment Dropdown data as alphabetical order on 27th March 2023
        setTechnicianData(Sorting((res.data), 'name')));
  }, []);
  // filter
  // const franchId = JSON.parse(localStorage.getItem("token"))?.franchise?.id
  //   ? JSON.parse(localStorage.getItem("token"))?.franchise?.id
  //   : 0;
  // const branchId = JSON.parse(localStorage.getItem("token"))?.branch?.id
  //   ? JSON.parse(localStorage.getItem("token"))?.branch?.id
  //   : 0;
  useEffect(() => {
    helpdeskaxios
      .get(`create/options/ticket`)
      .then((res) => {
        let { category, status, priority_sla } = res.data;
        setHelpDeskFilters(res.data);
        setTicketStatus(res.dassta);
        setTicketStatus1([...status]);
        // Sailaja sorting the   Complaints-> Status Dropdown data as alphabetical order on 27th March 2023
        // setTicketStatus1(Sorting(([...status]),'name'));
        // setCategoryList([...category])
        // Sailaja sorting the   Complaints-> Category Dropdown data as alphabetical order on 10th April 2023
        setCategoryList(Sorting(([...category]), 'category'));
        setTicketPriority([...priority_sla])
      })
      .catch((err) => {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      });

    adminaxios
      .get("accounts/options/all")
      .then((res) => {
        let { users } = res.data;
        setAssignedTo([...users]);
      })
      .catch((err) => {
        console.log(err);
      });

    adminaxios.get(`accounts/staff`).then((res) => {
      // setAssignTOFIlter(res.data);
      //  Sailaja sorting the   Complaints-> Assign To Dropdown data as alphabetical order on 27th March 2023
      setAssignTOFIlter(Sorting((res.data), 'username'));
    });
  }, []);




  const [isExportDataModalOpen, setIsExportDataModalToggle] = useState(false);
  const [downloadableData, setDownloadableExcelData] = useState([]);
  const [filteredDataForModal, setFilteredDataForModal] =
    useState(filteredData);
  const [downloadAs, setDownloadAs] = useState("");
  const [headersForExport, setHeadersForExport] = useState([]);

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      if (event.target.defaultValue === "all") {
        let allKeys = headersForExportFile.map((h) => h[0]);
        setHeadersForExport(allKeys);
      } else {
        let list = [...headersForExport];
        list.push(event.target.defaultValue);
        setHeadersForExport(list);
      }
    } else {
      if (event.target.defaultValue === "all") {
        setHeadersForExport([]);
      } else {
        let removedColumnFromHeader = headersForExport.filter(
          (item) => item !== event.target.defaultValue
        );
        setHeadersForExport(removedColumnFromHeader);
      }
    }
  };

  const handleExportDataModalOpen = (downloadAs) => {
    handleClose();
    setIsExportDataModalToggle(!isExportDataModalOpen);
    setDownloadableExcelData(filteredData);
    setDownloadAs(downloadAs);
  };
  const handleExportDataAsPDF = (headersForPDF, pageLoadData) => {
    setIsExportDataModalToggle(!isExportDataModalOpen);
    const title = `All Tickets`;
    downloadPdf(title, headersForPDF, pageLoadData, filteredData, "Tickets");
  };

  const handleDownload = () => {
    setIsLoading(true);
    const headers = headersForExport.filter((header) => header !== "all");
    const headersForPDF = headersForExportFile.filter(
      (h) => headers.includes(h[0]) && h
    );
    const headersForExcelFiltered = headersForExcel.filter(
      (h) => headers.includes(h[0]) && h
    );
    console.log(headersForPDF, ":headersForPDF");
    const queryParams = getQueryParams1(activeTab);
    helpdeskaxios.get(`v2/enh/list?export=true&${queryParams}`).then((response) => {
      setPageLoadData(response.data, "response.data");
      setIsLoading(false);
      if (downloadAs === "pdf") {
        handleExportDataAsPDF(headersForPDF, response.data);
      } else {
        // downloadExcelFile(
        //   response.data,
        //   downloadAs,
        //   headers,
        //   helpDeskFilters?.status
        // );
        downloadExcelFile(response.data, downloadAs, headersForExcelFiltered, helpDeskFilters?.status);

      }
      toggleDropdown();
      setHeadersForExport([]);
      setFilteredDataForModal(filteredData);
      setIsExportDataModalToggle(false);
    });

  };


  //draft start
  const saveDataInDraftAndCloseModal = () => {
    localStorage.setItem("ticket/", JSON.stringify(formDataForSaveInDraft));
    localStorage.setItem("ticketDraftSaveKey", "ticket/");

    closeDraftModal();
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
    setIsDirty(false);
  };

  const setIsDirtyFun = (val) => {
    setIsDirty(val);
  };

  const handleCloseDraftModal = () => {
    closeDraftModal();
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
    localStorage.removeItem("ticket/");
    localStorage.removeItem("ticketDraftSaveKey");
    setIsDirty(false);
    setLead({});
  };

  // draft end
  // scroll top
  const ref = useRef();

  useEffect(() => {
    ref.current.scrollIntoView(0, 0);
  }, []);

  //onside click hide sidebar
  const box = useRef(null);

  //end
  //export new state
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [pageLoadData, setPageLoadData] = useState([]);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportclose = () => {
    setIsExportDataModalToggle(false);
    setHeadersForExport([]);
  };

  //   const paginationComponentOptions = {
  //     rowsPerPageText: 'Show whatever',
  //     rangeSeparatorText: 'de',
  // };

  // function for checkbox selection in dataTable
  const NewCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
    <div className="checkbox_header">
      <input
        type="checkbox"
        class="new-checkbox"
        ref={ref}
        onClick={onClick}
        {...rest}
      />
      <label className="form-check-label" id="check" />
    </div>
  ));

  // selected row downloadExcelFile
  const handleSelectedRows = (selectedRows) => {
    const tempFilteredData =
      filteredData.map((item) => ({ ...item, selected: false })) || [];
    const selectedIds = selectedRows.map((item) => item.id);
    const temp = tempFilteredData.map((item) => {
      if (selectedIds.includes(item.id)) return { ...item, selected: true };
      else return { ...item, selected: false };
    });
    setFiltereddata(temp);
  };
  const conditionalRowStyles = [
    {
      when: (row) => row.selected === true,
      style: {
        backgroundColor: "#E4EDF7",
      },
    },
  ];
  {/* Sailaja on 11th July   Line number 994 id="breadcrumb_margin" change the breadcrumb position */ }
  {/*Gave styles for search bar alignment with complaints by Marieya on line 1112*/ }
  {/*added all in queryparams for complaints export by Marieya */ }

  // by default today
  // dates
  const [showhidecustomfields, setShowhidecustomfields] = useState(false);

  const basedonrangeselector = (e, value) => {
    //today
    let reportstartdate = moment().format("YYYY-MM-DD");
    let reportenddate = moment(new Date(), "DD-MM-YYYY").add(1, "day");
    if (e.target.value === "ALL9") {
      setShowhidecustomfields(false);
      reportstartdate = "";
      reportenddate = "";
    }
    if (e.target.value === "today") {
      setShowhidecustomfields(true);

      reportstartdate = moment().format("YYYY-MM-DD");
      reportenddate = moment().format("YYYY-MM-DD");
    }
    //yesterday
    else if (e.target.value === "yesterday") {
      setShowhidecustomfields(true);

      reportstartdate = moment().subtract(1, "d").format("YYYY-MM-DD");

      reportenddate = moment().subtract(1, "d").format("YYYY-MM-DD");
    }
    //last 7 days
    else if (e.target.value === "last7days") {
      setShowhidecustomfields(true);

      reportstartdate = moment().subtract(7, "d").format("YYYY-MM-DD");
      reportenddate = moment().format("YYYY-MM-DD");
    }
    else if (e.target.value === "last15days") {
      setShowhidecustomfields(true);

      reportstartdate = moment().subtract(15, "d").format("YYYY-MM-DD");
      reportenddate = moment().format("YYYY-MM-DD");
    }
    //last 30 days
    else if (e.target.value === "last30days") {
      setShowhidecustomfields(true);

      reportstartdate = moment().subtract(30, "d").format("YYYY-MM-DD");
      reportenddate = moment().format("YYYY-MM-DD");
    }
    //end
    //last week
    else if (e.target.value === "lastweek") {
      setShowhidecustomfields(true);

      reportstartdate = moment()
        .subtract(1, "weeks")
        .startOf("week")
        .format("YYYY-MM-DD");

      reportenddate = moment()
        .subtract(1, "weeks")
        .endOf("week")
        .format("YYYY-MM-DD");
    }
    // last month
    else if (e.target.value === "lastmonth") {
      setShowhidecustomfields(true);
      reportstartdate = moment()
        .subtract(1, "months")
        .startOf("months")
        .format("YYYY-MM-DD");

      reportenddate = moment()
        .subtract(1, "months")
        .endOf("months")
        .format("YYYY-MM-DD");
    } else if (e.target.value === "custom") {
      setShowhidecustomfields(true);
      reportstartdate = e.target.value;

      reportstartdate = e.target.value;
    }
    setCustomstartdate(reportstartdate);
    setCustomenddate(reportenddate);
  };
  //handler for custom date
  const customHandler = (e) => {
    if (e.target.name === "start_date") {
      setCustomstartdate(e.target.value);
    }
    if (e.target.name === "end_date") {
      setCustomenddate(e.target.value);
    }
  };

  const storageToken = localStorage.getItem("token");
  const token = JSON.parse(storageToken);


  let DisplayAreas = false;
  if (
    (token && token.user_type === "Admin") ||
    (token && token.user_type === "Super Admin") ||
    (token && token.user_type === "Branch Owner")
  ) {
    DisplayAreas = true;
  }
  const getAreasforZNMR = () => {
    return (
      <>
        {ShowAreas
          ? adminaxios
            .get(`accounts/areahierarchy`)
            .then((res) => {
              setGetAreas(res.data);
              // setGetAreas(res.data.franchises);

              setGetZoneAreas(res.data.franchises.zones)
              // props.setSelectedAreas(res.data.branches);
              // props.setSelectedFranchises(res.data.franchises);

              console.log(res.data.branches, "selectareas");
            })

            .catch((error) => {
              console.log(error);
            })
          : ""}
      </>
    );
  };

  useEffect(() => {
    getAreasforZNMR()
  }, [])

  return (
    <Fragment>
      <div ref={ref}>
        <br />
        <Container fluid={true}>
          <Grid container spacing={1} id="breadcrumb_margin">
            <Grid item md="12">
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<NavigateNextIcon fontSize="small" className="navigate_icon" />}
              >
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color=" #377DF6"
                  fontSize="14px"
                >
                  Customer Relations
                </Typography>
                {/* Sailaja  Removed All Complaints from the Breadcrumbs on 13th July */}

                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color="#00000 !important"
                  fontSize="14px"
                  className="last_typography"

                >
                  Complaints
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <br />
          <br />
          <div className="edit-profile data_table" id="breadcrumb_table">
            <Stack direction="row" spacing={2} style={{ marginTop: "1%" }}>
              <span className="all_cust">Complaints</span>
              <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }} style={{ marginBottom: "25px", position: "relative", top: "-3px" }}>

                <Paper
                  component="div"
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    // width: 400,
                    height: "40px",
                    boxShadow: "none",
                    border: "1px solid #E0E0E0",
                  }}
                >
                  <Select
                    variant="standard"
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    style={{
                      height: "38px",
                    }}
                    onChange={(event) =>
                      setSearchUser((prevState) => {
                        return {
                          ...prevState,
                          name: event.target.value,
                        };
                      })
                    }
                    value={searchUser.name}
                  >
                    <MenuItem value="open_for">Customer ID</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="closed_by_username">Closed By</MenuItem>
                  </Select>
                  <div id="newSearch">
                    <InputBase
                      sx={{ ml: 1, flex: 1, position: "relative", top: "3px", width: "252px" }}
                      placeholder="Search With Customer ID , First Name"
                      inputProps={{ "aria-label": "search google maps" }}
                      onChange={debouncedChangeHandler}
                    />
                  </div>
                  <IconButton
                    type="submit"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <SearchIcon style={{ width: "21px" }} />
                  </IconButton>
                </Paper>


                {token.permissions.includes(HELP_DESK.EXPORT) && (
                  <>
                    <Tooltip title={"Export"}>
                      <MUIButton
                        variant="outlined"
                        onClick={handleClick}
                        className="muibuttons"
                      >
                        <img src={EXPORT} className="Header_img" />
                      </MUIButton>
                    </Tooltip>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem
                        onClick={() => handleExportDataModalOpen("csv")}
                      >
                        Export CSV
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleExportDataModalOpen("excel")}
                      >
                        Export XLS
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleExportDataModalOpen("pdf")}
                      >
                        Export PDF
                      </MenuItem>
                    </Menu>
                  </>
                )}
                <Tooltip title={"Refresh"}>
                  <MUIButton
                    onClick={() => fetchTableData('')}
                    variant="outlined"
                    className="muibuttons"
                  >
                    <img src={REFRESH} className="Header_img" />
                  </MUIButton>
                </Tooltip>
                {/* {token.permissions.includes(HELP_DESK.FILTERS) && (
                  <Tooltip title={"Filters"}>
                  <MUIButton
                    onClick={() => OnLevelMenu(levelMenu)}
                    variant="outlined"
                    className="muibuttons"
                  >
                    <img src={FILTERS} className="Header_img" />
                  </MUIButton>
                  </Tooltip>
                )} */}
                {token.permissions.includes(HELP_DESK.CREATE) && (
                  <>
                    {JSON.parse(localStorage.getItem("token")).user_type === "Staff" ?
                      <></> :
                      <button
                        className="btn btn-primary openmodal"
                        id="newbuuon"
                        type="submit"
                        onClick={handleNewClick}
                      >
                        <b>
                          <span className="openmodal" style={{ fontSize: "16px", marginLeft: "-9px" }}>
                            New&nbsp;&nbsp;
                          </span></b>
                        <i
                          className="icofont icofont-plus openmodal"
                          style={{
                            cursor: "pointer",
                            // marginLeft: "-15px",
                          }}
                        ></i>
                      </button>
                    }
                  </>
                )}
              </Stack>
            </Stack>
            <TicketFilterContainer
              levelMenu={levelMenu}
              appliedFilterSchema={appliedFilterSchema}
              setAppliedFilterSchema={setAppliedFilterSchema}
              setLevelMenu={setLevelMenu}
              filteredData={filteredData}
              setFiltereddata={setFiltereddata}
              // loading={loading}
              // setLoading={setLoading}
              showTypeahead={false}
              helpDeskFilters={helpDeskFilters}
              assignedTo={assignedTo}
              area={area}
              franchise={franchise}
            />
            <Row>
              {token.permissions.includes(HELP_DESK.FILTERS) &&
                <Allfilter
                  handleBranchSelect={handleBranchSelect}
                  handleFranchiseSelect={handleFranchiseSelect}
                  handleZoneSelect={handleZoneSelect}
                  handleAreaSelect={handleAreaSelect}
                  fetchTableData={fetchTableData}
                  categoryList={categoryList}
                  inputs={inputs}
                  setInputs={setInputs}
                  ticketSattaus1={ticketSattaus1}
                  ticketPriority={ticketPriority}
                  customenddate={customenddate}
                  customHandler={customHandler}
                  customstartdate={customstartdate}
                  showhidecustomfields={showhidecustomfields}
                  basedonrangeselector={basedonrangeselector}
                  assigntoFilter={assigntoFilter}
                  ShowAreas={ShowAreas}
                  DisplayAreas={DisplayAreas}
                  getareas={getareas}
                  getzoneareas={getzoneareas}
                  zoneValue={zoneValue}
                  setZoneValue={setZoneValue}
                  setTechnicianData={setTechnicianData}
                  techniciandata={techniciandata}
                />}
            </Row>
            <Row>
              <Col>
                <button
                  className="btn btn-primary openmodal"
                  id=""
                  type="button"
                  onClick={() => { handleSearch(myArray); fetchTableData(inputs) }}
                  disabled={loader ? loader : loader}
                >
                  {loader ? <Spinner size="sm"> </Spinner> : null} &nbsp;
                  <b>Search  </b>
                  {" "}
                </button>
              </Col>
            </Row>
            <br />
            <Row>
              <Modal
                isOpen={isExportDataModalOpen}
                toggle={() => {
                  setIsExportDataModalToggle(!isExportDataModalOpen);
                  setFilteredDataForModal(filteredData);
                  setHeadersForExport([]);
                }}
                centered
              >
                <ModalBody>
                  <h5>Select the Fields Required</h5>
                  <hr />
                  <div>
                    {headersForExportFile.map((column, index) => (
                      <span style={{ display: "block" }}>
                        <label for={column[1]} key={`${column[1]}${index}`}>
                          <input
                            value={column[0]}
                            onChange={handleCheckboxChange}
                            type="checkbox"
                            name={column[1]}
                            checked={headersForExport.includes(column[0])}
                          />
                          &nbsp; {column[1]}
                        </label>
                      </span>
                    ))}
                  </div>
                </ModalBody>
                <ModalFooter>
                  {/* <Button
                    color="secondary"
                    id="resetid"
                    onClick={handleExportclose}
                    // onClick={() => setIsExportDataModalToggle(false)}
                  >
                    {Close}
                  </Button>
                  <button
                    color="primary"
                    onClick={() => handleDownload()}
                    disabled={headersForExport.length > 0 ? false : true}
                  >
                    <span className="openmodal">
                    Download
                  </button> */}
                  <Button
                    color="secondary"
                    id="resetid"
                    onClick={handleExportclose}
                  // onClick={() => setIsExportDataModalToggle(false)}
                  >
                    {Close}
                  </Button>
                  {/* <Button
      className="btn btn-primary openmodal"
      id="download_button1"
      onClick={handleDownload}
      disabled={headersForExport.length > 0 ? false : true}
    >
      {isLoading ? <Spinner size="sm"> </Spinner> : null} &nbsp;&nbsp;
      Download
    </Button> */}
                  {/* Sailaja Modified the code for disable button while loader is added for complaints module on 27th April 2023  */}
                  <button
                    // color="primary"
                    className="btn btn-primary openmodal"
                    id="download_button1"
                    onClick={() => handleDownload()}
                    // disabled={ headersForExport.length > 0 ? false : true}
                    disabled={isLoading || (headersForExport.length > 0 ? false : true)}
                  >
                    {isLoading ? <Spinner size="sm" /> : null} &nbsp;&nbsp;
                    Download
                  </button>
                </ModalFooter>
              </Modal>
              <Col md="12">
                <Ticketutilitybadge
                  // tabCounts={tableData?.tabCounts}
                  tabCounts={complaiCount}
                  tabCounts1={tableData?.status_counts}
                  // catogeryFilters={ticketStatus?.status}
                  setSelectedtab={setSelectedtab}
                  currentTab={selectedTab}
                //  currentTab={activeTab2}
                // setActiveTab={setActiveTab2}
                />
              </Col>
              <Col md="12" >
                <Card style={{ borderRadius: "0", boxShadow: "none", marginTop: "1%" }}>
                  <Col xl="12" style={{ padding: "0" }}>
                    <nav aria-label="Page navigation example">
                      <div className="data-table-wrapper">
                        {token.permissions.includes(HELP_DESK.LIST) ?

                          (
                            <DataTable
                              className="helpdesk-list"
                              columns={columns}
                              data={tableData?.pageLoadData || []}
                              selectableRows
                              selectableRowsComponent={NewCheckbox}
                              noHeader
                              onSelectedRowsChange={({ selectedRows }) => (
                                handleSelectedRows(selectedRows),
                                deleteRows(selectedRows)
                              )}
                              clearSelectedRows={clearSelectedRows}
                              // paginationComponentOptions={paginationComponentOptions} 
                              pagination
                              paginationServer
                              paginationTotalRows={tableData?.totalRows}
                              onChangeRowsPerPage={handlePerRowsChange}
                              onChangePage={handlePageChange}
                              // progressPending={loading}
                              progressPending={tableData.uiState?.loading}
                              progressComponent={
                                <SkeletonLoader loading={tableData.uiState.loading} />
                              }
                              noDataComponent={"No Data"}
                              conditionalRowStyles={conditionalRowStyles}
                            />
                          ) : (
                            <p style={{ textAlign: "center" }}>
                              {"You have insufficient permissions to view this"}
                            </p>
                          )}
                      </div>
                    </nav>
                  </Col>
                  <br />
                </Card>
              </Col>
              <Row>
                <Col md="12">
                  <div
                    ref={box}
                    className="customizer-contain"
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
                        <i
                          className="icon-close"
                          onClick={() => closeCustomizer(true)}
                        ></i>
                        <br />
                        <Modal
                          isOpen={modal}
                          toggle={toggle}
                          className="modal-body"
                          centered={true}
                        >
                          <ModalHeader toggle={toggle}>
                            {ModalTitle}
                          </ModalHeader>
                          <ModalFooter>
                            <CopyToClipboard text={JSON.stringify(configDB)}>
                              <Button
                                color="primary"
                                className="notification"
                                onClick={() =>
                                  toast.success("Code Copied to clipboard !", {
                                    position: toast.POSITION.BOTTOM_RIGHT,
                                  })
                                }
                              >
                                {CopyText}
                              </Button>
                            </CopyToClipboard>
                            <Button id="resetid" onClick={toggle}>
                              {Cancel}
                            </Button>
                          </ModalFooter>
                        </Modal>
                      </div>
                      <div className="customizer-body custom-scrollbar">
                        <TabContent activeTab={activeTab1}>
                          <TabPane tabId="2">
                            <div id="headerheading"> Add New Complaint </div>
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
                                      setformDataForSaveInDraft={
                                        setformDataForSaveInDraft
                                      }
                                      lead={lead}
                                      //calling reset after draft
                                      setLead={setLead}
                                      openforcustomer={openforcustomer}

                                    />
                                  </div>
                                </li>
                              </ul>
                            )}
                          </TabPane>
                          <TabPane tabId="3">
                            <div id="headerheading">
                              {" "}
                              Complaint Informations : T{selectedLeadForEdit.id}
                            </div>
                            {activeTab1 == "3" && (
                              <TicketDetails
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
                              // isEditDisabled={isEditDisabled}
                              // setIsEditDisabled={setIsEditDisabled}
                              />
                            )}
                          </TabPane>
                        </TabContent>
                      </div>
                    </div>
                  </div>
                </Col>
                <DeleteModal
                  visible={modalVisible}
                  handleVisible={handleModalToggle}
                  isChecked={isChecked}
                  tokenAccess={tokenAccess}
                  setFiltereddata={setFiltereddata}
                  setClearSelectedRows={setClearSelectedRows}
                  setIsChecked={setIsChecked}
                  setClearSelection={setClearSelection}
                />
              </Row>
            </Row>
          </div>
        </Container>
        <br />
        {props.openPermissionModal && (
          <PermissionModal
            content={props.permissionModalText}
            visible={props.openPermissionModal}
            handleVisible={togglePermissionModal}
          />
        )}
        {props.openDraftModal && (
          <DraftModal
            openDraftModal={props.openDraftModal}
            closeDraftModal={handleCloseDraftModal}
            toggleDraftModal={toggleDraftModal}
            handleSaveClick={saveDataInDraftAndCloseModal}
          />
        )}
      </div>
    </Fragment>
  );
};

const SkeletonLoader = ({ loading }) => {
  const tableData = useMemo(
    () => (loading ? Array(10).fill({}) : []),
    [loading]
  );

  return (
    <Box sx={{ width: "100%", pl: 2, pr: 2 }}>
      {tableData.map((_) => (
        <Skeleton height={50} />
      ))}
    </Box>
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

export default connect(mapStateToProps, mapDispatchToProps)(AllTickets);