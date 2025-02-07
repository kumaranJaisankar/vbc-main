import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
const TotalTicekts = (props) => {
  return (
    <>
      <Grid container spacing={2}>

        <Grid xs={6} md={2} sx={{ position: "relative", marginLeft: "25px" }}>
          <Card className="count_cards">
            <p><span className="total_test">Total No. of Tickets</span>
              <br /><span className="total_count">
                {console.log(props.totalCount?.all, "props.totalCount")}
                {props.totalCount && props.totalCount?.all}


                {/* {props.totalCount?.counts.map((user) => (
        <div className="user">{user.all}</div>
      ))} */}
                {/* // */}
              </span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{ position: "relative", marginLeft: "25px" }}>
          <Card className="count_cards">
            <p><span className="total_test">Open</span>
              <br /><span className="total_count">  {props.totalCount && props.totalCount?.opn} </span>

            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{ position: "relative", marginLeft: "25px" }}>
          <Card className="count_cards">
            <p><span className="total_test">Assigned</span>
              <br /><span className="total_count">  {props.totalCount && props.totalCount?.asn} </span>

            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{ position: "relative", marginLeft: "25px" }}>
          <Card className="count_cards">
            <p><span className="total_test">Closed</span>
              <br /><span className="total_count">  {props.totalCount && props.totalCount?.cld} </span>

            </p>
          </Card>
        </Grid>
      </Grid>
    </>
  )
};
export default TotalTicekts;
