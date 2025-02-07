import React, { useState, useEffect } from "react";

import { Doughnut } from "react-chartjs-2";
import Grid from "@mui/material/Grid";

const CustomerConversions = ({ customerInfo }) => {
  const doughnutData = {
    labels: ["Provisioning", "Installed", "Suspended", "Kyc confirmed"],
    datasets: [
      {
        label: "My First Dataset",
        data: [
          customerInfo && customerInfo.total_no_of_provisioning_customers
            ? customerInfo && customerInfo.total_no_of_provisioning_customers
            : "0",
          customerInfo && customerInfo.total_no_of_installation_customers
            ? customerInfo && customerInfo.total_no_of_installation_customers
            : "0",
          customerInfo && customerInfo.total_no_of_suspended_customers
            ? customerInfo && customerInfo.total_no_of_suspended_customers
            : "0",
          customerInfo && customerInfo.total_no_of_kyc_confirmed_customers
            ? customerInfo && customerInfo.total_no_of_kyc_confirmed_customers
            : "0",
        ],
        backgroundColor: [
          "#344cab",
          "#87a4d8",
          "#c1d7fe",
          "#cddffe",
          "#99ff99",
        ],
      },
    ],
  };
  const doughnutOption = {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    plugins: {
      datalabels: {
        display: false,
        color: "white",
      },
    },
  };

  const totalcust =
    customerInfo && customerInfo.total_no_of_customer_conversion
      ? customerInfo && customerInfo.total_no_of_customer_conversion
      : "0";

 
  const [plugins, setplugins] = useState();
  useEffect(() => {
    if (!!customerInfo.total_no_of_customers) {
      setplugins([
        {
          beforeDraw: function (chart) {
            var width = chart.width,
              height = chart.height,
              ctx = chart.ctx;
            ctx.restore();
            var fontSize = (height / 210).toFixed(2);
            ctx.font = fontSize + "em sans-serif";
            ctx.textBaseline = "top";
            var text = "Total " + `${totalcust}`,
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 2.1;
            ctx.fillText(text, textX, textY);
            ctx.save();
          },
        },
      ]);
    }
  }, [customerInfo]);
  return (
    <>
      <Grid container spacing={1} className="Main-grid">
        <Grid item md="6">
          {!!plugins && (
            <Doughnut
              data={doughnutData}
              options={doughnutOption}
              width={380}
              height={190}
              plugins={plugins}
            />
          )}
        </Grid>
        <Grid item md="1"></Grid>
        <Grid item md="5" style={{ paddingTop: "45px" }}>
          <Grid container spacing={1} style={{ borderBottom: "2px solid" }}>
            <Grid item md="8">
              <p>
                <b>Total </b>
              </p>
            </Grid>
            <Grid item md="4">
              <p style={{ textAlign: "end" }}>
                {" "}
                <b>{totalcust}</b>
              </p>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray" }}
          >
            <Grid item md="8" className="Grid-checkbox">
              <p className="Active-checkbox-color"></p>
              <p className="dashboardstatus">Provisioning </p>
            </Grid>
            <Grid item md="4">
              <p style={{ textAlign: "end" }} className="dashboardstatus">
                {customerInfo && customerInfo.total_no_of_provisioning_customers
                  ? customerInfo &&
                    customerInfo.total_no_of_provisioning_customers
                  : "0"}
              </p>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray" }}
          >
            <Grid item md="8" className="Grid-checkbox">
              <p className="Deactive-checkbox-color"></p>
              <p className="dashboardstatus">Installed </p>
            </Grid>
            <Grid item md="4">
              <p style={{ textAlign: "end" }} className="dashboardstatus">
                {customerInfo && customerInfo.total_no_of_installation_customers
                  ? customerInfo &&
                    customerInfo.total_no_of_installation_customers
                  : "0"}
              </p>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray" }}
          >
            <Grid item md="8" className="Grid-checkbox">
              <p className="Expired-checkbox-color"></p>
              <p className="dashboardstatus">Suspended</p>
            </Grid>
            <Grid item md="4">
              <p style={{ textAlign: "end" }} className="dashboardstatus">
                {customerInfo && customerInfo.total_no_of_suspended_customers
                  ? customerInfo && customerInfo.total_no_of_suspended_customers
                  : "0"}
              </p>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={1}
            style={{ borderBottom: "1px solid gray" }}
          >
            <Grid item md="8" className="Grid-checkbox">
              <p className="Online-checkbox-color"></p>
              <p className="dashboardstatus">KYC confirmed</p>
            </Grid>
            <Grid item md="4">
              <p style={{ textAlign: "end" }} className="dashboardstatus">
                {customerInfo &&
                customerInfo.total_no_of_kyc_confirmed_customers
                  ? customerInfo &&
                    customerInfo.total_no_of_kyc_confirmed_customers
                  : "0"}
              </p>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CustomerConversions;
