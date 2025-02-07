import React from "react";
import Grid from "@mui/material/Grid";
import { Card, CardHeader, CardBody } from "reactstrap";
import CustomerNetwrok from "./NetworkChart";
import { Link } from "react-router-dom";
const NetworkCard = (props) => {
  return (
    <>
      <Grid item xs={12} md={12} sm={12} lg={12}>
        <Card
          style={{ borderRadius: "10px", flex: "0 0 100%", height: "100%" }}
        >
          <CardHeader style={{ padding: "5px", borderBottom: "0px" }}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={6} sm={6} lg={6}>
                <div style={{ display: "flex" }}>
                  <div
                    className="dashboard-font"
                    style={{
                      position: "relative",
                      left: "15px",
                      // marginBottom: "10px",
                      marginTop: "10px",
                    }}
                  >
                    NETWORK
                  </div>{" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {/* <NetworkDateRange 
                   setNetworkcustomstartdate={setNetworkcustomstartdate}
                   networkcustomstartdate={networkcustomstartdate}
                   setNetworkCustomenddate={setNetworkCustomenddate}
                   networkcustomenddate={networkcustomenddate}
                   networkCalender={networkCalender}
                   networkDaterange={networkDaterange}
                   networkDaterangeselection={networkDaterangeselection}
                  /> */}
                </div>
                {/* <Grid container spacing={1}> */}
                <Grid
                  item
                  xs={6}
                  md={6}
                  sm={6}
                  lg={6}
                  style={{
                    position: "relative",
                    left: "0px",
                    paddingTop: "0px",
                  }}
                >
                  <p
                    className="complaint_count"
                    style={{
                      marginTop: "-5px",
                      marginBottom: "0px",
                      fontSize: "20px",
                    }}
                  >
                    <span>{props?.networkData?.total}</span>
                  </p>
                </Grid>
                {/* </Grid> */}
              </Grid>
              <Grid item xs={6} md={6} sm={6} lg={6}>
                <Link
                  to={{
                    pathname: `${process.env.PUBLIC_URL}/app/project/opticalnew/all/${process.env.REACT_APP_API_URL_Layout_Name}`,
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
          <CardBody style={{ padding: "0px" }}>
            <CustomerNetwrok
              networkData={props.networkData}
              setNetworkData={props.setNetworkData}
            />
          </CardBody>
        </Card>
      </Grid>
    </>
  );
};

export default NetworkCard;
