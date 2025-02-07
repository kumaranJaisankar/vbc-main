import React from "react";
import { Chart } from "react-google-charts";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
const CustomerBYConversionsNEW = () => {
  return (
    <>
      <Chart
        width={"100%"}
        height={"200px"}
        chartType="ColumnChart"
        loader={<div>{"Loading Chart"}</div>}
        data={[
          [
            "Element",
            "",
            { role: "style" },
            {
              sourceColumn: 1,
              role: "annotation",
              type: "string",
              calc: "stringify",
            },
          ],
          ["Provisioning", 16, "#89cdf3", 16],
          ["Installed", 15, "#89cdf3", 15],
          ["Suspended", 14, "#89cdf3", 14],
          ["KYC", 16, "#89cdf3", 16],
        ]}
        options={{
          height: 200,
          bar: { groupWidth: "40%" },
          backgroundColor: "transparent",
          legend: { position: "none" },
          vAxis: { textPosition: "none" },
        // vAxis: {
        //     gridlines: {
        //       interval: .5
        //     }      
        //   }
        }}
      />
      <Box sx={{ flexGrow: 1, borderTop: "1px solid  #d9d9d9" }}>
        <Grid
          container
          spacing={2}
          columns={16}
          sx={{ marginLeft: "20px", marginTop: "5px" }}
        >
          <Grid item xs={1.5}></Grid>
          <Grid item xs={4} style={{ textAlign: "center" }}>
            <h5>Activations</h5>
            <h5 style={{ color: "#2e29c4" }}>234</h5>
          </Grid>
          <Grid item xs={3.5} style={{ textAlign: "center" }}>
            <h5>Renwals</h5>
            <h5 style={{ color: "#2e29c4" }}>234</h5>
          </Grid>
          <Grid item xs={3} style={{ textAlign: "center" }}>
            <h5>Expiry</h5>
            <h5 style={{ color: "#2e29c4" }}>34</h5>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CustomerBYConversionsNEW;
