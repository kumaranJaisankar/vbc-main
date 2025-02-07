import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
const SessionTotalCount = (props) => {
  return (
  <>
 <Grid container spacing={2}>
        <Grid xs={6} md={2} sx={{position:"relative", left:"10px", marginRight:"13px"}}>
          <Card className="count_cards">
            <p><span className="total_test">TOTAL SESSIONS </span>
            {/* <br/><span className="total_count"><span className="payment_symbol"></span>{props.sessionCount && props.sessionCount[0] && props.sessionCount[0].no_of_sessions}</span> */}
            <br/><span className="total_count"><span className="payment_symbol"></span>{props.filteredData && props.filteredData && props.filteredData.total_sessions?.no_of_sessions}</span>
            
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">TOTAL DOWNLOAD</span>
            <br/><span className="total_count"><span className="payment_symbol"></span>{props.filteredData && props.filteredData && props.filteredData.total_sessions?.total_download}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">TOTAL UPLOAD</span>
            <br/><span className="total_count"> <span className="payment_symbol"></span>{props.filteredData && props.filteredData && props.filteredData.total_sessions?.total_upload}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">DATA CONSUMED</span>
            <br/><span className="total_count"><span className="payment_symbol"></span>{props.filteredData && props.filteredData && props.filteredData.total_sessions?.total_data_consumed}</span>
            </p>
          </Card>
        </Grid>
        {/* <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">FREE TOTAL DOWNLAOD</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>0</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">FREE TOTAL UPLOAD</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>0</span>
            </p>
          </Card>
        </Grid> */}
        
      </Grid>
  </>
  )
};
export default SessionTotalCount;
