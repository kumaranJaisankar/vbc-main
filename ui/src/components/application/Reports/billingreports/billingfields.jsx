import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import { adminaxios, billingaxios, customeraxios } from "../../../../axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import Showledger from "./showledger";
import TotalCountInovice from "./Total"
import { Sorting } from "../../../common/Sorting";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const BillingReports = (props) => {
  const [rightSidebar, setRightSidebar] = useState(true);
  const width = useWindowSize();
  const [modal, setModal] = useState();
  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  const [paymentType, setPaymentType] = useState();

  //end

  const [inputs, setInputs] = useState({});
  //branch state to get all list of branches
  const [reportsbranch, setReportsbranch] = useState([]);
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
  const [onlOptions, setOnlOptions] = useState({});

  // const [showledger, setShowledger] = useState(false);
  useEffect(() => {
    if (
      // props.customstartdate !== undefined ||
      // props.customenddate !== undefined ||
      inputs.paymentmethod !== undefined ||
      inputs.franchiselistt !== undefined ||
      inputs.branch !== undefined ||
      inputs.zone !== undefined ||
      inputs.area !== undefined ||
      inputs.collectedby !== undefined ||
      inputs.status !== undefined ||
      inputs.pickup_type !== undefined ||
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
 

  //end

  //get franchise options based on branch selection
  const getlistoffranchise = (val) => {
    adminaxios
      .get(`franchise/${val}/branch`)
      .then((response) => {
        console.log(response.data);
        // setFranchiselist(response.data);
      // Sailaja sorting the Revenue Reports -> Franchise Dropdown data as alphabetical order on 29th March 2023
      setFranchiselist(Sorting((response.data),'name'));

      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("token"))?.branch === null) {

    }
    else if (JSON.parse(localStorage.getItem("token"))?.branch?.id === JSON.parse(localStorage.getItem("token"))?.branch?.id) {
      adminaxios
        .get(
          `franchise/${JSON.parse(localStorage.getItem("token"))?.branch?.id
          }/branch`
        )
        .then((response) => {
          setFranchiselist(response.data);
        })
        .catch(function (error) {
          console.error("Something went wrong!", error);
        });
    }

  }, []);
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
        // setReportsbranch([...res.data]);
        // Sailaja sorting the Revenue Reports -> Branch Dropdown data as alphabetical order on 29th March 2023
        setReportsbranch(Sorting(([...res.data]),'name'));
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
        // Sailaja sorting the Revenue Reports -> Collected By Dropdown data as alphabetical order on 29th March 2023
        setAssignedto(Sorting(([...assigned_to]),"username"));     
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

  //online payment method api
  useEffect(() => {
    billingaxios
      .get(`payment/method/list`)
      .then((response) => {
        setOnlOptions(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
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
 {JSON.parse(localStorage.getItem("token"))?.branch?.name ? (
              <Col sm="2">
                <FormGroup>
                  <div className="input_wrap">
                  
                    <Input
                      className={`form-control digits not-empty`}
                      value={
                        JSON.parse(localStorage.getItem("token"))?.branch?.name
                      }
                      type="text"
                      name="branch"
                      onChange={handleInputChange}
                      style={{ textTransform: "capitalize" }}
                      disabled={true}
                    />
                      <Label className="form_label">Branch </Label>
                  </div>
                </FormGroup>
              </Col>
            ) : (
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
                    <option value="ALL" selected>All</option>
                    {reportsbranch.map((branchreport) => (
                      <option key={branchreport.id} value={branchreport.id}>
                        {branchreport.name}
                      </option>
                    ))}
                  </Input>
                  <Label className="form_label">Branch</Label>
                </div>
              </FormGroup>
            </Col>)}
            {
            JSON.parse(localStorage.getItem("token")).franchise?.name ? (
              <Col sm="2">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      // draft
                      className={`form-control digits not-empty`}
                      value={
                        JSON.parse(localStorage.getItem("token"))?.franchise?.name
                      }
                      type="text"
                      name="franchise"
                      onChange={handleInputChange}
                      style={{ textTransform: "capitalize" }}
                      disabled={true}
                    />
                    <Label
                      className="form_label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Franchise{" "}
                    </Label>
                  </div>
                </FormGroup>
              </Col>
            ) : (
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
                    <option value="ALL1" selected>All</option>
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
            </Col>)}

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
            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="pickup_type"
                    className="form-control digits"
                    onChange={(event) => {
                      handleInputChange(event);
                      setPaymentType(event.target.value)
                    }}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.pickup_type}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL7" selected>All</option>
                    <option value="ONL">Online</option>
                    <option value="OFL">Offline</option>
                  </Input>
                  <Label className="form_label"
                    style={{ whiteSpace: "nowrap" }}
                  >Payment Mode</Label>

                </div>
              </FormGroup>
            </Col>
            <Col sm="2" hidden={paymentType != 'OFL'}>
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
                    <option value="ALL3" selected>All</option>
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
            <Col sm="2" hidden={paymentType != 'ONL'}>
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="paymentmethod"
                    className="form-control digits"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.onlOptions}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL3" selected>All</option>
                    {onlOptions?.online_payment_methods?.map((onlineoptions) => (
                      <option  value={onlineoptions}>
                        {onlineoptions}
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
                    <option value="ALL4" selected>All</option>
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
                    Collected By
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
                    <option value="ALL5" selected>All</option>
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

            <Col sm="6" style={{ left: "-53%" }}>
              <button
                style={{
                  whiteSpace: "nowrap",
                  fontSize: "16px",
                  height: "40px",
                  position: "relative",
                  left: "-110-.4%",
                  top: "-62%",
                  fontFamily: "Open Sans",
                  fontWeight: 600,
                  width: "111px",
                  backgroundColor: "#285295 !important",
                  borderRadius: "6px"
                }}
                className="btn btn-primary openmodal"
                type="submit"
                // onClick={toggle}
                onClick={() => setSearchbuttondisable(!searchbuttondisable)}

                disabled={searchbuttondisable}
                id="reports_button"

              >
                <span style={{ marginLeft: "-10px" }} className="openmodal">
                  &nbsp;&nbsp; Search
                </span>
              </button>
            </Col>
          </Row>
          <TotalCountInovice billingReport={billingReport} />

          <Row >
            <Col sm="12" >
              {searchbuttondisable ? (
                <Showledger
                  customstartdate={props.customstartdate}
                  customenddate={props.customenddate}
                  inputs={inputs}
                  setBillingReport={setBillingReport}
                  billingReport={billingReport}
                />
              ) : (
                ""
              )}
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default BillingReports;
