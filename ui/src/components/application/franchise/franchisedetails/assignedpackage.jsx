import React, { Fragment, useEffect, useState, useRef } from "react"; //hooks
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Label,
  FormGroup,
  Table,
  ModalFooter,
  Button,
  Input,
  ModalBody,
  Modal,
  Spinner,
  ModalHeader,
} from "reactstrap";
import { servicesaxios, franchiseaxios } from "../../../../axios";
import { toast } from "react-toastify";
import { Tooltip } from "antd";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

const AssignedPackage = ({
  initialValues,
  formData,
  setFormData,
  loaderSpinneer,
  setLoaderSpinner,
  servicelist,
  setServicelist,
  allserviceplanobj,
  setAllServiceplanobj,
  allServicePlanObjCopy,
  setAllServicePlanObjCopy,
  selectserviceobj,
  setSelectServiceobj,
  Allplanstoggle,
  lead,
  onUpdate,
  isDisabled,
  setLead,
  setIsdisabled,
  leadUser,
  setLeadUser,
  datasubmit,
  AnotherToggle,
  setSelectServiceobjnew,
  selectserviceobjnew,
  clicked,
}) => {
  const { id } = useParams();

  // const [leadUser, setLeadUser] = useState(props.lead);

  // const [formData, setFormData] = useState({});

  //states for assigned packages
  const [errors, setErrors] = useState({});
  // const [servicelist, setServicelist] = useState({});

  const [userSelectedService, setUserSelectedService] = useState([]);
  const [newlySelectedService, setNewlySelectedService] = useState([]);
  // const [allserviceplanobj, setAllServiceplanobj] = useState([]);
  // const [allServicePlanObjCopy, setAllServicePlanObjCopy] = useState([]);
  const [resetfield, setResetfield] = useState(false);
  const [inputs, setInputs] = useState(initialValues);
  const [resetStatus, setResetStatus] = useState(false);
  // const [loaderSpinneer, setLoaderSpinner] = useState(false);

  const [alertModel, setAlertModel] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const taxtypeobj = {
    SHR: "Sharing",
    ISP: "ISP",
    FRAN: "Franchise",
    EXM: "Exempted",
    SEZ: "SEZ",
  };

  //removed tooltip by marieya

  useEffect(() => {
    if (lead) {
      let plans =
        lead.plans &&
        lead.plans.map((plan, index) => ({
          id: `${index}_${plan.plan}`,
          ...plan,
        }));

      setFormData((prev) => ({
        ...prev,
        address: {
          ...lead.address,
        },

        leadDetailsForInputs: { ...lead, plans },
      }));
    }
    setLeadUser(lead);
  }, [lead]);

  // useEffect(() => {
  //   franchiseaxios
  //     .get("franchise/display")
  //     // .then((res) => setData(res.data))
  //     .then((res) => {
  //       console.log(res);
  //       setLeadUser(res.data);
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
      setLeadUser((prev) => ({
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
      setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };
  const formattedData_gst_codes = lead?.gst_codes?.map((item) => item.id);

  const onSaveplans = (e, id) => {
    // if (e.key === "Enter" || e.key === "NumpadEnter") {
    e.preventDefault();
    let data = { ...formData, plans: formData.leadDetailsForInputs.plans };
    console.log(data, "i am data");
    delete data["leadDetailsForInputs"];

    let plandata = data.plans.map((item, index) => {
      delete item.total_plan_cost;
      delete item.plan_name;
      delete item.validity;
      delete item.id;
      return item;
    });
    data = { ...data, plans: plandata };

    let plans = [];
    for (const key in servicelist) {
      // if(!servicelist[key].disabled){
      if (servicelist[key].selected) {
        plans.push({
          plan: parseInt(key),
          isp_share: servicelist[key].isp_share,
          franchise_share: servicelist[key].franchise_share,
          tax_type: servicelist[key].tax_type,
        });
        if (servicelist[key].sub_plans) {
          if (servicelist[key].sub_plans.length != 0) {
            console.log("jj");
            for (const k in servicelist[key].sub_plans) {
              plans.push({
                plan: parseInt(servicelist[key].sub_plans[k].plan),
                isp_share: servicelist[key].isp_share,
                franchise_share: servicelist[key].franchise_share,
                tax_type: servicelist[key].tax_type,
              });
            }
          }
        }
      }
    }

    let submitdata = { ...data };
    if (plans.length > -1) {
      submitdata = { ...data, plans };
    }
    submitdata.gst_codes = formattedData_gst_codes;
    setLoaderSpinner(true);
    franchiseaxios
      .patch(`franchise/assign/franchise/plans/${id}`, submitdata)
      .then((res) => {
        console.log(res);
        setLoaderSpinner(false);
      })

      .catch((error) => {
        console.log("error");
        setLoaderSpinner(false);
        setErrorMsg(error.response.data["detail"]);
        setAlertModel(true);
        console.log(error.response.data["detail"]);
      });
  };

  const handleSubmit = (e, id) => {
    // if (e.key === "Enter" || e.key === "NumpadEnter") {
    e.preventDefault();
    setAlertModel(false);
    let data = { ...formData, plans: formData.leadDetailsForInputs.plans };
    console.log(data, "i am data");
    delete data["leadDetailsForInputs"];

    let plandata = data.plans.map((item, index) => {
      delete item.total_plan_cost;
      delete item.plan_name;
      delete item.validity;
      delete item.id;
      return item;
    });
    data = { ...data, plans: plandata };

    let plans = [];
    for (const key in servicelist) {
      // if(!servicelist[key].disabled){
      if (servicelist[key].selected) {
        plans.push({
          plan: parseInt(key),
          isp_share: servicelist[key].isp_share,
          franchise_share: servicelist[key].franchise_share,
          tax_type: servicelist[key].tax_type,
        });
      }
    }

    let submitdata = { ...data };
    if (plans.length > -1) {
      submitdata = { ...data, plans };
    }
    submitdata.gst_codes = formattedData_gst_codes;
    setLoaderSpinner(true);
    franchiseaxios
      .patch(`franchise/update/${id}`, submitdata)
      .then((res) => {
        setLoaderSpinner(false);
        console.log(res);
        console.log(res.data);
        onUpdate(res.data);
        toast.success("Franchise was edited successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        Allplanstoggle();
        setNewlySelectedService([]);
        setIsdisabled(true);
        setServicelist({});
      })
      .catch(function (error) {
        setLoaderSpinner(false);
        toast.error("Please fill all required fields", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        console.error("Something went wrong!", error);
      });
  };

  const handleSubmitedit = (e, id) => {
    // if (e.key === "Enter" || e.key === "NumpadEnter") {
    e.preventDefault();
    // .
    let data = { ...formData, plans: formData.leadDetailsForInputs.plans };
    console.log(data, "i am data");
    delete data["leadDetailsForInputs"];

    let plandata = data.plans.map((item, index) => {
      delete item.total_plan_cost;
      delete item.plan_name;
      delete item.validity;
      delete item.id;
      return item;
    });
    data = { ...data, plans: plandata };

    let plans = [];
    for (const key in servicelist) {
      // if(!servicelist[key].disabled){
      if (servicelist[key].selected) {
        plans.push({
          plan: parseInt(key),
          isp_share: servicelist[key].isp_share,
          franchise_share: servicelist[key].franchise_share,
          tax_type: servicelist[key].tax_type,
        });
      }
    }

    let submitdata = { ...data };
    if (plans.length > -1) {
      submitdata = { ...data, plans };
    }
    submitdata.gst_codes = formattedData_gst_codes;
    setLoaderSpinner(true);
    franchiseaxios
      .patch(`franchise/update/${id}`, submitdata)
      .then((res) => {
        setLoaderSpinner(false);
        console.log(res);
        console.log(res.data);
        onUpdate(res.data);
        toast.success("Franchise was edited successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        AnotherToggle();
        setNewlySelectedService([]);
        setIsdisabled(true);
        setServicelist({});
      })
      .catch(function (error) {
        setLoaderSpinner(false);
        toast.error("Please fill all required fields", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        console.error("Something went wrong!", error);
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
    const currentServiceList = { ...servicelist };
    for (const key in currentServiceList) {
      console.log(typeof key);
      console.log(typeof newlySelectedIDs[0]);
      if (newlySelectedIDs.includes(key)) {
        delete currentServiceList[key];
      }
    }
    console.log(currentServiceList);
    setServicelist({ ...currentServiceList });
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
  const handleCloseEdit = () => {
    AnotherToggle();
    const newlySelectedIDs = newlySelectedService.map((srvc) => srvc.id + "");
    console.log(newlySelectedIDs);
    setUserSelectedService(
      userSelectedService.filter((srvc) => !newlySelectedIDs.includes(srvc.id))
    );
    const currentServiceList = { ...servicelist };
    for (const key in currentServiceList) {
      console.log(typeof key);
      console.log(typeof newlySelectedIDs[0]);
      if (newlySelectedIDs.includes(key)) {
        delete currentServiceList[key];
      }
    }
    console.log(currentServiceList);
    setServicelist({ ...currentServiceList });
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
  const handleSave = () => {
    const servicelistKeys = Object.keys(servicelist);
    let e = [];
    servicelistKeys.forEach((key) => {
      const obj = servicelist[key];
      if (obj.selected) {
        InputFieldvalidate(`isp_share_${key}`, obj.isp_share);
        InputFieldvalidate(`franchise_share_${key}`, obj.franchise_share);
        if (!obj.isp_share || !obj.franchise_share) {
          e.push(true);
        }
        // InputFieldvalidate([`tax_type_${key}`,obj.tax_type])

        if (!obj.tax_type) {
          e.push(true);
          setErrors((prevState) => {
            return {
              ...prevState,
              [`tax_type_${key}`]: "Selection is required",
            };
          });
          // Sailaja Modified Validation message from Please Select to Selection is required on 4t March"
        } else {
          e.push(false);
          setErrors((prevState) => {
            return {
              ...prevState,
              [`tax_type_${key}`]: "",
            };
          });
        }
      }
    });

    if (
      !Object.values(errors).every((v) => v == "") ||
      !e.every((v) => v == false)
    ) {
      toast.error("Please fill all required fields");
    } else {
      const currentSelected = [...userSelectedService];
      const selectedPlansCurrent = currentSelected
        .map((current) => current.package_name)
        .join(",");
      setFormData((preState) => ({
        ...preState,
        plans: {
          ...preState.plans,
          revenue_sharing: selectedPlansCurrent,
        },
      }));
      Allplanstoggle();
      setNewlySelectedService([]);
      handleSubmit();
    }
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
  const handlesearchplan = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = allServicePlanObjCopy.filter((data) => {
      console.log(data);
      if (
        data.plan_cost.search(value) != -1 ||
        data.package_name.toLowerCase().search(value) != -1
      )
        return data;
    });
    setAllServiceplanobj(result);
  };

  const handlesearchassignedplan = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result =
      formData &&
      formData.leadDetailsForInputs &&
      formData.leadDetailsForInputs.plans.filter((data) => {
        console.log(data);
        if (
          data.package_name.toLowerCase().search(value) != -1 ||
          (data.plan_cost + "").toLowerCase().search(value) != -1
        )
          return data;
      });
    if (value) {
      setFormData((prevState) => {
        return {
          ...prevState,
          leadDetailsForInputs: {
            ...prevState.leadDetailsForInputs,
            plans: [...result],
          },
        };
      });
    } else {
      let plans =
        lead.plans &&
        lead.plans.map((plan, index) => ({
          id: `${index}_${plan.plan}`,
          ...plan,
        }));
      setFormData((prev) => ({
        ...prev,

        leadDetailsForInputs: { ...lead, plans },
      }));
    }
  };

  const searchInputField = useRef(null);

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
      let serviceListObj = servicelist[serviceId];
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
      setServicelist((prevState) => {
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

    if (name.includes("package_name")) {
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
        setServicelist((prevState) => {
          return {
            ...prevState,
            [serviceId]: {
              ...prevState[serviceId],
              selected: true,
            },
          };
        });
      } else {
        setServicelist((prevState) => {
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
  // const datasubmit = (e) => {
  //   e.preventDefault();
  //   servicesaxios
  //     .get("/plans/list")
  //     .then((res) => {
  //       setLoaderSpinner(false);
  //       console.log(res);
  //       console.log(res.data);
  //       let curServiceList = {};
  //       if (
  //         formData.leadDetailsForInputs &&
  //         formData.leadDetailsForInputs.plans
  //       ) {
  //         for (let i = 0; i < formData.leadDetailsForInputs.plans.length; i++) {
  //           curServiceList[formData.leadDetailsForInputs.plans[i].plan] = {
  //             ...formData.leadDetailsForInputs.plans[i],
  //             id: formData.leadDetailsForInputs.plans[i].plan,
  //             selected: true,
  //             disabled: true,
  //             existing: "selected",
  //           };
  //         }
  //         setServicelist({ ...curServiceList });
  //       }

  //       setAllServiceplanobj(res.data);
  //       setAllServicePlanObjCopy(res.data);
  //     })
  //     .catch(function (error) {
  //       setLoaderSpinner(false);
  //       toast.error("Something went wrong", {
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 1000,
  //       });
  //     });
  // };

  const getIsDisabled = (service) => {
    const currentObj = servicelist[service];
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
  return (
    <Fragment>
      {/* <i
        className="icofont icofont-edit"
        style={{ marginTop: "17%", marginLeft: "9%", position: "relative",color:"#1565c0" }}
        onClick={(e) => {
          setServicelist({})
          datasubmit(e);
          Allplanstoggle();
        }}
      ></i>{" "}
      &nbsp; */}
      {/* <p style={{ marginTop: "-13px", marginLeft: "120px",fontWeight:600 }}>
        {" "}
        Add/Remove plans
      </p> */}
      <Button
        style={{
          marginTop: "-13px",
          marginLeft: "120px",
          fontWeight: 600,
          marginBottom: "15px",
        }}
        color="primary"
        className="save_button"
        id="save_button_loader"
        onClick={(e) => {
          setServicelist({});
          datasubmit(e);
          Allplanstoggle();
        }}
      >
        {"Add/Remove plans"}
      </Button>
      {/*modal for plan*/}
      {/* new modal */}
      <Modal
        isOpen={selectserviceobj}
        toggle={Allplanstoggle}
        centered
        style={{ maxWidth: "1000px" }}
      >
        <ModalBody style={{ maxHeight: "400px", overflow: "auto" }}>
          <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }}>
            <Paper
              component="div"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 400,
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                inputProps={{ "aria-label": "search google maps" }}
                placeholder="Search for Plan or Enter Amount"
                // Sailaja Added capitalize each work as per QA Team advice on 6th March
                onChange={(event) => handlesearchplan(event)}
              />
              <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          </Stack>

          <Table className="table-border-vertical">
            <thead>
              <tr>
                <th scope="col">{"Package Name"}</th>
                <th scope="col" style={{ width: "22%" }}>
                  {"Validity / Plan Costt"}
                </th>
                <th scope="col" style={{ width: "17%" }}>
                  {"Tax"}
                </th>
                <th scope="col">{"ISP Sharing (%)"}</th>
                <th scope="col">{"Franchise Sharing (%)"}</th>
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
                            servicelist[services.id] &&
                            servicelist[services.id].selected
                          }
                          name={`package_name_${services.id}`}
                          // disabled={
                          //   servicelist[services.id] &&
                          //   servicelist[services.id].disabled
                          // }
                          onChange={(e) =>
                            handleInputChange(e, false, services.id)
                          }
                        />
                        {services.package_name}
                      </Label>
                    </>
                  </td>
                  <td style={{ paddingTop: "0px" }}>
                    <tr>
                      <td>
                        {services &&
                          services.time_unit &&
                          parseFloat(services.time_unit).toFixed(0) +
                            " " +
                            services.unit_type +
                            "(s)"}{" "}
                        {services &&
                          services.sub_plans &&
                          services.sub_plans.map((user) => {
                            return (
                              <div>
                                {" "}
                                {parseFloat(user.time_unit).toFixed(0) +
                                  " " +
                                  user.unit_type +
                                  "(s)"}
                              </div>
                            );
                          })}
                      </td>

                      <td>
                        {" "}
                        ₹ {parseFloat(services.total_plan_cost).toFixed(2)}
                        {services &&
                          services.sub_plans &&
                          services.sub_plans.map((user) => {
                            return (
                              <div>
                                {" "}
                                ₹ {parseFloat(user.total_plan_cost).toFixed(2)}
                              </div>
                            );
                          })}
                      </td>
                    </tr>
                  </td>

                  <td>
                    <FormGroup>
                      <div className="input_wrap">
                        <Input
                          type="select"
                          name={`tax_type_${services.id}`}
                          className={`form-control digits ${
                            servicelist &&
                            servicelist[services.id] &&
                            servicelist[services.id].tax_type
                              ? "not-empty"
                              : "not-empty"
                          }`}
                          onChange={(e) =>
                            handleInputChange(e, false, services.id)
                          }
                          value={
                            servicelist &&
                            servicelist[services.id] &&
                            servicelist[services.id].tax_type
                          }
                          onBlur={checkEmptyValue}
                          disabled={getIsDisabled(services.id)}
                        >
                          {/* Sailaja sorting the Franchise Module -> New Panel -> Revenue Sharing * -> Tax * Dropdown data as alphabetical order on 28th March 2023 */}

                          <option style={{ display: "none" }}></option>
                          <option value="EXM">Exempted</option>
                          <option value="FRAN">Franchise</option>
                          <option value="ISP">ISP</option>
                          <option value="SEZ">SEZ</option>
                          <option value="SHR">Sharing</option>
                        </Input>
                        <Label className="kyc_label">TAX *</Label>
                        <span className="errortext">
                          {errors[`tax_type_${services.id}`]}
                        </span>
                      </div>
                    </FormGroup>
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
                          servicelist &&
                          servicelist[services.id] &&
                          servicelist[services.id].isp_share
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
                          servicelist &&
                          servicelist[services.id] &&
                          servicelist[services.id].franchise_share
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
            id="save_button_loader"
            onClick={(e) => {
              onSaveplans(e, lead.id);

              // setAlertModel(true);
            }}
            disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
            // disabled={true}
          >
            {loaderSpinneer ? <Spinner size="sm"> </Spinner> : null} &nbsp;
            {"Save"}
          </Button>
        </ModalFooter>
        <Modal isOpen={alertModel} centered>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalBody>
            <p>{errorMsg}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setAlertModel(false)}>
              Back
            </Button>
            {errorMsg !== "No changes were requested for franchise plans" && (
              <Button color="primary" onClick={(e) => handleSubmit(e, lead.id)}>
                Yes
              </Button>
            )}
          </ModalFooter>
        </Modal>
      </Modal>

      <Modal
        isOpen={selectserviceobjnew}
        toggle={AnotherToggle}
        centered
        style={{ maxWidth: "1000px" }}
      >
        <ModalBody style={{ maxHeight: "400px", overflow: "auto" }}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ flex: 1 }}
          ></Stack>
          <div
            style={{ textAlign: "center", color: "black", fontSize: "1.5em" }}
          >
            <h5 style={{ textAlign: "center !important" }}>Edit Plans</h5>
          </div>
          <Table className="table-border-vertical">
            <thead>
              <tr>
                <th scope="col">{"Package Name"}</th>
                <th scope="col" style={{ width: "22%" }}>
                  {"Validity / Plan Cost"}
                </th>
                <th scope="col" style={{ width: "17%" }}>
                  {"Tax"}
                </th>
                <th scope="col">{"ISP Sharing (%)"}</th>
                <th scope="col">{"Franchise Sharing (%)"}</th>
              </tr>
            </thead>
            <tbody>
              {allserviceplanobj
                .filter(
                  (service) =>
                    servicelist[service.id] && servicelist[service.id].selected
                )
                .map((services) => (
                  <tr>
                    {/* <td scope="row">
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
                            servicelist[services.id] &&
                            servicelist[services.id].selected
                          }
                          name={`package_name_${services.id}`}
                          // disabled={
                          //   servicelist[services.id] &&
                          //   servicelist[services.id].disabled
                          // }
                          onChange={(e) =>
                            handleInputChange(e, false, services.id)
                          }
                        />
                        {services.package_name}
                      </Label>
                    </>
                  </td> */}
                    <td scope="row">{services.package_name}</td>
                    <td>
                      <tr>
                        <td>
                          {services &&
                            services.time_unit &&
                            parseFloat(services.time_unit).toFixed(0) +
                              " " +
                              services.unit_type +
                              "(s)"}{" "}
                          {services &&
                            services.sub_plans &&
                            services.sub_plans.map((user) => {
                              return (
                                <div>
                                  {" "}
                                  {parseFloat(user.time_unit).toFixed(0) +
                                    " " +
                                    user.unit_type +
                                    "(s)"}
                                </div>
                              );
                            })}
                        </td>

                        <td>
                          {" "}
                          ₹ {parseFloat(services.plan_cost).toFixed(2)}
                          {services &&
                            services.sub_plans &&
                            services.sub_plans.map((user) => {
                              return (
                                <div>
                                  {" "}
                                  ₹{" "}
                                  {parseFloat(user.total_plan_cost).toFixed(2)}
                                </div>
                              );
                            })}
                        </td>
                      </tr>
                    </td>

                    <td>
                      <FormGroup>
                        <div className="input_wrap">
                          <Input
                            type="select"
                            name={`tax_type_${services.id}`}
                            className={`form-control digits ${
                              servicelist &&
                              servicelist[services.id] &&
                              servicelist[services.id].tax_type
                                ? "not-empty"
                                : "not-empty"
                            }`}
                            onChange={(e) =>
                              handleInputChange(e, false, services.id)
                            }
                            value={
                              servicelist &&
                              servicelist[services.id] &&
                              servicelist[services.id].tax_type
                            }
                            onBlur={checkEmptyValue}
                            // disabled={getIsDisabled(services.id)}/
                            disabled={isDisabled}
                          >
                            {/* Sailaja sorting the Franchise Module -> New Panel -> Revenue Sharing * -> Tax * Dropdown data as alphabetical order on 28th March 2023 */}

                            <option style={{ display: "none" }}></option>
                            <option value="EXM">Exempted</option>
                            <option value="FRAN">Franchise</option>
                            <option value="ISP">ISP</option>
                            <option value="SEZ">SEZ</option>
                            <option value="SHR">Sharing</option>
                          </Input>
                          <Label className="kyc_label">TAX *</Label>
                          <span className="errortext">
                            {errors[`tax_type_${services.id}`]}
                          </span>
                        </div>
                      </FormGroup>
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
                            servicelist &&
                            servicelist[services.id] &&
                            servicelist[services.id].isp_share
                          }
                          type="number"
                          disabled={isDisabled}
                          // disabled={getIsDisabled(services.id)}
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
                            servicelist &&
                            servicelist[services.id] &&
                            servicelist[services.id].franchise_share
                          }
                          type="number"
                          disabled={isDisabled}
                          // disabled={getIsDisabled(services.id)}
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
              handleCloseEdit();
            }}
            id="resetid"
          >
            {"Cancel"}
          </Button>
          <Button
            color="primary"
            className="save_button"
            id="save_button_loader"
            onClick={(e) => {
              handleSubmitedit(e, lead.id);
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
        <div>
          <input
            className="form-control"
            type="text"
            placeholder="Search for Plan or Enter Amount"
            // Sailaja Added capitalize each work as per QA Team advice on 6th March
            onChange={(event) => handlesearchassignedplan(event)}
            ref={searchInputField}
            style={{
              border: "1px solid #ced4da",
              backgroundColor: "white",
              width: "50%",
            }}
          />
          {/* <Search className="search-icon" /> */}
        </div>
        <Form
          onSubmit={(e) => {
            handleSubmit(e, lead.id);
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
                    {"Plan Name"}
                  </th>
                  <th scope="col" style={{ width: "30%" }}>
                    {"Validity/Plan Cost"}
                  </th>
                  <th scope="col" style={{ width: "22%" }}>
                    {"Tax"}
                  </th>
                  <th scope="col">{"ISP Sharing"}</th>
                  <th scope="col">{"Franchise Sharing"}</th>
                </tr>
              </thead>
              <tbody>
                {formData.leadDetailsForInputs &&
                  formData.leadDetailsForInputs.plans &&
                  formData.leadDetailsForInputs.plans.map((plan, index) => {
                    return (
                      <tr>
                        <td scope="row" style={{ width: "43%" }}>
                          {/* <Tooltip title={plan && plan.package_name}> */}
                          <FormGroup>
                            <div className="input_wrap">
                              <input
                                className={`form-control digits not-empty`}
                                id="afterfocus"
                                type="text"
                                name="plan_name"
                                style={{ border: "none", outline: "none" }}
                                value={plan.package_name}
                                onChange={handleChange}
                                // onBlur={blur}
                                disabled={true}
                              ></input>
                            </div>
                          </FormGroup>
                          {/* </Tooltip> */}
                        </td>

                        <td style={{ paddingTop: "0px" }}>
                          <tr>
                            <td>
                              {plan &&
                                plan.time_unit &&
                                parseFloat(plan.time_unit).toFixed(0) +
                                  " " +
                                  plan.unit_type +
                                  "(s)"}{" "}
                              {plan &&
                                plan.sub_plans &&
                                plan.sub_plans.map((user) => {
                                  return (
                                    <div>
                                      {" "}
                                      {parseFloat(user.time_unit).toFixed(0) +
                                        " " +
                                        user.unit_type +
                                        "(s)"}
                                    </div>
                                  );
                                })}
                            </td>

                            <td>
                              {" "}
                              ₹ {parseFloat(plan.plan_cost).toFixed(2)}
                              {plan &&
                                plan.sub_plans &&
                                plan.sub_plans.map((user) => {
                                  return (
                                    <div>
                                      {" "}
                                      ₹ {parseFloat(user.plan_cost).toFixed(2)}
                                    </div>
                                  );
                                })}
                            </td>
                          </tr>
                        </td>

                        {/* <td scope="row">
                          <FormGroup>
                            <div className="input_wrap">
                              <input
                                className={`form-control digits not-empty`}
                                id="afterfocus"
                                type="text"
                                name="time_unit"
                                style={{ border: "none", outline: "none" }}
                                value={plan.time_unit + "" + plan.unit_type}
                                onChange={handleChange}
                                // onBlur={blur}
                                disabled={true}
                              ></input>
                            </div>
                          </FormGroup>
                        </td> */}
                        <td scope="row">
                          <FormGroup>
                            <div className="input_wrap">
                              <Input
                                type="select"
                                name="tax_typeedit"
                                className={`form-control digits ${
                                  plan.tax_type ? "not-empty" : ""
                                }`}
                                onChange={(e) => handleChange(e, plan.id)}
                                value={plan.tax_type}
                                //  onBlur={blur}
                                disabled={true}
                              >
                                <option style={{ display: "none" }}></option>
                                <option value="SHR">Sharing</option>
                                <option value="ISP">ISP</option>
                                <option value="FRAN">Franchise</option>
                                <option value="EXM">Exempted</option>
                                <option value="SEZ">SEZ</option>
                              </Input>
                              {/* <input
                                className={`form-control digits not-empty`}
                                id="afterfocus"
                                type="text"
                                name="tax_type"
                                style={{ border: "none", outline: "none" }}
                                value={plan.tax_type}
                                onChange={(e) => handleChange(e, plan.id)}
                                // onBlur={blur}
                                disabled={props.isDisabled}
                              ></input> */}
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
                                value={plan.isp_share}
                                onChange={(e) => handleChange(e, plan.id)}
                                // onBlur={blur}
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
                                onChange={(e) => handleChange(e, plan.id)}
                                // onBlur={blur}
                                disabled={true}
                              ></input>
                            </div>
                          </FormGroup>
                        </td>
                        {/* <td scope="row">
                          <FormGroup>
                            <div className="input_wrap">
                              <input
                                className={`form-control digits not-empty`}
                                id="afterfocus"
                                type="text"
                                name="total_plan_cost"
                                style={{ border: "none", outline: "none" }}
                                value={`₹` + plan.total_plan_cost}
                                onChange={handleChange}
                                // onBlur={blur}
                                disabled={true}
                              ></input>
                            </div>
                          </FormGroup>
                        </td> */}
                      </tr>
                    );
                  })}

                {/* ))} */}
              </tbody>
            </Table>
          </Row>

          <br />

          {/* <Row>
            <Col sm="4">
              <button
                type="submit"
                name="submit"
                class="btn btn-primary"
                id="save_button_loader"
                onClick={handleSave}
                disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
              >
                {loaderSpinneer ? <Spinner size="sm"> </Spinner> : null} &nbsp;
                Save
              </button>
            </Col>
          </Row> */}
        </Form>
      </Container>
    </Fragment>
  );
};

export default AssignedPackage;
