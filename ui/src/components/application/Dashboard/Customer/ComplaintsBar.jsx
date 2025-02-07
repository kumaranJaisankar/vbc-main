import React from "react";
// import { Chart } from "react-google-charts";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

const ComplaintsBar = () => {
  return (
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
  );
};
export default ComplaintsBar;
