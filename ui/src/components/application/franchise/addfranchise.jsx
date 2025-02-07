import React, { Fragment, useState, useRef, useEffect } from "react";
import {
  Container, Row, Col, Form, FormGroup, Label, Input, Button, Modal, ModalFooter, ModalBody, Table,
  Spinner
} from "reactstrap";
import { franchiseaxios, adminaxios, servicesaxios } from "../../../axios";
import { toast } from "react-toastify";
import { Search } from "../../../constant";
import { Add } from "../../../constant";
import useFormValidation from "../../customhooks/FormValidation";
import AddressComponent from "../../common/AddressComponent";
import Multiselect from "./multiselectcheckbox";
import { isEmpty } from 'lodash';
import { nasType } from "../project/nas/nasdropdown";
import GstCodes from "./GstCodes"
// Sailaja imported common component Sorting on 28th March 2023
import { Sorting } from "../../common/Sorting";

// adding fanchise
const AddFranchise = (props, initialValues) => {
  const [resetStatus, setResetStatus] = useState(false);
  const [franchiseStatus, setFranchiseStatus] = useState([]);
  const [franchiseType, setFranchiseType] = useState([]);
  const [franchiseSMS, setFranchiseSMS] = useState([]);
  const [franchiseRole, setFranchiseRole] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  //service package list from api
  const [servicelist, setServicelist] = useState({});
  const [allserviceplanobj, setAllServiceplanobj] = useState([]);
  const [allServicePlanObjCopy, setAllServicePlanObjCopy] = useState([]);
  const [franchiseInfo, setFranchiseInfo] = useState({});
  const Allplanstoggle = () => {
    setSelectServiceobj(!selectserviceobj);
  };
  // sms toggle
  const [smsToggle, setSmsToggle] = useState("on");
  const [istelShow, setTelIsShow] = React.useState(true);
  function SMSToggle() {
    setSmsToggle(smsToggle === "on" ? "off" : "on");
    setTelIsShow(!istelShow);
  }
  // email toggle
  const [emailToggle, setEmailToggle] = useState('on');
  const [isShow, setIsshow] = React.useState(true);
  function EmailToggle() {
    setEmailToggle(emailToggle === "on" ? "off" : "on");
    setIsshow(!isShow)
  }

  const [whatsappToggle, setWhatsappToggle] = useState("on");
  const [iswhatsShow, setWhatsIsShow] = React.useState(true);
  function WHATSAPPToggle() {
    setWhatsappToggle(whatsappToggle === "on" ? "off" : "on");
    setWhatsIsShow(!iswhatsShow);
  }
  const [selectserviceobj, setSelectServiceobj] = useState();
  //state for getting area,zone
  const [arealist, setArealist] = useState([]);

  const [formData, setFormData] = useState({
    user: "",
    googleAddress: "",

  });

  console.log(formData, "formData1")
  const [userSelectedService, setUserSelectedService] = useState([]);
  const [newlySelectedService, setNewlySelectedService] = useState([]);

  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [branch, setBranch] = useState([]);
  //
  const [resetfield, setResetfield] = useState(false);
  const [loaderSpinneer, setLoaderSpinner] = useState(false)

  //area and zone state
  const [areazone, setAreaZone] = useState([]);
  const [gstCode, setGstCode] = React.useState([])
  const [selgstcode, setSelectedGstCodes] = useState([]);

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

    // if (target.type === "checkbox" && name.includes("package_name")) {
    //   if (target.checked) {
    //     setServicelist((prevState) => {
    //       return {
    //         ...prevState,
    //         [serviceId]: {},
    //       };
    //     });
    //   } else {
    //     const sl = {...servicelist};
    //     delete sl[serviceId];
    //     setServicelist(sl);
    //   }
    // }
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
        [name]: value.charAt(0).toUpperCase() + value.slice(1),
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
              selected: true,
            },
          };
        });
      } else {
        setServicelist((prevState) => {
          return {
            ...prevState,
            [serviceId]: {
              selected: false,
              isp_share: "",
              franchise_share: "",
              tax_type: "",
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

    //upon select branch display zone
    if (name == "branch") {
      // getZonebyBranch(value);
      displayZone(value);
    }

    //upon select zone display area
    if (name == "zone") {
      getAreabyZone(value);
    }
  };

  const addFranchise = (e) => {
    setLoaderSpinner(true);
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let address = {
      // house_no: formData["house_no"],
      house_no: !isEmpty(formData.house_no) ? formData.house_no : "N/A",
      city: formData["city"],
      landmark: formData["landmark"],
      country: formData["country"],
      street: formData["street"],
      district: formData["district"],
      pincode: formData["pincode"],
      state: formData["state"],
      latitude: formData["latitude"],
      longitude: formData["longitude"],

    };

    formData.address = { ...address };

    let plans = [];
    for (const key in servicelist) {
      plans.push({
        plan: key,
        isp_share: servicelist[key].isp_share,
        franchise_share: servicelist[key].franchise_share,
        tax_type:
          servicelist[key].tax_type === "Sharing"
            ? servicelist[key].franchise_share
            : servicelist[key].tax_type,
      });
    }
    delete formData.plans;
    delete formData.ippools;
    delete formData.googleAddress;
    delete formData.ippools;
    let submitdata = { ...formData };
    console.log(submitdata,"formData123")
    if (plans.length > 0) {
      submitdata = { ...formData, plans };
    }

    const tokenInfo = JSON.parse(localStorage.getItem("token"));
    submitdata.branch = submitdata.branch;
    if (tokenInfo && tokenInfo.user_type === "Branch Owner") {
      submitdata.branch = tokenInfo.branch.id;
    }
    submitdata.sms = istelShow;
    submitdata.email = isShow;
    submitdata.whatsapp_flag=iswhatsShow;
    // submitdata.franchise_wallet_limit =  submitdata.franchise_wallet_limit ?  submitdata.franchise_wallet_limit : null; 
    // submitdata.customer_wallet_limit = submitdata.customer_wallet_limit ? submitdata.customer_wallet_limit : null;
    const andhraPradeshId = gstCode.find(item => item.name === "Andhra Pradesh")?.id;
// console.log(andhraPradeshId,"andhraPradeshId")
submitdata.gst_codes = submitdata.gst_codes ? submitdata.gst_codes : [andhraPradeshId]; 
// console.log(andhraPradeshId,"andhraPradeshId12")

    // submitdata.gst_codes = submitdata.gst_codes ? submitdata.gst_codes : inputs.gstCode;
    // submitdata.sms_gateway_type = submitdata.sms_gateway_type ? submitdata.sms_gateway_type : null;
    // submitdata.shifting_charges = submitdata.shifting_charges ? submitdata.shifting_charges : null;
   console.log(submitdata,"submitdata")
   console.log(submitdata,"formData")
    // submitdata.gst_codes = branchdata.valueWithoutKey;
    // ;
    franchiseaxios
    // gstCode
      .post(`franchise/create`, submitdata, config)
      .then((response) => {
        console.log(response.data);
        let responsedata = { ...response.data };

        let branchobj = JSON.parse(localStorage.getItem("token")).branch?.id;
        responsedata.status = branchobj;

        let statusobj = franchiseStatus.find((s) => s.id == formData.status);
        responsedata.status = statusobj;

        let typeobj = franchiseType.find((s) => s.id == formData.type);
        responsedata.type = typeobj;

        let smsobj = franchiseSMS.find(
          (s) => s.id == formData.sms_gateway_type
        );
        responsedata.sms_gateway_type = smsobj;

        let roleobj = franchiseRole.find((s) => s.id == formData.role);
        responsedata.role = roleobj;

        props.onUpdate(responsedata);
        toast.success("Franchise was added successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        resetformmanually();
        setLoaderSpinner(false);
        props.dataClose()

      })
      .catch(function (error) {
        setLoaderSpinner(false);
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        }
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      });
  };

  const submit = (e) => {
    let dataNew = { ...formData };
    dataNew.franc_name = formData.name;
    dataNew.franchise_code = formData.code;
    e.preventDefault();
    e = e.target.name;

    console.log(formData,"checkdata");

    const validationErrors = validate(dataNew);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      console.log(inputs);
      addFranchise();
      // setServicelist({});
    } else {
      console.log("errors try again", validationErrors);
    }
  };

  const requiredFields = [
    "user",
    "areas",
    // "name",
    "franc_name",
    "code",
    "type",
    "house_no",
    "latitude",
    "longitude",
    "landmark",
    "street",
    "district",
    "pincode",
    "state",
    "country",
    "city",
    // "branch",
    "status",
    "sms_gateway_type",
    'nas_type',
    // "plans",
    'invoice_code',
    "franchise_code",
    "type",
    // "gst_codes",
    // "revenue_sharing",
    // "shifting_charges",
    // 'franchise_wallet_limit',
    // 'customer_wallet_limit',

  ];

  const { validate } = useFormValidation(requiredFields);

  const resetformmanually = () => {
    setResetfield(true);
    setFormData({
      name: "",
      user: "",
      code: "",
      branch: "",
      areas: "",
      type: "",
      house_no: "",
      street: "",
      district: "",
      pincode: "",
      state: "",
      country: "",
      status: "",
      landmark: "",
      sms_gateway_type: "",
      franchise_wallet_limit : "",
      customer_wallet_limit :"",
      googleAddress: "",
      plans: "",
      city: "",
      nas_type: '',
      invoice_code: "",
    });
    document.getElementById("resetid").click();
  };

  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
    }
    // draft
    // setFormData(props.lead);
    setFormData((preState) => ({
      ...preState,
      ...props.lead,
    }));
  }, [props.rightSidebar]);

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  // const resetInputField = () => {};
  const resetForm = function () {
    setResetStatus(true);

    setResetfield(true);

    setInputs((inputs) => {
      var obj = {};
      for (var name in inputs) {
        obj[name] = "";
      }
      return obj;
    });
    setErrors({});
  };

  const form = useRef(null);

  //dynamic options
  useEffect(() => {
    //franchiselist
    adminaxios
      .get("/franchise/options")
      .then((res) => {
        let { status, type, sms, role } = res.data;
        // setFranchiseStatus([...status]);
        // Sailaja sorting the Franchise Module -> New Panel-> Status  * Dropdown data as alphabetical order on 28th March 2023
        setFranchiseStatus(Sorting(([...status]), 'name'));
        // setFranchiseType([...type]);
        // Sailaja sorting the Franchise Module -> New Panel-> Type  * Dropdown data as alphabetical order on 28th March 2023
        setFranchiseType(Sorting(([...type]), 'name'));
        // setFranchiseSMS([...sms]);
        // Sailaja sorting the Franchise Module -> New Panel-> SMS Gateway * Dropdown data as alphabetical order on 28th March 2023
        setFranchiseSMS(Sorting(([...sms]), 'name'));
        setFranchiseRole([...role]);
        // setIsloaded(1);
      })
      .catch((err) => console.log(err));

    adminaxios
      .get("accounts/options/all")
      .then((res) => {
        let { role_wise_users } = res.data;
        // setAssignedTo([...role_wise_users.franchise_owners]);
        // Sailaja sorting the Franchise Module -> New Panel-> User * Dropdown data as alphabetical order on 28th March 2023
        setAssignedTo(Sorting(([...role_wise_users.franchise_owners]), 'username'));
      })
      .catch((err) => console.log(err));
  }, []);

  // branch api
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
         // setBranch([...res.data]);
        // Sailaja sorting the Franchise Module-> Add Franchise ->Branch  Dropdown data as alphabetical order on 28th March 2023
        setBranch(Sorting(([...res.data]),'name'))
            })
      .catch((error) => console.log(error));
  }, []);

  //get area options based on zone
  const getAreabyZone = (val) => {
    adminaxios
      .get(`accounts/zone/${val}/areas`)
      .then((response) => {
        console.log(response.data);
        setAreaZone(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };
  //integrate api for zone and area
  const displayZone = (id) => {
    adminaxios
      .get(`accounts/franchise/add/${id}/zones/areas`)
      .then((res) => {
        setArealist([...res.data]);
      })
      .catch((error) => console.log(error));
  };

  // service api
  const datasubmit = (e) => {
    e.preventDefault();
    servicesaxios
      .get("/plans/list ")
      .then((res) => {
        console.log(res);
        console.log(res.data);
        setAllServiceplanobj(res.data);
        setAllServicePlanObjCopy(res.data);
      })
      .catch(function (error) {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      });
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

  const searchInputField = useRef(null);

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
    setAllServiceplanobj([]);
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
              // Sailaja Modified Validation message from Please Select to Selection is required on 4t March"
            };
          });
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
      return;
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
    }
    setAllServiceplanobj([]);
  };

  // validation for tax_type
  const InputFieldvalidate = (name, value) => {
    if (value > 100) {
      setErrors((prevState) => {
        return {
          ...prevState,
          [name]: "Enter value below 100",
        };
      });
    } else if (!/^[0-9]\d{0,9}(\.\d{1,3})?%?$/.test(value)) {
      {
        setErrors((prevState) => {
          return {
            ...prevState,
            [name]: "Enter valid value",
          };
        });
      }
    } else if (!value) {
      setErrors((prevState) => {
        return {
          ...prevState,
          [name]: "Enter valid value",
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

  useEffect(() => {
    const franchiseDetails = JSON.parse(localStorage.getItem("token"));
    if (franchiseDetails) {
      setFranchiseInfo({ ...franchiseDetails });
      displayZone(franchiseDetails.branch?.id);
    }
  }, []);

  const tokenInfo = JSON.parse(localStorage.getItem("token"));
  let Branhcshow = false;
  if (tokenInfo && tokenInfo.user_type === "Branch Owner") {
    Branhcshow = true;
  }

  useEffect(() => {
    franchiseaxios
      .get('franchise/dropdown/gst')
      .then((res) => {
        setGstCode([...res.data]);
      })
  }, [])


  return (
    <Fragment>
      <Container fluid={true}>
        <Row className="form_layout">
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              <Row>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">
                        Franchise Name *
                      </Label>
                      <Input
                        style={{ textTransform: "capitalize" }}
                        name="name"
                        type="text"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        // draft
                        className={`form-control digits ${formData && formData.name ? "" : "not-empty"
                          }`}
                      />

                    </div>
                    <span className="errortext">{errors.franc_name}</span>
                  </FormGroup>
                </Col>

                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Type *</Label>
                      <Input
                        type="select"
                        name="type"
                        className={`form-control digits ${formData && formData.type ? "not-empty" : ""
                          }`}
                        onBlur={checkEmptyValue}
                        onChange={handleInputChange}
                        value={formData && formData.type}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        {franchiseType.map((franchisetype) => (
                          <option value={franchisetype.id}>
                            {franchisetype.name}
                          </option>
                        ))}
                      </Input>
                    </div>
                    <span className="errortext">
                      {errors.type && "Selection is required"}
                    </span>
                  </FormGroup>
                </Col>

                {Branhcshow ? (
                  <Col sm="3">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">Branch *</Label>
                        <Input
                          type="select"
                          name="branch"
                          className="form-control not-empty"
                          onBlur={checkEmptyValue}
                          onChange={handleInputChange}
                          disabled={true}
                        >
                          <option
                            value={
                              franchiseInfo &&
                              franchiseInfo.branch &&
                              franchiseInfo.branch.id
                            }
                          >
                            {franchiseInfo &&
                              franchiseInfo.branch &&
                              franchiseInfo.branch.name}
                          </option>

                        </Input>

                      </div>
                    </FormGroup>
                  </Col>
                ) : (
                  <Col sm="3">
                    <FormGroup>
                      <div className="input_wrap">
                        <Label className="kyc_label">Branch *</Label>
                        <Input
                          type="select"
                          name="branch"
                          className="form-control not-empty"
                          onBlur={checkEmptyValue}
                          onChange={handleInputChange}
                          // disabled={true}
                          value={formData && formData.branch}
                        >
                          <option style={{ display: "none" }}></option>
                          {branch.map((types) => (
                            <option key={types.id} value={types.id}>
                              {types.name}
                            </option>
                          ))}
                        </Input>

                        <span className="errortext">{errors.branch && "Selection is required"}</span>
                      </div>

                    </FormGroup>
                  </Col>
                )}

                <Col sm="3">
                  <FormGroup>
                    <Label className="kyc_label">Select Zone & Area *</Label>
                    <Multiselect
                      arealist={arealist}
                      setFormData={setFormData}
                      resetfield={resetfield}
                      setResetfield={setResetfield}
                    />
                    {/* Sailaja modified msg as Selection is required on 4th March 2023*/}
                    <span className="errortext">{errors.areas && "Selection is required"}</span>
                  </FormGroup>
                </Col>

                <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">
                        SMS Gateway *
                      </Label>
                      <Input
                        type="select"
                        name="sms_gateway_type"
                        className="form-control digits"
                        onBlur={checkEmptyValue}
                        onChange={handleInputChange}
                        value={formData && formData.sms_gateway_type}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        {franchiseSMS.map((franchisesms) => (
                          <option value={franchisesms.id}>
                            {franchisesms.name}
                          </option>
                        ))}
                      </Input>
                      {/* Sailaja modified msg as Selection is required */}
                    </div>
                    <span className="errortext">
                      {errors.sms_gateway_type && "Selection is required"}
                    </span>
                  </FormGroup>
                </Col>
                <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Status *</Label>
                      <Input
                        type="select"
                        name="status"
                        className="form-control digits"
                        onBlur={checkEmptyValue}
                        onChange={handleInputChange}
                        value={formData && formData.status}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        {franchiseStatus.map((franchiseStatus) => (
                          <option
                            key={franchiseStatus.id}
                            value={franchiseStatus.id}
                          >
                            {franchiseStatus.name}
                          </option>
                        ))}
                      </Input>
                    </div>
                    <span className="errortext">
                      {errors.status && "Selection is required"}
                    </span>
                  </FormGroup>
                </Col>


                <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">
                        Revenue Sharing *
                      </Label>
                      <Input
                        name="plans"
                        // draft
                        className={`form-control digits not-empty ${formData &&
                          formData.plans &&
                          formData.plans.revenue_sharing
                          ? "not-empty"
                          : ""
                          }`}
                        value={
                          formData &&
                          formData.plans &&
                          formData.plans.revenue_sharing
                        }
                        type=""
                        onBlur={checkEmptyValue}
                        allserviceplanobj={allserviceplanobj}
                        onClick={(e) => {
                          datasubmit(e);
                          Allplanstoggle();
                        }}
                      />
                      {/* Sailaja added validation mesage on 4th March 2023 */}
                      <span className="errortext">
                        {errors.revenue_sharing && "Field is required"}
                      </span>

                    </div>
                  </FormGroup>
                </Col>

                <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">User *</Label>
                      <Input
                        type="select"
                        name="user"
                        // draft
                        className={`form-control digits ${formData && formData.user ? "" : "not-empty"
                          }`}
                        // value={formData && formData.user}
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{ display: "none" }}></option>
                        {assignedTo.map((assignedto) => (
                          <option key={assignedto.id} value={assignedto.id}>
                            {assignedto.username}
                          </option>
                        ))}
                      </Input>

                    </div>
                    <span className="errortext">
                      {errors.user && "Selection is required"}
                    </span>
                  </FormGroup>
                </Col>
                <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">
                        Franchise Code *
                      </Label>
                      <Input
                        name="code"
                        // draft
                        className={`form-control digits ${formData && formData.code ? "" : "not-empty"
                          }`}
                        type="text"
                        onBlur={checkEmptyValue}
                        onChange={handleInputChange}
                      />

                    </div>
                    <span className="errortext">{errors.franchise_code}</span>
                  </FormGroup>
                </Col>
                <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">
                        Invoice Code *
                      </Label>
                      <Input
                        name="invoice_code"
                        onInput={(e) => e.target.value = ("" + e.target.value).toUpperCase()}
                        // draft
                        className={`form-control digits ${formData && formData.invoice_code ? "" : "not-empty"
                          }`}
                        style={{ textTransform: "capitalize" }}
                        type="text"
                        onBlur={checkEmptyValue}
                        onChange={handleInputChange}
                      />
                      <span className="errortext">{errors.invoice_code}</span>
                    </div>
                  </FormGroup>
                </Col>

                <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Franchise NAS Type *</Label>
                      <Input
                        type="select"
                        name="nas_type"
                        className={`form-control digits ${formData && formData.nas_type ? 'not-empty' : ''}`}
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        value={formData && formData.nas_type}
                      >
                        <option value="" style={{ display: "none" }}></option>

                        {nasType.map((nasedType) => {
                          return (
                            <option value={nasedType.id}>{nasedType.name}</option>
                          );
                        })}
                      </Input>
                    </div>
                    <span className="errortext">{errors.nas_type && "Selection is required"}</span>
                  </FormGroup>
                </Col>
                <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Shifting Charges  </Label>
                      <Input
                        style={{ textTransform: "capitalize" }}
                        name="shifting_charges"
                        type="number"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        min="0"
                        // onKeyDown={(evt) =>
                        //   (evt.key === "e" ||
                        //     evt.key === "E" ||
                        //     evt.key === "." ||
                        //     evt.key === "-") &&
                        //   evt.preventDefault()
                        // }
                        onKeyDown={(evt) => {
                          if (evt.target.value === "" && evt.key === "0") {
                            evt.preventDefault();
                          }
                          if (
                            evt.key === "e" ||
                            evt.key === "E" ||
                            evt.key === "." ||
                            evt.key === "-" ||
                            (evt.key === "0" && evt.target.value === "0")
                          ) {
                            evt.preventDefault();
                          }
                        }}
                        // draft
                        className={`form-control digits ${formData && formData.shifting_charges ? "" : "not-empty"
                          }`}
                      />
                    </div>
                    {/* <span className="errortext">{errors.shifting_charges}</span> */}
                  </FormGroup>
                </Col>
                <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label" >Franchise Wallet Limit </Label>
                      <Input
                        style={{ textTransform: "capitalize" }}
                        name="franchise_wallet_limit"
                        type="number"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        min="0"
                        // onKeyDown={(evt) =>
                        //   (evt.key === "e" ||
                        //     evt.key === "E" ||
                        //     evt.key === "." ||
                        //     evt.key === "-"||
                        //     (evt.key === "0" && evt.target.value === "0")) &&
                        //   evt.preventDefault()
                        // }
                        onKeyDown={(evt) => {
                          if (evt.target.value === "" && evt.key === "0") {
                            evt.preventDefault();
                          }
                          if (
                            evt.key === "e" ||
                            evt.key === "E" ||
                            evt.key === "." ||
                            evt.key === "-" ||
                            (evt.key === "0" && evt.target.value === "0")
                          ) {
                            evt.preventDefault();
                          }
                        }}
                        className={`form-control digits ${formData && formData.franchise_wallet_limit ? "" : "not-empty"
                          }`}
                      />
                    </div>
                    {/* <span className="errortext">{errors.franchise_wallet_limit}</span> */}
                  </FormGroup>
                </Col>
                <Col sm="3" id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label" >Customer Wallet Limit </Label>
                      <Input
                        style={{ textTransform: "capitalize" }}
                        name="customer_wallet_limit"
                        type="number"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        min="0"
                        // onKeyDown={(evt) =>
                        //   (evt.key === "e" ||
                        //     evt.key === "E" ||
                        //     evt.key === "." ||
                        //     evt.key === "-"||
                        //     (evt.key === "0" && evt.target.value === "0")) &&
                        //   evt.preventDefault()
                        // }
                        onKeyDown={(evt) => {
                          if (evt.target.value === "" && evt.key === "0") {
                            evt.preventDefault();
                          }
                          if (
                            evt.key === "e" ||
                            evt.key === "E" ||
                            evt.key === "." ||
                            evt.key === "-" ||
                            (evt.key === "0" && evt.target.value === "0")
                          ) {
                            evt.preventDefault();
                          }
                        }}
                        className={`form-control digits ${formData && formData.customer_wallet_limit ? "" : "not-empty"
                          }`}
                      />
                    </div>
                    {/* <span className="errortext">{errors.customer_wallet_limit}</span> */}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col id="moveup">
                  <FormGroup>
                    <Label className="kyc_label">GST Codes </Label>
                    {console.log(gstCode,"inputs.gstCode")}
                    <GstCodes
                      data={gstCode}
                      fieldNames={inputs.gstCode}
                      placeholder="GST Codes"
                      setFormData={setFormData}
                    />
                    {/* <span className="errortext">{errors.gst_codes && "Selection is required"}</span> */}
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col id="moveup">
                  <div style={{ fontSize: "19px", fontWeight: "600" }}>Configuration:</div>
                </Col>
              </Row>
              <Row  >
                <Col sm="3">
                  <Label className="kyc_label">Email</Label>
                  <br />
                  <div
                    className={`franchise-switch ${emailToggle}`}
                    onClick={EmailToggle}
                  />
                </Col>
                <Col sm="3">
                  <Label className="kyc_label">SMS</Label>
                  <br />
                  <div
                    className={`franchise-switch ${smsToggle}`}
                    onClick={SMSToggle}
                  />
                </Col>
                <Col sm="3">
                  <Label className="kyc_label">Whatsapp</Label>
                  <br />
                  <div
                    className={`franchise-switch ${whatsappToggle}`}
                    onClick={WHATSAPPToggle}
                  />
                </Col>
              </Row>
              <br /><br />
              <AddressComponent
                handleInputChange={handleInputChange}
                checkEmptyValue={checkEmptyValue}
                errors={errors}
                setFormData={setFormData}
                formData={formData}
                setInputs={setInputs}
                resetStatus={resetStatus}
                setResetStatus={setResetStatus}
                setIsDirtyFun={props.setIsDirtyFun}
              />

              <>
                <Row>
                  <span className="sidepanel_border" style={{ position: "relative", top: "0px" }}></span>

                </Row>
                <Col>

                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="submit"
                      className="mr-3"
                      id="create_button"
                      // onClick={resetInputField}
                      disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
                    >
                      {loaderSpinneer ? <Spinner size="sm" id="spinner"></Spinner> : null}
                      {Add}
                    </Button>
                    <Button
                      type="reset"
                      color="btn btn-primary"
                      id="resetid"
                      onClick={resetformmanually}
                    >
                      Reset
                    </Button>
                  </FormGroup>
                </Col>
              </>
            </Form>
          </Col>
        </Row>
      </Container>
      <Modal
        isOpen={selectserviceobj}
        toggle={Allplanstoggle}
        centered
        style={{ maxWidth: "1200px" }}
      >
        <ModalBody style={{ maxHeight: "400px", overflow: "auto" }}>
          <Form>
            <input
              className="form-control"
              type="text"
              placeholder="Search for Plan or Enter Amount"
              // Sailaja Added capitalize each work as per QA Team advice on 6th March
              onChange={(event) => handlesearchplan(event)}
              ref={searchInputField}
              style={{
                border: "1px solid #ced4da",
                backgroundColor: "white",
              }}
            />
            <Search className="search-icon" />
          </Form>

          <Table className="table-border-vertical">
            <thead>
              <tr>
                <th scope="col">{"Package Name"}</th>
                <th scope="col">{"Validity / Plan Cost"}</th>
                <th scope="col">{"Tax"}</th>
                <th scope="col">{"ISP Sharing (%)"}</th>
                <th scope="col">{"Franchise Sharing (%)"}</th>
              </tr>
            </thead>
            <tbody>
              {allserviceplanobj.map((services) => (
                <tr key={services.id}>
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
                          disabled={
                            servicelist[services.id] &&
                            servicelist[services.id].disabled
                          }
                          onChange={(e) =>
                            handleInputChange(e, false, services.id)
                          }
                        />
                        {services.package_name}
                      </Label>
                    </>
                  </td>

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
                        <Label className="kyc_label">TAX *</Label>
                        <Input
                          type="select"
                          name={`tax_type_${services.id}`}
                          className={`form-control digits ${formData &&
                            formData.plans &&
                            formData.plans[`tax_type_${services.id}`]
                            ? ""
                            : "not-empty"
                            }`}
                          onChange={(e) =>
                            handleInputChange(e, false, services.id)
                          }
                          value={
                            servicelist[services.id] &&
                            servicelist[services.id].tax_type
                          }
                          onBlur={checkEmptyValue}
                          disabled={
                            !servicelist[services.id] ||
                            !servicelist[services.id].selected
                          }
                        >
                       {/* Sailaja sorting the Franchise Module -> New Panel -> Revenue Sharing * -> Tax * Dropdown data as alphabetical order on 28th March 2023 */}

                       <option style={{ display: "none" }}></option>
                          <option value="EXM">Exempted</option>
                          <option value="FRAN">Franchise</option>
                          <option value="ISP">ISP</option>
                          <option value="SEZ">SEZ</option>
                          <option value="SHR">Sharing</option>
                        </Input>

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
                        className={`form-control digits ${formData &&
                          formData.plans &&
                          formData.plans[`isp_share_${services.id}`]
                          ? "not-empty"
                          : ""
                          }`}
                        value={
                          servicelist[services.id] &&
                          servicelist[services.id].isp_share
                        }
                        type="number"
                        disabled={
                          !servicelist[services.id] ||
                          !servicelist[services.id].selected
                        }
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
                        className={`form-control digits ${formData &&
                          formData.plans &&
                          formData.plans[`franchise_share_${services.id}`]
                          ? "not-empty"
                          : ""
                          }`}
                        value={
                          servicelist[services.id] &&
                          servicelist[services.id].franchise_share
                        }
                        type="number"
                        disabled={
                          !servicelist[services.id] ||
                          !servicelist[services.id].selected
                        }
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
          >
            {"Cancel"}
          </Button>
          <Button color="primary" onClick={handleSave}>
            {"Save"}
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default AddFranchise;
