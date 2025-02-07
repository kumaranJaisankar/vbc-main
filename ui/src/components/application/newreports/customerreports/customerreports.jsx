import React, { Fragment, useState, useLayoutEffect, useRef } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import moment from "moment";
// import CustomerExport from "./export";
import CustomerFields from "./customerfields";
import FranchiseReports from "../franchisereports/franchisereports";
import BillingReports from "../billingreports/billingfields";
import TicketReports from "../ticketreports/ticketfields";
import ActivityReport from "../activityreports/activityreports";
import NetworkFields from "../networkreports/networkfields";
import { REPORTS } from "../../../../utils/permissions";
import Yesterdaydata from "../yesterdaydata";
import ExpiryTable from "../expiry";
import NewReportCards from "../newreportcards";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

// adding drop down option for type of report

const reportsOptions = [
  {
    value: "customer",
    label: "Customer and Revenue",
    id: REPORTS.CUSTOMER,
  },
  {
    value: "franchise",
    label: "Franchise",
    id: REPORTS.FRANCHISE,
  },
  {
    value: "ticket",
    label: "Ticket",
    id: REPORTS.TICKET,
  },
  {
    value: "billing",
    label: "Finance",
    id: REPORTS.BILLING,
  },
  // {
  //   value: 'network',
  //   label: 'Network',
  //   id: REPORTS.NETWORK,
  // }
];

const CustomerReports = (props) => {
  const width = useWindowSize();
  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  //state for customer
  const [customer, setCustomer] = useState();
  //state for franchise
  const [franchise, setFranchise] = useState();
  //end
  //state for billig
  const [billing, setBilling] = useState();
  //end
  //state for ticket
  const [ticket, setTicket] = useState();
  //end
  //state for activity
  const [activity, setActivity] = useState();
  //end

  // state for network
  const [networkField, setNetworkField] = useState();
  // end
  const [customenddate, setCustomenddate] = useState();
  const [customstartdate, setCustomstartdate] = useState();
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

  // daterange selection of using reports

  const daterangeselection = (e, value) => {
    if (e.target.value === "customer") {
      setCustomer(true);
      setFranchise(false);
      setBilling(false);
      setTicket(false);
      setActivity(false);
      setNetworkField(false);
      props.setOnsearch(false);
    }
    if (e.target.value === "franchise") {
      setFranchise(true);
      setCustomer(false);
      setBilling(false);
      setTicket(false);
      setActivity(false);
      setNetworkField(false);
      props.setOnsearch(false);
    }
    if (e.target.value === "billing") {
      setFranchise(false);
      setCustomer(false);
      setBilling(true);
      setTicket(false);
      setActivity(false);
      setNetworkField(false);
      props.setOnsearch(false);
    }
    if (e.target.value === "ticket") {
      setFranchise(false);
      setCustomer(false);
      setBilling(false);
      setTicket(true);
      setActivity(false);
      setNetworkField(false);
      props.setOnsearch(false);
    }
    if (e.target.value === "network") {
      setFranchise(false);
      setCustomer(false);
      setBilling(false);
      setTicket(false);
      setActivity(false);
      setNetworkField(true);
      props.setOnsearch(false);
    }
    if (e.target.value === "activity") {
      setFranchise(false);
      setCustomer(false);
      setBilling(false);
      setTicket(false);
      setNetworkField(false);
      setActivity(true);
    }

    setCustomstartdate();
    setCustomenddate();
  };

  //end

  //end

  //handler for custom date
  const customHandler = (e) => {
    if (e.target.name === "start_date") {
      setCustomstartdate(e.target.value);
    }
    if (e.target.name === "end_date") {
      setCustomenddate(e.target.value);
    }
  };

  const box = useRef(null);

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

  const openCustomizer = (type) => {
    setActiveTab1(type);
    document.querySelector(".customizer-contain").classList.add("open");
  };
  return (
    <Fragment>
      <Container fluid={true}>
        <div className="edit-profile data_table">
          <Row style={{ marginLeft: "-4%" }}>
            {/* <Stack direction="row" spacing={2}> */}
            <Col sm="2">
              {token.permissions.includes(REPORTS.ALLREPORTS) && (
                <div className="input_wrap">
                  <Input
                    className={`form-control-digits not-empty`}
                    type="select"
                    name=""
                    onChange={daterangeselection}
                    style={{
                      border: "1px solid rgba(25, 118, 210, 0.5",
                      borderRadius: "4px",
                    }}
                  >
                    <option value="" style={{ display: "none" }}></option>
                    <option value="" selected>
                      --Select Report--
                    </option>
                    {reportsOptions.map(
                      (item) =>
                        token.permissions.includes(item.id) && (
                          <option value={item.value}>{item.label}</option>
                        )
                    )}
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
                    Type of Report *
                  </Label>
                </div>
              )}
            </Col>

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

                    <option value="today">Today</option>
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
                    Select Date Range *
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
          {/* </Stack> */}
          <br />
          <Row>
          
            {customer ? (
              <CustomerFields
                customenddate={customenddate}
                customstartdate={customstartdate}
              />
            ) : (
              ""
            )}
          </Row>
          <Row>
            {franchise ? (
              <FranchiseReports
                customenddate={customenddate}
                customstartdate={customstartdate}
                franchise={franchise}
              />
            ) : (
              ""
            )}
          </Row>
          <Row>
            {ticket ? (
              <TicketReports
                customenddate={customenddate}
                customstartdate={customstartdate}
              />
            ) : (
              ""
            )}
          </Row>
          <Row>
            {billing ? (
              <BillingReports
                customenddate={customenddate}
                customstartdate={customstartdate}
              />
            ) : (
              ""
            )}
          </Row>
          <Row>
            {activity ? (
              <ActivityReport
                customenddate={customenddate}
                customstartdate={customstartdate}
                setOnsearch={props.setOnsearch}
              />
            ) : (
              ""
            )}
          </Row>
          <Row>
            {networkField ? (
              <NetworkFields
                customenddate={customenddate}
                customstartdate={customstartdate}
              />
            ) : (
              ""
            )}
          </Row>
          {/* end */}
        </div>
      </Container>
    </Fragment>
  );
};

export default CustomerReports;
