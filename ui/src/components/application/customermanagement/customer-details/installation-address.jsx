import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "../../../../mui/accordian";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tooltip from '@mui/material/Tooltip';
const InstallationAddress = ({installationAddress, userDetails }) => {

  const [expanded, setExpanded] = React.useState("panel9");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  return (
    <>
      <Accordion
        style={{
          borderRadius: "15px",
          boxShadow: "0 0.2rem 1rem rgba(0, 0, 0, 0.15)",
          flex: "0 0 100%",
        }}
        expanded={expanded === "panel9"}
        onChange={handleChange("panel9")}
      >
        <AccordionSummary aria-controls="panel1a-content" id="radius-info">
          <Typography
            variant="h6"
            className="customerdetailsheading"
          >
            Installation Address
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ lineHeight: "3rem" }}>
          {userDetails &&
            Object.keys(installationAddress).map((item) => (
              <Grid container key={item} sx={{ height: "40px " }}>
                <Grid item md="6" zeroMinWidth>
                  <Typography variant="body1" align="left" noWrap>
                    <p>
                      <span className="cust_details">
                        {installationAddress[item]}
                      </span>
                    </p>
                  </Typography>
                </Grid>
                <Grid item md="6" rowSpacing={8} zeroMinWidth>
                <Tooltip title={userDetails[item]}>
                  <Typography variant="body1" align="left" noWrap >
                    <p style={{ whiteSpace: "normal", wordBreak: "break-word" }} className="text-overlap">
                      <span className="customer_details">
                        {userDetails[item]
                          ? " " + userDetails[item]
                          : "---"}
                      </span>
                    </p>
                  </Typography>
                  </Tooltip>
                </Grid>
              </Grid>
            ))}
        </AccordionDetails>
      </Accordion>
    </>
  )
}
export default InstallationAddress;