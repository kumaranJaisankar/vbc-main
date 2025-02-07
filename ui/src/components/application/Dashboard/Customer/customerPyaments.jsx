import React,{ useState} from "react";
import Grid from "@mui/material/Grid";
import { Modal, ModalBody, ModalHeader, ModalFooter, Button} from "reactstrap";
import CustomerExpiredTable from './CustomerExpiredTable';
const CustomerPayments = ({ customerInfo }) => {

  // modal
  const [todayConnection, setTodayConnection] = useState(false);
  const todayConnectionModal = () => setTodayConnection(!todayConnection);
  const [expiredTableRange, setExpiredTableRange] = useState('Today');
  return (
    <>
      <Grid container spacing={1}  className = "Main-grid" style={{paddingTop:"50px"}}>
        <Grid item md="6">
          <Grid container spacing={1} >
            <Grid item md="8">
              <h6>Expiring Today</h6>
            </Grid>
            <Grid item md="4" >
              <h4>
                {customerInfo && customerInfo.today_expiry
                  ? customerInfo && customerInfo.today_expiry
                  : "0"}
              </h4>
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={1}>
            <Grid item md="8">
              <h6>Expiring In Next 7 Days</h6>
            </Grid>
            <Grid item md="4" >
              <h4>
                {customerInfo && customerInfo.upcoming_user_expiry_next7days
                  ? customerInfo && customerInfo.upcoming_user_expiry_next7days
                  : "0"}
              </h4>
            </Grid>
          </Grid>
        </Grid>

        <Grid item md="6">
          <Grid container spacing={1} style={{borderBottom:"1px solid gray"}}>
            <Grid item md="8" style={{marginBottom:"6px"}} className="dashboardstatus">
              Expiring Today
            </Grid>
            <Grid item md="4"  onClick={()=>{
                        setExpiredTableRange('Today');
                        todayConnectionModal();
                      }}>
              <p style={{ textAlign: "end" ,cursor:"pointer",color:"#1565c0",fontWeight:"bold" }} className="dashboardstatus">
                {" "}
                {customerInfo && customerInfo.today_expiry
                  ? customerInfo && customerInfo.today_expiry
                  : "0"}
              </p>
            </Grid>
          </Grid>
        
          <Grid container spacing={1} style={{borderBottom:"1px solid gray"}}>
            <Grid item md="8" style={{padding:"8px"}} className="dashboardstatus">
              Expiring Tomorrow
            </Grid>
            <Grid item md="4" onClick={()=>{
                        setExpiredTableRange('Tomorrow');
                        todayConnectionModal();
                      }}>
              <p style={{ textAlign: "end",cursor:"pointer",color:"#1565c0",fontWeight:"bold" }} className="dashboardstatus">
                {customerInfo && customerInfo.upcoming_user_expiry_tomorrow
                  ? customerInfo && customerInfo.upcoming_user_expiry_tomorrow
                  : "0"}
              </p>
            </Grid>
          </Grid>
       
          <Grid container spacing={1} style={{borderBottom:"1px solid gray"}}>
            <Grid item md="8" style={{padding:"8px"}} className="dashboardstatus">
              Expiring In Next 7 Days
            </Grid>
            <Grid item md="4" onClick={()=>{
                        setExpiredTableRange('Next 7 Days');
                        todayConnectionModal();
                      }}>
              <p style={{ textAlign: "end",cursor:"pointer",color:"#1565c0",fontWeight:"bold" }} className="dashboardstatus">
                {" "}
                {customerInfo && customerInfo.upcoming_user_expiry_next7days
                  ? customerInfo && customerInfo.upcoming_user_expiry_next7days
                  : "0"}
              </p>
            </Grid>
          </Grid>
      
        </Grid>
      </Grid>
        {/* modal */}
        <Modal isOpen={todayConnection} toggle={todayConnectionModal} centered size="lg">
        <ModalFooter>
        <Button color="secondary" id ="resetid" onClick={todayConnectionModal}>{"Close"}</Button>
        </ModalFooter>
        <ModalBody>
        <h5  style={{marginTop:"-65px",width:"70%"}}>Customers Expiring {expiredTableRange}</h5>
          <CustomerExpiredTable expiredTableRange={expiredTableRange}/>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CustomerPayments;
