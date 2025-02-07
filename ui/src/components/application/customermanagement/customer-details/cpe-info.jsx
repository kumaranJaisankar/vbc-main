import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "../../../../mui/accordian";
import Typography from "@mui/material/Typography";
import { Card, CardBody } from "reactstrap";
import "rc-steps/assets/index.css";
import Steps from "rc-steps";
import { networkaxios } from "../../../../axios";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import { Grid } from "@mui/material";
const CPEInfo = ({ profileDetails, id, username }) => {
  const [expanded, setExpanded] = React.useState("panel7");
  const [showStepperListFromAddHardware, setShowStepperListFromAddHardware] =
    useState([]);
  const [availableHardware, setAvailableHardware] = useState({});
  const [parent, setParent] = useState([]);
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  let CPEText = "CPE is not configured for this Customer";
  const [showText, setShowText] = useState(false);
  useEffect(() => {
    parentnas(profileDetails?.serial_no, "parent_slno");
  }, []);
  useEffect(() => {
    parentnas(profileDetails?.serial_no, "parent_slno");
  }, [profileDetails?.serial_no]);

  useEffect(() => {
    let showStepperListNew = [];
    if (!!availableHardware && availableHardware.available_hardware) {
      const available_hardwareKeys = Object.keys(
        availableHardware.available_hardware
      );
      let available_hardwareKeysFinal = [];

      if (available_hardwareKeys.includes("parentnas_info")) {
        available_hardwareKeysFinal.push("parentnas_info");
      } else if (available_hardwareKeys.includes("nas_info")) {
        available_hardwareKeysFinal.push("nas_info");
      }
      if (available_hardwareKeys.includes("parentolt_info")) {
        available_hardwareKeysFinal.push("parentolt_info");
      } else if (available_hardwareKeys.includes("olt_info")) {
        available_hardwareKeysFinal.push("olt_info");
      }
      if (available_hardwareKeys.includes("parentdp2_info")) {
        available_hardwareKeysFinal.push("parentdp2_info");
      }
      if (available_hardwareKeys.includes("parentdp1_info")) {
        available_hardwareKeysFinal.push("parentdp1_info");
      }
      if (available_hardwareKeys.includes("childdp_info")) {
        available_hardwareKeysFinal.push("childdp_info");
      }

      const availableHardwareObject = {
        ...availableHardware.available_hardware,
      };

      showStepperListNew = available_hardwareKeysFinal.map((hardware) => {
        return {
          title: availableHardwareObject[hardware].device_type,
          name: availableHardwareObject[hardware].name,
          total_ports: availableHardwareObject[hardware].total_ports,
          available_ports: availableHardwareObject[hardware].available_ports,
          zone: availableHardwareObject[hardware].zone,
          connection_port: availableHardwareObject[hardware].connection_port,
          branch: availableHardwareObject[hardware].branch,
        };
      });
    }
    setShowStepperListFromAddHardware(showStepperListNew);
  }, [availableHardware]);

  const parentnas = async (val, name) => {
    if (val) {
      setShowText(false);
      networkaxios
        .get(`network/search/${val}`)
        .then((res) => {
          if (!Array.isArray(res.data)) {
            setParent([]);
          }

          let is_parent_oltport = null;
          if (Array.isArray(res.data) && name == "parent_slno") {
            let parentSlNoList = [...res.data];
            let lastObj = parentSlNoList[parentSlNoList.length - 1];
            let stepperList = [];

            if (lastObj["category"] == "ChildDp") {
              //search in parent sl no based in childdp entered
              stepperList.push({
                title: lastObj["parentnas"] != null ? lastObj["parentnas"] : "",
              });
              stepperList.push({
                title: lastObj["parentolt"] != null ? lastObj["parentolt"] : "",
              });
              stepperList.push({
                title:
                  lastObj["parentdp1"] != null ? lastObj["parentdp1"] : "none",
              });
              stepperList.push({
                title:
                  lastObj["parentdp2"] != null ? lastObj["parentdp2"] : "none",
              });
              stepperList.push({
                title:
                  lastObj["device_name"] != null ? lastObj["device_name"] : "",
              });
            }

            setAvailableHardware(lastObj);
            setShowStepperListFromAddHardware(stepperList);
            //end

            if (parentSlNoList[parentSlNoList.length - 1].category == "Olt") {
              is_parent_oltport = true;
            } else if (
              parentSlNoList[parentSlNoList.length - 1].category == "ParentDp"
            ) {
              is_parent_oltport = false;
            }
            if (Array.isArray(res.data)) {
              if (lastObj["usable"] == true) {
                setParent(res.data);
              }
            }
          }
          // else if (name = "parent_slno") {
          //   let stepperList = [...showStepperListFromAddHardware]
          //   stepperList[0].title = "";
          //   stepperList[1].title = "";
          //   stepperList[2].title = "";
          //   stepperList[3].title = "";
          //   stepperList[4].title = "";
          //   setAvailableHardware({})
          //   setShowStepperListFromAddHardware(stepperList);

          // }
        })
        .catch(function (error) {
          setAvailableHardware({});
          setShowStepperListFromAddHardware({});
        });
    } else {
      setShowText(true);
      setAvailableHardware({});
      setShowStepperListFromAddHardware([]);
    }
  };
  return (
    <Accordion
      style={{
        borderRadius: "15px",
        boxShadow: "0 0.2rem 1rem rgba(0, 0, 0, 0.15)",
        flex: "0 0 100%",
      }}
      expanded={expanded === "panel7"}
      onChange={handleChange("panel7")}
    >
      <AccordionSummary
        aria-controls="panel1a-content"
        id="online-session-info"
      >
        <Typography variant="h6" className="customerdetailsheading">
          CPE Information
        </Typography>
      </AccordionSummary>
      <AccordionDetails style={{ lineHeight: "3rem" }}>
        {!showText ? (
          <Card
            style={{
              height: "350px",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
            className="custom-scrollbar "
          >
            <CardBody style={{ padding: "15px" }}>
              <div className="customizer-contain-alloptical-expand-stepper-section-info">
                <Steps
                  current={showStepperListFromAddHardware.length}
                  direction="vertical"
                  labelPlacement="vertical"
                >
                  {showStepperListFromAddHardware.map((step) => {
                    return (
                      <Steps.Step
                        title={step.title}
                        description={
                          <div className="step-description">
                            <span>
                              Harware Device Name:
                              <span className="btn btn-primary btn-xs step-span">
                                {" "}
                                {step.name}
                              </span>
                            </span>
                            <br />
                            {step.branch && (
                              <>
                                <span>
                                  Current Device's Branch:
                                  <span className="btn btn-primary btn-xs step-span">
                                    {" "}
                                    {step.branch}
                                  </span>
                                </span>
                                <br />
                              </>
                            )}
                            {step.total_ports && (
                              <>
                                <span>
                                  Total ports & Available ports:
                                  <span className="btn btn-primary btn-xs step-span">
                                    {" "}
                                    ( {step.total_ports}/ {step.available_ports}
                                    )
                                  </span>
                                </span>
                                <br />
                              </>
                            )}
                            {step.zone && (
                              <>
                                <span>
                                  Current Device Zone:{" "}
                                  <span className="btn btn-primary btn-xs step-span">
                                    {" "}
                                    {step.zone}
                                  </span>
                                </span>
                                <br />
                              </>
                            )}
                            {step.connection_port && (
                              <>
                                {" "}
                                <span>
                                  Connection Port:
                                  <span className="btn btn-primary btn-xs step-span">
                                    {step.connection_port}
                                  </span>
                                </span>
                                <br />
                              </>
                            )}
                          </div>
                        }
                      />
                    );
                  })}
                </Steps>
              </div>
            </CardBody>
          </Card>
        ) : (
          <Grid spacing={1} container sx={{ mb: "5px" }}>
            <Grid item md="12">
              <span className="cust_details" style={{ marginLeft: "60px" }}>
                {" "}
                {CPEText}
              </span>
            </Grid>
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default CPEInfo;
