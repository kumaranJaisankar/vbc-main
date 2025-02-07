import React, { Fragment, useState, useRef, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import useFormValidation from "../../customhooks/FormValidation";
import { servicesaxios, franchiseaxios } from "../../../axios";
// import { toast } from "react-toastify";
import { Add } from "../../../constant";
import Addsubplan from "./addsubplan";
import {
  packageType,
  packageDatatype,
  fupCalculation,
  fallBacktype,
  billingType,
  billingCycle,
  statusType,
  taxType,
  expiryDate,
  unitType,
} from "./data";
import ErrorModal from "../../common/ErrorModal";

const AddServicePlan = (props) => {
  const [isShow, setIsShow] = React.useState(false);
  const [loaderSpinneer, setLoaderSpinner] = useState(false);
  const [formData, setFormData] = useState({
    // fup_limit: "5000",
    // fup_calculation_type: "D",
    // fall_back_type: "V4MB",
    plan_cgst: 0,
    plan_sgst: 0,
    sub_plans: [
      {
        id: "subplan_0",
        package_name: "",
        plan_cost: "",
        time_unit: 1,
        unit_type: "mon",
        total_plan_cost: "",
        tax: isShow,
      },
    ],
  });
  const [inclusivetax, setInclusivetax] = useState();
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState("");
  const [togglesnmpState, setTogglesnmpState] = useState("off");
  const [isDisabled, setDisabled] = useState(true);
  const [buttonDisabled, seButtonDisabled] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [staticIP, setStaticIP] = useState("off");
  const [staticipisShow, setStaticIPIsShow] = React.useState(false);
  //new states by marieya on 27th
  const [checkPackageType, setCheckPackageType] = useState(true);
  const [planstate, setPlansState] = useState([]);
  useEffect(() => {
    servicesaxios
      .get("plans/fallbackplans/dropdown")
      .then((response) => {
        setPlansState(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);
  const [inputs, setInputs] = useState({
    // plan_cost: 0,
    plan_cgst: 0,
    plan_sgst: 0,
    // total_plan_cost: 0,
    fup_limit: "",
    fup_calculation_type: "",
    fall_back_plan: "",
  });
  //service package list from api
  const [servicelist, setServicelist] = useState([]);
  const [selectedServicelist, setSelectedServicelist] = useState([]);
  const [packagetype, setPackageType] = useState();
  // alert message

  const [alertMessage, setAlertMessage] = useState(false);

  const openAlertMessage = () => setAlertMessage(!alertMessage);
  // draft
  useEffect(() => {
    if (props.lead) {
      setFormData((prevState) => {
        return {
          ...prevState,
          ...props.lead,
        };
      });
    }
  }, [props.lead]);

  const getTotalPlanCost = (plan_cost) => {
    //Because by default tax is selected, we will always add it when we insert it
    const subPlanCost = plan_cost;
    let plan_cgst =
      parseInt(subPlanCost === "" ? 0 : subPlanCost) *
      (parseInt(inputs.plan_cgst === "" ? 0 : inputs.plan_cgst) / 100);
    let plan_sgst =
      parseInt(subPlanCost === "" ? 0 : subPlanCost) *
      (parseInt(inputs.plan_sgst === "" ? 0 : inputs.plan_sgst) / 100);
    let total_plan_cost = plan_cost;
    if (isShow) {
      total_plan_cost =
        parseInt(subPlanCost ? subPlanCost : 0) + plan_cgst + plan_sgst;
    }

    return total_plan_cost;
  };

  useEffect(() => {
    if (formData.package_name) {
      setFormData((prevState) => {
        let subPlans = [...prevState.sub_plans];
        // let subPlanIndex = subPlans.findIndex((s)=>s.id == 'subplan_0');
        let subPlansNew = subPlans.map((s) => {
          if (s.id == "subplan_0") {
            return {
              ...s,
              package_name: formData.package_name,
              tax: isShow,
              total_plan_cost: getTotalPlanCost(s.plan_cost),
            };
          } else {
            return {
              ...s,
              tax: isShow,
              total_plan_cost: getTotalPlanCost(s.plan_cost),
            };
          }
        });

        return {
          ...prevState,
          sub_plans: [...subPlansNew],
        };
      });
    }
  }, [formData.package_name, isShow]);

  const handleInputChange = (event) => {
    event.persist();
    // draft
    // props.setIsDirtyFun(true);
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    setPassword(event.target.value);

    const target = event.target;
    var value = target.value;
    const name = target.name;
    if (target.type === "checkbox") {
      if (target.checked) {
        formData.hobbies[value] = value;
      } else {
        formData.hobbies.splice(value, 1);
      }
    }

    if (name.includes("sub_plans")) {
      let a = name.split(".");
      setFormData((preState) => {
        return {
          ...preState,
          sub_plans: {
            ...preState.sub_plans,
            [a[1]]: value,
          },
        };
      });
    } else {
      setFormData((preState) => {
        return {
          ...preState,
          [name]: value.charAt(0).toUpperCase() + value.slice(1),
        };
      });

      // draft
      // props.setformDataForSaveInDraft((preState) => ({
      //   ...preState,
      //   [name]: value,
      // }));
    }
  };
  // added line 202 by marieya
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
    }
    setFormData((preState) => {
      return {
        ...preState,
        ...props.lead,
      };
    });
    setDisabled(true);
    seButtonDisabled(false);
  }, [props.rightSidebar]);

  useEffect(() => {
    let cgst =
      parseInt(inputs.plan_cost === "" ? 0 : inputs.plan_cost) *
      (parseInt(inputs.plan_cgst === "" ? 0 : inputs.plan_cgst) / 100);
    let Sgst =
      parseInt(inputs.plan_cost === "" ? 0 : inputs.plan_cost) *
      (parseInt(inputs.plan_sgst === "" ? 0 : inputs.plan_sgst) / 100);
    let total =
      parseInt(inputs.plan_cost === "" ? 0 : inputs.plan_cost) + cgst + Sgst;

    setInputs((inp) => ({ ...inp, total_plan_cost: total }));
    setFormData((preState) => {
      return {
        ...preState,
        total_plan_cost: total,
      };
    });
  }, [inputs.plan_cost, inputs.plan_cgst, inputs.plan_sgst]);

  // adding service plan api

  const serivceDetails = (e) => {
    var config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const subPlansWithoutID = formData.sub_plans.map((item) => {
      delete item["id"];
      return {
        ...item,
      };
    });
    // var data = {
    //   main_plan: {
    //     package_name: formData.package_name,
    //     download_speed: formData.download_speed,
    //     upload_speed: formData.upload_speed,
    //     package_type: formData.package_type,
    //     package_data_type: formData.package_data_type,
    //     fup_limit: inputs.fup_limit ? inputs.fup_limit : 5000,
    //     fup_calculation_type: inputs.fup_calculation_type
    //       ? inputs.fup_calculation_type
    //       : "D",
    //     fall_back_type: inputs.fall_back_type ? inputs.fall_back_type : "V4MB",
    //     billing_type: formData.billing_type,
    //     billing_cycle: formData.billing_cycle,
    //     status: formData.status,
    //     tax: isShow,
    //     tax_type: formData.tax_type,
    //     plan_cost: formData.sub_plans.length
    //       ? formData.sub_plans[0].plan_cost
    //       : null,
    //     plan_cgst: inputs.plan_cgst ? inputs.plan_cgst : 0,
    //     plan_sgst: inputs.plan_sgst ? inputs.plan_sgst : 0,
    //     total_plan_cost: formData?.sub_plans.length
    //       ? formData.sub_plans[0].total_plan_cost
    //       : null,
    //     renewal_expiry_day: formData.renewal_expiry_day,
    //     time_unit: formData.sub_plans.length
    //       ? formData.sub_plans[0].time_unit
    //       : null,
    //     unit_type: formData.sub_plans.length
    //       ? formData.sub_plans[0].unit_type
    //       : null,
    //     offer: formData.sub_plans.length ? formData.sub_plans[0].offer : null,
    //     created_at: formData.created_at,
    //     updated_at: formData.updated_at,
    //     sub_plan: { ...subPlansWithoutID[0] },
    //   },

    //   sub_plans: [
    //     ...formData.sub_plans.map((item) => {
    //       delete item["id"];
    //       if (item.package_name)
    //         return {
    //           ...item,
    //           total_plan_cost:
    //             item.total_plan_cost.toFixed && item.total_plan_cost.toFixed(2),
    //           plan_cgst: item.tax ? +inputs.plan_cgst : 0,
    //           plan_sgst: item.tax ? +inputs.plan_sgst : 0,
    //         };
    //       else {
    //         return {};
    //       }
    //     }),
    //   ],

    //   // ...(formData.sub_plans && { sub_plans:
    //   //     [
    //   //          {
    //   //         package_name:formData.sub_plans && formData.sub_plans.package_name,
    //   //         plan_cost:formData.sub_plans && formData.sub_plans.plan_cost,
    //   //         plan_cgst:inputs.plan_cgst ? inputs.plan_cgst:0,
    //   //         plan_sgst:inputs.plan_sgst ? inputs.plan_sgst : 0,
    //   //         total_plan_cost:inputs && inputs.total_plan_cost,
    //   //         time_unit:formData.sub_plans && formData.sub_plans.time_unit,
    //   //         unit_type:formData.sub_plans && formData.sub_plans.unit_type,
    //   //         }
    //   //     ]})
    // };

    // const removedEmptySubPlans = data.sub_plans.filter((item) => Object.keys(item).length>0)

    // data.sub_plans = [...removedEmptySubPlans.slice(1)]

    //payload code added by marieya
    var data;
    if (checkPackageType === "FBP") {
      data = {
        main_plan: {
          package_name: formData.package_name,
          download_speed: formData.download_speed,
          upload_speed: formData.upload_speed,
          package_type: formData.package_type,
          package_data_type: "ULT-FUP",
          fup_limit: "5000",
          fup_calculation_type: "DU",
          fall_back_plan: null,
          billing_type: "PRE",
          billing_cycle: "REG",
          status: "ACT",
          tax: true,
          tax_type: "EX",
          plan_cost: "0",
          plan_cgst: "0",
          plan_sgst: "0",
          total_plan_cost: "0.00",
          renewal_expiry_day: "REG",
          time_unit: 1,
          unit_type: "mon",
        },
        sub_plans: [],
      };
    } else {
      data = {
        main_plan: {
          package_name: formData.package_name,
          download_speed: formData.download_speed,
          upload_speed: formData.upload_speed,
          package_type: formData.package_type,
          package_data_type: formData.package_data_type,
          fup_limit: inputs.fup_limit ? inputs.fup_limit : 5000,
          fup_calculation_type: inputs.fup_calculation_type
            ? inputs.fup_calculation_type
            : "D",
          fall_back_plan: inputs.fall_back_plan ? inputs.fall_back_plan : null,
          billing_type: formData.billing_type,
          billing_cycle: formData.billing_cycle,
          status: formData.status,
          tax: isShow,
          is_static_ip: staticipisShow,
          tax_type: formData.tax_type,
          plan_cost: formData.sub_plans.length
            ? parseFloat(formData.sub_plans[0].plan_cost).toFixed(2)
            : null,
          plan_cgst: inputs.plan_cgst ? inputs.plan_cgst : 0,
          plan_sgst: inputs.plan_sgst ? inputs.plan_sgst : 0,
          total_plan_cost: formData?.sub_plans.length
            ? formData.sub_plans[0].total_plan_cost.toFixed(2)
            : null,
          renewal_expiry_day: formData.renewal_expiry_day,
          time_unit: formData.sub_plans.length
            ? formData.sub_plans[0].time_unit
            : null,
          unit_type: formData.sub_plans.length
            ? formData.sub_plans[0].unit_type
            : null,
          offer: formData.sub_plans.length ? formData.sub_plans[0].offer : null,
          created_at: formData.created_at,
          updated_at: formData.updated_at,
          sub_plan: { ...subPlansWithoutID[0] },
        },
        sub_plans: [
          ...formData.sub_plans.map((item) => {
            delete item["id"];
            if (item.package_name) {
              return {
                ...item,
                // total_plan_cost: item.total_plan_cost.toFixed(2) && item.total_plan_cost.toFixed(2),
                total_plan_cost:
                  typeof item.total_plan_cost === "string"
                    ? isNaN(Number(item.total_plan_cost))
                      ? 0
                      : Number(item.total_plan_cost).toFixed(2)
                    : typeof item.total_plan_cost === "number"
                    ? item.total_plan_cost.toFixed(2)
                    : 0,
                plan_cgst: item.tax ? +inputs.plan_cgst : 0,
                plan_sgst: item.tax ? +inputs.plan_sgst : 0,
              };
            } else {
              return {};
            }
          }),
        ],
      };
      //       if (!data.main_plan.fall_back_plan) {
      //   delete data.main_plan.fall_back_plan;
      // }
    }
    data.sub_plans = [...data.sub_plans.slice(1)];
    delete data.main_plan["sub_plan"];

    console.log(data, "<<<<<<<<<<<<");
    setLoaderSpinner(true);
    servicesaxios
      .post("plans/radius/create", data, config)

      .then((response) => {
        setCheckPackageType(false);
        resetformmanually();
        setAlertMessage(false);
        props.onUpdate(response.data);
        setLoaderSpinner(false);
        // toast.success("Plan was added successfully", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose: 1000,
        // });
        setShowModal(true);
        setModalMessage("Plan was added successfully");
        planUpdate(response.data.id, formData.franchises);
        resetformmanually();
        setPackageType("");
        togglesnmp();
        props.dataClose();

        // setFormData(formData.sub_plans)
      })
      .catch(function (error) {
        setLoaderSpinner(false);
        let errorMessage = "Something went wrong";

        if (error.response && error.response.data) {
          if (error.response.data["package_name"].length > 0) {
            errorMessage = error.response.data["package_name"][0];
          } else if (error.response.status === 500) {
            errorMessage = "Internal server error";
          } else if (error.response.status === 404) {
            errorMessage = "API endpoint not found";
          }
        }
        setShowModal(true);
        setModalMessage(errorMessage);
      });
    // .catch(function (error) {
    //   setLoaderSpinner(false)
    //   if (error.response && error.response.data) {
    //     if (error.response.data["package_name"].length > 0) {
    //       toast.error(error.response.data["package_name"][0]);
    //     }
    //   }
    // });
  };
  // }

  // function checkEmptyValue(e) {
  //   if (e.target.value == "") {
  //     e.target.classList.remove("not-empty");
  //   } else {
  //     e.target.classList.add("not-empty");
  //   }
  // }
  // Form Validation Starts from here

  const resetInputField = () => {};
  const resetForm = function () {
    setInputs((inputs) => {
      var obj = {};
      for (var name in inputs) {
        obj[name] = "";
      }
      return obj;
    });
    setFormData({
      // fup_limit: "5000",
      // fup_calculation_type: "D",
      // fall_back_type: "V4MB",
      plan_cgst: 0,
      plan_sgst: 0,
      sub_plans: [
        {
          id: "subplan_0",
          package_name: "",
          plan_cost: "",
          time_unit: 1,
          unit_type: "mon",
          total_plan_cost: "",
          tax: true,
        },
      ],
    });
    setErrors({});
  };
  const form = useRef(null);

  // franchise list old api
  // useEffect(() => {
  //   servicesaxios
  //     .get("plans/franchise/options")

  //     .then((res) => {
  //       let { franchises } = res.data;
  //       setFranchiseList([...franchises]);
  //     })
  //     .catch((err) =>
  //     console.log("error franchise options")
  //     );
  // }, []);

  function togglesnmp() {
    setTogglesnmpState(togglesnmpState === "off" ? "on" : "off");
    setIsShow(!isShow);
    setInclusivetax(togglesnmpState === "on" && "");
  }
  function staticipToggle() {
    setStaticIP(staticIP === "off" ? "on" : "off");
    setStaticIPIsShow(!staticipisShow);
  }
  console.log(staticipisShow, "staticipisShow");
  const resetformmanually = () => {
    setFormData({
      package_name: "",
      download_speed: "",
      upload_speed: "",
      package_type: "",
      package_data_type: "",
      billing_type: "",
      billing_cycle: "",
      status: "",
      // plan_cost: "",
      plan_cgst: 0,
      plan_sgst: 0,
      // total_plan_cost: 0,
      renewal_expiry_day: "",
      tax: "",
      tax_type: "",
      // time_unit: "",
      // unit_type: "",
      fup_limit: "",
      fup_calculation_type: "",
      fall_back_plan: "",
      sub_plans: [
        {
          id: "subplan_0",
          package_name: "",
          plan_cost: "",
          time_unit: 1,
          unit_type: "mon",
          total_plan_cost: "",
          tax: true,
        },
      ],
    });
    document.getElementById("resetid").click();
    document.getElementById("myForm").reset();
  };

  // validations
  const submit = (e) => {
    e.preventDefault();
    e = e.target.name;

    formData.franchises = [...selectedServicelist].map((d) => d.value);
    const validationErrors = validate(formData);
    if (formData.tax_type === "IN" || formData.package_data_type === "ULT") {
      delete validationErrors["plan_sgst"];
      delete validationErrors["plan_cgst"];
      delete validationErrors["total_plan_cost"];
      delete validationErrors["fup_limit"];
      delete validationErrors["fup_calculation_type"];
      delete validationErrors["fall_back_plan"];
    }

    if (togglesnmpState == "off") {
      delete validationErrors["plan_sgst"];
      delete validationErrors["plan_cgst"];
    }
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);

    if (noErrors) {
      setAlertMessage(!alertMessage);
      // serivceDetails();
    }

    // else {
    //   toast.error("Something went wrong");
    // }
  };
  //added by marieya

  const getRequiredFields = (packageType) => {
    const commonFields = [
      "package_name",
      "download_speed",
      "upload_speed",
      "package_type",
    ];

    const nonFBPFields = [
      "package_data_type",
      "fup_limit",
      "fup_calculation_type",
      "fall_back_plan",
      "status",
      "billing_cycle",
      "billing_type",
      "plan_cgst",
      "plan_sgst",
      "renewal_expiry_day",
    ];

    return packageType === "FBP"
      ? commonFields
      : [...commonFields, ...nonFBPFields];
  };

  const { validate } = useFormValidation(getRequiredFields(checkPackageType));

  // const requiredFields = [
  //   "package_data_type",
  //   "package_name",
  //   "download_speed",
  //   "upload_speed",
  //   "package_type",
  //   "fup_limit",
  //   "fup_calculation_type",
  //   "fall_back_plan",
  //   "status",
  //   "billing_cycle",
  //   "billing_type",
  //   // "time_unit",
  //   // "unit_type",
  //   // "plan_cost",
  //   "plan_cgst",
  //   "plan_sgst",
  //   "renewal_expiry_day",
  //   // "subPlan",
  // ];

  // const { validate } = useFormValidation(requiredFields);

  // franchise  list api
  useEffect(() => {
    franchiseaxios
      .get("franchise/display")
      .then((res) => {
        const list = [...res.data].map((d) => {
          return { value: d.id, label: d.franchise_name };
        });
        setServicelist(list);
      })
      .catch((error) => console.log("error franchise display "));
  }, []);

  // calling 2nd api after plan create
  const planUpdate = (planid, franchiselist) => {
    var config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    const data = {
      franchises: franchiselist,
      plan: planid,
    };
    // franchiseaxios
    // .post("franchise/plan/update", data, config)
    // .then((res)=>{
    //   toast.success("plan update successfully");
    // })
  };
  // Form Validation Starts from here

  let dependency = formData["customer_documents"];

  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      checkFieldValidity("customer_documents");
    }
  }, [dependency]);

  const checkFieldValidity = (fieldName, parent) => {
    const validationErrors = validate(formData);
    let vErrors = {};
    if (validationErrors[fieldName]) {
      vErrors[fieldName] = validationErrors[fieldName];
    }

    const noErrors = Object.keys(vErrors).length === 0;

    if (noErrors) {
      setErrors({ ...errors, ...{ [fieldName]: "" } });
    }
    setErrors({ ...errors, ...{ [fieldName]: vErrors[fieldName] } });
  };

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  //This function will be used for validation of individual fields
  const handleInputBlur = (e, fieldName, parent) => {
    checkEmptyValue(e);
    checkFieldValidity(fieldName, parent);
  };
  // Form validations ended here

  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              <Row>
                {/* <Col sm="3">
                  <FormGroup style={{marginTop:"-25px"}}>
                   <Label> Select Franchise</Label>
                    <Packagelistselect
                    servicelist={servicelist}
                    setSelectedServicelist={setSelectedServicelist}/>                   
                
                  </FormGroup>
                </Col> 1*/}
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Package Name *</Label>
                      <Input
                        type="text"
                        name="package_name"
                        onChange={handleInputChange}
                        onBlur={(e) => handleInputBlur(e, "package_name")}
                        // onBlur={checkEmptyValue}
                        // draft
                        className={`form-control digits ${
                          formData && !formData.package_name ? "" : "not-empty"
                        }`}
                        value={formData && formData.package_name}
                      />
                    </div>

                    <span className="errortext">{errors.package_name}</span>
                    {/* Sailaja fixed Single line issue on 1st August Ref SP-04 */}

                    <Row style={{ marginTop: "-5%", marginLeft: "-1px" }}>
                      <Col sm="12">
                        <ul>
                          {/* <li className="nas_field_strength" style={{marginLeft:"-3%", marginTop:"-1%",top:"3px"}}>Note : </li> */}
                          <li
                            className="nas_field_strength"
                            style={{
                              marginLeft: "-18%",
                              top: "3px",
                              marginBottom: "2%",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <b>Note : Only alphanumeric and "_" are allowed.</b>
                          </li>
                        </ul>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div class="input_wrap">
                      <Label className="kyc_label">Download Speed *</Label>
                      <Input
                        type="number"
                        min="1"
                        onKeyDown={(evt) =>
                          (evt.key === "e" ||
                            evt.key === "E" ||
                            evt.key === "." ||
                            evt.key === "-") &&
                          evt.preventDefault()
                        }
                        class="form-control"
                        name="download_speed"
                        onChange={handleInputChange}
                        onBlur={(e) => handleInputBlur(e, "download_speed")}
                        // onBlur={checkEmptyValue}
                        // draft
                        className={`form-control digits ${
                          formData && formData.download_speed ? "not-empty" : ""
                        }`}
                        value={formData && formData.download_speed}
                      />
                    </div>
                    <span className="errortext">{errors.download_speed}</span>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div class="input_wrap">
                      <Label className="kyc_label">Upload Speed *</Label>
                      <Input
                        type="number"
                        min="1"
                        onKeyDown={(evt) =>
                          (evt.key === "e" ||
                            evt.key === "E" ||
                            evt.key === "." ||
                            evt.key === "-") &&
                          evt.preventDefault()
                        }
                        name="upload_speed"
                        onChange={handleInputChange}
                        onBlur={(e) => handleInputBlur(e, "upload_speed")}
                        // onBlur={checkEmptyValue}
                        // draft
                        className={`form-control digits ${
                          formData && formData.upload_speed ? "not-empty" : ""
                        }`}
                        value={formData && formData.upload_speed}
                      />
                    </div>
                    <span className="errortext">{errors.upload_speed}</span>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Package Type *</Label>
                      <Input
                        type="select"
                        name="package_type"
                        className={`form-control digits ${
                          formData && formData.package_type ? "not-empty" : ""
                        }`}
                        value={formData && formData.package_type}
                        onChange={(event) => {
                          handleInputChange(event);
                          setCheckPackageType(event.target.value);
                        }}
                        onBlur={(e) => handleInputBlur(e, "package_type")}
                        // onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>

                        {packageType.map((packType) => {
                          return (
                            <option value={packType.id}>{packType.name}</option>
                          );
                        })}
                      </Input>
                    </div>
                    <span className="errortext">
                      {errors.package_type && "Selection is required"}
                    </span>
                  </FormGroup>
                </Col>

                <Col sm="3" id="moveup" hidden={checkPackageType === "FBP"}>
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Package Data Type *</Label>
                      <Input
                        type="select"
                        name="package_data_type"
                        className={`form-control digits ${
                          formData && formData.package_data_type
                            ? "not-empty"
                            : ""
                        }`}
                        value={formData && formData.package_data_type}
                        onChange={(event) => {
                          handleInputChange(event);
                          setPackageType(event.target.value);
                        }}
                        onBlur={(e) => handleInputBlur(e, "package_data_type")}
                        // onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        {packageDatatype.map((packData) => {
                          return (
                            <option value={packData.id}>{packData.name}</option>
                          );
                        })}
                      </Input>
                    </div>
                    <span className="errortext">
                      {errors.package_data_type && "Selection is required"}
                    </span>
                  </FormGroup>
                </Col>
                <Col
                  sm="3"
                  hidden={packagetype === "ULT" || checkPackageType === "FBP"}
                  id="moveup"
                >
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">FUP Limit *</Label>
                      <Input
                        type="number"
                        name="fup_limit"
                        min="1"
                        onKeyDown={(evt) =>
                          (evt.key === "e" ||
                            evt.key === "E" ||
                            evt.key === "." ||
                            evt.key === "-") &&
                          evt.preventDefault()
                        }
                        onChange={handleInputChange}
                        onBlur={(e) => handleInputBlur(e, "fup_limit")}
                        // onBlur={checkEmptyValue}
                        // draft
                        className={`form-control digits ${
                          inputs && inputs.fup_limit ? "not-empty" : ""
                        }`}
                        value={inputs && inputs.fup_limit}
                      />
                    </div>
                    <span className="errortext">{errors.fup_limit}</span>
                  </FormGroup>
                </Col>
                <Col
                  sm="3"
                  hidden={packagetype === "ULT" || checkPackageType === "FBP"}
                  id="moveup"
                >
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">FUP Calculation * </Label>
                      <Input
                        type="select"
                        name="fup_calculation_type"
                        className={`form-control digits ${
                          inputs && inputs.fup_calculation_type
                            ? "not-empty"
                            : ""
                        }`}
                        value={inputs && inputs.fup_calculation_type}
                        onChange={(event) => {
                          handleInputChange(event);
                        }}
                        onBlur={(e) =>
                          handleInputBlur(e, "fup_calculation_type")
                        }
                        // onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>

                        {fupCalculation.map((fupCal) => {
                          return (
                            <option value={fupCal.id}>{fupCal.name}</option>
                          );
                        })}
                      </Input>
                    </div>
                    <span className="errortext">
                      {errors.fup_calculation_type && "Selection is required"}
                    </span>
                  </FormGroup>
                </Col>
                <Col
                  sm="3"
                  hidden={packagetype === "ULT" || checkPackageType === "FBP"}
                  id="moveup"
                >
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Fall Back Plan * </Label>
                      <Input
                        type="select"
                        name="fall_back_plan"
                        className={`form-control digits ${
                          inputs && inputs.fall_back_plan ? "not-empty" : ""
                        }`}
                        value={inputs && inputs.fall_back_plan}
                        onChange={(event) => {
                          handleInputChange(event);
                        }}
                        onBlur={(e) => handleInputBlur(e, "fall_back_plan")}
                        // onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>

                        {/* {fallBacktype.map((fallBack) => {
                          return (
                            <option value={fallBack.id}>{fallBack.name}</option>
                          );
                        })} */}
                        {planstate.map((fallBack) => {
                          return (
                            <option key={fallBack.id} value={fallBack.id}>
                              {fallBack.package_name}
                            </option>
                          );
                        })}
                      </Input>
                    </div>
                    <span className="errortext">
                      {errors.fall_back_type && "Selection is required"}
                    </span>
                  </FormGroup>
                </Col>
                <Col sm="3" id="moveup" hidden={checkPackageType === "FBP"}>
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Billing Type * </Label>
                      <Input
                        type="select"
                        name="billing_type"
                        className={`form-control digits ${
                          formData && formData.billing_type ? "not-empty" : ""
                        }`}
                        value={formData && formData.billing_type}
                        onChange={(event) => {
                          handleInputChange(event);
                        }}
                        onBlur={(e) => handleInputBlur(e, "billing_type")}
                        // onBlur={checkEmptyValue}|
                      >
                        <option value="" style={{ display: "none" }}></option>
                        {billingType.map((billType) => {
                          return (
                            <option value={billType.id}>{billType.name}</option>
                          );
                        })}
                      </Input>
                    </div>
                    <span className="errortext">
                      {errors.billing_type && "Selection is required"}
                    </span>
                  </FormGroup>
                </Col>
                <Col sm="3" id="moveup" hidden={checkPackageType === "FBP"}>
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Billing Cycle * </Label>

                      <Input
                        type="select"
                        name="billing_cycle"
                        className={`form-control digits ${
                          formData && formData.billing_cycle ? "not-empty" : ""
                        }`}
                        value={formData && formData.billing_cycle}
                        onChange={(event) => {
                          handleInputChange(event);
                        }}
                        onBlur={(e) => handleInputBlur(e, "billing_cycle")}
                        // onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>

                        {billingCycle.map((billCycle) => {
                          return (
                            <option value={billCycle.id}>
                              {billCycle.name}
                            </option>
                          );
                        })}
                      </Input>
                    </div>
                    <span className="errortext">
                      {errors.billing_cycle && "Selection is required"}
                    </span>
                  </FormGroup>
                </Col>
                <Col sm="3" id="moveup" hidden={checkPackageType === "FBP"}>
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Status * </Label>
                      <Input
                        type="select"
                        name="status"
                        className={`form-control digits ${
                          formData && formData.status ? "not-empty" : ""
                        }`}
                        value={formData && formData.status}
                        onChange={(event) => {
                          handleInputChange(event);
                        }}
                        onBlur={(e) => handleInputBlur(e, "status")}
                        // onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>

                        {statusType.map((staType) => {
                          return (
                            <option value={staType.id}>{staType.name}</option>
                          );
                        })}
                      </Input>
                    </div>
                    <span className="errortext">
                      {errors.status && "Selection is required"}
                    </span>
                  </FormGroup>
                </Col>
                <Col sm="3" id="moveup" hidden={checkPackageType === "FBP"}>
                  <Label className="desc_label"> Tax</Label>
                  <FormGroup>
                    <div
                      className={`franchise-switch ${togglesnmpState}`}
                      onClick={togglesnmp}
                    />
                  </FormGroup>
                </Col>

                <Col sm="3" id="moveup">
                  <Label className="desc_label"> Static IP</Label>
                  <FormGroup>
                    <div
                      className={`franchise-switch ${staticIP}`}
                      onClick={staticipToggle}
                    />
                  </FormGroup>
                </Col>
                {isShow ? (
                  <Col sm="3" id="moveup" hidden={checkPackageType === "FBP"}>
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">Tax Type </Label>
                        <Input
                          type="select"
                          name="tax_type"
                          className={`form-control digits ${
                            formData && formData.tax_type ? "not-empty" : ""
                          }`}
                          value={formData && formData.tax_type}
                          onChange={(event) => {
                            handleInputChange(event);
                            setInclusivetax(event.target.value);
                            if (event.target.value === "IN") {
                              setFormData((preState) => {
                                return {
                                  ...preState,
                                  total_plan_cost: preState.plan_cost,
                                };
                              });
                            }
                          }}
                          onBlur={checkEmptyValue}
                        >
                          <option value="" style={{ display: "none" }}></option>

                          {taxType.map((taxtype) => {
                            return (
                              <option value={taxtype.id}>{taxtype.name}</option>
                            );
                          })}
                        </Input>
                      </div>
                    </FormGroup>
                  </Col>
                ) : (
                  <div></div>
                )}

                {/* <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        // draft
                        className={`form-control digits ${
                          formData && formData.plan_cost ? "not-empty" : ""
                        }`}
                        value={formData && formData.plan_cost}
                        type="number"
                        name="plan_cost"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        min="1"
                        onKeyDown={(evt) =>
                          (evt.key === "e" ||
                            evt.key === "E" ||
                            evt.key === "." ||
                            evt.key === "-") &&
                          evt.preventDefault()
                        }
                      />
                      <Label className="kyc_label">Plan Cost *</Label>
                    </div>
                    <span className="errortext">{errors.plan_cost}</span>
                  </FormGroup>
                </Col> */}
                <Col
                  sm="3"
                  hidden={inclusivetax != "EX" || checkPackageType === "FBP"}
                  id="moveup"
                >
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Plan CGST *</Label>
                      <Input
                        // draft
                        className={`form-control digits ${
                          inputs && inputs.plan_cgst ? "not-empty" : ""
                        }`}
                        value={inputs && inputs.plan_cgst}
                        type="number"
                        name="plan_cgst"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
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
                    {/* <span className="errortext">{errors.plan_cgst && "Plan CGST is required"}</span> */}
                  </FormGroup>
                </Col>
                <Col
                  sm="3"
                  hidden={inclusivetax != "EX" || checkPackageType === "FBP"}
                  id="moveup"
                >
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Plan SGST *</Label>
                      <Input
                        // draft
                        className={`form-control digits ${
                          inputs && inputs.plan_sgst ? "not-empty" : ""
                        }`}
                        value={inputs && inputs.plan_sgst}
                        type="number"
                        name="plan_sgst"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
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
                    {/* <span className="errortext">{errors.plan_sgst && "Plan SGST is required"}</span> */}
                  </FormGroup>
                </Col>
                {/* <Col sm="3" hidden={inclusivetax != "EX"}>
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        // draft
                        className={`form-control digits not-empty ${
                          formData && formData.total_plan_cost
                            ? "not-empty"
                            : ""
                        }`}
                        value={formData && formData.total_plan_cost}
                        type="number"
                        name="total_plan_cost"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        value={parseInt(inputs.total_plan_cost).toFixed(2)}
                        readOnly={true}
                      />
                      <Label className="kyc_label">
                        Total Cost *
                      </Label>
                    </div>
                  </FormGroup>
                </Col> */}
                <Col sm="3" id="moveup" hidden={checkPackageType === "FBP"}>
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Renewal Expiry Day * </Label>
                      <Input
                        type="select"
                        name="renewal_expiry_day"
                        className={`form-control digits ${
                          formData && formData.renewal_expiry_day
                            ? "not-empty"
                            : ""
                        }`}
                        value={formData && formData.renewal_expiry_day}
                        onChange={(event) => {
                          handleInputChange(event);
                        }}
                        onBlur={(e) => handleInputBlur(e, "renewal_expiry_day")}
                        // onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>

                        {expiryDate.map((expityype) => {
                          return (
                            <option value={expityype.id}>
                              {expityype.name}
                            </option>
                          );
                        })}
                      </Input>
                    </div>
                    <span className="errortext">
                      {errors.renewal_expiry_day && "Selection is required"}
                    </span>
                  </FormGroup>
                </Col>

                {/* <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        // draft
                        className={`form-control digits ${
                          formData && formData.time_unit ? "not-empty" : ""
                        }`}
                        value={formData && formData.time_unit}
                        type="number"
                        name="time_unit"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        min="1"
                        onKeyDown={(evt) =>
                          (evt.key === "e" ||
                            evt.key === "E" ||
                            evt.key === "." ||
                            evt.key === "-") &&
                          evt.preventDefault()
                        }
                      />
                      <Label className="kyc_label">Time Unit *</Label>
                    </div>
                    <span className="errortext">{errors.time_unit}</span>
                  </FormGroup>
                </Col> */}
                {/* <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="unit_type"
                        className={`form-control digits ${
                          formData && formData.unit_type ? "not-empty" : ""
                        }`}
                        value={formData && formData.unit_type}
                        onChange={(event) => {
                          handleInputChange(event);
                        }}
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>

                        {unitType.map((unittype) => {
                          return (
                            <option value={unittype.id}>{unittype.name}</option>
                          );
                        })}
                      </Input>
                      <Label className="kyc_label">Unit Type *</Label>
                    </div>
                    <span className="errortext">
                      {errors.unit_type && "Select Unit Type"}
                    </span>
                  </FormGroup>
                </Col> */}
                <Col
                  style={{ marginTop: "5px" }}
                  hidden={checkPackageType === "FBP"}
                >
                  <Addsubplan
                    checkEmptyValue={checkEmptyValue}
                    handleInputChange={handleInputChange}
                    formData={formData}
                    setInputs={setInputs}
                    inputs={inputs}
                    setFormData={setFormData}
                    isShow={isShow}
                    errors={errors}
                    isDisabled={isDisabled}
                    setDisabled={setDisabled}
                    buttonDisabled={buttonDisabled}
                    seButtonDisabled={seButtonDisabled}
                  />
                </Col>
              </Row>

              <br />
              <Row>
                <span
                  className="sidepanel_border"
                  style={{ position: "relative" }}
                ></span>
                <Col>
                  <FormGroup className="mb-0">
                    {checkPackageType === "FBP" ? (
                      <Button
                        color="btn btn-primary"
                        // type="submit"
                        className="mr-3"
                        onClick={submit}
                        id="create_button"
                        // disabled={checkPackageType === 'FBP' ? false : (loaderSpinneer ? loaderSpinneer : isDisabled)}
                        disabled={
                          loaderSpinneer ? loaderSpinneer : loaderSpinneer
                        }
                      >
                        {loaderSpinneer ? (
                          <Spinner size="sm" id="spinner"></Spinner>
                        ) : null}
                        {Add}
                      </Button>
                    ) : (
                      <Button
                        color="btn btn-primary"
                        // type="submit"
                        className="mr-3"
                        onClick={submit}
                        id="create_button"
                        // disabled={checkPackageType === 'FBP' ? false : (loaderSpinneer ? loaderSpinneer : isDisabled)}
                        disabled={loaderSpinneer ? loaderSpinneer : isDisabled}
                      >
                        {loaderSpinneer ? (
                          <Spinner size="sm" id="spinner"></Spinner>
                        ) : null}
                        {Add}
                      </Button>
                    )}
                    <Button type="reset" color="btn btn-primary" id="resetid">
                      Reset
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
              <Modal isOpen={alertMessage} toggle={openAlertMessage} centered>
                <ModalBody>
                  <p>You can't change once the plan is created. </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="contained"
                    onClick={serivceDetails}
                    type="button"
                    id="yes_button"
                    disabled={loaderSpinneer}
                  >
                    {loaderSpinneer ? (
                      <Spinner size="sm" id="spinner"></Spinner>
                    ) : null}

                    {"Yes"}
                  </Button>
                </ModalFooter>
              </Modal>
            </Form>
          </Col>
        </Row>
        <ErrorModal
          isOpen={showModal}
          toggle={() => setShowModal(false)}
          message={modalMessage}
          action={() => setShowModal(false)}
        />
      </Container>
    </Fragment>
  );
};
//commented code for dev build
export default AddServicePlan;
