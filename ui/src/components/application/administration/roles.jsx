import React, { Fragment, useEffect, useState, useRef } from "react";
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
import { ModalTitle, CopyText, Cancel, Close } from "../../../constant";
import PermissionModal from "../../common/PermissionModal";
import { adminaxios } from "../../../axios";
import AddRole from "./addrole";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import { classes } from "../../../data/layouts";
import ManageUserPermissions from "./ManageUserPermissions";
import isEmpty from "lodash/isEmpty";
import MUIButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { ADMINISTRATION } from "../../../utils/permissions";
import PERMISSIONFULL from "../../../assets/images/permission-full.png";
import PERMISSIONPARTIAL from "../../../assets/images/permission-partial.png";
import PERMISSIONNONE from "../../../assets/images/permission-none.png";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import REFRESH from "../../../assets/images/refresh.png";
import PERMISSION from "../../../assets/images/permission.png";
import MoreActions from "../../common/CommonMoreActions";
import Tooltip from '@mui/material/Tooltip';

const tableData = [
  {
    status: {
      add: true,
      edit: true,
      delete: true,
    },
  },
  {
    status: {
      add: false,
      edit: true,
      delete: true,
    },
  },
  {
    status: {
      add: false,
      edit: true,
      delete: true,
    },
  },
  {
    status: {
      add: false,
      edit: false,
      delete: false,
    },
  },
  {
    status: {
      add: false,
      edit: false,
      delete: false,
    },
  },
  {
    status: {
      add: true,
      edit: false,
      delete: false,
    },
  },
];
var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}

const Roles = () => {
  const [activeTab1, setActiveTab1] = useState("1");
  const [nestedPermissions, setNestedPermissions] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);
  const [halfChecked, setHalfChecked] = useState([]);
  const [rightSidebar, setRightSidebar] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState();
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [failed, setFailed] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  //modal state for insufficient permissions
  const [permissionmodal, setPermissionModal] = useState();

  const [checkedata, setCheckedata] = useState([...tableData]);
  const [datatablecolumns, setDatatablecolumns] = useState([]);
  const [permissionModalText, setPermissionModalText] = useState(
    "You are not authorized for this action"
  );
  const [roleGroups, setRoleGroups] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [showDetailsPage, setShowDetailsPage] = useState(true);
  const [columnsUpdate, setColumnsUpdate] = useState(false);
  const configDB = useSelector((content) => content.Customizer.customizer);
  const sidebar_type = configDB.settings.sidebar.type;

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
      // return false;
    }
  };
  let history = useHistory();

  const dispatch = useDispatch();

  let DefaultLayout = {};

  useEffect(() => {
    // setCheckedata(tableData)
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
      .get("/accounts/options/all")
      .then((res) => {
        let { groups } = res.data;
        setRoleGroups(groups);
        adminaxios
          .get(`accounts/role/list`)
          .then((res) => {
            setData(res.data);
            setFiltereddata(res.data);
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
  }, [refresh]);

  useEffect(() => {
    adminaxios.get("accounts/permissions/nested").then((res) => {
      setNestedPermissions(res.data);
    });
  }, []);

  useEffect(() => {
    setExportData({
      ...exportData,
      data: filteredData,
    });
  }, [filteredData]);

  const update = () => {
    setLoading(true);
    adminaxios.get(`accounts/role/list`).then((res) => {
      setData(res.data);
      setFiltereddata(res.data);
      setLoading(false);
      setRefresh(0);
    });
    closeCustomizer();
  };

  //   //filter
  const handlesearchChange = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = data.filter((data) => {
      if (data.name.toLowerCase().search(value) != -1) return data;
    });
    setFiltereddata(result);
  };

  // delete api
  const onDelete = () => {
    let dat = { ids: isChecked };

    fetch(
      `${process.env.REACT_APP_API_URL_ADMIN}/accounts/role/multiple/delete/`,
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
    setEditRecord(null);
    setExpanded([]);
    setSelected([]);
    setHalfChecked([]);
    setShowDetailsPage(true);
    setRightSidebar(false);
    document.querySelector(".customizer-contain").classList.remove("open");
  };

  const openCustomizer = (type, rowData) => {
    setShowDetailsPage(rowData ? true : false);
    setEditRecord(rowData);
    setSelected(rowData ? rowData?.permissions?.map((item) => item.id) : []);
    setHalfChecked(rowData ? rowData?.permissions?.map((item) => item.id) : []);
    setActiveTab1(type);
    setRightSidebar(true);
    document.querySelector(".customizer-contain").classList.add("open");
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
    if (searchInputField.current) searchInputField.current.value = "";
  };

  const searchInputField = useRef(null);

  const getStatusOfSelectedPermission = (groupId, permissionsTemp) => {
    let status = "off";
    let group = roleGroups.find((g) => g.id === groupId);
    if (!isEmpty(group)) {
      let permissionsBkp = group.permissions;
      let count = 0;

      if (permissionsTemp.length > 0) {
        permissionsBkp.forEach((value) => {
          if (!!permissionsTemp.find((p) => p == value.id)) {
            count++;
          }
        });
        if (count == 0) {
          status = "off";
        } else if (count == permissionsBkp.length) {
          status = "on";
        } else if (count < permissionsBkp.length) {
          status = "on intermediate";
        }
      } else {
        status = "off";
      }
    }

    return status;
  };

  // sticky columns styles
  const stickyColumnStyles = {
    whiteSpace: "nowrap",
    position: "sticky",
    zIndex: "1",
    backgroundColor: "white",
  };
  //columns
  let columns = [
    // {
    //   name: "",
    //   selector: "action",
    //   width: "80px",
    //   center: true,
    //   cell: (row) => (
    //     <MoreActions
    //     />
    //   ),

    //   style: {
    //     ...stickyColumnStyles,
    //     left: "48px !important",
    //   },
    // },
    // {
    //   name: <b className="Table_columns"   >{"ID"}</b>,
    //   selector: "id",
    //   style: {
    //     ...stickyColumnStyles,
    //     left: "48px !important",
    //   },
    //   width: "80px",
    //   cell: (row) => (
    //     <>
    //       {token.permissions.includes(ADMINISTRATION.ROLEREAD) ? (
    //         <a
    //           onClick={() => openCustomizer("2", row)}
    //           className="openmodal"
    //         >
    //           R{row.id}
    //         </a>
    //       ) : (
    //         <span   >R{row.id}</span>
    //       )}
    //     </>
    //   ),
    //   sortable: false,
    // },
    {
      name: <b className="Table_columns" style={{ whiteSpace: "nowrap" }}>{"Role Name "} </b>,
      selector: "name",
      sortable: false,
      width: "160px",
      // cell: (row) => (
      //   <div className="ellipsis First_Letter" title={row.name}  style={{position:"relative",right:"30px"}}>
      //     {row.name}
      //   </div>
      // ),


      cell: (row) => (
        <>
          {token.permissions.includes(ADMINISTRATION.ROLEREAD) ? (
            <a
              onClick={() => openCustomizer("2", row)}
              className="openmodal ellipsis First_Letter"
              title={row.name}
            >
              {row.name}
            </a>
          ) : (
            <span   >{row.name}</span>
          )}
        </>
      ),
      style: {
        ...stickyColumnStyles,
        left: "48px !important",
      },
    },
    {
      name: <b className="Table_columns" >{"Description"}</b>,
      selector: "description",
      sortable: false,
      cell: (row) => (
        <div className="ellipsis First_Letter" title={row.description}>
          {row.description}
        </div>
      ),
      style: {
        ...stickyColumnStyles,
        left: "205px !important",
        borderRight: "1px solid #CECCCC",
      },

    },
  ];

  const [exportData, setExportData] = useState({
    columns: columns,
    exportHeaders: [],
  });

  //modal for insufficient modal
  const permissiontoggle = () => {
    setPermissionModal(!permissionmodal);
  };

  //end
  useEffect(() => {
    // let newcolumns = [...columns]
    let rolegroupobj = roleGroups.map((role) => {
      return {
        name: <b className="Table_columns">{role.name}</b>,
        selector: "status",
        sortable: true,
        center: true,
        cell: (row) => {
          let permissionsActions = row.permissions.map((p) => p.id);
          const status = getStatusOfSelectedPermission(role.id, [
            ...permissionsActions,
          ]);
          if (status == "on") {
            return <img src={PERMISSIONFULL} />;
          } else if (status == "on intermediate") {
            return <img src={PERMISSIONPARTIAL} />;
          } else if (status == "off") {
            return <img src={PERMISSIONNONE} />;
          } else {
            return "-";
          }
        },
      };
    });
    setColumnsUpdate(true);
    setDatatablecolumns([...columns, ...rolegroupobj]);
  }, [roleGroups]);

  const checkboxHandler = (newRecord, leadInfo) => {
    let checkedataClone = [...checkedata];

    let leadFindIndex = checkedataClone.findIndex(
      (lead) => lead.id === leadInfo.id
    );
    let leadFind = checkedataClone.find((lead) => lead.id === leadInfo.id);

    leadFind.status = { ...newRecord };
    checkedataClone[leadFindIndex] = leadFind;
    setCheckedata([...checkedataClone]);
  };

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

        function hasMatchingClass(element, classNames) {
            while (element) {
                if (classNames.some(className => element.className.includes(className))) {
                    return true;
                }
                element = element.parentElement;
            }
            return false;
        }

        function handleOutsideClick(event) {
            const typeaheadClasses = [
                "openmodal",
                "dropdown-item",
                "tab-content",
                "form-control",
                "input_wrap"
            ];

            // If the click event came from the typeahead or its related elements, do nothing.
            if (hasMatchingClass(event.target, typeaheadClasses)) {
                return;
            }

            if (ref.current && !ref.current.contains(event.target)) {
                closeCustomizer();
            }
            console.log(event.target, event.target.className, "testest");
        }

        // Adding click event listener
        document.addEventListener("click", handleOutsideClick);
        // Cleanup listener on unmount
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [ref]);
}

  // function useOutsideAlerter(ref) {
  //   useEffect(() => {
  //     // Function for click event
  //     function handleOutsideClick(event) {
  //       if (ref.current && !ref.current.contains(event.target)) {
  //         if (
  //           // !event.target.className.includes("openmodal") 
  //           !event.target.className.includes("dropdown-item") &&
  //           !event.target.className.includes("tab-content") && 
  //           !event.target.className.includes("form-control") &&
  //           !event.target.className.includes("input_wrap") 
            
  //         ) {
  //           closeCustomizer();
  //         }
  //       }
  //       console.log(event.target, event.target.className,"testest");
  //     }

  //     // Adding click event listener
  //     document.addEventListener("click", handleOutsideClick);
  //   }, [ref]);
  // }
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
                  Administration
                </Typography>
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color="#00000 !important"
                  fontSize="14px"
                  className="last_typography"
                >
                  Roles and Permissions
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <br />
          <br />

          <div className="edit-profile data_table" id="breadcrumb_table">
            <Stack direction="row" spacing={2}>
              <span className="all_cust">Roles and Permissions</span>
              <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }} style={{width:"87%"}}>
                <Paper component="div" className="search_bar">

                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    inputProps={{ "aria-label": "search google maps" }}
                    placeholder="Search With Role Name"
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
                {/* Sailaja Added tooltip for Admin/R&P refresh button on 12th August REF RP-02   */}
                <Tooltip title={"Refresh"}>
                  <MUIButton
                    onClick={Refreshhandler}
                    variant="outlined"
                    className="muibuttons"
                  >
                    <img src={REFRESH} style={{ width: "20px" }} />
                  </MUIButton>
                </Tooltip>

                {token.permissions.includes(ADMINISTRATION.NEWROLE) && (
                  <button
                    className="btn btn-primary openmodal"
                    id="newbuuon"
                    type="submit"
                    onClick={() => openCustomizer("2")}
                  >
                    {/* Sailaja interchanged positions of New & + Admin/R&P on 12th Aug REF RP-01  */}

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
                )} &nbsp;&nbsp;&nbsp;&nbsp;
                {token.permissions.includes(ADMINISTRATION.MANAGEUSER) && (
                  <button
                    className="btn btn-primary openmodal"
                    type="submit"
                    id="role_permission"
                    onClick={() => openCustomizer("4")}
                  >
                    <img src={PERMISSION} />
                    <span className="openmodal button-text">
                      &nbsp;&nbsp;{" "}
                      Permission
                    </span>
                  </button>
                )}
              </Stack>
            </Stack>
            <Row>
              <Col
                md="12"
                style={{ paddingBottom: "24px", borderRadius: "10%" }}
              >
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  {/* <div className="rolestatus">
                    <div style={{ margin: "0px 50px" }}>
                      <i className="fa fa-circle font-success f-12" />
                      &nbsp; Full
                    </div>
                    <div style={{ margin: "0px 50px" }}>
                      <i className="fa fa-circle font-warning f-12" />
                      &nbsp; Partial
                    </div>
                    <div style={{ margin: "0px 50px" }}>
                      <i className="fa fa-circle font-danger f-12" />
                      &nbsp; None
                    </div>
                  </div> */}
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
                          <span>R{id},</span>
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
                </div>
              </Col>

              <Col md="12">
                <Card style={{ borderRadius: "0", boxShadow: "none" }}>
                  <Col xl="12" style={{ padding: "0" }}>
                    <div style={{ display: "flex" }}></div>
                    <nav aria-label="Page navigation example">
                      {loading ? (
                        <Skeleton
                          count={11}
                          height={30}
                          style={{ marginBottom: "10px", marginTop: "15px" }}
                        />
                      ) : (
                        <div className="data-table-wrapper">
                          {columnsUpdate &&
                            (token.permissions.includes(
                              ADMINISTRATION.ROLELIST
                            ) ? (
                              <DataTable
                                className="roles-list"
                                columns={datatablecolumns}
                                data={filteredData}
                                onSelectedRowsChange={({ selectedRows }) =>
                                  handleSelectedRows(selectedRows)
                                }
                                clearSelectedRows={clearSelectedRows}
                                pagination
                                noDataComponent={"No Data"}
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
                            ))}
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
                        style={{ border: "none" }}
                      >
                        <br />
                        {/* Sailaja fixed ADMIN/R&P Edit icon and cancel icons in same line by using cancel_icon classname on 10th August */}

                        <i className="icon-close cancel_icon" style={{ marginTop: "11px", marginRight: "-3px" }} onClick={closeCustomizer}></i>
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
                            {editRecord &&
                              token.permissions.includes(
                                ADMINISTRATION.ROLEUPDATE
                              ) && (
                                <EditIcon
                                  className="icofont icofont-edit"
                                  style={{
                                    top: "8px",
                                    right: "64px",
                                  }}
                                  id="edit_icon"
                                  onClick={() => setShowDetailsPage(false)}
                                />
                              )}
                            <div id="headerheading" >
                              {editRecord
                                ? "Role Name : " + editRecord.name
                                : "New Role"}
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
                                  <AddRole
                                    dataClose={closeCustomizer}
                                    setNestedPermissions={setNestedPermissions}
                                    nestedPermissions={nestedPermissions}
                                    setHalfChecked={setHalfChecked}
                                    halfChecked={halfChecked}
                                    rightSidebar={rightSidebar}
                                    expanded={expanded}
                                    selected={selected}
                                    setSelected={setSelected}
                                    setExpanded={setExpanded}
                                    onUpdate={update}
                                    roleGroups={roleGroups}
                                    setRoleGroups={setRoleGroups}
                                    getStatusOfSelectedPermission={
                                      getStatusOfSelectedPermission
                                    }
                                    editRecord={editRecord}
                                    showDetailsPage={showDetailsPage}
                                  />
                                </div>
                              </li>
                            </ul>
                          </TabPane>
                          <TabPane tabId="4">
                            <div id="headerheading" className="openmodal">
                              Manage User Permission
                            </div>
                            <ManageUserPermissions
                              dataClose={closeCustomizer}
                              setNestedPermissions={setNestedPermissions}
                              setHalfChecked={setHalfChecked}
                              halfChecked={halfChecked}
                              nestedPermissions={nestedPermissions}
                              roleGroups={roleGroups}
                              setRoleGroups={setRoleGroups}
                              expanded={expanded}
                              selected={selected}
                              setSelected={setSelected}
                              setExpanded={setExpanded}
                              checkboxHandler={(data, lead) =>
                                checkboxHandler(data, lead)
                              }
                              getStatusOfSelectedPermission={
                                getStatusOfSelectedPermission
                              }
                              closeCustomizer={closeCustomizer}
                              rightSidebar={rightSidebar}
                              Refreshhandler={Refreshhandler}
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
                {/* comment */}
              </Row>
            </Row>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default Roles;
