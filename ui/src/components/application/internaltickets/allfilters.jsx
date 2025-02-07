import React, { useEffect, useState } from "react";
import { Col, Input, FormGroup, Label,Row } from "reactstrap";
import moment from "moment";
import { helpdeskaxios, adminaxios } from "../../../axios";
import { useLocation } from "react-router-dom";

// Sailaja imported common component Sorting on 27th March 2023
import { Sorting } from "../../common/Sorting";


const Allfilter = (props) => {
  const location = useLocation();
  const [searchbuttondisable, setSearchbuttondisable] = useState(true);
  const [ticketSubcategory, setTicketSubcategory] = useState([]);
  const [reportsbranch, setReportsbranch] = useState([]);
  //state for franchise filter based on branch
  const [onfilterbranch, setOnfilterbranch] = useState([]);
  // get zone list in based on franchise
  const [reportszone, setReportszone] = useState([]);
  const [zonelist, setZonelist] = useState([]);
  //state added by marieya for list odf franchises based on user login
  const [selectedDate, setSelectedDate] = useState();

  //area state based on zone selection
  const [reportsarea, setReportsarea] = useState([]);
  // const [status,setStatus] = useState([]);
  const [state, setState] = useState({});
  const [area, setArea] = useState([]);
  //state for hiding until today
  const [hidden, setHidden] = useState("ALL9");
  const [hide, setHide] = useState("today");
  const [hideyesterday, setHideyyesterday] = useState("yesterday");


  const [refrence, setRefrence] = useState("open_date");


  useEffect(() => {
    if (
      (props.inputs?.catrgoryLists !== undefined,
        props.inputs?.subcatlists !== undefined,
        props.inputs?.priority !== undefined,
        props.inputs?.status !== undefined,
        props.inputs?.branch !== undefined,
        props.inputs?.franchiselistt !== undefined ||
        props.inputs?.zone !== undefined ||
        props.inputs?.area !== undefined ||
        props.inputs?.assign !== undefined ||
        props.inputs?.daterange !== undefined
        // props.inputs?.resolved_date_end !== undefined
      )
    ) {
      setSearchbuttondisable(false);
    }
  }, [props.inputs]);
  // Sailaja sorting the Complaints-> Sub Category Dropdown data as alphabetical order on 10th April 2023
  const getsubCategory = (val) => {
    helpdeskaxios
      .get(`sub/ticketcategory/${val}`)
      .then((res) => setTicketSubcategory(Sorting((res.data), 'name')))
  };

  //handle change event
  const handleInputChange = (event) => {
    event.persist();
    props.setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
    let val = event.target.value;

    const target = event.target;
    const name = target.name;
    if (name == "catrgoryLists") {
      getsubCategory(val);
    }
    if (name == "branch") {
      getlistoffranchises(val);
    }
    if (name == "franchiselistt") {
      getlistofzones(val);
    }
    // if (name == "zone") {
    //   getlistofareas(val);
    // }
    if (name == "zone") {
      getlistofareas(val);
      let parsedValue = JSON.parse(val);
      console.log(parsedValue.id, "parsedValue");
      props.setZoneValue(parsedValue.id);
      setState(val);
      setArea(parsedValue.areas);
    }
  };

  // branch list
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        // setReportsbranch([...res.data]);
        // Sailaja sorting the Complaints->  Branch Dropdown data as alphabetical order on 27th March 2023
        setReportsbranch(Sorting(([...res.data]), 'name'));
      })
      .catch((err) => console.log(err));
  }, []);
  //get franchise options based on branch selection
  const getlistoffranchises = (name) => {
    adminaxios
      .get(`franchise/${name}/branch`)
      .then((response) => {
        // setOnfilterbranch(response.data);
        // Sailaja sorting the   Complaints-> Franchise Dropdown data as alphabetical order on 27th March 2023
        setOnfilterbranch(Sorting((response.data), 'name'));
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };
  // list of franchise based on user login
  useEffect(() => {
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
  }, []);

  //get zone options based on franchise selection
  const getlistofzones = (val) => {
    adminaxios
      .get(`franchise/${val}/zones`)
      .then((response) => {
        // setReportszone(response.data);
        // Sailaja sorting the Complaints-> Zone Dropdown data as alphabetical order on 27th March 2023
        setReportszone(Sorting((response.data), 'name'));

      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };
  //get area options based on zone
  const getlistofareas = (val) => {
    if (props.DisplayAreas) {
      adminaxios
        .get(`accounts/zone/${val}/areas`)
        .then((response) => {
          // setReportsarea(response.data);
          // Sailaja sorting the Complaints-> Area Dropdown data as alphabetical order on 27th March 2023
          setReportsarea(Sorting((response.data), 'name'));
        })
        .catch(function (error) {
          console.error("Something went wrong!", error);
        });
    }
  };

  useEffect(() => {
    adminaxios
      .get(
        `franchise/${JSON.parse(localStorage.getItem("token"))?.franchise?.id
        }/zones`
      )
      .then((response) => {
        setZonelist(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  }, []);



  return (
    <>
      {location?.state?.customstartdate ===
        moment().subtract(7, "d").format("YYYY-MM-DD") ? (
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
              {/* <option value="ALL9" >Until Today</option> */}
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="lastweek">Last Week</option>
              <option value="last7days" selected>
                Last 7 Days
              </option>
              <option value="last15days">Last 15 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="lastmonth">Last Month</option>
              <option value="custom">Custom</option>
            </Input>
          </div>
        </Col>
      ) : location?.state?.customstartdate ===
        moment().subtract(30, "d").format("YYYY-MM-DD") ? (
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
              <option value="" style={{ display: "none" }}></option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="lastweek">Last Week</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last15days">Last 15 Days</option>
              <option value="last30days" selected>
                Last 30 days
              </option>
              <option value="lastmonth">Last Month</option>
              <option value="custom">Custom</option>
            </Input>
          </div>
        </Col>
      ) : location?.state?.customstartdate ===
        moment().subtract(15, "d").format("YYYY-MM-DD") ? (
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
              {/* <option value="ALL9" >Until Today</option> */}
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="lastweek">Last Week</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last15days" selected>
                Last 15 days
              </option>
              <option value="last30days">Last 30 Days</option>
              <option value="lastmonth">Last Month</option>
              <option value="custom">Custom</option>
            </Input>
          </div>
        </Col>
      ) : location?.state?.customstartdate === moment().format("YYYY-MM-DD") ? (
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
              <option value="" style={{ display: "none" }}></option>
              {/* <option value="ALL9" >Until Today</option> */}
              <option value="today" selected>
                Today
              </option>
              <option value="yesterday">Yesterday</option>
              <option value="lastweek">Last Week</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last15days">Last 15 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="lastmonth">Last Month</option>
              <option value="custom">Custom</option>
            </Input>
          </div>
        </Col>
      ) : location?.state?.pathFrom === "complaintCard" ? (
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
              <option value="" style={{ display: "none" }}></option>
              <option value="ALL9" selected>Until Today</option>
              <option value="today">
                Today
              </option>
              <option value="yesterday">Yesterday</option>
              <option value="lastweek">Last Week</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last15days">Last 15 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="lastmonth">Last Month</option>
              <option value="custom">Custom</option>
            </Input>
          </div>
        </Col>
      ): (
        <Col sm="2">
          <div className="input_wrap">
            <Label for="meeting-time" className="kyc_label">
              Select Date Range
            </Label>
            <Input
              className={`form-control-digits not-empty`}
              type="select"
              name="daterange"
              onChange={(event) => {
                props.basedonrangeselector(event);
                setHidden(event.target.value)
                setHide(event.target.value)
                setHideyyesterday(event.target.value)
              }}
              style={{
                border: "1px solid rgba(25, 118, 210, 0.5",
                borderRadius: "4px",
              }}
            >
              <option value="" style={{ display: "none" }}></option>
              <option value="ALL9" >
                Until Today
              </option>
              <option value="today" selected>Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="lastweek">Last Week</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last15days">Last 15 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="lastmonth">Last Month</option>
              <option value="custom">Custom</option>
            </Input>
          </div>
        </Col>
      )}

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
      {hidden != "ALL9" &&
        <Col sm="2">
          <div className="input_wrap">
            <Label for="meeting-time" className="kyc_label">
              Date
            </Label>
            <Input
              className={`form-control-digits not-empty`}
              type="select"
              name="date"
              value={props.inputs && props.inputs.date}
              onChange={(event) => {
                handleInputChange(event);
                setRefrence(event.target.value);
              }}
              style={{
                border: "1px solid rgba(25, 118, 210, 0.5",
                borderRadius: "4px",
              }}
            >
              {/* {hidden === "ALL9" ? */}
              {/* <>
            <option value="" style={{ display: "none" }}></option>
            <option value="open_date">Open Date</option>
            <option value="closed_date">Closed Date</option>
      
            </>: */}
              <>
                <option value="" style={{ display: "none" }}></option>
                <option value="open_date">Open Date</option>
                <option value="closed_date">Closed Date</option>


                {/* <option value="both">Both</option> */}
              </>
              {/* } */}
            </Input>
          </div>
        </Col>}
      {hide != "today" && hideyesterday != "yesterday" &&
        <>
          {refrence != "closed_date" ? <Col sm="2">
            <div className="input_wrap">
              <Label for="meeting-time" className="kyc_label">
                Resolved In
              </Label>
              <Input
                className={`form-control-digits not-empty`}
                type="select"
                name="resolved_date_end"
                value={props.inputs && props.inputs.resolved_date_end}
                onChange={(event) => {
                  handleInputChange(event);
                }}
                style={{
                  border: "1px solid rgba(25, 118, 210, 0.5",
                  borderRadius: "4px",
                }}
              >
                <option value="" style={{ display: "none" }}></option>
                <option value="1_day">1 Day</option>
                <option value="2_day">2 Days</option>
                <option value="3_day">3 Days</option>
                <option value="greater_than_3">Greater than 3 Days</option>
              </Input>
            </div>
          </Col>
            : ""
          }
        </>
      }


      {JSON.parse(localStorage.getItem("token"))?.branch?.name ? (
        <Col sm="2">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Branch </Label>
              <Input
                className={`form-control digits not-empty`}
                value={JSON.parse(localStorage.getItem("token"))?.branch?.name}
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
                <option value="ALL5">All</option>
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
                name="franchiselistt"
                className="form-control digits"
                onChange={(e)=>{handleInputChange(e);props.handleFranchiseSelect(e)}}

                value={props.inputs && props.inputs.franchiselistt}
              >
                <option style={{ display: "none" }}></option>
                <option value="ALL6">All</option>
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

      {/* zone */}

      {/* ): */}

      {console.log(zonelist, "zonelist")}

      {props.ShowAreas ? (
        <>
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
                  }}
                //   value={props.inputs && props.inputs.zone}
                >
                  <option style={{ display: "none" }}></option>
                  <option value="">All</option>
                  {props.getareas.franchises?.zones?.map((getzone) => (
                    <option key={getzone.id} value={JSON.stringify(getzone)}>
                      {getzone.name}
                    </option>
                  ))}
                </Input>
              </div>
            </FormGroup>
          </Col>
        </>
      ) : (
        // JSON.parse(localStorage.getItem("token")) &&
        // JSON.parse(localStorage.getItem("token")).franchise?.name ? (
        // <>
        //   <Col sm="2">
        //     <FormGroup>
        //       <div className="input_wrap">
        //         <Label className="kyc_label">Zone333 </Label>
        //         <Input
        //           type="select"
        //           name="zone"
        //           className="form-control digits"
        //           onChange={handleInputChange}
        //           value={props.inputs && props.inputs.zone}
        //         >
        //           <option style={{ display: "none" }}></option>
        //           <option value="ALL7">All</option>
        //           {zonelist.map((zonereport) => (
        //             <option key={zonereport.id} value={zonereport.id}>
        //               {zonereport.name}
        //             </option>
        //           ))}
        //         </Input>
        //       </div>
        //     </FormGroup>
        //   </Col>
        // </>): (
        <Col sm="2">
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Zone</Label>
              <Input
                type="select"
                name="zone"
                className="form-control digits"
                onChange={(e)=>{handleInputChange(e);props.handleZoneSelect(e)}}

                value={props.inputs && props.inputs.zone}
              >
                <option style={{ display: "none" }}></option>
                <option value="ALL7">All</option>
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
      {props.ShowAreas ? (
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
                onChange={handleInputChange}
                value={props.inputs && props.inputs.area}
              >
                <option style={{ display: "none" }}></option>
                <option value="">All</option>
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
                <option value="ALL8">All</option>
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
      <Col sm="2">
        <FormGroup>
          <div className="input_wrap">
            <Label className="kyc_label">Category</Label>
            <Input
              type="select"
              name="catrgoryLists"
              className="form-control digits"
              value={props.inputs?.catrgoryLists}
              onChange={handleInputChange}
            >
              <option style={{ display: "none" }}></option>
              <option value="ALL1">All</option>
              {props.categoryList.map((branchreport) => (
                <>
                  <option key={branchreport.id} value={branchreport.id}>
                    {branchreport.category}
                  </option>
                </>
              ))}
            </Input>
          </div>
        </FormGroup>
      </Col>
      <Col sm="2">
        <FormGroup>
          <div className="input_wrap">
            <Label className="kyc_label">Sub Category</Label>
            <Input
              type="select"
              name="subcatlists"
              className="form-control digits"
              onChange={handleInputChange}
              value={props.inputs && props.inputs.subcatlists}
            >
              <option style={{ display: "none" }}></option>
              <option value="ALL2">All</option>
              {ticketSubcategory.map((reportonfranchise) => (
                <option key={reportonfranchise.id} value={reportonfranchise.id}>
                  {reportonfranchise.name}
                </option>
              ))}
            </Input>
          </div>
        </FormGroup>
      </Col>

      <Col sm="2">
        <FormGroup>
          <div className="input_wrap">
            <Label className="kyc_label">Priority</Label>
            <Input
              type="select"
              name="priority"
              className="form-control digits"
              onChange={handleInputChange}
              value={props.inputs && props.inputs.priority}
            >
              <option style={{ display: "none" }}></option>
              <option value="ALL4">All</option>
              {props.ticketPriority.map((reportforpriority) => (
                <option key={reportforpriority.id} value={reportforpriority.id}>
                  {reportforpriority.name}
                </option>
              ))}
            </Input>
          </div>
        </FormGroup>
      </Col>
      {/*Added Status Field by Marieya on 27.8.22 */}
      {/* <Col sm="2">
        <FormGroup>
          <div className="input_wrap">
            <Label className="kyc_label">Status</Label>
            <Input
              type="select"
              name="status"
              className="form-control digits"
              onChange={handleInputChange}
              value={props.inputs && props.inputs.status}
            >
              <option style={{ display: "none" }}></option>
              <option value="ALL3">All</option>
              {props.ticketSattaus1.map((ticketstatus) => (
                <option key={ticketstatus.id} value={ticketstatus.id}>
                  {ticketstatus.name}
                </option>
              ))}
            </Input>
          </div>
        </FormGroup>
      </Col> */}
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
              {props.assigntoFilter.map((assignto) => (
                <option key={assignto.id} value={assignto.id}>
                  {assignto.username}
                </option>
              ))}
            </Input>
          </div>
        </FormGroup>
      </Col>
      {<Col sm="2">
        <FormGroup>
          <div className="input_wrap">
            <Label className="kyc_label">Technician Comment</Label>
            <Input
              type="select"
              name="technician_comment"
              className="form-control digits"
              onChange={handleInputChange}
              value={props.inputs && props.inputs.technician_comment}
            >
              <option style={{ display: "none" }}></option>
              <option value="ALL11">All</option>
              {props.techniciandata.map((technician) => (
                <option key={technician.id} value={technician.id}>
                  {technician.name}
                </option>
              ))}
            </Input>
          </div>
        </FormGroup>
      </Col>

      }
    </>
  );
};
export default Allfilter;
