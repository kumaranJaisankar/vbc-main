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

const todaysdata = {
  
};

const ExpiryTable = () => {
  //   const [filteredData, setFiltereddata] = useState(data);
  const [data, setData] = useState([]);
  //refresh button functionality
  const [reportrefresh, setReportrefresh] = useState(0);
  const [isExportDataModalOpen, setIsExportDataModalToggle] = useState(false);
  const [downloadableData, setDownloadableExcelData] = useState([]);
  const [downloadAs, setDownloadAs] = useState("");
  const [expiryInfo, setExpiryinfo] = useState(null);



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
//     customeraxios.get(`customers/analytics`).then((res)=>setExpiryinfo(res.data))
//   }, []);


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
        <Typography variant="h6" className="customerdetailsheading" >
          Expiry
        </Typography>
      </AccordionSummary>
      <AccordionDetails style={{ lineHeight: "3rem" }}>
        <Grid spacing={1} container>
          <Grid item md="6">
            <h6 className="reports_text">Expiring Today</h6>
          </Grid>
          <Grid item md="6">
            <h6 style={{ textAlign: "right" }}>
              <span style={{ fontWeight: "500" }}>
              {expiryInfo && expiryInfo.today_expiry
                  ? expiryInfo && expiryInfo.today_expiry
                  : "0"}
              </span>
            </h6>
          </Grid>
        </Grid>
      </AccordionDetails>

      <AccordionDetails style={{ lineHeight: "3rem" }}>
        <Grid spacing={1} container>
          <Grid item md="6">
            <h6 className="reports_text">Expiring Tomorrow</h6>
          </Grid>
          <Grid item md="6">
            <h6 style={{ textAlign: "right" }}>
              <span style={{ fontWeight: "500" }}>
              {expiryInfo && expiryInfo.upcoming_user_expiry_tomorrow
                  ? expiryInfo && expiryInfo.upcoming_user_expiry_tomorrow
                  : "0"}
              </span>
            </h6>
          </Grid>
        </Grid>
      </AccordionDetails>

      <AccordionDetails style={{ lineHeight: "3rem" }}>
        <Grid spacing={1} container>
          <Grid item md="6">
            <h6 className="reports_text">Expiring in next 7 days</h6>
          </Grid>
          <Grid item md="6">
            <h6 style={{ textAlign: "right" }}>
              <span style={{ fontWeight: "500" }}>
              {expiryInfo && expiryInfo.upcoming_user_expiry_next7days
                  ? expiryInfo && expiryInfo.upcoming_user_expiry_next7days
                  : "0"}
              </span>
            </h6>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default ExpiryTable;
