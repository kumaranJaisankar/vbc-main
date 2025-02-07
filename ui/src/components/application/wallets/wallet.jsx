import React, {
  Fragment,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import Skeleton from "react-loading-skeleton";
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
  Input,
  FormGroup,
  ModalBody,
  Label,
} from "reactstrap";
import { ModalTitle, CopyText, Cancel, Close } from "../../../constant";
import { adminaxios } from "../../../axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
// import { columns } from "../../../data/supportdb";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import { classes } from "../../../data/layouts";
import { logout_From_Firebase } from "../../../utils";
import moment from "moment";
import WalletDetails from "./walletdetails";
import { WalletFilterContainer } from "./WalletFilter/WalletFilterContainer";
import { pick } from "lodash";
import { downloadExcelFile, downloadPdf } from "./Export/wallettableexport";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MUIButton from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FILTERS from "../../../assets/images/filters.png";
import REFRESH from "../../../assets/images/refresh.png";
import EXPORT from "../../../assets/images/export.png";
import Tooltip from '@mui/material/Tooltip';
import { WALLET } from "../../../utils/permissions";
import TotalCount from "./Total";
import WalletUtiltyBadge from "../../utilitycomponents/WalletUtilityBadge";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const Wallet = () => {
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [filteredTableData, setFilteredTableData] = useState(data);
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState([]);
  const [modal, setModal] = useState();
  const [refresh, setRefresh] = useState(0);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  const configDB = useSelector((content) => content.Customizer.customizer);
  const [clearSelection, setClearSelection] = useState(false);
  //modal state for insufficient permissions
  const [permissionmodal, setPermissionModal] = useState();
 
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  // const [reseller, setReseller] = useState("branches");

  //two states for start date and end date

  //
  const [credit, setCredit] = useState(false);
  const [debit, setDebit] = useState(false);
  //state for select id
  const [selectedid, setSelectedid] = useState({});
  //
  const [filterselectedid, setFilterselectedid] = useState([]);
  const [checkdedit, setCheckdedit] = useState(true);
  const [desedit, setDesedit] = useState(true);
  //state for calender
  const [calender, setCalender] = useState(false);
  //filter show and hide menu
  const [levelMenu, setLevelMenu] = useState(false);
  //taking backup for original data
  const [filteredDataBkp, setFiltereddataBkp] = useState(data);

  const [franchise, setFranchise] = useState([]);
  const [branch, setBranch] = useState([]);
  //exportData
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  //end
  //export functionality
  const [isExportDataModalOpen, setIsExportDataModalToggle] = useState(false);
  const [downloadableData, setDownloadableExcelData] = useState([]);
  const [downloadAs, setDownloadAs] = useState("");
  const [filteredDataForModal, setFilteredDataForModal] =
    useState(filteredData);
  const [headersForExport, setHeadersForExport] = useState([]);

  //state for custom start and end date
  const [customenddate, setCustomenddate] = useState( moment().format("YYYY-MM-DD"));
  const [customstartdate, setCustomstartdate] = useState( moment().format("YYYY-MM-DD"));


  const [summardetails, setSummarydetails] = useState();

  const [filterwithinfilter, setFilterwithinfilter] = useState();
  const [formData, setFormData] = useState({
    startdate: "",
    enddate: "",
  });
  const [selectedWalletTab, setSelectedWalletTab] = useState("All");
  const [walletRowlength, setWalletRowlength] = useState({});

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

    adminaxios
      .get(`wallet/transactions/today`)
      // .then((res) => setData(res.data))
      .then((res) => {
        setData(res.data);
        setFiltereddata(res.data);
        setFilteredTableData(res.data);
        setLoading(false);
        // setRefresh(0);
      })
      .catch(function (error) {
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is404Error = errorString.includes("404");
        if (error.response && error.response.data.detail) {
          toast.error(error.response && error.response.data.detail, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        } else if (is500Error) {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        } else if (is404Error) {
          toast.error("API mismatch", {
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
  }, [refresh]);
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

  const detailsUpdate = (updatedata) => {
    setData([...data, updatedata]);
    // setFiltereddata((prevFilteredData) => [...prevFilteredData, updatedata]);
    setFiltereddata((prevFilteredData) =>
      prevFilteredData.map((data) =>
        data.id == updatedata.id ? updatedata : data
      )
    );
    closeCustomizer();
  };

  //   //filter
  const handlesearchChange = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];

    let newdata = { ...data };
    result = newdata.all_transactions.filter((newdata) => {
      if (newdata.name.toLowerCase().search(value) != -1) return newdata;
    });
    setFilteredTableData({ all_transactions: result });
  };

  //delete
  const deleteRows = (selected) => {
    setClearSelection(false);

    let rows = selected.map((ele) => ele.id);
    // setIsChecked([...rows]);
  };

  const toggle = () => {
    setModal(!modal);
  };
  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
  };
  const openCustomizer = (type, id, entity_id) => {
    if (id && id.entity_id) {
      setWallet(id.entity_id);
    }
    setActiveTab1(type);
    setRightSidebar(!rightSidebar);
    // if (rightSidebar) {
    document.querySelector(".customizer-contain").classList.add("open");

    // document.querySelector(".customizer-links").classList.add('open');
    // }

    //hit api
    adminaxios
      .get(`wallet/ledger/${id.entity_id}`)
      // .then((res) => setData(res.data))
      .then((res) => {
        setSelectedid(res.data);
        setFilterselectedid(res.data);
        // setData(res.data);
        // setFiltereddata(res.data);
        setLoading(false);
      });
  };

  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    history.push(key);
  };

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

  //refresh
  const Refreshhandler = () => {
    setRefresh((prevValue) => prevValue + 1);
    if (searchInputField.current) searchInputField.current.value = "";
  };

  const searchInputField = useRef(null);

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

    {
      name: <b className="Table_columns">{"Name"}</b>,
      // cell: (row) => {
      //   return <span >{row.name}</span>;
      // },
      cell: (row) => (
        <a
          onClick={() => openCustomizer("3", row)}
          // id="columns_right"
          className="openmodal"
        >
          {row.name}
        </a>
      ),
      selector: "name",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Entity ID"}</b>,
      selector: "entity_id",
      sortable: true,
      cell: (row) => {
        return <span>{row.entity_id}</span>;
      },
      // cell: (row) => (
      //   <a
      //     onClick={() => openCustomizer("3", row)}
      //     // id="columns_right"
      //     className="openmodal"
      //   >
      //     {row.entity_id}
      //   </a>
      // ),
    },
    {
      name: <b className="Table_columns">{"User Name"}</b>,
      cell: (row) => {
        return <span>{row.person}</span>;
      },
      selector: "person",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Type"}</b>,
      cell: (row) => {
        return <span>{row.type}</span>;
      },
      selector: "type",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Mode"}</b>,
      cell: (row) => {
        return <span>{row.mode}</span>;
      },
      selector: "mode",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"₹ Amount"}</b>,
      cell: (row) => (
        <h6 style={{ fontWeight: "400", fontSize: "13px" }}>{row.amount}</h6>
      ),
      // selector: "amount",
      sortable: true,
    },
    {
      name: "",
      selector: "",
    },
    {
      name: "",
      selector: "",
    },
    {
      name: "",
      selector: "",
    },
  ];
  const [exportData, setExportData] = useState({
    columns: columns,
    exportHeaders: [],
  });
  //modal for insufficient modal
  const permissiontoggle = () => {
    setPermissionModal(!permissionmodal);
  };
  //end

  const daterangeselection = (e, value) => {
    if (e.target.value === "custom") {
      setCalender(true);
    }
    if (
      e.target.value === "today" ||
      e.target.value === "yesterday" ||
      e.target.value === "lastweek" ||
      e.target.value === "last7days" ||
      e.target.value === "last30days" ||
      e.target.value === "lastmonth" ||
      e.target.vale === "custom"
    ) {
      setCalender(false);
    }
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    //today
    let startdate = moment().format("YYYY-MM-DD");
    let enddate = moment().format("YYYY-MM-DD");
    if (e.target.value === "today") {
    }
    //yesterday
    else if (e.target.value === "yesterday") {
      startdate = moment().subtract(1, "d").format("YYYY-MM-DD");
      enddate = moment().subtract(1, "d").format("YYYY-MM-DD");
    }
    //last 7 days
    else if (e.target.value === "last7days") {
      startdate = moment().subtract(7, "d").format("YYYY-MM-DD");
    }
    //last 30 days
    else if (e.target.value === "last30days") {
      startdate = moment().subtract(30, "d").format("YYYY-MM-DD");
    }

    //end

    //custom
    else if (e.target.value === "custom") {
      startdate = moment().format("YYYY-MM-DD");
      enddate = moment().format("YYYY-MM-DD");
    }
    //end
    // last week
    else if (e.target.value === "lastweek") {
      startdate = moment()
        .subtract(1, "weeks")
        .startOf("week")
        .format("YYYY-MM-DD");

      enddate = moment()
        .subtract(1, "weeks")
        .endOf("week")
        .format("YYYY-MM-DD");
    }
    //last month
    else if (e.target.value === "lastmonth") {
      startdate = moment()
        .subtract(1, "months")
        .startOf("months")
        .format("YYYY-MM-DD");

      enddate = moment()
        .subtract(1, "months")
        .endOf("months")
        .format("YYYY-MM-DD");
    }
    //custom
    else if (e.target.value === "custom") {
      startdate = e.target.value;

      enddate = e.target.value;
    }
    //

    const data1 = {};
    data1.start_date = startdate;
    data1.end_date = enddate;
    adminaxios
      .post(`wallet/transactions/all`, data1, config)
      .then((response) => {
        let listdata = response.data.all_transactions;
        // let filterlistdata = [];
        for (let i = 0; i < filterwithinfilter.length; i++) {
          if (filterwithinfilter[i] && filterwithinfilter[i].type == "branch") {
            listdata = listdata.filter(
              (i) => i.branch == filterwithinfilter[i].title
            );
          } else if (
            filterwithinfilter[i] &&
            filterwithinfilter[i].type == "franchise"
          ) {
            listdata = listdata.filter(
              (i) => i.franchise == filterwithinfilter[i].title
            );
          }
        }
        setData(response.data);
        setFiltereddata({ ...response.data, all_transactions: listdata });
        setFilteredTableData({ ...response.data, all_transactions: listdata });
      });
  };

  const handlecreditcheckbox = (e) => {
    const data = { ...filteredData };
    const creditValue = e.target.checked;
    setDesedit(e.target.checked);
    // setDebit(false);
    setCredit(creditValue);

    const { all_transactions } = data;
    if (
      (debit === true && creditValue === true) ||
      (debit === false && creditValue === false)
    ) {
      setFilteredTableData(data);
    } else if (debit == false && creditValue === true) {
      let filtered_trans = all_transactions.filter(
        (item) => item.credit === true
      );
      setFilteredTableData({ ...data, all_transactions: filtered_trans });
    } else if (debit == true && creditValue === false) {
      let filtered_trans = all_transactions.filter(
        (item) => item.credit === false
      );
      setFilteredTableData({ ...data, all_transactions: filtered_trans });
    }
  };
  const handledebitcheckbox = (e) => {
    const data = { ...filteredData };
    const debitValue = e.target.checked;
    setCheckdedit(e.target.checked);
    setDebit(debitValue);
    // setCredit(true);

    const { all_transactions } = data;
    if (
      (debitValue === true && credit === true) ||
      (debitValue === false && credit === false)
    ) {
      setFilteredTableData(data);
    } else if (debitValue == true && credit === false) {
      let filtered_trans = all_transactions.filter(
        (item) => item.credit === false
      );
      setFilteredTableData({ ...data, all_transactions: filtered_trans });
    } else if (debitValue == false && credit === true) {
      let filtered_trans = all_transactions.filter(
        (item) => item.credit === true
      );
      setFilteredTableData({ ...data, all_transactions: filtered_trans });
    }
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
    }
  }, [data]);
  //end

  useEffect(() => {
    adminaxios
      .get("franchise/display")
      .then((res) => {
        setFranchise([...res.data]);
      })
      .catch((error) => console.log(error));

    adminaxios
      .get("franchise/branches")
      .then((res) => {
        const branches = pick(res.data, "branches");
        setBranch(res.data);
      })
      .catch((error) => console.log(error));
  }, []);
  //export functionality
  const handleExportDataModalOpen = (downloadAs) => {
    handleClose();
    setIsExportDataModalToggle(!isExportDataModalOpen);
    setDownloadableExcelData(filteredData);
    setDownloadAs(downloadAs);
  };

  const handleExportDataAsPDF = (headersForPDF) => {
    setIsExportDataModalToggle(!isExportDataModalOpen);
    const title = `Wallet`;
    downloadPdf(title, headersForPDF, filteredData, "Wallet");
  };

  const handleDownload = () => {
    const headers = headersForExport.filter((header) => header !== "all");
    const headersForPDF = headersForExportFile.filter(
      (h) => headers.includes(h[0]) && h
    );
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

  const headersForExportFile = [
    ["all", "All"],
    ["name", "Name"],
    ["entity_id", "Entity ID"],
    ["person", "User Name"],    
    ["type", "Type"],
    ["mode", "Mode"],
    ["amount", "Amount"],
  ];

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

  //handler for custom date
  const customHandler = (e) => {
    if (e.target.name === "start_date") {
      setCustomstartdate(e.target.value);
      // setFormData((prevState) => ({
      //   ...prevState,
      //   startdate: start_date,
      // }));
    }
    if (e.target.name === "end_date") {
      setCustomenddate(e.target.value);
      // setFormData((prevState) => ({
      //   ...prevState,
      //   enddate: end_date,
      // }));
    }
  };

  //useeffect for custom date range field
  useEffect(() => {
    // setFormData({
    //   startdate: null,
    //   enddate: null,
    // });
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data2 = {};

    adminaxios
      .post(
        `wallet/transactions/all`,
        { start_date: customstartdate, end_date: customenddate },
        config
      )
      .then((response) => {
        // setData(response.data);
        // setFiltereddata(response.data);
        // setFilterwithinfilter(response.data);
        let listdata1 = response.data.all_transactions;
        setData(response.data);
        setFormData({ ...response.data, all_transactions: listdata1 });
        setFiltereddata({ ...response.data, all_transactions: listdata1 });
        setFilteredTableData({ ...response.data, all_transactions: listdata1 });
      });
  }, [customstartdate, customenddate]);
  //end
  //

  useEffect(() => {
    if (filteredData?.all_transactions) {
      const data = summary(filteredData?.all_transactions);
      setSummarydetails(data);
    }
  }, [filteredData?.all_transactions]);

  const summary = (records) => {
    let total_deposit = 0;
    let cash_deposit = 0;
    let online_deposit = 0;
    for (let i = 0; i < records.length; i++) {
      if (records[i].type == "Deposit") {
        total_deposit = total_deposit + records[i].credit_amount;
        if (records[i].mode == "Offline") {
          cash_deposit = cash_deposit + records[i].credit_amount;
        } else if (records[i].mode == "Online") {
          online_deposit = online_deposit + records[i].credit_amount;
        }
      }
    }
    const output = {
      total_deposit: total_deposit,
      cash_deposit: cash_deposit,
      online_deposit: online_deposit,
    };
    return output;
  };

  //onside click hide sidebar
  const box = useRef(null);
  useOutsideAlerter(box);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      // Function for click event
      function handleOutsideClick(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          if (
            rightSidebar &&
            !event.target.className.includes("openmodal") &&
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
  //new export
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

  const handleWalletTableDataFilter = (credit, isCount = false) => {
    setSelectedWalletTab(credit);
    switch (credit) {
      case "All":
        if (isCount) {
          setWalletRowlength((prevState) => {
            return {
              ...prevState,
              ["All"]: data.all_transactions?.length,
            };
          });
        } else {
          setFiltereddata(data);
          setFilteredTableData(data);
        }
        break;
      case "debit":
        if (isCount) {
          setWalletRowlength((prevState) => {
            return {
              ...prevState,
              ["debit"]: data.all_transactions?.filter(
                (item) => item.credit === false
              ).length,
            };
          });
        } else {
          setFilteredTableData((preState) => {
            return {
              ...preState,
              all_transactions: data.all_transactions.filter(
                (item) => item.credit === false
              ),
            };
          });
        }
        break;
      case "credit":
        if (isCount) {
          setWalletRowlength((prevState) => {
            return {
              ...prevState,
              ["credit"]: data.all_transactions?.filter(
                (item) => item.credit === true
              ).length,
            };
          });
        } else {
          setFilteredTableData((preState) => {
            return {
              ...preState,
              all_transactions: data.all_transactions.filter(
                (item) => item.credit === true
              ),
            };
          });
        }
        break;
      default:
        setFiltereddata(data);
        setFilteredTableData(data);
    }
  };

  useEffect(() => {
    if (data) {
      handleWalletTableDataFilter("All", true);
      handleWalletTableDataFilter("debit", true);
      handleWalletTableDataFilter("credit", true);

      handleWalletTableDataFilter(selectedWalletTab, true);
      handleWalletTableDataFilter(selectedWalletTab, false);
    }
  }, [data]);
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
  //end
  {
    /* Sailaja on 12th July   Line number 927 id="breadcrumb_margin" change the breadcrumb position */
  }
  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <Grid container spacing={1} id="breadcrumb_margin">
          <Grid item md="12">
            <Breadcrumbs
              aria-label="breadcrumb"
              separator={
                <NavigateNextIcon fontSize="small" className="navigate_icon" />
              }
            >
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color=" #377DF6"
                fontSize="14px"
              >
                Customer Relations
              </Typography>
              {/* Sailaja changed line numbers 943,944 on 13th July */}
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="#00000 !important"
                className="last_typography"
                fontSize="14px"
              >
                Payments
              </Typography>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                className="last_typography"
              >
                Wallet
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <br />
        <br />
        {/* Sailaja on 12th July   Line number 960 id="breadcrumb_table" change the breadcrumb position */}
        <div className="edit-profile data_table" id="breadcrumb_table">
          <div className="edit-profile">
            <Stack direction="row" spacing={2}>
              <span className="all_cust">Payments</span>
              <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }}>
                {calender ? (
                  <div style={{ display: "flex", marginRight: "108px" }}>
                    <Col sm="6" style={{ marginTop: "-16px" }}>
                      <FormGroup id="custom_dates_new">
                        <div className="input_wrap">
                          <Input
                            className={`form-control-digits not-empty`}
                            onChange={customHandler}
                            // onChange= {e => setFormData ({ start_date : e.target.value })}
                            // className={`form-control digits ${formData && formData.code ? 'not-empty' : ''}`}
                            // value={data1 && data1.start_date}
                            type="date"
                            id="meeting-time"
                            name="start_date"
                          />
                          <Label
                            for="meeting-time"
                            className="placeholder_styling"
                          >
                            Start Date
                          </Label>
                        </div>
                      </FormGroup>
                    </Col>
                    <Col sm="6" style={{ marginTop: "-16px" }}>
                      <FormGroup id="custom_dates_new">
                        <div className="input_wrap">
                          <Input
                            className={`form-control-digits not-empty`}
                            onChange={customHandler}
                            // className={`form-control digits ${formData && formData.code ? 'not-empty' : ''}`}
                            // value={data1 && data1.end_date}
                            type="date"
                            id="meeting-time"
                            name="end_date"
                            min={customstartdate}
                            // value={data1.end_date}
                          />
                          <Label
                            for="meeting-time"
                            className="placeholder_styling"
                          >
                            End Date
                          </Label>
                        </div>
                      </FormGroup>
                    </Col>
                  </div>
                ) : (
                  ""
                )}
                {token.permissions.includes(WALLET.DATE_SEARCH) && (
                  <div className="input_wrap">
                    <Input
                      className={`form-control-digits not-empty`}
                      type="select"
                      name="daterange"
                      onChange={daterangeselection}
                      style={{
                        // width: "fit-content",
                        border: "1px solid #E0E0E0",
                        borderRadius: "4px",
                        height: "40px",
                        marginLeft: "-10px",
                        // width: "107px",
                        // paddingLeft:"20px",
                      }}
                    >
                      <option value="" style={{ display: "none" }}></option>
                      <option value="today" selected>
                        Today
                      </option>
                      <option value="yesterday">Yesterday</option>
                      <option value="lastweek">Last Week</option>
                      <option value="last7days">Last 7 Days</option>
                      <option value="last30days">Last 30 Days</option>
                      <option value="lastmonth">Last Month</option>
                      <option value="custom">Custom</option>
                    </Input>
                    <Label
                      for="meeting-time"
                      className="placeholder_styling"
                      style={{
                        color: "#1976d2",
                        fontWeight: "500",
                        fontSize: "0.875rem",
                        marginLeft: "-10px",
                      }}
                    ></Label>
                  </div>
                )}
                <Paper component="div" className="search_bar">
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    inputProps={{ "aria-label": "search google maps" }}
                    placeholder="Search With Branch Name or Franchise Name"
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
                {token.permissions.includes(WALLET.EXPORT) && (
                  <>
               <Tooltip title={"Export"}>
                    <MUIButton
                      variant="outlined"
                      onClick={handleClick}
                      className="muibuttons"
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
                  onClick={Refreshhandler}
                  variant="outlined"
                  className="muibuttons"
                >
                  <img src={REFRESH} />
                </MUIButton>
                </Tooltip>
                {token.permissions.includes(WALLET.FILTERS) && (
                  <>
               <Tooltip title={"Filters"}>
                    <MUIButton
                      onClick={() => OnLevelMenu(levelMenu)}
                      variant="outlined"
                      className="muibuttons"
                    >
                      <img src={FILTERS} />
                    </MUIButton>
                </Tooltip>
                    <WalletFilterContainer
                      levelMenu={levelMenu}
                      setLevelMenu={setLevelMenu}
                      filteredData={filteredData}
                      setFiltereddata={setFiltereddata}
                      filteredDataBkp={filteredDataBkp}
                      loading={loading}
                      setLoading={setLoading}
                      showTypeahead={false}
                      franchise={franchise}
                      branch={branch}
                      setCredit={setCredit}
                      credit={credit}
                      setFilterwithinfilter={setFilterwithinfilter}
                      filterwithinfilter={filterwithinfilter}
                      setFilteredTableData={setFilteredTableData}
                    />
                  </>
                )}
              </Stack>
            </Stack>

            <Row className="wallet">
              <Col sm="12" style={{ paddingBottom: "42px" }}>
                {token.permissions.includes(WALLET.SUMMARYTABLE) && (
                  <>
                    <WalletUtiltyBadge
                      handleWalletTableDataFilter={handleWalletTableDataFilter}
                      walletRowlength={walletRowlength}
                      setSelectedWalletTab={setSelectedWalletTab}
                      currentTab={selectedWalletTab}
                    />
                    &nbsp; &nbsp;
                    <TotalCount summardetails={summardetails} />
                  </>
                )}
              </Col>

              <Col md="12"></Col>
              <Col md="12">
                <br />
                <Card style={{ borderRadius: "0", boxShadow: "none" }}>
                  <Col xl="12" style={{ padding: "0" }}>
                    <nav aria-label="Page navigation example">
                      {loading ? (
                        <Skeleton
                          count={11}
                          height={30}
                          style={{ marginBottom: "10px", marginTop: "500px" }}
                        />
                      ) : (
                        <div className="data-table-wrapper">
                          {/* <Col md="8">
                            <FormGroup
                              className="m-t-15 m-checkbox-inline mb-0 custom-radio-ml"
                              style={{
                                position: "absolute",
                                top: "-55px",
                                left: "-1px",
                                zIndex: "1",
                                display: "flex",
                              }}
                            >
                              <div className="checkbox checkbox-dark">
                                <Input
                                  id="inline-2"
                                  type="checkbox"
                                  // checked = {checkdedit}
                                  onChange={handledebitcheckbox}
                                  // name="inline-2"
                                />
                                <Label for="inline-2">Debit</Label>
                              </div>

                              <div className="checkbox checkbox-dark">
                                <Input
                                  id="inline-1"
                                  type="checkbox"
                                  // name="inline-1"
                                  // checked = {desedit}
                                  onChange={handlecreditcheckbox}
                                />
                                <Label for="inline-1">Credit</Label>
                              </div>
                            </FormGroup>
                          </Col> */}
                          {token.permissions.includes(WALLET.WALLET_LIST) ? (
                            <DataTable
                              className="wallet-list"
                              columns={columns}
                              // data={
                              //   filteredData ? filteredData.all_transactions : ""
                              // }
                              data={
                                filteredTableData
                                  ? filteredTableData.all_transactions
                                  : ""
                              }
                              noHeader
                              onSelectedRowsChange={({ selectedRows }) =>
                                deleteRows(selectedRows)
                              }
                              clearSelectedRows={clearSelectedRows}
                              pagination
                              noDataComponent={"No Records"}
                              // clearSelectedRows={clearSelection}
                              filteredDataBkp={filteredDataBkp}
                              filteredData={filteredData}
                              setFiltereddata={setFiltereddata}
                              credit={credit}
                              setCredit={setCredit}
                              selectableRows
                              selectableRowsComponent={NewCheckbox}
                              conditionalRowStyles={conditionalRowStyles}
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
                    // style={{
                    //   borderTopLeftRadius: "20px",
                    //   borderBottomLeftRadius: "20px",
                    // }}
                  >
                    <div className="tab-content" id="c-pills-tabContent">
                      <div
                        className="customizer-header"
                        style={{
                          padding: "8px",
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
                                    // autoClose: 1000,
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
                            <div id="headerheading">Lead Source</div>
                            <ul
                              className="layout-grid layout-types"
                              style={{ border: "none" }}
                            >
                              <li
                                data-attr="compact-sidebar"
                                onClick={(e) => handlePageLayputs(classes[0])}
                              >
                                <div className="layout-img">
                                  {/* <AddLeadSource
                                    dataClose={closeCustomizer}
                                    onUpdate={(data) => update(data)}
                                    rightSidebar={rightSidebar}
  
                                  /> */}
                                </div>
                              </li>
                            </ul>
                          </TabPane>
                          <TabPane tabId="3">
                            <div id="headerheading">
                              Wallet Information :&nbsp;{wallet}
                            </div>
                            <WalletDetails
                              setFilterselectedid={setFilterselectedid}
                              filterselectedid={filterselectedid}
                              selectedid={selectedid}
                              setSelectedid={setSelectedid}
                              wallet={wallet}
                              onUpdate={(data) => detailsUpdate(data)}
                              rightSidebar={rightSidebar}
                              dataClose={closeCustomizer}
                            />
                          </TabPane>
                        </TabContent>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              <Modal
                isOpen={isExportDataModalOpen}
                toggle={() => {
                  setIsExportDataModalToggle(!isExportDataModalOpen);
                  setFilteredDataForModal(filteredData);
                  setHeadersForExport([]);
                }}
                centered
              >
                {/* <ModalHeader
                toggle={() => {
                  setIsExportDataModalToggle(!isExportDataModalOpen);
                  setFilteredDataForModal(filteredData);
                }}
              >
                Confirmation
              </ModalHeader> */}
                <ModalBody>
                  <h5> Confirmation</h5>
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
                  <Button
                    color="secondary"
                    onClick={handleExportclose}
                    id="resetid"
                  >
                    {Close}
                  </Button>
                  
                  <button
                    // color="primary"
                    className="btn btn-primary openmodal"
                    onClick={() => handleDownload()}
                    disabled={headersForExport.length > 0 ? false : true}
                    id="download_button1"
                  >
                    <span className="openmodal">Download</span>
                  </button>
                </ModalFooter>
              </Modal>
              {/* end */}
            </Row>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default Wallet;
