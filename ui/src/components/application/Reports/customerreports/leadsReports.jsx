import React, {
    Fragment,
    useEffect,
    useState,
    useLayoutEffect,
    useRef,
  } from "react";
  import {
    Container,
    Row,
    Col,
    Input,
    FormGroup,
    Label,
    TabContent,
    TabPane,
  } from "reactstrap";
  import Grid from "@mui/material/Grid";
  import { adminaxios } from "../../../../axios";
  import { useSelector, useDispatch } from "react-redux";
  import { useHistory } from "react-router-dom";
  import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
  import moment from "moment";
  // import CustomerExport from "./export";
  import { REPORTS } from "../../../../utils/permissions";
  import Yesterdaydata from '../yesterdaydata'
  import ExpiryTable from "../expiry";
  import NewReportCards from "../newreportcards";
  import BillingReports from "../billingreports/billingfields";
  import { Link } from "react-router-dom";
  import Breadcrumbs from "@mui/material/Breadcrumbs";
  import NavigateNextIcon from "@mui/icons-material/NavigateNext";
  import Typography from "@mui/material/Typography";
  import Box from "@mui/material/Box";
import LeadsFields from "./leadsFields";
  
  
  
  var storageToken = localStorage.getItem("token");
  if (storageToken !== null) {
    var token = JSON.parse(storageToken);
  }
  
  // adding drop down option for type of report
  
  
  
  const LeadsReports = (props) => {
    const width = useWindowSize();
    const [modal, setModal] = useState();
    const configDB = useSelector((content) => content.Customizer.customizer);
    const mix_background_layout = configDB.color.mix_background_layout;
    const [sidebar_type, setSidebar_type] = useState(
      configDB.settings.sidebar.type
    );
  
    //end
  
    // end
    const [customenddate, setCustomenddate] = useState(moment().format("YYYY-MM-DD"));
    const [customstartdate, setCustomstartdate] = useState(moment().format("YYYY-MM-DD"));
    const [inputs, setInputs] = useState();
    const [showhidecustomfields, setShowhidecustomfields] = useState(false);
  
    // open sidepanel
    const [rightSidebar, setRightSidebar] = useState(true);
    const [activeTab1, setActiveTab1] = useState("1");
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
    });
  
   
  
   
  
    //handle change event
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
    
      //upon select zone display area
    
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
  
    function checkEmptyValue(e) {
      if (e.target.value == "") {
        e.target.classList.remove("not-empty");
      } else {
        e.target.classList.add("not-empty");
      }
    }
    const box = useRef(null);
  
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
  
    const openCustomizer = (type) => {
      setActiveTab1(type);
      document.querySelector(".customizer-contain").classList.add("open");
    };
    //added field css by Marieya and added custom date ranges for revenue reports 
  
    return (
      <Fragment>
        <Box sx={{ padding: 4 }}>
          <Grid container spacing={1} >
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
                  Dashboard
                </Typography>
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color=" #377DF6"
                  fontSize="14px"
                ><Link
                  to={`${process.env.PUBLIC_URL}/app/Reports/Reports/allreports/${process.env.REACT_APP_API_URL_Layout_Name}`}
                >
                    Reports</Link>
                </Typography>
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color="#00000 !important"
                  fontSize="14px"
                  className="last_typography"
  
                >
                  Leads Reports
                  {/* Revenue Reports */}
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
        </Box>
        <Container fluid={true}>
          <div className="edit-profile data_table" id="breadcrumb_table">
            <Row className="mt1" id="breadcrum_reports">
  
  
              <Col sm="2">
                {token.permissions.includes(REPORTS.DATE_RANGE) && (
                  <div className="input_wrap">
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
                      <option value="" selected style={{ display: "none" }}>
                        --Select Date--
                      </option>
                      <option value="ALL9" >Untill Today</option>
                      <option value="today" selected>Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="lastweek">Last Week</option>
                      <option value="last7days">Last 7 Days</option>
                      <option value="last30days">Last 30 Days</option>
                      <option value="lastmonth">Last Month</option>
                      <option value="custom">Custom</option>
                    </Input>
                    <Label
                      for="meeting-time"
                      className="form_label"
                    // style={{
                    //   color: "#1976d2",
                    //   fontWeight: "500",
                    //   fontSize: "0.875rem",
                    // }}
                    >
                      Select Date Range
                    </Label>
                  </div>
                )}
              </Col>
              {/* <Col sm="2">
                  <button
                    onClick={() => openCustomizer("2")}
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "medium",
                    }}
                    className="btn btn-primary openmodal"
                    type="submit"
                    id="update_button"
                  >
                     <i
                      className="icofont icofont-plus openmodal"
                      style={{
                        paddingRight:"7px",
                        cursor: "pointer",
                      }}
                    ></i>
                    <span style={{ marginLeft: "-10px" }} className="openmodal">
                      &nbsp;&nbsp; Info{" "}
                    </span>
                   
                  </button>
                </Col> */}
              <Row>
                <Col md="12">
                  <div
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
                        <i className="icon-close" onClick={closeCustomizer}></i>
                        <br />
                        <br />
                      </div>
                      <div className=" customizer-body custom-scrollbar">
                        <TabContent activeTab={activeTab1}>
                          <TabPane tabId="2">
                            <div id="headerheading"> Reports </div>
                            <ul
                              className="layout-grid layout-types"
                              style={{ border: "none" }}
                            >
                              <li
                                data-attr="compact-sidebar"
                              // onClick={(e) => handlePageLayputs(classes[0])}
                              >
                                <div className="layout-img">
                                  <Grid
                                    container
                                    rowSpacing={1}
                                    columnSpacing={7}
                                    sx={{ marginTop: "10px" }}
                                  >
                                    <Grid
                                      item
                                      md="4"
                                      style={{
                                        flex: "0 0 33.333%",
                                        display: "flex",
                                      }}
                                    >
                                      <NewReportCards
                                      // customerInfo={customerInfo}
                                      />
                                    </Grid>
                                    <Grid
                                      item
                                      md="4"
                                      style={{
                                        flex: "0 0 33.333%",
                                        display: "flex",
                                      }}
                                    >
                                      <Yesterdaydata
                                        todayInfo={props.todayInfo}
                                      />
                                    </Grid>
                                    <Grid
                                      item
                                      md="4"
                                      style={{
                                        flex: "0 0 33.333%",
                                        display: "flex",
                                      }}
                                    >
                                      <ExpiryTable todayInfo={props.todayInfo} />
                                    </Grid>
                                  </Grid>
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
              {showhidecustomfields ? (
                <>
                  <Col sm="2" style={{ marginLeft: "2px" }}>
                    {/* <Col sm="7"> */}
                    <FormGroup>
                      <div className="input_wrap">
                        <Input
                          className={`form-control-digits not-empty`}
                          onChange={customHandler}
                          type="date"
                          id="meeting-time"
                          name="start_date"
                          value={!!customstartdate && customstartdate}
                        />
                        <Label for="meeting-time" className="form_label">
                          From Date
                        </Label>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col sm="2">
                    {/* <Col sm="7" style={{ marginLeft: "-6px" }}> */}
                    <FormGroup>
                      <div className="input_wrap">
                        <Input
                          className={`form-control-digits not-empty`}
                          onChange={customHandler}
                          type="date"
                          id="meeting-time"
                          name="end_date"
                          value={!!customenddate && customenddate}
                          min={customstartdate}
                        />
                        <Label for="meeting-time" className="form_label">
                          To Date
                        </Label>
                      </div>
                    </FormGroup>
                  </Col>
                </>
              ) : (
                ""
              )}
            </Row>
            <Row id="report_fields">
              <LeadsFields
                customenddate={customenddate}
                customstartdate={customstartdate}
              />
  
            </Row>
          </div>
        </Container>
      </Fragment>
    );
  };
  
  export default LeadsReports;
  