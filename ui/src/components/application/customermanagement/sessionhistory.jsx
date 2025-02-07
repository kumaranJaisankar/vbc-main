import React, { Fragment, useEffect, useState, useLayoutEffect, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import {
  Container,
  Row,
  Col,
  Button,
  Input,
  FormGroup,
  Label, Spinner
} from "reactstrap";
import moment from "moment";
import Box from "@mui/material/Box";
import { customeraxios } from "../../../axios";
import DataTable from "react-data-table-component";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SessionTotalCount from "./sessionTotalCount";
import SessionExport from "./SessionExport/SessionExport"
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import REFRESH from "../../../assets/images/refresh.png";
import MUIButton from "@mui/material/Button";
const SessionHistory = (props) => {
  const [authData, setAuthData] = useState([]);
  const [filteredAuthData, setFilteredAuthdata] = useState(authData);
  const width = useWindowSize();
  const [refresh, setRefresh] = useState(0);
  const [selectedTab, setSelectedTab] = useState("traffic");
  const [customstartdateAuth, setCustomstartdateAuth] = useState();
  const [customenddateAuth, setCustomenddateAuth] = useState();
  const [loaderSpinneer, setLoaderSpinner] = useState(false)
  const [searchUser, setSearchUser] = useState("");
  const [searchUser1, setSearchUser1] = useState("");

  //state for password by marieya 
  const [show, setShowpassword] = useState(false);


  const [formData, setFormData] = useState({
    framedipaddress: "",
    macId: "",
  });

  const configDB = useSelector((content) => content.Customizer.customizer);

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
    setExportData({
      ...exportData,
      data: props.filteredData,
    });
  }, [props.filteredData]);
  useEffect(() => {
    setExportAuthData({
      ...exportAuthData,
      data: filteredAuthData,
    });
  }, [filteredAuthData]);

  const displayTotaltime = (seconds) => {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    return dDisplay + hDisplay + mDisplay;
  };


  //For reconnect api call
  const reconnect = () => {
    if (props?.selectedRow) {
      setLoaderSpinner(true)
      customeraxios
        .post(`customers/radius/revise/${props?.selectedRow?.user?.username}`)
        .then((res) => {
          setTimeout(()=>{

            props.trafficreport()
          },[3000])
          setLoaderSpinner(false)
          toast.success(res?.data?.detail, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          console.log(res);
        }).catch((error) => {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          setLoaderSpinner(false)
        })
    }
  };

  const customHandler = (e) => {
    if (e.target.name === "start_date") {
      props.setCustomstartdate(e.target.value);
    }
    if (e.target.name === "end_date") {
      props.setCustomenddate(e.target.value);
    }
  };



  const customHandlerAuth = (e) => {
    if (e.target.name === "start_date") {
      setCustomstartdateAuth(e.target.value);
    }
    if (e.target.name === "end_date") {
      setCustomenddateAuth(e.target.value);
    }

  };

  useEffect(() => {
    if (customstartdateAuth) {
      customeraxios
        .get(
          `customers/enh/auth/report/${props.selectedRow.user.username}?start_date=${customstartdateAuth}&end_date=${customenddateAuth}`
        )
        // .then((res) => setData(res.data))
        .then((res) => {
          setAuthData(res.data);
          setFilteredAuthdata(res.data);
          props.setLoading(false);
          setRefresh(0);
        });
    }
  }, [customstartdateAuth, customenddateAuth])




  const searchSession = (event) => {
    const target = event.target;
    var value = target.value;
    const name = target.name;
    setFormData((preState) => ({
      ...preState,
      [name]: value,
    }));
  };


  // auth tab api
  const authList = () => {
    props.setLoading(true);
    // for authentication data api call
    customeraxios
      .get(`customers/enh/auth/report/${props.selectedRow.user.username}`)
      // .then((res) => setData(res.data))
      .then((res) => {
        setAuthData(res.data);

        setFilteredAuthdata(res.data);
        props.setLoading(false);
        setRefresh(0);
      });
  };




  const [progressBar, setProgressBar] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgressBar((oldValue) => {
        const newValue = oldValue + 10;
        if (newValue === 5000) {
          clearInterval(interval);
        }
        return newValue;
      });
    }, 5000);
  }, []);

 
  const columns = [
    {
      name: "ID",
      selector: "radacctid",
      sortable: true,
    },
    {
      name: "User Name",
      selector: "username",
      sortable: true,
    },

    {
      name: "Start Time",
      selector: "acctstarttime",
      sortable: true,
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row.acctstarttime).subtract(5, 'hours').subtract(30, 'minutes').format("DD MMM YY,h:mm a")}
        </span>
      ),
        //    cell: (row) => {
        //     const dt = new Date(row.acctstarttime);
        //   return <span>{dt.toUTCString()}</span>;
        // },

    },
    {
      name: "Stop Time",
      selector: "acctstoptime",
      sortable: true,

      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {row.acctstoptime
            ? moment(row.acctstoptime).subtract(5, 'hours').subtract(30, 'minutes').format("DD MMM YY,h:mm a")
            : "N/A"}
        </span>
      ),
    },
    {
      name: "Online Time",
      selector: "acctsessiontime",
      sortable: true,
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {displayTotaltime(row.acctsessiontime)}
        </span>
      ),
    },
    {
      name: "Download",
      selector: "acctoutputoctets",
      sortable: true,
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {parseFloat(row.acctoutputoctets / 1024 / 1024 / 1024).toFixed(2) +
            "GB"}
        </span>
      ),
    },
    {
      name: "Upload",
      selector: "acctinputoctets",
      sortable: true,
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {parseFloat(row.acctinputoctets / 1024 / 1024 / 1024).toFixed(2) +
            "GB"}
        </span>
      ),
    },
    {
      name: "Total",
      selector: "acctinputoctets",
      sortable: true,
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {parseFloat(row.acctoutputoctets / 1024 / 1024 / 1024 + row.acctinputoctets / 1024 / 1024 / 1024).toFixed(2) + "GB"}
        </span>
      ),
    },

    {
      name: "IP Address",
      selector: "framedipaddress",
      cell: (row) => (
        <div className="ellipsis" title={row.framedipaddress}>
          {row.framedipaddress}
        </div>
      ),
      sortable: true,
    },
    {
      name: "NAS IP",
      selector: "nasipaddress",
      cell: (row) => (
        <div className="ellipsis" title={row.nasipaddress}>
          {row.nasipaddress}
        </div>
      ),
      sortable: true,
    },
    {
      name: "MAC ID",
      selector: "callingstationid",
      cell: (row) => (
        <div className="ellipsis" title={row.callingstationid}>
          {row.callingstationid}
        </div>
      ),
      sortable: true,
    },
  ];
  const authColumns = [
    {
      name: "ID",
      selector: "id",
      sortable: false,
    },

    {
      name: "User Name",
      selector: "username",
      sortable: false,
    },

    {
      name: "Reply Type",
      selector: "reply",
      sortable: false,
    },
    {
      name: "Date",
      selector: "authdate",
      sortable: false,
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row.authdate).format("DD MMM YY")}
        </span>
      ),
    },
  ];

  const [exportData, setExportData] = useState({
    columns: columns,
    exportHeaders: [],
  });
  const [exportAuthData, setExportAuthData] = useState({
    authColumns: authColumns,
    exportHeaders: [],
  });

  useEffect(() => {
    props.updateSessionLists((prevState) => ({
      ...prevState,
      appliedServiceFilters: {
        ...prevState.appliedServiceFilters,
        framedipaddress: {
          ...prevState.appliedServiceFilters.framedipaddress,
          value: {
            ...prevState.appliedServiceFilters.framedipaddress.value,
            strVal: searchUser || "",
            label: searchUser,
          },
        },
      },
    }));
  }, [searchUser]);
  const changeHandler = (event) => {
    setSearchUser(event.target.value);
  };

  const debouncedChangeHandler = useMemo(() => {
    return debounce(changeHandler, 500);
  }, []);


  useEffect(() => {
    props.updateSessionLists((prevState) => ({
      ...prevState,
      appliedServiceFilters: {
        ...prevState.appliedServiceFilters,
        callingstationid: {
          ...prevState.appliedServiceFilters.callingstationid,
          value: {
            ...prevState.appliedServiceFilters.callingstationid.value,
            strVal: searchUser1 || "",
            label: searchUser1,
          },
        },
      },
    }));
  }, [searchUser1]);
  const changeHandler1 = (event) => {
    setSearchUser1(event.target.value);
  };


  const debouncedChangeHandler1 = useMemo(() => {
    return debounce(changeHandler1, 500);
  }, []);


  const RefreshHandler= (()=>{
    props.trafficreport()
  })

  return (
    <Fragment>
      <Row>
        <Col>
          <h6 style={{ textAlign: "center" }}>
            ID : C{props.selectedRow && props?.selectedRow?.id}
          </h6>
        </Col>
      </Row>
      <Container fluid={true}>
        <Row>
          <h6 style={{ zIndex: 1 }}>
            Customer Name: {props.selectedRow && props.selectedRow?.first_name}
          </h6>
        </Row>
        <Row>
          <Tabs
            value={selectedTab}
            onChange={(_, value) => {
              setSelectedTab(value);
            }}
          >
            <Tab label="Traffic/Session Report" value="traffic" />
            <Tab label="Authentication" value="auth" onClick={authList} />
          </Tabs>

          <Col>
            {selectedTab === "traffic" && (
              <Button
                color="primary"
                style={{ float: "right" }}
                disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
                onClick={reconnect}
              > {loaderSpinneer ? <Spinner size="sm"> </Spinner> : null} &nbsp;
                {"Reconnect"}
              </Button>
            )}
          </Col>
        </Row>
        <br />
        {selectedTab === "traffic" && (
          <>
            <Row>
              <SessionTotalCount filteredData={props.sessionCount} />
            </Row>
            <Row style={{ marginTop: "10px" }}>
              <Col sm="3" style={{ marginLeft: "-20px" }}>
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
                      value={!!props.customstartdate && props.customstartdate}
                    />
                  </div>
                </FormGroup>
              </Col>
              <Col sm="3" style={{ marginLeft: "-20px" }}>
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
                      value={!!props.customenddate && props.customenddate}
                    />
                  </div>
                </FormGroup>
              </Col>
              <Col sm="2">
                <Paper component="div" className="session_report_search_bar">
                  <InputBase
                    name="framedipaddress"
                    placeholder="Search IP"
                    inputProps={{ "aria-label": "search google maps" }}
                    // onChange={(e) => searchSession(e)}
                    onChange={debouncedChangeHandler}
                  />
                  <IconButton
                    type="submit"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Col>
              <Col sm="2">
                <Paper component="div" className="session_report_search_bar">
                  <InputBase
                    name="macId"
                    placeholder="Search MAC ID"
                    inputProps={{ "aria-label": "search google maps" }}
                    onChange={debouncedChangeHandler1}
                  />
                  <IconButton
                    type="submit"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Col>
              <Col style={{ position: "relative", top: "35px" }}  sm="1">
                <SessionExport getQueryParams={props.getQueryParams} profileDetails={props.selectedRow} />
              </Col>
              <Col style={{ position: "relative", top: "35px" }}  sm="1">
              <MUIButton
                  className="muibuttons"
                  onClick={RefreshHandler}
                  variant="outlined"
                  style={{ height: "40px" }}
                >
                  <img src={REFRESH} className="Header_img" />
                </MUIButton>
              </Col>
            </Row>
          </>
        )}
        <div className="edit-profile">
          {selectedTab === "traffic" && (
            <Row>
              <Col xl="12">
                <nav aria-label="Page navigation example">
                  <div>
                    <DataTable
                      columns={columns}
                      data={props?.sessionLists.pageLoadData || []}
                      noHeader
                      noDataComponent={"No Data"}
                      pagination
                      paginationServer
                      progressComponent={
                        <SkeletonLoader loading={props?.sessionLists?.uiState.loading} />
                      }
                      progressPending={props?.sessionLists.uiState?.loading}
                      paginationTotalRows={props?.sessionLists.totalRows}
                      onChangeRowsPerPage={props.handlePerRowsChange}
                      onChangePage={props.handlePageChange}
                    />
                  </div>
                </nav>
              </Col>
              <br />
            </Row>
          )}
          {selectedTab === "auth" && (
            <>
              <Row>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label for="meeting-time" className="kyc_label">
                        From Date
                      </Label>
                      <Input
                        className={`form-control-digits not-empty`}
                        onChange={customHandlerAuth}
                        type="date"
                        id="meeting-time"
                        name="start_date"
                        value={!!customstartdateAuth && customstartdateAuth}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label for="meeting-time" className="kyc_label">
                        To Date
                      </Label>
                      <Input
                        className={`form-control-digits not-empty`}
                        onChange={customHandlerAuth}
                        type="date"
                        id="meeting-time"
                        name="end_date"
                        value={!!customenddateAuth && customenddateAuth}
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xl="12">
                  <nav aria-label="Page navigation example">
                    {props.loading ? (
                      <Skeleton
                        count={11}
                        height={30}
                        style={{ marginBottom: "10px", marginTop: "15px" }}
                      />
                    ) : (
                      <div>
                        <DataTable
                          columns={authColumns}
                          data={filteredAuthData}
                          noHeader
                          noDataComponent={"No Data"}
                          pagination
                        />
                      </div>
                    )}
                  </nav>
                </Col>
                <br />
              </Row>
            </>
          )}
        </div>
      </Container>
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

export default SessionHistory;
