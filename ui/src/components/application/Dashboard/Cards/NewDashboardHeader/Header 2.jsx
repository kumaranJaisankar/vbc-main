import React, { useState } from "react";
import Slider from "rc-slider";
import Stack from "@mui/material/Stack";
import { Input, Label, Row, Col, FormGroup } from "reactstrap";
import Grid from "@mui/material/Grid";
import "rc-slider/assets/index.css";

// function log(value) {
//   console.log(value); //eslint-disable-line
// }

const Header = (props) => {
  //handler for custom date
  const customHandler = (e) => {
    if (e.target.name === "start_date") {
      props.setHeadercustomstartdate(e.target.value);
    }
    if (e.target.name === "end_date") {
      props.setHeaderCustomenddate(e.target.value);
    }
  };

  const marks = {
    30: {
      label: (
        <span value="last30days" onClick={props.headerDaterangeselection}>
          <p>Last 30 days</p>
        </span>
      ),
    },
    50: {
      label: (
        <span value="last15days" onClick={props.headerDaterangeselection15}>
          <p>Last 15 days</p>
        </span>
      ),
    },
    68: {
      label: (
        <span value="last7days" onClick={props.headerDaterangeselection7}>
          <p>Last 7 Days</p>
        </span>
      ),
    },
    88: {
      label: (
        <span value="today" onClick={props.headerDaterangeselection_Today}>
          <p>Today</p>
        </span>
      ),
    },
  };

  return (
    <>
      <Grid container spacing={2} sx={{ position: "relative", top: "23px" }}>
        <Grid md={7}>
          <p
            style={{
              fontFamily: "Open Sans",
              fontStyle: "normal",
              fontWeight: 700,
              fontSize: "25px",
              position: "relative",
              left: "19px",
              top: "-10px",
            }}
          >
            Dashboard
          </p>
        </Grid>
        <Grid md={5} sx={{ position: "relative", top: "31px" }}>
          <Slider
            style={{ position: "relative", top: "-27px" }}
            min={20}
            defaultValue={88}
            marks={marks}
            // {{
            //    30: 'Last 30 days',

            //    50: 'Last 15 days',68:'Last 7 days', 88: 'Today'
            //    }}
            step={null}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid md={6}>
          <p
            style={{
              fontFamily: "Open Sans",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "20px",
              position: "relative",
              top: "-15px",
              left: "5px",
            }}
          >
            As on Today
          </p>
        </Grid>
        <Grid md={4}>
          <p
            style={{
              fontFamily: "Open Sans",
              fontStyle: "normal",
              fontWeight: 600,
              fontSize: "16px",
              position: "relative",
              top: "-71px",
              left: "144px",

              // top: "-10px",
              // left:"7px"
            }}
          >
            View results zdsacfor
          </p>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={1}
        sx={{ position: "absolute", left: "13%", top: "149px" }}
      >
        {props.headerCalender ? (
          <div style={{ display: "flex" }}>
            <Grid xs={4} md={6} sm={4}>
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
            <Grid xs={4} md={6} sm={4}>
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    className={`form-control-digits not-empty`}
                    onChange={customHandler}
                    type="date"
                    id="meeting-time"
                    name="end_date"
                    min={props.headercustomstartdate}
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
export default Header;
