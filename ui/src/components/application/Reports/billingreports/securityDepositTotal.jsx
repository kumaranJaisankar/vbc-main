import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
const SecutiryDepositTotal = (props) => {
    return (
        <>
            <Grid container spacing={2} sx={{ marginLeft: "0px",marginTop:"5px !important" }}>
               {props.activeTab==='False' && <Grid xs={6} md={1.7} sx={{ position: "relative", left: "10px", marginRight: "8px" }}>
                    <Card className="count_cards">
                        <p><span className="total_test">Security Deposit</span>
                            <br /><span className="total_count"><span className="payment_symbol">₹</span>{props.ledgerLists?.totalCounts?.total_security_deposit ? props.ledgerLists?.totalCounts?.total_security_deposit.toFixed(2) : "0"}</span>
                        </p>
                    </Card>
                </Grid>}
                {props.activeTab==='True' &&<Grid xs={6} md={1.7} sx={{ position: "relative", marginLeft: "25px" }} >
                    <Card className="count_cards">
                        <p><span className="total_test">Security Deposit Refund</span>
                            <br /><span className="total_count"><span className="payment_symbol">₹</span>{props.ledgerLists?.tabCounts?.security_deposit_refund ? props.ledgerLists?.tabCounts?.security_deposit_refund.toFixed(2) : "0"}</span>
                        </p>
                    </Card>
                </Grid>}
                {props.activeTab==='All' &&<Grid xs={6} md={1.7} sx={{ position: "relative", marginLeft: "25px" }} >
                    <Card className="count_cards">
                        <p><span className="total_test">Security Deposit Balance</span>
                            <br /><span className="total_count"><span className="payment_symbol">₹</span>{props.ledgerLists?.tabCounts?.balance_sd_amount ? props.ledgerLists?.tabCounts?.balance_sd_amount.toFixed(2) : "0"}</span>
                        </p>
                    </Card>
                </Grid>}
            </Grid>
        </>
    );
};

export default SecutiryDepositTotal;
