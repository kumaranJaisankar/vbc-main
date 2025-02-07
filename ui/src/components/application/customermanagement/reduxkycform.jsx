import React, {
  Fragment,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Form,
  Modal,
  ModalFooter,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { toast, useToast } from "react-toastify";
import moment from "moment";
import { Search } from "../../../constant";
import { default as axiosBaseURL, adminaxios } from "../../../axios";
import { billingaxios, customeraxios, servicesaxios } from "../../../axios";
import { networkaxios } from "../../../axios";
import ProgressStepper from "../../utilitycomponents/progressStepper";
import ProgressSteppedContent from "../../utilitycomponents/progressSteppedContent";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import { classes } from "../../../data/layouts";
import pick from "lodash/pick";
import TypeaheadContainer from "./TypeaheadContainer";
import useFormValidation from "../../customhooks/FormValidation";
import "react-datepicker/dist/react-datepicker.css";

//Forms import
import FormStep1 from "../customermanagement/KYCForm/PersonalDetails/FormStep1";
import FormStep2 from "../customermanagement/KYCForm/PersonalDetails/FormStep2";
import FormStep3 from "../customermanagement/KYCForm/PersonalDetails/FormStep3";
import FormStep4 from "../customermanagement/KYCForm/ServiceDetails/FormStep4";
import FormStep5 from "../customermanagement/KYCForm/ServiceDetails/FormStep5";
import FormStep6 from "../customermanagement/KYCForm/ServiceDetails/FormStep6";
import FormStep7 from "../customermanagement/KYCForm/Documents/FormStep7";
import FormStep8 from "../customermanagement/KYCForm/Documents/FormStep8";
import FormStep9 from "../customermanagement/KYCForm/Documents/FormStep9";
import FormStep10 from "../customermanagement/KYCForm/PaymentOptions/FormStep10";
import FormStep11 from "../customermanagement/KYCForm/PaymentOptions/FormStep11";
import FormStep12 from "../customermanagement/KYCForm/PaymentOptions/FormStep12";

import {
  handleChangeFormInput,
  setFormErrors,
  setFormData,
} from "../../../redux/kyc-form/actions";

const Customerkycform = (props, initialValues) => {
  //Progress Stepper manipulation code
  //Do not alter it
  const [currentActiveFormId, setCurrentFormId] = useState(
    "personal_details_form"
  );
  const [currentSubSegmentId, setActiveSubSegment] = useState(
    "Upload Customer Photo"
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSubSegment, setCurrentSubSegment] = useState(1);
  //Progress Stepper state ends here

  const [imageUpload, setImageUpload] = useState();
  const [leadUsers, setLeadUsers] = useState([]);
  const [selectedopenfor, setSelectedopenfor] = useState([]);
  const [leadUsersData, setLeadUsersData] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [openToFilter, setOpenToFilter] = useState([]);
  const [inputs, setInputs] = useState(initialValues);
  const [getolt, setGetolt] = useState([]);
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [loading, setLoading] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);
  const [submitLoad, setSubmitLoad] = useState(true);
  const [lead, setLead] = useState([]);

  const [modal, setModal] = useState(false);
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [refresh, setRefresh] = useState(0);
  //service plan
  const [plan, setPlan] = useState([]);
  //olt filter state
  const [oltFilter, setOLtFilter] = useState([]);
  //
  //dp port
  const [dpPort, setDpPort] = useState([]);
  //
  //selected dpe
  const [selectedDpe, setSelectedDpe] = useState({});
  //
  const [BasicLineTab, setBasicLineTab] = useState("1");

  const [toggleState, setToggleState] = useState("on");
  const [isShow, setIsShow] = React.useState(false);
  const [isShowSignatureModal, setIsShowSignatureModal] = React.useState(false);
  const [formData, setFormData] = useState({
    address: {
      house_no: "",
      street: "",
      district: "",
      state: "",
      pincode: "",

      landmark: "",
      city: "",
      country: "",
      longitude: "12.022586",
      latitude: "24.568978",
    },
    permanent_address: {
      house_no: "",
      street: "",
      district: "",
      state: "",
      pincode: "",
      landmark: "",
      city: "",
      country: "",
      longitude: "12.022586",
      latitude: "24.568978",
    },

    service_plan: "",
    plan_name: "",
    upload_speed: "",
    franchise: 11,
    branch: "",
    otp_verification: false,
    alternate_mobile: "",
    alternate_email: "",
    wallet_amount: "120.00",
    session_id: "session-1",
    package_plan: "5",
    account_status: "INS",
    user_type: "IND",
    account_type: "REG",
    expiry_date: "2021-10-28",
    // last_renewal: "",
    last_invoice_id: "---",
    device_id: "---",
    payment: {},
    customer_documents: {
      CAF_form: "",
      identity_proof: "",
      Aadhar_Card_No: null,
      pan_card:null,
      address_proof: "",
      customer_pic: "",
      signature: "",
    },
  });
{/*changed pan card keyname by Marieya */}

  //signature
  const sigCanvas = useRef({});
  const clear = () => sigCanvas.current.clear();
  const [imageURL, setImageURL] = useState(null);
  const [checkedmodal, setCheckedmodal] = useState(false);
  const [bycheck, setBycheck] = useState(false);
  const [errors, setErrors] = useState({});
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));

  const [selectedPlan, setSelectedPlan] = useState({});

  const [reccur, setReeccur] = useState();
  const [planreccur, setPlanreccur] = useState();
  const [branch, setBranch] = useState([]);
  const [service, setService] = useState([]);

  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  const [sucModal, setSucModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  const [showPayment, setShowPayment] = useState(false);

  //_________________________//
  const segments = [
    {
      personal_details_form: [
        "Upload Customer Photo",
        "Personal Information",
        "Address",
      ],
    },
    {
      service_details_form: [
        "Service Plan",
        "Installation Charges",
        "Billing Dates",
      ],
    },
    { documents_form: ["Identity Proof", "Signature", "Address Proof"] },
    { payment_options_form: ["Online Payment", "Cash", "Cheque"] },
  ];

  const sectionIds = [
    "personal_details_form",
    "service_details_form",
    "documents_form",
    "payment_options_form",
  ];
  const onClickHandlerForProgressStepper = (clickType) => {
    let newStep = currentStep;
    let currentObj = segments[currentStep - 1];
    if (clickType === "next") {
      if (currentSubSegment < currentObj[sectionIds[currentStep - 1]].length) {
        setCurrentSubSegment(currentSubSegment + 1);
        setActiveSubSegment(
          currentObj[sectionIds[currentStep - 1]][currentSubSegment]
        );
      } else {
        newStep++;
        setCurrentSubSegment(1);
        let obj = segments[currentStep];
        let key = Object.keys(obj)[0];
        setActiveSubSegment(obj[key][0]);
      }
    } else {
      if (currentSubSegment > 1) {
        setCurrentSubSegment(currentSubSegment - 1);
        checkSectionValidity(
          currentObj[sectionIds[currentStep - 1]][currentSubSegment - 2]
        );
        setActiveSubSegment(
          currentObj[sectionIds[currentStep - 1]][currentSubSegment - 2]
        );
      } else {
        newStep--;
        let obj = segments[currentStep - 2];
        let key = Object.keys(obj)[0];
        let lengthOfSubSegment = obj[key].length;
        setCurrentSubSegment(lengthOfSubSegment);
        checkSectionValidity(obj[key][lengthOfSubSegment - 1]);
        setActiveSubSegment(obj[key][lengthOfSubSegment - 1]);
      }
    }

    if (newStep > 0 && newStep < 5) {
      setCurrentStep(newStep);
      setCurrentFormId(sectionIds[newStep - 1]);
    }
  };
  //_____________ //
  const successModal = () => {
    if (sucModal) {
      setLoadingPay(false);
    }
    setSucModal(!sucModal);
  };

  let history = useHistory();

  const dispatch = useDispatch();

  let DefaultLayout = {};

  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize(window.innerWidth);
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
  }

  useEffect(() => {
    setLoading(true);
    const defaultLayoutObj = classes.find(
      (item) => Object.values(item).pop(1) === sidebar_type
    );
    const modifyURL =
      process.env.PUBLIC_URL +
      "/dashboard/default/" +
      Object.keys(defaultLayoutObj).pop();
    const id =
      window.location.pathname === "/"
        ? history.push(modifyURL)
        : window.location.pathname.split("/").pop();
    // fetch object by getting URL
    const layoutobj = classes.find((item) => Object.keys(item).pop() === id);
    const layout = id ? layoutobj : defaultLayoutObj;
    DefaultLayout = defaultLayoutObj;
    handlePageLayputs(layout);

    axiosBaseURL
      .get(`accounts/users`)
      // .then((res) => setData(res.data))
      .then((res) => {
        setData(res.data);
        setFiltereddata(res.data);
        setLoading(false);
        setRefresh(0);
      });
  }, [refresh]);

  const toggle = () => {
    setModal(!modal);
  };
  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
  };
  const openCustomizer = (type, id) => {
    if (id) {
      setLead(id);
    }
    setActiveTab1(type);
    setRightSidebar(!rightSidebar);
    if (rightSidebar) {
      document.querySelector(".customizer-contain").classList.add("open");

      // document.querySelector(".customizer-links").classList.add('open');
    }
  };

  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    history.push(key);
  };

  //refresh
  const Refreshhandler = () => {
    setRefresh(1);
    searchInputField.current.value = "";
  };

  const searchInputField = useRef(null);

  useEffect(() => {
    axiosBaseURL
      .get("/radius/group/display")
      .then((res) => {
        //let { groupnames } = res.data;
        setPlan(res.data);
      })

      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axiosBaseURL
      .get(`/radius/lead/unconverted`)
      // .then((res) => setData(res.data))
      .then((res) => {
        let leadsPick = res.data.map((lead) => {
          let obj = pick(lead, "id", "first_name", "email", "mobile_no");
          return {
            ...obj,
            id: "L" + obj.id,
          };
        });
        // const ids = res.data.map((lead) => "L00" + lead.id);
        setLeadUsers(leadsPick);
        setLeadUsersData(res.data);
      });
  }, []);

  useEffect(() => {
    if (!!selectedId) {
      let id = selectedId.replace("L", "");
      let lead = leadUsersData.find((lead) => lead.id == id);

      props.setFormData({
        user_name: parseInt(id),
        first_name: lead.first_name,
        last_name: lead.last_name,
        register_mobile: lead.mobile_no,
        registered_email: lead.email,
        alternate_mobile:lead.alternate_mobile,
        alternate_email:lead.alternate_email.toLowerCase(),
        address: {
          house_no: lead.house_no,
          street: lead.street,
          district: lead.district,
          pincode: lead.pincode,
          state: lead.state,
          landmark: lead.landmark,
          city: lead.city,
          country: lead.country,
          longitude: "12.022586",
          latitude: "24.568978",
          address_flag: true,
        },
        permanent_address: {
          house_no: toggleState === "on" ? lead.house_no : "",
          street: toggleState === "on" ? lead.street : "",
          district: toggleState === "on" ? lead.district : "",
          pincode: toggleState === "on" ? lead.pincode : "",
          state: toggleState === "on" ? lead.state : "",
          landmark: toggleState === "on" ? lead.landmark : "",
          city: toggleState === "on" ? lead.city : "",
          country: toggleState === "on" ? lead.country : "",
          longitude: "12.022586",
          latitude: "24.568978",
        },
        customer_documents: {
          CAF_form: "pending",
          customer_pic: { ...props.formData.customer_documents.customer_pic },
        },
        security_deposit: "",
        installation_charges: "",
        franchise: 11,
        branch: "",
        otp_verification: false,
        alternate_mobile: "",
        alternate_email: "",
        wallet_amount: "120.00",
        session_id: "session-1",
        package_plan: "5",
        account_status: "INS",
        user_type: "IND",
        account_type: "REG",
        expiry_date: "2021-10-28",
        // last_renewal: "",
        last_invoice_id: "---",
        device_id: "---",
        service: {
          payment: {
            amount: "",
            return_change: "",
            final_amount: "",
          },
          service_plan: "lead.service_plan",
          upload_speed: "",
          download_speed: "",
        },
        payment_id: "responseData.invoice_id",
      });
    }
  }, [selectedId]);

  const handleInputChange = (event) => {
    event.persist();

    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
    const target = event.target;
    var value = target.value;
    const name = target.name;

    if (target.type === "checkbox") {
      if (target.checked) {
        formData.hobbies[value] = value;
      } else {
        formData.hobbies.splice(value, 1);
      }
    } else if (name.includes("payment.")) {
      let paymentSplit = name.split("payment.");
      setFormData((preState) => ({
        ...preState,
        payment: {
          ...preState.payment,
          [paymentSplit[1]]: value,
        },
      }));
    } else if (name.includes("customer_documents.")) {
      let split = name.split("customer_documents.");
      setFormData((preState) => ({
        ...preState,
        customer_documents: {
          ...preState.customer_documents,
          [split[1]]: value,
        },
      }));
    } else if (name.includes("permanent_address.")) {
      let split = name.split("permanent_address.");
      setFormData((preState) => ({
        ...preState,
        permanent_address: {
          ...preState.permanent_address,
          [split[1]]: value,
        },
      }));
    } else if (name.includes("Aadhar_Card_No.")) {
      let split = name.split("Aadhar_Card_No.");
      setFormData((preState) => ({
        ...preState,
        Aadhar_Card_No: {
          ...preState.Aadhar_Card_No,
          [split[1]]: value,
        },
      }));
    }else if (name.includes("pan_card")) {
      let split = name.split("pan_card");
      setFormData((preState) => ({
        ...preState,
        pan_card: {
          ...preState.pan_card,
          [split[1]]: value,
        },
      }));
    } else if (name.includes("address.")) {
      let split = name.split("address.");
      setFormData((preState) => ({
        ...preState,
        address: {
          ...preState.address,
          [split[1]]: value,
        },
      }));

      setPerAddAsBillingAdd(toggleState);
    }
    //   else if (name.includes("package_name")) {
    //  console.log(event.target.name , "serivplna")

    //   }
    else {
      setFormData((preState) => ({
        ...preState,
        [name]: value,
      }));
    }

    let val = event.target.value;
    // const target = event.target;
    if (name == "branch") {
      branchHandler(val);
    }
    if (name == "nas") {
      getOltListByNas(val);
    }
    if (name == "olt") {
      getDpList(val);
    }
    if (name == "hardware_name") {
      const dpe = dpPort.find((d) => d.id == val);
      setSelectedDpe(dpe);
    }
  };
  //
  const getDpList = (val) => {
    networkaxios

      .get(`network/olt/childdp/${val}/filter`)
      .then((response) => {
        setDpPort(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
        // this.setState({ errorMessage: error });
      });
  };
  //olt
  const getOltListByNas = (val) => {
    networkaxios
      .get(`network/nastoolt/${val}/filter`)
      .then((response) => {
        setOLtFilter(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
        // this.setState({ errorMessage: error });
      });
  };
  //
  const branchHandler = (val) => {
    networkaxios
      .get(`network/nas/filter?branch=${val}`)
      .then((response) => {
        setGetolt(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
        // this.setState({ errorMessage: error });
      });
  };
  // branch api
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        // let { branch_name } = res.data;
        setBranch([...res.data]);
      })
      .catch((error) => console.log(error));
  }, []);
  // useEffect(() => {
  //   if (!!formData.service_plan) {

  //     let curreentPlan = service.find((p) => p.package_name == formData.service_plan);
  //     let arr = curreentPlan.value;
  //     console.log(arr);
  //     setFormData((preState) => ({
  //       ...preState,
  //       upload_speed: arr[0],
  //       // download_speed: arr[1],
  //       // data_limit: arr[2],
  //       // plan_cost: arr[3]

  //     }));
  //     console.log("forrrmdata", formData);
  //   }
  // }, [formData.service_plan]);

  useEffect(() => {
    console.log(formData);
    servicesaxios
      .get(`/plans/create`)
      .then((res) => {
        console.log(res);
        // let { branch_name } = res.data;
        setService([...res.data]);
      })
      .catch((error) => console.log(error));
  }, []);
  //

  const setPerAddAsBillingAdd = (toggle) => {
    if (toggle === "on") {
      setFormData((preState) => {
        return {
          ...preState,

          permanent_address: {
            house_no: preState.address.house_no,
            street: preState.address.street,
            district: preState.address.district,
            // area: preState.address.area,
            pincode: preState.address.pincode,
            state: preState.address.state,
            landmark: preState.address.landmark,
            city: preState.address.city,
            country: preState.address.country,
            longitude: "12.022586",
            latitude: "24.568978",
          },
        };
      });
    }
  };

  const submit = (invoice_id) => {
    let formDataobj = { ...props.formData };

    let objForCreateUser = {};
    objForCreateUser.customer = pick(
      formDataobj,
      "address",
      "permanent_address",
      "customer_documents",
      "user_name",
      "first_name",
      "register_mobile",
      "last_name",
      "registered_email",
      "franchise",
      "branch",
      "otp_verification",
      "alternate_mobile",
      "alternate_email",
      "wallet_amount",
      "session_id",
      "package_plan",
      "account_status",
      "lead",
      "user_type",
      "account_type",
      "expiry_date",
      "last_renewal",
      "last_invoice_id",
      "device_id",
      "service_plan",
      "plan_name",
      "security_deposit",
      "installation_charges"
    );
    objForCreateUser.customer = {
      ...objForCreateUser.customer,
      network_info: {
        ip_address: "127.0.0.1",
        NAS_id: 1,
        Dpe_id: 2,
        // NAS_id: formDataobj.nas,
        // Dpe_id: formDataobj.hardware_name,
        Cpe_id: 1,
      },
    };
    objForCreateUser.customer = {
      ...objForCreateUser.customer,
      radius_info: {
        authentication_protocol: "15615451",
        ip_mode: "151515",
        ip_address: "vinayaka nagar colony",
        mac_bind: "",
        ippool:"",
        static_ip_bind: "",
        nasport_bind: "56132198465",
        option_82: "51191565466",
      },
    };
    objForCreateUser.customer = {
      ...objForCreateUser.customer,
      user_advance_info: {
        installation_charges: "10000.00",
        security_deposit: "10000.00",
        // service_type: "pro",
        billing_mode: "bm1",
        CAF_number: "45851515",
        GSTIN: "12365478",
        registered_date: "2021-07-28",
      },
    };
    objForCreateUser.service = pick(
      formDataobj,
      "payment",
      "service_plan",
      "upload_speed",
      "download_speed",
      "data_limit",
      "plan_cost",
      "plan_setup_intial_cost",
      "plan_CGST",
      "plan_SGST",
      "total_amount"
    );

    const formDataForImg = new FormData();

    // Update the formData object
    formDataForImg.append(
      "address_proof",
      objForCreateUser.customer.customer_documents.address_proof
    );
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    // customeraxios
    objForCreateUser.plan_name = formData.package_name;
    objForCreateUser.payment_id = invoice_id;
    const ID = selectedId.replace(/^\D+/g, "");
    objForCreateUser.lead = parseInt(ID, 10);
    customeraxios
      .post("customers/create", objForCreateUser, config)
      .then((response) => {
        toast.success("Successfull customer creation", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose:1000
        });
        setAlertMessage("Your record has been created successfully");
      })
      .catch((err) => {
        console.log(err);
        setAlertMessage(
          "Something went wrong.If any amount debited,it will be credited within 2-3 working days"
        );
      });
  };

  const paymentId = (response) => {
    if (response.status == 2) {
      let protocol = window.location.protocol ? "wss:" : "ws:";
      var ws = new WebSocket(
        `${protocol}//sparkradius.in:7006/ws/${response.payment_id}/listen/payment/status`
      );
      ws.onopen = () => {
        console.log("socket cnxn successful");
      };
      ws.onclose = (e) => {
        console.log("socket closed", e);
      };
      ws.onmessage = (e) => {
        console.log(e.data, "data teja");
        let responseData = JSON.parse(e.data);
        if (responseData.status == 1) {
          toast.success("Payment is completed", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose:1000
          });
          ws.close();
          submit(responseData.invoice_id);
          setLoadingPay(false);
          setSubmitLoad(false);
          setAlertMessage("Creating user record...");
        }
      };
    }
  };

  const submitdata = () => {
    const validationErrors = validate(props.formData);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      if (!!selectedPaymentId) {
        successModal();
        setAlertMessage("Your payment is processing...");
        setLoadingPay(true);
        const obj = {

          customer:{

            name: formData.first_name + " " + formData.last_name,
            email: formData.registered_email,
            contact: "+91" + formData.register_mobile,
          },
          gst:{
            cgst: formData.plan_CGST,
            sgst: formData.plan_SGST,
          },
          amount:
            parseFloat(selectedPlan.plan_cost) +
            parseFloat(formData.installation_charges) +
            parseFloat(formData.security_deposit),
            gateway_id: selectedPaymentId,

            extra_charges:{

              security: formData.security_deposit,
              
              installation: formData.installation_charges,
            },
          source: "IP",
        
        };
        billingaxios.post("payment/", obj).then((response) => {
          console.log(response.data, "payment");
          paymentId(response.data);
        });
      } else {
        setShowPayment(true);
      }
    } else {
      console.log("errors try again", validationErrors);
    }
  };

  const requiredFields = [
    "first_name",
    "last_name",
    "register_mobile",
    "registered_email",
    "alternate_mobile",
    "alternate_email",
    "house_no",
    "landmark",
    "Aadhar_Card_No",
    "service_plan",
    "customer_pic",
    "street",
    "city",
    "pincode",
    "district",
    "state",
    "country",
    "identity_proof",
    "address_proof",
    "signature",
    "upload_speed",
    "download_speed",
    "data_limit",
    "plan_cost",
    "plan_SGST",
    "plan_CGST",
    "total_plan_cost",
    "installation_charges",
    "plan_type",
    "branch",
  ];

  const sectionWiseRequiredFields = {
    "Upload Customer Photo": ["customer_pic"],
    "Personal Information": [
      "first_name",
      "last_name",
      "register_mobile",
      "registered_email",
      "alternate_mobile",
      "alternate_email",
      "branch",
    ],
    Address: [
      "pincode",
      "house_no",
      "landmark",
      "street",
      "city",
      "district",
      "state",
      "country",
    ],
    "Service Plan": [
      "service_plan",
      "upload_speed",
      "download_speed",
      "data_limit",
      "plan_cost",
      "plan_SGST",
      "plan_CGST",
      "total_plan_cost",
    ],
    "Installation Charges": ["installation_charges"],
    "Billing Dates": ["plan_type"],
    "Identity Proof": ["Aadhar_Card_No", "identity_proof"],
    Signature: ["signature"],
    "Address Proof": ["address_proof"],
  };

  const checkSectionValidity = (sectionTitle) => {
    const validationErrors = validate(props.formData);
    const requiredSections = sectionWiseRequiredFields[sectionTitle];
    let errors = {};
    requiredSections.map((inputField) => {
      if (validationErrors[inputField]) {
        errors[inputField] = validationErrors[inputField];
      }
    });
    const noErrors = Object.keys(errors).length === 0;

    if (noErrors) {
      props.setFormErrors({});
      return true;
    }
    props.setFormErrors({ ...errors });
    return false;
  };

  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      checkSectionValidity(currentSubSegmentId);
    }
  }, [
    formData.customer_documents.customer_pic,
    formData.customer_documents.identity_proof,
    formData.customer_documents.address_proof,
    formData.customer_documents.signature,
  ]);

  const { validate, Error } = useFormValidation(requiredFields);

  const handleTypeAheadInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    handleChangeFormInput({
      name,
      value,
    });
  };

  return (
    <Fragment>
      <br />
      <Modal isOpen={sucModal} toggle={successModal} centered>
        <ModalHeader toggle={successModal}>Processing Request</ModalHeader>
        <ModalBody>
          <p>{alertMessage}</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() =>
              window.location.replace(
                `/app/customermanagement/customerlists/${process.env.REACT_APP_API_URL_Layout_Name}`
              )
            }
          >
            OK
          </Button>
        </ModalFooter>
      </Modal>

      <Col
        xl="12 xl-50"
        className="news box-col-6"
        style={{ marginBottom: "100px" }}
      >
        <Form>
          <Row style={{ borderBottom: "1px solid lightgray" }}>
            <Col sm="6">
              <div
                className="header-top"
                style={{ justifyContent: "flex-start" }}
              >
                &nbsp;&nbsp;
                <h4 className="m-0 kyc-form-header">Customer KYC Form</h4>
              </div>
              <br />
              <Row>
                <Col>
                  <FormGroup>
                    <div className="input_wrap">
                      <TypeaheadContainer
                        setSelectedId={setSelectedId}
                        leadUsers={leadUsers}
                      />
                        
                      <Input
                        style={{ visibility: "hidden" }}
                        type="text"
                        name="open_for"
                        className="form-control digits"
                        onChange={() => handleTypeAheadInputChange()}
                        value={props.formData && props.formData.open_for}
                      ></Input>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "9%",
                        left: "80%",
                      }}
                    >
                      <Search className="search-icon" />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </Col>
            <Col></Col>
          </Row>
          <div className="progress-stepper-wrapper">
            <ProgressStepper
              setCurrentFormId={setCurrentFormId}
              setActiveSubSegment={setActiveSubSegment}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              currentSubSegment={currentSubSegment}
              setCurrentSubSegment={setCurrentSubSegment}
            />
            {currentActiveFormId === "personal_details_form" && (
              <ProgressSteppedContent
                checkSectionValidity={checkSectionValidity}
                leftTabArray={[
                  "Upload Customer Photo",
                  "Personal Information",
                  "Address",
                ]}
                // checkSectionValidity={checkSectionValidity}
                currentSubSegmentId={currentSubSegmentId}
                setActiveSubSegment={setActiveSubSegment}
                setCurrentSubSegment={setCurrentSubSegment}
                onClickHandlerForProgressStepper={
                  onClickHandlerForProgressStepper
                }
                currentStep={currentStep}
                currentSubSegment={currentSubSegment}
                id={"personal_details_form"}
                components={[
                  <FormStep1 formTitle={"Upload Customer Photo"} />,
                  <FormStep2 formTitle={"Personal Information"} />,
                  <FormStep3 formTitle={"Installation Address"} />,
                ]}
              />
            )}
            {currentActiveFormId === "service_details_form" && (
              <ProgressSteppedContent
                leftTabArray={[
                  "Service Plan",
                  "Installation Charges",
                  "Billing Dates",
                ]}
                checkSectionValidity={checkSectionValidity}
                currentSubSegmentId={currentSubSegmentId}
                setActiveSubSegment={setActiveSubSegment}
                setCurrentSubSegment={setCurrentSubSegment}
                onClickHandlerForProgressStepper={
                  onClickHandlerForProgressStepper
                }
                currentStep={currentStep}
                currentSubSegment={currentSubSegment}
                id={"service_details_form"}
                components={[
                  <FormStep4 formTitle={"Service Plan"} />,
                  <FormStep5 formTitle={"Installation Charges"} />,
                  <FormStep6 formTitle={"Billing"} />,
                ]}
              />
            )}

            {currentActiveFormId === "documents_form" && (
              <ProgressSteppedContent
                currentSubSegmentId={currentSubSegmentId}
                setActiveSubSegment={setActiveSubSegment}
                setCurrentSubSegment={setCurrentSubSegment}
                onClickHandlerForProgressStepper={
                  onClickHandlerForProgressStepper
                }
                currentStep={currentStep}
                currentSubSegment={currentSubSegment}
                checkSectionValidity={checkSectionValidity}
                leftTabArray={["Identity Proof", "Signature", "Address Proof"]}
                id={"documents_form"}
                components={[
                  <FormStep7 formTitle={"Identity Proof"} />,
                  <FormStep8 formTitle={"Signature"} />,
                  <FormStep9 formTitle={"Address Proof"} />,
                ]}
              />
            )}

            {currentActiveFormId === "payment_options_form" && (
              <ProgressSteppedContent
                checkSectionValidity={checkSectionValidity}
                setActiveSubSegment={setActiveSubSegment}
                currentSubSegmentId={currentSubSegmentId}
                setCurrentSubSegment={setCurrentSubSegment}
                onClickHandlerForProgressStepper={
                  onClickHandlerForProgressStepper
                }
                currentStep={currentStep}
                currentSubSegment={currentSubSegment}
                leftTabArray={["Online Payment", "Cash", "Cheque"]}
                id={"payment_options_form"}
                components={[
                  <FormStep10
                    formTitle={"Online Payment"}
                    submitdata={submitdata}
                  />,
                  <FormStep11 formTitle={"Cash"} />,
                  <FormStep12 formTitle={"Cheque"} />,
                ]}
              >
                <Button
                  color="primary"
                  type="button"
                  onClick={submitdata}
                  disabled={!submitLoad}
                  style={{ width: "200px", height: "50px" }}
                >
                  {loadingPay ? " Payment Processing " : "Make Payment "}
                </Button>
              </ProgressSteppedContent>
            )}
            <br />
          </div>
        </Form>
      </Col>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  const { formData, selectedPlan, errors } = state.KYCForm;
  return {
    formData,
    selectedPlan,
    errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFormErrors: (payload) => dispatch(setFormErrors(payload)),
    setFormData: (payload) => dispatch(setFormData(payload)),
    handleChangeFormInput: (payload) =>
      dispatch(handleChangeFormInput(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Customerkycform);
