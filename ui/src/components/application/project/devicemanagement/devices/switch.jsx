import React, {
  Fragment,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";
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
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { Search, ModalTitle, CopyText, Cancel } from "../../../../../constant";
// import AddDistribution from "./addswitch";
// import AddOLT from "./addolt";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
// import "react-data-table-component-extensions/dist/index.css";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
// import { columns } from "../../../data/supportdb";
import DatePicker from "react-datepicker";
import { ADD_SIDEBAR_TYPES } from "../../../../../redux/actionTypes";
import { classes } from "../../../../../data/layouts";
import { tableData } from "../../../../../data/dummyTableData";
import AddSwitch from "./addswitch";

const Switch = (props, initialValues) => {
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [data, setData] = useState(tableData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
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
  }, [refresh]);

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

  const tableColumns = [
    {
      name: "ID",
      selector: "id",
      sortable: true,
    },
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "IP Address",
      selector: "ipaddress",
      sortable: true,
    },
    {
      name: "Branch",
      selector: "branch",
      sortable: true,
    },
    {
      name: "No.Of Posts",
      selector: "posts",
      sortable: true,
    },
    {
      name: "Location",
      selector: "location",
      sortable: true,
    },
    {
      name: "Status",
      selector: "status",
      sortable: true,
    },
    {
      name: "Descrption",
      selector: "descrption",
      sortable: true,
    },

    {
      name: "Lattitude",
      selector: "lattitude",
      sortable: true,
    },
    {
      name: "Longtitude",
      selector: "longtitude",
      sortable: true,
    },
  ];

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

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
                    <option value="25">GOLI SAMBASIVA RAO</option>
                    <option value="50">KAKINADA</option>
                    <option value="70">SAI PRASAD</option>
                    <option value="100">VBC ON FIBER</option>
                  </Input>
                  <Label className="placeholder_styling">Franchise</Label>
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
                    <option value="25">Branch1</option>
                    <option value="50">Branch2</option>
                    <option value="70">Branch3</option>
                    <option value="100">Branch4</option>
                  </Input>
                  <Label className="placeholder_styling">Branch</Label>
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
                    <option value="25">Olt1</option>
                    <option value="50">Olt2</option>
                    <option value="70">Olt3</option>
                    <option value="100">Olt4</option>
                  </Input>
                  <Label className="placeholder_styling">OLT</Label>
                </div>
              </FormGroup>
            </Col>
            <Col sm="3">
              <button
                class="btn btn-primary"
                type="submit"
                onClick={() => openCustomizer("3")}
                style={{ float: "right" }}
              >
                <i className="icofont icofont-plus"></i>
                &nbsp;&nbsp; Add Switch
              </button>
            </Col>
          </Row>
          <Row>
            {/* <Col md="12">
              <Col sm="12">
                <DataTable
                  data={data}
                  columns={tableColumns}
                  //   striped={true}
                  // center={true}
                  // selectableRows
                  persistTableHead
                  // contextActions={contextActions}
                  onSelectedRowsChange={handleRowSelected}
                  clearSelectedRows={toggleCleared}
                />
              </Col>
              <br />
            </Col> */}

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
                        <TabPane tabId="3">
                          <h6 style={{ textAlign: "center" }}> Add Switch </h6>
                          <ul
                            className="layout-grid layout-types"
                            style={{ border: "none" }}
                          >
                            <li
                              data-attr="compact-sidebar"
                              onClick={(e) => handlePageLayputs(classes[0])}
                            >
                              <div className="layout-img">
                                <AddSwitch />
                              </div>
                            </li>
                          </ul>
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

export default Switch;
