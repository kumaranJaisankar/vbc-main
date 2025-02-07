import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
const TotalCountCustomer = (props) => {
  return (
  <>
 <Grid container spacing={2}>
       
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">Total Amount</span>
            <br/><span className="total_count"> <span className="payment_symbol">₹</span>{props.customerList && props.customerList.report_counts?.total_amount?.toFixed(0)} / {props.customerList && props.customerList.report_counts?.total_customers_count}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">Collected Amount</span>
            <br/><span className="total_count"> <span className="payment_symbol">₹</span>{props.customerList && props.customerList.report_counts?.total_paid_amount?.toFixed(0)} / {props.customerList && props.customerList.report_counts?.paid_customers_count}</span>

            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">Unpaid Amount</span>
            <br/><span className="total_count"> <span className="payment_symbol">₹</span>{props.customerList && props.customerList.report_counts?.total_unpaid_amount?.toFixed(0)} / {props.customerList && props.customerList.report_counts?.unpaid_customers_count}</span>

            </p>
          </Card>
        </Grid>
      
      </Grid>
  </>
  )
};
export default TotalCountCustomer;
