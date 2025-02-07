import React, {
  Fragment,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import Skeleton from "react-loading-skeleton";
// import Breadcrumb from "../../layout/breadcrumb";
import * as XLSX from "xlsx";
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
import { ModalTitle, CopyText, Cancel, Close } from "../../../../constant";
import { default as axiosBaseURL } from "../../../../axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
// import "react-data-table-component-extensions/dist/index.css";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
// import { columns } from "../../../data/supportdb";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import { classes } from "../../../../data/layouts";
import AddLeadSource from "./addleadsource";
import DisplayLeadSource from "./displayleadsource";
import { logout_From_Firebase } from "../../../../utils";
import PermissionModal from "../../../common/PermissionModal";
import MUIButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import REFRESH from "../../../../assets/images/refresh.png";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { ADMINISTRATION } from "../../../../utils/permissions";
import Tooltip from '@mui/material/Tooltip';
import ErrorModal from "../../../common/ErrorModal";

var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}
const LeadSource = () => {
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [loading, setLoading] = useState(false);

  const [lead, setLead] = useState([]);
  const width = useWindowSize();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modal, setModal] = useState();
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [failed, setFailed] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);


  const configDB = useSelector((content) => content.Customizer.customizer);
  const [clearSelection, setClearSelection] = useState(false);
  //modal state for insufficient permissions
  const [permissionmodal, setPermissionModal] = useState();
  const [permissionModalText, setPermissionModalText] = useState(
    "You are not authorized for this action"
  );
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  const Verticalcentermodaltoggle = () => {
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
        // return false;
      }
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

    axiosBaseURL
      .get(`/radius/source/display`)
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
          setPermissionModalText("Something went wrong");
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

  const update = (newRecord) => {
    setLoading(true);
    axiosBaseURL
      .get(`/radius/source/display`)
      // .then((res) => setData(res.data))
      .then((res) => {
        console.log(res,"lead re")
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
      if (data.name.toLowerCase().search(value) != -1) return data;
    });
    setFiltereddata(result);
  };

  // delete api
  const onDelete = () => {
    let dat = { ids: isChecked };
    fetch(`${process.env.REACT_APP_API_URL}/radius/source/delete`, {
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
    // axiosBaseURL.delete("/radius/source/delete", {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(dat),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     var difference = [];
    //     if (data.length > 0) {
    //       difference = [...isChecked].filter((x) => data.indexOf(x) === -1);
    //       setFailed([...data]);
    //     } else {
    //       difference = [...isChecked];
    //     }
    //     setFiltereddata((prevState) => {
    //       var newdata = prevState.filter(
    //         (el) => difference.indexOf(el.id) === -1
    //       );
    //       return newdata;
    //     });
    //     Verticalcentermodaltoggle();
    //     setClearSelectedRows(true);
    //     console.log(filteredData);

    //     setIsChecked([]);
    //     if (data.length > 0) {
    //     }
    //   });
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

    // if (!rightSidebar) {
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
    if (searchInputField.current) {
    searchInputField.current.value = "";
    }
  };

  const searchInputField = useRef(null);

  //imports

  const processData = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );

    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map((c) => ({
      name: c,
      selector: c,
    }));

    // setData(list);
    setExcelData([...list]);
    // setFiltereddata((prevFilteredData) => [...list, ...prevFilteredData]);
    excelform(list);
  };

  const excelform = (data) => {
    axiosBaseURL
      .post("/radius/lead/uploadcsv/partial", data)
      .then((response) => {
        // setFiltereddata(response.json); // file upload
        // setFiltereddata((prevFilteredData) => [...data, ...prevFilteredData]);
        setRefresh(1);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };

  // handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };

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
    {
      name: <b className="Table_columns" >{" Source ID"}</b>,
      selector: "id",
      cell: (row) => (
        <>
        {token.permissions.includes(ADMINISTRATION.LEADREAD)?(

        <a
          onClick={() => openCustomizer("3", row)}
          // id="columns_right"
          className="openmodal"
        >
          LS{row.id}
        </a>
        ):(
          <span id="columns_right">LS{row.id}</span>
        )}
        </>
      ),
      sortable: true,
    },
    {
      name: <b className="Table_columns" id="columns_right">{"Source Name"}</b>,
      selector: "name",
      cell:(row)=>(
        <span id="columns_right" className="First_Letter">{row.name}</span>
      ),
      sortable: true,
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
  const [exportData, setExportData] = useState({
    columns: columns,
    exportHeaders: [],
  });
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
                separator={<NavigateNextIcon fontSize="small" className="navigate_icon"  />}
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
                  className="last_typography"

                >
                  Administration
                </Typography>
                {/* Sailaja Removed Leads from Breadcrumbs  on 13th July */}

                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color="#00000 !important"
                  fontSize="14px"
                  className="last_typography"

                >
                  Lead Source
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <br />
          <br />
          <div className="edit-profile data_table" id="breadcrumb_table">
            <Stack direction="row" spacing={2}>
            <span className="all_cust"> Lead Source</span>
            <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }} style={{width:"87%"}}>
                <Paper
                  component="div"
                  className="search_bar"
                >
                  
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    inputProps={{ "aria-label": "search google maps" }}
                    placeholder="Search With Source Name"
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
 {/* Sailaja Added tooltip for Admin/ Leads/Lead Source refresh button on 12th August REF Lead-4 Lead-9 */}
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
      {/* Sailaja interchanged positions of New & + Admin/Leads/Lead Source on 12th Aug REF Lead-1  */}
              {token.permissions.includes(ADMINISTRATION.LEADCREATE) && (
                <button
                className="btn btn-primary openmodal"
                id="newbuuon"
                type="submit"
                onClick={() => openCustomizer("2")}
              >
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
                      <span>L{id},</span>
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

              <Col md="12" className="data-table-size">
                <Card style={{ borderRadius: "0", boxShadow:"none" }}>
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
                          <DataTable
                            columns={columns}
                            data={filteredData}
                            noHeader
                            // striped={true}
                            // center={true}
                            // clearSelectedRows={clearSelectedRows}
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
                         {/* Sailaja fixed Leads/Lead Source Edit icon and cancel icons in same line by using cancel_icon classname on 12th August */}
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
                            <div id="headerheading">Add New Lead Source</div>
                            <ul
                              className="layout-grid layout-types"
                              style={{ border: "none" }}
                            >
                              <li
                                data-attr="compact-sidebar"
                                onClick={(e) => handlePageLayputs(classes[0])}
                              >
                                <div className="layout-img">
                                  <AddLeadSource
                                    dataClose={closeCustomizer}
                                    onUpdate={(data) => update(data)}
                                    rightSidebar={rightSidebar}
                                  />
                                </div>
                              </li>
                            </ul>
                          </TabPane>
                          <TabPane tabId="3">
                            <div id="headerheading">
                              Lead Source Information : LS<span className="First_Letter1">{lead.id}</span>
                            </div>
                            <DisplayLeadSource
                              lead={lead}
                              onUpdate={(data) => detailsUpdate(data)}
                              rightSidebar={rightSidebar}
                              dataClose={closeCustomizer}
                              openCustomizer={openCustomizer}
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

export default LeadSource;
