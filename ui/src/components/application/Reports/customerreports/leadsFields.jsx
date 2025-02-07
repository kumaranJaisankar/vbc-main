import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import { Container, Row, Col, Input, FormGroup, Label } from "reactstrap";
import { adminaxios, billingaxios, customeraxios } from "../../../../axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import TotalCountInovice from "../billingreports/Total";
import { Sorting } from "../../../common/Sorting";
import Showleads from "./showLeads";
import { leadReportsStatusJson } from "../../../../utils";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const LeadsFields = (props,initialValues) => {

  const [billingReport, setBillingReport] = useState('');
  const [rightSidebar, setRightSidebar] = useState(true);
  const width = useWindowSize();
  const [modal, setModal] = useState();
  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  //end

  const [inputs, setInputs] = useState({});
  //branch state to get all list of branches
  const [reportsbranch, setReportsbranch] = useState([]);

  // list of packages
  // const [serviceReports, setServiceReports] = useState([]);
  //zone state to get list of zones based on branch search
  const [reportszone, setReportszone] = useState([]);
  //area state based on zone selection
  const [reportsarea, setReportsarea] = useState([]);
  const [searchbuttondisable, setSearchbuttondisable] = useState(true);
  const [branchdata, setBranchdata] = useState([]);


//newstates
const [zoneValue, setZoneValue] = useState([]);
const [state, setState] = useState({});
const [area, setArea] = useState([]);
const [getareas, setGetAreas] = useState([]);



  const [allReports, setAllReports] = useState(true);
  const [areaReports, setAreaReports] = useState(false);
  //filter state
  const [previousBranch, setPreviousBranch] = useState(null);
  const [sendFranchise, setSendFranchise] = useState(true);
  const [sendZone, setSendZone] = useState(true);
  const [sendArea, setSendArea] = useState(true);
  const [roleData, setRoleData] =useState([])
  const [roleUser, setroleUser] = useState([])
  const handleBranchSelect = (event) => {
    setPreviousBranch(inputs.branch);
    setSendFranchise(false);
    setSendZone(false);
    setSendArea(false);
    // Update your 'inputs' state with the selected branch value
  };
  const [loader, setLoader] = useState(false);

  const handleFranchiseSelect = (event) => {
    setPreviousBranch(inputs.franchise);
    setSendFranchise(true);
    setSendZone(false);
    setSendArea(false);
    // Update your 'inputs' state with the selected franchise value
  };

  const handleZoneSelect = (event) => {
    setSendZone(true);
    setSendArea(false);
  };
  const handleAreaSelect = (event) => {
    setSendArea(true);
  };

  //state for franchise filter based on branch
  const [onfilterbranch, setOnfilterbranch] = useState([]);
  useEffect(() => {
    if (
      // props.customstartdate !== undefined ||
      // props.customenddate !== undefined ||
      inputs.branch !== undefined
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

  //get zone options based on branch selection
  const getlistofzones = (val) => {
    adminaxios
      .get(`franchise/${val}/zones`)
      .then((response) => {
        // setReportszone(response.data);
        // Sailaja sorting the Customer Reports -> Zone Dropdown data as alphabetical order on 29th March 2023
        setReportszone(Sorting((response.data), 'name'));


      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("token"))?.franchise === null) {
    }
    else if (JSON.parse(localStorage.getItem("token"))?.franchise?.id === JSON.parse(localStorage.getItem("token"))?.franchise?.id) {
      adminaxios
        .get(
          `franchise/${JSON.parse(localStorage.getItem("token"))?.franchise?.id
          }/zones`
        )
        .then((response) => {
          setReportszone(response.data);
        })
        .catch(function (error) {
          console.error("Something went wrong!", error);
        });
    }
  }, []);
  //end
  //get area options based on zone
  const getlistofareas = (val) => {
    if (DisplayAreas) {
    adminaxios
      .get(`accounts/zone/${val}/areas`)
      .then((response) => {
        console.log(response.data);
        // setReportsarea(response.data);
        // Sailaja sorting the Customer Reports -> Area Dropdown data as alphabetical order on 29th March 2023
        setReportsarea(Sorting((response.data), 'name'));
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
    }
  };

  // branch list
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("token"))?.branch === null) {
      adminaxios
        .get("accounts/branch/list")
        .then((res) => {
          // setReportsbranch([...res.data]);
          // Sailaja sorting the Customer Reports -> Branch Dropdown data as alphabetical order on 29th March 2023
          setReportsbranch(Sorting(([...res.data]), 'name'));
        })
        .catch((err) => console.log(err));

    } else {

    }
  }, []);

  // service list
  // useEffect(() => {
  //   servicesaxios
  //     .get("plans/dropdown/nested")
  //     .then((res) => {
  //       setServiceReports([...res.data]);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

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
    if (name == "franchiselistt") {
      getlistofzones(val);
    }
    //upon select zone display area
    if (name == "zone") {
      getlistofareas(val);
      let parsedValue = JSON.parse(val);
      console.log(parsedValue.id, "parsedValue")
      setZoneValue(parsedValue.id)
      setState(val)
      setArea(parsedValue.areas)
    }
    if (name == 'departments'){
      getUserlistRole(val)
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




  //get franchise options based on branch selection
  const getlistoffranchises = (name) => {
    adminaxios
      .get(`franchise/${name}/branch`)
      .then((response) => {
        console.log(response.data);
        // setOnfilterbranch(response.data);
        // Sailaja sorting the Customer Reports -> Franchise Dropdown data as alphabetical order on 29th March 2023
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

  let ShowAreas = false;
if (
  (token && token.user_type === "Zonal Manager") ||
  (token && token.user_type === "Staff") ||
  (token && token.user_type === "Help Desk") ||
  (token && token.user_type === "Franchise Owner")
) {
  ShowAreas = true;
}

let DisplayAreas = false;
if (
  (token && token.user_type === "Admin") ||
  (token && token.user_type === "Super Admin") ||
  (token && token.user_type === "Branch Owner")
) {
  DisplayAreas = true;
}
const getAreasforZNMR = () => {
  return (
    <>
      {ShowAreas
        ? adminaxios
          .get(`accounts/areahierarchy`)
          .then((res) => {
            setGetAreas(res.data);

            // setGetZoneAreas(res.data.franchises.zones);
          })
          .catch((error) => {
            console.log(error);
          })
        : ""}
    </>
  );
};

useEffect(() => {
  setInputs((inputs) => ({
    ...inputs,
    actstatus: 'ALL',
  }));
  getAreasforZNMR();
  adminaxios
  .get("accounts/options/all")
  .then((res) => {
    let { users,roles } = res.data;
    setRoleData([...roles])
  })
  .catch((err) =>
    console.log(err)
  );
}, []);
  //
  // end
  const getUserlistRole = (val)=>{
    adminaxios.get(`accounts/lead/${val}`).then((res)=>{
      setroleUser(res.data)
    })
    .catch(function (error) {
      console.error("Something went wrong!", error);
    });
  }
  return (
    <>
    <Container fluid={true}>
      <div className="edit-profile">
        <Row id="rowmoveup">
          {/* <Col sm="2">
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

                <Label for="meeting-time" className="kyc_label">
                  Connection Status
                </Label>
              </div>
            </FormGroup>
          </Col> */}

          <Col sm="2">
            <FormGroup>
              <div className="input_wrap">
                <Label for="meeting-time" className="kyc_label">
                  Lead Status
                </Label>
                <Input
                  className="form-control digits"
                  type="select"
                  onBlur={checkEmptyValue}
                  name="actstatus"
                  onChange={handleInputChange}
                  value={inputs && inputs.actstatus}
                >

                 {leadReportsStatusJson.map((leadStatus) => {
                          return (
                            <option value={leadStatus.id}>
                              {leadStatus.name}
                            </option>
                          );
                        })}
                </Input>


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

          {JSON.parse(localStorage.getItem("token"))?.branch?.name ? (
            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Branch </Label>
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
                </div>
              </FormGroup>
            </Col>
          ) : (
            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Branch </Label>
                  <Input
                    type="select"
                    name="branch"
                    className="form-control digits"
                    onChange={(event) => {
                      handleInputChange(event);
                      setAllReports(event.target.value);
                      handleBranchSelect(event)
                    }}

                    onBlur={checkEmptyValue}
                    value={inputs && inputs.branch}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL" selected>All</option>
                    {reportsbranch.map((branchreport) => (
                      <>
                        <option key={branchreport.id} value={branchreport.id}>
                          {branchreport.name}
                        </option>
                      </>
                    ))}
                  </Input>
                </div>
              </FormGroup>
            </Col>)}
          {JSON.parse(localStorage.getItem("token"))?.franchise?.name ? (
            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Franchise </Label>
                  <Input
                    type="text"
                    name="franchiselistt"
                    className="form-control digits"
                    onChange={handleInputChange}
                    disabled={true}
                    value={
                      JSON.parse(localStorage.getItem("token"))?.franchise?.name
                    }
                  ></Input>
                </div>
              </FormGroup>
            </Col>
          ) : (
            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Franchise</Label>
                  <Input
                    type="select"
                    name="franchiselistt"
                    className="form-control digits"
                    onChange={(e)=>{handleInputChange(e);handleFranchiseSelect(e)}}

                    onBlur={checkEmptyValue}
                    value={inputs && inputs.franchiselistt}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value="ALL7" selected>All</option>
                    {onfilterbranch.map((reportonfranchise) => (
                      <option key={reportonfranchise.id} value={reportonfranchise.id}>
                        {reportonfranchise.name}
                      </option>
                    ))}
                  </Input>

                </div>
              </FormGroup>
            </Col>)}

          {/* multiselect */}

          {/* <Col sm="2" hidden={allReports === "ALL"}>
           */}
   {ShowAreas ? (
        <Col sm="2">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Zone </Label>
              <Input
                type="select"
                name="zone"
                className="form-control digits"
                onChange={(event) => {
                  handleInputChange(event);
                  ;props.handleZoneSelect(event)
                }}
              // value={props.inputs && props.inputs.zone}
              >
                <option style={{ display: "none" }}></option>
                {getareas.franchises?.zones?.map((getzone) => (
                  <option key={getzone.id} value={JSON.stringify(getzone)} >
                    {getzone.name}
                  </option>
                ))}
              </Input>
            </div>
          </FormGroup>
        </Col>
      ) : (
        <Col sm="2">
        <FormGroup>
          <div className="input_wrap">
            <Label className="kyc_label">Zone </Label>
            <Input
              type="select"
              name="zone"
              className="form-control digits"
              onChange={(event) => {
                handleInputChange(event);
                // setAreaReports(event.target.value);
                handleZoneSelect(event)
              }}

              onBlur={checkEmptyValue}
              value={inputs && inputs.zone}
            >
              <option style={{ display: "none" }}></option>
              <option value="ALL1" selected>All</option>
              {reportszone.map((zonereport) => (
                <option key={zonereport.id} value={zonereport.id}>
                  {zonereport.name}
                </option>
              ))}
            </Input>

          </div>
        </FormGroup>
      </Col>
      )}


   
          {/* <Col sm="2" hidden={allReports === "ALL" || areaReports === "ALL1"}> */}
       


          <>
          {ShowAreas ? (
            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label" style={{ whiteSpace: "nowrap" }}>
                    Area
                  </Label>
                  <Input
                    type="select"
                    name="area"
                    className="form-control digits"
                    onChange={(e)=>{handleInputChange(e);props.handleAreaSelect(e)}}
                    value={props.inputs && props.inputs.area}
                  >
                    <option style={{ display: "none" }}></option>
                    <>
                      {area.length >= 0 && area.map((item) =>
                        <option value={item.id}>{item.name}</option>
                      )}
                    </>
                  </Input>
                </div>
              </FormGroup>
            </Col>
          ) : (
            <Col sm="2">
            <FormGroup>
              <div className="input_wrap">
                <Label
                  className="kyc_label"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Area
                </Label>
                <Input
                  type="select"
                  name="area"
                  className="form-control digits"
                  onChange={(e)=>{handleInputChange(e);
                    handleAreaSelect(e)}}

                  onBlur={checkEmptyValue}
                  value={inputs && inputs.area}
                >
                  <option style={{ display: "none" }}></option>
                  <option value="ALL2" selected>All</option>
                  {reportsarea.map((areareport) => (
                    <option key={areareport.id} value={areareport.id}>
                      {areareport.name}
                    </option>
                  ))}
                </Input>
              </div>
            </FormGroup>
          </Col>
          )}
        </>
        <Col sm="2">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label" style={{ whiteSpace: "nowrap" }}>Role</Label>
                      <Input
                        type="select"
                        // draft
                        className={`form-control digits ${inputs && inputs.department ? "" : ""
                          }`}
                        value={inputs && inputs.department}
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        name="departments"
                      >
                        <option value="" style={{ display: "none" }}></option>

                        {roleData.map((selectadmin) => {
                          return (
                            <option value={selectadmin.id}>
                              {selectadmin.name}
                            </option>
                          );
                        })}
                      </Input>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="2">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Executive Name</Label>
                      <Input
                        type="select"
                        name="assigned_to"
                        // draft
                        className={`form-control digits ${inputs && inputs.assigned_to ? "" : ""
                          }`}
                        value={inputs && inputs.assigned_to}
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{ display: "none" }}></option>
                        {roleUser.map((assignedto) => (
                          <option key={assignedto.id} value={assignedto.id}>
                            {assignedto.username}
                          </option>
                        ))}
                      </Input>
                    </div>
                  </FormGroup>
                </Col>
        {/* <Col sm="2">
            <FormGroup>
              <div className="input_wrap">
                <Label
                  className="kyc_label"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Executive Name
                </Label>
                <Input
                  type="select"
                  name="area"
                  className="form-control digits"
                  onChange={(e)=>{handleInputChange(e);
                    handleAreaSelect(e)}}

                  onBlur={checkEmptyValue}
                  value={inputs && inputs.area}
                >
                  <option style={{ display: "none" }}></option>
                  <option value="ALL2" selected>All</option>
                  {reportsarea.map((areareport) => (
                    <option key={areareport.id} value={areareport.id}>
                      {areareport.name}
                    </option>
                  ))}
                </Input>
              </div>
            </FormGroup>
          </Col> */}
          {/* <Col sm="2">
            <FormGroup>
              <div className="input_wrap">
                <Label for="meeting-time" className="kyc_label">
                  Payment Status
                </Label>
                <Input
                  className="form-control-digits"
                  type="select"
                  onBlur={checkEmptyValue}
                  onChange={handleInputChange}
                  name="paymentstatus"
                  value={inputs && inputs.paymentstatus}
                >
                  <option style={{ display: "none" }}></option>
                  <option value="ALL6" selected>All</option>
                  <option value="PD">Paid</option>
                  <option value="UPD">Unpaid</option>
                </Input>
              </div>
            </FormGroup>
          </Col> */}
        </Row>

        <Row id="searchrow">
          {/* <Col sm="6"></Col> */}
          <Col sm="6">
            <button
              style={{
                whiteSpace: "nowrap",
                // fontSize: "medium",
                height: "40px",
                position: "relative",
                top: "-62%",
                fontSize: "16px",
                fontFamily: "Open Sans",
                fontWeight: 600,
                backgroundColor: "#285295 !important",
                borderRadius: "6px"
              }}
              className="btn btn-primary openmodal"
              type="submit"
              onClick={() => setSearchbuttondisable(!searchbuttondisable)}
              // onClick={toggle}
              disabled={searchbuttondisable}
              id="reports_button"
            >
              <span style={{ marginLeft: "-10px" }} className="openmodal">
                &nbsp;&nbsp; 
                {/* {loader ? <Spinner size="sm"> </Spinner> : null} &nbsp; */}

                <b>Search</b>
              </span>
            </button>
         
          </Col>
        </Row>
        {/* {searchbuttondisable ?
          <Row id="customer_kpi">
            <TotalCountCustomer customerList={customerList} />
          </Row> : ""} */}
        <br />

        <Row>
          <Col sm="12">
            {searchbuttondisable ? (
              <Showleads
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

export default LeadsFields;
