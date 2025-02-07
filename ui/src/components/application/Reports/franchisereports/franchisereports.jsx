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

// Sailaja imported common component Sorting on 29th March 2023
import { Sorting } from "../../../common/Sorting";


var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const FranchiseReports = (props) => {
  const [rightSidebar, setRightSidebar] = useState(true);
  const width = useWindowSize();
  const [modal, setModal] = useState();
  const [refresh, setRefresh] = useState(0);
  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  //end
  const [inputs, setInputs] = useState({});
  const [searchbuttondisable, setSearchbuttondisable] = useState(true);
  //state for filter sms type status
  const [franchisesms, setFranchisesms] = useState([]);
  const [franchisetype, setFranchisetype] = useState([]);
  const [franchisestatus, setFranchisestatus] = useState([]);
  const [branchfilter, setBranchfilter] = useState([]);
  //state for franchise filter based on branch
  const [onfilterbranch, setOnfilterbranch] = useState([]);

  const [franchiseHide, setFranchiseHide] = useState(false)


  useEffect(() => {
    if (
      // props.customstartdate !== undefined ||
      // props.customenddate !== undefined ||
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


  document.addEventListener("mousedown", (event) => {
    const concernedElement = document.querySelector(".filter-container");
  });




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
        let { status, type, sms } = res.data;
        // setFranchisesms([...sms]);
        // Sailaja sorting the Franchise Reports -> Franchise SMS Gateway Dropdown data as alphabetical order on 29th March 2023
        setFranchisesms(Sorting(([...sms]),'name'));
        // setFranchisestatus([...status]);
         // Sailaja sorting the Franchise Reports -> Franchise Type Dropdown data as alphabetical order on 29th March 2023
        setFranchisestatus(Sorting(([...status]),'name'));
        // setFranchisetype([...type])
        // Sailaja sorting the Franchise Reports -> Franchise Status Dropdown data as alphabetical order on 29th March 2023
        setFranchisetype(Sorting(([...type]),'name'));
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
    if(JSON.parse(localStorage.getItem("token"))?.branch === null){

      adminaxios
        .get(`franchise/branches`)
        .then((res) => {
          let { branches } = res.data;
          setBranchfilter([...branches]);
          // Sailaja sorting the Franchise Reports -> Branch Dropdown data as alphabetical order on 29th March 2023
          setBranchfilter(Sorting(([...branches]),'branch'));
          console.log(res.data, "branchfilter")
  
  
        })
        .catch((err) =>
          toast.error("Something went wrong!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          })
        );
    }
  }, []);

  //get franchise options based on branch selection
  const getlistoffranchises = (name) => {
    adminaxios
      .get(`franchise/${name}/branch`)
      .then((response) => {
        // setOnfilterbranch(response.data);
         // Sailaja sorting the Franchise Reports -> Franchise Dropdown data as alphabetical order on 29th March 2023
        setOnfilterbranch(Sorting((response.data),'name'));

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
  //end

  const [totalfranchise, setTotalFranchise] = useState()

  return (
    <>


      <Container fluid={true}>
        <div className="edit-profile" >

          <Row>
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
                    name="filterbranch"
                    className="form-control digits"
                    onChange={(event) => {
                      handleInputChange(event)
                      setFranchiseHide(event.target.value)
                    }}
                    onBlur={checkEmptyValue}
                    value={inputs && inputs.filterbranch}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL" selected>All</option>
                    {branchfilter?.map((branchfiltreronfranchise) => (
                      <option key={branchfiltreronfranchise.id} value={branchfiltreronfranchise.id}>
                        {branchfiltreronfranchise.branch}
                      </option>
                    ))}
                  </Input>

                  <Label className="form_label">Branch</Label>
                </div>
              </FormGroup>
            </Col>)}

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

{
            JSON.parse(localStorage.getItem("token")).franchise?.name ? (
              <Col sm="2" >
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
                    <option value="ALL1" selected>All</option>
                    {onfilterbranch.map((reportonfranchise) => (
                      <option key={reportonfranchise.id} value={reportonfranchise.name}>
                        {reportonfranchise.name}
                      </option>
                    ))}
                  </Input>

                  <Label className="form_label">Franchise</Label>
                </div>
              </FormGroup>
            </Col>)}



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
                    <option value="ALL2" selected>All</option>
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
                    <option value="ALL3" selected>All</option>
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
                    <option value="ALL4" selected>All</option>
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
            <Col sm="6" className="franchise_reports">
              <button
                style={{
                  whiteSpace: "nowrap",
                  fontSize: "16px",
                  height: "40px",
                  position: "relative",
                  left: "-103.4%",
                  top: "-62%",
                  fontFamily: "Open Sans",
                  fontWeight: 600,
                  width: "111px",
                  backgroundColor: "#285295 !important",
                  borderRadius: "6px",
                  color: "white"
                }}
                className="btn btn-primary openmodal"
                type="submit"
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
          {/* <Row style={{ marginTop: "47px",  }}>
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
          </Row> */}

          <Row >
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
        </div>
      </Container>
    </>
  );
};

export default FranchiseReports;
