import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
const TotalCountInovice = (props) => {
  return (
  <>
 <Grid container spacing={2}>
       
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">Total Amount</span>
            <br/><span className="total_count"> <span className="payment_symbol">₹</span>{props.billingReport && props.billingReport?.total_counts && props.billingReport?.total_counts?.total_amount?.toFixed(2)}</span>

            {/* <br/><span className="total_count"> <span className="payment_symbol">₹</span>{props.billingReport && props.billingReport?.counts && props.billingReport?.counts?.total_payments?.toFixed(0)}</span> */}
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">Total Due Amount</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.billingReport && props.billingReport.total_counts?.total_due_amount?.toFixed(2)}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">Total GST</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.billingReport && props.billingReport.total_counts?.total_gst?.toFixed(2)}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">Total Refund</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.billingReport && props.billingReport.total_counts?.total_refund?.toFixed(2)}</span>
            </p>
          </Card>
        </Grid>
        
      </Grid>
  </>
  )
};
export default TotalCountInovice;
