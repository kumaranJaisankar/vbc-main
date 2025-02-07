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
import { adminaxios } from "../../../../axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import FranchiseModalnewreports from "./franchisemodal";

import TotalFranchise from "./Totalcount"
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const FranchiseReports = (props) => {
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
  const [customenddate, setCustomenddate] = useState();
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
  //state for filter sms type status
  const [franchisesms,setFranchisesms] = useState([]);
  const [franchisetype,setFranchisetype] = useState([]);
  const [franchisestatus,setFranchisestatus] = useState([]);
  const [branchfilter,setBranchfilter] = useState([]);
  //state for franchise filter based on branch
  const [onfilterbranch,setOnfilterbranch] = useState([]);

  const [franchiseHide, setFranchiseHide] = useState(false)
  const [franchiseReport, setFranchiseReport] = useState(false);


  useEffect(() => {
    if (
      props.customstartdate !== undefined ||
      props.customenddate !== undefined ||
      inputs.franchiselistt !== undefined ||
      inputs.franchisetypee !== undefined ||
      inputs.franchisestatuss !== undefined ||
      inputs.franchisesmsgatewayy !== undefined ||
      inputs.filterbranch !== undefined
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
    if (name == "filterbranch") {
      getlistoffranchises(val);
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
  //list if type,stattus,smsgateway

  useEffect(() => {
    adminaxios
      .get(`franchise/options`)
      .then((res) => {
        let {status,type,sms} = res.data;
        setFranchisesms([...sms]);
        setFranchisestatus([...status]);
      setFranchisetype([...type])

      })
      .catch((err) =>
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        })
      );
  }, []);
  //end
  //list of franchise branches

  useEffect(() => {
    adminaxios
      .get(`franchise/branches`)
      .then((res) => {
        let {branches} = res.data;
        setBranchfilter([...branches]);
        console.log(res.data, "branchfilter")
        
        
      })
     
      .catch((err) =>
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        })
      );
  }, []);

//get franchise options based on branch selection
const getlistoffranchises = (name) => {
  adminaxios
    .get(`franchise/${name}/branch`)
    .then((response) => {
      console.log(response.data);
      setOnfilterbranch(response.data);
    })
    .catch(function (error) {
      console.error("Something went wrong!", error);
    });
};
//end

const [totalfranchise, setTotalFranchise] = useState()

  return (
    <>
      <Container fluid={true}>
        <div className="edit-profile" > 
          <Row style={{marginLeft:"-4%"}}>



            <Col sm="2">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="select"
                      name="filterbranch"
                      className="form-control digits"
                      onChange={(event)=>{handleInputChange(event)
                        setFranchiseHide(event.target.value)
                      }}
                      onBlur={checkEmptyValue}
                      value={inputs && inputs.filterbranch}
                    >
                      <option style={{ display: "none" }}></option>
                      <option value="ALL">All</option>
                      {branchfilter.map((branchfiltreronfranchise) => (
                        <option key={branchfiltreronfranchise.id} value={branchfiltreronfranchise.id}>
                          {branchfiltreronfranchise.branch}
                        </option>
                      ))}
                    </Input>

                    <Label className="form_label">Branch</Label>
                  </div>
                </FormGroup>
              </Col>
     
{/* 

              <Col sm="8">
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
                          {onfilterbranch.map((branchreport) => (
                            <option key={branchreport.id} value={branchreport.id}>
                              {branchreport.name}
                            </option>
                          ))}
                        </Input>
                        <Label className="placeholder_styling">Franchise</Label>
                      </div>
                    </FormGroup>
                  </Col> */}
  

  
                  <Col sm="2" hidden={franchiseHide === "ALL"}>
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
                          {onfilterbranch.map((reportonfranchise) => (
                            <option key={reportonfranchise.id} value={reportonfranchise.id}>
                              {reportonfranchise.name}
                            </option>
                          ))}
                        </Input>
  
                        <Label className="form_label">Franchise</Label>
                      </div>
                    </FormGroup>
                  </Col> 
  


              <Col sm="2">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="select"
                      name="franchisetypee"
                      className="form-control digits"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      value={inputs && inputs.zone}
                    >
                      <option style={{ display: "none" }}></option>
                    <option value="ALL2">All</option>
                      {franchisetype.map((franchisereporttype) => (
                        <option key={franchisereporttype.name} value={franchisereporttype.name}>
                          {franchisereporttype.name}
                        </option>
                      ))}
                    </Input>

                    <Label className="form_label">Franchise Type</Label>
                  </div>
                </FormGroup>
              </Col>


              <Col sm="2">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="select"
                      name="franchisestatuss"
                      className="form-control digits"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      value={inputs && inputs.franchisestatuss}
                    >
                      <option style={{ display: "none" }}></option>
                      <option value="ALL3">All</option>
                      {franchisestatus.map((franchisestatustype) => (
                        <option key={franchisestatustype.name} value={franchisestatustype.name}>
                          {franchisestatustype.name}
                        </option>
                      ))}
                    </Input>

                    <Label className="form_label">Franchise Status</Label>
                  </div>
                </FormGroup>
              </Col>


              <Col sm="2">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="select"
                      name="franchisesmsgatewayy"
                      className="form-control digits"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      value={inputs && inputs.franchisesmsgatewayy}
                    >
                      <option style={{ display: "none" }}></option>
                      <option value="ALL4">All</option>
                      {franchisesms.map((franchisesmsgateway) => (
                        <option key={franchisesmsgateway.name} value={franchisesmsgateway.name}>
                          {franchisesmsgateway.name}
                        </option>
                      ))}
                    </Input>

                    <Label className="form_label">SMS Gateway</Label>
                  </div>
                </FormGroup>
              </Col>

          </Row>
          <Row>
            {/* <TotalFranchise totalfranchise={totalfranchise}/> */}
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

                disabled={searchbuttondisable}
                id="update_button"

              >
                <span style={{ marginLeft: "-10px" }} className="openmodal">
                  &nbsp;&nbsp; Search
                </span>
              </button>
            </Col>
          </Row>
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
                Franchise Reports
              </h5>
            </Col>
          </Row>

          <Row style={{marginLeft:"-5%"}}>
            <Col sm="12">
              {searchbuttondisable ? (
                   <FranchiseModalnewreports
                   customstartdate={props.customstartdate}
                   customenddate={props.customenddate}
                   inputs={inputs}
                   setTotalFranchise={setTotalFranchise}
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
                      <Row style={{ marginTop: "18px",marginLeft:"-99px" }}>
                        <Col sm="1"></Col>
                        <Col sm="9">
                          <h5 style={{marginTop:"9px", fontSize:"23px"}}>Franchise Reports</h5>
                        </Col>
      
                        <Col sm="2" style={{paddingLeft:"70px"}}>
                          <Button onClick={toggle}>Close</Button>
                        </Col>
                      </Row>

                      {/* <ModalBody>
                        <FranchiseModalnewreports
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

          {/* end */}
        </div>
      </Container>
    </>
  );
};

export default FranchiseReports;
