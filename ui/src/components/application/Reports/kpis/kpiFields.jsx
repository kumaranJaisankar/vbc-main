import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import { adminaxios, servicesaxios } from "../../../../axios";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import KPI from "../Reports/KPI"
import KPIdata from "./kpiData";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const KPIFields = (props, initialValues) => {
  const [customerList, setCustomerList] = useState()
  const [rightSidebar, setRightSidebar] = useState(true);
  const width = useWindowSize();
  const [modal, setModal] = useState();
  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
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
  const [onfilterbranch, setOnfilterbranch] = useState([]);

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


  //get list of franchises
  useEffect(() => {
    adminaxios
      .get(`franchise/list`)
      .then((response) => {
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


  //get franchise options based on branch selection
  const getlistoffranchises = (name) => {
    adminaxios
      .get(`franchise/${name}/branch`)
      .then((response) => {
        setOnfilterbranch(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };
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
    if (name == "branch") {
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

  const [showTotalAmount, setShowTotalAmount] = useState(false)

  return (
    <>
      <Container fluid={true}>
        <div className="edit-profile">
          <Row>
         



          

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

            <Col sm="2" >
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


          </Row>
         
          <KPI customerList={customerList} />

          <Row >
            <Col md="12">
              {searchbuttondisable ? (
                <KPIdata
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

          {/* end */}
        </div>
      </Container>
    </>
  );
};

export default KPIFields;