import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
const LedgerKPI = (props) => {
  console.log(props.totalkpi, "totalkpi")
  return (
    <>
      <Grid container spacing={2} sx={{ marginLeft: "0px" }}>

        <Grid xs={6} md={2} sx={{ position: "relative", left: "10px", marginRight: "8px" }}>
          <Card className="count_cards">
            <p><span className="total_test">Credit</span>
              <br /><span className="total_count">
                <span className="payment_symbol">₹</span>
                {
                  props?.totalkpi?.extra_data?.total_credit
                    ? Number(props.totalkpi?.extra_data?.total_credit).toFixed(2)
                    : "0.00"
                }
              </span>

            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{ position: "relative", left: "10px", marginRight: "8px" }}>
          <Card className="count_cards">
            <p><span className="total_test">Debit</span>
              <br />
              <span className="total_count">
                <span className="payment_symbol">₹</span>
                {
                  props?.totalkpi?.extra_data?.total_debit
                    ? Number(props.totalkpi?.extra_data?.total_debit).toFixed(2)
                    : "0.00"
                }
              </span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{ position: "relative", left: "10px", marginRight: "8px" }}>
          <Card className="count_cards">
            <p><span className="total_test">Wallet Balance</span>
              <br />
              <span className="total_count">
                <span className="payment_symbol">₹</span>
                {
                  props?.totalkpi?.balance
                    ? Number(props.totalkpi.balance).toFixed(2)
                    : "0.00"
                }
              </span>

            </p>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
export default LedgerKPI;