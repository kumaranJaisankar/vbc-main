import React, {
  Fragment,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import Skeleton from "react-loading-skeleton";
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
 Dropdown,DropdownMenu,DropdownToggle,
  ModalBody,Input
} from "reactstrap";
import {
  ModalTitle,
  CopyText,
  Cancel,
  Close,
} from "../../../constant";
import { Search } from "react-feather";
import {franchiseaxios} from "../../../axios";
// import AddBranch from './addbranch'
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
// import { columns } from "../../../data/supportdb";
import DatePicker from "react-datepicker";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import { classes } from "../../../data/layouts";
import AddVendor from "./addvendor";
import Requeststockitem from "./requeststockitem";
import ManageStock from "./managestock";
const Vendor = (props, initialValues) => {
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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  const [clearSelection, setClearSelection] = useState(false);
  const Verticalcentermodaltoggle = () => {

  if( Verticalcenter == true ){
    setIsChecked([])
    setClearSelection(true);
  }

  if(isChecked.length > 0) {
    setVerticalcenter(!Verticalcenter);
    
  }else {
    toast.error('Please select any record', {
      position: toast.POSITION.TOP_RIGHT,
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
 

    franchiseaxios
      .get(`franchise/role/create`)
      // .then((res) => setData(res.data))
      .then((res) => {
        setData(res.data);
        console.log(res.data);
        setFiltereddata(res.data);
        setLoading(false);
        setRefresh(0);
      });
  }, [refresh]);

  useEffect(() => {
    setExportData({
      ...exportData,
      data: filteredData,
    });
  }, [filteredData]);

  const update = (newRecord) => {
    setLoading(true);
    console.log(newRecord);
    franchiseaxios
      .get(`franchise/role/create`)
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
    console.log(updatedata);
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
      console.log(data);
      if (
        data.name.toLowerCase().search(value) != -1 
      )
        return data;
    });
    setFiltereddata(result);
  };

  // delete api
  const onDelete = () => {
    let dat = { ids: isChecked };
    fetch(`${process.env.REACT_APP_API_URL_FRANCHISE}/franchise/role/delete`, {
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
        console.log(filteredData);

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

    console.log(rows);
  };

  const toggle = () => {
    setModal(!modal);
  };
  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
  };
  const openCustomizer = (type, id) => {
    console.log(id);
    if (id) {
      setLead(id);
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
          <a onClick={() => openCustomizer("3", row)}  >I{row.id}</a>
        ),
      sortable: true,
    },
    {
      name: "Vendor Name",
      selector: "name",
      sortable: true,
    },
    // {
    //   name: "Request Date",
    //   selector: "name",
    //   sortable: true,
    // },
    {
      name: "Stock Created By",
      selector: "name",
      sortable: true,
    },
    {
      name: "Request By",
      selector: "name",
      sortable: true,
    },


  ];
  const [exportData, setExportData] = useState({
    columns: columns,
    exportHeaders: [],
  });

  return (
    <Fragment>
      
      <br />
      <Container fluid={true}>
        <div className="edit-profile">
          <Row>
            <Col md="12"  style={{ paddingBottom: "70px", borderRadius: "10%" }}>
            <div
                style={{
                  display: "flex",
                  padding: "20px",
                  // borderBottom: "1px solid lightgray",
                  paddingLeft: "0px",
                  paddingTop: "0",
                }}
              >
              <button
                  style={{
                    whiteSpace: "nowrap",
                    marginRight: "15px",
                    fontSize: "medium",
                  }}
                  class="btn btn-primary"
                  type="submit"
                  onClick={() => openCustomizer("4")}
                >
                  <span style={{ marginLeft: "-10px" }}>&nbsp;&nbsp; Request Stock  </span>
                  <i
                    className="icofont icofont-plus"
                    style={{
                      paddingLeft: "10px",
                      cursor: "pointer",
                    }}
                  ></i>
                </button>
            
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
                  <span style={{ marginLeft: "-10px" }}>&nbsp;&nbsp; Add Stock </span>
                  <i
                    className="icofont icofont-plus"
                    style={{
                      paddingLeft: "10px",
                      cursor: "pointer",
                    }}
                  ></i>
                </button>
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
                        fontSize: "medium",
                        width: "160px",
                        borderRadius: "5%",
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
                      <span
                        className="dropdown-bg"
                        id="dropdown-bg-important"
                        style={{
                          cursor: "pointer",
                          position: "relative",
                          top: "2px",
                        }}
                      >
                        &nbsp;&nbsp; Export
                      </span>
                      <img
                        style={{
                          position: "relative",
                          left: "15px",
                        }}
                        src={require("../../../assets/images/downarrow.svg")}
                      />
                    </button>
                  </DropdownToggle>
                  <DropdownMenu
                    className="export-dropdown-list-container"
                    style={{ left: "4px" }}
                  >
                    <ul
                      className="header-level-menuexport"
                      style={{ textAlign: "center" }}
                    >
                      <li
                        style={{
                          borderBottom: "1px solid #d0d0d0",
                        }}
                        onClick={() => {
                          // downloadExcelFile(
                          //   filteredData,
                          //   "excel",
                          //   headersForExportFile
                          // );
                          // toggleDropdown();
                          // handleExportDataModalOpen("excel");
                        }}
                      >
                        <span style={{ padding: "6px" }}>export as .xls</span>
                      </li>
                      <li
                        onClick={() => {
                          // downloadExcelFile(
                          //   filteredData,
                          //   "csv",
                          //   headersForExportFile
                          // );
                          // toggleDropdown();
                          // handleExportDataModalOpen("csv");
                        }}
                      >
                        <span style={{ padding: "6px" }}>export as .csv</span>
                      </li>
                    </ul>
                  </DropdownMenu>
                </Dropdown>
             
                <button
                  style={{
                    whiteSpace: "nowrap",
                    marginRight: "15px",
                    fontSize: "medium",
                  }}
                  class="btn btn-primary"
                  type="submit"
                  onClick={() => openCustomizer("5")}
                >
                  <span style={{ marginLeft: "-10px" }}>&nbsp;&nbsp; Manage Stock</span>
                  <i
                    className="icofont icofont-plus"
                    style={{
                      paddingLeft: "10px",
                      cursor: "pointer",
                    }}
                  ></i>
                </button>
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
                  >
                    <i
                      className="icofont icofont-ui-delete"                      
                      // {VerticallyCentered}
                    ></i>
                    <span
                      style={{
                        cursor: "pointer",
                        position: "relative",
                        top: "2px",
                      }}
                    >
                      &nbsp;&nbsp;
                    </span>
                  </button>
                </div>
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
                      <span>I{id},</span>
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
                              placeholder="Search With name "
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
                        <DataTable
                          columns={columns}
                          data={filteredData}
                          noHeader
                          // striped={true}
                          // center={true}
                          // clearSelectedRows={clearSelectedRows}

                          selectableRows
                          onSelectedRowsChange={({ selectedRows }) =>
                            deleteRows(selectedRows)
                          }
                          clearSelectedRows={clearSelectedRows}
                          pagination
                          noDataComponent={"No Data"}
                          clearSelectedRows={clearSelection}
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
                <div className="customizer-contain">
                  <div className="tab-content" id="c-pills-tabContent">
                    <div
                      className="customizer-header"
                      style={{ padding: "0px", border: "none" }}
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
                        <TabPane tabId="1">
                          <h6 style={{ textAlign: "center" }}>Filters</h6>
                          {/* <MyLeads
                            onUpdate={(data) => filterUpdate(data)}
                            ref={searchInputField}
                          /> */}
                        </TabPane>
                        <TabPane tabId="2">
                          <h6 style={{ textAlign: "center" }}>Add Stock</h6>
                          <ul
                            className="layout-grid layout-types"
                            style={{ border: "none" }}
                          >
                            <li
                              data-attr="compact-sidebar"
                              onClick={(e) => handlePageLayputs(classes[0])}
                            >
                              <div className="layout-img">
                                <AddVendor
                                  dataClose={closeCustomizer}
                                  onUpdate={(data) => update(data)}
                                  rightSidebar={rightSidebar}
                                />
                              </div>
                            </li>
                          </ul>
                        </TabPane>
                        {/* <TabPane tabId="3">
                          <VendorDetails
                            lead={lead}
                            onUpdate={(data) => detailsUpdate(data)}
                            rightSidebar={rightSidebar}
                            dataClose={closeCustomizer}
                          />
                        </TabPane> */}
                        <TabPane tabId="4">
                        <h6 style={{ textAlign: "center" }}>Add Request Stock </h6>
                          <Requeststockitem />
                        </TabPane>
                        <TabPane tabId="5">
                        <h6 style={{ textAlign: "center" }}>Manage Stock </h6>
                          <ManageStock/>
                        </TabPane>
                      </TabContent>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
};

export default Vendor;

