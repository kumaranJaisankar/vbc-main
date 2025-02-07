import React, { useEffect, useState, useLayoutEffect, useRef, useMemo } from "react";
import { Container, Row, Col, Input, FormGroup, Label, Card } from "reactstrap";
import { adminaxios, billingaxios, customeraxios } from "../../../axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import BillingModalnewreports from "./billingApi";
import Stack from "@mui/material/Stack";
import { getAppliedServiceFiltersObj, getBillingReportTableColumn } from "./data";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import debounce from "lodash.debounce";
import DataTable from "react-data-table-component";
// import Skeleton from "react-loading-skeleton";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { BILLING } from "../../../utils/permissions";
import TotalCount from "./Total"
import moment from "moment";
// Sailaja imported common component Sorting on 28th March 2023
import { Sorting } from "../../common/Sorting";
import InvoiceExport from "../Reports/billingreports/Export/invoice";
import REFRESH from "../../../assets/images/refresh.png";
import Tooltip from '@mui/material/Tooltip';
import MUIButton from "@mui/material/Button";


var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const BillingFields = (props) => {
  const location = useLocation();
  const [rightSidebar, setRightSidebar] = useState(true);
  const [customstartdate, setCustomstartdate] = useState(
    location?.state?.customstartdate || moment().format("YYYY-MM-DD")
  );
  const width = useWindowSize();
  const [modal, setModal] = useState();
  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  //end
  const [paymentType, setPaymentType] = useState();
  const [inputs, setInputs] = useState({
    status: "1",
  });
  //branch state to get all list of branches
  const [reportsbranch, setReportsbranch] = useState([]);
  //zone state to get list of zones based on branch search
  //area state based on zone selection
  const [reportsarea, setReportsarea] = useState([]);
  //list of franchises
  const [franchiselist, setFranchiselist] = useState([]);
  const [searchbuttondisable, setSearchbuttondisable] = useState(true);
  const [reportcustomer, setReportCustomer] = useState([]);
  const [payment, setPayment] = useState([]);
  const [assignedto, setAssignedto] = useState([]);
  const [reportstatus, setReportstatus] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  // get zone list in based on franchise
  const [onlOptions, setOnlOptions] = useState({});
  const [reportszone, setReportszone] = useState([]);
  const [filteredData, setFiltereddata] = useState({});
  const [refresh, setRefresh] = useState(0);

  //show and hide deposit and ledger
  const [customenddate, setCustomenddate] = useState(
    location?.state?.customenddate || moment().format("YYYY-MM-DD")

  );
  // 123
  // const [showledger, setShowledger] = useState(false);
  const [billingLists, updateBillingLists] = useState({
    uiState: { loading: false },
    currentPageNo: 1,
    currentItemsPerPage: 10,
    pageLoadData: [],
    pageLoadDataForFilter: [],
    prevURI: null,
    nextURI: null,
    appliedServiceFilters: { ...getAppliedServiceFiltersObj() },
    tabCounts: {},
    totalRows: "",
  });
  useEffect(() => {
    if (
      customstartdate !== undefined ||
      customenddate !== undefined ||
      inputs.paymentmethod !== undefined ||
      inputs.franchiselistt !== undefined ||
      inputs.branch !== undefined ||
      inputs.zone !== undefined ||
      inputs.area !== undefined ||
      inputs.collectedby !== undefined ||
      inputs.status !== undefined ||
      inputs.pickup_type !== undefined ||
      inputs.reporttype !== undefined ||
      inputs?.is_gst !== undefined ||
      inputs?.static_ip_total_cost !== undefined
    ) {
      setSearchbuttondisable(false);
    }
  }, [customstartdate, customenddate, inputs]);

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

  const toggle = () => {
    setModal(!modal);
  };
  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
  };

  // const handlePageLayputs = (type) => {
  // let key = Object.keys(type).pop();
  // let val = Object.values(type).pop();
  // document.querySelector(".page-wrapper").className = "page-wrapper " + val;
  // dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
  // localStorage.setItem("layout", key);
  // history.push(key);
  // };

  document.addEventListener("mousedown", (event) => {
    const concernedElement = document.querySelector(".filter-container");
  });





  //end

  //handle change event contine
  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
    let val = event.target.value;

    const target = event.target;
    var value = target.value;
    const name = target.name;
    if (name == "branch") {
      getlistoffranchise(val);
    }
    //upon select zone display area
    if (name == "zone") {
      getlistofareas(val);
    }
    if (name == "franchiselistt") {
      getlistofzones(val);
    }
    // if(paymentType == 'ONL'){
    //   getOnlinepaymentoptions()
    // }
  };

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }
  const box = useRef(null);
  //get list of franchises
  // useEffect(() => {
  //   adminaxios
  //     .get(`franchise/list`)
  //     .then((response) => {
  //       console.log(response.data);
  //       setFranchiselist(response.data);
  //     })
  //     .catch(function (error) {
  //       console.error("Something went wrong!", error);
  //     });
  // }, []);

  //end

  //get franchise options based on branch selection
  const getlistoffranchise = (val) => {
    adminaxios
      .get(`franchise/${val}/branch`)
      .then((response) => {
        // setFranchiselist(response.data);
        // Sailaja sorting the   Finance-> Billing History-> Franchise Dropdown data as alphabetical order on 28th March 2023
        setFranchiselist(Sorting((response.data), 'name'));


      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("token"))?.branch === null) {

    }
    else if (JSON.parse(localStorage.getItem("token"))?.branch?.id === JSON.parse(localStorage.getItem("token"))?.branch?.id) {
      adminaxios
        .get(
          `franchise/${JSON.parse(localStorage.getItem("token"))?.branch?.id
          }/branch`
        )
        .then((response) => {
          setFranchiselist(response.data);
        })
        .catch(function (error) {
          console.error("Something went wrong!", error);
        });
    }

  }, []);
  //end
  //get area options based on zone
  const getlistofareas = (val) => {
    adminaxios
      .get(`accounts/zone/${val}/areas`)
      .then((response) => {
        setReportsarea(response.data);
        // Sailaja sorting the   Finance-> Billing History-> Area Dropdown data as alphabetical order on 28th March 2023
        setReportsarea(Sorting((response.data), 'name'));
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };


  // branch list
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        // setReportsbranch([...res.data]);
        // Sailaja sorting the Finance-> Billing History -> Branch Dropdown data as alphabetical order on 28th March 2023
        setReportsbranch(Sorting(([...res.data]), 'name'));
      })
      .catch((err) => console.log(err));
  }, []);
  //list of users
  useEffect(() => {
    customeraxios
      .get(`customers/display/users`)
      .then((res) => {
        let { customers, assigned_to, status } = res.data;
        setReportCustomer([...customers]);
        // setAssignedto([...assigned_to]);
        // Sailaja sorting the Finance-> Billing History -> Collected By Dropdown data as alphabetical order on 10th April 2023
        setAssignedto(Sorting(([...assigned_to]), "username"));

      })
      .catch((err) =>
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        })
      );
  }, []);
  //

  // use effect for payment
  useEffect(() => {
    billingaxios
      .get(`payment/options`)
      .then((res) => {
        let { offline_payment_modes, status } = res.data;
        setPayment([...offline_payment_modes]);
        // Sailaja sorting the Finance-> Billing History -> Offline Payment Type Dropdown data as alphabetical order on 28th March 2023
        setPayment(Sorting(([...offline_payment_modes]), 'name'));
        setReportstatus([...status]);
      })
      .catch((err) =>
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        })
      );
  }, []);

  //get zone options based on branch selection
  const getlistofzones = (val) => {
    adminaxios
      .get(`franchise/${val}/zones`)
      .then((response) => {
        console.log(response.data);
        // setReportszone(response.data); 
        // Sailaja sorting the   Finance-> Billing History-> Zone Dropdown data as alphabetical order on 28th March 2023
        setReportszone(Sorting((response.data), 'name'));
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("token"))?.franchise === null) {
    }
    else if (JSON.parse(localStorage.getItem("token"))?.franchise?.id === JSON.parse(localStorage.getItem("token"))?.franchise?.id) {
      adminaxios
        .get(
          `franchise/${JSON.parse(localStorage.getItem("token"))?.franchise?.id
          }/zones`
        )
        .then((response) => {
          setReportszone(response.data);
        })
        .catch(function (error) {
          console.error("Something went wrong!", error);
        });
    }
  }, []);
  // end

  const [showhidecustomfields, setShowhidecustomfields] = useState(false);
  const basedonrangeselector = (e, value) => {
    //today
    let reportstartdate = moment().format("YYYY-MM-DD");
    let reportenddate = moment(new Date(), "DD-MM-YYYY").add(1, "day");

    if (e.target.value === "today") {
      setShowhidecustomfields(false);

      reportstartdate = moment().format("YYYY-MM-DD");
      reportenddate = moment().format("YYYY-MM-DD");
    }
    //yesterday
    if (location?.state?.billingDateRange === "yesterday") {
      reportstartdate = moment().subtract(1, "d").format("YYYY-MM-DD");
      reportenddate = moment().subtract(1, "d").format("YYYY-MM-DD");
    }
    else if (e.target.value === "yesterday") {
      setShowhidecustomfields(false);

      reportstartdate = moment().subtract(1, "d").format("YYYY-MM-DD");

      reportenddate = moment().subtract(1, "d").format("YYYY-MM-DD");
    }
    //last 7 days
    else if (e.target.value === "last7days") {
      setShowhidecustomfields(false);

      reportstartdate = moment().subtract(7, "d").format("YYYY-MM-DD");
      reportenddate = moment().format("YYYY-MM-DD");
    }
    else if (e.target.value === "last15days") {
      setShowhidecustomfields(false);
      reportstartdate = moment().subtract(15, "d").format("YYYY-MM-DD");
      reportenddate = moment().format("YYYY-MM-DD");
    }
    //last 30 days
    else if (e.target.value === "last30days") {
      setShowhidecustomfields(false);

      reportstartdate = moment().subtract(30, "d").format("YYYY-MM-DD");
      reportenddate = moment().format("YYYY-MM-DD");
    }
    //end
    //last week
    else if (e.target.value === "lastweek") {
      setShowhidecustomfields(false);

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
      setShowhidecustomfields(false);
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
  //added field css by Marieya and added custom date ranges for invoice reports

  const changeHandler = (event) => {
    setSearchUser(event.target.value);
  };

  const debouncedChangeHandler = useMemo(() => {
    return debounce(changeHandler, 500);
  }, []);



  const handleDownload = (row) => {
    const payload = {
      "file_path": row.file_path
    };

    billingaxios.post('payment/inv/download', payload)
      .then((response) => {
        const downloadUrl = response.data.download_url;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'filename.pdf'); // Use the desired file name
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };



  const handlePreview = (row) => {
    const payload = {
      "file_path": row.file_path
    };

    billingaxios.post('payment/inv/preview', payload)
      .then((response) => {
        const previewUrl = response.data.preview_url;
        window.open(previewUrl, '_blank');
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };

  const handleDownloadReciept = (row) => {
    console.log("in reciept download")
    const payload = {
      "file_path": row?.receipt_file_path
    };

    billingaxios.post('payment/inv/download', payload)
      .then((response) => {
        const downloadUrl = response.data.download_url;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'filename.pdf'); // Use the desired file name
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };



  const handlePreviewReciept = (row) => {
    console.log("in reciept preview")
    const payload = {
      "file_path": row?.receipt_file_path
    };

    billingaxios.post('payment/inv/preview', payload)
      .then((response) => {
        const previewUrl = response.data.preview_url;
        window.open(previewUrl, '_blank');
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };
  const tableColumns = getBillingReportTableColumn({ handleDownload, handlePreview,handleDownloadReciept, handlePreviewReciept });

  const handlePerRowsChange = (newPerPage, page) => {
    updateBillingLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,

    }));
  };

  const handlePageChange = (page) => {
    updateBillingLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
    }));
  };

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

  const conditionalRowStyles = [
    {
      when: (row) => row.selected === true,
      style: {
        backgroundColor: "#E4EDF7",
      },
    },
  ];

  useEffect(() => {
    billingaxios
      .get(`payment/method/list`)
      .then((response) => {
        setOnlOptions(response.data);
        // Sailaja sorting the Finance-> Billing History -> Online Payment Type Dropdown data as alphabetical order on 11th April 2023
        let OnlineSort = response.data
        console.log(OnlineSort, "OnlineSort")
        OnlineSort.online_payment_methods.sort();


      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  }, []);

  const [previousBranch, setPreviousBranch] = useState(null);
  const [sendFranchise, setSendFranchise] = useState(true);
  const [sendZone, setSendZone] = useState(true);
  const [sendArea, setSendArea] = useState(true);
  const handleBranchSelect = (event) => {
    setPreviousBranch(inputs.branch);
    setSendFranchise(false);
    setSendZone(false);
    setSendArea(false);
    // Update your 'inputs' state with the selected branch value
  };

  const handleFranchiseSelect = (event) => {
    setPreviousBranch(inputs.franchise);
    setSendFranchise(true);
    setSendZone(false);
    setSendArea(false);
    // Update your 'inputs' state with the selected franchise value
  };

  const handleZoneSelect = (event) => {
    setSendZone(true);
    setSendArea(false);
  };
  const handleAreaSelect = (event) => {
    setSendArea(true);
  };

  const [billingReport, setBillingReport] = useState('');
  const getQueryParams = () => {
    const {
      currentPageNo,
      currentItemsPerPage,
      appliedServiceFilters
    } = billingLists;

    let queryParams = "";

    if (currentItemsPerPage) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }

    if (appliedServiceFilters.customer_username.value.strVal) {
      queryParams += `${queryParams ? "&" : ""}username=${appliedServiceFilters.customer_username.value.strVal}`;
    }
    if (customstartdate) {
      queryParams += `${queryParams ? "&" : ""}start_date=${customstartdate
        }`;
    }

    if (customenddate) {
      queryParams += `${queryParams ? "&" : ""}end_date=${customenddate}`;
    }

    //gst filter query params 

    if (inputs && inputs.is_gst === "ALL5") {
      queryParams += ``;
    } else if (inputs && inputs.is_gst) {
      queryParams += `&is_gst=${inputs.is_gst}`;
    }

    //end   
    // static ip
if (inputs && inputs.static_ip_total_cost) {
      queryParams += `&static_ip_total_cost=${inputs.static_ip_total_cost}`;
    }

    // branch

    if (inputs && inputs.branch === "ALL") {
      queryParams += ``;

    } else if (inputs && inputs.branch) {
      queryParams += `${queryParams ? "&" : ""}branch=${inputs.branch
        }`;

    }


    // franchise



    if (inputs && inputs.franchiselistt === "ALL1") {
      queryParams += ``;

    } else if (inputs && inputs.franchiselistt && sendFranchise) {
      queryParams += `${queryParams ? "&" : ""}franchise=${inputs.franchiselistt
        }`;

    }

    // zone
    if (inputs && inputs.zone === "ALL6") {
      queryParams += ``;

    } else if (inputs && inputs.zone && sendZone) {
      queryParams += `${queryParams ? "&" : ""}zone=${inputs.zone
        }`;

    }

    // area
    if (inputs && inputs.area === "ALL8") {
      queryParams += ``;

    } else if (inputs && inputs.area && sendArea) {
      queryParams += `${queryParams ? "&" : ""}area=${inputs.area
        }`;

    }
    // payment_method

    if (inputs && inputs.paymentmethod === "ALL3") {
      queryParams += ``;

    } else if (inputs && inputs.paymentmethod && inputs.pickup_type == "ONL") {
      queryParams += `${queryParams ? "&" : ""}online_payment_method=${inputs.paymentmethod
        }`;

    } else if (inputs && inputs.paymentmethod && inputs.pickup_type == "OFL") {
      queryParams += `${queryParams ? "&" : ""}offline_payment_method=${inputs.paymentmethod
        }`;

    }

    // status



    if (inputs && inputs.status === "ALL5") {
      queryParams += ``;

    } else if (inputs && inputs.status) {
      queryParams += `${queryParams ? "&" : ""}status=${inputs.status
        }`;

    }
    // payment mode added by Marieya on 25/10/22

    if (inputs && inputs.pickup_type === "ALL7") {
      queryParams += ``;

    } else if (inputs && inputs.pickup_type) {
      queryParams += `${queryParams ? "&" : ""}pickup_type=${inputs.pickup_type
        }`;

    }

    // collected by

    if (inputs && inputs.collectedby === "ALL4") {
      queryParams += ``;

    } else if (inputs && inputs.collectedby) {
      queryParams += `${queryParams ? "&" : ""}collected_by=${inputs.collectedby
        }`;

    }

    return queryParams;
  };
  const searchInputField = useRef(null);

  const RefreshHandler = () => {
    setRefresh((prevValue) => prevValue + 1);
    if (searchInputField.current) searchInputField.current.value = "";
  };
  return (
    <>
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
        </Grid>
        <br />
        <br />

        <div className="edit-profile data_table" id="breadcrumb_table">
          <Stack direction="row" spacing={2}>
            {/* filtering for today */}
            <span className="all_cust">Payments</span>

            <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }} >


              <Paper
                component="div"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: 400,
                  height: "40px",
                  boxShadow: "none",
                  border: "1px solid #E0E0E0",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search With Customer ID"
                  inputProps={{ "aria-label": "search google maps" }}
                  onChange={debouncedChangeHandler}
                />
                <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                  <SearchIcon />
                </IconButton>
              </Paper>

            </Stack>
            <Tooltip title={"Refresh"}>
              <MUIButton
                // onClick={() => RefreshHandler('')}
                onClick={RefreshHandler}

                variant="outlined"
                className="muibuttons"
              >
                <img src={REFRESH} className="Header_img" />
              </MUIButton>
            </Tooltip>
            {token.permissions.includes(BILLING.EXPORT) && (
              <Grid>
                <InvoiceExport
                  billingLists={billingLists}
                  updateBillingLists={updateBillingLists}
                  tableColumns={tableColumns}
                  getQueryParams={getQueryParams}
                  billingReport={billingReport}
                />
              </Grid>
            )}
          </Stack>
          <Row className="mt1" id="report_fields" >
            {JSON.parse(localStorage.getItem("token"))?.branch?.name ? (
              <Col sm="2">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Branch</Label>
                    <Input
                      className={`form-control digits not-empty`}
                      value={
                        JSON.parse(localStorage.getItem("token"))?.branch?.name
                      }
                      type="text"
                      name="branch"
                      onChange={handleInputChange}
                      style={{ textTransform: "capitalize" }}
                      disabled={true}
                    />
                  </div>
                </FormGroup>
              </Col>
            ) : (
              <Col sm="2">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Branch</Label>
                    <Input
                      type="select"
                      name="branch"
                      className="form-control digits"
                      onChange={(e) => { handleInputChange(e); handleBranchSelect(e) }}
                      onBlur={checkEmptyValue}
                      value={inputs && inputs.branch}
                    >
                      <option style={{ display: "none" }}></option>
                      <option value="ALL">All</option>
                      {reportsbranch.map((branchreport) => (
                        <option key={branchreport.id} value={branchreport.id}>
                          {branchreport.name}
                        </option>
                      ))}
                    </Input>

                  </div>
                </FormGroup>
              </Col>)}
            {JSON.parse(localStorage.getItem("token"))?.franchise?.name ? (
              <Col sm="2">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Franchise </Label>
                    <Input
                      type="text"
                      name="franchiselistt"
                      className="form-control digits"
                      onChange={handleInputChange}
                      disabled={true}
                      value={
                        JSON.parse(localStorage.getItem("token"))?.franchise?.name
                      }
                    ></Input>
                  </div>
                </FormGroup>
              </Col>
            ) : (
              <Col sm="2">
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label">Franchise</Label>
                    <Input
                      type="select"
                      name="franchiselistt"
                      className="form-control digits"
                      onChange={(e) => { handleInputChange(e); handleFranchiseSelect(e) }}
                      onBlur={checkEmptyValue}
                      value={inputs && inputs.franchiselistt}
                    >
                      <option style={{ display: "none" }}></option>
                      <option value="ALL1">All</option>
                      {franchiselist.map((franchisereport) => (
                        <option
                          key={franchisereport.id}
                          value={franchisereport.id}
                        >
                          {franchisereport.name}
                        </option>
                      ))}
                    </Input>

                  </div>
                </FormGroup>
              </Col>)}
            <Col sm="2" >
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Zone </Label>
                  <Input
                    type="select"
                    name="zone"
                    className="form-control digits"
                    onChange={(e) => { handleInputChange(e); handleZoneSelect(e) }}
                    value={inputs && inputs.zone}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL6">All</option>
                    {reportszone.map((zonereport) => (
                      <option key={zonereport.id} value={zonereport.id}>
                        {zonereport.name}
                      </option>
                    ))}
                  </Input>

                </div>
              </FormGroup>
            </Col>
            <Col sm="2" >
              <FormGroup>
                <div className="input_wrap">
                  <Label
                    className="kyc_label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Area
                  </Label>
                  <Input
                    type="select"
                    name="area"
                    className="form-control digits"
                    onChange={(e) => { handleInputChange(e); handleAreaSelect(e) }}
                    value={props.inputs && props.inputs.area}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL8">All</option>
                    {reportsarea.map((areareport) => (
                      <option key={areareport.id} value={areareport.id}>
                        {areareport.name}
                      </option>
                    ))}
                  </Input>


                </div>
              </FormGroup>
            </Col>
            <Col sm="2" className="padding-10">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Payment Mode</Label>
                  <Input
                    type="select"
                    name="pickup_type"
                    className="form-control digits"
                    onChange={(event) => {
                      handleInputChange(event);
                      setPaymentType(event.target.value)
                    }}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.pickup_type}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL7">All</option>
                    <option value="ONL">Online</option>
                    <option value="OFL">Offline</option>
                  </Input>

                </div>
              </FormGroup>
            </Col>
            <Col sm="2" hidden={paymentType != 'OFL'} >
              <FormGroup>
                <div className="input_wrap">
                  <Label
                    className="kyc_label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Payment Type
                  </Label>
                  <Input
                    type="select"
                    name="paymentmethod"
                    className="form-control digits"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.payment}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL3">All</option>
                    {payment.map((paymentreport) => (
                      <option key={paymentreport.id} value={paymentreport.id}>
                        {paymentreport.name}
                      </option>
                    ))}
                  </Input>
                </div>
              </FormGroup>
            </Col>
            <Col sm="2" hidden={paymentType != 'ONL'} >
              <FormGroup>
                <div className="input_wrap">
                  <Label
                    className="kyc_label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Payment Type
                  </Label>
                  <Input
                    type="select"
                    name="paymentmethod"
                    className="form-control digits"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.onlOptions}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL3">All</option>
                    {onlOptions?.online_payment_methods?.map((onlineoptions) => (
                      <option value={onlineoptions}>
                        {onlineoptions}
                      </option>
                    ))}

                  </Input>
                </div>
              </FormGroup>
            </Col>
            {/*Payment Mode field added by Marieya on 25-10-22 */}

            {/* <div hidden={inputs.reporttype != "INVOICE"}> */}
            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Label
                    className="kyc_label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Collected By
                  </Label>
                  <Input
                    type="select"
                    name="collectedby"
                    className="form-control digits"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.collectedby}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL4">All</option>
                    {assignedto.map((assignedtobilling) => (
                      <option
                        key={assignedtobilling.id}
                        value={assignedtobilling.id}
                      >
                        {assignedtobilling.username}
                      </option>
                    ))}
                  </Input>
                </div>
              </FormGroup>
            </Col>

            <Col sm="2" className="padding-10">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Status</Label>
                  <Input
                    type="select"
                    name="status"
                    className="form-control digits"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.status}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL5">All</option>
                    {reportstatus.map((reportforstatus) => (
                      <option
                        key={reportforstatus.id}
                        value={reportforstatus.id}
                      >
                        {reportforstatus.name}
                      </option>
                    ))}
                  </Input>

                </div>
              </FormGroup>
            </Col>


            {token.permissions.includes(BILLING.DATE_SEARCH) && (
              <>
                {location?.state?.customstartdate === moment().subtract(7, "d").format("YYYY-MM-DD") ?

                  <Col sm="2">
                    <div className="input_wrap">
                      <Label for="meeting-time" className="kyc_label">
                        Select Date Range
                      </Label>
                      <Input
                        className={`form-control-digits not-empty`}
                        type="select"
                        name="daterange"
                        onChange={basedonrangeselector}
                        style={{
                          border: "1px solid rgba(25, 118, 210, 0.5",
                          borderRadius: "4px",
                        }}
                      >
                        <option value="" style={{ display: "none" }}></option>

                        <option value="today" >
                          Today
                        </option>
                        <option value="yesterday">Yesterday</option>
                        <option value="lastweek">Last Week</option>
                        <option value="last7days" selected>Last 7 Days</option>
                        <option value="last15days" >Last 15 Days</option>
                        <option value="last30days">Last 30 Days</option>
                        <option value="lastmonth">Last Month</option>
                        <option value="custom">Custom</option>
                      </Input>
                    </div>
                  </Col> : location?.state?.customstartdate === moment().subtract(15, "d").format("YYYY-MM-DD") ?
                    <Col sm="2">
                      <div className="input_wrap">
                        <Label for="meeting-time" className="kyc_label">
                          Select Date Range
                        </Label>
                        <Input
                          className={`form-control-digits not-empty`}
                          type="select"
                          name="daterange"
                          onChange={basedonrangeselector}
                          style={{
                            border: "1px solid rgba(25, 118, 210, 0.5",
                            borderRadius: "4px",
                          }}
                        >
                          <option value="" style={{ display: "none" }}></option>

                          <option value="today" >
                            Today
                          </option>
                          <option value="yesterday">Yesterday</option>
                          <option value="lastweek">Last Week</option>
                          <option value="last7days" >Last 7 Days</option>
                          <option value="last15days" selected>Last 15 Days</option>
                          <option value="last30days">Last 30 Days</option>
                          <option value="lastmonth">Last Month</option>
                          <option value="custom">Custom</option>
                        </Input>
                      </div>
                    </Col>
                    : location?.state?.customstartdate === moment().subtract(30, "d").format("YYYY-MM-DD") ?
                      <Col sm="2">
                        <div className="input_wrap">
                          <Label for="meeting-time" className="kyc_label">
                            Select Date Range
                          </Label>
                          <Input
                            className={`form-control-digits not-empty`}
                            type="select"
                            name="daterange"
                            onChange={basedonrangeselector}
                            style={{
                              border: "1px solid rgba(25, 118, 210, 0.5",
                              borderRadius: "4px",
                            }}
                          >
                            <option value="" style={{ display: "none" }}></option>

                            <option value="today" >
                              Today
                            </option>
                            <option value="yesterday">Yesterday</option>
                            <option value="lastweek">Last Week</option>
                            <option value="last7days" >Last 7 Days</option>
                            <option value="last15days" >Last 15 Days</option>
                            <option value="last30days" selected>Last 30 Days</option>
                            <option value="lastmonth">Last Month</option>
                            <option value="custom">Custom</option>
                          </Input>
                        </div>
                      </Col>
                      : <Col sm="2">
                        <div className="input_wrap">
                          <Label for="meeting-time" className="kyc_label">
                            Select Date Range
                          </Label>
                          <Input
                            className={`form-control-digits not-empty`}
                            type="select"
                            name="daterange"
                            onChange={basedonrangeselector}
                            style={{
                              border: "1px solid rgba(25, 118, 210, 0.5",
                              borderRadius: "4px",
                            }}
                          >
                            <option value="" style={{ display: "none" }}></option>

                            <option value="today" selected>
                              Today
                            </option>
                            <option value="yesterday">Yesterday</option>
                            <option value="lastweek">Last Week</option>
                            <option value="last7days">Last 7 Days</option>
                            <option value="last15days" >Last 15 Days</option>
                            <option value="last30days">Last 30 Days</option>
                            <option value="lastmonth">Last Month</option>
                            <option value="custom">Custom</option>
                          </Input>
                        </div>
                      </Col>

                }


              </>
            )}
            {showhidecustomfields ? (
              <>
                <Col sm="2">
                  {/* <Col sm="7"> */}
                  <FormGroup>
                    <div className="input_wrap">
                      <Label for="meeting-time" className="kyc_label">
                        From Date
                      </Label>
                      <Input
                        className={`form-control-digits not-empty`}
                        onChange={customHandler}
                        type="date"
                        id="meeting-time"
                        name="start_date"
                        value={!!customstartdate && customstartdate}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="2">
                  {/* <Col sm="7" style={{ marginLeft: "-6px" }}> */}
                  <FormGroup>
                    <div className="input_wrap">
                      <Label for="meeting-time" className="kyc_label">
                        To Date
                      </Label>
                      <Input
                        className={`form-control-digits not-empty`}
                        onChange={customHandler}
                        type="date"
                        id="meeting-time"
                        name="end_date"
                        value={!!customenddate && customenddate}
                      />
                    </div>
                  </FormGroup>
                </Col>
              </>
            ) : (
              ""
            )}
            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label" style={{ whiteSpace: "nowrap" }}>
                    GSTIN
                  </Label>
                  <Input
                    type="select"
                    name="is_gst"
                    className="form-control digits"
                    onChange={handleInputChange}
                    value={inputs && inputs.is_gst}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value={"True"}>Yes</option>
                    <option value={"False"}>No</option>
                  </Input>
                </div>
              </FormGroup>
            </Col>
            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label" style={{ whiteSpace: "nowrap" }}>
                    Static Ip Cost
                  </Label>
                  <Input
                    type="select"
                    name="static_ip_total_cost"
                    className="form-control digits"
                    onChange={handleInputChange}
                    value={inputs && inputs.static_ip_total_cost}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value={"True"}>Yes</option>
                    <option value={"False"}>No</option>
                  </Input>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <BillingModalnewreports
                refresh={refresh}
                setRefresh={setRefresh}
                RefreshHandler={RefreshHandler}
                getQueryParams={getQueryParams}
                setBillingReport={setBillingReport}
                sendFranchise={sendFranchise}
                sendZone={sendZone}
                sendArea={sendArea}
                customstartdate={customstartdate}
                customenddate={customenddate}
                inputs={inputs}
                basedonrangeselector={basedonrangeselector}
                billingLists={billingLists}
                updateBillingLists={updateBillingLists}
                searchUser={searchUser}
                tableColumns={tableColumns}
                setFiltereddata={setFiltereddata}

              />
            </Col>
          </Row>
          <Row className="mt1" >
            <TotalCount filteredData={filteredData} />
          </Row>
          {token.permissions.includes(BILLING.BILLING_LIST) ? (
            <Grid item md="12" sx={{ display: "flex", flexFlow: "column-reverse", marginTop: "-50px" }}>
              <Col md="12" className="department" style={{ marginTop: "56px" }}>
                <Card style={{ borderRadius: "0", boxShadow: "none" }}>
                  <Col xl="12" style={{ padding: "0" }}>
                    <DataTable
                      className="billing-list1"

                      columns={tableColumns}
                      data={billingLists.pageLoadData || []}
                      noHeader
                      clearSelectedRows={false}
                      progressPending={billingLists.uiState?.loading}
                      progressComponent={
                        <SkeletonLoader loading={billingLists.uiState.loading} />
                      }
                      pagination
                      paginationServer
                      paginationTotalRows={billingLists.totalRows}
                      onChangeRowsPerPage={handlePerRowsChange}
                      onChangePage={handlePageChange}
                      noDataComponent={"No Data"}
                      selectableRowsComponent={NewCheckbox}
                      conditionalRowStyles={conditionalRowStyles}
                      selectableRows
                    // conditionalRowStyles={conditionalRowStyles}
                    />
                  </Col>
                </Card>
              </Col>
            </Grid>
          ) : <p style={{ textAlign: "center" }}>
            {"You have insufficient permissions to view this"}
          </p>}
        </div>
      </Container>
    </>
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

export default BillingFields;
