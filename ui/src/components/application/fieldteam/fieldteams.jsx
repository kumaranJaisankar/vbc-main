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
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  TabContent,
  TabPane,
  Nav,
  NavLink,
  ModalBody,
} from "reactstrap";
import {
  ModalTitle,
  CopyText,
  Cancel,
  Close,
} from "../../../constant";
import axios from "axios";

import { staffaxios } from "../../../axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
// import DataTableExtensions from "react-data-table-component-extensions";
import Map from "./MapContainer/Map";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import { classes } from "../../../data/layouts";
import AddFieldTeam from "./addfieldteam";
import Visit from "./visit";
import Devicestatus from "./devicestatus";

const Fieldteam = (props, initialValues) => {
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
        autoClose: 1000
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
    axios
      .get("http://fbba-223-184-2-115.ngrok.io/emp/create/list")
      // staffaxios
      //   .get(`emp/create/list`)
      // .then((res) => setData(res.data))
      .then((res) => {
        setData(res.data);
        console.log(res.data);
        setFiltereddata(res.data);
        setLoading(false);
        setRefresh(0);
      });
  }, [refresh]);
  //filtering data by making a backup
  useEffect(() => {
    if (data) {
      setData(data);
      setFiltereddataBkp(data);
      console.log(data);
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
    console.log(newRecord);
    staffaxios
      .get(`emp/create/list`)
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
      if (data.name.toLowerCase().search(value) != -1) return data;
    });
    setFiltereddata(result);
  };

  // delete api
  const onDelete = () => {
    let dat = { ids: isChecked };
    console.log(dat);

    fetch(
      `${process.env.REACT_APP_API_URL_ADMIN}/accounts/branch/multiple/delete/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
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
      name: "Track",
      sortable: true,
      cell: (row) => (
        <div>
          <i
            className="fa fa-map-marker"
            style={{ fontSize: "20px" }}
            onClick={() => openCustomizer("6")}
          ></i>
          &nbsp;&nbsp;
        </div>
      ),
    },
    {
      name: "ID",
      selector: "id",
      cell: (row) => (
        <a
          onClick={() => openCustomizer("3", row)}
        >
          F00{row.id}
        </a>
      ),
      sortable: true,
    },

    {
      name: "Field Staff",
      selector: "user.username",
      sortable: true,
    },
    {
      name: "Email",
      selector: "user.email",
      sortable: true,
    },
    {
      name: "Mob No",
      selector: "mobile",
      sortable: true,
    },
    {
      name: "Visits",
      cell: (row) => (
        <div>
          <i
            className="fa fa-calendar"
            style={{ fontSize: "20px" }}
            onClick={() => openCustomizer("4", row)}
          ></i>
          &nbsp;&nbsp;
          <i
            className="fa fa-gear"
            style={{ fontSize: "20px" }}
            onClick={() => openCustomizer("5")}
          ></i>
          &nbsp;&nbsp;
        </div>
      ),
      sortable: true,
    },
    {
      name: "Modules",
      selector: "modules",
      sortable: true,
      cell: (row) => {
        const module = row.modules.map((list) => list.name);
        return <span>{module.join(",")}</span>;
      },
    },
    {
      name: "Designation",
      selector: "designation",
      sortable: true,
    },
    {
      name: "Notes",
      selector: "notes",
      sortable: true,
    },

    {
      name: "Zone",
      selector: "zone",
      sortable: true,
    },
    {
      name: "Work location",
      selector: "branch",
      sortable: true,
    },


    {
      name: "Created At",
      selector: "created",
      sortable: true,
    },
    {
      name: "Modified At",
      selector: "modified",
      sortable: true,
    },
    {
      name: "Created By",
      selector: "created_by.username",
      sortable: true,
    },
    {
      name: "Modified By",
      selector: "modified_by.username",
      sortable: true,
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
          //   setImportDivStatus(true);
        }
      }
    }
  });

  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <div className="edit-profile">
          <Row style={{ marginTop: '-2%' }}>
            <Col md="10">
              <div role="group" class="btn-group">
                {/* <button
                      class="btn btn-primary"
                      type="submit"
                      onClick={() => openCustomizer("3")}
                    >
                      <i
                        className="icofont icofont-plus"
                        style={{
                          color: "white",
                          fontSize: "21px",
                          cursor: "pointer",
                        }}
                      ></i>
                      &nbsp;&nbsp; details
                    </button> */}

                <button
                  class="btn btn-primary"
                  type="submit"
                  onClick={() => openCustomizer("2")}
                >
                  <i
                    className="icofont icofont-plus"
                    style={{
                      color: "white",
                      fontSize: "21px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  ></i>
                  &nbsp;&nbsp; Field Staff
                </button>

                <button class="btn btn-primary" onClick={Refreshhandler}>
                  <i
                    className="icofont icofont-refresh"
                    style={{
                      color: "white",
                      fontSize: "22px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  ></i>
                  &nbsp;&nbsp;Refresh
                </button>

                <button class="btn btn-primary">
                  <i
                    className="icon-share"
                    style={{
                      color: "white",
                      fontSize: "22px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  ></i>
                  &nbsp;&nbsp;Export
                </button>

                <button
                  class="btn btn-primary"
                  onClick={Verticalcentermodaltoggle}
                >
                  <i
                    className="icofont icofont-ui-delete"
                    style={{
                      color: "white",
                      fontSize: "21px",
                      cursor: "pointer",
                    }}
                  // {VerticallyCentered}
                  ></i>
                  &nbsp;&nbsp; Delete
                </button>

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
                        <span>B00{id},</span>
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
                <Col
                  className="left-header horizontal-wrapper pl-0"
                  style={{ display: "contents" }}
                >
                  <li
                    className="level-menu outside"
                    style={{ display: "block" }}
                  >
                    <button
                      class="btn btn-primary nav-link"
                      onClick={() => OnLevelMenu(levelMenu)}
                      style={{
                        marginLeft: 0,
                        borderRadius: 0,
                        color: "white",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <i
                        className="icon-filter"
                        style={{
                          color: "white",
                          fontSize: "22px",
                          cursor: "pointer",
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                        }}
                      ></i>
                      &nbsp;&nbsp;Filter
                    </button>
                    {/* export */}
                  </li>
                </Col>
              </div>
            </Col>

            {/* <Col md="4">
              <Form>
               
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search with name or email or mobile "
                  onChange={(event) => handlesearchChange(event)}
                  ref={searchInputField}
                  style={{
                    border: "none",
                    backgroundColor: "white",
                  }}
                />
                <Search className="search-icon" />
               
              </Form>
            </Col> */}

            <Col md="12" style={{ marginTop: "2%" }}>
              <Card style={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}>
                <Col xl="12">
                  <nav aria-label="Page navigation example">
                    {loading ? (
                      <Skeleton
                        count={11}
                        height={30}
                        style={{ marginBottom: "10px", marginTop: "15px" }}
                      />
                    ) : (
                      <div>
                        <DataTable
                          columns={columns}
                          data={filteredData}
                          noHeader
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
                      <i className="icon-close" onClick={closeCustomizer}></i>

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
                          <h6 style={{ textAlign: "center" }}> Add User </h6>
                          <ul
                            className="layout-grid layout-types"
                            style={{ border: "none" }}
                          >
                            <li
                              data-attr="compact-sidebar"
                              onClick={(e) => handlePageLayputs(classes[0])}
                            >
                              <div className="layout-img">
                                <AddFieldTeam
                                  dataClose={closeCustomizer}
                                  onUpdate={(data) => update(data)}
                                  rightSidebar={rightSidebar}
                                />
                              </div>
                              {/* <Map  /> */}

                            </li>
                          </ul>
                        </TabPane>
                        <TabPane tabId="3">
                          {/* <BranchDetails
                              lead={lead}
                              onUpdate={(data) => detailsUpdate(data)}
                              rightSidebar={rightSidebar}
                              dataClose={closeCustomizer}
                            /> */}
                        </TabPane>
                        <TabPane tabId="4">
                          <h6 style={{ textAlign: "center" }}>Field Visits</h6>
                          <Visit
                            lead={lead}
                            //   onUpdate={(data) => detailsUpdate(data)}
                            rightSidebar={rightSidebar}
                            dataClose={closeCustomizer}
                          />
                        </TabPane>
                        <TabPane tabId="5">
                          <h6 style={{ textAlign: "center" }}>Device Status</h6>
                          <Devicestatus
                            lead={lead}
                            //   onUpdate={(data) => detailsUpdate(data)}
                            rightSidebar={rightSidebar}
                            dataClose={closeCustomizer}
                          />
                        </TabPane>
                        <TabPane tabId="6">
                          <h6 style={{ textAlign: "center" }}>Track</h6>
                          <Row>
                            <Col>
                              <Map />
                            </Col>
                          </Row>
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

export default Fieldteam;
