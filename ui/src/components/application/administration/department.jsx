import React, {
  Fragment,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import Skeleton from "react-loading-skeleton";
import { DeptFilterContainer } from "./DeptFilter/DeptFilterContainer";
import { Sorting } from "../../common/Sorting";
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
import { logout_From_Firebase } from "../../../utils";
import PermissionModal from "../../common/PermissionModal";
import { ModalTitle, CopyText, Cancel, Close } from "../../../constant";
import { adminaxios } from "../../../axios";
import AddDepartment from "./adddepartment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
// import DataTableExtensions from "react-data-table-component-extensions";
// import "react-data-table-component-extensions/dist/index.css";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
// import { columns } from "../../../data/supportdb";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import { classes } from "../../../data/layouts";
import REFRESH from "../../../assets/images/refresh.png";
import DepartmentDetails from "./departmentdetails";
import MUIButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { ADMINISTRATION } from "../../../utils/permissions";
import MoreActions from "../../common/CommonMoreActions";
import Tooltip from '@mui/material/Tooltip';
import ErrorModal from "../../common/ErrorModal";


var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}
const Department = (props, initialValues) => {
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [loading, setLoading] = useState(false);
  // const [exportData, setExportData] = useState({ columns: columns,exportHeaders:[]})
  // const [exportData, setExportData] = useState({ columns: columns, data: [] });
  const [lead, setLead] = useState([]);
  const width = useWindowSize();
  //modal state for insufficient permissions
  const [permissionmodal, setPermissionModal] = useState();
  const [permissionModalText, setPermissionModalText] = useState(
    "You are not authorized for this action"
  );
  const [modal, setModal] = useState();
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [failed, setFailed] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  const [clearSelection, setClearSelection] = useState(false);
  //filter show and hide menu
  const [levelMenu, setLevelMenu] = useState(false);
  //taking backup for original data
  const [filteredDataBkp, setFiltereddataBkp] = useState(data);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
//states for roles api
const [roles, setRoles] = useState([]);
const [users, setUsers] = useState([]);
const [disable, setDisable] = useState(false);
const [deptusers, setDeptUsers] = useState([]);

  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
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
      .get(`accounts/department/list`)
      // .then((res) => setData(res.data))
      .then((res) => {
        setData(res.data);
        setFiltereddata(res.data);
        setLoading(false);
        setRefresh(0);
      })
      // .catch((error) => {
      //   const { code, detail, status } = error;
      //   const errorString = JSON.stringify(error);
      //   const is500Error = errorString.includes("500");
      //   if (detail === "INSUFFICIENT_PERMISSIONS") {
      //     //calling the modal here
      //     permissiontoggle();
      //   } else if (is500Error) {
      //     setPermissionModalText("Something went wrong !");
      //     permissiontoggle();
      //   } else if (
      //     code === "In-valid token. Please login again" ||
      //     detail === "In-valid token. Please login again"
      //   ) {
      //     logout();
      //   } else {
      //     toast.error("Something went wrong", {
      //       position: toast.POSITION.TOP_RIGHT,
      //       autoClose: 1000,
      //     });
      //   }
      // });
      .catch((error) => {
        const { code, detail, status } = error;
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        let errorMessage = "Something went wrong"; // Default error message
        
        if (detail === "INSUFFICIENT_PERMISSIONS") {
          //calling the modal here
          // Modified by Marieya
          permissiontoggle();
        } else if (is500Error) {
          setPermissionModalText("Something went wrong !");
          permissiontoggle();
        } else if (
          code === "In-valid token. Please login again" ||
          detail === "In-valid token. Please login again"
        ) {
          logout(); // if you want to logout the user
        } else {
          errorMessage = "Something went wrong";
        }
        setModalMessage(errorMessage);
        setShowModal(true);
      });
      
  }, [refresh]);
  const logout = () => {
    logout_From_Firebase();
    history.push(`${process.env.PUBLIC_URL}/login`);
  };

  //filtering data by making a backup
  useEffect(() => {
    if (data) {
      setData(data);
      setFiltereddataBkp(data);
      // setFiltereddata(data);
    }
  }, [data]);
  //end

  useEffect(() => {
    setExportData({
      ...exportData,
      data: filteredData,
    });
  }, [filteredData]);

  const update = (newRecord) => {
    setLoading(true);
    adminaxios
      .get(`accounts/department/list`)
      // .then((res) => setData(res.data))
      .then((res) => {
        setData(res.data);
        setFiltereddata(res.data);
        setLoading(false);
        setRefresh(0);
      });
    closeCustomizer();
  };

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
    result = data.filter((data) => {
      if (data && data.name.toLowerCase().search(value) != -1) return data;
    });
    setFiltereddata(result);
  };

  // delete api
  const onDelete = () => {
    let dat = { ids: isChecked };

    fetch(
      `${process.env.REACT_APP_API_URL_ADMIN}/accounts/department/multiple/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenAccess}`,
        },
        body: JSON.stringify(dat),
      }
    )
      // adminaxios.delete("accounts/users", {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ ids: isChecked }),
      // })
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
    // setClearSelection(true);
  };

  const toggle = () => {
    setModal(!modal);
  };
  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
  };
  const openCustomizer = (type, id) => {
    if (id) {
      setLead(id);
    }
    setActiveTab1(type);
    setRightSidebar(!rightSidebar);
    // if (rightSidebar) {
    document.querySelector(".customizer-contain").classList.add("open");

    // document.querySelector(".customizer-links").classList.add('open');
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
    searchInputField.current.value = "";
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
    //   name: <b className="Table_columns"  >{"ID"}</b>,
    //   selector: "id",
    //   cell: (row) => (
    //     <>
    //       {token.permissions.includes(ADMINISTRATION.DEPTREAD) ? (
    //         <a
    //           onClick={() => openCustomizer("3", row)}

    //           className="openmodal"
    //           // id="columns_alignment"
    //         >
    //           D{row.id}
    //         </a>
    //       ) : (
    //         <span  id="columns_alignment">D{row.id}</span>
    //       )}
    //     </>
    //   ),
    //   sortable: false,
    // },
    {
      name: <b className="Table_columns">{"Department Name"}</b>,
      selector: "name",
      //  cell: (row) => (
      //   <span id="columns_width" className="First_Letter">{row.name? row.name : "-"}</span>
      // ),
      cell: (row) => (
        <>
          {token.permissions.includes(ADMINISTRATION.DEPTREAD) ? (
            <a
              onClick={() => openCustomizer("3", row)}
              className="openmodal First_Letter"
              // id="columns_alignment"
            >
              {row.name}
            </a>
          ) : (
            <span id="columns_alignment">{row.name}</span>
          )}
        </>
      ),
      sortable: false,
    },
    {
      name: (
        <b className="Table_columns" id="columns_right">
          {"Roles"}
        </b>
      ),
      // selector: "users[0].username",
      sortable: false,
      cell: (row, index) => (
        <span id="columns_right" className="First_Letter">
          {row.roles.length > 0 ? row.roles[0].name : "-"}
        </span>
      ),
    },

    // {
    //   name: <b className="Table_columns" id="columns_right">{"Users"}</b>,
    //   // selector: "users[0].username",
    //   sortable: false,
    //   cell: (row, index) => (
    //     <span id="columns_right">{row.users.length > 0 ? row.users[0].username : "-"}</span>
    //   ),
    // },
    {
      name: "",
      selector: "",
      sortable: "",
    },
    {
      name: "",
      selector: "",
      sortable: "",
    },
    {
      name: "",
      selector: "",
      sortable: "",
    },
    {
      name: "",
      selector: "",
      sortable: "",
    },
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
      // setImportDivStatus(true);
    } else {
      if (event.target.className !== "btn btn-primary nav-link") {
        if (event.target.className !== "icon-filter") {
          setLevelMenu(false);
          var element = document.getElementById("departmentNameId");
          if (element) {
            element.classList.remove("showcard");
          }

          //   setImportDivStatus(true);
        }
      }
    }
  });
  //modal for insufficient modal
  const permissiontoggle = () => {
    setPermissionModal(!permissionmodal);
  };

  // scroll top
  const ref = useRef();
  useEffect(() => {
    ref.current.scrollIntoView(0, 0);
  }, []);
  //end

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
  // function for checkbox selection in dataTable
  const NewCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
    <div className="checkbox_header">
      <input
        htmlFor="booty-check"
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
  // const conditionalRowStyles= [
  //   {
  //     // when: row => row.completed,
  //     when: (row) => row.selected === true,
  //     style: {
  //       backgroundColor: 'rgba(63, 195, 128, 0.9)',
  //       color: 'white',
  //       '&:hover': {
  //         cursor: 'pointer',
  //       },
  //     },
  //   },
  // ];
{/*Added css for line 830 by Marieya on 22/8/22*/}


useEffect(() => {
  setDisable(false);
  adminaxios
    .get("/accounts/options/all")
    .then((res) => {
      let { roles, users } = res.data;
      // setRoles([...roles]);
      setRoles(Sorting(([...roles]),'name'))
      // setPermissions([...permissions]);
      // setBranch([...branches]);
      setUsers([...users]);
      setDeptUsers([...users]);

    })
    .catch((error) => console.log(error));
}, []);


  // useEffect(() => {
  //   adminaxios
  //     .get("/accounts/options/all")
  //     .then((res) => {
  //       let { roles, users } = res.data;
  //       // setRoles([...roles]);
  //       // Sailaja sorting the Administration -> Department(Edit Panel)->Roles * Dropdown data as alphabetical order on 29th March 2023
  //       setRoles(Sorting(([...roles]),'name'))
  //       setDeptUsers([...users]);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);

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
                {/* <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color=" #377DF6"
                  fontSize="14px"
                >
                  Customer Relations
                </Typography> */}
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color=" #377DF6"
                  fontSize="14px"
                >
                  Administration
                </Typography>
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color="#00000 !important"
                  fontSize="14px"
                  className="last_typography"
                >
                  Department
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <br />
          <br />
          <div className="edit-profile data_table" id="breadcrumb_table">
            <Stack direction="row" spacing={2}>
              <span className="all_cust">Department</span>

              <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }} style={{width:"87%"}}>
                <Paper component="div" className="search_bar">
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    inputProps={{ "aria-label": "search google maps" }}
                    placeholder="Search With Department Name"
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
              </Stack>
  {/* Sailaja Added tooltip for Admin/ Department refresh button on 12th August REF DEP-01    */}
             <Tooltip title={"Refresh"}>
              <MUIButton
                onClick={Refreshhandler}
                variant="outlined"
                className="muibuttons"
              >
                <img src={REFRESH} />
              </MUIButton>
              </Tooltip>
              {/* <MUIButton
                onClick={Verticalcentermodaltoggle}
                variant="outlined"
                disabled={true}
                startIcon={<DeleteIcon />}
              ></MUIButton> */}
              {token.permissions.includes(ADMINISTRATION.DEPTCREATE) && (
                <button
                  className="btn btn-primary openmodal"
                  id="newbuuon"
                  type="submit"
                  onClick={() => openCustomizer("2")}
                >
     {/* Sailaja interchanged positions of New & + Admin/Department on 12th Aug REF DEP-02  */}
             
                <b>
                    <span className="openmodal new_btn">
                      New 
                    </span>
                    <i
                    className="icofont icofont-plus openmodal"
                    style={{
                      cursor: "pointer",
                      // marginLeft: "-15px",
                    }}
                  ></i>
                    </b>
                </button>
              )}
            </Stack>
            <Row id="table_top">
              {/* commenting delete for twmporarry purpose */}

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
                      <span>D{id},</span>
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

              <DeptFilterContainer
                levelMenu={levelMenu}
                setLevelMenu={setLevelMenu}
                filteredData={filteredData}
                setFiltereddata={setFiltereddata}
                filteredDataBkp={filteredDataBkp}
                loading={loading}
                setLoading={setLoading}
                showTypeahead={false}
              />

              <Col md="12" className="department" style={{ marginTop: "56px" }}>
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
                          {token.permissions.includes(
                            ADMINISTRATION.DEPTLIST
                          ) ? (
                            <DataTable
                              className="sms_gateway"
                              columns={columns}
                              data={filteredData}
                              noHeader
                              // striped={true}
                              // center={true}
                              // clearSelectedRows={clearSelectedRows}
                              selectableRowsComponent={NewCheckbox}
                              selectableRows
                              // onSelectedRowsChange={({ selectedRows }) =>
                              //   deleteRows(selectedRows)
                              // }
                              onSelectedRowsChange={({ selectedRows }) => (
                                handleSelectedRows(selectedRows),
                                deleteRows(selectedRows)
                              )}
                              clearSelectedRows={clearSelectedRows}
                              pagination
                              noDataComponent={"No Data"}
                              // conditionalRowStyles={conditionalRowStyles}
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
                       {/* Sailaja fixed ADMIN/Deparment Edit icon and cancel icons in same line by using cancel_icon classname on 10th August */}
                        <i
                          className="icon-close cancel_icon"
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
                                    autoClose: 1000,
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
                            <div id="headerheading"> Add New Department </div>
                            <ul
                              className="layout-grid layout-types"
                              style={{ border: "none" }}
                            >
                              <li
                                data-attr="compact-sidebar"
                                onClick={(e) => handlePageLayputs(classes[0])}
                              >
                                <div className="layout-img">
                                  <AddDepartment
                                  disable={disable} 
                                  setDisable={setDisable}
                                  roles={roles} 
                                  setRoles={setRoles}
                                    rightSidebar={rightSidebar}
                                    dataClose={closeCustomizer}
                                    onUpdate={(data) => update(data)}
                                  />
                                </div>
                              </li>
                            </ul>
                          </TabPane>
                          <TabPane tabId="3">
                            <div id="headerheading">
                              {" "}
                              Department Information : <span className="First_Letter1">{lead.name}</span>
                            </div>
                            <DepartmentDetails
                              roles={roles} 
                              setRoles={setRoles}
                            deptusers={deptusers}
                            setDeptUsers={setDeptUsers}
                              lead={lead}
                              onUpdate={(data) => update(data)}
                              rightSidebar={rightSidebar}
                              dataClose={closeCustomizer}
                            />
                          </TabPane>
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
            </Row>
          </div>
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

export default Department;
