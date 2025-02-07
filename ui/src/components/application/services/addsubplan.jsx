import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  Form,
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import lodash from "lodash";
import { unitType } from "./data";
import { servicesaxios } from "../../../axios";
import DELETE from "../../../assets/images/Customer-Circle-img/delete.png";
import ADD from "../../../assets/images/Customer-Circle-img/add.png";
const Addsubplan = (props) => {
  //   const [inputList, setInputList] = useState([
  //     {
  //       id: "subplan_0",
  //       package_name: "",
  //       plan_cost: "",
  //       time_unit: "",
  //       unit_type: "",
  //       total_plan_cost: "",
  //       tax: true,
  //     },
  //   ]);
  // offer state
  const [offerList, setOfferList] = useState({
    subplan_0: [],
  });

  const inputListData =
    (props.formData.sub_plans && [...props.formData.sub_plans]) || [];

  console.log(inputListData);

  const [inputList, setInputList] = useState([
    {
      id: "subplan_0",

      package_name: props.formData.package_name,
      plan_cost: "",
      time_unit: "",
      unit_type: "mon",
      total_plan_cost: "",
      tax: props.isShow,
    },
  ]);
  // const [PlanCost, setPlanCost] = useState({});
  const [subPlan, setSubPlan] = useState({
    subplan_0: {
      package_name: props.formData.package_name,
      plan_cost: "",
      time_unit: "",
      unit_type: "mon",
      total_plan_cost: "",
      tax: props.isShow,
    },
  });

  const [addSubplan, setAddsubplan] = useState(false);
  // const [errors, setErrors] = useState({});

  const Addsubplanmodaltoggle = () => {
    setAddsubplan(!addSubplan);
    props.setDisabled(false);
  };

  const handleAddSubplan = () => {
    setAddsubplan(!addSubplan);
    
  };

  const [modal, setModal] = useState();
  const toggle = () => {
    setModal(!modal);
  };
  // console.log(inputList, "inputList");
  // props.setFormData((prevState) => {
  //   console.log(prevState, "prevState");
  //   return {
  //     ...prevState,
  //     sub_plans: [...inputList],
  //   };
  // });

  // }

  useEffect(() => {
    if (props.formData.package_name) {
      setInputList((prevState) => {
        return [
          ...prevState,
          {
            id: "subplan_0",

            package_name: props.formData.package_name,
            plan_cost: "",
            time_unit: "",
            unit_type: "mon",
            total_plan_cost: "",
            tax: props.isShow,
          },
        ];
      });
    }
  }, [props.formData.package_name]);
  const getTimeunitagterremove = (currentValue) => {
    switch (currentValue) {
      case 0:
        return 1;
      case 1:
        return 3;
      case 2:
        return 6;
      case 3:
        return 12;
      default:
        return "";
    }
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    // const list = [...inputList];
    // list.splice(index, 1);
    // setInputList(list);

    let list = [...props.formData.sub_plans];
    list.splice(index, 1);
    // list = list.map((item, index) => {
    //   if (index <= 3) {
    //     return {
    //       ...item,
    //       time_unit: getTimeunitagterremove(index),
    //       plan_cost:
    //         getTimeunitagterremove(index) *
    //         props.formData.sub_plans[0].plan_cost,
    //       total_plan_cost: getTotalPlanCost(
    //         getTimeunitagterremove(index) *
    //           props.formData.sub_plans[0].plan_cost
    //       ),
    //     };
    //   } else return { ...item };
    // });
    props.setFormData((prevState) => ({
      ...prevState,
      sub_plans: [...list],
    }));
    setInputList([...list]);
  };

  const getDefaulttimeunit = (currentValue) => {
    switch (currentValue) {
      case 1:
        return 3;
      case 3:
        return 6;
      case 6:
        return 12;
      default:
        return "";
    }
  };
  // handle click event of the Add button

  const handleAddClick = () => {
    let currentLength = props.formData.sub_plans.length - 1;

    let packageName = "";

    if (
      !!getDefaulttimeunit(props.formData.sub_plans[currentLength].time_unit)
    ) {
      packageName =
        props.formData &&
        props.formData.package_name +
          "_" +
          getDefaulttimeunit(
            props.formData.sub_plans[currentLength].time_unit
          ) +
          "" +
          props.formData.sub_plans[currentLength].unit_type +
          "(s)";
    }

   if(!!getDefaulttimeunit(props.formData.sub_plans[currentLength].time_unit)){
    packageName = props.formData && props.formData.package_name + "_" + getDefaulttimeunit(
      props.formData.sub_plans[currentLength].time_unit)+""+ "M"
      
      // props.formData.sub_plans[currentLength].unit_type;
   }
   
  
    setInputList([
      ...inputList,
      {
        id: `subplan_${inputList.length}`,
        package_name: packageName,
        plan_cost: "",
        time_unit: "",
        unit_type: "mon",
        total_plan_cost: "",
        tax: props.isShow,
      },
    ]);

    const subplanID = lodash.uniqueId(`subplan_`);

    props.setFormData((prevState) => ({
      ...prevState,
      sub_plans: [
        ...prevState.sub_plans,
        {
          id: subplanID,
          package_name: packageName,
          plan_cost:
            getDefaulttimeunit(
              props.formData.sub_plans[currentLength].time_unit
            ) * props.formData.sub_plans[0].plan_cost,
          time_unit: getDefaulttimeunit(
            props.formData.sub_plans[currentLength].time_unit
          ),
          unit_type: "mon",
          total_plan_cost: getTotalPlanCost(
            getDefaulttimeunit(
              props.formData.sub_plans[currentLength].time_unit
            ) * props.formData.sub_plans[0].plan_cost
          ).toFixed(2),
          tax: props.isShow,
        },
      ],
    }));

    getOfferlist(
      getDefaulttimeunit(props.formData.sub_plans[currentLength].time_unit),
      "mon",
      subplanID
    );
  };

  const getTotalPlanCost = (plan_cost) => {
    //Because by default tax is selected, we will always add it when we insert it
    const subPlanCost = plan_cost;
    let plan_cgst =
      parseInt(subPlanCost === "" ? 0 : subPlanCost) *
      (parseInt(props.inputs.plan_cgst === "" ? 0 : props.inputs.plan_cgst) /
        100);
    let plan_sgst =
      parseInt(subPlanCost === "" ? 0 : subPlanCost) *
      (parseInt(props.inputs.plan_sgst === "" ? 0 : props.inputs.plan_sgst) /
        100);
    let total_plan_cost = plan_cost;
    if (props.isShow) {
      total_plan_cost =
        parseInt(subPlanCost ? subPlanCost : 0) + plan_cgst + plan_sgst;
    }

    return total_plan_cost;
  };

  // offer get api
  const getOfferlist = (timeunit, unittype, subplanid) => {
    if (!!timeunit) {
      servicesaxios
        .get(`plans/offer/valid/${timeunit}/${unittype}`)
        .then((res) => {
          const newOfferList = { ...offerList };
          newOfferList[subplanid] = [...res.data];
          setOfferList(newOfferList);
          console.log(res.data, "offerdata");
        });
    }
  };

  useEffect(() => {
    getOfferlist(1, "mon", "subplan_0");
  }, []);

  const handleInputChange = (event, id) => {
    console.log(props.inputs, "inputs");
    event.persist();
    // let val = event.target.value;
    const target = event.target;
    var value = target.value;
    const checked = target.checked;
    const name = target.name;
    let a = name.split(".");
    if (name.includes("sub_plans")) {
      // let a = name.split(".");
      if (a[1] === "tax") {
        value = checked;
      }
      setSubPlan((preState) => ({
        ...preState,
        [id]: {
          ...preState[id],
          [a[1]]: value,
        },
      }));
    }

    // let list = [...inputList];

    let list = [...props.formData.sub_plans];

    let obj = list.find((item) => item.id === id);

    console.log(obj, "current sub plan");

    // getting time unit
    console.log(name, "name");
    if (name == "sub_plans.time_unit" || name == "sub_plans.unit_type") {
      const timeUnit = name == "sub_plans.time_unit" ? value : obj.time_unit;
      getOfferlist(timeUnit, "mon", obj.id);
    }
    //Conditions for TAX check uncheck

    if (a[1] == "tax" && target.checked) {
      const subPlanCost = list.find((item) => item.id === id).plan_cost;
      let plan_cgst =
        parseInt(subPlanCost === "" ? 0 : subPlanCost) *
        (parseInt(props.inputs.plan_cgst === "" ? 0 : props.inputs.plan_cgst) /
          100);
      let plan_sgst =
        parseInt(subPlanCost === "" ? 0 : subPlanCost) *
        (parseInt(props.inputs.plan_sgst === "" ? 0 : props.inputs.plan_sgst) /
          100);
      let total_plan_cost =
        parseInt(subPlanCost ? subPlanCost : 0) + plan_cgst + plan_sgst;
      obj["total_plan_cost"] = total_plan_cost;
    } else if (a[1] == "tax" && !target.checked) {
      const subPlanCost = list.find((item) => item.id === id).plan_cost;
      let total_plan_cost = parseInt(subPlanCost ? subPlanCost : 0);
      obj["total_plan_cost"] = total_plan_cost;
    }

    //Conditions for plan_cost change in sub plan

    if (a[1] == "plan_cost" && list.find((item) => item.id === id).tax) {
      let plan_cgst =
        parseInt(value === "" ? 0 : value) *
        (parseInt(props.inputs.plan_cgst === "" ? 0 : props.inputs.plan_cgst) /
          100);
      let plan_sgst =
        parseInt(value === "" ? 0 : value) *
        (parseInt(props.inputs.plan_sgst === "" ? 0 : props.inputs.plan_sgst) /
          100);
      let total_plan_cost = parseInt(value ? value : 0) + plan_cgst + plan_sgst;
      obj["total_plan_cost"] = total_plan_cost;
    } else if (
      a[1] == "plan_cost" &&
      !list.find((item) => item.id === id).tax
    ) {
      let total_plan_cost = parseInt(value ? value : 0);
      obj["total_plan_cost"] = total_plan_cost;
    }

    if (a[1] == "tax") {
      obj = {
        ...obj,
        [a[1]]: target.checked,
      };
    } else {
      obj = {
        ...obj,
        [a[1]]: value,
      };
    }

    list = list.map((item) => {
      if (item.id === id) {
        return { ...obj };
      } else {
        return { ...item };
      }
    });

    console.log(obj, "current sub plan");

    // setInputList([...list]);
    props.setFormData((prevState) => ({
      ...prevState,
      sub_plans: [...list],
    }));
    props.seButtonDisabled(event.target.value)
  };

  const getName = (x) => {
    if ([1].includes(x.time_unit)) {
      x.package_name = props.formData && props.formData.package_name;
    } else if ([3, 6, 12].includes(x.time_unit)) {
      x.package_name =
        props.formData &&
        props.formData.package_name +
          "_" +
          x.time_unit +
          "" +
          x.unit_type +
          "(s)";
    } else {
      x.package_name = "";
    }
    return x.package_name;
  };

  return (
    <>
      <Button color="primary" onClick={Addsubplanmodaltoggle} id="sub_plan">
        {"Add Sub Plan"}
      </Button>
      <Modal
        isOpen={addSubplan}
        toggle={Addsubplanmodaltoggle}
        size="lg"
        style={{ maxWidth: "1300px" }}
        backdrop="static"
      >
        <ModalBody style={{ width: "1300px", position:"relative", top:"24px" }}>
        <h5 id="new_modal" toggle={Addsubplanmodaltoggle}>{"Add Sub Plan"}</h5>
        <hr id="new_hr"/>
          <div className="App">
            {props.formData.sub_plans &&
              props.formData.sub_plans.map((x, i) => {
                return (
                  <Form>
                    <Row > 
                      <Col>
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              type="text"
                              name="sub_plans.package_name"
                              onChange={(e) => handleInputChange(e, x.id)}
                              onBlur={props.checkEmptyValue}
                              // draft

                              className={`form-control digits not-empty ${
                                x.package_name ? "not-empty" : ""
                              }`}
                              value={x.package_name}
                              // value={props.formData && props.formData.package_name + "_" + x.time_unit+ ""+ x.unit_type +"(s)"}
                            />
                            <Label className="form_label">
                              Package Name *
                            </Label>
                    <span className="errortext">{props.errors.package_name}</span>

                          </div>
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              className={`form-control digits not-empty ${
                                x.plan_cost ? "not-empty" : ""
                              }`}
                              value={x && x.plan_cost}
                              type="number"
                              name="sub_plans.plan_cost"
                              onChange={(e) => handleInputChange(e, x.id)}
                              onBlur={props.checkEmptyValue}
                              min="0"
                              onKeyDown={(evt) =>
                                (evt.key === "e" ||
                                  evt.key === "E" ||
                                  evt.key === "." ||
                                  evt.key === "-") &&
                                evt.preventDefault()
                              }
                            />

                            <Label className="form_label">
                              Plan Cost *
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col>
                        <Label
                          className="d-block"
                          for="chk-ani"
                          style={{ marginTop: "10px" }}
                        >
                          <Input
                            className="checkbox_animated"
                            id="chk-ani"
                            name="sub_plans.tax"
                            type="checkbox"
                            onChange={(e) => handleInputChange(e, x.id)}
                            value={x.tax}
                            checked={x.tax}
                          />
                          {Option} {"Tax"}
                        </Label>
                      </Col>
                      <Col>
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              className={`form-control digits ${
                                x.time_unit ? "not-empty" : ""
                              }`}
                              value={x.time_unit}
                              type="number"
                              name="sub_plans.time_unit"
                              onChange={(e) => handleInputChange(e, x.id)}
                              onBlur={props.checkEmptyValue}
                              min="1"
                              onKeyDown={(evt) =>
                                (evt.key === "e" ||
                                  evt.key === "E" ||
                                  evt.key === "." ||
                                  evt.key === "-") &&
                                evt.preventDefault()
                              }
                            />
                            <Label className="form_label">
                              Time Unit *
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              type="select"
                              name="sub_plans.unit_type"
                              className={`form-control digits ${
                                x.unit_type ? "not-empty" : ""
                              }`}
                              value={x.unit_type}
                              onChange={(e) => handleInputChange(e, x.id)}
                              onBlur={props.checkEmptyValue}
                            >
                              <option
                                value=""
                                style={{ display: "none" }}
                              ></option>

                              {unitType.map((unittype) => {
                                return (
                                  <option value={unittype.id}>
                                    {unittype.name}
                                  </option>
                                );
                              })}
                            </Input>
                            <Label className="form_label">
                              Unit Type *
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              type="select"
                              name="sub_plans.offer"
                              className={`form-control digits ${
                                x.offer ? "not-empty" : ""
                              }`}
                              value={x.offer}
                              onChange={(e) => handleInputChange(e, x.id)}
                              onBlur={props.checkEmptyValue}
                              disabled={
                                i == 0 && props.formData.sub_plans.length > 0
                              }
                            >
                              <option
                                value=""
                                style={{ display: "none" }}
                              ></option>

                              {offerList[x.id] &&
                                offerList[x.id].map((validfor) => {
                                  return (
                                    <option value={validfor.id}>
                                      {validfor.name}
                                    </option>
                                  );
                                })}
                            </Input>
                            <Label className="form_label">
                              Valid Offers
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>

                      <Col>
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              // draft
                              className={`form-control digits not-empty ${
                                x.total_plan_cost ? "not-empty" : ""
                              }`}
                              // value={
                              //   x.total_plan_cost
                              // }
                              type="number"
                              name="sub_plans.total_plan_cost"
                              onChange={(e) => handleInputChange(e, x.id)}
                              onBlur={props.heckEmptyValue}
                              value={parseFloat(
                                x.total_plan_cost && x.total_plan_cost
                              ).toFixed(2)}
                              readOnly={true}
                            />
                            <Label className="form_label">
                              Total Cost *
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col>
                        <div className="btn-box" style={{ display: "flex" ,position:"relative",top:"10px"}}>
                          {props.formData.sub_plans.length !== 1 && (
                            // <Button
                            //   className="mr10"

                            //   color="primary"
                            //   disabled={i == 0 && props.formData.sub_plans.length > 1}
                            // >
                            //   X
                            // </Button>
                            // <span onClick={() => handleRemoveClick(i)} disabled={i == 0 && props.formData.sub_plans.length > 1} style={{cursor:"pointer"}}>
                            //   </span>
                            <>
                              {i == 0 && props.formData.sub_plans.length > 1 ? (
                                <>

                                  <img src={DELETE} style={{width:"15%", cursor: "not-allowed", backgroundColor:"#cdcdcd"}}/>
                                </>
                              ) : (
                                <img
                                  src={DELETE}
                                  style={{cursor: "pointer",width:"15%"}}
                                  onClick={() => handleRemoveClick(i)}
                                />
                              )}
                            </>
                          )}{" "}
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          {props.formData.sub_plans.length - 1 === i && (
                            // <Button onClick={handleAddClick}>+</Button>
                            <span onClick={handleAddClick}>
                              <img src={ADD} />
                            </span>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Form>
                );
              })}
            {/* <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div> */}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddSubplan} id="save_button" disabled={!props.buttonDisabled}>
            {"Save"}
          </Button>
          {/*Added cancel button by Marieya on 10.8.22*/}
          <button
            type="submit"
            name="submit"
            class="btn btn-secondary"
            onClick={Addsubplanmodaltoggle}
            id="resetid"
          >
            Cancel
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default Addsubplan;
