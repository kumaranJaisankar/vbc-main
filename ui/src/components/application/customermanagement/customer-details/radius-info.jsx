import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "../../../../mui/accordian";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";


const RadiusInfo = ({profileDetails }) => {

  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Accordion
      style={{
        borderRadius: "15px",
        boxShadow: "0 0.2rem 1rem rgba(0, 0, 0, 0.15)",
        flex: "0 0 100%",
      }}
      expanded={expanded === "panel1"}
      onChange={handleChange("panel1")}
    >
      <AccordionSummary aria-controls="panel1a-content" id="radius-info">
        <Typography
          variant="h6"
          className="customerdetailsheading"
        >
          Radius Information
        </Typography>
      </AccordionSummary>
      <AccordionDetails style={{ lineHeight: "3rem" }}>

        <Grid spacing={1} container sx={{ mb: "5px" }}>
          <Grid item md="6">
            <p>
              <span className="cust_details">{'Authentication Protocol'}</span>
            </p>
          </Grid>
          <Grid item md="6">
            <p>

            {profileDetails?.radius_info?.authentication_protocol}
            </p>
          </Grid>
        </Grid>

        <Grid spacing={1} container sx={{ mb: "5px" }}>
          <Grid item md="6">
            <p>
              {/* Sailaja Changed Mac Bind to MAC Bind on 27th March 2023  */}
              <span className="cust_details">{'MAC Bind'}</span>
            </p>
          </Grid>
          <Grid item md="6">
            <p>

            {profileDetails?.radius_info?.mac_bind ?profileDetails?.radius_info?.mac_bind:'N/A'}
            </p>
          </Grid>
        </Grid>

        <Grid spacing={1} container sx={{ mb: "5px" }}>
          <Grid item md="6">
            <p>
              <span className="cust_details">{'IP Mode'}</span>
            </p>
          </Grid>
          <Grid item md="6">
            <p>

            {profileDetails?.radius_info?.ip_mode}
            </p>
          </Grid>
        </Grid>
        <Grid spacing={1} container sx={{ mb: "5px" }}>
          <Grid item md="6">
            <p>
              <span className="cust_details">{'Static IP Bind'}</span>
            </p>
          </Grid>
          <Grid item md="6">
            <p>

            {profileDetails?.radius_info?.static_ip_bind?profileDetails?.radius_info?.static_ip_bind:"N/A"}
            </p>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default RadiusInfo;
