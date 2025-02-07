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
  ModalBody,
  TabPane,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import PermissionModal from "../../common/PermissionModal";
import moment from "moment";
import { ModalTitle,Close } from "../../../constant";
import { billingaxios} from "../../../axios";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";

import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";

import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import { classes } from "../../../data/layouts";
import { DefaultLayout as DefaultLayoutTheme } from "../../../layout/theme-customizer";
import { downloadExcelFile, downloadPdf } from "./Export";

import { BillingFilterContainer } from "./billingfilter/BillingFilterContainer";
import MUIButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import FILTERS from "../../../assets/images/filters.png";
import REFRESH from "../../../assets/images/refresh.png";
import EXPORT from "../../../assets/images/export.png";
import { BILLING } from "../../../utils/permissions";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TotalCount from "./Total";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
const BillingAndPayment = () => {
  const location = useLocation();
  const history = useHistory();

  const id = window.location.pathname.split("/").pop();
  const defaultLayout = Object.keys(DefaultLayoutTheme);
  const layout = id ? id : defaultLayout;

  //exportData
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [filteredDataBkp, setFiltereddataBkp] = useState(data);
  const [loading, setLoading] = useState(false);
  // const [exportData, setExportData] = useState({ columns: columns,exportHeaders:[]})
  // const [exportData, setExportData] = useState({ columns: columns, data: [] });
  const [lead, setLead] = useState([]);
  const width = useWindowSize();

  const [modal, setModal] = useState();
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [permissionModalText, setPermissionModalText] = useState(
    "You are not authorized for this action"
  );
  const [isChecked, setIsChecked] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  const [importDivStatus, setImportDivStatus] = useState(false);
  //modal state for insufficient permissions
  const [permissionmodal, setPermissionModal] = useState();

  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  const [levelMenu, setLevelMenu] = useState(false);
  const Verticalcentermodaltoggle = () => setVerticalcenter(!Verticalcenter);
  //filter based on days
  const [customenddate, setCustomenddate] = useState(new Date());
  const [customstartdate, setCustomstartdate] = useState(new Date());
  //state for calender
  const [calender, setCalender] = useState(false);
  const [filterwithinfilter, setFilterwithinfilter] = useState();
  const [formData, setFormData] = useState({
    startdate: "",
    enddate: "",
  });
  const [daterange, setDaterange] = useState(
    location?.state?.billingDateRange || "today"
  );

  const tokenInfo = JSON.parse(localStorage.getItem("token"));

  let billingfrnachisename = true;
  if (tokenInfo && tokenInfo.user_type === "Franchise Owner") {
    billingfrnachisename = false;
  }
  //

  const dispatch = useDispatch();

  let DefaultLayout = {};

  const OnLevelMenu = (menu) => {
    setLevelMenu(!menu);
  };

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
    let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");

    let startdate = moment().format("YYYY-MM-DD");
    let enddate = moment(date).format("YYYY-MM-DD");
    if (location?.state?.billingDateRange === "yesterday") {
      startdate = moment().subtract(1, "d").format("YYYY-MM-DD");
      enddate = moment(date).subtract(1, "d").format("YYYY-MM-DD");
    }
    if (refresh == 1) {
      setDaterange("today");
      setCalender(false);
      startdate = moment().format("YYYY-MM-DD");
      let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
      enddate = moment(date).format("YYYY-MM-DD");
    }
    if (calender) {
      startdate = moment(customstartdate).format("YYYY-MM-DD");

      let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
      enddate = moment(customenddate).add(1, "day").format("YYYY-MM-DD");
    }

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
        ? ""
        : window.location.pathname.split("/").pop();
    // fetch object by getting URL
    const layoutobj = classes.find((item) => Object.keys(item).pop() === id);
    const layout = id ? layoutobj : defaultLayoutObj;
    DefaultLayout = defaultLayoutObj;
    handlePageLayputs(layout);

    billingaxios

      .get(`payment/list?start_date=${startdate}&end_date=${enddate}`)
      .then((response) => {
        setData(response.data);
        setFiltereddataBkp(response.data);
        setFiltereddata(response.data);
        setLoading(false);
        setRefresh(0);
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
  }, [refresh, customenddate, customstartdate]);

  useEffect(() => {
    setExportData({
      ...exportData,
      data: filteredData,
    });
  }, [filteredData]);

  // //filter
  const handlesearchChange = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = data.payments.filter(
      (payment) =>
        (payment.userdata &&
          payment.userdata.username &&
          payment.userdata.username.toLowerCase().search(value) != -1) ||
        (payment.userdata &&
          payment.userdata.mobile_number &&
          payment.userdata.mobile_number.toLowerCase().search(value) != -1)
    );
    setFiltereddata({ payments: result });
  };

  //delete
  const deleteRows = (selected) => {
    let rows = selected.map((ele) => ele.id);
    setIsChecked([...rows]);

    console.log(rows);
  };

  const toggle = () => {
    setModal(!modal);
  };
  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
  };

  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
  };

  //refresh
  const Refreshhandler = () => {
    setRefresh(1);
    if (location?.state?.billingDateRange) {
      history.replace(location?.pathname, {});
    }
    // searchInputField.current.value = "";
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
    //   cell: (row) => <MoreActions />,
    //   style: {
    //     ...stickyColumnStyles,
    //     left: "48px !important",
    //   },
    // },
    {
      name: <b className="Table_columns"  >{"User ID"}</b>,
      cell: (row) => {
        return (
          <span style={{ whiteSpace: "initial" }} >
            {row.userdata.username ? row.userdata.username : "-"}
          </span>
        );
      },
      // width:"80px",
      sortable: false,
      style: {
        ...stickyColumnStyles,
        left: "48px !important",
      },
    },
    ...(billingfrnachisename
      ? [
        {
          name: <b className="CustomerTable_columns" style={{ whiteSpace: "nowrap" }}>{"Franchise"}</b>,

          cell: (row) => (
            <div className="ellipsis" title={row.franchise} >
              {row.franchise ? row.franchise : "-"}
            </div>
          ),
          sortable: false,
          width: "170px",
          style: {
            ...stickyColumnStyles,
            left: "155px !important",
          },
        },
      ]
      : ""),

    {
      name: <b className="CustomerTable_columns" id="billing_customer_col_right" style={{ whiteSpace: "nowrap" }}>{"Customer Name"}</b>,

      cell: (row) => (
        <div className="ellipsis" title={row.userdata.name ? row.userdata.name : "-"} id="billing_customer_col_right">
          {row.userdata.name ? row.userdata.name : "-"}
        </div>
      ),
      sortable: false,
      style: {
        ...stickyColumnStyles,
        // left: "210px",
        left: "325px",
        width: "100px",
      },
    },
    {
      name: <b className="Table_columns" id="billing_mob_col_right">{"Mobile No."}</b>,
      cell: (row) => {
        return <span id="billing_mob_col_right">{row.userdata.mobile_number}</span>;
      },
      sortable: false,
      style: {
        ...stickyColumnStyles,
        left: "425px !important",
        borderRight: "1px solid #CECCCC",
      },
    },

    {
      name: <b className="Table_columns">{"Payment ID"}</b>,
      cell: (row) => {
        return <span>{row.payment_id}</span>;
      },
      sortable: false,
    },

    {
      name: <b className="Table_columns" id="payment_method_col_right" style={{ whiteSpace: "nowrap" }}>{"Payment Method"}</b>,
      sortable: false,
      cell: (row) => (
        // return (
        // // <span id="payment_method_col_right" >{row.pickup_type}</span>;
        <div style={{ whiteSpace: "nowrap" }}>
          {row.pickup_type === "ONL" ? (
            <span>
              &nbsp; Online
            </span>
          ) : row.pickup_type === "OFL" ? (
            <span>

              &nbsp; Offline
            </span>

          ) : (
            ""
          )}
        </div>
      ),
    },


    // cell: (row) => 
    //   return <span id="payment_method_col_right" >{row.pickup_type}</span>;

    //     
    //       {row.pickup_type === "ONL" ? (
    //         <span>
    //           &nbsp; Online
    //         </span>
    //       ) : row.pickup_type === "OFL" ? (
    //         <span>

    //           &nbsp; Offline
    //         </span>

    //       ) : (
    //         ""
    //       )}
    //     </div>
    //   ),
    // },

    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Payment Status"}</b>,
      cell: (row) => {
        return <span>{row.status ? row.status : "-"}</span>;
      },
      sortable: false,
    },
    {
      name: <b className="Table_columns" id="type_col_left" style={{ whiteSpace: "nowrap" }}>{"Payment Type"}</b>,
      cell: (row) => {
        return <span id="type_col_right">{row.payment_method ? row.payment_method : "-"}</span>;
      },
      sortable: false,
    },
    {
      name: <b className="Table_columns" id="type_col_left">{"₹ Amount"}</b>,
      cell: (row) => {
        return <span id="type_col_left">{row.amount ? +row.amount : "-"}</span>;
      },
      sortable: false,
    },
    {
      name: <b className="Table_columns" id="payment_method_col_right" style={{ whiteSpace: "nowrap" }}>{"Online Payment"}</b>,
      cell: (row) => {
        return (
          <span id="payment_method_col_right">{row.online_payment_mode ? row.online_payment_mode : "-"}</span>
        );
      },
      sortable: false,
    },
    {
      name: <b className="Table_columns">{"Collected By"}</b>,
      cell: (row) => {
        return <span>{row.collected_by ? row.collected_by : "-"}</span>;
      },
      sortable: false,
    },
    
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Collected Date"}</b>,
      selector: "completed_date",
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {moment(row.completed_date).format("DD MMM YY")}
        </span>
      ),
      sortable: false,
    },

    {
      name: <b className="Table_columns">{"Due Amount"}</b>,
      cell: (row) => {
        return <span>{row.due_amount ? "₹" + row.due_amount : "-"}</span>;
      },
      sortable: false,
    },

    {
      name: <b className="Table_columns">{"Download"}</b>,
      selector: "invoice",
      cell: (row) => {
        return (
          <a href={row.invoice && row.invoice.inv_download} download>
            <i className="fa fa-download"></i>
          </a>
        );
      },
      sortable: false,
    },
    {
      name: <b className="Table_columns">{"Preview"}</b>,
      ignoreRowClick: true,
      cell: (row) => {
        return (
          <a
            href={row.invoice && row.invoice.inv_preview}
            target="_blank"
            rel="noreferrer noopener"
            style={{ position: "absolute" }}
          >
            <i className="fa fa-eye"></i>
          </a>
        );
      },
      sortable: false,
    },
  ];
  const [exportData, setExportData] = useState({ columns: columns });

  document.addEventListener("mousedown", (event) => {
    const concernedElement = document.querySelector(".filter-container");

    if (concernedElement && concernedElement.contains(event.target)) {
      setLevelMenu(true);
      // setImportDivStatus(true);
    } else {
      if (event.target.className !== "btn btn-primary nav-link") {
        if (event.target.className !== "icon-filter") {
          setLevelMenu(false);
          // setImportDivStatus(true);
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
  // Sailaja Changed Payments_Export Buttons columns as per order of Data Table on 14th June.

  //export
  const headersForExportFile = [
    ["all", "All"],
    // ["username", "ID"],
    ["username", " User ID"],
    ["franchise", "Franchise"],
    ["name", "Customer Name"],
    ["mobile_number", "Mobile No."],
    ["payment_id", "Payment ID"],
    ["pickup_type", "Payment Method"],
    ["status", "Payment Status"],
    ["payment_method", "Payment Type"],
    ["amount", "Amount"],
    ["online_payment_mode", "Online Payment"],
    ["collected_by", "Collected By"],
    ["completed_date", "Collected Date"],
    ["due_amount", "Due Amount"],


    // ["name", "Customer Name"],
    // ["franchise", "Franchise Name"],





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

  const handleExportDataAsPDF = (headersForPDF) => {
    setIsExportDataModalToggle(!isExportDataModalOpen);
    // code for displaying franchise owner details and branch owner details based on login in exported pdf
    let userinformation = {};
    if (tokenInfo && tokenInfo.user_type === "Branch Owner") {
      userinformation = { ...tokenInfo.branch };
    } else if (tokenInfo && tokenInfo.user_type === "Franchise Owner") {
      userinformation = { ...tokenInfo.franchise };
    }

    let titleAddress = "";
    const {
      city,
      country,
      district,
      house_no,
      landmark,
      pincode,
      state,
      street,
    } = { ...userinformation.address };
    if (userinformation) {
      titleAddress +=
        "" +
        "\n" +
        " " +
        " " +
        "" +
        "\n" +
        "\n" +
        " " +
        "\n" +
        "\n" +
        "\n" +
        "ID " +
        ": " +
        "" +
        "" +
        userinformation.id +
        "\n" +
        "Name " +
        ": " +
        userinformation.name +
        "\n" +
        "Address : " +
        house_no +
        ", " +
        landmark +
        "\n" +
        " " +
        street +
        ", " +
        city +
        "\n" +
        " " +
        district +
        ", " +
        state +
        "\n" +
        " " +
        country +
        ", " +
        pincode +
        "";
    }

//Sailaja Changed PDF File Name as Payments (691th Line ) on 14th July

    const title =
      tokenInfo && tokenInfo.user_type != "Admin" ? `${titleAddress}` : "";
    downloadPdf(title, headersForPDF, filteredData, "Payments");
    // downloadPdf(title, headersForPDF, filteredData, "Billing");

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
  //modal for insufficient modal
  const permissiontoggle = () => {
    setPermissionModal(!permissionmodal);
  };
  //end

  // scroll top
  const ref = useRef();
  useEffect(() => {
    ref.current.scrollIntoView(0, 0);
  }, []);

  //handler for custom date
  const customHandler = (e) => {
    if (e.target.name === "start_date") {
      setCustomstartdate(e.target.value);
    }
    if (e.target.name === "end_date") {
      setCustomenddate(e.target.value);
    }
  };

  const getstartdateenddate = (e) => {
    setDaterange(e.target.value);
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
    //today
    let startdate = moment().format("YYYY-MM-DD");
    let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
    let enddate = moment(date).format("YYYY-MM-DD");
    if (e.target.value === "today") {
      //yesterday
    } else if (e.target.value === "yesterday") {
      startdate = moment().subtract(1, "d").format("YYYY-MM-DD");
      enddate = moment(date).subtract(1, "d").format("YYYY-MM-DD");
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
        .add(1, "day")
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
        .add(1, "day")
        .format("YYYY-MM-DD");
    }
    //custom
    else if (e.target.value === "custom") {
      startdate = e.target.value;
      enddate = e.target.value;
    }
    if (location?.state?.billingDateRange) {
      history.replace(location?.pathname, {});
    }
    return { startdate: startdate, enddate: enddate };
  };

  const daterangeselection = (e, value) => {
    let startdateenddateobj = getstartdateenddate(e);
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    //

    const data1 = {};
    data1.start_date = startdateenddateobj.startdate;
    data1.end_date = startdateenddateobj.enddate;

    billingaxios
      .get(
        `payment/list?start_date=${startdateenddateobj.startdate}&end_date=${startdateenddateobj.enddate}`,
        { start_date: customstartdate, end_date: customenddate },

        data1,
        config
      )
      .then((response) => {
        setData(response.data);
        setFiltereddataBkp(response.data);
        setFiltereddata(response.data);
        setLoading(false);
        setRefresh(0);
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
          // toast.error("Something went wrong", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
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
  };
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
  // const handleSelectedRows = (selectedRows) => {
  //   const tempFilteredData =
  //     filteredData.map((item) => ({ ...item, selected: false })) || [];
  //   const selectedIds = selectedRows.map((item) => item.id);
  //   const temp = tempFilteredData.map((item) => {
  //     if (selectedIds.includes(item.id)) return { ...item, selected: true };
  //     else return { ...item, selected: false };
  //   });
  //   setFiltereddata(temp);
  // };
  const conditionalRowStyles = [
    {
      when: (row) => row.selected === true,
      style: {
        backgroundColor: "#E4EDF7",
      },
    },
  ];
  //end
 
 
  {/* Sailaja on 11th July   Line number 899 id="breadcrumb_margin" change the breadcrumb position */}
  return (
    <Fragment>
      <div ref={ref}>
        <br />
        <Container fluid={true}>
          <Grid container spacing={1} id="breadcrumb_margin">
            <Grid item md="12">
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
                {/* Sailaja changed Customer Relations_Payments_Billing History  line numbers 920,921 on 13th July */}
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
                  Billing History
                </Typography>
              </Breadcrumbs>
            </Grid>
            {/* Sailaja on 11th July   Line number 936 id="breadcrumb_table" change the breadcrumb position */}          </Grid>
          <br />
          <br />

          <div className="edit-profile data_table" id="breadcrumb_table">
            <Stack direction="row" spacing={2}>
              {/* filtering for today */}
              <span className="all_cust">Payments</span>

              <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }}>
                {calender ? (
                  <div style={{ display: "flex", height: "40px" }}>
                    <Col sm="6">
                      <FormGroup>
                        <div className="input_wrap">
                          <Input
                            className={`form-control-digits not-empty`}
                            onChange={customHandler}
                            // className={`form-control digits ${formData && formData.code ? 'not-empty' : ''}`}
                            // value={data1 && data1.start_date}
                            type="date"
                            id="meeting-time"
                            name="start_date"
                          />
                          <Label for="meeting-time" className="form_label">
                            Start Date
                          </Label>
                        </div>
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <FormGroup>
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
                          />
                          <Label for="meeting-time" className="form_label">
                            End Date
                          </Label>
                        </div>
                      </FormGroup>
                    </Col>
                  </div>
                ) : (
                  ""
                )}
                {token.permissions.includes(BILLING.DATE_SEARCH) && (
                  <div className="input_wrap">
                    <Input
                      className={`form-control-digits not-empty`}
                      type="select"
                      name="daterange"
                      value={daterange}
                      onChange={daterangeselection}
                      // onBlur={checkEmptyValue}
                      style={{
                        border: "1px solid #E0E0E0",
                        borderRadius: "4px",
                        height: "40px",
                        marginLeft: "-10px",
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
                    placeholder="Search With User ID and Mobile Number"
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
                {token.permissions.includes(BILLING.EXPORT) && (
                  <>
                    <MUIButton
                      variant="outlined"
                      onClick={handleClick}
                      className="muibuttons"
                    >
                      <img src={EXPORT} />
                    </MUIButton>
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
                <MUIButton
                  onClick={Refreshhandler}
                  variant="outlined"
                  className="muibuttons"
                >
                  <img src={REFRESH} />
                </MUIButton>

                {token.permissions.includes(BILLING.FILTERS) && (
                  <>
                    <MUIButton
                      onClick={() => OnLevelMenu(levelMenu)}
                      variant="outlined"
                      className="muibuttons"
                    >
                      <img src={FILTERS} />
                    </MUIButton>
                    <BillingFilterContainer
                      levelMenu={levelMenu}
                      setLevelMenu={setLevelMenu}
                      filteredData={filteredData}
                      setFiltereddata={setFiltereddata}
                      filteredDataBkp={filteredDataBkp}
                      loading={loading}
                      setLoading={setLoading}
                      showTypeahead={false}
                    />
                  </>
                )}
              </Stack>
            </Stack>
            {/* <Row>
              <BillingFilters
              reportsbranch={reportsbranch}/>
            </Row> */}
            <Row className="wallet">
              <Col sm="12" style={{ paddingBottom: "0px", marginTop: "33px" }}>
                {token.permissions.includes(BILLING.SUMMARYTABLE) && (
                  <>
                    <TotalCount filteredData={filteredData} />
                  </>
                )}
              </Col>
              <Col md="12" style={{ marginTop: "3%" }}>
                <Card style={{ borderRadius: "0", boxShadow: "none" }}>
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
                          <Col md="8"></Col>
                          {token.permissions.includes(BILLING.BILLING_LIST) ? (
                            <DataTable
                              className="billing-list"
                              columns={columns}
                              data={filteredData.payments}
                              noHeader
                              // striped={true}
                              // center={true}
                              // clearSelectedRows={clearSelectedRows}
                              selectableRowsComponent={NewCheckbox}
                              conditionalRowStyles={conditionalRowStyles}
                              selectableRows
                              onSelectedRowsChange={({ selectedRows }) =>
                                // handleSelectedRows(selectedRows),
                                deleteRows(selectedRows)
                              }
                              clearSelectedRows={clearSelectedRows}
                              pagination
                              noDataComponent={"No Data"}
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
                  <div className="customizer-contain">
                    <div className="tab-content" id="c-pills-tabContent">
                      <div
                        className="customizer-header"
                        style={{ padding: "0px", border: "none" }}
                      >
                        <br />
                        <i className="icon-close" onClick={closeCustomizer}></i>
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
                            <Button
                              color="secondary"
                              id="resetid"
                              onClick={handleExportclose}
                            // onClick={() => setIsExportDataModalToggle(false)}
                            >
                              {Close}
                            </Button>
                            <button
                              color="primary"
                              className="btn btn-primary openmodal"
                              id="download_button1"
                              onClick={() => handleDownload()}
                              disabled={headersForExport.length > 0 ? false : true}
                            >
                              <span className="openmodal">
                                Download
                              </span>
                            </button>

                            {/*<CopyToClipboard text={JSON.stringify(configDB)}>
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
                            <Button id="reset" onClick={toggle}>
                              {Cancel}
                            </Button> */}
                          </ModalFooter>
                        </Modal>
                      </div>
                      <div className=" customizer-body custom-scrollbar">
                        <TabContent activeTab={activeTab1}>
                          <TabPane tabId="2">
                            <h6 style={{ textAlign: "center" }}> Add Lead </h6>
                            <ul
                              className="layout-grid layout-types"
                              style={{ border: "none" }}
                            >
                              <li
                                data-attr="compact-sidebar"
                                onClick={(e) => handlePageLayputs(classes[0])}
                              >
                                <div className="layout-img"></div>
                              </li>
                            </ul>
                          </TabPane>
                          <TabPane tabId="3"></TabPane>
                        </TabContent>
                      </div>
                    </div>
                  </div>
                </Col>
                {/* modal for insufficient permissions */}
                <PermissionModal
                  content={permissionModalText}
                  visible={permissionmodal}
                  handleVisible={permissiontoggle}
                />
                {/* end */}
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
                  Select the Fields Required
                </ModalHeader> */}
                {/* Sailaja Changed Cancel Button color on 14th July Line no:1272       */}
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
                    {Close}
                  </Button>
                  <Button
                    disabled={headersForExport.length > 0 ? false : true}
                    color="primary"
                    onClick={() => handleDownload()}
                  >
                    Download
                  </Button>
                </ModalFooter>
              </Modal>
            </Row>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default BillingAndPayment;
