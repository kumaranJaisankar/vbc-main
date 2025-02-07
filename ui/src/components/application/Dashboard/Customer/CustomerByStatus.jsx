import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import BarChart from "../Charts/BarChart";
import DateSelect from "../Common/DateSelect";
import pick from "lodash/pick";
import moment from "moment";
import { Doughnut } from "react-chartjs-2";             
import Grid from "@mui/material/Grid";


// const CustomerByStatus = ({ customers_by_account_status, defautDatePickerValue, getCustomerInfoBydate}) => {
//     const [customerStatus, setCustomerStatus]= useState([]);
//     const [customerStatusdateRange, setCustomerStatusDateRange] = useState(defautDatePickerValue)

//     useEffect(()=>{
//         const startDate = moment(customerStatusdateRange[0]).format("YYYY-MM-DD")
//         const endDate = moment(customerStatusdateRange[1]).format("YYYY-MM-DD")
//         getCustomerInfoBydate(startDate, endDate, 'customerStatus');
//     },[customerStatusdateRange])

//     useEffect(()=>{
//         if(customers_by_account_status){

//             const dataList = Object.keys(customers_by_account_status).map((d)=>{
//                 if(d === "ins"){
//                     return [
//                         'Installed',
//                         customers_by_account_status[d],
//                         'color: #FFCC57'
//                     ]
//                 }
//                 if(d === 'prov'){
//                     return [
//                         'Provisioning',
//                         customers_by_account_status[d],
//                         'color: #45BEBF'
//                     ]
//                 }
//                 if(d === 'kyc'){
//                     return [
//                         'Kyc Confirmed',
//                         customers_by_account_status[d],
//                         'color: #FA657F'
//                     ]
//                 }
//                 if(d === 'exp'){
//                     return [
//                         'Expired',
//                         customers_by_account_status[d],
//                         'color: #6C6C6C'
//                     ]
//                 }
//                 if(d === 'spd'){
//                     return [
//                         'Suspended',
//                         customers_by_account_status[d],
//                         'color: #928AEF'
//                     ]
//                 }
//             })
//             setCustomerStatus(dataList.filter(d=>d != undefined));
//         }

//     },[customers_by_account_status]);                   

//     return (
//         <div>
//             <div style={{ textAlign: 'right' }}>
//             <DateSelect setDateRange={setCustomerStatusDateRange} defaultPickerValue={defautDatePickerValue}/>
//             </div>
//                             <BarChart style={{ margin: 'auto', width: "550px", height: "300px" }}
//                                 data={[
//                                         ['Device', 'count', { role: 'style' }],
//                                         ...customerStatus
//                                     ]}

//                                 options={{
//                                     legend: 'none',
//                                     colors: [
//                                         "#FFCC57",
//                                         '#45BEBF',
//                                         "#FA657F",
//                                         "#928AEF",
//                                         "#6C6C6C"
//                                     ],
//                                     tooltip: {
//                                         text: 'value'
//                                     },
//                                     pieSliceText: 'value'
//                                 }} />
//         </div>
//     );
// };

// CustomerByStatus.propTypes = {

// };

const CustomerByStatus = ({customerInfo,props}) => {
  const doughnutData = {
    labels: ["Active", "Deactive", "Expired","Offline","Online"],
    datasets: [
      {
        label: "My First Dataset",
        data: [customerInfo && customerInfo.customers_by_status && customerInfo.customers_by_status.act ? customerInfo && customerInfo.customers_by_status && customerInfo.customers_by_status.act: "0", 
        customerInfo && customerInfo.customers_by_status && customerInfo.customers_by_status.dct ? customerInfo && customerInfo.customers_by_status && customerInfo.customers_by_status.dct : "0", 
        customerInfo && customerInfo.customers_by_status && customerInfo.customers_by_status.exp ? customerInfo && customerInfo.customers_by_status && customerInfo.customers_by_status.exp : "0", 
        customerInfo && customerInfo.status_counts && customerInfo.status_counts.offline ? customerInfo && customerInfo.status_counts && customerInfo.status_counts.offline : "0", 
        customerInfo && customerInfo.status_counts && customerInfo.status_counts.online ? customerInfo && customerInfo.status_counts && customerInfo.status_counts.online : "0", 
      
      ],
        backgroundColor: ["#344cab", "#87a4d8", "#c1d7fe","#cddffe","#99ff99"],
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


  // const plugins = [{
  //   beforeDraw: function(chart) {
  //    var width = chart.width,
  //        height = chart.height,
  //        ctx = chart.ctx;
  //        ctx.restore();
  //        var fontSize = (height / 160).toFixed(2);
  //        ctx.font = fontSize + "em sans-serif";
  //        ctx.textBaseline = "top";
  //        var text = props && props.customerInfo.total_no_of_customers,   
  //        textX = Math.round((width - ctx.measureText(text).width) / 2),
  //        textY = height / 2;
  //        ctx.fillText(text, textX, textY);
  //        ctx.save();
  //   } 
  // }]

  const [plugins, setplugins] = useState();
  useEffect(()=>{

    if(!!customerInfo.total_no_of_customers){
      setplugins([{
        beforeDraw: function(chart) {
         var width = chart.width,
             height = chart.height,
             ctx = chart.ctx;
             ctx.restore();
             var fontSize = (height / 210).toFixed(2);
             ctx.font = fontSize + "em sans-serif";
             ctx.textBaseline = "top";
             var text = "Total " + `${customerInfo.total_no_of_customers}`,
             textX = Math.round((width - ctx.measureText(text).width) / 2),
             textY = height / 2.1;
             ctx.fillText(text, textX, textY);
             ctx.save();
        } 
      }])
    }
  }, [customerInfo])

  return (
    <>
      <Grid container spacing={1} className = "Main-grid" >
        <Grid item xs="6">
        {!!plugins && 
          <Doughnut  
            data={doughnutData}
            options={doughnutOption}
            width={380}
            height={190}
            plugins={plugins}
            
          />
        }
        </Grid>
        <Grid item xs="1"></Grid>
        <Grid item xs="5" style={{paddingTop:"36px"}}>
        
          <Grid container spacing={1} style={{borderBottom:"2px solid" }}>
            <Grid item xs="8">
              <p>
                <b>Total</b>
                 </p>
            </Grid>
            
            <Grid item xs="4">
              <p style={{ textAlign:"end"}} className="dashboardstatus"><b>{customerInfo && customerInfo.total_no_of_customers ? customerInfo && customerInfo.total_no_of_customers:"0"}</b></p>
            </Grid>
          </Grid>
         
          <Grid container spacing={1} style={{borderBottom:"1px solid gray"}}>
            <Grid item xs="8"  className="Grid-checkbox">
            <p className="Active-checkbox-color"></p>
              <p className="dashboardstatus">Active </p>
            </Grid>
            <Grid item xs="4">     
              <p style={{ textAlign:"end"}} className="dashboardstatus">{customerInfo && customerInfo.customers_by_status && customerInfo.customers_by_status.act ? customerInfo && customerInfo.customers_by_status && customerInfo.customers_by_status.act: "0"}</p>
            </Grid>
          </Grid>
          <Grid container spacing={1} style={{borderBottom:"1px solid gray"}}>
            <Grid item xs="8" className="Grid-checkbox">
            <p className="Deactive-checkbox-color"></p>
              <p className="dashboardstatus">Deactive </p>
            </Grid>
            <Grid item xs="4">
              <p style={{ textAlign:"end"}} className="dashboardstatus">{customerInfo && customerInfo.customers_by_status && customerInfo.customers_by_status.dct ? customerInfo && customerInfo.customers_by_status && customerInfo.customers_by_status.dct : "0"}</p>
            </Grid>
          </Grid>
          
          <Grid container spacing={1} style={{borderBottom:"1px solid gray"}}>
            <Grid item xs="8"  className="Grid-checkbox">
            <p className="Expired-checkbox-color"></p>
              <p className="dashboardstatus">Expired</p>
            </Grid>
            <Grid item xs="4">
              <p style={{ textAlign:"end"}} className="dashboardstatus">{customerInfo && customerInfo.customers_by_status && customerInfo.customers_by_status.exp ? customerInfo && customerInfo.customers_by_status && customerInfo.customers_by_status.exp : "0"}</p>
            </Grid>
          </Grid>
          
          <Grid container spacing={1} style={{borderBottom:"1px solid gray"}}>
            <Grid item xs="8" className="Grid-checkbox">
            <p className="Offline-checkbox-color"></p>
              <p className="dashboardstatus">Offline</p>
            </Grid>
            <Grid item xs="4">
              <p style={{ textAlign:"end"}} className="dashboardstatus">{ customerInfo && customerInfo.status_counts && customerInfo.status_counts.offline ? customerInfo && customerInfo.status_counts && customerInfo.status_counts.offline : "0"}</p>
            </Grid>
          </Grid>
          
          <Grid container spacing={1} style={{borderBottom:"1px solid gray"}}>
            <Grid item xs="8"  className="Grid-checkbox">
            <p className="Online-checkbox-color"></p>
              <p className="dashboardstatus">Online</p>
            </Grid>
            <Grid item xs="4">
              <p style={{ textAlign:"end"}} className="dashboardstatus">{ customerInfo && customerInfo.status_counts && customerInfo.status_counts.online ? customerInfo && customerInfo.status_counts && customerInfo.status_counts.online : "0"}</p>
            </Grid>
          </Grid>
          
        </Grid>
      </Grid>
    </>
  );
};

export default CustomerByStatus;
