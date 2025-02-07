import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
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
import { customeraxios, helpdeskaxios } from "../../../../axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import TicketModalnewreports from "./ticketmodal";
import TotalTicekts from "./TotalTickets"

//   import FranchiseModalnewreports from "./franchisemodal";

var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}

const TicketReports = (props) => {
  const [loading, setLoading] = useState(false);
  const [rightSidebar, setRightSidebar] = useState(true);
  const width = useWindowSize();
  const [modal, setModal] = useState();
  const [refresh, setRefresh] = useState(0);
  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  const [inputs, setInputs] = useState({});
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
  const [ticketReport, setTicketReport] = useState(false);

  useEffect(() => {
    if (
      props.customstartdate !== undefined ||
      props.customenddate !== undefined ||
      inputs.category!= undefined ||
      inputs.subcategory != undefined || 
      inputs.priority != undefined ||
      inputs.status != undefined ||
      inputs.customerid != undefined
      
    ) {
      setSearchbuttondisable(false);
    }
  }, [props.customstartdate,props.customenddate ,inputs]);

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
        let { opened_by, category, priority_sla, subcategory, status } =
          res.data;
        setReportcategory([...category]);
        setReportpriority([...priority_sla]);
        setReportsubcategory([...subcategory]);
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



  const [totalCount, setTotalCount] = useState({})
  return (
    <>
      <Container fluid={true}>
        <div className="edit-profile">
          <Row style={{marginLeft:"-4%"}}>
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
                      <option value="ALL">All</option>
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
                      <option value="ALL1">All</option>
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
                        <option value="ALL2">All</option>
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

              <Col sm="2">
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
              </Col>

              <Col sm="2">
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
          </Row>
            {searchbuttondisable ? 
          <Row style={{marginLeft:"-4%"}}>
            <TotalTicekts totalCount={totalCount}/>
          </Row>
          :""}
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
                Tickets Reports
              </h5>
            </Col>
          </Row>

          <Row style={{marginLeft:"-5%"}}>
            <Col sm="12">
              {searchbuttondisable ? (
                   <TicketModalnewreports
                   setTotalCount={setTotalCount}
                   inputs={inputs}
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
                          <Row style={{ marginTop: "18px" ,marginLeft:"-99px"}}>
                            <Col sm="1"></Col>
                            <Col sm="9">
                              <h5 style={{marginTop:"9px", fontSize:"23px"}}>Ticket Reports</h5>
                            </Col>
    
                            <Col sm="2" style={{paddingLeft:"59px"}}>
                              <Button onClick={toggle}>Close</Button>
                            </Col>
                          </Row>
    
                          {/* <ModalBody>
                            <TicketModalnewreports
                            
                              inputs={inputs}
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

export default TicketReports;
