import React, {
  Fragment,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import Skeleton from "react-loading-skeleton";
import moment from "moment";
// import Breadcrumb from "../../layout/breadcrumb";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  TabContent,
  TabPane,
  ModalBody,
  // Tooltip,
} from "reactstrap";
import {  ModalTitle, CopyText, Cancel } from "../../../constant";
import { franchiseaxios } from "../../../axios";
import AddFranchise from "./addfranchise";
import { FranchiseFilterContainer } from "./franchisefilter/FranchiseFilterContainer";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { downloadExcelFile, downloadPdf } from "./Export";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout_From_Firebase } from "../../../utils";
import PermissionModal from "../../common/PermissionModal";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import { classes } from "../../../data/layouts";
import { AllFranchiseDetails } from "./franchisedetails/allfranchisedetails";
import Stack from "@mui/material/Stack";
import MUIButton from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { FRANCHISE } from "../../../utils/permissions";
import FILTERS from "../../../assets/images/filters.png";
import REFRESH from "../../../assets/images/refresh.png";
import EXPORT from "../../../assets/images/export.png";
import Grid from "@mui/material/Grid";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Tooltip from '@mui/material/Tooltip';
import {nasType} from "../project/nas/nasdropdown"

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const FranchiseList = (props, initialValues) => {
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState([]);
  const width = useWindowSize();

  //exportData
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const [modal, setModal] = useState();
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [failed, setFailed] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  // draft
  const [isDirty, setIsDirty] = useState(false);
  const [isDirtyModal, setisDirtyModal] = useState(false);
  const [formDataForSaveInDraft, setformDataForSaveInDraft] = useState({});
  const [permissionModalText, setPermissionModalText] = useState(
    "You are not authorized for this action"
  );
  //filter show and hide menu
  const [levelMenu, setLevelMenu] = useState(false);
  //taking backup for original data
  const [filteredDataBkp, setFiltereddataBkp] = useState(data);
  //modal state for insufficient permissions
  const [permissionmodal, setPermissionModal] = useState();

  const [franchiseType, setFranchiseType] = useState([]);
  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  const [clearSelection, setClearSelection] = useState(false);
  const Verticalcentermodaltoggle = () => {
    if (Verticalcenter == true) {
      setIsChecked([]);
      setClearSelection(true);
    }

    if (isChecked.length > 0) {
      setVerticalcenter(!Verticalcenter);
    } else {
      toast.error("Please select any record", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      // return false;
    }
  };
  let history = useHistory();

  const dispatch = useDispatch();

  let DefaultLayout = {};

  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize(window.innerWidth);
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
  }

  // useEffect(() => {
  //   setLoading(true);
  //   const defaultLayoutObj = classes.find(
  //     (item) => Object.values(item).pop(1) === sidebar_type
  //   );
  //   const modifyURL =
  //     process.env.PUBLIC_URL +
  //     "/dashboard/default/" +
  //     Object.keys(defaultLayoutObj).pop();
  //   const id =
  //     window.location.pathname === "/"
  //       ? history.push(modifyURL)
  //       : window.location.pathname.split("/").pop();
  //   // fetch object by getting URL
  //   const layoutobj = classes.find((item) => Object.keys(item).pop() === id);
  //   const layout = id ? layoutobj : defaultLayoutObj;
  //   DefaultLayout = defaultLayoutObj;
  //   handlePageLayputs(layout);

  //   // list of franchise api
  //   franchiseaxios
  //     .get(`franchise/display`)
  //     // .then((res) => setData(res.data))
  //     .then((res) => {
  //       setData(res.data);
  //       console.log(res.data);
  //       setFiltereddata(res.data);
  //       setLoading(false);
  //       setRefresh(0);
  //     })
  //     .catch((error) => {
  //       const { code, detail, status } = error;
  //       const errorString = JSON.stringify(error);
  //       const is500Error = errorString.includes("500");
  //       if (detail === "INSUFFICIENT_PERMISSIONS") {
  //         //calling the modal here
  //         permissiontoggle();
  //       } else if (is500Error) {
  //         setPermissionModalText("Something went wrong !");
  //         permissiontoggle();
  //       } else if (
  //         code === "In-valid token. Please login again" ||
  //         detail === "In-valid token. Please login again"
  //       ) {
  //         logout();
  //       } else {
  //         toast.error("Something went wrong", {
  //           position: toast.POSITION.TOP_RIGHT,
  //           autoClose: 1000,
  //         });
  //       }
  //     });
  // }, [refresh]);

  const logout = () => {
    logout_From_Firebase();
    history.push(`${process.env.PUBLIC_URL}/login`);
  };

  useEffect(() => {
    setExportData({
      ...exportData,
      data: filteredData,
    });
  }, [filteredData]);

  // new records update in table

  const update = (newRecord) => {
    console.log(newRecord);
    Refreshhandler();
    setData([...data, newRecord]);
    // setFiltereddata([...data, newRecord]);
    setFiltereddata((prevFilteredData) => [newRecord, ...prevFilteredData]);
    closeCustomizer(false);
  };

  // edit details update function

  const detailsUpdate = (updatedata) => {
    console.log(updatedata);
    Refreshhandler();
    setData([...data, updatedata]);
    // setFiltereddata((prevFilteredData) => [...prevFilteredData, updatedata]);
    setFiltereddata((prevFilteredData) =>
      prevFilteredData.map((data) =>
        data.id == updatedata.id ? updatedata : data
      )
    );
    closeCustomizer(false);
  };

  //   //filter
  const handlesearchChange = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = data.filter((data) => {
      console.log(data);
      if (
        data.name.toLowerCase().search(value) != -1 ||
        data.code.toLowerCase().search(value) != -1
      )
        return data;
    });
    setFiltereddata(result);
  };
// changes made by marieya
  // delete api for multiple rows in franchise list
  // const onDelete = () => {
  //   let dat = { ids: isChecked };
  //   fetch(
  //     `${process.env.REACT_APP_API_URL_FRANCHISE}/franchise/delete/multiple`,
  //     {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${tokenAccess}`,
  //       },
  //       body: JSON.stringify(dat),
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       var difference = [];
  //       if (data.length > 0) {
  //         difference = [...isChecked].filter((x) => data.indexOf(x) === -1);
  //         setFailed([...data]);
  //       } else {
  //         difference = [...isChecked];
  //       }
  //       setFiltereddata((prevState) => {
  //         var newdata = prevState.filter(
  //           (el) => difference.indexOf(el.id) === -1
  //         );
  //         return newdata;
  //       });
  //       Verticalcentermodaltoggle();
  //       setClearSelectedRows(true);
  //       console.log(filteredData);

  //       setIsChecked([]);
  //       setClearSelection(true);
  //       if (data.length > 0) {
  //       }
  //     });
  // };

  //delete
  const deleteRows = (selected) => {
    setClearSelection(false);
    let rows = selected.map((ele) => ele.id);
    setIsChecked([...rows]);

    console.log(rows);
  };

  const toggle = () => {
    setModal(!modal);
  };
  const closeCustomizer = (value) => {
    // draft
    if (isDirty && value) {
      setisDirtyModal(true);
    } else {
      closeDirtyModal();
    }
  };

  //onside click hide sidebar
  const box = useRef(null);
  // useOutsideAlerter(box);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      // Function for click event
      function handleOutsideClick(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          if (
            rightSidebar &&
            !event.target.className.includes("openmodal") &&
            !event.target.className.includes("ant-select-tree") &&
            !event.target.className.includes("react-datepicker__day") &&
            !event.target.className.includes(
              "react-datepicker__navigation--previous"
            )
          ) {
            closeCustomizer();
          }
        }
      }

      // Adding click event listener
      document.addEventListener("click", handleOutsideClick);
    }, [ref]);
  }
  //end

  const openCustomizer = (type, id) => {
    // document.addEventListener("mousedown", closeCustomizer);

    console.log(id);
    if (id) {
      setLead(id);
    }
    // draft store value
    const getLocalDraftKey = localStorage.getItem("franchiseDraftSaveKey");
    if (!!getLocalDraftKey) {
      const getLocalDraftData = localStorage.getItem(getLocalDraftKey);
      setLead(JSON.parse(getLocalDraftData));
    }
    setActiveTab1(type);
    setRightSidebar(!rightSidebar);
    // if (rightSidebar) {
    document.querySelector(".customizer-contain").classList.add("open");
  };

  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    history.push(key);
  };

  //refresh
  const Refreshhandler = () => {
    setRefresh(1);
    if (searchInputField.current) searchInputField.current.value = "";
  };

  const searchInputField = useRef(null);

  //imports
  const franchiseStatus = {
    INACTIVE: "In Active",
    ACTIVE: "Active",
  };
  const stickyColumnStyles = {
    whiteSpace: "nowrap",
    position: "sticky",
    zIndex: "1",
    backgroundColor: "white",
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
    //   style: {
    //     ...stickyColumnStyles,
    //     left: "48px !important",
    //   },
    // },
    {
      name: <b className="CustomerTable_columns" style={{whiteSpace:"nowrap"}}>{"Franchise Name"}</b>,
      cell: (row) => (
        <>
          {token.permissions.includes(FRANCHISE.READ) ? (
            <a style={{whiteSpace:"initial"}}
              onClick={() => openCustomizer("3", row)}
              // id="columns_right"
              className="openmodal"
            >
              {row.name}
            </a>
          ) : (
           <div style={{whiteSpace:"initial"}} id="columns_right">{row.name}</div> 
          )}
        </>
      ),
      style: {
        ...stickyColumnStyles,
        left: "48px !important",
      },
      selector: "name",
      sortable: true,
    },
    {
      name: <b className="CustomerTable_columns" style={{whiteSpace:"nowrap"}} >{"Franchise Code"}</b>,
      selector: "code",
      cell: (row) => {
        return <span >{row.code}</span>;
      },
      sortable: true,
        style: {
      ...stickyColumnStyles,
      left: "165px !important",
    },
    },

    {
      name: <b className="Table_columns" >{"Type"}</b>,
      selector: "type.name",
      cell: (row) => {
        return <span >{row.type ? row.type.name : "-"}</span>;
      },
      sortable: true,
      style: {
        ...stickyColumnStyles,
        left: "275px !important",
      borderRight: "1px solid #CECCCC",
      },
    },
    {
      name: <b className="Table_columns">{"Status"}</b>,
      selector: "status.name",
      // cell: (row) => {
      //   return (
      //     <>
      //         {row.status.name === "ACTIVE" ? (
      //         <img src={ACTCIRCLE} />
      //       ) : row.status.name === "INACTIVE" ? (
      //         <img src={EXPCIRCLE} />
      //       )  : (
      //         ""
      //       )}
      //       &nbsp; &nbsp;
      //       <Typography variant="caption">
      //         {franchiseStatus[row.status.name]}
      //       </Typography>
      //     </>
      //   );
      // },
      // cell: (row) => {
      //   return <span>{row.status ? row.status.name : "-"}</span>;
      // },
      sortable: true,
    },
    {
      name: <b className="Table_columns franchise_columns" style={{whiteSpace:"nowrap"}}>{"Active Customers"}</b>,
      selector: "customer_count",
      cell:(row)=>(
        <span className="franchise_osbalance">{row.customer_count}</span>
      ),
      sortable: false,
    },
    {
      name: <b className="Table_columns franchise_columns" style={{whiteSpace:"nowrap"}}>₹{"Current Balance"}</b>,
      cell: (row) => {
        return <span className="franchise_osbalance">{row.wallet_amount}</span>;
      },
      selector: "wallet_amount",
      sortable: false,
    },
    {
      name: <b className="Table_columns franchise_columns"  style={{whiteSpace:"nowrap"}}>₹{"Renewal Balance"}</b>,
      cell: (row) => {
        return <span className="franchise_osbalance">{row.renewal_amount}</span>;
      },
      selector: "renewal_amount",
      sortable: false,
    },

    {
      name: <b className="Table_columns franchise_columns" style={{whiteSpace:"nowrap"}}>₹{"Outstanding Balance"}</b>,
      cell: (row) => {
        return <span className="franchise_osbalance">{row.outstanding_balance}</span>;
      },
      selector: "outstanding_balance",
      sortable: false,
    },
    {
      name:  <b className="Table_columns">{"NAS Type"}</b>,
      selector: "nas_type",
      sortable: true,
      cell: (row) => {
        let nastypeObj = nasType.find((s) => s.id == row.nas_type);
        return <span>{nastypeObj ? nastypeObj.name : "-"}</span>;
      },
    },
    //Sailaja Changed Created Date as Created on 19th July
    {
      name: <b className="Table_columns franchise_created">{"Created"}</b>,
      selector: "created_at",
      cell: (row) => (
        <span className="digits franchise_created" style={{ textTransform: "initial"}}>
          {" "}
          {moment(row.created_at).format("DD MMM YY")}
        </span>
      ),
      sortable: false,
    },
        //Sailaja Changed Updated Date as Updated on 19th July

    {
      name: <b className="Table_columns" style={{position:"relative", right:"50px"}}>{"Updated"}</b>,
      selector: "updated_at",
      cell: (row) => (
        <span className="digits franchise_columns" style={{ textTransform: "initial" ,position:"relative", right:"50px"}}>
          {" "}
          {moment(row.updated_at).format("DD MMM YY")}
        </span>
      ),
      sortable: false,
    },
   
    
    {
      name: <b className="Table_columns franchise_columns1">{"SMS Gateway"}</b>,
      selector: "sms_gateway_type.name",
      cell: (row) => {
        return (
          <span className="franchise_columns1">{row.sms_gateway_type ? row.sms_gateway_type.name : "-"}</span>
        );
      },
      sortable: true,
    },

    
    {
      name: <b className="Table_columns franchise_columns1">{"Address"}</b>,
      sortable: true,
      cell: (row) => (
        <div className="ellipsis franchise_columns1" title= {getAddress(row)}>
          {getAddress(row)}
        </div>
      ),
     
    },
  ];
  const [exportData, setExportData] = useState({
    columns: columns,
    exportHeaders: [],
  });

  // address
  const getAddress = (row) => {
    const { address } = row;
    return `${address ? address.house_no : ""},
    ${address ? address.landmark : ""},
    ${address ? address.street : ""},
    ${address ? address.city : ""},
    ${address ? address.district : ""},
    ${address ? address.state : ""},
    ${address ? address.country : ""},
    ${address ? address.pincode : ""}`;
  };

  //filter show and hide level menu
  const OnLevelMenu = (menu) => {
    setLevelMenu(!menu);
  };

  //filtering data by making a backup
  useEffect(() => {
    if (data) {
      setData(data);
      setFiltereddataBkp(data);
      console.log(data);
      // setFiltereddata(data);
    }
  }, [data]);

  //dynamic options
  useEffect(() => {
    //franchiselist
    franchiseaxios
      .get("/franchise/options")
      .then((res) => {
        let { type } = res.data;
        setFranchiseType([...type]);
      })
      .catch((err) => console.log(err));
  }, []);

  //export
  // Sailaja Changed Export Button Columns Based on Data table component

  const headersForExportFile = [
    ["all", "All"],
    // ["id", "ID"],
    ["name", "Franchise Name"],
    ["code", "Franchise Code"],
    ["type", "Type"],
    ["status", "Status"],
    ["wallet_amount","Current Balance"],
    ["renewal_amount","Renewal Balance"],
    ["outstanding_balance", "Outstanding Balance"],
    ["created_at","Created Date"],
    ["updated_at", "Updated Date"],
    ["customer_count", "No of Customers"],
    ["sms_gateway_type", "SMS Gateway"],      
    ["address", "Address"],
  ];
    
//     // ["franchise_name", "Franchise name"],
//     // ["role", "Role"],
  
//     // ["revenue_sharing", "Revenue sharing"],
   
//     // ["renewal_bal", "Renewal bal"],
//     // ["outstanding_bal", "Outstanding bal"],
  
//     // ["sms_balance", "SMS balance"],
//     // ["created_at", "Created At"],
//     // ["updated_at", "Updated At"],
//  

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
    console.log(event);
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

  const handleExportDataAsPDF = (headersForPDF) => {
    setIsExportDataModalToggle(!isExportDataModalOpen);
    const title = `All Franchise`;
    downloadPdf(title, headersForPDF, filteredData, "Franchise");
  };

  const handleDownload = () => {
    const headers = headersForExport.filter((header) => header !== "all");
    const headersForPDF = headersForExportFile.filter(
      (h) => headers.includes(h[0]) && h
    );
    console.log(headersForPDF, ":headersForPDF");
    if (downloadAs === "pdf") {
      handleExportDataAsPDF(headersForPDF);
    } else {
      downloadExcelFile(downloadableData, downloadAs, headers);
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
    localStorage.setItem("franchise/", JSON.stringify(formDataForSaveInDraft));
    localStorage.setItem("franchiseDraftSaveKey", "franchise/");

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
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
    localStorage.removeItem("franchise/");
    localStorage.removeItem("franchiseDraftSaveKey");
    setIsDirty(false);
    //setLead({});
  };

  // draft end
  // scroll top
  const ref = useRef();

  useEffect(() => {
    ref.current.scrollIntoView(0, 0);
  }, []);
  //export handleclick functionlaity
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
    type="checkbox"
    class="new-checkbox" 
    ref={ref}
    onClick={onClick}
    {...rest}
  />
  <label className="form-check-label" id="booty-check" />
</div>
));

const conditionalRowStyles = [
  {
    when: (row) => row.selected === true,
    style: {
      backgroundColor: "#E4EDF7",
    },
  },
];
//code added for onclick outside close filter card 
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

  {/* Sailaja on 12th July   Line number 927 id="breadcrumb_margin" change the breadcrumb position */}

  return (
    <Fragment>
      <div>
      <div ref={ref}>
        <br />
        <Container fluid={true}maxWidth="xl" sx={{ paddingTop: "20px" }}>
        <Grid container spacing={1} id="breadcrumb_margin" >
        <Grid item md="12"> 
          <Breadcrumbs
            aria-label="breadcrumb "
            separator={<NavigateNextIcon fontSize="small" className="navigate_icon"/>}
          >
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              color=" #377DF6"
              fontSize="14px"
            >
              Business Operations
            </Typography>
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              color="#00000 !important"
              fontSize="14px"
              className="last_typography"
            >
              Franchise
            </Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <br />
      <br />
{/* Sailaja on 12th July   Line number 800 id="breadcrumb_table" change the breadcrumb position */}
          <div className="edit-profile data_table"id="breadcrumb_table" >
            <Stack direction="row" spacing={2}>
            <span className="all_cust">Franchise</span>
             
              {/* <MUIButton
                onClick={Verticalcentermodaltoggle}
                variant="outlined"
                disabled={true}
                startIcon={<DeleteIcon />}
              ></MUIButton> */}
              <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }}>
                <Paper
                  component="div"
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: 400,
                    height: "40px",
                    boxShadow: "none",border: "1px solid #E0E0E0"
                  }}
                >
                    
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    inputProps={{ "aria-label": "search google maps" }}
                    placeholder="Search With Franchise Name  or Franchise Code"
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

            {token.permissions.includes(FRANCHISE.EXPORT) && (
              <>
                <Tooltip title={"Export"}>
                <MUIButton
                  className="muibuttons"
                  variant="outlined"
                  onClick={handleClick}
                  style={{ height: "40px" }}
                >
                  <img src={EXPORT} />
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
                  <MenuItem onClick={() => handleExportDataModalOpen("csv")}>
                    Export CSV                  </MenuItem>
                  <MenuItem onClick={() => handleExportDataModalOpen("excel")}>
                    Export XLS
                  </MenuItem>
                  <MenuItem onClick={() => handleExportDataModalOpen("pdf")}>
                    Export PDF
                  </MenuItem>
                </Menu>
              </>
            )}
                <Tooltip title={"Refresh"}>
                <MUIButton
              className="muibuttons"
              onClick={Refreshhandler}
              variant="outlined"
              style={{ height: "40px" }}
            >
              <img src={REFRESH} />
            </MUIButton>
            </Tooltip>
            {token.permissions.includes(FRANCHISE.FILTERS) && (
                <>
                <Tooltip title={"Filter"}>
                  <MUIButton
                    onClick={() => OnLevelMenu(levelMenu)}
                    variant="outlined"
                    className="muibuttons"
                    style={{ height: "40px" }}
                  >
                    {/* <span className="button-text"> More Filters</span> */}
                    <img src={FILTERS} />
                  </MUIButton>
                </Tooltip>

                  <FranchiseFilterContainer
                    levelMenu={levelMenu}
                    setLevelMenu={setLevelMenu}
                    filteredData={filteredData}
                    setFiltereddata={setFiltereddata}
                    filteredDataBkp={filteredDataBkp}
                    loading={loading}
                    setLoading={setLoading}
                    showTypeahead={false}
                    franchiseType={franchiseType}
                  />
                </>
              )}
            {token.permissions.includes(FRANCHISE.CREATE) && (
              //    <button
              //    className="btn btn-primary openmodal"
              //    id="newbuuon"
              //    type="submit"
              //    onClick={() => openCustomizer("2")}
              //  >
              //    <i
              //      className="icofont icofont-plus openmodal"
              //      style={{
              //        cursor: "pointer",
              //        marginLeft: "-15px",
              //      }}
              //    ></i>
              //    <span className="openmodal">
              //      &nbsp;&nbsp; <span className="button-text">New </span>
              //    </span>
              //  </button>
              <button
              onClick={() => openCustomizer("2")}
              id="newbuuon"
             
              className="btn btn-primary openmodal"
              type="submit"
            >
              <span
                style={{ marginLeft: "-20px" }}
                className="openmodal"
              >
                &nbsp;&nbsp; New{" "}
              </span>
              <i
                className="icofont icofont-plus openmodal"
                style={{
                  paddingLeft: "10px",
                  cursor: "pointer",
                }}
              ></i>
            </button>
              )}

              </Stack>
            </Stack>

          

            <Row style={{marginTop:"2%"}}>
              <Col md="12" >
                <Card style={{ borderRadius: "0" ,boxShadow:"none" }}>
                  <Col xl="12" style={{ padding: "0" }}>
                    <nav aria-label="Page navigation example">
                      {loading ? (
                        <Skeleton
                          count={11}
                          height={30}
                          style={{ marginBottom: "10px", marginTop: "15px" }}
                        />
                      ) : (
                        <div className="data-table-wrapper">
                          {token.permissions.includes(FRANCHISE.LIST) ? (
                            <DataTable
                              className="franchise-list"
                              columns={columns}
                              data={filteredData}
                              noHeader
                              selectableRows
                              selectableRowsComponent={NewCheckbox}
                              // selectableRows
                              onSelectedRowsChange={({ selectedRows }) => (
                                handleSelectedRows(selectedRows),
                                deleteRows(selectedRows)
                              )}
                              clearSelectedRows={clearSelectedRows}
                              pagination
                              noDataComponent={"No Data"}
                              conditionalRowStyles={conditionalRowStyles}
                              // clearSelectedRows={clearSelection}
                            />
                          ) : (
                            <p style={{ textAlign: "center" }}>
                              {"You have insufficient permissions to view this"}
                            </p>
                          )}
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
                            <Button color="secondary" onClick={toggle}>
                              {Cancel}
                            </Button>
                          </ModalFooter>
                        </Modal>
                      </div>
                      <div className=" customizer-body custom-scrollbar">
                        <TabContent activeTab={activeTab1}>
                          <TabPane tabId="2">
                            <div id="headerheading"> Add New Franchise </div>
                            <ul
                              className="layout-grid layout-types"
                              style={{ border: "none" }}
                            >
                              <li
                                data-attr="compact-sidebar"
                                onClick={(e) => handlePageLayputs(classes[0])}
                              >
                                <div className="layout-img">
                                  {activeTab1 == 2 && (
                                    <AddFranchise
                                      dataClose={closeCustomizer}
                                      onUpdate={(data) => update(data)}
                                      rightSidebar={rightSidebar}
                                      setIsDirtyFun={setIsDirtyFun}
                                      setformDataForSaveInDraft={
                                        setformDataForSaveInDraft
                                      }
                                      lead={lead}
                                    />
                                  )}
                                </div>
                              </li>
                            </ul>
                          </TabPane>
                          <TabPane tabId="3">
                            <div id="headerheading">
                              {" "}
                              <span> Franchise Information : {lead.name} </span>
                              <span style={{ marginLeft: "30px" }}>
                                ID: F{lead.id}
                              </span>
                            </div>

                            <AllFranchiseDetails
                              lead={lead}
                              setLead={setLead}
                              onUpdate={(data) => detailsUpdate(data)}
                              rightSidebar={rightSidebar}
                              dataClose={closeCustomizer}
                              detailsUpdate={detailsUpdate}
                              openCustomizer={openCustomizer}
                              Refreshhandler={Refreshhandler}
                            />
                          </TabPane>
                        </TabContent>
                      </div>
                    </div>
                  </div>
                </Col>

                {/* modal */}
                <Modal
                  isOpen={Verticalcenter}
                  toggle={Verticalcentermodaltoggle}
                  centered
                >
                  <ModalHeader toggle={Verticalcentermodaltoggle}>
                    Confirmation
                  </ModalHeader>
                  <ModalBody>
                    <div>
                      {isChecked.map((id) => (
                        <span>F{id},</span>
                      ))}
                    </div>
                    <p>Are you sure you want to delete?</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="secondary"
                      onClick={Verticalcentermodaltoggle}
                    >
                      No
                    </Button>
                    <Button color="primary" 
                    // onClick={() => onDelete()}
                    >
                      Yes
                    </Button>
                  </ModalFooter>
                </Modal>
                {/* modal for insufficient permissions */}
                <PermissionModal
                  content={permissionModalText}
                  visible={permissionmodal}
                  handleVisible={permissiontoggle}
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
{/* Sailaja Changed close button Styles(Line Number 1138)on 13th July */}

                    <Button id ="resetid" onClick={() => closeDirtyModal()}>
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
                <ModalFooter>
                  <Button color="secondary" id="resetid" onClick={handleExportclose}>
                    {"Close"}
                  </Button>
                     <button color="primary" 
            id="download_button1"
            className="btn btn-primary openmodal"
            onClick={() => handleDownload()}
                disabled={headersForExport.length > 0 ? false : true}
            >
                    <span className="openmodal">Download</span>

            </button>
                </ModalFooter>
              </Modal>
              {/* end export */}
              </Row>
            </Row>
          </div>
        </Container>
      </div>
      </div>
    </Fragment>
  );
};

export default FranchiseList;
