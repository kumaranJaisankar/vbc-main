import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Input,
  FormGroup,
  ModalBody,
  Label,
} from "reactstrap";
import { adminaxios, billingaxios, customeraxios } from "../../../../axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import BillingModalnewreports from "./billingmodal";
import Showledger from "./showledger";
import TotalCountInovice from "./Total"
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const InoviceReports = (props) => {
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

  const [inputs, setInputs] = useState({});
  //branch state to get all list of branches
  const [reportsbranch, setReportsbranch] = useState([]);
  //zone state to get list of zones based on branch search
  const [reportszone, setReportszone] = useState([]);
  //area state based on zone selection
  const [reportsarea, setReportsarea] = useState([]);
  //list of franchises
  const [franchiselist, setFranchiselist] = useState([]);
  const [searchbuttondisable, setSearchbuttondisable] = useState(true);
  const [reportcustomer, setReportCustomer] = useState([]);
  const [payment, setPayment] = useState([]);
  const [assignedto, setAssignedto] = useState([]);
  const [reportstatus, setReportstatus] = useState([]);
  //show and hide deposit and ledger
  const [showdeposit, setShowdeposit] = useState(false);
  const [billingReport, setBillingReport] = useState('');

  // const [showledger, setShowledger] = useState(false);
  useEffect(() => {
    if (
      props.customstartdate !== undefined ||
      props.customenddate !== undefined ||
      inputs.paymentmethod !== undefined ||
      inputs.franchiselistt !== undefined ||
      inputs.branch !== undefined ||
      inputs.zone !== undefined ||
      inputs.area !== undefined ||
      inputs.collectedby !== undefined ||
      inputs.status !== undefined ||
      inputs.reporttype !== undefined
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

  //handle change event contine
  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
    let val = event.target.value;

    if (event.target.name == "reporttype") {
      if (event.target.value === "DEPOSIT" || event.target.value === "LEDGER") {
        setShowdeposit(true);
      } else {
        setShowdeposit(false);
      }
    }
    const target = event.target;
    var value = target.value;
    const name = target.name;
    if (name == "branch") {
      getlistoffranchise(val);
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

  //get franchise options based on branch selection
  const getlistoffranchise = (val) => {
    adminaxios
      .get(`franchise/${val}/branch`)
      .then((response) => {
        console.log(response.data);
        setFranchiselist(response.data);
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
  //list of users
  useEffect(() => {
    customeraxios
      .get(`customers/display/users`)
      .then((res) => {
        let { customers, assigned_to, status } = res.data;
        setReportCustomer([...customers]);
        setAssignedto([...assigned_to]);
      })
      .catch((err) =>
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        })
      );
  }, []);
  //

  // use effect for payment
  useEffect(() => {
    billingaxios
      .get(`payment/options`)
      .then((res) => {
        let { offline_payment_modes, status } = res.data;
        setPayment([...offline_payment_modes]);
        setReportstatus([...status]);
      })
      .catch((err) =>
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        })
      );
  }, []);

  // end
  return (
    <>
      <Container fluid={true}>
        <div className="edit-profile">
          <Row>
            {/* <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="reporttype"
                    className="form-control digits"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.reporttype}
                  >
                    <option style={{ display: "none" }}></option>

                    <option value="DEPOSIT">Wallet</option>
                    <option value="LEDGER">Ledger</option>
                    <option value="INVOICE">Invoice</option>
                  </Input>

                  <Label
                    className="form_label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Report Type
                  </Label>
                </div>
              </FormGroup>
            </Col> */}

            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="branch"
                    className="form-control digits"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.branch}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL">All</option>
                    {reportsbranch.map((branchreport) => (
                      <option key={branchreport.id} value={branchreport.id}>
                        {branchreport.name}
                      </option>
                    ))}
                  </Input>
                  <Label className="form_label">Branch</Label>
                </div>
              </FormGroup>
            </Col>

            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="franchiselistt"
                    className="form-control digits"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.franchiselistt}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL1">All</option>
                    {franchiselist.map((franchisereport) => (
                      <option
                        key={franchisereport.id}
                        value={franchisereport.id}
                      >
                        {franchisereport.name}
                      </option>
                    ))}
                  </Input>
                  <Label className="form_label">Franchise</Label>
                </div>
              </FormGroup>
            </Col>

            {/* <Col sm="7">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="select"
                      name="zone"
                      className="form-control digits"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      value={inputs && inputs.zone}
                    >
                      <option style={{ display: "none" }}></option>

                      {reportszone.map((zonereport) => (
                        <option key={zonereport.id} value={zonereport.id}>
                          {zonereport.name}
                        </option>
                      ))}
                    </Input>

                    <Label className="placeholder_styling">Zone</Label>
                  </div>
                </FormGroup>
              </Col> */}

            {/* <Col sm="7">
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

                      {reportsarea.map((areareport) => (
                        <option key={areareport.id} value={areareport.id}>
                          {areareport.name}
                        </option>
                      ))}
                    </Input>

                    <Label
                      className="placeholder_styling"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Area
                    </Label>
                  </div>
                </FormGroup>
              </Col> */}

            <Col sm="2" >
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="paymentmethod"
                    className="form-control digits"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.payment}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL3">All</option>

                    {payment.map((paymentreport) => (
                      <option key={paymentreport.id} value={paymentreport.id}>
                        {paymentreport.name}
                      </option>
                    ))}
                  </Input>

                  <Label
                    className="form_label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Payment Type
                  </Label>
                </div>
              </FormGroup>
            </Col>
            {/* <div  hidden={inputs.reporttype != "INVOICE"}> */}
            <Col sm="2" >
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="collectedby"
                    className="form-control digits"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.collectedby}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL4">All</option>
                    {assignedto.map((assignedtobilling) => (
                      <option
                        key={assignedtobilling.id}
                        value={assignedtobilling.id}
                      >
                        {assignedtobilling.username}
                      </option>
                    ))}
                  </Input>

                  <Label
                    className="form_label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                   Names
                  </Label>
                </div>
              </FormGroup>
            </Col>
            <Col
              sm="2"
              className="padding-10"
            >
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="status"
                    className="form-control digits"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.status}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL5">All</option>
                    {reportstatus.map((reportforstatus) => (
                      <option
                        key={reportforstatus.id}
                        value={reportforstatus.id}
                      >
                        {reportforstatus.name}
                      </option>
                    ))}
                  </Input>
                  <Label className="form_label">Status</Label>
                </div>
              </FormGroup>
            </Col>
            {/* </div> */}
          </Row>

          <Row>
            <div style={{ display: "flex", marginRight: "108px" }}></div>
          </Row>

          <Row style={{ marginLeft: "2%" }}>
            <Col sm="6">
           
            </Col>
            {/* <Col sm="6" hidden={ inputs.reporttype != "INVOICE"}>
              <button
              style={{
                whiteSpace: "nowrap",
                fontSize: "medium",
                height: "40px",
                position: "relative",
                left: "-116.4%",
                top: "-62%",
              }}
                className="btn btn-primary openmodal"
                type="submit"
                // onClick={toggle}
                onClick={() => setSearchbuttondisable(!searchbuttondisable)}

                disabled={searchbuttondisable}
                id="update_button"

              >
                <span style={{ marginLeft: "-10px" }} className="openmodal">
                  &nbsp;&nbsp; Search
                </span>
              </button>
             
             
            </Col> */}

            <Col sm="6">
              <button
              style={{
                whiteSpace: "nowrap",
                fontSize: "medium",
                height: "40px",
                position: "relative",
                left: "-105.4%",
                top: "-62%",
                
              }}
                className="btn btn-primary openmodal"
                type="submit"
                // onClick={toggle}
                onClick={() => setSearchbuttondisable(!searchbuttondisable)}

                disabled={searchbuttondisable}
                id="update_button"

              >
                <span style={{ marginLeft: "-10px" }} className="openmodal">
                  &nbsp;&nbsp; Search
                </span>
              </button>
            </Col>
            {/* <Col sm="6"hidden={ inputs.reporttype != "LEDGER"}>
              <button
              style={{
                whiteSpace: "nowrap",
                fontSize: "medium",
                height: "40px",
                position: "relative",
                left: "-116.4%",
                top: "-62%",
              }}
                className="btn btn-primary openmodal"
                type="submit"
                // onClick={toggle}
                onClick={() => setSearchbuttondisable(!searchbuttondisable)}

                disabled={searchbuttondisable}
                id="update_button"

              >
                <span style={{ marginLeft: "-10px" }} className="openmodal">
                  &nbsp;&nbsp; Search
                </span>
              </button>
            </Col> */}
          </Row>
          {/* <div hidden={ inputs.reporttype != "INVOICE"} style={{marginLeft:"-4%"}}>
            <TotalCountInovice billingReport={billingReport}/>
          </div> */}
          <Row style={{ marginTop: "47px"}}>
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
                Invoice Reports
              </h5>
            </Col>
          </Row>

          <Row >
            <Col sm="12">
              {searchbuttondisable ? (
                  <BillingModalnewreports
                  customstartdate={props.customstartdate}
                  customenddate={props.customenddate}
                  inputs={inputs}
                  setBillingReport={setBillingReport}
                />
              ) : (
               ""
              )}
            </Col>
            {/* <Col sm="12" >
              {searchbuttondisable ? (
                   <Showledger
                   customstartdate={props.customstartdate}
                   customenddate={props.customenddate}
                   inputs={inputs}
                 />
              ) : (
               ""
              )}
            </Col> */}
            {/* <Col sm="12" hidden={ inputs.reporttype != "LEDGER"} >
              {searchbuttondisable ? (
                   <Showledger
                   customstartdate={props.customstartdate}
                   customenddate={props.customenddate}
                   inputs={inputs}
                 />
              ) : (
               ""
              )}
            </Col> */}
          </Row>
          {showdeposit ? (
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
                        {/* <Row style={{ marginTop: "15px" }}> */}
                        <Row style={{ marginTop: "18px",marginLeft:"-99px" }}>
                          <Col sm="1"></Col>
                          <Col sm="9">
                            {/* <h6>Billing Reports</h6>
                             */}
                              <h5
                              style={{
                                marginTop: "9px",
                                
                                fontSize: "23px",
                              }}
                            >
                              Billing Reports
                            </h5>
                          </Col>

                          <Col sm="2">
                            <Button onClick={toggle}>Close</Button>
                          </Col>
                        </Row>

                        {/* <ModalBody>
                          <Showledger
                            customstartdate={props.customstartdate}
                            customenddate={props.customenddate}
                            inputs={inputs}
                          />
                        </ModalBody> */}
                      </Modal>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          ) : (
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
                        
                        <Row style={{ marginTop: "18px",marginLeft:"-99px" }}>
                        <Col sm="1"></Col>
                        <Col sm="9">
                            <h5
                              style={{
                                marginTop: "9px",
                                
                                fontSize: "23px",
                              }}
                            >
                              Billing Reports
                            </h5>
                          </Col>

                          <Col sm="2" style={{ paddingLeft: "70px" }}>
                            <Button onClick={toggle}>Close</Button>
                          </Col>
                        </Row>
                     

                        <ModalBody>
                          <BillingModalnewreports
                            customstartdate={props.customstartdate}
                            customenddate={props.customenddate}
                            inputs={inputs}
                          />
                        </ModalBody>
                      </Modal>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          )}

          {/* end */}
        </div>
      </Container>
    </>
  );
};

export default InoviceReports;
