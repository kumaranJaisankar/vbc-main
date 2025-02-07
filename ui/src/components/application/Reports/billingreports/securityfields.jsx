import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import { adminaxios, billingaxios } from "../../../../axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { REPORTS } from "../../../../utils/permissions";
import SecurityAPI from "./securityAPI"
import { Link } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import moment from "moment";
// Sailaja imported common component Sorting on 29th March 2023
import { Sorting } from "../../../common/Sorting";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}


const SecurityReports = () => {
  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );

  //end

  const [inputs, setInputs] = useState({
    security_deposit_refund: "True"
  });
  //branch state to get all list of branches
  const [reportsbranch, setReportsbranch] = useState([]);
  //list of franchises
  const [franchiselist, setFranchiselist] = useState([]);
  const [searchbuttondisable, setSearchbuttondisable] = useState(true);
  const [payment, setPayment] = useState([]);
  const [reportstatus, setReportstatus] = useState([]);
  //show and hide deposit and ledger
  const [showdeposit, setShowdeposit] = useState(false);
  const [customstartdate, setCustomstartdate] = useState(moment().format("YYYY-MM-DD"));
  const [customenddate, setCustomenddate] = useState(moment().format("YYYY-MM-DD"));
  const [state, setState] = useState("True")
  // const [showledger, setShowledger] = useState(false);
  useEffect(() => {
    if (
      // customstartdate !== undefined ||
      // customenddate !== undefined ||
      inputs.paymentmethod !== undefined ||
      inputs.franchiselistt !== undefined ||
      inputs.branch !== undefined ||
      inputs.zone !== undefined ||
      inputs.area !== undefined ||
      inputs.collectedby !== undefined ||
      inputs.status !== undefined ||
      inputs.reporttype !== undefined
      // inputs?.security_deposit_refund !== undefined
    ) {
      setSearchbuttondisable(false);
    }
  }, [customstartdate, customenddate, inputs]);




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

    if (event.target.name == "reporttype") {
      if (event.target.value === "DEPOSIT" || event.target.value === "LEDGER") {
        setShowdeposit(true);
      } else {
        setShowdeposit(false);
      }
    }
    const target = event.target;
    var value = target.value;
    const name = target.name;
    if (name == "branch") {
      getlistoffranchise(val);
    }
    //upon select zone display area
    // if (name == "zone") {
    //   getlistofareas(val);
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


  //end

  //get franchise options based on branch selection
  const getlistoffranchise = (val) => {
    adminaxios
      .get(`franchise/${val}/branch`)
      .then((response) => {
        console.log(response.data);
        // setFranchiselist(response.data);
        // Sailaja sorting the GST Reports -> Franchise Dropdown data as alphabetical order on 29th March 2023     
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
  // const getlistofareas = (val) => {
  //   adminaxios
  //     .get(`accounts/zone/${val}/areas`)
  //     .then((response) => {
  //       console.log(response.data);
  //       setReportsarea(response.data);
  //     })
  //     .catch(function (error) {
  //       console.error("Something went wrong!", error);
  //     });
  // };
  // branch list
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        // setReportsbranch([...res.data]);
        // Sailaja sorting the GST Reports -> Branch Dropdown data as alphabetical order on 29th March 2023
        setReportsbranch(Sorting(([...res.data]), 'name'));


      })
      .catch((err) => console.log(err));
  }, []);
  //list of users
  // useEffect(() => {
  //   customeraxios
  //     .get(`customers/display/users`)
  //     .then((res) => {
  //       let { customers, assigned_to } = res.data;
  //       setReportCustomer([...customers]);
  //       setAssignedto([...assigned_to]);
  //     })
  //     .catch((err) =>
  //       toast.error("Something went wrong", {
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 1000,
  //       })
  //     );
  // }, []);
  //

  // use effect for payment
  useEffect(() => {
    billingaxios
      .get(`payment/options`)
      .then((res) => {
        let { offline_payment_modes, status } = res.data;
        setPayment([...offline_payment_modes]);
        setReportstatus([...status]);
      })
      .catch((err) =>
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        })
      );
  }, []);

  // end
  const [showhidecustomfields, setShowhidecustomfields] = useState(false);
  const basedonrangeselector = (e, value) => {
    //today
    let reportstartdate = moment().format("YYYY-MM-DD");
    let reportenddate = moment(new Date(), "DD-MM-YYYY").add(1, "day");
    if (e.target.value === "ALL9") {
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

  //handler for custom date
  const customHandler = (e) => {
    if (e.target.name === "start_date") {
      setCustomstartdate(e.target.value);
    }
    if (e.target.name === "end_date") {
      setCustomenddate(e.target.value);
    }
  };
  //added field css by Marieya and added custom date ranges for ledger reports 


  return (
    <>
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
                {/* Sailaja Fixed Gst Reports to GST Reports on bread crumps on 6th March 2023 */}
                Security Reports
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Box>
      <Container fluid={true}>
        <div className="edit-profile data_table" id="breadcrumb_table">
          <Row>
            <Col sm="2" id="breadcrum_reports1">
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

                  >
                    Select Date Range
                  </Label>
                </div>
              )}
            </Col>
            {showhidecustomfields ? (
              <>
                <Col sm="2" style={{ marginLeft: "2px" }} id="breadcrum_reports1">
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
                <Col sm="2" id="breadcrum_reports1">
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
          <Row className="mt1" id="report_fields">
            {JSON.parse(localStorage.getItem("token"))?.branch?.name ? (
              <Col sm="2">
                <FormGroup>
                  <div className="input_wrap">

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
                    <Label className="form_label">Branch </Label>
                  </div>
                </FormGroup>
              </Col>
            ) : (

              <Col sm="2">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="select"
                      name="branch"
                      className="form-control digits"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      value={inputs && inputs.branch}
                    >
                      <option style={{ display: "none" }}></option>
                      <option value="ALL" selected>All</option>
                      {reportsbranch.map((branchreport) => (
                        <option key={branchreport.id} value={branchreport.id}>
                          {branchreport.name}
                        </option>
                      ))}
                    </Input>
                    <Label className="form_label">Branch</Label>
                  </div>
                </FormGroup>
              </Col>)}

            {
              JSON.parse(localStorage.getItem("token")).franchise?.name ? (
                <Col sm="2">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        // draft
                        className={`form-control digits not-empty`}
                        value={
                          JSON.parse(localStorage.getItem("token"))?.franchise?.name
                        }
                        type="text"
                        name="franchise"
                        onChange={handleInputChange}
                        style={{ textTransform: "capitalize" }}
                        disabled={true}
                      />
                      <Label
                        className="form_label"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Franchise{" "}
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
              ) : (
                <Col sm="2">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="franchiselistt"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        value={inputs && inputs.franchiselistt}
                      >
                        <option style={{ display: "none" }}></option>
                        <option value="ALL1" selected>All</option>
                        {franchiselist.map((franchisereport) => (
                          <option
                            key={franchisereport.id}
                            value={franchisereport.id}
                          >
                            {franchisereport.name}
                          </option>
                        ))}
                      </Input>
                      <Label className="form_label">Franchise</Label>
                    </div>
                  </FormGroup>
                </Col>
              )}

            {/* <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="security_deposit_refund"
                    className="form-control digits"
                    onChange={handleInputChange}
                    value={inputs && inputs.security_deposit_refund}
                    defaultValue={"True"}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value={"All"}>All</option>
                    <option value={"True"}>Yes</option>
                    <option value={"False"}>No</option>
                  </Input>
                  <Label className="form_label" style={{ whiteSpace: "nowrap" }}>
                    Security Deposit Refund
                  </Label>
                </div>
              </FormGroup>
            </Col> */}



          </Row>

          <Row>
            <div style={{ display: "flex", marginRight: "108px" }}></div>
          </Row>
          <Row style={{ marginLeft: "2%" }}>
            <Col sm="6">
            </Col>
            <Col sm="6">
              <button
                style={{
                  whiteSpace: "nowrap",
                  fontSize: "16px",
                  height: "40px",
                  position: "relative",
                  left: "-110.4%",
                  top: "-62%",
                  fontFamily: "Open Sans",
                  fontWeight: 600,
                  width: "111px",
                  backgroundColor: "#285295 !important",
                  borderRadius: "6px"
                }}
                className="btn btn-primary openmodal"
                type="submit"
                // onClick={toggle}
                onClick={() => setSearchbuttondisable(!searchbuttondisable)}

                disabled={searchbuttondisable}
                id="reports_button"

              >
                <span style={{ marginLeft: "-10px" }} className="openmodal">
                  &nbsp;&nbsp; Search
                </span>
              </button>
            </Col>

          </Row>


          <Row>

            <Col sm="12">
              {searchbuttondisable ? (
                <SecurityAPI
                  customstartdate={customstartdate}
                  customenddate={customenddate}
                  inputs={inputs}
                  setState={setState}
                  state={state}
                />
              ) : (
                ""
              )}
            </Col>

          </Row>
        </div>
      </Container>
    </>
  );
};

export default SecurityReports;
