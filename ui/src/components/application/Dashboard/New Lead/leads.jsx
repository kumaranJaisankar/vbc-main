import React from "react";
import Grid from "@mui/material/Grid";
import { Card, CardHeader, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import LeadsAndNewRegistrations from "./LeadsChart";

const LeadCard = (props) => {

  return (
    <>
      <Card style={{ borderRadius: "10px", flex: "0 0 100%", height: "100%" }}>
        <CardHeader style={{ padding: "5px", borderBottom: "0px" }}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={11}>
              <div style={{ display: "flex" }}>
                <div
                  className="dashboard-font"
                  style={{
                    position: "relative",
                    left: "15px",
                    // marginBottom: "10px",
                    marginTop: "5px",
                  }}
                >
                  {" "}
                  LEADS & NEW REGISTRATIONS
                </div>{" "}
                &nbsp;&nbsp;&nbsp;&nbsp;
              </div>
              <Grid container spacing={2}>
                <Grid item xs={6} md={2}>
                  <p
                    className="complaint_count"
                    style={{
                      marginTop: "-5px",
                      marginBottom: "0px",
                      fontSize: "20px",
                    }}
                  >
                    <span>
                      {/* 90 */}
                      {props.leadData?.count ? props.leadData?.count : 0}
                    </span>

                    <div></div>
                  </p>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6} md={1}>
              <Link
                to={{
                  pathname: `${process.env.PUBLIC_URL}/app/leads/leadsContainer/${process.env.REACT_APP_API_URL_Layout_Name}`,
                }}
              >
                <i
                  style={{
                    position: "relative",
                    marginTop: "5px",
                    left: "-10px",
                  }}
                  class="fa fa-arrow-right"
                ></i>
              </Link>
            </Grid>
          </Grid>
        </CardHeader>
        <CardBody>
          <LeadsAndNewRegistrations
            leadData={props.leadData}
            setLeadData={props.setLeadData}
          />
        </CardBody>
        <br/>
      </Card>
    </>
  );
};

export default LeadCard;
