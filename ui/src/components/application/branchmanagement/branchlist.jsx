import React, {
  Fragment,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import Skeleton from "react-loading-skeleton";
import moment from "moment";
// import Breadcrumb from "../../layout/breadcrumb";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  TabContent,
  TabPane,
  ModalBody,
  Input,
} from "reactstrap";
import { Search } from 'react-feather';
import { Close, ModalTitle, CopyText, Cancel } from "../../../constant";
import { adminaxios, franchiseaxios } from "../../../axios";

// import { FranchiseFilterContainer } from "./franchisefilter/FranchiseFilterContainer";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { downloadExcelFile ,downloadPdf} from "../franchise/Export"

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout_From_Firebase } from "../../../utils";
import PermissionModal from "../../common/PermissionModal";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import { classes } from "../../../data/layouts";
import AddBranchManagement from "./branchmanagementtadd";
import { AllBranchDetails } from "./branchmanagementdetails/allbranchdetails";
import { BRANCH } from "../../../utils/permissions";

var storageToken = localStorage.getItem("token");
var tokenAccess="";
 if (storageToken !== null) {
  var token = JSON.parse(storageToken) ;
  var tokenAccess = token?.access;
}

const BranchList = (props, initialValues) => {
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState([]);
  const width = useWindowSize();

  //exportData
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const [modal, setModal] = useState();
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [failed, setFailed] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
   // draft
   const [isDirty, setIsDirty] = useState(false);
   const [isDirtyModal, setisDirtyModal] = useState(false);
   const [formDataForSaveInDraft, setformDataForSaveInDraft]= useState({});
   const [permissionModalText, setPermissionModalText] = useState(
    "You are not authorized for this action"
  );
  //filter show and hide menu
  const [levelMenu, setLevelMenu] = useState(false);
  //taking backup for original data
  const [filteredDataBkp, setFiltereddataBkp] = useState(data);
   //modal state for insufficient permissions
   const [permissionmodal, setPermissionModal] = useState();

  const [franchiseType, setFranchiseType] = useState([]);
  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
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
        autoClose:1000
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

    // list of franchise api
    adminaxios
      .get(`accounts/branch/list`)
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
          setPermissionModalText("Something went wrong !");
          permissiontoggle();
        } else if (code === "In-valid token. Please login again" || detail === "In-valid token. Please login again") {
          logout();
        } else {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
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

  // new records update in table

  const update = (newRecord) => {
    Refreshhandler();
    setData([...data, newRecord]);
    // setFiltereddata([...data, newRecord]);
    setFiltereddata((prevFilteredData) => [newRecord, ...prevFilteredData]);
    closeCustomizer(false);
  };

  // edit details update function

  const detailsUpdate = (updatedata) => {
    Refreshhandler();
    setData([...data, updatedata]);
    // setFiltereddata((prevFilteredData) => [...prevFilteredData, updatedata]);
    setFiltereddata((prevFilteredData) =>
      prevFilteredData.map((data) =>
        data.id == updatedata.id ? updatedata : data
      )
    );
    closeCustomizer(false);
  };

  //   //filter
  const handlesearchChange = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = data.filter((data) => {
      console.log(data);
      if (
        data.name.toLowerCase().search(value) != -1 ||
        data.code.toLowerCase().search(value) != -1
      )
        return data;
    });
    setFiltereddata(result);
  };

  // delete api for multiple rows in franchise list
  const onDelete = () => {
    let dat = { ids: isChecked };
    fetch(
      `${process.env.REACT_APP_API_URL_FRANCHISE}/franchise/delete/multiple`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${tokenAccess}`,
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
const closeCustomizer = (value) => {
    // draft
    if(isDirty && value){
      setisDirtyModal(true);
    }else{
      closeDirtyModal()
    }
  };

  const openCustomizer = (type, id) => {
    if (id) {
      setLead(id);
    }
    // draft store value
    const getLocalDraftKey = localStorage.getItem('franchiseDraftSaveKey');
    if(!!getLocalDraftKey){
      const getLocalDraftData = localStorage.getItem(getLocalDraftKey);
      setLead(JSON.parse(getLocalDraftData));
    }
    setActiveTab1(type);
    setRightSidebar(!rightSidebar);
    if (rightSidebar) {
      document.querySelector(".customizer-contain").classList.add("open");

      // document.querySelector(".customizer-links").classList.add('open');
    }
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
    {
      name: "ID",
      selector: "id",
      cell: (row) => (
        <>
        {token.permissions.includes(BRANCH.READ) ? (
 <a
 onClick={() => openCustomizer("3", row)}
 
>
 B{row.id}
</a>
        ):(
          <span>B{row.id}</span>
        )}
        </>
       
      ),
      sortable: true,
    },

    {
      name: "Name",
      selector: "name",
      
      sortable: true,
    },
    
    {
      name: "Address",
      sortable: true,
      cell: (row) => {
        return (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >{getAddress(row)}</div>
        );
      },
    },
    {
      name: "Created At",
      selector: "created_at",
      cell: (row) => (
        <span className="digits" style={{ textTransform: "initial" }}>
          {" "}
          {moment(row.created_at).format("l")}
        </span>
      ),
      sortable: true,
    },
  
  ];
  const [exportData, setExportData] = useState({
    columns: columns,
    exportHeaders: [],
  });


// address
  const getAddress = (row) => {
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

  //filter show and hide level menu
  const OnLevelMenu = (menu) => {
    setLevelMenu(!menu);
  };

  //filtering data by making a backup
  useEffect(() => {
    if (data) {
      setData(data);
      setFiltereddataBkp(data);
      // setFiltereddata(data);
    }
  }, [data]);

  //dynamic options
  useEffect(() => {
    //franchiselist
    franchiseaxios
      .get("/franchise/options")
      .then((res) => {
        let { type } = res.data;
        setFranchiseType([...type]);
      })
      .catch((err) => console.log(err));
  }, []);

  //export
  const headersForExportFile = [
   
    ["all", "All"],
    ["id", "ID"],
    ["user_name", "user Name"],
    ["franchise_code", "Franchise code"],
    ["franchise_name", "Franchise name"],
    ["role", "Role"],
    ["type", "Type"],
    ["address", "Address"],
    ["revenue_sharing", "Revenue sharing"],
    ["status", "Status"],
    ["renewal_bal", "Renewal bal"],
    ["outstanding_bal", "Outstanding bal"],
    ['sms_gateway_type', "SMS gateway type"],
    ["sms_balance", "SMS balance"],
    ["created_at", "Created at"],
    ["updated_at", "Updated at"]
  ];

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

  const [isExportDataModalOpen, setIsExportDataModalToggle] = useState(false);
  const [downloadableData, setDownloadableExcelData] = useState([]);
  const [filteredDataForModal, setFilteredDataForModal] =
    useState(filteredData);
  const [downloadAs, setDownloadAs] = useState("");
  const [headersForExport, setHeadersForExport] = useState([]);


  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      if(event.target.defaultValue ==='all'){
        let allKeys = headersForExportFile.map(h=>h[0]);
        setHeadersForExport(allKeys);
      }else{
        let  list = [...headersForExport];
        list.push(event.target.defaultValue);
        setHeadersForExport(list);
      }
    } else {
      if(event.target.defaultValue ==='all'){
       
        setHeadersForExport([]);
      }else{
        let removedColumnFromHeader = headersForExport.filter(
          (item) => item !== event.target.defaultValue
        );
        setHeadersForExport(removedColumnFromHeader);
      }

    }
  };

  const handleExportDataModalOpen = (downloadAs) => {
    setIsExportDataModalToggle(!isExportDataModalOpen);
    setDownloadableExcelData(filteredData);
    setDownloadAs(downloadAs);
  };
  const handleExportDataAsPDF = (headersForPDF) => {
    setIsExportDataModalToggle(!isExportDataModalOpen);
    const title = `All Franchise`;
    downloadPdf(title, headersForPDF, filteredData , "Franchise");
  };

  const handleDownload = () => {
    const headers = headersForExport.filter((header) => header !== "all");
    const headersForPDF = headersForExportFile.filter( h => headers.includes(h[0]) && h );
    if(downloadAs === "pdf"){
      handleExportDataAsPDF(headersForPDF);
    }
    else{
      downloadExcelFile(downloadableData, downloadAs, headers);
    }
    toggleDropdown();
    setHeadersForExport([]);
    setFilteredDataForModal(filteredData);
    setIsExportDataModalToggle(false);
  };

//modal for insufficient modal
const permissiontoggle = () => {
  setPermissionModal(!permissionmodal);
};
//end


   //draft start
   const saveDataInDraftAndCloseModal =()=>{

    localStorage.setItem('franchise/', JSON.stringify(formDataForSaveInDraft));
    localStorage.setItem('franchiseDraftSaveKey', 'franchise/');

    setisDirtyModal(false);
    setRightSidebar(!rightSidebar);
    document
      .querySelector(".customizer-contain")
      .classList.remove("open");
      setIsDirty(false)
  }

  const setIsDirtyFun = (val) => {
    setIsDirty(val);
  };
const closeDirtyModal = ()=>{
    setisDirtyModal(false);
    setRightSidebar(!rightSidebar);
    document
      .querySelector(".customizer-contain")
      .classList.remove("open");
      localStorage.removeItem('franchise/');
      localStorage.removeItem('franchiseDraftSaveKey');
      setIsDirty(false)
      setLead({});
  }

  // draft end
  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <div className="edit-profile">
          <Row>
            <Col md="12" style={{ paddingBottom: "70px", borderRadius: "10%" }}>
              <div
                style={{
                  display: "flex",
                  padding: "20px",
                  // borderBottom: "1px solid lightgray",
                  paddingLeft: "0px",
                  paddingTop: "0",
                }}
              >
                {token.permissions.includes(BRANCH.CREATE) && (
 <button
 style={{
   whiteSpace: "nowrap",
   marginRight: "15px",
   fontSize: "medium",
 }}
 class="btn btn-primary"
 type="submit"
 onClick={() => openCustomizer("2")}
>
 <span style={{ marginLeft: "-10px" }}>&nbsp;&nbsp; New Branch</span>
 <i
   className="icofont icofont-plus"
   style={{
     paddingLeft: "10px",
     cursor: "pointer",
   }}
 ></i>
</button>
                )}
               

                <button
                  style={{
                    whiteSpace: "nowrap",
                    marginRight: "15px",
                    fontSize: "medium",
                  }}
                  class="btn btn-secondary"
                  onClick={Refreshhandler}
                >
                  <img src={require("../../../assets/images/Refresh.svg")} />
                  <span
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      top: "2px",
                    }}
                  >
                    &nbsp;&nbsp; Refresh
                  </span>
                </button>
{/*                

                <Dropdown
                  isOpen={dropdownOpen}
                  toggle={toggleDropdown}
                  className="export-dropdown"
                >
                  <DropdownToggle tag="span" aria-expanded={dropdownOpen}>
                  <button
                  style={{
                    whiteSpace: "nowrap",
                    marginRight: "15px",
                    fontSize:"medium",
                    width: "160px",
                    borderRadius: "5%"
                  }}
                  class="btn btn-secondary"
                 
                >
                  <img src={require("../../../assets/images/export.svg")} />
                  <style>
                  {`
                  #dropdown-bg-important {
                  background-color: transparent !important;
                  }
                  `}
                  </style>
                  <span className="dropdown-bg" id="dropdown-bg-important" style={{cursor: "pointer",     
                  position: "relative",
                  top: "2px"}}>&nbsp;&nbsp; Export</span>
                  <img style={{
                    position: "relative",
                    left: "15px"
                  }} src={require("../../../assets/images/downarrow.svg")} />                
                </button>
                  </DropdownToggle>
                  <DropdownMenu className="export-dropdown-list-container" style={{left: "4px"}}>
                    <ul className="header-level-menuexport" style={{textAlign: "center"}}>
                      <li
                      style={{
                        borderBottom: "1px solid #d0d0d0"
                      }}
                        onClick={() => {
                          handleExportDataModalOpen("excel");
                        }}
                      >
                        <span style={{padding:"6px"}}>export as .xls</span>
                      </li>
                      <li
                        onClick={() => {
                          handleExportDataModalOpen("csv");
                        }}
                      >
                        <span style={{padding:"6px"}}>export as .csv</span>
                      </li>
                      <li
                        onClick={() => {
                          handleExportDataModalOpen("pdf");
                        }}
                      >
                        <span style={{ padding: "6px" }}>export as .pdf</span>
                      </li>
                    </ul>
                  </DropdownMenu>
                </Dropdown> */}

                <Modal
                  isOpen={isExportDataModalOpen}
                  toggle={() => {
                    setIsExportDataModalToggle(!isExportDataModalOpen);
                    setFilteredDataForModal(filteredData);
                  }}
                  centered
                >
                  <ModalHeader
                    toggle={() => {
                      setIsExportDataModalToggle(!isExportDataModalOpen);
                      setFilteredDataForModal(filteredData);
                    }}
                  >
                    Confirmation
                  </ModalHeader>
                  <ModalBody>
                  
                    <div>
                      {headersForExportFile.map((column, index) => (
                        <span style={{ display: "block" }}>
                          <label for={column[1]} key={`${column[1]}${index}`}>
                            <input
                              value={column[0]}
                              onChange={handleCheckboxChange}
                              type="checkbox"
                              name={column[1]}
                              checked={headersForExport.includes(column[0])}

                            />
                            &nbsp; {column[1]}
                          </label>
                        </span>
                      ))}
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="secondary"
                      onClick={() => setIsExportDataModalToggle(false)}
                    >
                      {Close}
                    </Button>
                    <Button color="primary" onClick={() => handleDownload()}
                    disabled={headersForExport.length > 0 ? false : true}>
                      Download
                    </Button>
                  </ModalFooter>
                </Modal>
{token.permissions.includes(BRANCH.FILTERS) && (
  <Col
                  className="left-header horizontal-wrapper pl-0"
                  style={{ display: "contents" }}
                >
                  <li
                    className="level-menu outside"
                    style={{ display: "block" }}
                  >
                  <button
                  style={{
                    whiteSpace: "nowrap",
                    marginRight: "15px",
                    fontSize:"medium"
                  }}
                  class="btn btn-secondary"
                  onClick={() => OnLevelMenu(levelMenu)}
                >
                  <img src={require("../../../assets/images/morefilters.svg")} />
                  <span style={{cursor: "pointer",     
                  position: "relative",
                  top: "2px"}}>&nbsp;&nbsp; More Filters</span>
                  <img style={{
                    position: "relative",
                    left: "15px"
                  }} src={require("../../../assets/images/downarrow.svg")} />               
                </button>
                  </li>
                </Col>
)}
                
                {/* <FranchiseFilterContainer
                  levelMenu={levelMenu}
                  setLevelMenu={setLevelMenu}
                  filteredData={filteredData}
                  setFiltereddata={setFiltereddata}
                  filteredDataBkp={filteredDataBkp}
                  loading={loading}
                  setLoading={setLoading}
                  showTypeahead={false}
                  franchiseType={franchiseType}
                /> */}
                <div className="edit-delete-button-wrapper">
                <button
                    style={{
                      whiteSpace: "nowrap",
                      marginRight: "15px",
                      fontSize: "medium",
                      width: "0px",
                    }}
                    class="btn btn-secondary"
                    onClick={Verticalcentermodaltoggle}
                    disabled={true}
                  >
                    <i
                      className="icofont icofont-ui-delete"                      
                      // {VerticallyCentered}
                    ></i>
                    
                  </button>
                </div>
              </div>
            </Col>

            <Col md="12">
              <Card style={{ borderRadius: "0" }}>
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
                        <Col md="8">
                          <Form>
                            <div
                              className="search_iconbox"
                              style={{
                                borderRadius: "3px",
                              }}
                            >
                              <Input
                                className="form-control"
                                type="text"
                                placeholder="Search With Branch code"
                                onChange={(event) => handlesearchChange(event)}
                                ref={searchInputField}
                                style={{
                                  border: "none",
                                  backgroundColor: "white",
                                }}
                              />

                              <Search
                                className="search-icon"
                                style={{
                                  border: "none",
                                  position: "absolute",
                                  right: "1.5rem",
                                  color: "#3B3B3B",
                                }}
                              />
                            </div>
                          </Form>
                        </Col>
                        {token.permissions.includes(BRANCH.LIST) ?
                        <DataTable
                          columns={columns}
                          data={filteredData}
                          noHeader
                          // selectableRows
                          onSelectedRowsChange={({ selectedRows }) =>(
                            
                          handleSelectedRows(selectedRows),
                          deleteRows(selectedRows)
                        )
                          }
                          clearSelectedRows={clearSelectedRows}
                          pagination
                          noDataComponent={"No Data"}
                          // clearSelectedRows={clearSelection}
                        />:(<p style={{textAlign: "center" }}>{"You have insufficient permissions to view this"}</p>)}
                      </div>
                    )}
                  </nav>
                </Col>
                <br />
              </Card>
            </Col>

            <Row>
              <Col md="12">
              <div className="customizer-contain"
              style={{
                borderTopLeftRadius: "20px",
                borderBottomLeftRadius: "20px",
              }}>
                  <div className="tab-content" id="c-pills-tabContent">
                    <div
                      className="customizer-header"
                      style={{
                        border: "none",
                        backgroundColor: "#FFE1D0",
                        borderTopLeftRadius: "20px",
                      }}
                    >
                      <br />
                      <i className="icon-close" onClick={()=>closeCustomizer(true)}></i>
                      <br />
                      
                      <Modal
                        isOpen={modal}
                        toggle={toggle}
                        className="modal-body"
                        centered={true}
                      >
                        <ModalHeader toggle={toggle}>{ModalTitle}</ModalHeader>
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
                        <div id="headerheading" > Branch Management </div>
                          <ul
                            className="layout-grid layout-types"
                            style={{ border: "none" }}
                          >
                            <li
                              data-attr="compact-sidebar"
                              onClick={(e) => handlePageLayputs(classes[0])}
                            >
                              <div className="layout-img">
                                <AddBranchManagement
                                  dataClose={closeCustomizer}
                                  onUpdate={(data) => update(data)}
                                  rightSidebar={rightSidebar}
                                   // draft
                                   setIsDirtyFun={setIsDirtyFun}
                                   setformDataForSaveInDraft={setformDataForSaveInDraft}
                                   lead={lead}
                                />
                              </div>
                            </li>
                          </ul>
                        </TabPane>
                        <TabPane tabId="3">
                        <div id="headerheading" >  Bracnch Information : B{lead.id}</div>
                          {/* <FranchiseDetails
                            lead={lead}
                            onUpdate={(data) => detailsUpdate(data)}
                            rightSidebar={rightSidebar}
                            dataClose={closeCustomizer}
                          /> */}
                           <AllBranchDetails
                            lead={lead}
                            onUpdate={(data) => detailsUpdate(data)}
                            rightSidebar={rightSidebar}
                            dataClose={closeCustomizer}
                            detailsUpdate={detailsUpdate}

                          />
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
                      <span>F{id},</span>
                    ))}
                  </div>
                  <p>Are you sure you want to delete?</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" onClick={Verticalcentermodaltoggle}>
                    No
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
{/* Sailaja Changed close button Styles (Line Number 1023)on 13th July */}

                <Button id ="resetid" onClick={() => closeDirtyModal()}>
                  {"Close"}
                </Button>
              </ModalFooter>
            </Modal>
            {/* draft modal end */}
            </Row>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
};

export default BranchList;
