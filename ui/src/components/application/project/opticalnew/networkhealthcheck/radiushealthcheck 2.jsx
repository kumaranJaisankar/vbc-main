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
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  TabContent,
  TabPane,
  ModalBody,
} from "reactstrap";
import { Close } from "../../../../../constant";
import { networkaxios } from "../../../../../axios";
import { toast } from "react-toastify";
import { statusType } from "./radiushealthdropdown";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../../../redux/actionTypes";
import { classes } from "../../../../../data/layouts";
import HealthCheckUtilityBadge from "./healthcheckopticalbadge";
import AddRadius from "./addradius";
import RadiusTable from "./radiustable";
import NasTable from "../NasTable";
import { logout_From_Firebase } from "../../../../../utils";
import PermissionModal from "../../../../common/PermissionModal";
import MUIButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import REFRESH from "../../../../../assets/images/refresh.png";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
//end
import { NETWORK } from "../../../../../utils/permissions";

var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}

const RadiusHealthCheck = (props) => {
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState([]);
  const width = useWindowSize();
  const [rowlength, setRowlength] = useState({});

  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [failed, setFailed] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  //modal state for insufficient permissions
  const [permissionmodal, setPermissionModal] = useState();
  const [permissionModalText, setPermissionModalText] = useState(
    "You are not authorized for this action"
  );
  const [selectedTab, setSelectedTab] = useState("Radius");

  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type] = useState(configDB.settings.sidebar.type);

  // serach function
  const [searchRadiusString, setSearchRadiusString] = useState("");
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

  //use effect hook for getting the data
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
    networkaxios
      .get("network/radius/create")
      .then((res) => {
        setData(res.data);
        setFiltereddata(res.data);
        setLoading(false);
        setRefresh(0);
      })
      .catch((error) => {
        const { code, detail, status } = error;
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        if (detail === "INSUFFICIENT_PERMISSIONS") {
          //calling the modal here
          permissiontoggle();
        } else if (is500Error) {
          setPermissionModalText("Something went wrong !");
          permissiontoggle();
        } else if (
          code === "In-valid token. Please login again" ||
          detail === "In-valid token. Please login again"
        ) {
          logout();
        } else {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        }
      });
  }, [refresh]);

  // logout
  const logout = () => {
    logout_From_Firebase();
    history.push(`${process.env.PUBLIC_URL}/login`);
  };
  //
  useEffect(() => {
    setExportData({
      ...exportData,
      data: filteredData,
    });
  }, [filteredData]);

  const update = () => {
    setLoading(true);
    networkaxios.get(`network/radius/create`).then((res) => {
      setData(res.data);
      setFiltereddata(res.data);
      setLoading(false);
      setRefresh(0);
    });
    Refreshhandler();
    closeCustomizer();
  };

  // delete api
  const onDelete = () => {
    let dat = { ids: isChecked };
    fetch(`${process.env.REACT_APP_API_URL_FRANCHISE}/franchise/type/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenAccess}`,
      },
      body: JSON.stringify(dat),
    })
      .then((response) => response.json())
      .then((data) => {
        var difference = [];
        if (data.length > 0) {
          difference = [...isChecked].filter((x) => data.indexOf(x) === -1);
          setFailed([...data]);
        } else {
          difference = [...isChecked];
        }
        setFiltereddata((prevState) => {
          var newdata = prevState.filter(
            (el) => difference.indexOf(el.id) === -1
          );
          return newdata;
        });
        Verticalcentermodaltoggle();
        setClearSelectedRows(true);
        setIsChecked([]);
        setClearSelection(true);
        if (data.length > 0) {
        }
      });
  };

  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document
      .querySelector(".customizer-contain-radiushealthcheck")
      .classList.remove("open");
  };
  const openCustomizer = (type, id) => {
    if (id) {
      setLead(id);
    }
    setActiveTab1(type);
    setRightSidebar(!rightSidebar);
    // if (rightSidebar) {
    document
      .querySelector(".customizer-contain-radiushealthcheck")
      .classList.add("open");
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

  //refresh
  const Refreshhandler = () => {
    setRefresh(1);
  };

  const searchInputField = useRef(null);

  const columns = [
    {
      name: <b className="Table_columns">{"ID"}</b>,
      selector: "id",
      cell: (row) => (
        <a
          onClick={() => openCustomizer("3", row)}
          className="openmodal"
        >
          R{row.id}
        </a>
      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Name"}</b>,
      selector: "name",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Ip Address"}</b>,
      selector: "ip_address",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Username"}</b>,
      selector: "username",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Password"}</b>,
      selector: "password",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Status"}</b>,
      selector: "status",
      sortable: true,
      cell: (row) => {
        let statusObj = statusType.find((s) => s.id == row.status);
        return <span>{statusObj ? statusObj.name : "-"}</span>;
      },
    },
  ];
  const [exportData, setExportData] = useState({
    columns: props.columns,
    exportHeaders: [],
  });
  //modal for insufficient modal
  const permissiontoggle = () => {
    setPermissionModal(!permissionmodal);
  };

  //  automatic display of table in optical network
  const handleTableDataFilter = (status, isCount = false) => {
    setSelectedTab(status);
    switch (status) {
      case "Radius":
        if (isCount) {
          setRowlength((prevState) => {
            return {
              ...prevState,
              ["Radius"]: data.length,
            };
          });
        } else {
        }
        break;

      case "Nas":
        if (isCount) {
          setRowlength((prevState) => {
            return {
              ...prevState,
              ["Nas"]: data.length,
            };
          });
        } else {
        }

        break;

      default:
        setFiltereddata(data);
    }
  };

  const conditionalRowStyles = [
    {
      when: (row) => row.selected === true,
      style: {
        backgroundColor: "#FFE1D0",
      },
    },
  ];

  useEffect(() => {
    networkaxios
      .get("network/radius/create")
      .then((res) => {
        setRowlength((prevState) => {
          return {
            ...prevState,
            ["Radius"]: res.data.length,
          };
        });
      })
      .then(() => {
        networkaxios.get("network/nas/display").then((res) => {
          setRowlength((prevState) => {
            return {
              ...prevState,
              ["Nas"]: res.data.length,
            };
          });
        });
      });
  }, []);

  // scroll top
  const ref = useRef();
  useEffect(() => {
    ref.current.scrollIntoView(0, 0);
  }, []);

  //onside click hide sidebar
  const box = useRef(null);
  useOutsideAlerter(box);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      // Function for click event
      function handleOutsideClick(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          if (rightSidebar && !event.target.className.includes("openmodal")) {
            closeCustomizer();
          }
        }
      }

      // Adding click event listener
      document.addEventListener("click", handleOutsideClick);
    }, [ref]);
  }
  //end

  //search functionality
  const handlesearchChange = (event) => {
    event.preventDefault();
    // let value = event.target.value.toLowerCase();
    setSearchRadiusString(event.target.value);
  };

  useEffect(() => {
    setSearchRadiusString("");
  }, [selectedTab]);

  return (
    <Fragment>
      <div ref={ref}>
        <br />
        <Container fluid={true}>
        <Grid container spacing={1}>
        <Grid item md="12">
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="small" />}
          >
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              color=" #377DF6"
              fontSize="14px"
            >
             Bussiness Operation
            </Typography>
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              color=" #377DF6"
              fontSize="14px"
            >
            Network
            </Typography>
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              color="#00000 !important"
              fontSize="14px"
            >
              Radius Health Check
            </Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <br />
      <br />
          <div className="edit-profile data_table">
            <Stack direction="row" spacing={2}>
             

              <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }}>
                <Paper component="div" className="search_bar">
                <IconButton
                    type="submit"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search With  Name"
                    inputProps={{ "aria-label": "search google maps" }}
                    onChange={(event) => handlesearchChange(event)}
                    value={searchRadiusString}
                  />
                  
                </Paper>
              
              <MUIButton
                onClick={Refreshhandler}
                variant="outlined"
                className="muibuttons"
              >
                 <img src={REFRESH} style={{ width: "20px" }} />
              </MUIButton>
              {token.permissions.includes(NETWORK.RADIUSCREATE) && (
                <button
                  className="btn btn-primary openmodal"
                  id="newbuuon"
                  type="submit"
                  onClick={() => openCustomizer("2")}
                >
                  <i
                    className="icofont icofont-plus openmodal"
                    style={{
                      cursor: "pointer",
                      marginLeft: "-15px",
                    }}
                  ></i>
                  <span className="openmodal">
                    &nbsp;&nbsp; <span className="button-text">New </span>
                  </span>
                </button>
              )}
              </Stack>
            </Stack>
            <Row>
           
                <HealthCheckUtilityBadge
                  handleTableDataFilter={handleTableDataFilter}
                  rowlength={rowlength}
                  selectedTab={selectedTab}
                />
             

              <Col md="12" className="alloptical-tables">
                <div
                  style={{
                    display: selectedTab == "Radius" ? "block" : "none",
                    marginTop: "19px",
                  }}
                >
                  {selectedTab == "Radius" && (
                    <RadiusTable
                      refresh={refresh}
                      setRowlength={setRowlength}
                      rowlength={rowlength}
                      selectedTab={selectedTab}
                      setIsChecked={setIsChecked}
                      data={filteredData}
                      setClearSelectedRows={setClearSelectedRows}
                      setClearSelection={setClearSelection}
                      clearSelectedRows={clearSelectedRows}
                      clearSelection={clearSelection}
                      conditionalRowStyles={conditionalRowStyles}
                      setFiltereddata={setFiltereddata}
                      setData={setData}
                      searchRadiusString={searchRadiusString}
                    />
                  )}
                </div>

                <div
                  style={{
                    display: selectedTab == "Nas" ? "block" : "none",
                    marginTop: "19px",
                  }}
                >
                  {selectedTab == "Nas" && (
                    <NasTable
                      selectedTab={selectedTab}
                      refresh={refresh}
                      setRowlength={setRowlength}
                      rowlength={rowlength}
                      setIsChecked={setIsChecked}
                      data={filteredData}
                      setClearSelectedRows={setClearSelectedRows}
                      setClearSelection={setClearSelection}
                      clearSelectedRows={clearSelectedRows}
                      clearSelection={clearSelection}
                      setFiltereddata={setFiltereddata}
                      setData={setData}
                      conditionalRowStyles={conditionalRowStyles}
                    />
                  )}
                </div>
              </Col>
              <Row>
                <Col md="12">
                  <div
                    className="customizer-contain customizer-contain-radiushealthcheck"
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
                        <i className="icon-close" onClick={closeCustomizer}></i>
                        <br />
                      </div>
                      <div className=" customizer-body custom-scrollbar">
                        <TabContent activeTab={activeTab1}>
                          <TabPane tabId="2">
                            <div id="headerheading">Add Radius</div>
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
                                    <AddRadius
                                      dataClose={closeCustomizer}
                                      onUpdate={(data) => update(data)}
                                      rightSidebar={rightSidebar}
                                    />
                                  )}
                                </div>
                              </li>
                            </ul>
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
                        <span>T{id},</span>
                      ))}
                    </div>
                    <p>Are you sure you want to delete?</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="secondary"
                      onClick={Verticalcentermodaltoggle}
                    >
                      {Close}
                    </Button>
                    <Button color="primary" onClick={() => onDelete()}>
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
              </Row>
            </Row>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default RadiusHealthCheck;
