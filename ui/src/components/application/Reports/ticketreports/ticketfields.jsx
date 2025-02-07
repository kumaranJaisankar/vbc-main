import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import { Container, Row, Col, Input, FormGroup, Label } from "reactstrap";
import { customeraxios, helpdeskaxios, adminaxios } from "../../../../axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import TicketModalnewreports from "./ticketmodal";
import TotalTicekts from "./TotalTickets";
//   import FranchiseModalnewreports from "./franchisemodal";
// Sailaja imported common component Sorting on 29th March 2023
import { Sorting } from "../../../common/Sorting";


var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}

const TicketReports = (props) => {
  const [rightSidebar, setRightSidebar] = useState(true);
  const width = useWindowSize();
  const [modal, setModal] = useState();
  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  const [inputs, setInputs] = useState({
    status: "OPN",
  });
  const [searchbuttondisable, setSearchbuttondisable] = useState(true);
  //state for category
  const [reportcategory, setReportcategory] = useState([]);
  //state for subcategory
  const [reportsubcategory, setReportsubcategory] = useState([]);
  //state for priority
  const [reportpriority, setReportpriority] = useState([]);
  //state for status
  const [reportstatus, setReportstatus] = useState([]);
  const [reportcustomer, setReportCustomer] = useState([]);
  const [reportsbranch, setReportsbranch] = useState([]);
  const [onfilterbranch, setOnfilterbranch] = useState([]);
  //state for Assign To
  const [assigntoFilter, setAssignTOFIlter] = useState([]);

  useEffect(() => {
    if (
      // props.customstartdate !== undefined ||
      // props.customenddate !== undefined ||
      inputs.category != undefined ||
      inputs.subcategory != undefined ||
      inputs.priority != undefined ||
      // inputs.status != undefined ||
      inputs.customerid != undefined ||
      inputs.branch != undefined || 
      inputs.franchiselistt !== undefined ||
      inputs.assign !== undefined ||
      inputs.closed_by !== undefined
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
      getlistoffranchises(val);
    }
    if (name == "category") {
      getsubCategory(val);
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

  useEffect(() => {
    helpdeskaxios
      .get(`v2/ticket/options`)
      .then((res) => {
        let { category, priority_sla, status } =
          res.data;
        // setReportcategory([...category]);

        setReportcategory(Sorting(([...category]), 'category'));

        setReportpriority([...priority_sla]);
        // setReportsubcategory([...subcategory]);
        setReportstatus([...status]);
      })
      .catch((err) =>
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        })
      );
  }, []);
  //end
  //
  useEffect(() => {
    customeraxios
      .get(`customers/display/users`)
      .then((res) => {
        let { customers } = res.data;
        setReportCustomer([...customers]);
      })
      .catch((err) =>
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        })
      );
  }, []);
  //

  //added field css by Marieya


  // branch list
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        // setReportsbranch([...res.data]);
        // Sailaja sorting the Helpdesk Reports -> Branch Dropdown data as alphabetical order on 29th March 2023
        setReportsbranch(Sorting(([...res.data]), 'name'));


      })
      .catch((err) => console.log(err));
  }, []);
  // list franchise based on branch
  const getlistoffranchises = (name) => {
    adminaxios
      .get(`franchise/${name}/branch`)
      .then((response) => {
        setOnfilterbranch(response.data);
        // Sailaja sorting the Helpdesk Reports -> Franchise Dropdown data as alphabetical order on 29th March 2023
        setOnfilterbranch(Sorting((response.data), 'name'));

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
          setOnfilterbranch(response.data);
        })
        .catch(function (error) {
          console.error("Something went wrong!", error);
        });
    }

  }, []);

  const getsubCategory = (val) => {
    helpdeskaxios
      .get(`sub/ticketcategory/${val}`)
      .then((res) =>
        // setReportsubcategory(res.data));
        // Sailaja sorting the Helpdesk Reports -> Sub Category Dropdown data as alphabetical order on 29th March 2023
        setReportsubcategory(Sorting((res.data), 'name')));
  };

  const franchId = JSON.parse(localStorage.getItem("token"))?.franchise?.id
    ? JSON.parse(localStorage.getItem("token"))?.franchise?.id
    : 0;
  const branchId = JSON.parse(localStorage.getItem("token"))?.branch?.id
    ? JSON.parse(localStorage.getItem("token"))?.branch?.id
    : 0;

  useEffect(() => {
    adminaxios.get(`accounts/staff`).then((res) => {
      // setAssignTOFIlter(res.data);
      // Sailaja sorting the Helpdesk Reports -> Assign To, Closed By Dropdown data as alphabetical order on 29th March 2023
      setAssignTOFIlter(Sorting((res.data), 'username'));

    });
  }, []);

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
                    name="status"
                    className="form-control digits"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.status}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL3">All</option>
                    {reportstatus.map((reportforstatus) => (
                      <option
                        key={reportforstatus.id}
                        value={reportforstatus.id}
                      >
                        {reportforstatus.name}
                      </option>
                    ))}
                  </Input>

                  <Label
                    className="form_label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Status
                  </Label>
                </div>
              </FormGroup>
            </Col> */}

            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="category"
                    className="form-control digits"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.category}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL" selected>
                      All
                    </option>
                    {reportcategory.map((reportforcategory) => (
                      <option
                        key={reportforcategory.id}
                        value={reportforcategory.id}
                      >
                        {reportforcategory.category}
                      </option>
                    ))}
                  </Input>

                  <Label
                    className="form_label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Category
                  </Label>
                </div>
              </FormGroup>
            </Col>

            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="subcategory"
                    className="form-control digits"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.subcategory}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL1" selected>
                      All
                    </option>
                    {reportsubcategory.map((reportforsubcategory) => (
                      <option
                        key={reportforsubcategory.id}
                        value={reportforsubcategory.id}
                      >
                        {reportforsubcategory.name}
                      </option>
                    ))}
                  </Input>

                  <Label
                    className="form_label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Sub Category
                  </Label>
                </div>
              </FormGroup>
            </Col>

            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    type="select"
                    name="priority"
                    className="form-control digits"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.priority}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL2" selected>
                      All
                    </option>
                    {reportpriority.map((reportforpriority) => (
                      <option
                        key={reportforpriority.id}
                        value={reportforpriority.id}
                      >
                        {reportforpriority.name}
                      </option>
                    ))}
                  </Input>

                  <Label
                    className="form_label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Priority
                  </Label>
                </div>
              </FormGroup>
            </Col>

            {/* <Col sm="2">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="select"
                      name="customerid"
                      className="form-control digits"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      value={inputs && inputs.customerid}
                    >
                      <option style={{ display: "none" }}></option>
                        <option value="ALL4">All</option>
                      {reportcustomer.map((customerreportid) => (
                        <option
                          key={customerreportid.id}
                          value={customerreportid.id}
                        >
                          {customerreportid.username}
                        </option>
                      ))}
                    </Input>

                    <Label
                      className="form_label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      User ID
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
                      value={props.inputs && props.inputs.branch}
                    >
                      <option style={{ display: "none" }}></option>
                      <option value="ALL5" selected>
                        All
                      </option>
                      {reportsbranch.map((branchreport) => (
                        <>
                          <option key={branchreport.id} value={branchreport.id}>
                            {branchreport.name}
                          </option>
                        </>
                      ))}
                    </Input>
                    <Label
                      className="form_label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Branch
                    </Label>
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
                        value={props.inputs && props.inputs.franchiselistt}
                      >
                        <option style={{ display: "none" }}></option>
                        <option value="ALL6" selected>
                          All
                        </option>
                        {onfilterbranch.map((reportonfranchise) => (
                          <option
                            key={reportonfranchise.id}
                            value={reportonfranchise.id}
                          >
                            {reportonfranchise.name}
                          </option>
                        ))}
                      </Input>

                      <Label
                        className="form_label"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Franchise
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
              )}
          </Row>
          <Row id="assign_to">
            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Assign To</Label>
                  <Input
                    type="select"
                    name="assign"
                    className="form-control digits"
                    onChange={handleInputChange}
                    value={props.inputs && props.inputs.assign}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL10">All</option>
                    {assigntoFilter.map((assignto) => (
                      <option key={assignto.id} value={assignto.id}>
                        {assignto.username}
                      </option>
                    ))}
                  </Input>
                </div>
              </FormGroup>
            </Col>
            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Closed By</Label>
                  <Input
                    type="select"
                    name="closed_by"
                    className="form-control digits"
                    onChange={handleInputChange}
                    value={props.inputs && props.inputs.closed_by_username}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL10">All</option>
                    {assigntoFilter.map((closedby) => (
                      <option key={closedby.id} value={closedby.id}>
                        {closedby.username}
                      </option>
                    ))}
                  </Input>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <button
                style={{
                  whiteSpace: "nowrap",
                  fontSize: "16",
                  height: "40px",
                  position: "relative",
                  top: "-62%",
                  top: "-62%",
                  fontFamily: "Open Sans",
                  fontWeight: 600,
                  width: "111px",
                  backgroundColor: "#285295 !important",
                  borderRadius: "6px",
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

          {/* {searchbuttondisable ? (
            <Row id="report_fields">
              <TotalTicekts totalCount={totalCount} />
            </Row>
          ) : (
            ""
          )} */}
          {/* <Row style={{ marginTop: "47px"}}>
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
                Tickets Reports
              </h5>
            </Col>
          </Row> */}

          <Row>
            <Col sm="12">
              {searchbuttondisable ? (
                <TicketModalnewreports
                  // setTotalCount={setTotalCount}
                  inputs={inputs}
                  customstartdate={props.customstartdate}
                  customenddate={props.customenddate}
                />
              ) : (
                ""
              )}
            </Col>
          </Row>

          {/* end */}
        </div>
      </Container>
    </>
  );
};

export default TicketReports;
