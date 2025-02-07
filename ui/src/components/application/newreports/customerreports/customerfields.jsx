import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import { adminaxios, servicesaxios } from "../../../../axios";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import TotalCountCustomer from "./TotalCount"

import { actstatus } from "./reportsdata";
import Modalnewreports from "./modalnewreports";
import PackagesDropDown from "./packages";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const CustomerFields = (props, initialValues) => {
  const [customerList, setCustomerList] = useState()
  const [rightSidebar, setRightSidebar] = useState(true);
  const width = useWindowSize();
  const [modal, setModal] = useState();
  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  //state for customer
  const [customer, setCustomer] = useState();
  //state for franchise
  const [franchise, setFranchise] = useState();
  //end
  //state for billig
  const [billing, setBilling] = useState();
  //end
  //state for ticket
  const [ticket, setTicket] = useState();
  //end

  const [inputs, setInputs] = useState(initialValues);
  //branch state to get all list of branches
  const [reportsbranch, setReportsbranch] = useState([]);

  // list of packages
  const [serviceReports, setServiceReports] = useState([]);
  //zone state to get list of zones based on branch search
  const [reportszone, setReportszone] = useState([]);
  //area state based on zone selection
  const [reportsarea, setReportsarea] = useState([]);
  //list of franchises
  const [franchiselist, setFranchiselist] = useState([]);
  const [searchbuttondisable, setSearchbuttondisable] = useState(true);
  const [branchdata, setBranchdata] = useState([]);

  const [allReports, setAllReports] = useState(true);
  const [areaReports, setAreaReports] = useState(false);
  const [modalReport, setModalReport] = useState(false);

  useEffect(() => {
    if (
      props.customstartdate !== undefined ||
      props.customenddate !== undefined ||
      inputs.branch !== undefined ||
      inputs.area !== undefined ||
      inputs.zone !== undefined ||
      inputs.connstatus !== undefined ||
      inputs.actstatus !== undefined ||
      inputs.franchiselistt !== undefined ||
      inputs.franchisetype !== undefined ||
      branchdata.package !== undefined ||
      inputs.paymentstatus !== undefined 
    ) {
      setSearchbuttondisable(false);
    }
  }, [props.customstartdate, props.customenddate, inputs]);

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

  const toggle = () => {
    setModal(!modal);
  };
  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
  };

  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    history.push(key);
  };

  document.addEventListener("mousedown", (event) => {
    const concernedElement = document.querySelector(".filter-container");
  });

  const daterangeselection = (e, value) => {
    if (e.target.value === "customer") {
      setCustomer(true);
      setFranchise(false);
      setBilling(false);
      setTicket(false);
    }
    if (e.target.value === "franchise") {
      setFranchise(true);
      setCustomer(false);
      setBilling(false);
      setTicket(false);
    }
    if (e.target.value === "billing") {
      setFranchise(false);
      setCustomer(false);
      setBilling(true);
      setTicket(false);
    }
    if (e.target.value === "ticket") {
      setFranchise(false);
      setCustomer(false);
      setBilling(false);
      setTicket(true);
    }
  };

  //get list of franchises
  useEffect(() => {
    adminaxios
      .get(`franchise/list`)
      .then((response) => {
        console.log(response.data);
        setFranchiselist(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  }, []);

  //end

  //get zone options based on branch selection
  const getlistofzones = (val) => {
    adminaxios
      .get(`accounts/branch/${val}/zones`)
      .then((response) => {
        console.log(response.data);
        setReportszone(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };
  //end
  //get area options based on zone
  const getlistofareas = (val) => {
    adminaxios
      .get(`accounts/zone/${val}/areas`)
      .then((response) => {
        console.log(response.data);
        setReportsarea(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };

  // branch list
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        setReportsbranch([...res.data]);
      })
      .catch((err) => console.log(err));
  }, []);

  // service list
  useEffect(() => {
    servicesaxios
      .get("plans/dropdown/nested")
      .then((res) => {
        setServiceReports([...res.data]);
      })
      .catch((err) => console.log(err));
  }, []);

  //handle change event
  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
    let val = event.target.value;

    const target = event.target;
    var value = target.value;
    const name = target.name;
    if (name == "branch") {
      getlistofzones(val);
    }
    //upon select zone display area
    if (name == "zone") {
      getlistofareas(val);
    }
  };

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }
  const box = useRef(null);

  const [showTotalAmount, setShowTotalAmount] = useState(false)

  return (
    <>
      <Container fluid={true}>
        <div className="edit-profile">
          <Row style={{ marginLeft: "-4%" }}>
            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    className="form-control-digits"
                    type="select"
                    onBlur={checkEmptyValue}
                    onChange={handleInputChange}
                    name="connstatus"
                    value={inputs && inputs.connstatus}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value=" ">All</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </Input>

                  <Label for="meeting-time" className="form_label">
                    Connection Status
                  </Label>
                </div>
              </FormGroup>
            </Col>

            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    className="form-control digits"
                    type="select"
                    onBlur={checkEmptyValue}
                    name="actstatus"
                    onChange={handleInputChange}
                    value={inputs && inputs.actstatus}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="" style={{ display: "none" }}></option>

                    {actstatus.map((status) => {
                      return <option value={status.id}>{status.name}</option>;
                    })}
                  </Input>

                  <Label for="meeting-time" className="form_label">
                    Account Status
                  </Label>
                </div>
              </FormGroup>
            </Col>

            {/* <Col sm="2">
                  <PackagesDropDown
                    data={serviceReports}
                    fieldNames={inputs.serviceReports}
                    placeholder="Packages"
                    setBranchdata={setBranchdata}
                    setServiceReports={setServiceReports}
                    setSearchbuttondisable={setSearchbuttondisable}
                  />
            </Col> */}

            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="branch"
                    className="form-control digits"
                    onChange={(event) => {
                      handleInputChange(event);
                      setAllReports(event.target.value);
                    }}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.branch}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL">All</option>
                    {reportsbranch.map((branchreport) => (
                      <>
                        <option key={branchreport.id} value={branchreport.id}>
                          {branchreport.name}
                        </option>
                      </>
                    ))}
                  </Input>
                  <Label className="form_label">Branch *</Label>
                </div>
              </FormGroup>
            </Col>

            {/* multiselect */}

            <Col sm="2" hidden={allReports === "ALL"}>
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="zone"
                    className="form-control digits"
                    onChange={(event) => {
                      handleInputChange(event);
                      setAreaReports(event.target.value);
                    }}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.zone}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL1">All</option>
                    {reportszone.map((zonereport) => (
                      <option key={zonereport.id} value={zonereport.id}>
                        {zonereport.name}
                      </option>
                    ))}
                  </Input>

                  <Label className="form_label">Zone *</Label>
                </div>
              </FormGroup>
            </Col>

            <Col sm="2" hidden={allReports === "ALL" || areaReports === "ALL1"}>
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="area"
                    className="form-control digits"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.area}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL2">All</option>
                    {reportsarea.map((areareport) => (
                      <option key={areareport.id} value={areareport.id}>
                        {areareport.name}
                      </option>
                    ))}
                  </Input>

                  <Label
                    className="form_label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Area
                  </Label>
                </div>
              </FormGroup>
            </Col>
            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    className="form-control-digits"
                    type="select"
                    onBlur={checkEmptyValue}
                    onChange={handleInputChange}
                    name="paymentstatus"
                    value={inputs && inputs.paymentstatus}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL6">All</option>
                    <option value="PD">Paid</option>
                    <option value="UPD">Unpaid</option>
                  </Input>

                  <Label for="meeting-time" className="form_label">
                   Payment Status 
                  </Label>
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm="6"></Col>
            <Col sm="6">
              <button
                style={{
                  whiteSpace: "nowrap",
                  fontSize: "medium",
                  height: "40px",
                  position: "relative",
                  left: "-110.4%",
                  top: "-62%",
                }}
                className="btn btn-primary openmodal"
                type="submit"
                onClick={() => setSearchbuttondisable(!searchbuttondisable)}
                // onClick={toggle}
                disabled={searchbuttondisable}
                id="update_button"
              >
                <span style={{ marginLeft: "-10px" }} className="openmodal">
                  &nbsp;&nbsp; Search
                </span>
              </button>
            </Col>
          </Row>
          {searchbuttondisable ? 
          <Row style={{marginLeft:"-4%"}} hidden={inputs.actstatus != "ACT"}>
            <TotalCountCustomer customerList={customerList}/>
          </Row>:""}
          <Row style={{ marginTop: "47px", marginLeft: "-3.4%" }}>
            <Col sm="12">
              <h5
                style={{
                  marginTop: "10px",
                  fontFamily: "Open Sans",
                  fontStyle: "normal",
                  fontWeight: 600,
                  fontSize: "24px",
                  lineHeight: "33px",
                }}
              >
                Customer Reports
              </h5>
            </Col>
          </Row>

          <Row style={{marginLeft:"-5%"}}>
            <Col md="12">
              {searchbuttondisable ? (
                   <Modalnewreports
                   customstartdate={props.customstartdate}
                   customenddate={props.customenddate}
                   inputs={inputs}
                   branchdata={branchdata}
                   setCustomerList={setCustomerList}
                 />
              ) : (
                ""
              )}
            </Col>
          </Row>
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
                      className="icon-close"
                      onClick={() => closeCustomizer(true)}
                    ></i>
                    <br />
                    <Modal
                      isOpen={modal}
                      toggle={toggle}
                      className="modal-body"
                      centered={true}
                      size="lg"
                      style={{ maxWidth: "78%" }}
                    >
                      <Row style={{ marginTop: "18px", marginLeft: "-99px" }}>
                        <Col sm="1"></Col>
                        <Col sm="9">
                          <h5
                            style={{
                              marginTop: "10px",

                              fontSize: "23px",
                            }}
                          >
                            Customer Reports
                          </h5>
                        </Col>

                        <Col sm="2" style={{ paddingLeft: "70px" }}>
                          <Button onClick={toggle}>Close</Button>
                        </Col>
                      </Row>

                      {/* <ModalBody>
                    <Modalnewreports
                customstartdate={props.customstartdate}
                customenddate={props.customenddate}
                inputs={inputs}
                branchdata={branchdata}
              />
                    </ModalBody> */}
                    </Modal>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* end */}
        </div>
      </Container>
    </>
  );
};

export default CustomerFields;
