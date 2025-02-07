import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
const TotalCount = (props) => {
  return (
    <>
      <Grid container spacing={2}>
        
        <Grid xs={6} md={2} sx={{position:"relative", left:"10px",marginRight:"8px"}}>
          <Card className="count_cards">
            <p><span className="total_test">CASH DEPOSITS</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.filteredData.cash_payments}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">PAYMENT GATEWAY</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.filteredData.payment_gateway_payments}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">UPI</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.filteredData.upi_payments}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">BANK TRANSFERS</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.filteredData.bank_transfers}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">TOTAL AMOUNT</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.filteredData.total_payments}</span>
            </p>
          </Card>
        </Grid>
        
      </Grid>
    </>
  );
};

export default TotalCount;
