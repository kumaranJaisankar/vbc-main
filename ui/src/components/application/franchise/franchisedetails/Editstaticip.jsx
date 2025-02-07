import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams, Link } from "react-router-dom";
import {
  Container,
  FormGroup,
  Row,
  Col,
  Label,
  Table,
  ModalFooter,
  Button,
  Input,
  ModalBody,
  Modal,
  Form,
  Spinner,
} from "reactstrap";
import { franchiseaxios, networkaxios } from "../../../../axios";
import { toast } from "react-toastify";
import Stack from "@mui/material/Stack";

const EditStaticIp = (props, initialValues) => {
  const { id } = useParams();

  const [formData, setFormData] = useState({});

  //states for assigned packages
  const [errors, setErrors] = useState({});
  const [servicelist1, setServicelist1] = useState({});
  console.log(servicelist1,"servicelist1")
  const Allplanstoggle = () => {
    setSelectServiceobj(!selectserviceobj);
    // getIpPools();
  };
  const [userSelectedService, setUserSelectedService] = useState([]);
  const [newlySelectedService, setNewlySelectedService] = useState([]);
  const [selectserviceobj, setSelectServiceobj] = useState();
  const [allserviceplanobj, setAllServiceplanobj] = useState([]);
  const [allServicePlanObjCopy, setAllServicePlanObjCopy] = useState([]);
  const [resetfield, setResetfield] = useState(false);
  const [inputs, setInputs] = useState(initialValues);
  const [resetStatus, setResetStatus] = useState(false);
  const [ipPool, setIpPool] = useState([]);
  const [loaderSpinneer, setLoaderSpinner] = useState(false);


  useEffect(() => {
    if (props.lead) {
      let plans =
        props.lead.plans &&
        props.lead.plans.map((plan, index) => ({
          id: `${index}_${plan.plan}`,
          ...plan,
        }));

      setFormData((prev) => ({
        ...prev,
        address: {
          ...props.lead.address,
        },
        leadDetailsForInputs: { ...props.lead, plans },
      }));
    }
    props.setLeadUser(props.lead);
  }, [props.lead]);

  // useEffect(() => {
  //   franchiseaxios
  //     .get("franchise/display")
  //     // .then((res) => setData(res.data))
  //     .then((res) => {
  //       console.log(res);
  //       props.setLeadUser(res.data);
  //     });
  // }, []);

  const handleChange = (e, id) => {
    const target = e.target;
    var value = target.value;
    const name = target.name;

    let addressList = [
      "house_no",
      "street",
      "landmark",
      "city",
      "district",
      "state",
      "pincode",
      "country",
    ];
    if (addressList.includes(e.target.name)) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [e.target.name]: e.target.value,
        },
      }));
      props.setLeadUser((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [e.target.name]: e.target.value,
        },
      }));
    } else {
      let currentEditedRow = formData.leadDetailsForInputs.plans.find(
        (item) => item.id === id
      );
      currentEditedRow[e.target.name] = parseInt(e.target.value);

      let updatedPlans = formData.leadDetailsForInputs.plans.map((item) => {
        if (item.id === currentEditedRow.id) {
          return { ...currentEditedRow };
        } else {
          return item;
        }
      });

      let updatedFormData = {
        ...formData,
        leadDetailsForInputs: {
          ...formData.leadDetailsForInputs,
          plans: updatedPlans,
        },
      };

      setFormData(updatedFormData);
      props.setLeadUser((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };
  const formattedData_gst_codes = props.lead?.gst_codes?.map(item => item.id);
  const handleSubmit = (e, id) => {
    setLoaderSpinner(true);
    // if (e.key === "Enter" || e.key === "NumpadEnter") {
    e.preventDefault();
    let data = { ...formData };
    console.log(data, "i am data");
    delete data["leadDetailsForInputs"];
    delete data.plans;


    // let plandata = data.plans.map((item, index) => {
    //   delete item.total_plan_cost;
    //   delete item.plan_name;
    //   delete item.validity;
    //   delete item.id;
    //   return item;
    // });
    // data = { ...data, plans: plandata };
    // ippool
    let ippools = [];
    console.log(servicelist1,"hi23")
    for (const key in servicelist1) {
      console.log(servicelist1,"hi237")
      // if(!servicelist[key].disabled){
      if (servicelist1[key].selected) {
        ippools.push({
          ippool: parseInt(key),
          franchise_share: servicelist1[key].franchise_share,
        });
      }
    }

    let submitdata1 = {};
    console.log(ippools,"checkpools1")
    if (ippools.length > -1) {
      console.log(ippools,"checkpools")
      submitdata1= { ippools };
    } 



    

    // let obj = {franchise_share : }
    submitdata1.gst_codes= formattedData_gst_codes;
    franchiseaxios
      .patch(`franchise/update/${id}`, submitdata1)
      .then((res) => {
       setLoaderSpinner(false);
       console.log(res);
        console.log(res.data);
        props.onUpdate(res.data);
        toast.success("Franchise was edited successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        Allplanstoggle();
        setNewlySelectedService([]);
        props.setIsdisabled(true);
        setServicelist1({});
      })
      .catch(function (error) {
        setLoaderSpinner(false);
        toast.error("Please fill all required fields", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        console.error("Something went wrong!", error);
        setLoaderSpinner(false);
      });
    // }
  };

  //pop up for revenue sharing
  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }
  const handleClose = () => {
    Allplanstoggle();
    const newlySelectedIDs = newlySelectedService.map((srvc) => srvc.id + "");
    console.log(newlySelectedIDs);
    setUserSelectedService(
      userSelectedService.filter((srvc) => !newlySelectedIDs.includes(srvc.id))
    );
    const currentServiceList = { ...servicelist1 };
    for (const key in currentServiceList) {
      console.log(typeof key);
      console.log(typeof newlySelectedIDs[0]);
      if (newlySelectedIDs.includes(key)) {
        delete currentServiceList[key];
      }
    }
    console.log(currentServiceList);
    setServicelist1({ ...currentServiceList });
    setNewlySelectedService([]);
    setFormData((prevState) => {
      const prevPlans = { ...prevState.plans };
      for (let serviceId of newlySelectedIDs) {
        delete prevPlans[`isp_share_${serviceId}`];
        delete prevPlans[`franchise_share_${serviceId}`];
        delete prevPlans[`tax_type_${serviceId}`];
      }

      return {
        ...prevState,
        plans: {
          ...prevPlans,
        },
      };
    });
    setErrors({});
  };

  // validation for tax_type
  const InputFieldvalidate = (name, value) => {
    if (value > 100) {
      setErrors((prevState) => {
        return {
          ...prevState,
          [name]: "no greater than 100",
        };
      });
    } else if (!/^[0-9]\d{0,9}(\.\d{1,3})?%?$/.test(value)) {
      {
        setErrors((prevState) => {
          return {
            ...prevState,
            [name]: "not valid",
          };
        });
      }
    } else if (!value) {
      setErrors((prevState) => {
        return {
          ...prevState,
          [name]: "Field is required",
        };
      });
    } else {
      setErrors((prevState) => {
        return {
          ...prevState,
          [name]: "",
        };
      });
    }
  };
  // filter

  const handleInputChange = (event, isAddress = false, serviceId) => {
    if (event) event.persist();
    // draft
    console.log(formData, "tax_typetype");
    setResetfield(false);
    // props.setIsDirtyFun(true);
    setResetStatus(false);
    if (isAddress) {
      setInputs((inputs) => ({
        ...inputs,
        address: {
          ...inputs.address,
          [event.target.name]: event.target.value,
        },
      }));
    } else {
      setInputs((inputs) => ({
        ...inputs,
        [event.target.name]: event.target.value,
      }));
    }

    const target = event.target;
    var value = target.value;
    const name = target.name;

    if (isAddress) {
      setFormData((preState) => ({
        ...preState,
        address: {
          ...preState.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((preState) => ({
        ...preState,
        [name]: value,
      }));
      // draft
      // props.setformDataForSaveInDraft((preState) => ({
      //   ...preState,
      //   [name]: value,
      // }));
    }

    if (
      name.includes("isp_share") ||
      name.includes("franchise_share") ||
      name.includes("tax_type")
    ) {
      if (!name.includes("tax_type")) {
        InputFieldvalidate(name, value);
      }
      let serviceListObj = servicelist1[serviceId];
      if (!serviceListObj) {
        serviceListObj = {};
      }

      if (name.includes("tax_type")) {
        setErrors((prevState) => {
          return {
            ...prevState,
            [`tax_type_${serviceId}`]: "",
          };
        });
        serviceListObj = {
          ...serviceListObj,
          ["tax_type"]: value,
        };
      } else {
        serviceListObj = {
          ...serviceListObj,
          ...(name === `isp_share_${serviceId}` && {
            ["isp_share"]: value,
            ["franchise_share"]: value
              ? (100 - parseFloat(value)).toFixed(0)
              : "",
          }),
          ...(name === `franchise_share_${serviceId}` && {
            ["franchise_share"]: value,
            ["isp_share"]: value ? (100 - parseFloat(value)).toFixed(0) : "",
          }),
        };
        InputFieldvalidate(
          `isp_share_${serviceId}`,
          serviceListObj["isp_share"]
        );
        InputFieldvalidate(
          `franchise_share_${serviceId}`,
          serviceListObj["franchise_share"]
        );
      }

      console.log(serviceListObj);
      setServicelist1((prevState) => {
        return {
          ...prevState,
          [serviceId]: serviceListObj,
        };
      });

      // setFormData((prevState) => ({
      //   ...prevState,
      //   plans: {
      //     ...prevState.plans,
      //     ...(name === `isp_share_${serviceId}`
      //       ? {
      //           [name]: value,
      //           [`franchise_share_${serviceId}`]: 100 - parseFloat(value),
      //         }
      //       : {
      //           [name]: value,
      //           [`isp_share_${serviceId}`]: 100 - parseFloat(value),
      //         }),
      //   },
      // }));
    }

    if (name.includes("ip_pool")) {
      console.log(serviceId);
      const selectedIDObj = allserviceplanobj.filter(
        (servicePlan) => servicePlan.id === serviceId
      )[0];

      let currentSelected = [...userSelectedService];
      let newlySelected = [...newlySelectedService];
      if (
        userSelectedService.findIndex(
          (srvc) => srvc.id === selectedIDObj.id
        ) === -1
      ) {
        currentSelected = [...userSelectedService, selectedIDObj];
        newlySelected = [...newlySelectedService, selectedIDObj];

        setUserSelectedService(currentSelected);
        setNewlySelectedService(newlySelected);
      } else if (!target.checked) {
        currentSelected = userSelectedService.filter(
          (srvc) => srvc.id !== serviceId
        );
        newlySelected = newlySelectedService.filter(
          (srvc) => srvc.id !== serviceId
        );
        setUserSelectedService(currentSelected);
        setNewlySelectedService(newlySelected);
      }

      if (target.checked) {
        setServicelist1((prevState) => {
          return {
            ...prevState,
            [serviceId]: {
              ...prevState[serviceId],
              selected: true,
            },
          };
        });
      } else {
        setServicelist1((prevState) => {
          return {
            ...prevState,
            [serviceId]: {
              // serviceId,

              ...prevState[serviceId],
              selected: false,
              // isp_share: "",
              // franchise_share: "",
              // tax_type: "",
            },
          };
        });
        setFormData((prevState) => {
          const prevPlans = { ...prevState.plans };

          delete prevPlans[`isp_share_${serviceId}`];
          delete prevPlans[`franchise_share_${serviceId}`];
          delete prevPlans[`tax_type_${serviceId}`];

          return {
            ...prevState,
            plans: {
              ...prevPlans,
            },
          };
        });
        setErrors((prevState) => {
          return {
            ...prevState,
            [`isp_share_${serviceId}`]: "",
            [`franchise_share_${serviceId}`]: "",
            [`tax_type_${serviceId}`]: "",
          };
        });
        if ((name = "")) {
        }
      }
    }
  };

  // service api //
  const datasubmit = (e) => {
    setLoaderSpinner(true);
    e.preventDefault();
    let value =
      props.leadUser && props.leadUser.branch && props.leadUser.branch.id;
    networkaxios
      .get(`network/ippool/filter?nas_branch=${value}`)
      // .get("/plans/list")
      .then((res) => {
        console.log(res);
        console.log(res.data, "");
        let curServiceList = {};
        // if (
        //   formData.leadDetailsForInputs &&
        //   formData.leadDetailsForInputs.plans
        // ) {
        //   for (let i = 0; i < formData.leadDetailsForInputs.plans.length; i++) {
        //     curServiceList[formData.leadDetailsForInputs.plans[i].plan] = {
        //       ...formData.leadDetailsForInputs.plans[i],
        //       id: formData.leadDetailsForInputs.plans[i].plan,
        //       selected: true,
        //       disabled: true,
        //       existing: "selected",
        //     };
        //   }
        //   setServicelist1({ ...curServiceList });
        // }

        setAllServiceplanobj(res.data);
        setAllServicePlanObjCopy(res.data);
        setLoaderSpinner(false);
      })
      .catch(function (error) {
        setLoaderSpinner(false);
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      });
  };

  const getIsDisabled = (service) => {
    const currentObj = servicelist1[service];
    let flag = true;

    if (currentObj) {
      if (currentObj.existing == "selected") {
        if (currentObj.selected) {
          return true;
        } else {
          return false;
        }
      } else {
        return !currentObj.selected;
      }
    } else {
      return true;
    }

    // return flag;
  };

  //
  console.log(formData, "formData");

  // pool list
  // const getIpPools = () => {
  //   let value =
  //     props.leadUser && props.leadUser.branch && props.leadUser.branch.id;
  //   networkaxios
  //     .get(`network/ippool/filter?nas_branch=${value}`)
  //     .then((res) => {
  //       setIpPool([...res.data]);
  //     });
  // };

  return (
    <Fragment>
      {/* <i
        className="icofont icofont-edit"
        style={{ marginTop: "17%", marginLeft: "9%", position: "relative",color:"#1565c0" }}
        onClick={(e) => {
          datasubmit(e);
          Allplanstoggle();
        }}
      ></i>{" "}
      &nbsp;
      <p style={{ marginTop: "-13px", marginLeft: "120px" }}> Add IP Pools</p> */}
      <Button
         style={{ marginTop: "-13px", marginLeft: "120px",fontWeight:600,marginBottom:"15px" }}
         color="primary"
         className="save_button"
         id="save_button_loader"
         onClick={(e) => {
          datasubmit(e);
          Allplanstoggle();
        }}
           
          >
            {"Add IP Pools"}
          </Button>
      {/*modal for plan*/}
      <Modal
        isOpen={selectserviceobj}
        toggle={Allplanstoggle}
        centered
        style={{ maxWidth: "1000px" }}
      >
        <ModalBody style={{ maxHeight: "400px", overflow: "auto" }}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ flex: 1 }}
          ></Stack>

          <Table className="table-border-vertical">
            <thead>
              <tr>
                <th scope="col">{"IP Pools"}</th>
                <th scope="col">{"ISP Sharing (%)"}</th>
                <th scope="col">{"Franchise Sharingg (%)"}</th>
              </tr>
            </thead>
            <tbody>
              {allserviceplanobj.map((services) => (
                <tr>
                  <td scope="row">
                    {" "}
                    <>
                      <Label className="d-block" for="edo-ani1">
                        <Input
                          className="checkbox_animated"
                          type="checkbox"
                          id="edo_ani1"
                          key={services.id}
                          value={services.id}
                          checked={
                            servicelist1[services.id] &&
                            servicelist1[services.id].selected
                          }
                          name={`ip_pool${services.id}`}
                          // disabled={
                          //   servicelist[services.id] &&
                          //   servicelist[services.id].disabled
                          // }
                          onChange={(e) =>
                            handleInputChange(e, false, services.id)
                          }
                        />
                        {services.name}
                      </Label>
                    </>
                  </td>
                  <td>
                    <div className="input_wrap">
                      <Input
                        name={`isp_share_${services.id}`}
                        onKeyDown={(evt) =>
                          (evt.key === "e" ||
                            evt.key === "E" ||
                            evt.key === "-") &&
                          evt.preventDefault()
                        }
                        min="0"
                        pattern="^[0-9]\d{0,9}(\.\d{1,3})?%?$"
                        // draft
                        className={`form-control digits ${
                          formData &&
                          formData.plans &&
                          formData.plans[`isp_share_${services.id}`]
                            ? "not-empty"
                            : ""
                        }`}
                        value={
                          servicelist1 &&
                          servicelist1[services.id] &&
                          servicelist1[services.id].isp_share
                        }
                        type="number"
                        disabled={getIsDisabled(services.id)}
                        // disabled={
                        //   !servicelist[services.id] ||
                        //   !servicelist[services.id].selected ||
                        //   !!servicelist[services.id].disabled
                        // }

                        onBlur={checkEmptyValue}
                        onChange={(e) =>
                          handleInputChange(e, false, services.id)
                        }
                      />
                      <span className="errortext">
                        {errors[`isp_share_${services.id}`]}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="input_wrap">
                      <Input
                        name={`franchise_share_${services.id}`}
                        onKeyDown={(evt) =>
                          (evt.key === "e" ||
                            evt.key === "E" ||
                            evt.key === "-") &&
                          evt.preventDefault()
                        }
                        pattern="^[0-9]\d{0,9}(\.\d{1,3})?%?$"
                        min="0"
                        // draft
                        className={`form-control digits ${
                          formData &&
                          formData.plans &&
                          formData.plans[`franchise_share_${services.id}`]
                            ? "not-empty"
                            : ""
                        }`}
                        value={
                          servicelist1 &&
                          servicelist1[services.id] &&
                          servicelist1[services.id].franchise_share
                        }
                        type="number"
                        disabled={getIsDisabled(services.id)}
                        // disabled={
                        //   !servicelist[services.id] ||
                        //     !servicelist[services.id].selected ||
                        //     !!servicelist[services.id].disabled
                        // }

                        onBlur={checkEmptyValue}
                        onChange={(e) =>
                          handleInputChange(e, false, services.id)
                        }
                      />
                      <span className="errortext">
                        {errors[`franchise_share_${services.id}`]}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => {
              handleClose();
            }}
            id="resetid"
          >
            {"Cancel"}
          </Button>
          <Button
            color="primary"
            className="save_button"
            id= "save_button_loader"
            onClick={(e) => {
              handleSubmit(e, props.lead.id);
            }}
            disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
          >
          {loaderSpinneer ? <Spinner size="sm"> </Spinner> : null} &nbsp;
            {"Save"}
          </Button>
        </ModalFooter>
      </Modal>
      {/* end */}
      <Container fluid={true} id="custinfo">
        <Form
          onSubmit={(e) => {
            handleSubmit(e, props.lead.id);
          }}
        >
          <br />
          <Row>
            <Table
              className="table-border-vertical"
              style={{ width: "max-content" }}
            >
              <thead>
                <tr>
                  <th scope="col" style={{ width: "25%" }}>
                    {"IP Pools"}
                  </th>
                  <th scope="col">{"Static IP Cost"}</th>
                  <th scope="col">{"ISP Sharing"}</th>
                  <th scope="col">{"Franchise Sharing"}</th>
                </tr>
              </thead>
              <tbody>
                {props.lead.ippools?.map((plan, index) => {
                  return (
                    <tr>
                      <td scope="row" style={{ width: "43%" }}>
                        <FormGroup>
                          <div className="input_wrap">
                            <input
                              type="text"
                              id="afterfocus"
                              style={{ border: "none", outline: "none" }}
                              className={`form-control digits not-empty`}
                              // onChange={props.handleInputChange}
                              name="ip_pool"
                              disabled={true}
                              value={plan.ippool_name}
                            ></input>
                          </div>
                        </FormGroup>
                      </td>
                      <td scope="row">
                        <FormGroup>
                          <div className="input_wrap">
                            <input
                              className={`form-control digits not-empty`}
                              id="afterfocus"
                              type="text"
                              name="cost_per_ip"
                              value={plan.cost_per_ip}
                              style={{ border: "none", outline: "none" }}
                              disabled={true}
                            ></input>
                          </div>
                        </FormGroup>
                      </td>
                      <td scope="row">
                        <FormGroup>
                          <div className="input_wrap">
                            <input
                              className={`form-control digits not-empty`}
                              id="afterfocus"
                              type="text"
                              name="isp_share"
                              style={{ border: "none", outline: "none" }}
                              value={parseFloat(
                                100 - plan.franchise_share
                              ).toFixed(2)}
                              disabled={true}
                            ></input>
                          </div>
                        </FormGroup>
                      </td>
                      <td scope="row">
                        <FormGroup>
                          <div className="input_wrap">
                            <input
                              className={`form-control digits not-empty`}
                              id="afterfocus"
                              type="text"
                              name="franchise_share"
                              style={{ border: "none", outline: "none" }}
                              value={plan.franchise_share}
                              disbaled={true}
                              disabled={true}
                            ></input>
                          </div>
                        </FormGroup>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Row>

          <br />

          <Row>
            {/* <Col sm="4">
              <button
                type="submit"
                name="submit"
                class="btn btn-primary"
                id="save_button"
                onClick={handleSave}
              >
                Save
              </button>
            </Col> */}
          </Row>
        </Form>
      </Container>
    </Fragment>
  );
};

export default EditStaticIp;
