import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
const TotalCount = (props) => {
  return (
    <>
      <Grid container spacing={2} sx={{marginLeft:"0px"}}>
        
        <Grid xs={6} md={1.7} sx={{position:"relative", left:"10px",marginRight:"8px"}}>
          <Card className="count_cards">
            <p><span className="total_test">CASH DEPOSITS</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.filteredData?.counts?.cash_payments ? props.filteredData?.counts?.cash_payments.toFixed(2) : "0"}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={1.7} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">PAYMENT GATEWAY</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.filteredData?.counts?.payment_gateway_payments ? props.filteredData?.counts?.payment_gateway_payments.toFixed(2) : "0"}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={1.7} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">UPI</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.filteredData?.counts?.upi_payments ? props.filteredData?.counts?.upi_payments.toFixed(2) : "0"}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={1.7} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">BANK TRANSFERS</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.filteredData?.counts?.bank_transfers ? props.filteredData?.counts?.bank_transfers.toFixed(2) : "0"}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={1.7} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">CHEQUE DEPOSIT</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.filteredData?.counts?.cheque_payments ? props.filteredData?.counts?.cheque_payments.toFixed(2) : "0"}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={1.7} sx={{position:"relative", marginLeft:"25px"}}>
          <Card className="count_cards">
            <p><span className="total_test">TOTAL AMOUNT</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.filteredData?.counts?.total_payments ? props.filteredData?.counts?.total_payments.toFixed(2) : "0"}</span>
            </p>
          </Card>
        </Grid>
        
      </Grid>
      <br/><br/>
      <Grid container spacing={2} sx={{marginLeft:"0px"}}>
      <Grid xs={6} md={1.7} sx={{position:"relative", left:"10px",marginRight:"8px"}}>
          <Card className="count_cards">
            <p><span className="total_test">Security Deposit</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.filteredData?.total_counts?.total_security_deposit ? props.filteredData?.total_counts?.total_security_deposit.toFixed(2) : "0"}</span>
            </p>
          </Card>
        </Grid>
      <Grid xs={6} md={1.7}  sx={{position:"relative", marginLeft:"25px"}} >
          <Card className="count_cards">
            <p><span className="total_test">Security Deposit Refund</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.filteredData?.counts?.security_deposit_refund ? props.filteredData?.counts?.security_deposit_refund.toFixed(2) : "0"}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={1.7}  sx={{position:"relative", marginLeft:"25px"}} >
          <Card className="count_cards">
            <p><span className="total_test">Total Installation Charges</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.filteredData?.total_counts?.total_installation_charges ? props.filteredData?.total_counts?.total_installation_charges.toFixed(2) : "0"}</span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={1.7}  sx={{position:"relative", marginLeft:"25px"}} >
          <Card className="count_cards">
            <p><span className="total_test">Total Static Ip Cost</span>
            <br/><span className="total_count"><span className="payment_symbol">₹</span>{props.filteredData?.total_counts?.total_static_ip_total_cost ? props.filteredData?.total_counts?.total_static_ip_total_cost.toFixed(2) : "0"}</span>
            </p>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default TotalCount;
