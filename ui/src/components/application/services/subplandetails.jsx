import React, { useEffect, useState } from "react";
import { Label, Table, Input, FormGroup } from "reactstrap";
import { servicesaxios } from "../../../axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

const SubPlanDetails = (props) => {
  const [offerDestails, setOfferDestails] = useState(false);
  // const [subplans, setSubplans] = useState([]);
  const offermodaltoggle = () => setOfferDestails(!offerDestails);
  const [getValidList, setGetValidList] = useState([]);

  useEffect(() => {
    if (props && props.lead && props.lead.sub_plans) {
      props.setSubplans(props.lead.sub_plans);
    }
  }, [props.lead]);

  const handleChangeInput = (e, id) => {
    const name = e.target.name;
    const value = e.target.value;
    const subplancopy = [...props.subplans];
    const service = subplancopy.find((s) => s.id == id);
    const serviceIndex = subplancopy.findIndex((s) => s.id == id);
    service[name] = value;
    subplancopy[serviceIndex] = service;
    props.setSubplans(subplancopy);
  };

  useEffect(() => {
    if (props && props.lead && props.lead.sub_plans) {
      for (let i = 0; i < props.lead.sub_plans.length; i++) {
        servicesaxios
          .get(
            `plans/offer/valid/${props.lead.sub_plans[i].time_unit}/${props.lead.sub_plans[i].unit_type}`
          )
          .then((res) => {
            setGetValidList((prevState) => {
              return {
                ...prevState,
                [props.lead.sub_plans[i].id]: [...res.data],
              };
            });
            console.log(getValidList, "getValidList");
          });
      }
    }
  }, []);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} columns={12}>
          {props.subplans &&
            props.subplans.map((services) => (
              <Grid item xs={3}>
                <Card
                  className="subplan_card"
                  style={{
                    backgroundColor: "color !important",
                    borderRadius: "5px",
                  }}
                >
                  <Grid container spacing={2} columns={12}>
                    <Grid item xs={6}>
                      <p className="plan_name">{services.package_name}</p>
                      <p className="plan_cost">
                        {" "}
                        <span>₹</span> &nbsp;&nbsp;{services.total_plan_cost}
                      </p>
                    </Grid>
                    <Grid item xs={6}>
                      <FormGroup>
                        <div className="input_wrap" style={{position:"relative",top:"10px"}}>
                          <Label className=""></Label>
                          <select
                            // className="form-control digits "
                            className={`form-control digits ${
                              services && services.offer && services.offer
                                ? "not-empty"
                                : ""
                            }`}
                            type="select"
                            key={services.id}
                            value={
                              services && services.offer && services.offer.id
                            }
                            name="offer"
                            onChange={(e) => handleChangeInput(e, services.id)}
                            disabled={props.isDisabled}
                          >
                            <option
                              value=""
                            >
                            No offer
                            </option>
                            {getValidList &&
                              getValidList[services.id] &&
                              getValidList[services.id].map((offerList) => {
                                return (
                                  <option value={offerList.id}>
                                    {offerList.name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </FormGroup>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>

      {/* <Table className="table-border-vertical">
        <tbody>
          {props.subplans &&
            props.subplans.map((services) => (
              <tr>
                <td scope="row">
                  {" "}
                  <>
                    <Input
                      className="checkbox_animated"
                      type="text"
                      key={services.id}
                      value={services.package_name}
                      disabled={true}
                      onChange={props.handleChange}
                    />
                  </>
                </td>
                <td scope="row">
                  {" "}
                  <>
                    <Input
                      className="checkbox_animated"
                      type="text"
                      key={services.id}
                      value={services.time_unit + services.unit_type + "(s)"}
                      disabled={true}
                      onChange={props.handleChange}
                    />
                  </>
                </td>

                <td scope="row">
                  {" "}
                  <FormGroup>
                    <div className="input_wrap">
                      <select
                        // className="form-control digits "
                        className={`form-control digits ${
                          services && services.offer && services.offer
                            ? "not-empty"
                            : ""
                        }`}
                        type="select"
                        key={services.id}
                        value={services && services.offer && services.offer.id}
                        name="offer"
                        onChange={(e) => handleChangeInput(e, services.id)}
                        disabled={props.isDisabled}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        {getValidList &&
                          getValidList[services.id] &&
                          getValidList[services.id].map((offerList) => {
                            return (
                              <option value={offerList.id}>
                                {offerList.name}
                              </option>
                            );
                          })}
                      </select>
                      <Label className="placeholder_styling">Offers:</Label>
                    </div>
                  </FormGroup>
                </td>
              </tr>
            ))}
        </tbody>
      </Table> */}
    </>
  );
};
export default SubPlanDetails;
