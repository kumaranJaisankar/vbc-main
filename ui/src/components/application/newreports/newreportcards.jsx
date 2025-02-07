import React, { useState, useRef, useCallback, useEffect } from "react";

import pick from "lodash.pick";

import { customeraxios } from "../../../axios";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "../../../mui/accordian";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const todaysdata = {};

const NewReportCards = (customerInfo) => {
  //   const [filteredData, setFiltereddata] = useState(data);
  const [data, setData] = useState([]);
  //refresh button functionality
  const [reportrefresh, setReportrefresh] = useState(0);
  const [isExportDataModalOpen, setIsExportDataModalToggle] = useState(false);
  const [downloadableData, setDownloadableExcelData] = useState([]);
  const [downloadAs, setDownloadAs] = useState("");

  const [todayInfo, setTodayinfo] = useState(null);

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

  // const fetchTodaysdata = useCallback(async (id, name) => {
  //   try {
  //     const response = await customeraxios.get(`customers/analytics`);
  //     setTodayinfo(pick(response.data, [...Object.keys(todaysdata)]));
  //   } catch (e) {
  //     setTodayinfo(null);
  //   }
  // }, []);

  // useEffect(() => {
  //   customeraxios
  //     .get(`customers/analytics`)
  //     .then((res) => setTodayinfo(res.data));
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
          Today
        </Typography>
      </AccordionSummary>
      {/* <AccordionDetails style={{ lineHeight: "3rem" }}> */}
      <Grid spacing={1} container>
        <Grid item md="6">
          <span className="reports_text">New Connections</span>
        </Grid>
        <Grid item md="6">
          <span className="reports_text">Expiry</span>
        </Grid>
      </Grid>
      {/* </AccordionDetails> */}

      {/* <AccordionDetails style={{ lineHeight: "3rem" }}> */}
      <Grid spacing={1} container>
        <Grid item md="6">
          <span className="reports_count">
            <span style={{ fontWeight: "500" }}>
              {todayInfo && todayInfo.today_activations
                ? todayInfo && todayInfo.today_activations
                : "0"}
            </span>
          </span>
        </Grid>
        <Grid item md="6">
          <h6 className="reports_count">
            <span style={{ fontWeight: "500", marginLeft: "17%" }}>
              {" "}
              {todayInfo && todayInfo.today_expiry
                ? todayInfo && todayInfo.today_expiry
                : "0"}
            </span>
          </h6>
        </Grid>
      </Grid>
      {/* </AccordionDetails> */}

      {/* <AccordionDetails style={{ lineHeight: "3rem" }}> */}
      <Grid spacing={1} container>
        <Grid item md="6">
          <h6 className="reports_text">Renewals</h6>
        </Grid>
        <Grid item md="6">
          <h6 className="reports_text">
            <span style={{ fontWeight: "500" }}>
              {" "}
              {todayInfo &&
              todayInfo.today_renewal &&
              todayInfo.today_renewal.count
                ? todayInfo &&
                  todayInfo.today_renewal &&
                  todayInfo.today_renewal.count
                : "0"}{" "}
              / ₹{" "}
              {todayInfo &&
              todayInfo.today_renewal &&
              todayInfo.today_renewal.amount
                ? todayInfo &&
                  todayInfo.today_renewal &&
                  todayInfo.today_renewal.amount.toFixed(2)
                : "0"}
            </span>
          </h6>
        </Grid>
      </Grid>
      {/* </AccordionDetails> */}

      {/* <AccordionDetails style={{ lineHeight: "3rem" }}> */}
      <Grid spacing={1} container>
        <Grid item md="6">
          <h6 className="reports_text">Payments</h6>
        </Grid>
        <Grid item md="6">
          <h6 style={{ textAlign: "right" }}>
            <span style={{ fontWeight: "500" }}>
              {" "}
              {todayInfo &&
                todayInfo.today_payments &&
                todayInfo.today_payments.reduce(
                  (a, v) => (a = a + v.count),
                  0
                )}{" "}
              / ₹{" "}
              {todayInfo &&
                todayInfo.today_payments &&
                todayInfo.today_payments
                  .reduce((a, v) => (a = a + v.amount), 0)
                  .toFixed(2)}
            </span>
          </h6>
        </Grid>
      </Grid>
      {/* </AccordionDetails> */}

      {/* <AccordionDetails style={{ lineHeight: "3rem" }}> */}
      <Grid spacing={1} container>
        <Grid item md="6">
          <h6 className="reports_text">Online Pay</h6>
        </Grid>
        <Grid item md="6">
          <h6 style={{ textAlign: "right" }}>
            <span style={{ fontWeight: "500" }}>
              {todayInfo &&
                todayInfo.yesterday_payments &&
                todayInfo.yesterday_payments
                  .filter((item) => item.pickup_type === "ONL")
                  .reduce((acc, curr) => {
                    if (curr) {
                      acc = acc + curr.count;
                    }
                    return acc;
                  }, 0)}{" "}
              / ₹{" "}
              {todayInfo &&
                todayInfo.yesterday_payments &&
                todayInfo.yesterday_payments
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
      {/* </AccordionDetails> */}
    </Accordion>
  );
};

export default NewReportCards;
