import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
const TotalCount = (props) => {
  return (
  <>
 <Grid container spacing={2}>
        <Grid xs={6} md={2} sx={{position:"relative", left:"10px", marginRight:"13px"}}>
          <Card className="count_cards">
            <p><span className="total_test">TOTAL AMOUNT </span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.summardetails && props.summardetails.total_deposit}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">CASH DEPOSITS</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.summardetails && props.summardetails.cash_deposit}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">ONLINE DEPOSITS</span>
            <br/><span className="total_count"> <span className="payment_symbol">₹</span>{props.summardetails && props.summardetails.online_deposit}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">CANCEL INVOICE DEPOSITS</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>0</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">USER RENEWAL DEPOSITS</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>0</span>
            </p>
          </Card>
        </Grid>
        
      </Grid>
  </>
  )
};
export default TotalCount;
