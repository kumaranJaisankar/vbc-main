import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
const TotalFranchise = (props) => {
  return (
  <>
 <Grid container spacing={2}>
       
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">Total No.Of Franchises</span>
            <br/><span className="total_count"> 
            {props.totalfranchise && props.totalfranchise?.counts} 
            
            
            {/* {props.totalCount?.counts.map((user) => (
        <div className="user">{user.all}</div>
      ))} */}
            </span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">Total Deposits</span>
            <br/><span className="total_count"> <span className="payment_symbol">₹</span>{props.customerList && props.customerList.report_counts?.total_paid_amount} / {props.customerList && props.customerList.report_counts?.paid_customers_count}</span>

            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">No.Of Users</span>
            <br/><span className="total_count">{props.customerList && props.customerList.report_counts?.unpaid_customers_count}</span>

            </p>
          </Card>
        </Grid>
      
      </Grid>
  </>
  )
};
export default TotalFranchise;
