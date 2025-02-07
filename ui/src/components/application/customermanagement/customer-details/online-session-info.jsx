import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "../../../../mui/accordian";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import moment from "moment";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const OnlineSessionInfo = ({ profileDetails }) => {
  const onlineData = profileDetails?.service_plan;
  const packData = profileDetails;

  const [expanded, setExpanded] = React.useState("panel5");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // added styles on line 162 and 145 also removed <br/> for reducing omline session info size by marieya
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
          Online Session Information
        </Typography>
      </AccordionSummary>
      <AccordionDetails style={{ lineHeight: "3rem" }}>
        <Grid spacing={1} container sx={{ mb: "5px" }}>
          <>
            {/* Sailaja Changed Id as ID on 21st March 2023 */}
            <Grid item md="6">
              <>
                <p>
                  <span className="cust_details">{"ID"}</span>
                </p>
              </>
            </Grid>
            <Grid md="6">{profileDetails?.id}</Grid>
          </>
        </Grid>
        <Grid spacing={1} container sx={{ mb: "5px" }}>
          <>
            <Grid item md="6">
              <>
                <p>
                  <span className="cust_details">{"Online Since"}</span>
                </p>
              </>
            </Grid>
            <Grid md="6">
              {moment(profileDetails?.online_since).format("DD MMM YYYY")}
            </Grid>
          </>
        </Grid>
        <Grid spacing={1} container sx={{ mb: "5px" }}>
          <>
            <Grid item md="6">
              <>
                <p>
                  <span className="cust_details">
                    {"Running Invoice Number"}
                  </span>
                </p>
              </>
            </Grid>
            <Grid md="6">{profileDetails?.last_invoice_id}</Grid>
          </>
        </Grid>
        <Grid spacing={1} container sx={{ mb: "5px" }}>
          <Grid item md="6">
            <p style={{ position: "relative", top: "12px" }}>
              <span className="cust_details">{"Service Plan"}</span>
            </p>
          </Grid>
          {/* {profileDetails.current_plan==="FUP" ?
         <Grid item md="6" style={{ position: "relative", left: "-5px" }}>
         <>
           {onlineData && onlineData.package_name} (
           <ArrowUpwardIcon style={{ fontSize: "17px" }} />
           5|
           <ArrowDownwardIcon style={{ fontSize: "17px" }} />
          5)
         </>
       </Grid>:
         <Grid item md="6" style={{ position: "relative", left: "-5px" }}>
            <>
              {onlineData && onlineData.package_name} (
              <ArrowUpwardIcon style={{ fontSize: "17px" }} />
              {onlineData && onlineData.upload_speed} |{" "}
              <ArrowDownwardIcon style={{ fontSize: "17px" }} />
              {onlineData && onlineData.download_speed})
            </>
          </Grid>
          } */}
          <Grid item md="6" style={{ position: "relative", left: "-5px" }}>
            <>
              {onlineData && onlineData.package_name} (
              <ArrowUpwardIcon style={{ fontSize: "17px" }} />
              {onlineData && onlineData.upload_speed} |{" "}
              <ArrowDownwardIcon style={{ fontSize: "17px" }} />
              {onlineData && onlineData.download_speed})
            </>
          </Grid>
        </Grid>
        <Grid spacing={1} container sx={{ mb: "5px" }}>
          <Grid item md="6">
            <p style={{ position: "relative", top: "12px" }}>
              <span className="cust_details">{"Current Plan"}</span>
            </p>
          </Grid>
          {/* {profileDetails.current_plan === "FUP" ? (
            <Grid item md="6" style={{ position: "relative", left: "-5px" }}>
              <>
                {onlineData && onlineData.package_name} (
                <ArrowUpwardIcon style={{ fontSize: "17px" }} />
                5|
                <ArrowDownwardIcon style={{ fontSize: "17px" }} />
                5)
              </>
            </Grid>
          ) : (
            <Grid item md="6" style={{ position: "relative", left: "-5px" }}>
              {profileDetails.current_plan}
            </Grid>
          )} */}
          <Grid item md="6" style={{ position: "relative", left: "-5px" }}>
            {profileDetails.current_plan}
          </Grid>
        </Grid>
        {/* {profileDetails.note && (
          <Grid spacing={1} container sx={{ mb: "5px" }}>
            <Grid item md="6">
              <p style={{ position: "relative", top: "12px" }}>
                <span className="cust_details">{"Note"}</span>
              </p>
            </Grid>
            <Grid item md="6" style={{ position: "relative", left: "-5px" }}>
              {profileDetails.note}
            </Grid>
          </Grid>
        )} */}
        {/* <br/> */}
        <Grid spacing={1} container sx={{ mb: "5px" }}>
          <Grid item md="6">
            <p style={{ position: "relative", top: "12px" }}>
              <span className="cust_details">{"Data Consumed"}</span>
            </p>
          </Grid>
          <Grid item md="6" style={{ position: "relative", left: "-10px" }}>
            <>
              <ArrowUpwardIcon style={{ fontSize: "17px" }} />
              {packData && packData.upload_usage
                ? packData && packData.upload_usage.toFixed(2) + "GB"
                : "0.00 GB"}{" "}
              | <ArrowDownwardIcon style={{ fontSize: "17px" }} />
              {packData && packData.download_usage
                ? packData && packData.download_usage.toFixed(2) + "GB"
                : "0.00 GB"}{" "}
            </>
          </Grid>
          <Grid spacing={1} container sx={{ mb: "5px" }}>
            <Grid item md="6">
              <p style={{ position: "relative", top: "12px" }}>
                <span className="cust_details">
                  {"Next date of data addition"}
                </span>
              </p>
            </Grid>
            {/* {profileDetails?.next_date_of_data_addition !==null ? (
              <Grid item md="6" style={{ position: "relative", left: "-10px" }}>
                {moment(profileDetails?.next_date_of_data_addition).format(
                  "DD MMM YYYY"
                )}
              </Grid>
            ) : (
              <Grid item md="6" style={{ position: "relative", left: "-10px" }}>
                {"Plan Expires this Month"}
              </Grid>
            )} */}
            {profileDetails?.next_date_of_data_addition !== null ? (
              moment(profileDetails?.next_date_of_data_addition).isValid() ? (
                <Grid
                  item
                  md="6"
                  style={{ position: "relative", left: "-10px" }}
                >
                  {moment(profileDetails?.next_date_of_data_addition).format(
                    "DD MMM YYYY"
                  )}
                </Grid>
              ) : (
                <Grid
                  item
                  md="6"
                  style={{ position: "relative", left: "-10px" }}
                >
                  {profileDetails?.next_date_of_data_addition}
                </Grid>
              )
            ) : (
              <Grid item md="6" style={{ position: "relative", left: "-10px" }}>
                {"Plan Expires this Month"}
              </Grid>
            )}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default OnlineSessionInfo;
