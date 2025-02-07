import React,{ useState, useEffect} from "react";
import { Doughnut } from "react-chartjs-2";
import Grid from "@mui/material/Grid";
import { Card,CardBody,Row, Col} from "reactstrap";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
const NewLeadsByStatus = ({leadInfo}) => {
  const doughnutData = {
    labels: ["Open Lead", "Feasible Lead", "Non Feasible Lead","Closed But Not Converted","Closed And Converted","Lead Conversion"],
    datasets: [
      {
        label: "My First Dataset",
        data: [
            leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.OPEN ? leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.OPEN:"0", 
            leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.QL ? leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.QL:"0", 
            leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.UQL ? leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.UQL:"0", 
            leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.CBNC ? leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.CBNC:"0", 
            leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.CNC ? leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.CNC:"0", 
            leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.LC ? leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.LC:"0", 
        
        ],
        backgroundColor: ["#344cab", "#87a4d8", "#e9b626","#dd5663","#7558cf","#5a87fa"],
      },
    ],
  };
  const doughnutOption = {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    plugins: {
      datalabels: {
        display: false,
        color: "white",
      },
    },
  };

  const [plugins, setplugins] = useState();
  useEffect(()=>{

    if(!!leadInfo.total_lead_count){
      setplugins([{
        beforeDraw: function(chart) {
         var width = chart.width,
             height = chart.height,
             ctx = chart.ctx;
             ctx.restore();
             var fontSize = (height / 210).toFixed(2);
             ctx.font = fontSize + "em sans-serif";
             ctx.textBaseline = "top";
             var text = "Total " + `${leadInfo.total_lead_count}`,
             textX = Math.round((width - ctx.measureText(text).width) / 2),
             textY = height / 2.1;
             ctx.fillText(text, textX, textY);
             ctx.save();
        } 
      }])
    }
  }, [leadInfo])

  return (
    <>
      <Card style={{height: "93%", padding:'25px'}}>
          <Row>
         
            <Col md={7} >
              <div className="card-title leads-generated" style={{fontSize:"20px"}}>Leads By Status</div>
            </Col>
             <Col md={5}>
             <a href={`/app/leads/leadsContainer/${process.env.REACT_APP_API_URL_Layout_Name}`}>
            <ArrowForwardIcon className="lead-arrow-icon"/> 
             </a>
             </Col>
          
          </Row>
       
        <Grid container spacing={1} style={{paddingTop:"25px",paddingRight:"35px", padddingBottom:"15px"}}>
            <Grid item md="6">
            <CardBody>
            {!!plugins && 
        <Doughnut
          data={doughnutData}
          options={doughnutOption}
          width={480}
          height={290}
          plugins={plugins}
        /> 
            }
        </CardBody>
            </Grid>
            <Grid item md="1"></Grid>
        <Grid item md="5" style={{paddingTop:"25px"}}>
        
          <Grid container spacing={1} style={{borderBottom:"2px solid" }}>
            <Grid item md="8">
              <p className="dashboardstatus">
                <b>Total</b>
                 </p>
            </Grid>
            
            <Grid item md="4">
              <p style={{ textAlign:"end"}} className="dashboardstatus"><b>{leadInfo && leadInfo.total_lead_count ? leadInfo && leadInfo.total_lead_count:"0"}</b></p>
            </Grid>
          </Grid>
         
          <Grid container spacing={1} style={{borderBottom:"1px solid gray"}}>
            <Grid item md="10"  className="Grid-checkbox">
            <p className="Active-checkbox-color"></p> 
              <p className="dashboardstatus">Open Leads </p>
            </Grid>
            <Grid item md="2">     
              <p style={{ textAlign:"end"}} className="dashboardstatus">{leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.OPEN ? leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.OPEN:"0"} </p>
            </Grid>
          </Grid>
          <Grid container spacing={1} style={{borderBottom:"1px solid gray"}}>
            <Grid item md="10" className="Grid-checkbox" >
            <p className="Deactive-checkbox-color"></p>
              <p className="dashboardstatus">Feasible Leads</p>
            </Grid>
            <Grid item md="2">
              <p style={{ textAlign:"end"}} className="dashboardstatus">{  leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.QL ? leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.QL:"0"}</p>
            </Grid>
          </Grid>

          <Grid container spacing={1} style={{borderBottom:"1px solid gray"}}>
            <Grid item md="10" className="Grid-checkbox" >
            <p className="Non-Feasible-lead-checkbox-color"></p>
              <p className="dashboardstatus">Non Feasible Leads</p>
            </Grid>
            <Grid item md="2">
              <p style={{ textAlign:"end"}} className="dashboardstatus">{leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.UQL ? leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.UQL:"0"}</p>
            </Grid>
          </Grid>
          
          
          <Grid container spacing={1} style={{borderBottom:"1px solid gray"}}>
            <Grid item md="10" className="Grid-checkbox">
            <p className="Offline-checkbox-color"></p>
              <p className="dashboardstatus" >Closed But Not Converted</p>
            </Grid>
            <Grid item md="2">
              <p style={{ textAlign:"end"}} className="dashboardstatus">{leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.CBNC ? leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.CBNC:"0"}</p>
            </Grid>
          </Grid>
          
          <Grid container spacing={1} style={{borderBottom:"1px solid gray"}}>
            <Grid item md="10"  className="Grid-checkbox">
            <p className="Closed-and-Converted-checkbox-color"></p>
              <p className="dashboardstatus">Closed And Converted</p>
            </Grid>
            <Grid item md="2">
              <p style={{ textAlign:"end"}} className="dashboardstatus">{  leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.CNC ? leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.CNC:"0"}</p>
            </Grid>
          </Grid>
          
          <Grid container spacing={1} style={{borderBottom:"1px solid gray"}}>
            <Grid item md="10"  className="Grid-checkbox">
            <p className="lead-checkbox-color"></p>
              <p className="dashboardstatus">Leads Conversion</p>
            </Grid>
            <Grid item md="2">
              <p style={{ textAlign:"end"}} className="dashboardstatus">{leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.LC ? leadInfo && leadInfo.status_count_dict && leadInfo.status_count_dict.LC:"0"}</p>
            </Grid>
          </Grid>
        </Grid>
            </Grid>
        
       
      </Card>
    </>
  );
};

export default NewLeadsByStatus;
