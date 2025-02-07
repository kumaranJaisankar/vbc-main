import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
const TotalCountInovice = (props) => {
  return (
  <>
 <Grid container spacing={2}>
       
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">To Be Collected</span>
            <br/><span className="total_count"> <span className="payment_symbol">₹</span>{props.billingReport && props.billingReport.counts && props.billingReport.counts.total_payments}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">Collected</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>0</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">Pending</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>0</span>
            </p>
          </Card>
        </Grid>
        
      </Grid>
  </>
  )
};
export default TotalCountInovice;
