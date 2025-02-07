import React, { useState, useRef,  useEffect } from "react";


import { customeraxios } from "../../../axios";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "../../../mui/accordian";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";



const Yesterdaydata = () => {
  //refresh button functionality
  const [reportrefresh, setReportrefresh] = useState(0);
  const [yesterdayInfo, setYesterdayinfo] = useState(null);

  const Refreshhandler = () => {
    setReportrefresh(1);
    if (searchInputField.current) searchInputField.current.value = "";
  };
  const searchInputField = useRef(null);
  const ref = useRef();

  const [expanded, setExpanded] = React.useState("panel5");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  //   const fetchTodaysdata = useCallback(async (id, name) => {
  //     try {
  //       const response = await customeraxios.get(`customers/analytics`);
  //       setTodayinfo(pick(response.data, [...Object.keys(todaysdata)]));
  //     } catch (e) {
  //       setTodayinfo(null);
  //     }
  //   }, []);

  //   useEffect(() => {
  //     fetchTodaysdata();
  //   }, []);
  // useEffect(() => {
  //   customeraxios
  //     .get(`customers/analytics`)
  //     .then((res) => setYesterdayinfo(res.data));
  // }, []);

  return (
    <Accordion
      style={{
        borderRadius: "15px",
        boxShadow: "0 0.2rem 1rem rgba(0, 0, 0, 0.15)",
        flex: "0 0 100%",
      }}
      expanded={expanded === "panel5"}
      onChange={handleChange("panel5")}
    >
      <AccordionSummary
        aria-controls="panel1a-content"
        id="online-session-info"
      >
        <Typography variant="h6" className="customerdetailsheading">
          Yesterday
        </Typography>
      </AccordionSummary>
      <AccordionDetails style={{ lineHeight: "3rem" }}>
        <Grid spacing={1} container>
          <Grid item md="6">
            <h6 className="reports_text">New Connections</h6>
          </Grid>
          <Grid item md="6">
            <h6 style={{ textAlign: "right" }}>
              <span style={{ fontWeight: "500" }}>
                {yesterdayInfo && yesterdayInfo.yesterday_activations}
              </span>
            </h6>
          </Grid>
        </Grid>
      </AccordionDetails>

      <AccordionDetails style={{ lineHeight: "3rem" }}>
        <Grid spacing={1} container>
          <Grid item md="6">
            <h6 className="reports_text">Expiry</h6>
          </Grid>
          <Grid item md="6">
            <h6 style={{ textAlign: "right" }}>
              <span style={{ fontWeight: "500" }}>
                {yesterdayInfo && yesterdayInfo.yesterday_expiry
                  ? yesterdayInfo && yesterdayInfo.yesterday_expiry
                  : "0"}
              </span>
            </h6>
          </Grid>
        </Grid>
      </AccordionDetails>

      <AccordionDetails style={{ lineHeight: "3rem" }}>
        <Grid spacing={1} container>
          <Grid item md="6">
            <h6 className="reports_text">Renewals</h6>
          </Grid>
          <Grid item md="6">
            <h6 style={{ textAlign: "right" }}>
              <span style={{ fontWeight: "500" }}>
                {" "}
                {yesterdayInfo &&
                yesterdayInfo.yesterday_renewal &&
                yesterdayInfo.yesterday_renewal.yesterday_renwals
                  ? yesterdayInfo &&
                    yesterdayInfo.yesterday_renewal &&
                    yesterdayInfo.yesterday_renewal.yesterday_renwals
                  : "0"}{" "}
                / ₹{" "}
                {yesterdayInfo &&
                yesterdayInfo.yesterday_renewal &&
                yesterdayInfo.yesterday_renewal.amount
                  ? yesterdayInfo &&
                    yesterdayInfo.yesterday_renewal &&
                    yesterdayInfo.yesterday_renewal.amount.toFixed(2)
                  : "0"}
              </span>
            </h6>
          </Grid>
        </Grid>
      </AccordionDetails>

      <AccordionDetails style={{ lineHeight: "3rem" }}>
        <Grid spacing={1} container>
          <Grid item md="6">
            <h6 className="reports_text">Payments</h6>
          </Grid>
          <Grid item md="6">
            <h6 style={{ textAlign: "right" }}>
              <span style={{ fontWeight: "500" }}>
                {yesterdayInfo &&
                  yesterdayInfo.yesterday_payments &&
                  yesterdayInfo.yesterday_payments.reduce(
                    (a, v) => (a = a + v.count),
                    0
                  )}
                / ₹{" "}
                {yesterdayInfo &&
                  yesterdayInfo.yesterday_payments &&
                  yesterdayInfo.yesterday_payments
                    .reduce((a, v) => (a = a + v.amount), 0)
                    .toFixed(2)}
              </span>
            </h6>
          </Grid>
        </Grid>
      </AccordionDetails>

      <AccordionDetails style={{ lineHeight: "3rem" }}>
        <Grid spacing={1} container>
          <Grid item md="6">
            <h6 className="reports_text">Online Pay</h6>
          </Grid>
          <Grid item md="6">
            <h6 style={{ textAlign: "right" }}>
              <span style={{ fontWeight: "500" }}>
                {yesterdayInfo &&
                  yesterdayInfo.yesterday_payments &&
                  yesterdayInfo.yesterday_payments
                    .filter((item) => item.pickup_type === "ONL")
                    .reduce((acc, curr) => {
                      if (curr) {
                        acc = acc + curr.count;
                      }
                      return acc;
                    }, 0)}{" "}
                / ₹{" "}
                {yesterdayInfo &&
                  yesterdayInfo.yesterday_payments &&
                  yesterdayInfo.yesterday_payments
                    .filter((item) => item.pickup_type === "ONL")
                    .reduce((acc, curr) => {
                      if (curr) {
                        acc = acc + curr.amount;
                      }
                      return acc;
                    }, 0)
                    .toFixed(2)}
              </span>
            </h6>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default Yesterdaydata;
