import React, {
  Fragment,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import Skeleton from "react-loading-skeleton";
import { BranchFilterContainer } from "./BranchFilter/BranchFilterContainer";
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
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { ModalTitle, CopyText, Cancel, Close } from "../../../constant";
import { adminaxios } from "../../../axios";
import AddBranch from "./addbranch";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { logout_From_Firebase } from "../../../utils";
import PermissionModal from "../../common/PermissionModal";
// import "react-data-table-component-extensions/dist/index.css";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import { classes } from "../../../data/layouts";
import { AllBranchDetails } from "./branchdetails/allbranchdetails";
import MUIButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FILTERS from "../../../assets/images/filters.png";
import REFRESH from "../../../assets/images/refresh.png";
import Grid from "@mui/material/Grid";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { BRANCH } from "../../../utils/permissions";
import Tooltip from "@mui/material/Tooltip";

var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}

const Branch = () => {
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [loading, setLoading] = useState(false);
  // const [exportData, setExportData] = useState({ columns: columns,exportHeaders:[]})
  // const [exportData, setExportData] = useState({ columns: columns, data: [] });
  const [lead, setLead] = useState([]);
  const width = useWindowSize();

  const [modal, setModal] = useState();
  //modal state for insufficient permissions
  const [permissionmodal, setPermissionModal] = useState();
  const [permissionModalText, setPermissionModalText] = useState(
    "You are not authorized for this action"
  );
  // draft
  const [isDirty, setIsDirty] = useState(false);
  const [isDirtyModal, setisDirtyModal] = useState(false);
  const [formDataForSaveInDraft, setformDataForSaveInDraft] = useState({});
  //end

  const [Verticalcenter, setVerticalcenter] = useState(false);

  const [failed, setFailed] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  const [clearSelection, setClearSelection] = useState(false);
  //filter show and hide menu
  const [levelMenu, setLevelMenu] = useState(false);
  //taking backup for original data
  const [filteredDataBkp, setFiltereddataBkp] = useState(data);

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
      .get(`accounts/branch/display`)
      // .then((res) => setData(res.data))
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
          setPermissionModalText(" Insufficient permissions!");
          permissiontoggle();
        } else if (
          code === "In-valid token. Please login again" ||
          detail === "In-valid token. Please login again"
        ) {
          logout();
        } else {
          toast.error("Insufficient Permissions", {
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
    // adminaxios
    //   .get(`accounts/branch/display`)
    //   // .then((res) => setData(res.data))
    //   .then((res) => {
    //     setData(res.data);
    //     setFiltereddata(res.data);
    //     setLoading(false);
    //     setRefresh(0);
    //   });
    Refreshhandler();
    setData([...data, newRecord]);
    setFiltereddata([...data, newRecord]);
    //setFiltereddata((prevFilteredData) => [newRecord, ...prevFilteredData]);
    closeCustomizerOnly(false);
  };

  const detailsUpdate = (updatedata) => {
    setData([...data, updatedata]);
    setFiltereddata((prevFilteredData) => [...prevFilteredData, updatedata]);
    setFiltereddata((prevFilteredData) =>
      prevFilteredData.map((data) =>
        data.id == updatedata.id ? updatedata : data
      )
    );
    closeCustomizerOnly();
    Refreshhandler();
  };

  //   //filter
  const handlesearchChange = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = data.filter((data) => {
      if (
        data.name.toLowerCase().search(value) != -1 ||
        (data &&
          data.owner &&
          data.owner.username.toLowerCase().search(value) != -1)
      )
        return data;
    });
    setFiltereddata(result);
  };

  // delete api
  const onDelete = () => {
    let dat = { ids: isChecked };

    fetch(
      `${process.env.REACT_APP_API_URL_ADMIN}/accounts/branch/multiple/delete/`,
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
  };

  const toggle = () => {
    setModal(!modal);
  };
  //modal for insufficient modal
  const permissiontoggle = () => {
    setPermissionModal(!permissionmodal);
  };
  //end
  // const closeCustomizer = () => {
  //   setRightSidebar(!rightSidebar);
  //   document.querySelector(".customizer-contain").classList.remove("open");
  // };

  const closeCustomizerOnly = () => {
    setisDirtyModal(false);
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
    setIsDirty(false);
  };

  //draft vustomizers
  // removed draft code from closeCustomizer by Marieya
  const closeCustomizer = () => {
    // draft
    if (isDirty) {
      setisDirtyModal(true);
    } else {
      setisDirtyModal(false);
      setRightSidebar(!rightSidebar);
      document.querySelector(".customizer-contain").classList.remove("open");
      setIsDirty(false);
    }
    // setisDirtyModal(false);
    // setRightSidebar(!rightSidebar);
    // document.querySelector(".customizer-contain").classList.remove("open");
    // setIsDirty(false);
  };

  const openCustomizer = (type, id) => {
    if (id) {
      setLead(id);
    }
    // draft store value
    const getLocalDraftKey = localStorage.getItem("branchDraftSaveKey");
    if (!!getLocalDraftKey) {
      const getLocalDraftData = localStorage.getItem(getLocalDraftKey);
      setLead(JSON.parse(getLocalDraftData));
    }
    setActiveTab1(type);
    setRightSidebar(!rightSidebar);
    // if (rightSidebar) {
    document.querySelector(".customizer-contain").classList.add("open");

    // document.querySelector(".customizer-links").classList.add('open');
    // }
  };
  //end

  // const openCustomizer = (type, id) => {
  //   console.log(id);
  //   if (id) {
  //     setLead(id);
  //   }
  //   setActiveTab1(type);
  //   setRightSidebar(!rightSidebar);
  //   if (rightSidebar) {
  //     document.querySelector(".customizer-contain").classList.add("open");

  //     // document.querySelector(".customizer-links").classList.add('open');
  //   }
  // };

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
    //   cell: (row) => <MoreActions />,
    // },
    // {
    //   name: <b className="Table_columns" >{"ID"}</b>,
    //   selector: "id",
    //   cell: (row) => (
    //     <>
    //       {token.permissions.includes(BRANCH.READ) ? (
    //         <a
    //           onClick={() => openCustomizer("3", row)}
    //           // id="columns_alignment"
    //           className="openmodal"
    //         >
    //           B{row.id}
    //         </a>
    //       ) : (
    //         <span >B{row.id}</span>
    //       )}
    //     </>
    //   ),
    //   sortable: true,
    // },
    {
      name: <b className="Table_columns">{"Branch Name"}</b>,
      selector: "name",
      cell: (row) => (
        <>
          {token.permissions.includes(BRANCH.READ) ? (
            <a
              onClick={() => openCustomizer("3", row)}
              // id="columns_alignment"
              className="openmodal"
            >
              {row.name}
            </a>
          ) : (
            <span>{row.name}</span>
          )}
        </>
      ),

      sortable: true,
    },
    // {
    //   name: "Franchise",
    //   selector: "franchise",
    //   sortable: true,
    //   cell: (row) => {
    //     let statusObj = franchiselist.find((s) => s.id == row.franchise);

    //     return <span>{statusObj ? statusObj.franchise_name : "-"}</span>;
    //   },
    // },
    {
      name: <b className="Table_columns">{"Owner"}</b>,
      selector: "owner.username",
      cell: (row) => {
        return <span>{row.owner ? row.owner.username : "-"}</span>;
      },
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Branch Code"}</b>,
      cell: (row) => {
        return <span>{row.code ? row.code : "-"}</span>;
      },
      selector: "code",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Invoice Code"}</b>,
      cell: (row) => {
        return <span>{row.invoice_code ? row.invoice_code : "-"}</span>;
      },
      selector: "invoice_code",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"GST Codes"}</b>,
      selector: "gst_codes",
      sortable: true,
      cell: (row) => {
        const users = row.gst_codes?.map((list) => list.name);
        if (users && users.length > 0) {
          return <span>{users?.join(",")}</span>;
        } else {
          return <span>---</span>;
        }
      },
    },
    {
      name: <b className="Table_columns">{"Email"}</b>,
      cell: (row) => {
        return <span>{row.email === false ? "False" : "True"}</span>;
      },
      selector: "email",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"SMS"}</b>,
      cell: (row) => {
        return <span>{row?.sms === true ? "True" : "False"}</span>;
      },
      selector: "sms",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Whatsapp"}</b>,
      cell: (row) => {
        return <span>{row?.whatsapp_flag === true ? "True" : "False"}</span>;
      },
      selector: "whatsapp_flag",
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Active Customers"}</b>,
      cell: (row) => {
        return <span>{row?.customer_count ? row.customer_count : "-"}</span>;
      },
      sortable: true,
    },
    {
      name: <b className="Table_columns">{"Address"}</b>,
      sortable: true,
      cell: (row) => (
        <div className="ellipsis" title={getModifiedAddress(row)}>
          {getModifiedAddress(row)}
        </div>
      ),
      // cell: (row) => {
      //   return (
      //     <div
      //       style={{
      //         whiteSpace: "nowrap",
      //         overflow: "hidden",
      //         textOverflow: "ellipsis",
      //       }}
      //     >
      //       {getModifiedAddress(row)}
      //     </div>
      //   );
      // },
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
    {
      name: "",
      selector: "",
      sortable: "",
    },
  ];

  const getModifiedAddress = (row) => {
    const { address } = row;
    return `${address ? address.house_no : ""},
    ${address ? address.landmark : ""},
    ${address ? address.street : ""},
    ${address ? address.city : ""},
    ${address ? address.district : ""},
    ${address ? address.state : ""},
    ${address ? address.country : ""},
    ${address ? address.pincode : ""}`;
  };

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
          //   setImportDivStatus(true);
        }
      }
    }
  });

  //draft start
  const saveDataInDraftAndCloseModal = () => {
    localStorage.setItem("plans/", JSON.stringify(formDataForSaveInDraft));
    localStorage.setItem("branchDraftSaveKey", "plans/");

    setisDirtyModal(false);
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
    setIsDirty(false);
  };

  const setIsDirtyFun = (val) => {
    setIsDirty(val);
  };
  const closeDirtyModal = () => {
    setisDirtyModal(false);
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
    localStorage.removeItem("plans/");
    localStorage.removeItem("branchDraftSaveKey");
    setIsDirty(false);
    setLead({});
  };

  // draft end
  const conditionalRowStyles = [
    {
      when: (row) => row.selected === true,
      style: {
        backgroundColor: "#E4EDF7",
      },
    },
  ];
  //download export files
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
          if (
            rightSidebar &&
            !event.target.className.includes("openmodal") &&
            !event.target.className.includes("react-datepicker__day") &&
            !event.target.className.includes(
              "react-datepicker__navigation--previous"
            )
          ) {
            closeCustomizer();
          }
        }
      }

      // Adding click event listener
      document.addEventListener("click", handleOutsideClick);
    }, [ref]);
  }

  //end
  //new export states
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //end

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
      <label className="form-check-label" id="booty-check" />
    </div>
  ));
  //end

  //  Sailaja on 11th July   Line number 672 id="breadcrumb_margin" change the breadcrumb position

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
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color=" #377DF6"
                  fontSize="14px"
                >
                  Business Operations
                </Typography>
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color="#00000 !important"
                  fontSize="14px"
                  classNmae="last_typography !important"
                >
                  Branch
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <br />
          <br />
          {/* Sailaja on 11th July   Line number 707 id="breadcrumb_table" change the breadcrumb position  */}

          <div className="edit-profile data_table" id="breadcrumb_table">
            <Stack direction="row" spacing={2}>
              <span className="all_cust">Branch</span>
              <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }}>
                <Paper
                  component="div"
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: 350,
                    height: "40px",
                    boxShadow: "none",
                    border: "1px solid #E0E0E0",
                  }}
                >
                  {" "}
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    inputProps={{ "aria-label": "search google maps" }}
                    placeholder="Search With Branch Name or Owner Name"
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
                <Tooltip title={"Refresh"}>
                  <MUIButton
                    className="muibuttons"
                    onClick={Refreshhandler}
                    variant="outlined"
                    style={{ height: "40px" }}
                  >
                    <img src={REFRESH} />
                  </MUIButton>
                </Tooltip>
                <Tooltip title={"Filter"}>
                  <MUIButton
                    onClick={() => OnLevelMenu(levelMenu)}
                    variant="outlined"
                    className="muibuttons"
                  >
                    <img src={FILTERS} />
                  </MUIButton>
                </Tooltip>
                <BranchFilterContainer
                  levelMenu={levelMenu}
                  setLevelMenu={setLevelMenu}
                  filteredData={filteredData}
                  setFiltereddata={setFiltereddata}
                  filteredDataBkp={filteredDataBkp}
                  loading={loading}
                  setLoading={setLoading}
                  showTypeahead={false}
                />
                {token.permissions.includes(BRANCH.CREATE) && (
                  <button
                    className="btn btn-primary openmodal"
                    id="newbuuon"
                    type="submit"
                    onClick={() => openCustomizer("2")}
                  >
                    <b>
                      <span
                        className="openmodal"
                        style={{
                          fontSize: "16px",
                          position: "relative",
                          left: "-27%",
                        }}
                      >
                        New
                      </span>
                      <i
                        className="icofont icofont-plus openmodal"
                        style={{
                          cursor: "pointer",
                        }}
                      ></i>
                    </b>
                  </button>
                )}
              </Stack>
            </Stack>

            <Row>
              {/*Sailaja given marginTop:"4%" style for set filter box position on 10th August   */}
              <Col md="12" style={{ marginTop: "4%" }}>
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
                          {token.permissions.includes(BRANCH.LIST) ? (
                            <DataTable
                              className="branch-lists"
                              columns={columns}
                              data={filteredData}
                              noHeader
                              selectableRows
                              selectableRowsComponent={NewCheckbox}
                              // striped={true}
                              // center={true}
                              // clearSelectedRows={clearSelectedRows}

                              // selectableRows
                              onSelectedRowsChange={({ selectedRows }) => (
                                handleSelectedRows(selectedRows),
                                deleteRows(selectedRows)
                              )}
                              clearSelectedRows={clearSelectedRows}
                              pagination
                              noDataComponent={"No Records"}
                              // clearSelectedRows={clearSelection}
                              conditionalRowStyles={conditionalRowStyles}
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
                        <i className="icon-close" onClick={closeCustomizer}></i>
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
                            <div id="headerheading"> Add New Branch</div>
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
                                    <AddBranch
                                      dataClose={closeCustomizer}
                                      onUpdate={(data) => update(data)}
                                      rightSidebar={rightSidebar}
                                      setIsDirtyFun={setIsDirtyFun}
                                      setformDataForSaveInDraft={
                                        setformDataForSaveInDraft
                                      }
                                      lead={lead}
                                    />
                                  )}
                                </div>
                              </li>
                            </ul>
                          </TabPane>
                          <TabPane tabId="3">
                            <div id="headerheading">
                              {" "}
                              Branch Information : {lead.name}
                            </div>
                            {activeTab1 == "3" && (
                              <AllBranchDetails
                                lead={lead}
                                onUpdate={(data) => detailsUpdate(data)}
                                rightSidebar={rightSidebar}
                                dataClose={closeCustomizer}
                                openCustomizer={openCustomizer}
                                setRefresh={setRefresh}
                              />
                            )}
                          </TabPane>
                        </TabContent>
                      </div>
                    </div>
                  </div>
                </Col>
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
                        <span>B{id},</span>
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
                {/* draft modal start*/}
                <Modal
                  isOpen={isDirtyModal}
                  toggle={() => setisDirtyModal(!isDirtyModal)}
                  className="modal-body"
                  centered={true}
                >
                  <ModalHeader toggle={() => setisDirtyModal(!isDirtyModal)}>
                    {"Confirmation"}
                  </ModalHeader>
                  <ModalBody>Do you want to save this data in draft?</ModalBody>
                  <ModalFooter>
                    <Button
                      color="primary"
                      className="notification"
                      onClick={saveDataInDraftAndCloseModal}
                    >
                      {"Save as Draft"}
                    </Button>

                    <Button id="resetid" onClick={() => closeDirtyModal()}>
                      {"Close"}
                    </Button>
                  </ModalFooter>
                </Modal>
                {/* draft modal end */}
              </Row>
            </Row>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default Branch;
