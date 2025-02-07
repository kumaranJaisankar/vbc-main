import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { Card, CardHeader, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import ComplaintsBarChart from "./ComplaintsChart";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import { helpdeskaxios } from "../../../../axios";
import ComplaintsSwitchBarChart from "./ComplaintsSwitchChart";
const CompaintCard = (props) => {
  const [complaintsData, setComplaintsData] = useState([]);
  //Api Call after toggle is enabled
  const switchHandler = () => {
    props.setClicked(!props.clicked);
    helpdeskaxios
      .get(`v2/enh/list/count?tabs=opn,asn,cld,inp,rsl`)
      .then((response) => {
        setComplaintsData(response.data);
      })
      .catch(function (error) {
        console.log(error, "error");
      });
  };

  const tokenInfo = JSON.parse(localStorage.getItem("token"));
  let ShowComplaintSwitch = false;
  if (
    (tokenInfo && tokenInfo.user_type === "Admin") ||
    (tokenInfo && tokenInfo.user_type === "Super Admin") ||
    (tokenInfo && tokenInfo.user_type === "Franchise Owner") ||
    (tokenInfo && tokenInfo.user_type === "Branch Owner")
  ) {
    ShowComplaintSwitch = true;
  }
  return (
    <>
      <Grid item xs={12} md={12} sm={12} lg={12}>
        <Card
          style={{ borderRadius: "10px", flex: "0 0 100%", height: "100%" }}
        >
          <CardHeader style={{ padding: "5px", borderBottom: "0px" }}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={6} sm={6} lg={6}>
                <div style={{ display: "flex" }}>
                  <div
                    className="dashboard-font"
                    style={{
                      position: "relative",
                      left: "15px",
                      // marginBottom: "10px",
                      marginTop: "5px",
                    }}
                  >
                    COMPLAINTS
                  </div>{" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                {/* <Grid container spacing={1}> */}
                <Grid
                  item
                  xs={6}
                  md={6}
                  sm={6}
                  lg={6}
                  style={{
                    position: "relative",
                    left: "0px",
                    paddingTop: "0px",
                  }}
                >
                  <p
                    className="complaint_count"
                    style={{
                      marginTop: "-5px",
                      marginBottom: "0px",
                      fontSize: "20px",
                    }}
                  >
                    {props.clicked ? (
                      <span>{props.headerData?.context?.all}</span>
                    ) : (
                      <span>{complaintsData.context?.all}</span>
                    )}
                  </p>
                </Grid>
                {/* </Grid> */}
              </Grid>

              <Grid item xs={6} md={6} sm={6} lg={6}>
                {ShowComplaintSwitch && (
                  <>
                    <p className="SwitchIconlabel">Till Now</p>
                    <div onClick={switchHandler} className="SwitchIcon">
                      {props.clicked ? (
                        <ToggleOffOutlinedIcon className="switchIconSize" />
                      ) : (
                        <ToggleOnOutlinedIcon className="switchIconSizeEnable" />
                      )}
                    </div>
                  </>
                )}
                <Link
                  to={{
                    pathname: `${process.env.PUBLIC_URL}/app/ticket/all/${process.env.REACT_APP_API_URL_Layout_Name}`,
                    state: {
                      customstartdate:props.clicked?props?.FilterStartDate:'',
                      customenddate: props.clicked? props?.FilterEndDate:'' ,
                      pathFrom:"complaintCard"
                    },
                  }}
                >
                  <i
                    style={{
                      position: "relative",
                      marginTop: "4px",
                      left: "85px",
                    }}
                    class="fa fa-arrow-right"
                  ></i>
                </Link>
              </Grid>
            </Grid>
          </CardHeader>
          <CardBody style={{ padding: "0px", margin: "0px" }}>
            {props.clicked ? (
              <ComplaintsBarChart
                headerData={props.headerData}
                setHeaderData={props.setHeaderData}
                headerDaterangeselection={props.headerDaterangeselection}
                getstartdateenddate={props.getstartdateenddate}
                defaultDateFilter={props.defaultDateFilter}
                filterStartDate={props?.FilterStartDate}
                filterEndDate={props?.FilterEndDate}
              />
            ) : (
              <ComplaintsSwitchBarChart
                complaintsData={complaintsData}
                setHeaderData={setComplaintsData}
              />
            )}
          </CardBody>
          <br />
        </Card>
      </Grid>
    </>
  );
};

export default CompaintCard;
