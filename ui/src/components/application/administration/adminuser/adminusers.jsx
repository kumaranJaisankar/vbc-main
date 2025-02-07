import React, {
  Fragment,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import {
  Container,
  Row,
  Col,
  Card,
  Modal,
  ModalHeader,
  ModalFooter,
  TabContent,
  TabPane,
  ModalBody,
} from "reactstrap";
import { Search } from "react-feather";
import { logout_From_Firebase } from "../../../../utils";
import PermissionModal from "../../../common/PermissionModal";
import { ModalTitle, CopyText, Cancel, Close } from "../../../../constant";
import { adminaxios } from "../../../../axios";
import Userdetails from "./userdetails";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
// import "react-data-table-component-extensions/dist/index.css";
import ErrorModal from "../../../common/ErrorModal";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import { classes } from "../../../../data/layouts";
import AddadminUser from "./addadminuser";
import MUIButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import REFRESH from "../../../../assets/images/refresh.png";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { ADMINISTRATION } from "../../../../utils/permissions";
import MoreActions from "../../../common/CommonMoreActions";
import Tooltip from "@mui/material/Tooltip";

var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}
const AdminUsers = (props, initialValues) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [loading, setLoading] = useState(false);
  //making button disabled
  const [disable, setDisable] = useState(false);
  // const [exportData, setExportData] = useState({ columns: columns,exportHeaders:[]})
  // const [exportData, setExportData] = useState({ columns: columns, data: [] });
  const [lead, setLead] = useState([]);
  const width = useWindowSize();
  const [roles, setRoles] = useState([]);

  const [modal, setModal] = useState();
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [failed, setFailed] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);

  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  const [clearSelection, setClearSelection] = useState(false);
  //modal state for insufficient permissions
  const [permissionmodal, setPermissionModal] = useState();
  const [permissionModalText, setPermissionModalText] = useState(
    "You are not authorized for this action"
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
      .get(`accounts/users`)
      // .then((res) => setData(res.data))
      .then((res) => {
        setData(res.data);
        setFiltereddata(res.data);
        setLoading(false);
        setRefresh(0);
        const usernameFromUrl = new URLSearchParams(window.location.search).get(
          "username"
        );
        if (window.location.search !== "" && usernameFromUrl !== "") {
          let row = res.data.find((u) => u.username == usernameFromUrl);
          if (row) openCustomizer("3", row);
        }
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
          setModalMessage("Internal Server Error");
          // toast.error("Something went wrong", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
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
  // test
  const update = (newRecord) => {
    setLoading(true);
    adminaxios
      .get(`accounts/users`)
      // .then((res) => setData(res.data))
      .then((res) => {
        setData(res.data);
        setFiltereddata(res.data);
        setLoading(false);
        setRefresh(0);
      });
    //setData([...data, newRecord]);
    // setFiltereddata([...data, newRecord]);
    //setFiltereddata((prevFilteredData) => [newRecord, ...prevFilteredData]);
    closeCustomizer();
  };

  const detailsUpdate = (updatedata) => {
    console.log("name");
    //setData([...data, updatedata]);(
    Refreshhandler();
    setData((prevFilteredData) =>
      prevFilteredData.map((data) =>
        data.id == updatedata.id ? updatedata : data
      )
    );
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
      if (data.username.toLowerCase().search(value) != -1) return data;
    });
    setFiltereddata(result);
  };

  // delete api
  const onDelete = () => {
    let dat = { ids: isChecked };

    // adminaxios.delete("accounts/users", {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ ids: isChecked }),
    // })

    fetch(
      `${process.env.REACT_APP_API_URL_ADMIN}/accounts/users/delete/multiple`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenAccess}`,
        },
        body: JSON.stringify(dat),
      }
    )
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
    if (window.location.search !== "") {
      history.replace({
        search: "",
      });
    }
  };
  const openCustomizer = (type, lead) => {
    let leads = { ...lead };
    if (lead && lead.address) {
      //  let address = lead.address.split(',');

      leads.hno = lead.address["house_no"] || "";
      leads.street = lead.address["street"] || "";
      leads.city = lead.address["city"] || "";

      leads.district = lead.address["district"] || "";
      leads.area = lead.address["area"] || "";
      leads.pincode = lead.address["pincode"] || "";
    }

    if (lead) {
      setLead(leads);
    }
    setActiveTab1(type);
    setRightSidebar(true);
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
    if (window.location.search !== "") {
      key = key + window.location.search;
    }
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
    //   // style: {
    //   //   ...stickyColumnStyles,
    //   //   left: "80px",
    //   // },
    // },
    // {
    //   name: <b className="Table_columns"   >{"ID"}</b>,
    //   selector: "id",

    //   cell: (row) => (
    //     <>
    //       {token.permissions.includes(ADMINISTRATION.USERREAD) ? (
    //         <a
    //           onClick={() => openCustomizer("3", row)}
    //           className="openmodal"
    //         >
    //           U{row.id}
    //         </a>
    //       ) : (
    //         <span   id="columns_alignment">U{row.id}</span>
    //       )}
    //     </>
    //   ),
    //   sortable: false,
    // },
    {
      name: <b className="Table_columns">{"User Name"}</b>,
      selector: "username",
      // cell:(row)=>(
      //   <span id="columns_width" className="First_Letter">{row.username}</span>
      // ),

      cell: (row) => (
        <>
          {token.permissions.includes(ADMINISTRATION.USERREAD) ? (
            <a
              onClick={() => openCustomizer("3", row)}
              className="openmodal First_Letter"
            >
              {row.username}
            </a>
          ) : (
            <span id="columns_alignment" className="First_Letter">
              {row.username}
            </span>
          )}
        </>
      ),
      sortable: false,
    },
    {
      name: <b className="Table_columns">{"Name"}</b>,
      selector: "first_name",
      // width: '10%',

      cell: (row) => {
        return (
          <span className="First_Letter" style={{ whiteSpace: "initial" }}>
            {row.first_name ? row.first_name : "---"}
          </span>
        );
      },
      sortable: false,
    },

    {
      name: (
        <b className="Table_columns" id="columns_width">
          {"Mobile"}
        </b>
      ),
      selector: "mobile_number",
      // width: '15%',
      sortable: false,
      cell: (row) => {
        return (
          <span id="columns_width">
            {row.mobile_number ? row.mobile_number : "---"}
          </span>
        );
      },
    },
    // {
    //   name: <b className="Table_columns adminuser_columns" >{"Alternate Mobile"}</b>,
    //   selector: "alternate_mobile_number",
    //   cell: (row) => {
    //     return (
    //       <span className="adminuser_columns">
    //         {row.alternate_mobile_number ? row.alternate_mobile_number : "---"}
    //       </span>
    //     );
    //   },
    //   sortable: false,
    // },
    {
      name: <b className="Table_columns adminuser_columns">{"Email"}</b>,
      selector: "email",
      // width: '20%',
      sortable: false,
      cell: (row) => (
        <div
          className="ellipsis adminuser_columns"
          title={row.email}
          style={{ color: "#285295" }}
        >
          {row.email}
        </div>
      ),
    },
    {
      name: <b className="Table_columns adminuser_columns">{"Address"}</b>,
      selector: "address",

      sortable: false,
      cell: (row) => (
        <div
          className="ellipsis First_Letter1 adminuser_columns"
          title={`${row && row.address && row.address.house_no},${
            row && row.address && row.address.landmark
          },${row && row.address && row.address.street},${
            row && row.address && row.address.city
          },${row && row.address && row.address.district},${
            row && row.address && row.address.state
          },${row && row.address && row.address.pincode},${
            row && row.address && row.address.country
          }`}
        >
          <span>
            {row?.address
              ? `${row && row.address && row.address.house_no},${
                  row && row.address && row.address.landmark
                },${row && row.address && row.address.street},${
                  row && row.address && row.address.city
                },${row && row.address && row.address.district},${
                  row && row.address && row.address.state
                },${row && row.address && row.address.pincode},${
                  row && row.address && row.address.country
                }`
              : "---"}
          </span>
        </div>
      ),
    },
    {
      name: <b className="Table_columns adminuser_columns">{"Joined Date"}</b>,
      selector: "date_joined",
      // width: '10%',
      // width: 'auto',
      // Sailaja Modified Year Format as YYYY on 20th March 2023
      cell: (row) => (
        <span
          className="digits adminuser_columns"
          style={{ textTransform: "initial" }}
        >
          {" "}
          {moment(row.date_joined).format("DD MMM YYYY")}
        </span>
      ),
      sortable: false,
    },
    // {
    //   name: "Branch",

    //   sortable: false,
    //   cell: (row, index) => <span>{row.branch[0].length>0? row.branch[0].name: '-'}</span>,
    // },
    // {
    //   name: <b className="Table_columns">{"Last Name"}</b>,
    //   selector: "last_name",
    //   // width: '10%',
    //   cell: (row) => {
    //     return <span>{row.last_name ? row.last_name : "---"}</span>;
    //   },

    //   sortable: false,
    // },
    // },
    ,
  ];
  const [exportData, setExportData] = useState({
    columns: columns,
    exportHeaders: [],
  });
  // useEffect(() => {
  //   adminaxios
  //     .get("/accounts/options/all")
  //     .then((res) => {
  //       let { roles} = res.data;
  //       setRoles([...roles]);

  //     })
  //     .catch((error) => console.log(error));
  // }, []);

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

  //onside click hide sidebar
  const box = useRef(null);
  // useOutsideAlerter(box);

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
      <label className="form-check-label" id="booty-check" />
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
  // css for breadcrumb by Marieya
  return (
    <div ref={ref}>
      <Fragment>
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
                  Users
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <br />
          <br />
          <div className="edit-profile data_table" id="breadcrumb_table">
            <Stack direction="row" spacing={2}>
              <span className="all_cust">Users</span>
              <Stack
                direction="row"
                justifyContent="flex-end"
                sx={{ flex: 1 }}
                style={{ width: "87%" }}
              >
                <Paper
                  component="div"
                  className="search_bar"

                  // sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    inputProps={{ "aria-label": "search google maps" }}
                    placeholder="Search With User Name"
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
              {/* Sailaja Added tooltip for Admin/Users refresh button on 9th August REF US-01  */}
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
              ></MUIButton>  */}
              {/* Sailaja interchanged positions of New & + Admin/Users on 9th Aug REF US-02 */}
              {token.permissions.includes(ADMINISTRATION.USERCREATE) && (
                <button
                  className="btn btn-primary openmodal"
                  id="newbuuon"
                  type="submit"
                  onClick={() => openCustomizer("2")}
                >
                  <b>
                    <span className="openmodal new_btn ">New</span>
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
              {/* modal */}
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
                      <span>U{id},</span>
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

              <Col md="12" className="adminUser">
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
                          <div>
                            {token.permissions.includes(
                              ADMINISTRATION.USERLIST
                            ) ? (
                              <DataTable
                                className="leadTable"
                                columns={columns}
                                data={filteredData}
                                noHeader
                                // striped={true}
                                // center={true}
                                // clearSelectedRows={clearSelectedRows}

                                // selectableRows
                                onSelectedRowsChange={({ selectedRows }) =>
                                  handleSelectedRows(selectedRows)
                                }
                                clearSelectedRows={clearSelectedRows}
                                pagination
                                noDataComponent={"No Data"}
                                // clearSelectedRows={clearSelection}
                                responsive={true}
                                conditionalRowStyles={conditionalRowStyles}
                                selectableRows
                                selectableRowsComponent={NewCheckbox}
                              />
                            ) : (
                              <p style={{ textAlign: "center" }}>
                                {
                                  "You have insufficient permissions to view this"
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </nav>
                    {/* <button
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "medium",
                    }}
                    className="btn btn-primary openmodal"
                    type="submit"
                    onClick={() => openCustomizer("2")}
                  >
                    <span style={{ marginLeft: "-10px" }}className="openmodal">&nbsp;&nbsp; <span className="button-text">New </span></span>
                    <i
                      className="icofont icofont-plus openmodal"
                      style={{
                        paddingLeft: "10px",
                        cursor: "pointer",
                      }}
                    ></i>
                  </button>   */}
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
                        <i
                          className="icon-close cancel_icon"
                          onClick={closeCustomizer}
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
                            <div id="headerheading"> Add New User</div>
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
                                    <AddadminUser
                                      dataClose={closeCustomizer}
                                      onUpdate={(data) => update(data)}
                                      rightSidebar={rightSidebar}
                                      openCustomizer={openCustomizer}
                                    />
                                  )}
                                </div>
                              </li>
                            </ul>
                          </TabPane>
                          <TabPane tabId="3">
                            <div id="headerheading">
                              {" "}
                              User Information :{" "}
                              <span className="First_Letter1">
                                {lead.username}
                              </span>
                              {console.log(lead, "lead")}
                            </div>
                            {activeTab1 == "3" && (
                              <Userdetails
                                lead={lead}
                                onUpdate={(dclose_icoata) =>
                                  detailsUpdate(data)
                                }
                                rightSidebar={rightSidebar}
                                dataClose={closeCustomizer}
                                openCustomizer={openCustomizer}
                                Refreshhandler={Refreshhandler}
                              />
                            )}
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
      </Fragment>
    </div>
  );
};
//   test
export default AdminUsers;
