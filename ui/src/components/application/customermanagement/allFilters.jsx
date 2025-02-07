import React, { useEffect, useState } from "react";
import { Col, Input, FormGroup, Label, Row } from "reactstrap";
import { adminaxios } from "../../../axios";
// Sailaja imported common component Sorting on 24th March 2023
import { Sorting } from "../../common/Sorting";

const AllFilters = (props) => {
  const [branchlist, setbranchList] = useState([]);
  const [buttondisable, setButtondisable] = useState(true);
  //state for franchise filter based on branch
  const [onfilterbranch, setOnfilterbranch] = useState([]);
  // get zone list in based on franchise
  const [reportszone, setReportszone] = useState([]);
  //area state based on zone selection
  const [reportsarea, setReportsarea] = useState([]);
  // dashboard arre
  const [aralist, setAreaList] = useState([]);

  const [state, setState] = useState({});
  const [area, setArea] = useState([]);

  useEffect(() => {
    if (
      props.inputs?.branch !== undefined ||
      props.inputs?.franchise !== undefined ||
      props.inputs?.zone !== undefined ||
      props.inputs?.area !== undefined ||
      props.inputs?.is_gst !== undefined
    ) {
      setButtondisable(false);
    }
  }, [props.inputs]);

  // branch list
  // Sailaja Sorted
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        // Sailaja sorting the Customer List Branch Dropdown data as alphabetical order on 24th March 2023
        setbranchList(Sorting([...res?.data], "name"));
        console.log(setbranchList, "setbranchList");
      })
      .catch((err) => console.log(err));
  }, []);

  //get franchise options based on branch selection
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("token"))?.branch === null) {
    } else {
      adminaxios
        .get(
          `franchise/${
            JSON.parse(localStorage.getItem("token"))?.branch?.id
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
  const getlistoffranchises = (name) => {
    adminaxios
      .get(`franchise/${name}/branch`)
      .then((response) => {
        console.log(response.data, "data");
        // setOnfilterbranch(response.data);
        // Sailaja sorting the  Customer List Franchise Dropdown data as alphabetical order on 24th March 2023
        setOnfilterbranch(Sorting(response?.data, "name"));
        console.log(setOnfilterbranch, "data");
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };

  //get zone options based on franchise selection
  const getlistofzones = (val) => {
    adminaxios
      .get(`franchise/${val}/zones`)
      .then((response) => {
        console.log(response.data);
        // setReportszone(response.data);
        // Sailaja sorting the  Customer List Zone Dropdown data as alphabetical order on 24th March 2023
        setReportszone(Sorting(response?.data, "name"));
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("token"))?.franchise === null) {
    } else {
      adminaxios
        .get(
          `franchise/${
            JSON.parse(localStorage.getItem("token"))?.franchise?.id
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

  //handle change event
  const handleInputChange = (event) => {
    event.persist();
    props.setInputs((inputs) => ({
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
    if (name == "franchise") {
      getlistofzones(val);
    }

    if (name == "zone") {
      console.log(val, "checkzonevalue");
      getlistofareas(val);
      getdashboardArea(val);
      let parsedValue = JSON.parse(val);
      console.log(parsedValue.id, "parsedValue");
      props.setZoneValue(parsedValue.id);
      setState(val);
      setArea(parsedValue.areas);
    }
  };

  //get area options based on zone
  const getlistofareas = (val) => {
    if (props.DisplayAreas) {
      adminaxios
        .get(`accounts/zone/${val}/areas`)
        .then((response) => {
          console.log(response.data);
          // setReportsarea(response.data);
          // Sailaja sorting the  Customer List Area Dropdown data as alphabetical order on 24th March 2023
          setReportsarea(Sorting(response?.data, "name"));
        })
        .catch(function (error) {
          console.error("Something went wrong!", error);
        });
    }
  };

  const getdashboardArea = (val) => {
    if (props.showOnlyExportButton) {
      adminaxios
        .get(`accounts/zone/${val}/areas`)
        .then((response) => {
          setAreaList(response.data);
        })
        .catch(function (error) {
          console.error("Something went wrong!", error);
        });
    }
  };

  return (
    <>
      <Row>
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
                <Label className="kyc_label">Branch</Label>
                <Input
                  type="select"
                  name="branch"
                  className="form-control digits"
                  onChange={(e) => {
                    handleInputChange(e);
                    props.handleBranchSelect(e);
                  }}
                  value={props.inputs && props.inputs.branch}
                >
                  <option style={{ display: "none" }}></option>
                  <option value={"ALL1"}>All</option>
                  {branchlist.map((branchreport) => (
                    <>
                      <option key={branchreport.id} value={branchreport.id}>
                        {branchreport.name}
                      </option>
                    </>
                  ))}
                </Input>
              </div>
            </FormGroup>
          </Col>
        )}
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
                  name="franchise"
                  className="form-control digits"
                  onChange={(e) => {
                    handleInputChange(e);
                    props.handleFranchiseSelect(e);
                  }}
                  value={props.inputs && props.inputs.franchise}
                >
                  <option style={{ display: "none" }}></option>
                  <option value={"ALL2"}>All</option>
                  {onfilterbranch.map((reportonfranchise) => (
                    <option
                      key={reportonfranchise.id}
                      value={reportonfranchise.id}
                    >
                      {reportonfranchise.name}
                    </option>
                  ))}
                </Input>
              </div>
            </FormGroup>
          </Col>
        )}
        {/* {props.showOnlyExportButton  ?<>
          <Col sm="2">
            <FormGroup>
              <div className="input_wrap">
                <Label className="kyc_label">Zone</Label>
                <Input
                  type="select"
                  name="zone"
                  className="form-control digits"
                  onChange={(event)=>{handleInputChange(event);props.handleZoneSelect(event)}}
                  value={props.inputs && props.inputs.zone}
                >
                  <option style={{ display: "none" }}></option>
                  <option value={"ALL3"}>All</option>
                  {reportszone.map((zonereport) => (
                    <option key={zonereport.id} value={zonereport.id}>
                      {zonereport.name}
                    </option>
                  ))}
                </Input>
              </div>
            </FormGroup>
          </Col>
        </>:<>
        */}
        {props.ShowAreas ? (
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
                    props.handleZoneSelect(event);
                  }}
                  // value={props.inputs && props.inputs.zone}
                >
                  <option style={{ display: "none" }}></option>
                  {props.getareas.franchises?.zones?.map((getzone) => (
                    <option key={getzone.id} value={JSON.stringify(getzone)}>
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
                <Label className="kyc_label">Zone</Label>
                <Input
                  type="select"
                  name="zone"
                  className="form-control digits"
                  onChange={(e) => {
                    handleInputChange(e);
                    props.handleZoneSelect(e);
                  }}
                  value={props.inputs && props.inputs.zone}
                >
                  <option style={{ display: "none" }}></option>
                  <option value={"ALL3"}>All</option>
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
        {/* </> */}
        {/* } */}

        {props.showOnlyExportButton ? (
          <>
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
                    onChange={(e) => {
                      handleInputChange(e);
                      props.handleAreaSelect(e);
                    }}
                    value={props.inputs && props.inputs.area}
                  >
                    <option style={{ display: "none" }}></option>
                    <>
                      <option value={"ALL4"}>All</option>
                      {aralist.map((item) => (
                        <option value={item.id}>{item.name}</option>
                      ))}
                    </>
                  </Input>
                </div>
              </FormGroup>
            </Col>
          </>
        ) : (
          <>
            {props.ShowAreas ? (
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
                      onChange={(e) => {
                        handleInputChange(e);
                        props.handleAreaSelect(e);
                      }}
                      value={props.inputs && props.inputs.area}
                    >
                      <option style={{ display: "none" }}></option>
                      <>
                        {area.length >= 0 &&
                          area.map((item) => (
                            <option value={item.id}>{item.name}</option>
                          ))}
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
                      onChange={(e) => {
                        handleInputChange(e);
                        props.handleAreaSelect(e);
                      }}
                      value={props.inputs && props.inputs.area}
                    >
                      {console.log(props.inputs.area, "props.inputs.area")}
                      <option style={{ display: "none" }}></option>
                      <>
                        <option value={"ALL4"}>All</option>
                        {reportsarea.map((item) => (
                          <option value={item.id}>{item.name}</option>
                        ))}
                      </>
                    </Input>
                  </div>
                </FormGroup>
              </Col>
            )}
          </>
        )}
        {props.showOnlyExportButton ? (
          ""
        ) : (
          <>
            <Col sm="2">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label" style={{ whiteSpace: "nowrap" }}>
                    GSTIN
                  </Label>
                  <Input
                    type="select"
                    name="is_gst"
                    className="form-control digits"
                    onChange={handleInputChange}
                    value={props.inputs && props.inputs.is_gst}
                  >
                    <option style={{ display: "none" }}></option>
                    <option value={"ALL5"}>All</option>
                    <option value={"true"}>Yes</option>
                    <option value={"false"}>No</option>
                  </Input>
                </div>
              </FormGroup>
            </Col>
            <Col sm="2">
              <div className="input_wrap">
                <Label for="meeting-time" className="kyc_label">
                  Select Date Range
                </Label>
                <Input
                  className={`form-control-digits not-empty`}
                  type="select"
                  name="daterange"
                  onChange={props.basedonrangeselector}
                  style={{
                    border: "1px solid rgba(25, 118, 210, 0.5",
                    borderRadius: "4px",
                  }}
                >
                  {/* Sailaja Changed Until Spell on 26th July */}
                  <option value="" style={{ display: "none" }}></option>
                  <option value="ALL6" selected>
                    Until Today
                  </option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="lastweek">Last Week</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="lastmonth">Last Month</option>
                  <option value="custom">Custom</option>
                </Input>
              </div>
            </Col>
            {props.showhidecustomfields ? (
              <>
                <Col sm="2">
                  {/* <Col sm="7"> */}
                  <FormGroup>
                    <div className="input_wrap">
                      <Label for="meeting-time" className="kyc_label">
                        From Date
                      </Label>
                      <Input
                        className={`form-control-digits not-empty`}
                        onChange={props.customHandler}
                        type="date"
                        id="meeting-time"
                        name="start_date"
                        value={!!props.customstartdate && props.customstartdate}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="2">
                  {/* <Col sm="7" style={{ marginLeft: "-6px" }}> */}
                  <FormGroup>
                    <div className="input_wrap">
                      <Label for="meeting-time" className="kyc_label">
                        To Date
                      </Label>
                      <Input
                        className={`form-control-digits not-empty`}
                        onChange={props.customHandler}
                        type="date"
                        id="meeting-time"
                        name="end_date"
                        value={!!props.customenddate && props.customenddate}
                      />
                    </div>
                  </FormGroup>
                </Col>
              </>
            ) : (
              ""
            )}
          </>
        )}
      </Row>
    </>
  );
};

export default AllFilters;
