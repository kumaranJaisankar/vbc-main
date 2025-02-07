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
  ModalBody,
} from "reactstrap";
import moment from "moment";
import { ModalTitle, CopyText, Cancel, Close } from "../../../../constant";
import { networkaxios } from "../../../../axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import { classes } from "../../../../data/layouts";
import AddIpPool from "./addipool";
import IppoolDetails from "./ippooldetails";
import { IppoolFilterContainer } from "./IppoolFilter/IppoolFilterContainer";
import { logout_From_Firebase } from "../../../../utils";
import PermissionModal from "../../../common/PermissionModal";
import MUIButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import RefreshIcon from "@mui/icons-material/Refresh";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { NETWORK } from "../../../../utils/permissions";
import FILTERS from "../../../../assets/images/filters.png";
import REFRESH from "../../../../assets/images/refresh.png";
import Grid from "@mui/material/Grid";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import MoreActions from "../../../common/CommonMoreActions";
import Tooltip from '@mui/material/Tooltip';
import ErrorModal from "../../../common/ErrorModal";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const Ippool = () => {
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);

  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [loading, setLoading] = useState(false);

  const [lead, setLead] = useState([]);
  const width = useWindowSize();

  const [modal, setModal] = useState();
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [failed, setFailed] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  const [clearSelection, setClearSelection] = useState(false);
  //filter show and hide menu
  const [levelMenu, setLevelMenu] = useState(false);
  const [permissionModalText, setPermissionModalText] = useState(
    "You are not authorized for this action"
  );
  const [permissionmodal, setPermissionModal] = useState();
  //taking backup for original data
  const [filteredDataBkp, setFiltereddataBkp] = useState(data);
  const configDB = useSelector((content) => content.Customizer.customizer);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  const Verticalcentermodaltoggle = () => {
    {
      {
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
      }
    }
  };
  let history = useHistory();

  const dispatch = useDispatch();

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
    let DefaultLayout = defaultLayoutObj;
    handlePageLayputs(layout);

    networkaxios
      .get("network/ippool/create")
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
          setShowModal(true);
          setModalMessage("Something went wrong");
          // toast.error("Something went wrong", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
        }
      });
  }, [refresh]);

  //modal for insufficient modal
  const permissiontoggle = () => {
    setPermissionModal(!permissionmodal);
  };
  //end
  // logout
  const logout = () => {
    logout_From_Firebase();
    history.push(`${process.env.PUBLIC_URL}/login`);
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
    setExportData({
      ...exportData,
      data: filteredData,
    });
  }, [filteredData]);
  //update api

  const update = (newRecord) => {
    setLoading(true);
    networkaxios.get("network/ippool/create").then((res) => {
      setData(res.data);
      setFiltereddata(res.data);
      setLoading(false);
      setRefresh(0);
    });
    closeCustomizer();
  };

  const detailsUpdate = (updatedata) => {
    setData([...data, updatedata]);
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
    result = data.filter((data) => {
      if (data.name.search(value) != -1) return data;
    });
    setFiltereddata(result);
  };

  // delete api
  const onDelete = () => {
    let dat = { ids: isChecked };
    fetch(`${process.env.REACT_APP_API_URL_NETWORK}/network/ippool/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
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

  //delete
  const deleteRows = (selected) => {
    setClearSelection(false);

    let rows = selected.map((ele) => ele.id);
    setIsChecked([...rows]);
  };

  const toggle = () => {
    setModal(!modal);
  };
  const closeCustomizer = () => {
    setRightSidebar(false);
    document.querySelector(".customizer-contain").classList.remove("open");
  };

  const openCustomizer = (type, id) => {
    if (id) {
      setLead(id);
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

  //refresh
  const Refreshhandler = () => {
    setRefresh(1);
    if (searchInputField.current) {
    searchInputField.current.value = "";
    }
  };

  const searchInputField = useRef(null);

  //imports
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
    //   name: <b className="Table_columns" >{"ID"}</b>,
    //   selector: "id",
    //   cell: (row) => (
    //     <>
    //       {token.permissions.includes(NETWORK.IPPOOLREAD) ? (
    //         <a
    //           onClick={() => openCustomizer("3", row)}
    //           // id="columns_alignment"
    //           style={{ cursor: "pointer" }}
    //           className="openmodal"
    //         >
    //           IP{row.id}
    //         </a>
    //       ) : (
    //         <a id="columns_alignment" style={{ cursor: "pointer" }} className="openmodal">
    //           IP{row.id}
    //         </a>
    //       )}
    //     </>
    //   ),
    //   sortable: true,
    // },
    //Sailaja Change Updated nowrap Style for Pool Name on 19th July
 //Sailaja Change Updated nowrap Style for Pool Name data column on 19th July

    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }} >{"Pool Name"}</b>,
      selector: "name",
      // cell:(row)=>(
      //   <span className="First_Letter">{row.name}</span>
      // ),
      cell: (row) => (
        <>
          {token.permissions.includes(NETWORK.IPPOOLREAD) ? (
            <a
              onClick={() => openCustomizer("3", row)}
              // id="columns_alignment"
              style={{ cursor: "pointer"}}
              className="openmodal First_Letter"
            >
              {row.name}
            </a>
          ) : (
            <a id="columns_alignment" style={{ cursor: "pointer" }} className="openmodal First_Letter">
              {row.name}
            </a>
          )}
        </>
      ),
      sortable: true,
    },
    // {
    //   name: "Serial No.",
    //   selector: "serial_no",
    //   sortable: true,
    // },
    //Sailaja Change Updated nowrap Style on 19th July

    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }} >{"Serial Number"}</b>,
      selector: "serial_no",
      sortable: true,
    },
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }} >{"Cost Per IP"}</b>,
      selector: "cost_per_ip",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Branch"}</b>,
      selector: "branch.name",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"NAS"}</b>,
      selector: "nas",
      cell: (row) => (
        <span>{row.nas?.name}</span>
      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"IP Address From"}</b>,
      selector: "ip_address_from",
      sortable: true,
    },
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"IP Address To"}</b>,
      selector: "ip_address_to",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Description"}</b>,
      selector: "description",
      sortable: true,
    },
    //Sailaja Change Created Date as Created on 19th July
    // Sailaja Modified Year Format As YYYY  for Network-> IP Pool Created  column on 20th March 2023

    {
      name: <b className="Table_columns">{"Created"}</b>,
      selector: "created_at",
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row.created_at).format("DD MMM YYYY")}
        </span>
      ),
      sortable: true,
    },
    //Sailaja Change Updated Date as Updated on 19th July
    // Sailaja Modified Year Format As YYYY  for Network-> IP Pool Updated column on 20th March 2023

    {
      name: <b className="Table_columns">{"Updated"}</b>,
      selector: "updated_at",
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row.updated_at).format("DD MMM YYYY")}
        </span>
      ),
      sortable: true,
    },

    {
      name: "",
      selector: ""
    }
  ];
  const [exportData, setExportData] = useState({
    columns: columns,
    exportHeaders: [],
  });

  //filter show and hide level menu
  const OnLevelMenu = (menu) => {
    setLevelMenu(!menu);
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
          if (!event.target.className.includes("openmodal")) {
            closeCustomizer();
          }
        }
      }

      // Adding click event listener
      document.addEventListener("click", handleOutsideClick);
    }, [ref]);
  }


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
  // css for breadcrumb by Marieya 
  return (
    <Fragment>
      <div ref={ref}>
        <br />
        <Container fluid={true}>
          <Grid container spacing={1} id="breadcrumb_margin">
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
                  Business Operations
                </Typography>
                {/* Sailaja Changed  Network Color from Breadcrumbs  on 13th July */}

                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color="#00000 !important"
                  fontSize="14px"
                  className="last_typography"
                >
                  Network
                </Typography>
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color="#00000 !important"
                  fontSize="14px"
                  className="last_typography"
                >
                  IP Pool
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <br />
          <br />
          <div className="edit-profile data_table" id="breadcrumb_table">
            <Stack direction="row" spacing={2}>
              <span className="all_cust">IP Pool</span>

              <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }}>
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
                  {" "}

                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    inputProps={{ "aria-label": "search google maps" }}
                    placeholder="Search With Pool Name"
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
                {/*Sailaja Added Refresh Tool Tip on 19th July Ref NET_01 */}
                {/* refrsh */}
                <Tooltip title={"Refresh"}>
                  <MUIButton
                    onClick={Refreshhandler}
                    variant="outlined"
                    className="muibuttons"
                  >
                    <img src={REFRESH} />
                  </MUIButton>
                </Tooltip>
                {/* filter */}
                {/*Sailaja Added Filter Tool Tip on 19th July Ref NET_01 */}
                <Tooltip title={"Filter"}>

                  <MUIButton
                    onClick={() => OnLevelMenu(levelMenu)}
                    variant="outlined"
                    className="muibuttons"
                  >
                    <img src={FILTERS} />
                  </MUIButton>
                </Tooltip>
                <IppoolFilterContainer
                  levelMenu={levelMenu}
                  setLevelMenu={setLevelMenu}
                  filteredData={filteredData}
                  setFiltereddata={setFiltereddata}
                  filteredDataBkp={filteredDataBkp}
                  loading={loading}
                  setLoading={setLoading}
                  showTypeahead={false}
                />
                {token.permissions.includes(NETWORK.IPPOOLCREATE) && (
                  <button
                    className="btn btn-primary openmodal"
                    id="newbuuon"
                    type="submit"
                    onClick={() => openCustomizer("2")}
                  >
{/* Sailaja Changed + New as New + on 19th July REF NET_04 */}
                    <b>
                      <span className="openmodal" style={{ fontWweight: "700", fontSize: "16px", position: "relative", left: "-27%"}}>
                         New 
                      </span>
                      <i
                        className="icofont icofont-plus openmodal"
                        style={{
                          cursor: "pointer"
                        
                        }}
                      ></i>
                    </b>
                  </button>
                )}
              </Stack>
            </Stack>
            <Row>
              <Modal
                isOpen={Verticalcenter && isChecked.length > 0}
                toggle={Verticalcentermodaltoggle}
                centered
              >
                <ModalHeader toggle={Verticalcentermodaltoggle}>
                  Confirmation
                </ModalHeader>
                <ModalBody>
                  <div>
                    {isChecked.map((id) => (
                      <span>IP{id},</span>
                    ))}
                  </div>
                  <p>Are you sure you want to delete?</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" onClick={Verticalcentermodaltoggle}>
                    {Close}
                  </Button>
                  <Button color="primary" onClick={() => onDelete()}>
                    Yes
                  </Button>
                </ModalFooter>
              </Modal>

              <Col md="12" style={{ marginTop: "56px" }}>
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
                          <DataTable
                            className="leadTable"
                            columns={columns}
                            data={filteredData}
                            noHeader
                            onSelectedRowsChange={({ selectedRows }) => (
                              handleSelectedRows(selectedRows),
                              deleteRows(selectedRows)
                            )}
                            conditionalRowStyles={conditionalRowStyles}
                            selectableRowsComponent={NewCheckbox}
                            selectableRows
                            clearSelectedRows={clearSelectedRows}
                            pagination
                            noDataComponent={"No Data"}
                          // clearSelectedRows={clearSelection}
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
                  <div className="customizer-contain" ref={box}>
                    <div className="tab-content" id="c-pills-tabContent">
                      <div
                        className="customizer-header"
                        style={{ padding: "8px", border: "none" }}
                      >
                        <br />
                        <i className="icon-close"
                        style={{
                          marginTop: "12px",
                          float: "right",
                          marginRight: "-3px",
                          cursor: "pointer",
                          color: "#000000",
                          fontSize: "medium",
                          fontWeight: "Bold",
                        }}
                        onClick={closeCustomizer}></i>
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
                            <div id="headerheading" style={{ padding: "6px", marginLeft: "1%" }}>
                              Add New IP Pool
                            </div>
                            <ul
                              className="layout-grid layout-types"
                              style={{ border: "none" }}
                            >
                              <li
                                data-attr="compact-sidebar"
                                onClick={(e) => handlePageLayputs(classes[0])}
                              >
                                <div className="layout-img">
                                  <AddIpPool
                                    dataClose={closeCustomizer}
                                    onUpdate={(data) => update(data)}
                                    rightSidebar={rightSidebar}
                                  />
                                </div>
                              </li>
                            </ul>
                          </TabPane>
                          <TabPane tabId="3">
                            <div
                              id="headerheading"
                              style={{ marginTop: "-55px" }}
                            >
                              {" "}
                              IP Pool Information: <span className="First_Letter">{lead.name}</span>
                            </div>
                            <IppoolDetails
                              lead={lead}
                              onUpdate={(data) => detailsUpdate(data)}
                              dataClose={closeCustomizer}
                              rightSidebar={rightSidebar}
                              Refreshhandler={Refreshhandler}
                              openCustomizer={openCustomizer}
                            />
                          </TabPane>
                        </TabContent>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Row>
          </div>
          {/* modal for insufficient permissions */}
          <PermissionModal
            content={permissionModalText}
            visible={permissionmodal}
            handleVisible={permissiontoggle}
          />
          {/* end */}
          <ErrorModal
        isOpen={showModal}
        toggle={() => setShowModal(false)}
        message={modalMessage}
        action={() => setShowModal(false)}
      />
        </Container>
      </div>
    </Fragment>
  );
};

export default Ippool;
