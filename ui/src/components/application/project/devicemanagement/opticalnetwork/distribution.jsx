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
  CardHeader,
  Table,
  Input,
  Label,
  FormGroup,
} from "reactstrap";
import {
  Search,
  ModalTitle,
  CopyText,
  Cancel,
  Close,
  SaveChanges,
  VerticallyCentered,
} from "../../../../../constant";
import axios from "axios";
import isEmpty from "lodash/isEmpty";
// import { networkaxios } from "../../../../axios";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { networkaxios } from "../../../../../axios";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../../../redux/actionTypes";
import { classes } from "../../../../../data/layouts";
import AddDistribution from "./adddistribution";
import Dpedetails from "./dpedetails";
// import { isEmpty } from "lodash";

const Distribution = (props, initialValues) => {
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
  const [excelData, setExcelData] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  const [clearSelection, setClearSelection] = useState(false);

  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
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
            autoClose:1000
          });
          // return false;
        }
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

    // axios
    networkaxios.get("network/dpe/display").then((res) => {
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
  //update api

  const update = (newRecord) => {
    setLoading(true);
    console.log(newRecord);
    networkaxios.get("network/dpe/display").then((res) => {
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
      if (data.hardware_name.toLowerCase().search(value) != -1) return data;
    });
    setFiltereddata(result);
  };

  // delete api
  const onDelete = () => {
    let dat = { ids: isChecked };
    console.log(dat);
    fetch(`${process.env.REACT_APP_API_URL_NETWORK}/network/dpe/delete`, {
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
    // axiosBaseURL.delete("/accounts/users", {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ ids: isChecked }),
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
        <a
          onClick={() => openCustomizer("3", row)}
          style={{ cursor: "pointer", color: "blue" }}
        >
          DP00{row.id}
        </a>
      ),
      sortable: true,
    },
    {
      name: "Branch",
      selector: "nas[0].branch",
      sortable: true,
      cell: (row, index) => {
        let branch = "-";
        if (!isEmpty(row.parent_oltport)) {
          if (!isEmpty(row.parent_oltport.parent_olt)) {
            if (!isEmpty(row.parent_oltport.parent_olt.nas)) {
              branch = row.parent_oltport.parent_olt.nas["branch"];
            }
          }
        }

        return <span>{branch}</span>;
      },
    },
    {
      name: "Nas",
      selector: "nas[0].name",
      sortable: true,
      cell: (row, index) => {
        let nas = "-";
        if (!isEmpty(row.parent_oltport)) {
          if (!isEmpty(row.parent_oltport.parent_olt)) {
            if (!isEmpty(row.parent_oltport.parent_olt.nas)) {
              nas = row.parent_oltport.parent_olt.nas["name"];
            }
          }
        }

        return <span>{nas}</span>;
      },
    },
    {
      name: "Olt",
      // selector: "parent_olt[0].hardware_name",
      sortable: true,
      cell: (row, index) => {
        let hardware_Name = "-";
        if (!isEmpty(row.parent_oltport)) {
          if (!isEmpty(row.parent_oltport.parent_olt)) {
            hardware_Name = row.parent_oltport.parent_olt["hardware_name"];
          }
        }

        return <span>{hardware_Name}</span>;
      },
    },
    {
      name: "Port Name",
      // selector: "parent_olt[0].hardware_name",
      sortable: true,
      cell: (row, index) => {
        let portname = "-";
        if (!isEmpty(row.parent_oltport)) {
          portname = row.parent_oltport["port_name"];
        }

        return <span>{portname}</span>;
      },
    },
    {
      name: "Hardware Name",
      selector: "hardware_name",
      sortable: true,
    },
    {
      name: "Make",
      selector: "make",
      sortable: true,
    },
    {
      name: "Model",
      selector: "model",
      sortable: true,
    },

    {
      name: "Specification",
      selector: "specification",
      sortable: true,
    },
    {
      name: "Notes",
      selector: "notes",
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
          >
        {`${row.house_no},${row.landmark},${row.street},${row.city},${row.district},${row.state},${row.country}.${row.pincode}`},
           
          </div>
        );
      },
    },
    // {
    //   name: "Address",
    //   sortable: true,
    //   cell: (row) =>
    //     `${row.house_no},${row.landmark},${row.street},${row.city},${row.district},${row.state},${row.country}.${row.pincode}`,
    // },
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
            <Col sm="3">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="type"
                    className="form-control digits"
                  >
                    <option value=""></option>
                    <option value="25">Active</option>
                    <option value="50">Inactive</option>
                  </Input>
                  <Label className="placeholder_styling">Status</Label>
                </div>
              </FormGroup>
            </Col>
            <Col sm="3">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="type"
                    className="form-control digits"
                  >
                    <option value=""></option>
                    <option value="25">SNMP</option>
                  </Input>
                  <Label className="placeholder_styling">SNMP</Label>
                </div>
              </FormGroup>
            </Col>
            <Col sm="3">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="type"
                    className="form-control digits"
                  >
                    <option value=""></option>
                    <option value="25">API 1</option>
                    <option value="50">API 2</option>
                  </Input>
                  <Label className="placeholder_styling">Mikrotik API</Label>
                </div>
              </FormGroup>
            </Col>
            <Col sm="3">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="type"
                    className="form-control digits"
                  >
                    <option value=""></option>
                    <option value="25">Server1</option>
                    <option value="50">Serer2</option>
                  </Input>
                  <Label className="placeholder_styling">AAA Server</Label>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="8" style={{ paddingBottom: "20px" }}>
              <div role="group" class="btn-group">
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
                    }}
                  ></i>
                  &nbsp;&nbsp; New
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
                  ></i>
                  &nbsp;&nbsp; Delete
                </button>

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
                        <span>DP00{id},</span>
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
                <button class="btn btn-primary" onClick={Refreshhandler}>
                  <i
                    className="icofont icofont-refresh"
                    style={{
                      color: "white",
                      fontSize: "22px",
                      cursor: "pointer",
                    }}
                  ></i>
                  &nbsp;&nbsp;Refresh
                </button>

                <button class="btn btn-primary" type="submit">
                  <i
                    className="fa fa-filter"
                    style={{
                      color: "white",
                      fontSize: "21px",
                      cursor: "pointer",
                    }}
                  ></i>
                  &nbsp;&nbsp; Filter
                </button>
              </div>
            </Col>

            <Col md="4">
              <Form>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search With name"
                  onChange={(event) => handlesearchChange(event)}
                  ref={searchInputField}
                  style={{
                    border: "none",
                    backgroundColor: "white",
                  }}
                />
                <Search className="search-icon" />
              </Form>
            </Col>

            <Col md="12">
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
                        <TabPane tabId="2">
                          <h6 style={{ textAlign: "center" }}>Add DPE</h6>
                          <ul
                            className="layout-grid layout-types"
                            style={{ border: "none" }}
                          >
                            <li
                              data-attr="compact-sidebar"
                              onClick={(e) => handlePageLayputs(classes[0])}
                            >
                              <div className="layout-img">
                                <AddDistribution
                                  dataClose={closeCustomizer}
                                  onUpdate={(data) => update(data)}
                                  rightSidebar={rightSidebar}
                                />
                              </div>
                            </li>
                          </ul>
                        </TabPane>
                        <TabPane tabId="3">


                            <Dpedetails
                              lead={lead}
                              onUpdate={(data) => detailsUpdate(data)}
                            dataClose={closeCustomizer}
                            rightSidebar={rightSidebar}

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
      </Container>
    </Fragment>
  );
};

export default Distribution;
