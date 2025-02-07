import React, { Fragment, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Label,
  FormGroup,
  Spinner,
} from "reactstrap";
import {
  packageType,
  packageDatatype,
  fupCalculation,
  fallBacktype,
  billingType,
  billingCycle,
  statusType,
  expiryDate,
  unitType,
} from "./data";
import { toast } from "react-toastify";
import useFormValidation from "../../customhooks/FormValidation";
import { servicesaxios } from "../../../axios";
import SubPlanDetails from "./subplandetails";
import EditIcon from "@mui/icons-material/Edit";
import { SERVICEPLAN } from "../../../utils/permissions";
import EditSubplans from "./Editsubplans";

var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}

const SerivceDetails = (props) => {
  const [errors, setErrors] = useState({});
  const [subplans, setSubplans] = useState([]);
  const [leadUser, setLeadUser] = useState(props.lead);

  const [isDisabled, setIsdisabled] = useState(true);
  const [franchiseList, setFranchiseList] = useState([]);
  const [inputList, setInputList] = useState(props.lead);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    setLeadUser(props.lead);
  }, [props.lead]);

  useEffect(() => {
    setIsdisabled(true);

    if (franchiseList) {
      const franch = franchiseList.find(
        (f) => f.franchise_name === props.lead.franchise
      );
      if (franch) setLeadUser({ ...props.lead, franchise: franch.id });
    } else {
      setLeadUser(props.lead);
    }
  }, [props.rightSidebar, props.lead]);

  const handleChange = (e) => {
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const serviceDetails = (id) => {
    setDisable(true);
    // if (!isDisabled) {
    //   servicesaxios
    //     .put("plans/radius/update/" + id, leadUser)
    //     .then((res) => {
    //       props.onUpdate(res.data);
    //       toast.success("Service was edited successfully", {
    //         position: toast.POSITION.TOP_RIGHT,
    //         autoClose: 1000,
    //       });
    //       setIsdisabled(true);
    //     })
    //     .catch(function (error) {
    //       toast.error("Something went wrong", {
    //         position: toast.POSITION.TOP_RIGHT,
    //         autoClose: 1000,
    //       });
    //     });
    // }

    // const updatedSubplans = subplans.filter((s) => !!s.offer);
    // const newupdatedSubplan = updatedSubplans.map((s) => {
    //   return {
    //     plan: s.id,
    //     offer: typeof s.offer === "object" ? s.offer.id : s.offer,
    //   };
    // });
    const newupdatedSubplan = subplans.map((s) => {
      let offerValue;
      if (!s.offer || s.offer === "") {
        offerValue = null;
      } else if (typeof s.offer === "object") {
        offerValue = s.offer.id;
      } else {
        offerValue = s.offer;
      }

      return {
        plan: s.id,
        offer: offerValue,
      };
    });
    // Sailaja changed toast message text as Offer is edited successfully on 8th August Ref SP-27
    servicesaxios
      .post(`plans/offer/multiple/add`, newupdatedSubplan)
      .then((res) => {
        props.onUpdate(res.data);
        setDisable(false);
        // setOfferDestails(false);
        toast.success("Offer is edited successfully", {});
        props.closeCustomizer1();
      })
      .catch(function (error) {
        setDisable(false);
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      });
  };

  const handleSubmit = (e, id) => {
    e.preventDefault();
    e = e.target.name;
    const validationErrors = validate(leadUser);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      serviceDetails(id);
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    }
  };

  const clicked = (e) => {
    e.preventDefault();
    setIsdisabled(false);
  };

  const requiredFields = [
    "package_name",
    "download_speed",
    "upload_speed",
    "package_type",
    "fup_limit",
    "package_data_type",
    "fup_calculation_type",
    // "fall_back_type",
    "billing_type",
    "billing_cycle",
    "status",
    "plan_cost",
    // "plan_cgst",
    // "plan_sgst",
    "renewal_expiry_day",
    "time_unit",
    "unit_type",
  ];
  const { validate } = useFormValidation(requiredFields);

  useEffect(() => {
    let cgst =
      parseInt(leadUser.plan_cost === "" ? 0 : leadUser.plan_cost) *
      (parseInt(leadUser.plan_cgst === "" ? 0 : leadUser.plan_cgst) / 100);
    let Sgst =
      parseInt(leadUser.plan_cost === "" ? 0 : leadUser.plan_cost) *
      (parseInt(leadUser.plan_sgst === "" ? 0 : leadUser.plan_sgst) / 100);

    let totalPlanCost =
      parseFloat(leadUser && leadUser.plan_cost) + cgst + Sgst;

    totalPlanCost = totalPlanCost.toFixed(2);
    setLeadUser((prevState) => {
      return {
        ...prevState,
        total_plan_cost: totalPlanCost,
      };
    });
  }, [leadUser.plan_cost, leadUser.plan_cgst, leadUser.plan_sgst]);

  // useEffect(()=>{
  //   if(props.openCustomizer){
  //     setErrors({});
  //   }
  // }, [props.openCustomizer]);

  return (
    <Fragment>
      {token.permissions.includes(SERVICEPLAN.SERVICE_PACKAGE_CREATE) && (
        <EditIcon
          className="icofont icofont-edit"
          style={{ top: "7px", right: "64px" }}
          onClick={clicked}
          // disabled={isDisabled}
        />
      )}

      <br />
      <Container fluid={true}>
        <Form
          onSubmit={(e) => {
            handleSubmit(e, props.lead.id);
          }}
        >
          <Row>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label"> Package Name</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="text"
                    name="package_name"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.package_name}
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                  <span className="errortext">{errors.package_name}</span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label"> Download Speed</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="number"
                    name="download_speed"
                    min="0"
                    onKeyDown={(evt) =>
                      (evt.key === "e" ||
                        evt.key === "E" ||
                        evt.key === "." ||
                        evt.key === "-") &&
                      evt.preventDefault()
                    }
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.download_speed}
                    onChange={handleChange}
                    disabled={true}
                  ></input>

                  <span className="errortext">{errors.download_speed}</span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Upload Speed</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="number"
                    name="upload_speed"
                    min="0"
                    onKeyDown={(evt) =>
                      (evt.key === "e" ||
                        evt.key === "E" ||
                        evt.key === "." ||
                        evt.key === "-") &&
                      evt.preventDefault()
                    }
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.upload_speed}
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                  <span className="errortext">{errors.upload_speed}</span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label"> Package Type</Label>
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="package_type"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.package_type}
                    onChange={handleChange}
                    disabled={true}
                  >
                    {packageType.map((packType) => {
                      if (!!packType && leadUser && leadUser.package_type) {
                        return (
                          <option
                            key={packType.id}
                            value={packType.id}
                            selected={
                              packType.id == leadUser.package_type.id
                                ? "selected"
                                : ""
                            }
                          >
                            {packType.name}
                          </option>
                        );
                      }
                    })}
                  </select>
                  <span className="errortext">
                    {errors.package_type && "Select Package Type"}
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label"> FUP Limit</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="number"
                    name="fup_limit"
                    min="0"
                    onKeyDown={(evt) =>
                      (evt.key === "e" ||
                        evt.key === "E" ||
                        evt.key === "." ||
                        evt.key === "-") &&
                      evt.preventDefault()
                    }
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.fup_limit}
                    onChange={handleChange}
                    disabled={true}
                  ></input>

                  <span className="errortext">{errors.fup_limit}</span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Package Data Type</Label>
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="package_data_type"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.package_data_type}
                    onChange={handleChange}
                    disabled={true}
                  >
                    {packageDatatype.map((packDatatype) => {
                      if (
                        !!packDatatype &&
                        leadUser &&
                        leadUser.package_data_type
                      ) {
                        return (
                          <option
                            key={packDatatype.id}
                            value={packDatatype.id}
                            selected={
                              packDatatype.id == leadUser.package_data_type.id
                                ? "selected"
                                : ""
                            }
                          >
                            {packDatatype.name}
                          </option>
                        );
                      }
                    })}
                  </select>

                  <span className="errortext">
                    {errors.package_data_type && "Select Package Data Type"}
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label"> FUP Calculation</Label>
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="fup_calculation_type"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.fup_calculation_type}
                    onChange={handleChange}
                    disabled={true}
                  >
                    {fupCalculation.map((fupCal) => {
                      if (
                        !!fupCal &&
                        leadUser &&
                        leadUser.fup_calculation_type
                      ) {
                        return (
                          <option
                            key={fupCal.id}
                            value={fupCal.id}
                            selected={
                              fupCal.id == leadUser.fup_calculation_type.id
                                ? "selected"
                                : ""
                            }
                          >
                            {fupCal.name}
                          </option>
                        );
                      }
                    })}
                  </select>

                  <span className="errortext">
                    {errors.fup_calculation_type && "Select FUP Calculation"}
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Fall Back Plan</Label>
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="fall_back_plan"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.fall_back_plan}
                    onChange={handleChange}
                    disabled={true}
                  >
                    {console.log(leadUser, "testuser")}
                    {/*       
             
                    {fallBacktype.map((fupBack) => {
                      if (!!fupBack && leadUser && leadUser.fall_back_type) {
                        return (
                          <option
                            key={fupBack.id}
                            value={fupBack.id}
                            selected={
                              fupBack.id == leadUser.fall_back_type.id
                                ? "selected"
                                : ""
                            }
                          >
                            {fupBack.name}
                          </option>
                        );
                      }
                    })} */}
                    {leadUser && leadUser.fall_back_plan && (
                      <option value={leadUser.fall_back_plan.id}>
                        {leadUser.fall_back_plan.package_name}
                      </option>
                    )}
                  </select>
                  <span className="errortext">
                    {errors.fall_back_type && "Select Fall Back Type"}
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Billing Type</Label>
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="billing_type"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.billing_type}
                    onChange={handleChange}
                    disabled={true}
                  >
                    {billingType.map((billType) => {
                      if (!!billType && leadUser && leadUser.billing_type) {
                        return (
                          <option
                            key={billType.id}
                            value={billType.id}
                            selected={
                              billType.id == leadUser.billing_type.id
                                ? "selected"
                                : ""
                            }
                          >
                            {billType.name}
                          </option>
                        );
                      }
                    })}
                  </select>
                  <span className="errortext">
                    {errors.billing_type && "Select Billing Type"}
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label"> Billing Cycle</Label>
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="billing_cycle"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.billing_cycle}
                    onChange={handleChange}
                    disabled={true}
                  >
                    {billingCycle.map((billCycle) => {
                      if (!!billCycle && leadUser && leadUser.billing_cycle) {
                        return (
                          <option
                            key={billCycle.id}
                            value={billCycle.id}
                            selected={
                              billCycle.id == leadUser.billing_cycle.id
                                ? "selected"
                                : ""
                            }
                          >
                            {billCycle.name}
                          </option>
                        );
                      }
                    })}
                  </select>
                  <span className="errortext">
                    {errors.billing_cycle && "Select Billing Cycle"}
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Status</Label>
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="status"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.status}
                    onChange={handleChange}
                    disabled={true}
                  >
                    {statusType.map((statustype) => {
                      if (!!statustype && leadUser && leadUser.status) {
                        return (
                          <option
                            key={statustype.id}
                            value={statustype.id}
                            selected={
                              statustype.id == leadUser.status.id
                                ? "selected"
                                : ""
                            }
                          >
                            {statustype.name}
                          </option>
                        );
                      }
                    })}
                  </select>
                  <span className="errortext">
                    {errors.status && "Select Status"}
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Plan Cost</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="number"
                    name="plan_cost"
                    min="0"
                    onKeyDown={(evt) =>
                      (evt.key === "e" ||
                        evt.key === "E" ||
                        evt.key === "." ||
                        evt.key === "-") &&
                      evt.preventDefault()
                    }
                    style={{ border: "none", outline: "none" }}
                    value={parseFloat(leadUser && leadUser.plan_cost).toFixed(
                      0
                    )}
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                  <span className="errortext">{errors.plan_cost}</span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Plan CGST</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="number"
                    name="plan_cgst"
                    min="0"
                    onKeyDown={(evt) =>
                      (evt.key === "e" ||
                        evt.key === "E" ||
                        evt.key === "." ||
                        evt.key === "-") &&
                      evt.preventDefault()
                    }
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.plan_cgst}
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                  {/* <span className="errortext">
                    {errors.plan_cgst && errors.plan_cgst}
                  </span> */}
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Plan SGST</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="number"
                    name="plan_sgst"
                    min="0"
                    onKeyDown={(evt) =>
                      (evt.key === "e" ||
                        evt.key === "E" ||
                        evt.key === "." ||
                        evt.key === "-") &&
                      evt.preventDefault()
                    }
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.plan_sgst}
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                  {/* <span className="errortext">
                    {errors.plan_sgst && errors.plan_sgst}
                  </span> */}
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Plan Total Cost</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="number"
                    name="total_plan_cost"
                    min="0"
                    onKeyDown={(evt) =>
                      (evt.key === "e" ||
                        evt.key === "E" ||
                        evt.key === "." ||
                        evt.key === "-") &&
                      evt.preventDefault()
                    }
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.total_plan_cost}
                    onChange={handleChange}
                    disabled={true}
                  ></input>

                  <span className="errortext">
                    {errors.total_plan_cost && errors.total_plan_cost}
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Renewal Expiry Day</Label>
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="renewal_expiry_day"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.renewal_expiry_day}
                    onChange={handleChange}
                    disabled={true}
                  >
                    {expiryDate.map((expirydate) => {
                      if (
                        !!expirydate &&
                        leadUser &&
                        leadUser.renewal_expiry_day
                      ) {
                        return (
                          <option
                            key={expirydate.id}
                            value={expirydate.id}
                            selected={
                              expirydate.id == leadUser.renewal_expiry_day.id
                                ? "selected"
                                : ""
                            }
                          >
                            {expirydate.name}
                          </option>
                        );
                      }
                    })}
                  </select>

                  <span className="errortext">
                    {errors.renewal_expiry_day && "Select Renewal Expiry Day"}
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Time Unit</Label>
                  <input
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="number"
                    name="time_unit"
                    min="0"
                    onKeyDown={(evt) =>
                      (evt.key === "e" ||
                        evt.key === "E" ||
                        evt.key === "." ||
                        evt.key === "-") &&
                      evt.preventDefault()
                    }
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.time_unit}
                    onChange={handleChange}
                    disabled={true}
                  ></input>
                  <span className="errortext">{errors.time_unit}</span>
                </div>
              </FormGroup>
            </Col>
            <Col md="3" id="moveup">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Unit Type</Label>
                  <select
                    className={`form-control digits not-empty`}
                    id="afterfocus"
                    type="select"
                    name="unit_type"
                    style={{ border: "none", outline: "none" }}
                    value={leadUser && leadUser.unit_type}
                    onChange={handleChange}
                    disabled={true}
                  >
                    {unitType.map((unittype) => {
                      if (!!unittype && leadUser && leadUser.unit_type) {
                        return (
                          <option
                            key={unittype.id}
                            value={unittype.id}
                            selected={
                              unittype.id == leadUser.unit_type.id
                                ? "selected"
                                : ""
                            }
                          >
                            {unittype.name}
                          </option>
                        );
                      }
                    })}
                  </select>
                  <span className="errortext">
                    {errors.unit_type && "Select Unit Type"}
                  </span>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <p id="sub_plan_text">Sub Plans</p>
            </Col>
            <Col className="Edit_subplan">
              <EditSubplans
                formData={leadUser}
                setFormData={setLeadUser}
                inputs={inputList}
                setInputList={setInputList}
                closeCustomizer1={props.closeCustomizer1}
                RefreshHandler={props.RefreshHandler}
              />
            </Col>
          </Row>
          <Row>
            <SubPlanDetails
              lead={props.lead}
              handleChange={handleChange}
              setSubplans={setSubplans}
              // dataClose={props.closeCustomizer1}
              subplans={subplans}
              isDisabled={isDisabled}
            />
          </Row>
          <Row>
            <span
              className="sidepanel_border"
              style={{ position: "relative", top: "25px" }}
            ></span>
          </Row>
          <br />
          {/* align */}
          <button
            type="submit"
            name="submit"
            class="btn btn-primary"
            id="save_button"
            disabled={disable}
          >
            {disable ? <Spinner size="sm"> </Spinner> : null}
            Save
          </button>
          &nbsp; &nbsp; &nbsp;
          <button
            type="submit"
            name="submit"
            class="btn btn-secondary"
            onClick={props.closeCustomizer1}
            id="resetid"
          >
            Cancel
          </button>
        </Form>
      </Container>
    </Fragment>
  );
};

export default SerivceDetails;
