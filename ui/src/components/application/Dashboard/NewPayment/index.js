import React from "react";
import Grid from "@mui/material/Grid"
import { Input, Label, Row, Col, FormGroup } from "reactstrap";
const PaymentDateRange = (props) => {
 
  //handler for custom date
  const customHandler = (e) => {
    if (e.target.name === "start_date") {
      props.setPayemntcustomstartdate(e.target.value);
      
    }
    if (e.target.name === "end_date") {
      props.setPaymentCustomenddate(e.target.value);
    }
  };


  return (
    <>
      <div className="input_wrap" style={{ position: "relative", top: "5px",left: "228px" }}>
        <Input
          className={`form-control-digits not-empty`}
          type="select"
          name=""
          value={props.paymentDaterange}
          onChange={props.paymentDaterangeselection}
          style={{
            width: "fit-content",
            border: "1px solid rgba(25, 118, 210, 0.5",
            borderRadius: "4px",
            height: "38px",
            justifyContent:"right"
            // width: "107px",
            // paddingLeft:"20px",
          }}
        >
          {/* <Input onChange={daterangeselection}> */}
          <option value="" style={{ display: "none" }}></option>
          <option value="today" selected className="dLQYrt">
            Today
          </option>
          <option value="last7days" className="dLQYr">
            Last 7 Days
          </option>
          <option value="last15days" className="dLQYrt">
            Last 15 Days
          </option>
          <option value="last30days" className="dLQYrt">
            Last 30 Days
          </option>
          <option value="custom" className="dLQYrt">
            Custom
          </option>
        </Input>
        <Label
          for="meeting-time"
          className="placeholder_styling"
          style={{
            color: "black",
            fontWeight: "400",
            fontSize: "0.875rem",
          }}
        >
          Date Range
        </Label>
      </div>
      <Grid container spacing={1} sx={{position: "absolute", top: "79%",left: "23%"}}>
        {props.paymentCalender ? (
          <div style={{ display: "flex", justifyContent:"right" }}>
            <Grid  xs={4} md={5} sm ={4} >
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    className={`form-control-digits not-empty`}
                    onChange={customHandler}
                    type="date"
                    id="meeting-time"
                    name="start_date"
                  />
                  <Label for="meeting-time" className="placeholder_styling">
                    Start Date
                  </Label>
                </div>
              </FormGroup>
            </Grid>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Grid  xs={4} md={5} sm={4} >
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    className={`form-control-digits not-empty`}
                    onChange={customHandler}
                    type="date"
                    id="meeting-time"
                    name="end_date"
                    min={props.paymentcustomstartdate}
                  />
                  <Label for="meeting-time" className="placeholder_styling">
                    End Date
                  </Label>
                </div>
              </FormGroup>
            </Grid>
          </div>
        ) : (
          ""
        )}
      </Grid>
    </>
  );
};
export default PaymentDateRange;
