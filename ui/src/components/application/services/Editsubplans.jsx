import React, { useState } from "react";
import {
  Col,
  Row,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter, Button, Form
} from "reactstrap";
import { unitType } from "./data";
// import { toast } from "react-toastify";
import DELETE from "../../../assets/images/Customer-Circle-img/delete.png";
import ADD from "../../../assets/images/Customer-Circle-img/add.png";
import { servicesaxios } from "../../../axios";
import ErrorModal from "../../common/ErrorModal";

function EditSubplans(props) {
  //open modal
  const [subPlan, setSubplan] = useState(false)
  const subPlanModal = () => setSubplan(!subPlan)
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");  
  const [inputList, setInputList] = useState([{
    package_name: props.formData?.package_name+"_"+"M",
    tax: props.formData?.tax,
    unit_type: "mon",
    plan_cgst: props.formData?.plan_cgst,
    plan_sgst: props.formData?.plan_sgst,
    total_plan_cost:"",
    time_unit:""
  }]);
  // subplan input form

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    let Sgst ;
    let cgst;
    let total
    if(e.target.name == "plan_cost"){
   cgst =
      parseInt(value === "" ? 0 : value) *
      (parseInt(props.formData?.plan_cgst === "" ? 0 : props.formData?.plan_cgst) / 100);
    Sgst =
      parseInt(value === "" ? 0 : value) *
      (parseInt(props.formData?.plan_sgst === "" ? 0 : props.formData?.plan_sgst) / 100);
      total =
      parseInt(value === "" ? 0 : value) + cgst + Sgst;
      console.log(total,"totaltotal")
    }
    const list = [...inputList];
    let temp_element ;
    if(e.target.name == "plan_cost"){

       temp_element = { ...list[index] };
      temp_element.total_plan_cost = total.toFixed(2)
      list[index] = temp_element;
    }
    let timeUnit;
    if(e.target.name == "time_unit"){
      let package_name = inputList[index].package_name;
      let result= (package_name.substring(0,package_name.lastIndexOf("_")))
      timeUnit =   result +"_"+ value + "M";
      console.log(timeUnit,"timeunitcheck")
       temp_element = { ...list[index] };
      temp_element.package_name = timeUnit
      list[index] = temp_element;
    }
    console.log(timeUnit,"timeUnit")
    list[index][name] = value;
    setInputList(list);

    console.log(e,"hjhh")


    
  };

  // handle click event of the Remove button
  const handleRemoveClick = index => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, {
      package_name: props.formData?.package_name+"_"+"M",
       tax: props.formData?.tax,
      unit_type: "mon",
      plan_cgst: props.formData?.plan_cgst,
      plan_sgst: props.formData?.plan_sgst,
      total_plan_cost:""
    }]);
  };

  // useEffect(() => {
  //   let cgst =
  //     parseInt(inputList.plan_cost === "" ? 0 : inputList.plan_cost) *
  //     (parseInt( props.formData.plan_cgst === "" ? 0 :  props.formData.plan_cgst) / 100);
  //   let Sgst =
  //     parseInt(inputList.plan_cost === "" ? 0 : inputList.plan_cost) *
  //     (parseInt( props.formData.plan_sgst === "" ? 0 :  props.formData.plan_sgst) / 100);

  //   let totalPlanCost =
  //     parseFloat(inputList && inputList.plan_cost) + cgst + Sgst;

  //   totalPlanCost = totalPlanCost.toFixed(2);
  //   setInputList((prevState) => {
  //     return {
  //       ...prevState,
  //       total_plan_cost: totalPlanCost,
  //     };
  //   });
  // }, [inputList.plan_cost,  props.formData.plan_cgst,  props.formData.plan_sgst]);

  // adding subplan api
  const mainPlandata = props.formData
  mainPlandata.plan_cost= parseFloat(mainPlandata?.plan_cost).toFixed(2);
  mainPlandata.fall_back_plan=mainPlandata?.fall_back_plan?mainPlandata?.fall_back_plan?.id:mainPlandata?.fall_back_plan;
  const addSubplan = () => {
    console.log(mainPlandata,"mainPlandata")
    var config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const addingSubplan = {

      main_plan: {
        ...mainPlandata,

      },
      sub_plans: [
        ...inputList,
      ],
    };
    // delete addingSubplan.main_plan.sub_plans;
    delete addingSubplan.main_plan.id;
    delete addingSubplan.main_plan.parent;
    delete addingSubplan.main_plan.user_count;
    delete addingSubplan.main_plan.offer;
    delete addingSubplan.main_plan.sub_plans;
    servicesaxios
      .post("plans/add/subplans", addingSubplan, config)
      .then((res) => {
        console.log(res.data)
        setSubplan(false)
        props.closeCustomizer1();
        props.RefreshHandler();
      })
      // .catch((error) => {
      //   const errorString = JSON.stringify(error);
      //   const is500Error = errorString.includes("500");
      //   const is404Error = errorString.includes("404");
      //   if (error.response && error.response.data.detail) {
      //     toast.error(error.response && error.response.data.detail, {
      //       position: toast.POSITION.TOP_RIGHT,
      //       autoClose: 1000,
      //     });
      //   } else if (is500Error) {

      //     toast.error("Something went wrong", {
      //       position: toast.POSITION.TOP_RIGHT,
      //     });
      //   } else if (is404Error) {
      //     // toast.error("API mismatch", {
      //     //   position: toast.POSITION.TOP_RIGHT,
      //     //   autoClose: 1000,
      //     // });
      //   } else {
      //     toast.error("Something went wrong", {
      //       position: toast.POSITION.TOP_RIGHT,
      //     });
      //   }
      // });
      .catch((error) => {
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is404Error = errorString.includes("404");
        setShowModal(true);
        if (error.response && error.response.data.detail) {
          setModalMessage(error.response.data.detail);
        } else if (is500Error) {
          setModalMessage("Internal Server Error");
        } else if (is404Error) {
          setModalMessage("Something went wrong");
        } else {
          setModalMessage("Something went wrong");
        }
      });      
  }
 

  return (
    <>
      <Button color="primary" onClick={subPlanModal} id="sub_plan">
        {"Add Sub Plan"}
      </Button>
      <Modal
        isOpen={subPlan}
        toggle={subPlanModal}
        size="lg"
        style={{ maxWidth: "1300px" }}
      >
        <ModalHeader toggle={subPlanModal}>
          {"Add Sub Plan"}
        </ModalHeader>
        <Form>
          <ModalBody>

            <div className="App">
              {inputList.map((x, i) => {
                return (
                  <div className="box">
                    <Row>
                     
                      <Col>
                        <FormGroup>
                          <div className="input_wrap">
                            <Label className="kyc_label">
                              Time Unit *
                            </Label>
                            <Input
                              className={`form-control digits ${x.time_unit ? "not-empty" : ""
                                }`}
                              value={x.time_unit}
                              type="number"
                              name="time_unit"
                              onChange={(e) => handleInputChange(e, i)}
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

                          </div>
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <div className="input_wrap">
                            <Label className="kyc_label">
                              Unit Type *
                            </Label>
                            <Input
                              type="select"
                              name="sub_plans.unit_type"
                              className={`form-control digits ${x.unit_type ? "not-empty" : ""
                                }`}
                              value={x.unit_type}
                              onChange={(e) => handleInputChange(e, i)}
                              onBlur={props.checkEmptyValue}
                            >


                              {unitType.map((unittype) => {
                                return (
                                  <option value={unittype.id}>
                                    {unittype.name}
                                  </option>
                                );
                              })}
                            </Input>

                          </div>
                        </FormGroup>
                      </Col>
                      <Col> <FormGroup>
                        <div className="input_wrap">
                          <Label className="kyc_label">
                            Plan Cost *
                          </Label>
                          <Input
                            type="number"
                            name="plan_cost"
                            onChange={e => handleInputChange(e, i)}
                            className={`form-control digits not-empty ${x.plan_cost ? "not-empty" : ""
                              }`}
                            value={x.plan_cost}
                            min="0"
                            onKeyDown={(evt) =>
                              (evt.key === "e" ||
                                evt.key === "E" ||
                                evt.key === "." ||
                                evt.key === "-") &&
                              evt.preventDefault()
                            }
                            
                          />
                        </div>
                      </FormGroup>
                      </Col>
                      <Col> <FormGroup>
                        <div className="input_wrap">
                          <Label className="kyc_label">
                            Package Name *
                          </Label>
                          <Input
                            type="text"
                            name="package_name"
                            onChange={e => handleInputChange(e, i)}
                            className={`form-control digits not-empty ${x.package_name ? "not-empty" : ""
                              }`}
                            value={x.package_name}
                          readOnly={true}

                          />
                        </div>
                      </FormGroup>
                      </Col>
                      <Col> <FormGroup>
                        <div className="input_wrap">
                          <Label className="kyc_label">
                            Total Cost *
                          </Label>
                          <Input
                            type="number"
                            name="total_plan_cost"
                            onChange={e => handleInputChange(e, i)}
                            className={`form-control digits not-empty ${x.total_plan_cost ? "not-empty" : ""
                              }`}
                            value={parseFloat(
                              x.total_plan_cost && x.total_plan_cost
                            ).toFixed(2)}
                            min="0"
                            onKeyDown={(evt) =>
                              (evt.key === "e" ||
                                evt.key === "E" ||
                                evt.key === "." ||
                                evt.key === "-") &&
                              evt.preventDefault()
                            }
                          readOnly={true}
                          />
                        </div>
                      </FormGroup>
                      </Col>
                      {/* <Col>
                         <Label
                           className="d-block"for="chk-ani"
                            >{Option} {"Tax"}
                            </Label>
                             <Input
                            className="checkbox_animated"
                            id="chk-ani"
                            name="tax"
                            type="checkbox"
                                                    onClick={(e) => handleInputChange(e, i)}
                                                    // onClick={handleClick}
                                                    value={x.tax}
                                                    checked={x.tax}
                                                />

                                            </Col> */}
                      <Col>
                        <div className="btn-box" style={{ display: "flex", position: "relative", top: "35px" }}>
                          {inputList.length !== 1 && <span
                            className="mr10"
                            onClick={() => handleRemoveClick(i)} style={{ cursor: "pointer" }}> <img src={DELETE} /></span>}
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          {inputList.length - 1 === i && <span onClick={handleAddClick} style={{ cursor: "pointer" }}>
                            <img src={ADD} />
                          </span>}
                        </div>
                      </Col>

                    </Row>
                  </div>
                );
              })}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={addSubplan} id="save_button">
              {"Save"}
            </Button>
          </ModalFooter>
        </Form>
        <ErrorModal
          isOpen={showModal}
          toggle={() => setShowModal(false)}
          message={modalMessage}
          action={() => setShowModal(false)}
        />
      </Modal>

    </>
  );
}

export default EditSubplans;
