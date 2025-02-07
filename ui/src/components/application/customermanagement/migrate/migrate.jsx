import React, { useState } from "react";
import { Modal } from "../../../../mui/modal";
import { ModalBody, ModalFooter, ModalHeader, Button, Row, Col, Spinner } from "reactstrap";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import SourcePlan from "./sourceplan";
import Selectareas from "./selectarea1";
import TargetPlan from "./targetPlan";
import { customeraxios, servicesaxios } from "../../../../axios";
import { toast } from "react-toastify";
import MigrateCustomerlist from "./customerlist";
import Migrateotp from "./migrateOtp";

const MigrateModal = ({ open, handleClose, BasicLineTab, setBasicLineTab }) => {
  const [customerIdChecked, setCustomerIdChecked] = useState([]);
  //otp verification states
  const [otpverify, setOtpverify] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const OTpverifytoggle = () => setModalOpen(!modalOpen);

  const [sourceplan, setSourceplan] = useState([]);
  const [disableNext, setDisableNext] = useState(true);
  const [selected, setSelected] = useState([]);
  const [students, setStudents] = useState([]);


  const [radioButtonPlanId, setRadioButtonPlanId] = useState();
  const [radioButtonPlanId1, setRadioButtonPlanId1] = useState();

  const [radioButtonTargetPlanId, setRadioButtonTargetPlanId] = useState();

  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState();

  //franchise states
  const [selectedFranchises, setSelectedFranchises] = useState([]);
  const [selectedFranchise, setSelectedFranchise] = useState();

  //target plan states
  const [planlist, setPlanlist] = useState([]);
  const [areaIds, setAreaIds] = useState([]);
  const [migrateTargetPlan, setMigrateTagetPlan] = useState([]);

  const [plansNextDisable, setPlansNextDisable] = useState(true);
  const [targetPlansNextDisable, setTargetPlansNextDisable] = useState(true);
  const [CustomerListNextDisable, setCustomerListNextDisable] = useState(true);


  const [isChecked, setIsChecked] = useState([]);
  const [zoneSelected, setZoneSelected] = useState([]);
  const [branchAreaSelected, setBranchAreaSelected] = useState([]);
  const [franchiseAreaSelected, setFranchiseAreaSelected] = useState([]);
  const [loaderSpinneer, setLoaderSpinner] = useState(false)



  const [franchiseZoneSelected, setFranchiseZoneSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedbranchradiobutton, setSelectedbranchradiobutton] =
    useState("branch");

  var customers = areaIds;

  //states fro customerlist
  const [clearSelection, setClearSelection] = useState(false);
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [filteredData, setFiltereddata] = useState(customers);
  const [notOpenLeadIdsForDelete, setNotOpenLeadIdsForDelete] = useState([]);

  const nextPageHandler2 = () => {
    targetPlans();
    // setRadioButtonPlanId(radioButtonPlanId);
    setDisableNext(false);
    setBasicLineTab("2");
  };
  const nextPageHandler3 = () => {
    // setRadioButtonPlanId(radioButtonPlanId);
    setBasicLineTab("3");
    onselectionofAreas();

  };
  const nextPageHandler4 = () => {
    setBasicLineTab("4");
  };


  const secondPage = () => {
    setBasicLineTab("1");
  };
  const thirdPage = () => {
    setBasicLineTab("2");
  };
  const fourthPage = () => {
    setBasicLineTab("3");
    setCustomerIdChecked([]);
  };



  const handleOnChange = (selectedAreas, value) => {
    setZoneSelected(selectedAreas);
    setBranchAreaSelected(value.checkedNodes.map((data) => data.id));
    console.log(
      value.checkedNodes.map((data) => data.id),
      "idsarea"
    );
  };

  const handleOnChangeFranchise = (selectedFranchises, value) => {
    setFranchiseZoneSelected(selectedFranchises);
    setFranchiseAreaSelected(value.checkedNodes.map((data) => data.id))
    console.log(selectedFranchises, "selectedFranchises");
  };

  const targetPlans = () => {
    const data = {
      service_plan_id: radioButtonPlanId,

      entity_type: "branch",

      entity_id: 2,
    };
    setLoading(true);

    servicesaxios
      .post("plans/changeplan/targetplanlist", data)
      .then((response) => {
        setPlanlist(response.data);
      });
    setLoading(false);

  };
  const onselectionofAreas = () => {
    setLoading(true);
    const data = { plan_id: radioButtonPlanId1, areas: selectedbranchradiobutton === "branch" ? branchAreaSelected : franchiseAreaSelected };
    customeraxios
      .post("customers/changeplan/customerlist", data)
      .then((response) => {
        setAreaIds(response.data);
        console.log(response.data, "selectedareids");
        setLoading(false);

      });
  };

  const migrateHandler = () => {
    const data = {
      customer_list: customerIdChecked,

      target_plan: radioButtonTargetPlanId,
    };
    setLoaderSpinner(true)
    customeraxios
      .post("customers/database/changeplan", data)
      .then((response) => {
        setMigrateTagetPlan(response.data);
        console.log(response.data, "migrateplan");
        toast.success("Plan Migrated successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        handleClose();
        setFiltereddata('')
        setNotOpenLeadIdsForDelete([]);
        setLoaderSpinner(false)
        setBasicLineTab("1");
        setCustomerIdChecked([]);
        setRadioButtonTargetPlanId();
      })
      .catch(function (error) {
        setLoaderSpinner(false)
        setBasicLineTab("1");
        setCustomerIdChecked([]);
        setRadioButtonTargetPlanId();

        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is404Error = errorString.includes("404");
        if (error.response && error.response.data.detail) {
          toast.error(error.response && error.response.data.detail, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        } else if (is500Error) {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        } else {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        }
      });
  };





  return (
    <>
      <Modal
        open={open}
        maxWidth="lg"
        backdrop="static"
        sx={{ "& .MuiDialog-paper": { width: "70%", maxHeight: 600 } }}
      >
        <ModalBody
          className="renew-change-plan-modal-body"
          style={{
            padding: "35px",
            // maxHeight: "600px",
            overflow: "auto",
          }}
        >
          <Row id="source_row">
            <Col>
              <h5>Select Source Plans</h5>
            </Col>
            <Col id="soruce_close">
              <i className="icon-close" onClick={handleClose}></i>
            </Col>
          </Row>
          <Box>
            <Grid>
              <Nav
                className="border-tab"
                tabs
                style={{ pointerEvents: "none" }}
              >
                <NavItem className="custlist">
                  <NavLink className={BasicLineTab === "1" ? "active" : ""}>
                    {"Source Plan"}
                  </NavLink>
                </NavItem>
                <NavItem className="custlist" style={{ marginLeft: "10px" }}>
                  <NavLink className={BasicLineTab === "2" ? "active" : ""}>
                    {"Select Areas"}
                  </NavLink>
                </NavItem>
                <NavItem className="custlist" style={{ marginLeft: "10px" }}>
                  <NavLink className={BasicLineTab === "3" ? "active" : ""}>
                    {"Customer list"}
                  </NavLink>
                </NavItem>
                <NavItem className="custlist" style={{ marginLeft: "10px" }}>
                  <NavLink className={BasicLineTab === "4" ? "active" : ""}>
                    {"Target Plan"}
                  </NavLink>
                </NavItem>
              </Nav>
            </Grid>
          </Box>
          <TabContent activeTab={BasicLineTab}>
            <TabPane
              className="fade show"
              tabId="1"
              style={{ position: "relative", top: "-19px" }}
            >
              <SourcePlan
                changesourceplan={sourceplan}
                setSourceplan={setSourceplan}
                setRadioButtonPlanId1={setRadioButtonPlanId1}
                setRadioButtonPlanId={setRadioButtonPlanId}
                disable={setPlansNextDisable}
              />
            </TabPane>
            <TabPane tabId="2">
              <Selectareas
                // changesourceplan={sourceplan}
                selectedbranchradiobutton={selectedbranchradiobutton}
                setSelectedbranchradiobutton={setSelectedbranchradiobutton}
                isChecked={isChecked}
                setIsChecked={setIsChecked}
                handleOnChange={handleOnChange}
                handleOnChangeFranchise={handleOnChangeFranchise}
                selected={selected}
                setSelected={setSelected}
                selectedAreas={selectedAreas}
                setSelectedAreas={setSelectedAreas}
                setSelectedArea={setSelectedArea}
                selectedArea={selectedArea}
                selectedFranchises={selectedFranchises}
                zoneSelected={zoneSelected}
                franchiseZoneSelected={franchiseZoneSelected}
                selectedFranchise={selectedFranchise}
                setSelectedFranchise={setSelectedFranchise}
                setSelectedFranchises={setSelectedFranchises}
              // setRadioButtonPlanId={setRadioButtonPlanId}
              />
            </TabPane>
            <TabPane tabId="3">
              <MigrateCustomerlist
                loading={loading}
                areaIds={areaIds}
                setAreaIds={setAreaIds}
                setCustomerIdChecked={setCustomerIdChecked}
                customerIdChecked={customerIdChecked}
                setClearSelection={setClearSelection}
                setVerticalcenter={setVerticalcenter}
                Verticalcenter={Verticalcenter}
                setFiltereddata={setFiltereddata}
                filteredData={filteredData}
                setNotOpenLeadIdsForDelete={setNotOpenLeadIdsForDelete}
                setTargetPlansNextDisable={setTargetPlansNextDisable}
              />
            </TabPane>
            <TabPane tabId="4">
              <TargetPlan
                loading={loading}
                setPlanlist={setPlanlist}
                planlist={planlist}
                setRadioButtonTargetPlanId={setRadioButtonTargetPlanId}
                disable={setTargetPlansNextDisable}
              />
            </TabPane>
          </TabContent>
        </ModalBody>
        <ModalFooter>
          {BasicLineTab === "3" && (
            <Button color="" onClick={thirdPage} id="resetid" type="button">
              {"Back"}
            </Button>
          )}
          {BasicLineTab === "4" && (
            <Button color="" onClick={fourthPage} id="resetid" type="button">
              {"Back"}
            </Button>
          )}
          {BasicLineTab === "4" && (
            <Button
              color=""
              id="migrate_button"
              type="button"
              onClick={(e) => {
                // migrateHandler();
                setModalOpen(true)
              }}
              // disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
              disabled={targetPlansNextDisable}

            >
              {/* {loaderSpinneer ?  <Spinner size="sm" id="spinner"> </Spinner> :null} &nbsp; */}
              {"Migrate"}

            </Button>
          )}
          {BasicLineTab === "2" && (
            <Button color="" onClick={secondPage} id="resetid" type="button">
              {"Back"}
            </Button>
          )}
          {BasicLineTab === "1" && (
            <Button
              color=""
              id="submit_button"
              onClick={nextPageHandler2}
              disabled={plansNextDisable}
            >
              {"Next"}
            </Button>
          )}
          {BasicLineTab === "2" && (
            <Button color="" id="submit_button" onClick={nextPageHandler3}>
              {"Next"}
            </Button>
          )}
          {BasicLineTab === "3" && (
            <Button color="" id="submit_button" onClick={nextPageHandler4}
              disabled={areaIds.length === 0 ? true : false}
            >
              {"Next"}
            </Button>
          )}
        </ModalFooter>
      </Modal>
      <>
        <Modal
          backdrop="static"
          open={modalOpen}
          centered>
          <ModalBody>
            <p>
              <Migrateotp
                leadForSubmit={migrateTargetPlan}
                handleSubmit={migrateHandler}
                OTpverifytoggle={OTpverifytoggle}
                migrateHandler={migrateHandler}
              />
            </p>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </Modal>


      </>
    </>
  );
};
export default MigrateModal;
