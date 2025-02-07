import React, { useState } from "react";
import CustomerExpiredTable from "./CustomerExpiredTable";
import Grid from "@mui/material/Grid";
import {
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  Col,
  Row,
  Container,
  Spinner,
} from "reactstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import CustomerActivationsTable from "./CustomerActivationsTable";
import AlreadyExpiry from "./AlredayExpired";
import TodayAboutToExpiry from "./TodayAboutroExpiry";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";

const NewCustomerActivity = (props) => {
  var customerInfo = props.newCustomerData;
  // modal
  const [todayConnection, setTodayConnection] = useState(false);
  const todayConnectionModal = () => setTodayConnection(!todayConnection);
  const [expiredTableRange, setExpiredTableRange] = useState("Expired Today");

  const [customerActivation, setCustomerActivations] = useState(false);
  const activationModal = () => setCustomerActivations(!customerActivation);
  const [activeTable, setActiveTable] = useState("Today");

  // about to expiry
  const [alredyExpired, setalredyExpired] = useState(false);
  const todayalredyExpired = () => setalredyExpired(!alredyExpired);
  const [expiredToday, setExpiredToday] = useState("Today");

  // become expired

  const [becomeExpired, setBecomeExpired] = useState(false);
  const todaybecomeExpired = () => setBecomeExpired(!becomeExpired);
  const [becomeoday, setBecomeToday] = useState("Today");

  const tokenInfo = JSON.parse(localStorage.getItem("token"));
  let ShowTrendIcon = false;
  if (
    (tokenInfo && tokenInfo.user_type === "Admin") ||
    (tokenInfo && tokenInfo.user_type === "Super Admin") ||
    (tokenInfo && tokenInfo.user_type === "Franchise Owner") ||
    (tokenInfo && tokenInfo.user_type === "Branch Owner")
  ) {
    ShowTrendIcon = true;
  }

  return (
    <>
      {" "}
      <Card
        className="custom-card1"
        style={{
          borderRadius: "10px",
          flex: "0 0 100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {false ? (
          <Grid container spacing={2} className="loadercenter">
            <Spinner size="lg" className="dashboard_spinner">
              {" "}
            </Spinner>
          </Grid>
        ) : (
          <>
            <div style={{ textAlign: "center" }}>
              <h2 style={{ color: "#19345fab" }}>Total Active Staff</h2>
              <h1 style={{ fontSize: "70px", color: "#1890ff8c" }}>
                {props.staffCount ? props.staffCount : 0}
              </h1>
            </div>
          </>
        )}
      </Card>
      {/* expiry table for yesterday , next 7 days */}
      <Modal
        isOpen={todayConnection}
        toggle={todayConnectionModal}
        centered
        size="lg"
      >
        <ModalFooter>
          <Button color="secondary" id="resetid" onClick={todayConnectionModal}>
            {"Close"}
          </Button>
        </ModalFooter>
        <ModalBody>
          <h5 style={{ marginTop: "-65px", width: "fit-content" }}>
            Customers {expiredTableRange}
          </h5>
          <CustomerExpiredTable expiredTableRange={expiredTableRange} />
        </ModalBody>
      </Modal>
      <Modal
        isOpen={customerActivation}
        toggle={activationModal}
        centered
        size="lg"
      >
        <ModalFooter>
          <Button color="secondary" id="resetid" onClick={activationModal}>
            {"Close"}
          </Button>
        </ModalFooter>
        <ModalBody>
          <h5 style={{ marginTop: "-65px", width: "70%" }}>
            Customers New Connections {activeTable}
          </h5>
          <CustomerActivationsTable activeTable={activeTable} />
        </ModalBody>
      </Modal>
      {/* already expired */}
      <Modal
        isOpen={alredyExpired}
        toggle={todayalredyExpired}
        centered
        size="lg"
      >
        <ModalFooter>
          <Button color="secondary" id="resetid" onClick={todayalredyExpired}>
            {"Close"}
          </Button>
        </ModalFooter>
        <ModalBody>
          <h5 style={{ marginTop: "-65px", width: "fit-content" }}>
            Customers Expired {expiredToday}
          </h5>
          <AlreadyExpiry expiredToday={expiredToday} />
        </ModalBody>
      </Modal>
      {/* become expiry */}
      <Modal
        isOpen={becomeExpired}
        toggle={todaybecomeExpired}
        centered
        size="lg"
      >
        <ModalFooter>
          <Button color="secondary" id="resetid" onClick={todaybecomeExpired}>
            {"Close"}
          </Button>
        </ModalFooter>
        <ModalBody>
          <h5 style={{ marginTop: "-65px", width: "fit-content" }}>
            Customers Expiring {becomeoday}
          </h5>
          <TodayAboutToExpiry becomeoday={becomeoday} />
        </ModalBody>
      </Modal>
    </>
  );
};

export default NewCustomerActivity;
