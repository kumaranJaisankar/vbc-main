import React, { Fragment, useEffect, useState, useRef, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import {
  Container,
  Row,
  Col,
  Card,
  Modal,
  ModalHeader,
  ModalFooter,
  TabContent,
  TabPane,
  ModalBody,
  Button,
} from "reactstrap";
import moment from "moment";
import { ModalTitle, CopyText, Cancel, Close } from "../../../constant";
import { default as axiosBaseURL, adminaxios } from "../../../axios";
import AddLeads from "./addleads";
import LeadDetails from "./leaddetails";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
// import "react-data-table-component-extensions/dist/index.css";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import { classes } from "../../../data/layouts";
import { DefaultLayout as DefaultLayoutTheme } from "../../../layout/theme-customizer";
import { FilterContainer } from "./Filter/FilterContainer";
import { ImportContainer } from "./Import/ImportContainer";
import { CorrectLeadRow } from "./Import/correctLeadRow";
import { downloadExcelFile, downloadPdf } from "./Export";
import { leadStatus as leadStatusJson } from "./ConstatantData";
import UtilityBadge from "../../utilitycomponents/utilitybadge";
import PermissionModal from "../../common/PermissionModal";
import DeleteModal from "./DeleteModal";
import MUIButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { LEAD } from "../../../utils/permissions";
import REFRESH from "../../../assets/images/refresh.png";
import EXPORT from "../../../assets/images/export.png";
import FILTERS from "../../../assets/images/filters.png";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import KYCCIRCLE from "../../../assets/images/Customer-Circle-img/KycCircle.png";
import DCTCIRCLE from "../../../assets/images/Customer-Circle-img/DctCircle.png";
import PROVCIRCLE from "../../../assets/images/Customer-Circle-img/ProvisioningCircle.png";
import HLDCIRCLE from "../../../assets/images/Customer-Circle-img/HoldCircle.png";
import SPDCIRCLE from "../../../assets/images/Customer-Circle-img/SuspendedCircle.png";
import Tooltip from '@mui/material/Tooltip';
import { Spinner } from "reactstrap";



// import Button from "@mui/material/Button";
var storageToken = localStorage.getItem("token");
// var tokenAccess = "";
var token;
if (storageToken !== null) {
  token = JSON.parse(storageToken);
  // var tokenAccess = token?.access;
}

const All = (props) => {
  const leadPermissions = useMemo(() => {
    return Object.keys(LEAD).reduce((initialValue, currentValue) => {
      if (!initialValue[currentValue]) {
        initialValue[currentValue] = token.permissions.includes(
          LEAD[currentValue]
        );
        return initialValue;
      }
      return initialValue;
    }, {});
  }, []);
  const id = window.location.pathname.split("/").pop();
  const defaultLayout = Object.keys(DefaultLayoutTheme);
  const layout = id ? id : defaultLayout;

  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [filteredDataBkp, setFiltereddataBkp] = useState(data);
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState([]);
  const [rowlength, setRowlength] = useState({});
  const [assignedTo, setAssignedTo] = useState([]);
  const [modal, setModal] = useState();
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [isChecked, setIsChecked] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  const [importDivStatus, setImportDivStatus] = useState(false);
  const [validImportedData, setValidImportedData] = useState([]);
  const [invalidImportedData, setInvalidImportedData] = useState([]);
  const [sourceby, setSourceby] = useState([]);
  const [typeby, setTypeby] = useState([]);
  const [statusby, setStatusby] = useState([]);
  const [
    openSetImportPanelCloseConfirmationModal,
    setImportPanelCloseConfirmationModal,
  ] = useState(false);
  const [permissionmodal, setPermissionModal] = useState();
  const configDB = useSelector((content) => content.Customizer.customizer);
  const [sidebar_type] = useState(configDB.settings.sidebar.type);
  const [levelMenu, setLevelMenu] = useState(false);
  const [clearSelection, setClearSelection] = useState(false);
  const [isImportFlow, setIsImportFlow] = useState(false);
  const [notOpenLeadIdsForDelete, setNotOpenLeadIdsForDelete] = useState([]);
  // draft
  const [isDirty, setIsDirty] = useState(false);
  const [isDirtyModal, setisDirtyModal] = useState(false);
  const [formDataForSaveInDraft, setformDataForSaveInDraft] = useState({});
  const [selectedtab, setSelectedtab] = useState("All");

  const handleTableDataFilter = (status, isCount = false) => {
    setSelectedtab(status);
    switch (status) {
      case "All":
        if (isCount) {
          setRowlength((prevState) => {
            return {
              ...prevState,
              ["All"]: data.length,
            };
          });
        } else {
          setFiltereddata(data);
          setFiltereddataBkp(data);
        }
        break;
      case "qualified":
        if (isCount) {
          setRowlength((prevState) => {
            return {
              ...prevState,
              ["qualified"]: data.filter((item) => item.status === "QL").length,
            };
          });
        } else {
          setFiltereddata(data.filter((item) => item.status === "QL"));
          setFiltereddataBkp(data.filter((item) => item.status === "QL"));
        }
        break;
      case "converted":
        if (isCount) {
          setRowlength((prevState) => {
            return {
              ...prevState,
              ["converted"]: data.filter((item) => item.status === "CNC")
                .length,
            };
          });
        } else {
          setFiltereddata(data.filter((item) => item.status === "CNC"));
          setFiltereddataBkp(data.filter((item) => item.status === "CNC"));
        }
        break;
      case "notqualified":
        if (isCount) {
          setRowlength((prevState) => {
            return {
              ...prevState,
              ["notqualified"]: data.filter((item) => item.status === "UQL")
                .length,
            };
          });
        } else {
          setFiltereddata(data.filter((item) => item.status === "UQL"));
          setFiltereddataBkp(data.filter((item) => item.status === "UQL"));
        }
        break;

      case "Conversion":
        if (isCount) {
          setRowlength((prevState) => {
            return {
              ...prevState,
              ["Conversion"]: data.filter((item) => item.status === "LC")
                .length,
            };
          });
        } else {
          setFiltereddata(data.filter((item) => item.status === "LC"));
          setFiltereddataBkp(data.filter((item) => item.status === "LC"));
        }
        break;
      case "todayfollowups":
        let openleadlist = data.filter((item) => item.status === "OPEN");
        let todayfollowuplist = openleadlist.filter((ol) => {
          if (ol.follow_up) {
            var followupdate = moment(ol.follow_up).format("YYYY-MM-DD");
            let currentdate = moment().format("YYYY-MM-DD");
            if (ol.frequency === "DAILY") {
              return moment(followupdate).diff(currentdate, "day");
            } else if (ol.frequency === "WEEK") {
              return moment(followupdate).diff(currentdate, "day") % 7 === 0;
            } else if (ol.frequency === "MONTH") {
              return moment(followupdate).diff(currentdate, "day") % 30 === 0;
            } else {
              return false;
            }
          } else {
            return false;
          }
        });
        if (isCount) {
          setRowlength((prevState) => {
            return {
              ...prevState,
              ["todayfollowups"]: todayfollowuplist.length,
            };
          });
        } else {
          setFiltereddata(todayfollowuplist);
        }
        break;
      default:
        setFiltereddata(data);
    }
  };

  const Verticalcentermodaltoggle = () => {
    if (Verticalcenter == true) {
      setIsChecked([]);
      setClearSelection(true);
    }

    if (isChecked.length > 0) {
      let selectedIdsForDelete = [...isChecked];
      let notOpenLeadIds = selectedIdsForDelete.filter((id) => {
        let data = filteredData.find((d) => d.id == id);
        return data.status !== "OPEN";
      });
      setNotOpenLeadIdsForDelete(notOpenLeadIds);
      setVerticalcenter(!Verticalcenter);
    } else {
      toast.error("Please select any record", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    }
  };

  let history = useHistory();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  let DefaultLayout = {};
  const OnLevelMenu = (menu) => {
    setLevelMenu(!menu);
  };

  useEffect(() => {
    setLoading(true);
    const defaultLayoutObj = classes.find(
      (item) => Object.values(item).pop(1) === sidebar_type
    );
    const modifyURL =
      process.env.PUBLIC_URL +
      "/dashboard/default/" +
      Object.keys(defaultLayoutObj).pop();
    const id =
      window.location.pathname === "/"
        ? history.push(modifyURL)
        : window.location.pathname.split("/").pop();
    // fetch object by getting URL
    const layoutobj = classes.find((item) => Object.keys(item).pop() === id);
    const layout = id ? layoutobj : defaultLayoutObj;
    DefaultLayout = defaultLayoutObj;
    handlePageLayputs(layout);

    //  lead cashing
    if (refresh === 1) {
      props.getAllLeads();
    }
  }, [refresh]);

  useEffect(() => {
    if (props.allLeads) {
      setData(props.allLeads);
      setFiltereddataBkp(props.allLeads);
      setFiltereddata(props.allLeads);
      setLoading(false);
      setRefresh(0);
    }
  }, [props.allLeads]);
  useEffect(() => {
    if (data) {
      handleTableDataFilter("All", true);
      handleTableDataFilter("qualified", true);
      handleTableDataFilter("todayfollowups", true);
      handleTableDataFilter("notqualified", true);
      handleTableDataFilter("Conversion", true);
      handleTableDataFilter("converted", true);

      handleTableDataFilter(selectedtab, true);
      handleTableDataFilter(selectedtab, false);
    }
  }, [data]);

  useEffect(() => {
    setExportData({
      ...exportData,
      data: filteredData,
    });
  }, [filteredData]);

  const update = (newRecord, invalidImportedDataList) => {
    Refreshhandler();
    setData([newRecord, ...data]);
    if (
      (invalidImportedDataList && invalidImportedDataList.length === 0) ||
      !invalidImportedDataList
    ) {
      closeCustomizer(false);
    }
  };

  // update reacord
  const detailsUpdate = (updatedata) => {
    Refreshhandler();
    setFiltereddata((prevFilteredData) =>
      prevFilteredData.map((data) =>
        data.id == updatedata.id ? updatedata : data
      )
    );
    closeCustomizer(false);
  };

  //filter search
  const handlesearchChange = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = filteredDataBkp.filter((filteredDataBkp) => {
      if (
        filteredDataBkp.mobile_no.search(value) != -1 ||
        filteredDataBkp.first_name.toLowerCase().search(value) != -1 ||
        filteredDataBkp.email.toLowerCase().search(value) !== -1
      )
        return filteredDataBkp;
    });
    setFiltereddata(result);
  };

  //delete button
  const deleteRows = (selected) => {
    setClearSelection(false);
    let rows = selected.map((ele) => ele.id);
    setIsChecked([...rows]);
  };

  const toggle = () => {
    setModal(!modal);
  };

  // const closeCustomizer = (value) => {
  //   setIsImportFlow(false);
  //   // setImportPanelCloseConfirmationModal(false);
  //   setRightSidebar(false);
  //   // draft
  //   if (isDirty && value) {
  //     setisDirtyModal(true);
  //   } else {
  //     closeDirtyModal();
  //   }
  // };
  const closeCustomizer = () => {
    setRightSidebar(false);
    document.querySelector(".customizer-contain").classList.remove("open");
    if (window.location.search !== "") {
      history.replace({
        search: "",
      });
    }
    setLead({});
  };
  const openCustomizer = (type, id) => {
    if (id) {
      setLead(id);
    }
    // draft store value
    const getLocalDraftKey = localStorage.getItem("plansDraftSaveKey");
    if (!!getLocalDraftKey) {
      const getLocalDraftData = localStorage.getItem(getLocalDraftKey);
      setLead(JSON.parse(getLocalDraftData));
    }
    setActiveTab1(type);
    setRightSidebar(true);
    // if (rightSidebar) {
    document.querySelector(".customizer-contain").classList.add("open");
    // }
  };

  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    history.push(key);
  };

  // assign options
  useEffect(() => {
    adminaxios.get("accounts/options/all").then((res) => {
      let { users } = res.data;
      setAssignedTo([...users]);
    });
  }, []);

  //refresh
  const Refreshhandler = () => {
    setRefresh(1);
    if (searchInputField.current) searchInputField.current.value = "";
  };
  const searchInputField = useRef(null);
  // apply color for status
  {/*Sailaja added QL: "Qualified Lead", (Line no 428) on 11th July Ref LED-07*/ }
  
  const leadStatus = {
    OPEN: "Open",
    CBNC: "Closed But Not Converted",
    LC: "Lead Conversion",
    CNC: "Closed And Converted",
    UQL: "Non Feasible Lead",
    QL: "Qualified Lead",
  };

  const columns = [
    // {
    //   name: "",
    //   selector: "action",
    //   width: "80px",
    //   center: true,
    //   cell: (row) => (
    //     <MoreActions
    //     />
    //   ),
    // },
    // {
    //   name: <b className="Table_columns"  >{"ID"}</b>,
    //   selector: "id",
    //   cell: (row) => (
    //     <>
    //       {leadPermissions.READ ? (
    //         <a
    //           onClick={() => openCustomizer("3", row)}
    //           style={{ cursor: "pointer", fontWeight: 600 }}
    //           className="openmodal"
    //           // id="columns_alignment"
    //         >
    //           L{row.id}
    //         </a>
    //       ) : (
    //        <span  id="columns_alignment"> {row.id}</span>
    //       )}
    //     </>
    //   ),
    //   sortable: false,
    //   sortIcon: (
    //     <i
    //       className="icofont icofont-ui-delete"
    //       style={{
    //         color: "white",
    //         fontSize: "21px",
    //         cursor: "pointer",
    //       }}
    //     ></i>
    //   ),
    // },
    {
      name: <b className="Table_columns">{"First Name"}</b>,
      selector: "first_name",
      // cell: (row) => (
      //   <div  id="columns_width" style={{ whiteSpace: "nowrap" ,posision:"relative",right:"100px"}}>
      //     {row.first_name}
      //   </div>
      // ),

      cell: (row) => (
        <>
          {leadPermissions.READ ? (
            <a
              onClick={() => openCustomizer("3", row)}
              style={{
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontWeight: 600,
              }}
              className="openmodal First_Letter"
            // id="columns_alignment"
            >
              {row.first_name}
            </a>
          ) : (
            <span style={{ whiteSpace: "nowrap" }} className="First_Letter">
              {" "}
              {row.first_name}
            </span>
          )}
        </>
      ),
      sortable: false,
    },
    {
      name: <b className="Table_columns">{"Last Name"}</b>,
      selector: "last_name",
      cell: (row) => <div className="First_Letter">{row.last_name}</div>,
      sortable: false,
    },

    {
      name: (
        <b className="Table_columns" id="columns_width">
          {"Mobile Number"}
        </b>
      ),
      selector: "mobile_no",
      cell: (row) => (
        <div id="columns_width" c>
          {row.mobile_no}
        </div>
      ),
      sortable: false,
    },
    {
      name: (
        <b className="Table_columns" id="columns_width">
          {"Email"}
        </b>
      ),
      selector: "email",
      cell: (row) => (
        <div
          className="ellipsis "
          title={row.email}
          style={{ color: "#285295" }}
          id="columns_width"
        >
          {row.email}
        </div>
      ),
      sortable: false,
    },
    //   Sailaja added className="figma_circle (Line no 569) on 11th July Ref LED-07*
    {
      name: (
        <b className="CustomerTable_columns " id="columns_width">
          {"Status"}
        </b>
      ),
      selector: "status",
      sortable: false,
      cell: (row) => {
        return (
          <div id="columns_width" style={{ whiteSpace: "nowrap" }} className="">
            {row.status === "OPEN" ? (
              <img src={PROVCIRCLE} />
            ) : row.status === "LC" ? (
              <img src={KYCCIRCLE} />
            ) : row.status === "CNC" ? (
              <img src={DCTCIRCLE} />
            ) : row.status === "UQL" ? (
              <img src={SPDCIRCLE} />
            ) : row.status === "CBNC" ? (
              <img src={HLDCIRCLE} />
            ) : row.status === "QL" ? (
              <span className="figma_circle" />
            ) : (
              ""
            )}
            &nbsp; &nbsp;
            <Typography variant="caption">{leadStatus[row.status]}</Typography>
          </div>
        );
      },
      // cell: (row) => {
      //   let statusObj = leadStatusJson.find((s) => s.id == row.status);

      //   return <span>{statusObj ? statusObj.name : "-"}</span>;
      // },
    },
    {
      name: <b className="Table_columns ">{"Source"}</b>,
      selector: "lead_source.name",
      sortable: false,
      cell: (row) => {
        return <span>{row.lead_source ? row.lead_source.name : "-"}</span>;
      },
    },
    {
      name: <b className="Table_columns">{"Type"}</b>,
      selector: "type.name",
      sortable: false,
      cell: (row) => {
        return <span>{row.type ? row.type.name : "-"}</span>;
      },
    },
    {
      name: <b className="Table_columns">{"Address"}</b>,
      sortable: false,

      cell: (row) => (
        <div
          className="ellipsis First_Letter"
          title={`${row.house_no},${row.street},${row.landmark},${row.city},${row.district},${row.state},${row.country},${row.pincode}`}
        >
          {`${row.house_no},${row.street},${row.landmark},${row.city},${row.district},${row.state},${row.country},${row.pincode}`}
        </div>
      ),
    },

    {
      name: <b className="Table_columns">{"Assigned To"}</b>,
      selector: "assigned_to",
      sortable: false,
      cell: (row) => {
        let statusObj = assignedTo.find((s) => s.id == row.assigned_to);

        return <span>{row.assigned_to ? row.assigned_to : "---"}</span>;
      },
    },
    {
      name: <b className="Table_columns">{"Notes"}</b>,
      selector: "notes",
      sortable: false,
      cell: (row) => <div>{row.notes}</div>,
    },

    {
      name: "",
      selector: "",
    },
  ];
  // Sailaja Changed Leads_Export Buttons columns as per order of Data Table on 14th June.
  const headersForExportFile = [
    ["all", "All"],
    // ["id", "ID"],
    ["first_name", "First Name"],
    ["last_name", "Last Name"],
    ["mobile_no", "Mobile No"],
    // ["alternate_mobile_no", "Alternate Mobile No"],
    ["email", "Email"],
    ["status", "Status"],
    ["lead_source", "Source"],
    ["type", "Type"],
    ["address", "Address"],
    ["assigned_to", "Assigned To"],
    ["notes", "Notes"],
    // ["lead_source", "Lead Source"],



  ];

  const headersForExcel =[
    ["all", "All"],
    // ["id", "ID"],
    ["first_name", "First Name"],
    ["last_name", "Last Name"],
    ["mobile_no", "Mobile No"],
    // ["alternate_mobile_no", "Alternate Mobile No"],
    ["email", "Email"],
    ["status", "Status"],
    ["lead_source", "Source"],
    ["type", "Type"],
    ["address", "Address"],
    ["assigned_to", "Assigned To"],
    ["notes", "Notes"],
    // ["lead_source", "Lead Source"],
  ]
  const [exportData, setExportData] = useState({ columns: columns });

  document.addEventListener("mousedown", (event) => {
    const concernedElement = document.querySelector(".filter-container");

    if (concernedElement && concernedElement.contains(event.target)) {
      setLevelMenu(true);
    } else {
      if (event.target.className !== "btn btn-primary nav-link") {
        if (event.target.className !== "icon-filter") {
          setLevelMenu(false);
        }
      }
    }
  });

  document.addEventListener("mousedown", (event) => {
    const concernedElement = document.querySelector(".import-container");

    if (concernedElement && concernedElement.contains(event.target)) {
      setImportDivStatus(true);
    } else {
      if (event.target.className !== "btn btn-primary") {
        if (event.target.className !== "icon-import") {
          setImportDivStatus(false);
        }
      }
    }
  });

  const openCorrectDataPanel = () => {
    openCustomizer("4");
  };

  const setImportedData = (validImportedData, invalidData) => {
    setValidImportedData(validImportedData);
    setInvalidImportedData(invalidData);
  };

  //filter lead source
  useEffect(() => {
    axiosBaseURL
      .get("/radius/lead/options")
      .then((res) => {
        let { lead_source, type, status } = res.data;
        setSourceby([...lead_source]);
        setTypeby([...type]);
        setStatusby([...status]);
      })
      .catch((err) => console.log("Something went wrong"));
  }, []);

  const conditionalRowStyles = [
    {
      when: (row) => row.selected === true,
      style: {
        backgroundColor: "#E4EDF7",
      },
    },
  ];
  //download export files
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
  // Sailaja Changed PDF name as Leads( Line No 768) on 14th July
  const handleExportDataAsPDF = (headersForPDF) => {
    setIsExportDataModalToggle(!isExportDataModalOpen);
    const title = `${selectedtab} Leads`;
    downloadPdf(title, headersForPDF, filteredData, "Leads");
    // downloadPdf(title, headersForPDF, filteredData, "leads_report");
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
    setIsLoading(false);
    if (downloadAs === "pdf") {
      handleExportDataAsPDF(headersForPDF);
    } else {
      // downloadExcelFile(downloadableData, downloadAs, headers);
      downloadExcelFile(downloadableData,downloadAs, headersForExcelFiltered);

    }
    toggleDropdown();
    setHeadersForExport([]);
    setFilteredDataForModal(filteredData);
    setIsExportDataModalToggle(false);
  };
  //modal for insufficient modal
  const permissiontoggle = () => {
    setPermissionModal(!permissionmodal);
  };
  //end

  //draft start
  const saveDataInDraftAndCloseModal = () => {
    localStorage.setItem("plans/", JSON.stringify(formDataForSaveInDraft));
    localStorage.setItem("plansDraftSaveKey", "plans/");

    setisDirtyModal(false);
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
    setIsDirty(false);
  };

  const setIsDirtyFun = (val) => {
    setIsDirty(val);
  };
  const closeDirtyModal = () => {
    setisDirtyModal(false);
    setRightSidebar(false);
    document.querySelector(".customizer-contain").classList.remove("open");
    localStorage.removeItem("plans/");
    localStorage.removeItem("plansDraftSaveKey");
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
  // useOutsideAlerter(box);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      // Function for click event
      function handleOutsideClick(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          if (!event.target.className.includes("openmodal")) {
            closeCustomizer();
          }
        }
      }

      // Adding click event listener
      document.addEventListener("click", handleOutsideClick);
    }, [ref]);
  }

  //end
  const [anchorEl, setAnchorEl] = React.useState(null);
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


  // function for checkbox selection in dataTable
  const NewCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
    <div className="checkbox_header">
      <input
        htmlFor="check"
        type="checkbox"
        class="new-checkbox"
        ref={ref}
        onClick={onClick}
        {...rest}
      />
      <label className="form-check-label" id="check" />
    </div>
  ));
  const styles = {
    Active: {
      marginTop: "0px",
    },
    Inactive: {
      marginTop: "46px",
    },
    Hold: {
      marginTop: "40px",
    },
  };
//  Sailaja added for Export Download Button Loader on 27th April 2023
const [isLoading, setIsLoading] = useState(false);
  return (
    <Fragment>
      <div ref={ref}>
        <br />
        <Container fluid={true}>
          <Grid container spacing={1} id="breadcrumb_margin">
            <Grid item md="12" >
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={
                  <NavigateNextIcon
                    fontSize="small"
                    className="navigate_icon"
                  />
                }
              >
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color=" #377DF6"
                  fontSize="14px"
                >
                  Customer Relations
                </Typography>
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color="#00000 !important"
                  fontSize="14px"
                  className="last_typography"
                >
                  Leads
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <br />
          <br />
          <div className="edit-profile data_table" id="breadcrumb_table">

            <Stack direction="row" spacing={2}>
              <span className="all_cust"> Leads</span>

              <FilterContainer
                levelMenu={levelMenu}
                setLevelMenu={setLevelMenu}
                filteredData={filteredData}
                setFiltereddata={setFiltereddata}
                filteredDataBkp={filteredDataBkp}
                loading={loading}
                setLoading={setLoading}
                showTypeahead={false}
                sourceby={sourceby}
              />

              {/* {
                leadPermissions.DELETE &&
                <MUIButton
                style={{paddingLeft:"23px"}}
                  onClick={Verticalcentermodaltoggle}
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                ></MUIButton>
              } */}
              {/* <div style={{position:'relative',left:'350px'}}> */}
              <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }} style={{width:"87%"}}>
                <Paper component="div" className="search_bar">
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search With First Name, Mobile or Email"
                    inputProps={{ "aria-label": "search google maps" }}
                    onChange={(event) => handlesearchChange(event)}
                  />
                  <IconButton
                    type="submit"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </Paper>

                {/* export */}
                {/*Sailaja Added Export Tool Tip on 11th July Ref LED-02 */}
                {/* Sailaja added div for Export,Import,Refresh,Filter Buttons positions after fix filter textbox on 2nd August  */}
                <div>
                  {leadPermissions.EXPORT && (
                    <Tooltip title={"Export"}>
                      <MUIButton
                        className="muibuttons"
                        variant="outlined"
                        onClick={handleClick}
                      >
                        <img src={EXPORT} className="Header_img" />
                      </MUIButton>
                    </Tooltip>
                  )}

                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={() => handleExportDataModalOpen("csv")}>
                      Export CSV
                    </MenuItem>
                    <MenuItem onClick={() => handleExportDataModalOpen("excel")}>
                      Export XLS
                    </MenuItem>
                    <MenuItem onClick={() => handleExportDataModalOpen("pdf")}>
                      Export PDF
                    </MenuItem>
                  </Menu>
                  {/* import */}
                  {/*Sailaja Added Import Tool Tip on 11th July Ref LED-02 */}
                  {leadPermissions.IMPORT && (
                    <Tooltip title={"Import"}>
                      <MUIButton
                        className="muibuttons"
                        onClick={() => setImportDivStatus(!importDivStatus)}
                        variant="outlined"
                      >
                        <img
                          src={EXPORT}
                          className="Header_img"
                          style={{ transform: "rotateY(180deg)" }}
                        />
                      </MUIButton>
                    </Tooltip>
                  )}
                  <ImportContainer
                    setIsImportFlow={setIsImportFlow}
                    setImportDivStatus={setImportDivStatus}
                    importDivStatus={importDivStatus}
                    setFiltereddata={setFiltereddata}
                    openCorrectDataPanel={openCorrectDataPanel}
                    setImportedData={setImportedData}
                    onUpdate={update}
                  />
                  {/* refrsh */}
                  <Tooltip title={"Refresh"}>
                    <MUIButton
                      onClick={Refreshhandler}
                      className="muibuttons"
                      variant="outlined"
                    >
                      <img src={REFRESH} className="Header_img" />
                    </MUIButton>
                  </Tooltip>
                  {/* filter */}
                  {/*Sailaja Added Filter Tool Tip on 11th July Ref LED-02 */}
                  {leadPermissions.FILTERS && (
                    <Tooltip title={"Filter"}>
                      <MUIButton
                        className="muibuttons"
                        onClick={() => OnLevelMenu(levelMenu)}
                        variant="outlined"
                      >
                        <img src={FILTERS} className="Header_img" />
                      </MUIButton>
                    </Tooltip>
                  )}
                </div>

                {/* Sailaja Changed id to reduce size of New Button on 15th July  */}

                {/* new */}
                {leadPermissions.CREATE && (
                  <button
                    className="btn btn-primary openmodal"
                    id="newbuuon"
                    fontSize="16px"

                    type="submit"
                    onClick={() => openCustomizer("2")}
                  >
                    {/* //Below  New  &nbsp;&nbsp; Modified by sailaja on 11th July Ref LED-05 */}
                    {/* Sailaja Reduced New Button Size on 15th July Line no1065 Ref LED -LED-26 */}
                    <b>
                      <span className="openmodal" style={{ fontSize: "16px", position: "relative", left: "-27%" }}>
                        New
                      </span>
                      <i
                        className="icofont icofont-plus openmodal"
                        style={{
                          cursor: "pointer",
                        }}
                      ></i>
                    </b>
                  </button>
                )}
              </Stack>
              {/* </div> */}
            </Stack>



            <Row>
              <Col md="12" style={{ marginTop: "9px" }}>
                <UtilityBadge
                  handleTableDataFilter={handleTableDataFilter}
                  rowlength={rowlength}
                  setSelectedtab={setSelectedtab}
                  currentTab={selectedtab}
                />
              </Col>


              <Col md="12">
                <Card style={{ borderRadius: "0", boxShadow: "none" }}>
                  <Col xl="12" style={{ padding: "0" }}>
                    <nav aria-label="Page navigation example">
                      {props.loading ? (
                        <Skeleton
                          count={11}
                          height={30}
                          style={{ marginBottom: "10px", marginTop: "15px" }}
                        />
                      ) : (
                        <div className="data-table-wrapper">
                          <Col md="8"></Col>

                          <DataTable
                            className="leadTable"
                            columns={columns}
                            data={filteredData}
                            selectableRows
                            selectableRowsComponent={NewCheckbox}
                            onSelectedRowsChange={({ selectedRows }) => (
                              handleSelectedRows(selectedRows),
                              deleteRows(selectedRows)
                            )}
                            noHeader
                            clearSelectedRows={clearSelectedRows}
                            pagination
                            noDataComponent={"No Data"}
                            // clearSelectedRows={clearSelection}
                            conditionalRowStyles={conditionalRowStyles}
                          />
                        </div>
                      )}
                    </nav>
                  </Col>
                  <br />
                </Card>
              </Col>

              <Row>
                <Col md="12">
                  <div
                    className="customizer-contain"
                    ref={box}
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
                          padding: "30px 25px",
                          borderTopLeftRadius: "20px",
                        }}
                      ></div>
                      {/* Sailaja Changed position of close icon on 15th JULY REF LED-27 */}
                      <span>
                        <i
                          className="icon-close"
                          style={{
                            marginTop: "-39px",
                            float: "right",
                            marginRight: "38px",
                            cursor: "pointer",
                            color: "#000000",
                            fontSize: "medium",
                            fontWeight: "Bold",
                          }}
                          onClick={() => closeCustomizer(true)}
                        // onClick={() =>
                        //   isImportFlow
                        //     ? setImportPanelCloseConfirmationModal(true)
                        //     : closeCustomizer(true)
                        // }
                        ></i>
                      </span>
                    </div>

                    <Modal
                      isOpen={openSetImportPanelCloseConfirmationModal}
                      toggle={() =>
                        setImportPanelCloseConfirmationModal(
                          !openSetImportPanelCloseConfirmationModal
                        )
                      }
                      className="modal-body"
                      centered={true}
                    >
                      <ModalHeader
                        toggle={() =>
                          setImportPanelCloseConfirmationModal(
                            !openSetImportPanelCloseConfirmationModal
                          )
                        }
                      >
                        Confirmation
                      </ModalHeader>
                      <ModalBody>
                        <p>
                          Your imported file will not be saved.Do you still want
                          to close?
                        </p>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="primary" onClick={closeCustomizer}>
                          Yes
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() =>
                            setImportPanelCloseConfirmationModal(
                              !openSetImportPanelCloseConfirmationModal
                            )
                          }
                        >
                          {Cancel}
                        </Button>
                      </ModalFooter>
                    </Modal>
                    <div className="tab-content" id="c-pills-tabContent">
                      <Modal
                        isOpen={modal}
                        toggle={toggle}
                        className="modal-body"
                        centered={true}
                      >
                        <ModalHeader toggle={toggle}>{ModalTitle}</ModalHeader>
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
                          <Button color="secondary" onClick={toggle}>
                            {Cancel}
                          </Button>
                        </ModalFooter>
                      </Modal>

                      <div className="customizer-body custom-scrollbar">
                        <TabContent activeTab={activeTab1}>
                          <TabPane tabId="2">
                            <div id="headerheading"> Add New Lead </div>
                            <ul
                              className="layout-grid layout-types"
                              style={{ border: "none" }}
                            >
                              <li
                                data-attr="compact-sidebar"
                                onClick={(e) => handlePageLayputs(classes[0])}
                              >
                                <div className="layout-img">
                                  {activeTab1 == "2" && (
                                    <AddLeads
                                      setIsImportFlow={setIsImportFlow}
                                      dataClose={closeCustomizer}
                                      onUpdate={(data) => update(data)}
                                      rightSidebar={rightSidebar}
                                      // draft
                                      setIsDirtyFun={setIsDirtyFun}
                                      setformDataForSaveInDraft={
                                        setformDataForSaveInDraft
                                      }
                                      lead={lead}
                                      //calling reset after draft
                                      setLead={setLead}
                                    />
                                  )}
                                </div>
                              </li>
                            </ul>
                          </TabPane>
                          <TabPane tabId="3">
                            <div id="headerheading">
                              {" "}
                              Lead Information : <span className="First_Letter1">{lead.first_name}</span>
                            </div>
                            {activeTab1 == "3" && (
                              <LeadDetails
                                lead={lead}
                                onUpdate={(data) => detailsUpdate(data)}
                                rightSidebar={rightSidebar}
                                dataClose={closeCustomizer}
                                openCustomizer={openCustomizer}
                              />
                            )}
                          </TabPane>
                          <TabPane tabId="4">
                            <div id="headerheading"> Lead Data </div>
                            {/* <h6 style={{ textAlign: "center" }}> Lead Data </h6> */}
                            <ul
                              className="layout-grid layout-types"
                              style={{ border: "none", overflow: "hidden" }}
                            >
                              <li
                                data-attr="compact-sidebar"
                                onClick={(e) => handlePageLayputs(classes[0])}
                              >
                                <div className="layout-img">
                                  <CorrectLeadRow
                                    dataClose={closeCustomizer}
                                    onUpdate={(data) => update(data)}
                                    inVaildData={invalidImportedData}
                                    setFiltereddata={setFiltereddata}
                                    sourceby={sourceby}
                                    typeby={typeby}
                                    statusby={statusby}
                                  />
                                </div>
                              </li>
                            </ul>
                          </TabPane>
                        </TabContent>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <DeleteModal
                visible={Verticalcenter && isChecked.length > 0}
                handleVisible={Verticalcentermodaltoggle}
                isChecked={isChecked}
                // tokenAccess={tokenAccess}
                setFiltereddata={setFiltereddata}
                setClearSelectedRows={setClearSelectedRows}
                setIsChecked={setIsChecked}
                setClearSelection={setClearSelection}
                notOpenLeadIdsForDelete={notOpenLeadIdsForDelete}
              />
              <PermissionModal
                visible={permissionmodal}
                handleVisible={permissiontoggle}
                content={"You are not authorized to access this page"}
              />
              {/* end */}
              {/* draft modal start*/}
              <Modal
                isOpen={isDirtyModal}
                toggle={() => setisDirtyModal(!isDirtyModal)}
                className="modal-body"
                centered={true}
              >
                <ModalHeader toggle={() => setisDirtyModal(!isDirtyModal)}>
                  {"Confirmation"}
                </ModalHeader>
                <ModalBody>Do you want to save this data in draft?</ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    className="notification"
                    onClick={saveDataInDraftAndCloseModal}
                  >
                    {"Save as Draft"}
                  </Button>
                  {/* Sailaja Changed close button Styles (Line Number 1351)on 13th July */}

                  <Button id="resetid" onClick={() => closeDirtyModal()}>
                    {"Close"}
                  </Button>
                </ModalFooter>
              </Modal>
              {/* draft modal end */}

              {/* export */}

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
                {/* Sailaja Commented(1412to 1422) & added  Cancel & Download Button colors(1393,1411) on 14th July Line no:1272       */}

                <ModalFooter>
                  <Button
                    color="secondary"
                    id="resetid"
                    onClick={handleExportclose}
                  // onClick={() => setIsExportDataModalToggle(false)}
                  >
                    {Close}
                  </Button>
                  {/* <button
                    // color="primary"
                    className="btn btn-primary openmodal"
                    id="download_button1"
                    onClick={() => handleDownload()}
                    disabled={headersForExport.length > 0 ? false : true}
                  >
                    <span className="openmodal">
                      Download
                    </span>
                  </button> */}
                  {/* <Button color="secondary" id="resetid" onClick={handleExportclose}>
                    {Close}
                  </Button>
                  <Button
                    disabled={headersForExport.length > 0 ? false : true}
                    color="primary"
                    id="download_button"
                    onClick={() => handleDownload()}
                  >
                    Download
                  </Button> */}
                  {/* Sailaja commented off the above button  & Added below button for Export Download Button Loader on 27th April 2023 */}
                  <button
                    // color="primary"
                    className="btn btn-primary openmodal"
                    id="download_button1"
                    onClick={handleDownload}
                    disabled={isLoading || (headersForExport.length > 0 ? false : true)}
                  >
                    {isLoading ? <Spinner size="sm" /> : null}
                    &nbsp;&nbsp;
                    Download
                  </button>

                </ModalFooter>
              </Modal>
              {/* end export */}
            </Row>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default All;
