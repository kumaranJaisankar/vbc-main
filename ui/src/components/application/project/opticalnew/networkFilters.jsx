import React, { useEffect, useState } from "react";
import { Col, Input, FormGroup, Label, Row } from "reactstrap";
import { adminaxios } from "../../../../axios";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
// Sailaja imported common component   on 14th April 2023
import { Sorting } from "../../../common/Sorting";
import { NETWORK } from "../../../../utils/permissions";

var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}
const NetworkFilters = (props) => {
  const [branchlist, setbranchList] = useState([]);
  const [onfilterbranch, setOnfilterbranch] = useState([]);
  const [reportszone, setReportszone] = useState([]);
  const [reportsarea, setReportsarea] = useState([]);
  const [area, setArea] = useState([]);

  
  //zone list
  const getlistofzones = (val) => {
    adminaxios
      .get(`franchise/${val}/zones`)
      .then((response) => {
        setReportszone(response.data);
        // Sailaja sorting the Optical Network Module -> Zone Dropdown data as alphabetical order on 14th April 2023
        setReportszone(Sorting((response.data),'name'));


      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };

  //get area options based on zone
  const getlistofareas = (val) => {
    console.log(val,"val")
    if (props.DisplayAreas) {
      adminaxios
        .get(`accounts/zone/${val}/areas`)
        .then((response) => {
          // setReportsarea(response.data);
        // Sailaja sorting the Optical Network Module -> Area Dropdown data as alphabetical order on 14th April 2023
          setReportsarea(Sorting((response.data),"name"));

        })
        .catch(function (error) {
          console.error("Something went wrong!", error);
        });
      }
  };
  // branch list
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        setbranchList([...res.data]);
        // Sailaja sorting the Optical Network Module -> Branch Dropdown data as alphabetical order on 14th April 2023
        setbranchList(Sorting(([...res.data]),"name"));

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
  //franchise
  const getlistoffranchises = (name) => {
    adminaxios
      .get(`franchise/${name}/branch`)
      .then((response) => {
        // setOnfilterbranch(response.data);
        // Sailaja sorting the Optical Network Module -> Franchise Dropdown data as alphabetical order on 14th April 2023  
        setOnfilterbranch(Sorting((response.data),"name"));
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };
  const handleInputChange = (event) => {
    event.preventDefault();
    const target = event.target;
    var value = target.value;
    let val = event.target.value;
    const name = target.name;
  
    if (name === "hardwaretype") {
      props.setInputs({
        ...props.inputs,
        branch: "",
        franchise: "",
        zone: "",
        area: "",
        [name]: value,
      });
  
      props.setBranchFilter("");
      props.setBranchId("");
      props.setFranchsieId("");
      props.setZoneId("");
      props.setAreaId("");
  
      setOnfilterbranch([]);
      setReportszone([]);
      setReportsarea([]);
    } else {
      props.setInputs((inputs) => ({
        ...inputs,
        [event.target.name]: event.target.value,
      }));
  
      if (name === "branch") {
        props.setInputs((inputs) => ({
          ...inputs,
          franchise: "", // Remove franchise value when branch is changed
          zone: "",
          area: "",
          [name]: value,
        }));
  
        if (value === "") {
          props.setFranchiseId("");
          props.setZoneId("");
          props.setAreaId("");
        }
        getlistoffranchises(val);
      }
      if (name == "franchise") {
        props.setInputs((inputs) => ({
          ...inputs,
          zone: "",
          area: "",
          [name]: value,
        }));
    
        props.setZoneId("");
        props.setAreaId("");
        getlistofzones(val);
      }
  
      if (name == "zone") {
        props.setInputs({
          ...props.inputs,
          area: "",
          [name]: value,
        });
    
        props.setAreaId("");    
        let parsedValue = JSON.parse(val);    
            getlistofareas(val);
        console.log(parsedValue.id, "parsedValue")
        props.setZoneValue(parsedValue.id)
        // setState(val)
        setArea(parsedValue.areas)

      }
    } 
    // if (name == "zone") {
    //   getlistofareas(val)
    //   getdashboardArea(val)
    //   let parsedValue = JSON.parse(val);
    //   console.log(parsedValue.id, "parsedValue")
    //   props.setZoneValue(parsedValue.id)
    //   setState(val)
    // }
  };
  // const handleInputChange = (event) => {
  //   event.preventDefault();
  //   const target = event.target;
  //   var value = target.value;
  //   let val = event.target.value;
  //   const name = target.name;
  
  //   if (name === "hardwaretype") {
  //     props.setInputs({
  //       ...props.inputs,
  //       branch: "",
  //       franchise: "",
  //       zone: "",
  //       area: "",
  //       [name]: value,
  //     });
  
  //     props.setBranchFilter("");
  //     props.setBranchId("");
  //     props.setFranchsieId("");
  //     props.setZoneId("");
  //     props.setAreaId("");
  
  //     setOnfilterbranch([]);
  //     setReportszone([]);
  //     setReportsarea([]);
  //   } else {
  //     props.setInputs((inputs) => ({
  //       ...inputs,
  //       [event.target.name]: event.target.value,
  //     }));
  
  //     if (name == "branch") {
  //       getlistoffranchises(val);
  //     }
  //     if (name == "franchise") {
  //       getlistofzones(val);
  //     }
  
  //     if (name == "zone") {
  //       getlistofareas(val);
  //     }
  //   }
  // };
  
  // const handleInputChange1 = (event) => {
  //   event.preventDefault();
  //   props.setInputs((inputs) => ({
  //     ...inputs,
  //     [event.target.name]: event.target.value,
  //   }));
  //   const target = event.target;
  //   var value = target.value;
  //   let val = event.target.value;

  //   const name = target.name;
  //   if (name == "branch") {
  //     getlistoffranchises(val);
  //   }
  //   if (name == "franchise") {
  //     getlistofzones(val);
  //   }

  //   if (name == "zone") {
  //   console.log("clicked zone")
  //     getlistofareas(val);
  //   }
  
  // };


  //   const debouncedChangeHandler = useMemo(() => {
  //   return debounce(changeHandler, 1500);
  // }, []);
  return (
    <>
      <Row>
        <Col sm="2">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label" style={{whiteSpace:"nowrap"}}>Hardware Category </Label>
              <Input
                type="select"
                name="hardware"
                className="form-control digits"
                onChange={handleInputChange}
              >
                <option style={{ display: "none" }}></option>
                <option value={"ALL1"} selected>
                  Internet
                </option>
                <option value={""}>Cable TV</option>
              </Input>
            </div>
          </FormGroup>
        </Col>
        <Col sm="2">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Hardware Type </Label>
              <Input
                type="select"
                name="hardwaretype"
                className="form-control digits"
                onChange={(event) => {
                  props.setHide(event.target.value);
                  props.setNetworkState(event.target.value);
                  props.setNetworkStateforolt(event.target.value);
                  handleInputChange(event);
                }}
                value={props.networkState}
              >
                <option style={{ display: "none" }}></option>
              <>
                <>
<option value={"nas"} selected>
                  NAS
                </option>
                <option value={"olt"}>OLT</option>
                <option value={"dp"}>DP</option>
                <option value={"cpe"}>CPE</option>
</>

                
              </>
              </Input>
            </div>
          </FormGroup>
        </Col>
        {/* <Col sm="2" > */}
        {/* {JSON.parse(localStorage.getItem("token"))?.branch?.name ? (
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
                  onChange={(e)=>{handleInputChange(e);props.handleBranchSelect(e)}}
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
        )} */}
      {  JSON.parse(localStorage.getItem("token"))?.branch?.name?  <Col sm="2">
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
                  // onChange={handleInputChange}
                  onChange={(e) => {
                    handleInputChange(e);
                    props.setBranchFilter(props.inputs.branch);
                    props.setBranchId(e.target.value);
                  }}
                  style={{ textTransform: "capitalize" }}
                  disabled={true}
                />
              </div>
            </FormGroup>
          </Col>
      
      : <Col sm="2">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Branch </Label>
              <Input
                type="select"
                name="branch"
                className="form-control digits"
                // onChange={handleInputChange}
                // onChange={(() => handleInputChange(), props.setBranchFilter)}
                onChange={(e) => {
                  handleInputChange(e);
                  props.setBranchFilter(props.inputs.branch);
                  props.setBranchId(e.target.value);
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
        </Col>}
        {JSON.parse(localStorage.getItem("token"))?.franchise?.name ? (
          <Col sm="2" hidden={props.networkState === "nas" && props.selectedTab !== "olt" }>
            <FormGroup>
              <div className="input_wrap">
                <Label className="kyc_label">Franchise </Label>
                <Input
                  type="text"
                  name="franchiselistt"
                  className="form-control digits"
                  // onChange={handleInputChange(e)}
                  onChange={(e) => {
                    handleInputChange(e);
                    props.setFranchsieId(e.target.value);
                  }}
                  disabled={true}
                  value={
                    JSON.parse(localStorage.getItem("token"))?.franchise?.name
                  }
                ></Input>
              </div>
            </FormGroup>
          </Col>
        ) : (
          // <Col sm="2">
          //   <FormGroup>
          //     <div className="input_wrap">
          //       <Label className="kyc_label">Franchise</Label>
          //       <Input
          //         type="select"
          //         name="franchise"
          //         className="form-control digits"
          //         onChange={(e)=>{handleInputChange(e);props.handleFranchiseSelect(e)}}
          //         value={props.inputs && props.inputs.franchise}
          //       >
          //         <option style={{ display: "none" }}></option>
          //         <option value={"ALL2"}>All</option>
          //         {onfilterbranch.map((reportonfranchise) => (
          //           <option
          //             key={reportonfranchise.id}
          //             value={reportonfranchise.id}
          //           >
          //             {reportonfranchise.name}
          //           </option>
          //         ))}
          //       </Input>
          //     </div>
          //   </FormGroup>
          // </Col>
          <Col sm="2" hidden={props.networkState === "nas" && props.selectedTab !== "olt" }>
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Franchise</Label>
              <Input
                type="select"
                name="franchise"
                className="form-control digits"
                onChange={(e) => {
                  handleInputChange(e);
                  props.setFranchsieId(e.target.value);
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
           {props.ShowAreas ? (
          <Col sm="2" hidden={props.networkState === "nas" && props.selectedTab !== "olt"}>
            <FormGroup>
              <div className="input_wrap">
                <Label className="kyc_label">Zone </Label>
                <Input
                  type="select"
                  name="zone"
                  className="form-control digits"
                  onChange={(event) => {
                    handleInputChange(event);
                    props.setZoneId(event.target.value);
                    // ;props.handleZoneSelect(event)
                  }}
                  value={props.inputs && props.inputs.zone}
                  >
                  <option style={{ display: "none" }}></option>
                  {props.getareas.franchises?.zones?.map((getzone) => (
                    <option key={getzone.id} value={JSON.stringify(getzone)} >
                      {getzone.name}
                    </option>
                  ))}
                </Input>
              </div>
            </FormGroup>
          </Col>
        ) : (
          <Col sm="2" hidden={props.networkState === "nas" && props.selectedTab !== "olt"}>
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Zone </Label>
              <Input
                type="select"
                name="zone"
                className="form-control digits"
                // onChange={handleInputChange}
                onChange={(e) => {
                  handleInputChange(e);
                  props.setZoneId(e.target.value);
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
      </Row>
      <Row>
            {
          <>
            {props.ShowAreas ? (
              <Col sm="2" hidden={props.networkState === "nas" && props.selectedTab !== "olt"}>
                <FormGroup>
                  <div className="input_wrap">
                    <Label className="kyc_label" style={{ whiteSpace: "nowrap" }}>
                      Area
                    </Label>
                    <Input
                      type="select"
                      name="area"
                      className="form-control digits"
                      onChange={(e)=>{handleInputChange(e);          
                        props.setAreaId(e.target.value);
                      }}
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
              // <Col sm="2">
              //   <FormGroup>
              //     <div className="input_wrap">
              //       <Label className="kyc_label" style={{ whiteSpace: "nowrap" }}>
              //         Area
              //       </Label>
              //       <Input
              //         type="select"
              //         name="area"
              //         className="form-control digits"
              //         onChange={(e)=>{handleInputChange(e);props.handleAreaSelect(e)}}
              //         value={props.inputs && props.inputs.area}
              //       >
              //         {console.log(props.inputs.area, "props.inputs.area")}
              //         <option style={{ display: "none" }}></option>
              //         <>
              //         <option value={"ALL4"}>All</option>
              //           {reportsarea.map((item) => (
              //             <option value={item.id}>{item.name}</option>
              //           ))}
              //         </>
              //       </Input>
              //     </div>
              //   </FormGroup>
              // </Col>
              <Col sm="2" hidden={props.networkState === "nas" && props.selectedTab !== "olt"}>
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
                      props.setAreaId(e.target.value);
                    }}
                    value={props.inputs && props.inputs.area}
                  >
                    <option style={{ display: "none" }}></option>
                    <>
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
        }
   
       {props.hide !="cpe" ?
        <Col sm="2">
          <Label className="kyc_label" style={{ whiteSpace: "nowrap" }}>
            Serial No.
          </Label>
          <Paper component="div" className="search_bar"  >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              // placeholder="Search With  Serial Number"
              inputProps={{ "aria-label": "search google maps" }}
              // onChange={(event) => props.handlesearchChange(event)
              // props.setSearchString(e.target.value)
              // }
              onChange={(e) => {
                props &&  props.handlesearchChange(e);
                props &&  props.setSearchString(e.target.value);
                  // props.setSerialId(e.target.value);
              }}

              value={props.searchString}
            />
            <IconButton
              type="submit"
              sx={{ p: "10px" }}
              aria-label="search"
            ></IconButton>
          </Paper>
        </Col>
      :  
      <>
      <Col sm="2">
          <Label className="kyc_label" style={{ whiteSpace: "nowrap" }}>
          Customer ID / Mobile No
          </Label>
          <Paper component="div" className="search_bar">
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              // placeholder="Search With  Serial Number"
              inputProps={{ "aria-label": "search google maps" }}
              // onChange={(event) => props.handlesearchChange(event)
              // props.setSearchString(e.target.value)
              // }
              onChange={(e) => {
                props.handlesearchChange(e)
                props.setSearchString(e.target.value)
                // props.setSerialId(e.target.value)
              }}
              value={props.searchString}
            />
            <IconButton
              type="submit"
              sx={{ p: "10px" }}
              aria-label="search"
            ></IconButton>
          </Paper>
        </Col>
        {/* &nbsp;&nbsp;
        <Col sm="2">
          <Label className="kyc_label" style={{ whiteSpace: "nowrap" }}>
      Mobile No
          </Label>
          <Paper component="div" className="search_bar">
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              // placeholder="Search With  Serial Number"
              inputProps={{ "aria-label": "search google maps" }}
              // onChange={(event) => props.handlesearchChange(event)
              // props.setSearchString(e.target.value)
              // }
              onChange={(e) => {
                props.handlesearchChange(e)
                props.setSearchString(e.target.value)
                // props.setSerialId(e.target.value)
              }}
              value={props.searchString}
            />
            <IconButton
              type="submit"
              sx={{ p: "10px" }}
              aria-label="search"
            ></IconButton>
          </Paper>
        </Col> */}
        </>
      }
      </Row>
    </>
  );
};

export default NetworkFilters;
