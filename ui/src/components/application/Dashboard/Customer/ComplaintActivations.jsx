import React from "react";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

const ComplaintActive = ({ customerInfo }) => {
  return (
    <>
      <Grid
        container
        spacing={1}
        className="Main-grid"
        style={{ paddingTop: "10px", padding: "0" }}
      >
        <Grid item md="5.5">
          <Grid container spacing={1} style={{ borderBottom: "2px solid" }}>
            <Grid item md="8" className="dashboardstatus">
              <b>Today</b>
            </Grid>
            <Grid item md="4">
              <b>{}</b>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray " }}
          >
            <Grid
              item
              md="7"
              className="dashboardstatus"
              style={{ display: "flex" }}
            >
              Open{" "}
            </Grid>
            <Grid
              item
              md="5"
              className="dashboardstatus"
              style={{ textAlign: "right" }}
            >
              <p>
                {" "}
                {customerInfo &&
                customerInfo.today_complaint_counts &&
                customerInfo.today_complaint_counts.opn
                  ? customerInfo &&
                    customerInfo.today_complaint_counts &&
                    customerInfo.today_complaint_counts.opn
                  : 0}
              </p>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray" }}
          >
            <Grid item md="7" className="dashboardstatus">
              In Progress
            </Grid>
            <Grid
              item
              md="5"
              style={{ textAlign: "right" }}
              className="dashboardstatus"
            >
              <p>
                {" "}
                {customerInfo &&
                customerInfo.today_complaint_counts &&
                customerInfo.today_complaint_counts.inp
                  ? customerInfo &&
                    customerInfo.today_complaint_counts &&
                    customerInfo.today_complaint_counts.inp
                  : 0}
              </p>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray" }}
          >
            <Grid item md="7" className="dashboardstatus">
              Resolved
            </Grid>
            <Grid
              item
              md="5"
              style={{ textAlign: "right" }}
              className="dashboardstatus"
            >
              {customerInfo &&
              customerInfo.today_complaint_counts &&
              customerInfo.today_complaint_counts.rsl
                ? customerInfo &&
                  customerInfo.today_complaint_counts &&
                  customerInfo.today_complaint_counts.rsl
                : 0}{" "}
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray" }}
          >
            <Grid item md="7" className="dashboardstatus">
              Closed
            </Grid>
            <Grid
              item
              md="5"
              style={{ textAlign: "right" }}
              className="dashboardstatus"
            >
              {customerInfo &&
              customerInfo.today_complaint_counts &&
              customerInfo.today_complaint_counts.cld
                ? customerInfo &&
                  customerInfo.today_complaint_counts &&
                  customerInfo.today_complaint_counts.cld
                : 0}
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray" }}
          >
            <Grid
              item
              md="7"
              style={{ textAlign: "left" }}
              className="dashboardstatus"
            >
              Assigned
            </Grid>
            <Grid
              item
              md="5"
              style={{ textAlign: "right" }}
              className="dashboardstatus"
            >
              {customerInfo &&
              customerInfo.today_complaint_counts &&
              customerInfo.today_complaint_counts.asn
                ? customerInfo &&
                  customerInfo.today_complaint_counts &&
                  customerInfo.today_complaint_counts.asn
                : 0}
            </Grid>
          </Grid>
          {/* total count for today */}
          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray" }}
          >
            <Grid
              item
              md="7"
              style={{ textAlign: "left" }}
              className="dashboardstatus"
            >
              <b>Total</b>
            </Grid>
            <Grid
              item
              md="5"
              style={{ textAlign: "right" }}
              className="dashboardstatus"
            >
             <b>
             {customerInfo &&
              customerInfo.today_complaint_counts &&
              customerInfo.today_complaint_counts.total
                ? customerInfo &&
                  customerInfo.today_complaint_counts &&
                  customerInfo.today_complaint_counts.total
                : 0}
               </b> 
            </Grid>
          </Grid>
          {/* end */}
        </Grid>
        <Grid item md="1"></Grid>
        <Grid item md="5.5">
          <Grid container spacing={1} style={{ borderBottom: "2px solid" }}>
            <Grid
              item
              md="8"
              className="dashboardstatus"
              style={{ display: "flex" }}
            >
              <b>Yesterday</b>
            </Grid>
            <Grid item md="4">
              <b>{}</b>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray" }}
          >
            <Grid
              item
              md="7"
              className="dashboardstatus"
              style={{ display: "flex" }}
            >
              Open
            </Grid>
            <Grid
              item
              md="5"
              className="dashboardstatus"
              style={{ textAlign: "right" }}
            >
              <p>
                {" "}
                {customerInfo &&
                customerInfo.yesterday_complaint_counts &&
                customerInfo.yesterday_complaint_counts.opn
                  ? customerInfo &&
                    customerInfo.yesterday_complaint_counts &&
                    customerInfo.yesterday_complaint_counts.opn
                  : 0}
              </p>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray" }}
          >
            <Grid item md="7" className="dashboardstatus">
              In Progress
            </Grid>
            <Grid
              item
              md="5"
              style={{ textAlign: "right" }}
              className="dashboardstatus"
            >
              <p>
                {customerInfo &&
                customerInfo.yesterday_complaint_counts &&
                customerInfo.yesterday_complaint_counts.inp
                  ? customerInfo &&
                    customerInfo.yesterday_complaint_counts &&
                    customerInfo.yesterday_complaint_counts.inp
                  : 0}
              </p>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray" }}
          >
            <Grid item md="7" className="dashboardstatus">
              Resolved
            </Grid>
            <Grid
              item
              md="5"
              style={{ textAlign: "right" }}
              className="dashboardstatus"
            >
              {customerInfo &&
              customerInfo.yesterday_complaint_counts &&
              customerInfo.yesterday_complaint_counts.rsl
                ? customerInfo &&
                  customerInfo.yesterday_complaint_counts &&
                  customerInfo.yesterday_complaint_counts.rsl
                : 0}
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray" }}
          >
            <Grid item md="7" className="dashboardstatus">
              Closed
            </Grid>
            <Grid
              item
              md="5"
              style={{ textAlign: "right" }}
              className="dashboardstatus"
            >
              {customerInfo &&
              customerInfo.yesterday_complaint_counts &&
              customerInfo.yesterday_complaint_counts.cld
                ? customerInfo &&
                  customerInfo.yesterday_complaint_counts &&
                  customerInfo.yesterday_complaint_counts.cld
                : 0}{" "}
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray" }}
          >
            <Grid item md="7" className="dashboardstatus">
              Assigned
            </Grid>
            <Grid
              item
              md="5"
              style={{ textAlign: "right" }}
              className="dashboardstatus"
            >
              {customerInfo &&
              customerInfo.yesterday_complaint_counts &&
              customerInfo.yesterday_complaint_counts.asn
                ? customerInfo &&
                  customerInfo.yesterday_complaint_counts &&
                  customerInfo.yesterday_complaint_counts.asn
                : 0}
            </Grid>
          </Grid>
          {/* total count for yesterday */}
          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray" }}
          >
            <Grid item md="7" className="dashboardstatus">
              <b>Total</b>
            </Grid>
            <Grid
              item
              md="5"
              style={{ textAlign: "right" }}
              className="dashboardstatus"
            >
              <b>

                {customerInfo &&
              customerInfo.yesterday_complaint_counts &&
              customerInfo.yesterday_complaint_counts.total
                ? customerInfo &&
                  customerInfo.yesterday_complaint_counts &&
                  customerInfo.yesterday_complaint_counts.total
                : 0}
                </b>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ComplaintActive;
