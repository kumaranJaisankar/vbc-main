import React, {
  Fragment,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

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
  Container,
} from "reactstrap";
// import { toast } from "react-toastify";
import { isEmpty } from "lodash";
// websocket
import ReconnectingWebSocket from "reconnecting-websocket";
import {
  default as axiosBaseURL,
  adminaxios,
  billingaxios,
  customeraxios,
  servicesaxios,
  networkaxios,
} from "../../../../axios";
import ProgressSteppedContent from "../../../utilitycomponents/progressSteppedContent";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import { classes } from "../../../../data/layouts";
import pick from "lodash/pick";
import TypeaheadContainer from "../TypeaheadContainer";
import useFormValidation from "../../../customhooks/FormValidation";
import "react-datepicker/dist/react-datepicker.css";

//Forms import
import FormStep1 from "../KYCForm/PersonalDetails/FormStep1";
import FormStep4 from "../KYCForm/ServiceDetails/FormStep4";
import FormStep10 from "../KYCForm/PaymentOptions/FormStep10";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import ErrorModal from "../../../common/ErrorModal";

import {
  handleChangeFormInput,
  setFormErrors,
  setFormData,
  setActiveBreadCrumb,
} from "../../../../redux/kyc-form/actions";

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

  const [leadUsers, setLeadUsers] = useState([]);
  const [leadUsersData, setLeadUsersData] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [inputs, setInputs] = useState(initialValues);
  const [getolt, setGetolt] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [loading, setLoading] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);
  const [submitLoad, setSubmitLoad] = useState(true);
  const [refresh, setRefresh] = useState(0);
  //service plan
  const [plan, setPlan] = useState([]);
  //olt filter state
  const [oltFilter, setOLtFilter] = useState([]);
  //
  const [showError, setShowError] = useState(false);
  //dp port
  const [dpPort, setDpPort] = useState([]);
  //
  //selected dpe
  const [selectedDpe, setSelectedDpe] = useState({});
  //
  // sms toggle
  const [smsToggle, setSmsToggle] = useState("on");
  const [istelShow, setTelIsShow] = React.useState(true);
  function SMSToggle() {
    setSmsToggle(smsToggle === "on" ? "off" : "on");
    setTelIsShow(!istelShow);
  }
  
  const [whatsappToggle, setWhatsappToggle] = useState("on");
  const [iswhatsShow, setWhatsIsShow] = React.useState(true);
  function WHATSAPPToggle() {
    setWhatsappToggle(whatsappToggle === "on" ? "off" : "on");
    setWhatsIsShow(!iswhatsShow);
  }
// Error modal states
const [showModal, setShowModal] = useState(false);
const [modalMessage, setModalMessage] = useState("");

  // email toggle
  const [emailToggle, setEmailToggle] = useState('on');
  const [isEmailShow, setIsEmailshow] = React.useState(true);
  function EmailToggle() {
    setEmailToggle(emailToggle === "on" ? "off" : "on");
    setIsEmailshow(!isEmailShow)
  }

  const [staticIPCost, setStaticIPCost] = useState({});
  const [isokbuttons, setIsokbuttons] = useState(true);
  const [toggleState, setToggleState] = useState("on");
  const [isShow, setIsShow] = React.useState(false);
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
    franchise: JSON.parse(localStorage.getItem("token")).franchise
      ? JSON.parse(localStorage.getItem("token")).franchise?.id
      : null,
    branch: "",
    otp_verification: false,
    alternate_mobile: "",
    alternate_email: "",
    wallet_amount: "120.00",
    // service_type: null,
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
      CAF_form: "CMP",
      identity_proof: "",
      Aadhar_Card_No: null,
      address_proof: "",
      customer_pic: "",
      signature: "",
      pan_card: null,
    },
  });
  {/*changed pan card keyname by Marieya */ }

  const [errors, setErrors] = useState({});

  const [branch, setBranch] = useState([]);
  const [service, setService] = useState([]);

  const configDB = useSelector((content) => content.Customizer.customizer);
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  const [sucModal, setSucModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  const [showPayment, setShowPayment] = useState(false);
  const [balance, setBalance] = useState(false)

  const checkBalance = () => setBalance(!balance)

  // static ip
  const [togglesnmpState, setTogglesnmpState] = useState("off");
  // discount 
  const [discountAmount, setDiscountAmount] = useState("off");
  const [ondiscountcheckupgradeplan, setOndiscountcheckupgradeplan] =
    useState(null);
  // ippools
  const [selectStatic, setSelectStatic] = useState()


  // amount calculation api
  const [totalAmountCal, setTotalAmountCal] = useState()
  useEffect(() => {
    let amountData = {
      service_plan: props?.formData?.service_plan,
    }
    if (togglesnmpState === 'on') {
      amountData.static_ip = selectStatic
      amountData.ippool = props?.formData?.ippool
    };
    if (discountAmount === 'on') {
      amountData.discount = Number(ondiscountcheckupgradeplan)
    }
    if (props?.formData?.service_plan) {

      customeraxios.post('customers/get/create/amount', amountData).then((res) => {
        setTotalAmountCal(res.data)
      })
    }
  }, [props?.formData?.service_plan, selectStatic, togglesnmpState, ondiscountcheckupgradeplan, discountAmount])



  //_________________________//
  const segments = [
    {
      personal_details_form: [
        "Upload Customer Photo",
        // "Personal Information",
        // "Address",
      ],
    },
    {
      service_details_form: [
        "Service Plan",
        // "Installation Charges",
        // "Billing Dates",
      ],
    },
    // { documents_form: ["Identity Proof", "Signature", "Address Proof"] },
    {
      payment_options_form: [
        "Online Payment",

        // "Cash", "Cheque"
      ],
    },
  ];

  const sectionIds = [
    "personal_details_form",
    "service_details_form",
    // "documents_form",
    "payment_options_form",
  ];

  var objForCreateUser = {};

  const onClickHandlerForProgressStepper = (clickType) => {

    let newStep = currentStep;
    let currentObj = segments[currentStep - 1];
    if (clickType === "next") {

      if (
        !props.saveAsBillingAddress &&
        currentStep === 1 &&
        currentSubSegment === 1
      ) {
        if (props.activeAddressBreadCrumb === "billing_address") {
          props.setActiveBreadCrumb("permanent_address");
          
        } else {
          const isPermanentAddressValid =
            checkPermanentAddressSectionValidity();
          if (isPermanentAddressValid) {
            newStep++;
            setCurrentSubSegment(1);
            let obj = segments[currentStep];
            let key = Object.keys(obj)[0];
            setActiveSubSegment(obj[key][0]);
          }
        }
      } else {
        if (
          currentSubSegment < currentObj[sectionIds[currentStep - 1]].length
        ) {
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
      }
    } else {
      if (
        !props.saveAsBillingAddress &&
        currentStep === 1 &&
        currentSubSegment === 1 &&
        props.activeAddressBreadCrumb === "permanent_address"
      ) {
        props.setActiveBreadCrumb("billing_address");
        checkSectionValidity(
         
          currentObj[sectionIds[currentStep - 1]][currentSubSegment - 1]
        );
      } else {
        if (currentSubSegment > 1) {
        
          setCurrentSubSegment(currentSubSegment - 1);
          checkSectionValidity(
            currentObj[sectionIds[currentStep - 1]][currentSubSegment - 1]
          );
          setActiveSubSegment(
            currentObj[sectionIds[currentStep - 1]][currentSubSegment - 1]
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

  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    history.push(key);
  };

  useEffect(() => {
    axiosBaseURL
      .get("/radius/group/display")
      .then((res) => {
        setPlan(res.data);
      })

      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axiosBaseURL.get(`/radius/lead/unconverted`).then((res) => {
      let leadsPick = res.data.map((lead) => {
        let obj = pick(lead, "id", "first_name", "email", "mobile_no");
        return {
          ...obj,
          id: "L" + obj.id,
        };
      });
      setLeadUsers(leadsPick);
      setLeadUsersData(res.data);
    });
  }, []);
  useEffect(() => {
    if (!!selectedId) {
      let id = selectedId.replace("L", "");
      let lead = leadUsersData.find((lead) => lead.id == id);
      let userFilledCustomerPic =
        props.formData.customer_documents.customer_pic;

      props.setFormData({
        user_name: parseInt(id),
        first_name: lead.first_name,
        last_name: lead.last_name,
        register_mobile: lead.mobile_no,
        registered_email: lead.email,
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
          CAF_form: "CMP",
          customer_pic: userFilledCustomerPic,
          pan_card: formData.customer_documents.pan_card ? formData.customer_documents.pan_card : null,
          Aadhar_Card_No: formData.customer_documents.Aadhar_Card_No ? formData.customer_documents.Aadhar_Card_No : null
        },
        security_deposit: "",
        installation_charges: "",
        franchise: JSON.parse(localStorage.getItem("token")).franchise
          ? JSON.parse(localStorage.getItem("token")).franchise?.id
          : null,
        branch: "",
        otp_verification: false,
        alternate_mobile: lead.alternate_mobile,
        alternate_email: lead.alternate_email,
        wallet_amount: "120.00",
        // service_type: null,
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
    } else if (name.includes("pan_card")) {
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
    } else {
      setFormData((preState) => ({
        ...preState,
        [name]: value,
      }));
    }

    let val = event.target.value;
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
      });
  };
  // branch api
  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        setBranch([...res.data]);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    servicesaxios
      .get(`/plans/create`)
      .then((res) => {
        setService([...res.data]);
      })
      .catch((error) => console.log(error));
  }, []);

  const setPerAddAsBillingAdd = (toggle) => {
    if (toggle === "on") {
      setFormData((preState) => {
        return {
          ...preState,

          permanent_address: {
            house_no: preState.address.house_no,
            street: preState.address.street,
            district: preState.address.district,
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
  // gst
  const staticCost = staticIPCost?.cost_per_ip * props?.selectedPlan?.time_unit
  console.log(props?.selectedPlan, "props?.selectedPlan")
  console.log(staticCost, "staticCost")
  const totalGSTS = props?.selectedPlan?.plan_cgst === 0 && isShow === true ? (props?.selectedPlan?.total_plan_cost) * .18 : 0;
  const CGST = (staticCost * 9) / 100
  const SGST = (staticCost * 9) / 100
  const TotalGST = CGST + SGST
  //  const WithoutGST = staticCost - TotalGST
  const WithoutGST = props.selectedPlan.time_unit * 212
  console.log(WithoutGST, "WithoutGST")

  // props.fromData.ippool
  const submit = (invoice_id) => {
    let formDataobj = { ...props.formData };

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
      "area",
      "zone",
      "otp_verification",
      "alternate_mobile",
      "alternate_email",
      "wallet_amount",
      // "service_type",
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
      "installation_charges",
      // "static_ip_cost",
      "mac_bind"
    );

    objForCreateUser.customer = {
      ...objForCreateUser.customer,
      alternate_mobile: !isEmpty(formDataobj.alternate_mobile)
        ? formDataobj.alternate_mobile
        : null,
      registered_email: formDataobj.registered_email.toLowerCase(),
      alternate_email: !isEmpty(formDataobj.alternate_email)
        ? formDataobj.alternate_email.toLowerCase()
        : null,
      radius_info: {
        authentication_protocol: "15615451",
        ip_mode: "151515",
        ip_address: "vinayaka nagar colony",
        mac_bind: formDataobj.mac_bind,
        // ippool: formDataobj.ippool ? formDataobj.ippool : null,
        // static_ip_bind: isShow === true ? formDataobj.static_ip_bind
        //   ? formDataobj.static_ip_bind
        //   : null : null,
        // static_ip_total_cost: isShow === true ? staticIPCost?.cost_per_ip
        //   ? staticIPCost?.cost_per_ip * props.selectedPlan.time_unit
        //   : null : null,

        // static_ip_cgst: isShow === true ? staticIPCost?.cost_per_ip ? 9 : null : null,
        // static_ip_sgst: isShow === true ? staticIPCost?.cost_per_ip ? 9 : null : null,
        // static_ip_cost: isShow === true ? staticIPCost?.cost_per_ip ? WithoutGST : null : null,
        ...totalAmountCal.radius_info,
        nasport_bind: "56132198465",
        option_82: "51191565466",
      },
    };

    objForCreateUser.customer = {
      ...objForCreateUser.customer,
      user_advance_info: {
        installation_charges: formDataobj.installation_charges,
        security_deposit: formDataobj.security_deposit,
        // service_type: "pro",
        billing_mode: "bm1",
        CAF_number: "45851515",
        GSTIN: formDataobj.GSTIN ? formDataobj.GSTIN : null,
        registered_date: "2021-07-28",
      },
    };
    objForCreateUser.customer = {
      ...objForCreateUser.customer,
      address: {
        house_no: !isEmpty(formDataobj.address.house_no)
          ? formDataobj.address.house_no
          : "N/A",
        street: formDataobj.address.street,
        landmark: formDataobj.address.landmark,
        city: formDataobj.address.city,
        district: formDataobj.address.district,
        state: formDataobj.address.state,
        country: formDataobj.address.country,
        pincode: formDataobj.address.pincode,
      },
    };
    objForCreateUser.customer = {
      ...objForCreateUser.customer,
      permanent_address: {
        house_no: !isEmpty(formDataobj.permanent_address.house_no)
          ? formDataobj.permanent_address.house_no
          : "N/A",
        street: formDataobj.permanent_address.street,
        landmark: formDataobj.permanent_address.landmark,
        city: formDataobj.permanent_address.city,
        district: formDataobj.permanent_address.district,
        state: formDataobj.permanent_address.state,
        country: formDataobj.permanent_address.country,
        pincode: formDataobj.permanent_address.pincode,
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
    objForCreateUser.plan_name = formDataobj.package_name;
    objForCreateUser.payment_id = invoice_id;
    const ID = (Boolean(selectedId) && selectedId.replace(/^\D+/g, "")) || "";
    objForCreateUser.lead = (Boolean(ID) && parseInt(ID, 10)) || "";
    objForCreateUser.billing_date = props.startDate;
    objForCreateUser.discount_amount = totalAmountCal.discount_amount;
    // parseFloat(
    //   props.selectedPlan.discount_amount_total_plan_cost
    // );
    objForCreateUser.network_info = null;

    objForCreateUser.duedate = props.previousDay;
    // let amount =
    //   parseFloat(props.selectedPlan.final_total_plan_cost) +
    //   parseFloat(formDataobj.installation_charges) +
    //   parseFloat(formDataobj.security_deposit) +
    //   parseFloat(
    //     staticIPCost?.cost_per_ip ? staticIPCost?.cost_per_ip : 0
    //   ) * props.selectedPlan.time_unit + totalGSTS

    let withoutStatic = parseFloat(totalAmountCal.amount) +
      parseFloat(formDataobj.installation_charges) +
      parseFloat(formDataobj.security_deposit)
    objForCreateUser.amount = withoutStatic.toFixed(0);
    // objForCreateUser.amount = parseFloat(parseFloat(props.totalPayableAmount).toFixed(2));
    objForCreateUser.installation_charges = formDataobj.installation_charges;
    objForCreateUser.security_deposit = formDataobj.security_deposit;
    objForCreateUser.customer = {
      ...objForCreateUser.customer,
      email_flag: isEmailShow,
      sms_flag: istelShow,
      whatsapp_flag:iswhatsShow
    }
    setIsokbuttons(false);
    customeraxios
      .post("customers/enh/create", objForCreateUser, config)
      .then((response) => {
        // toast.success("Successfull customer creation", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose: 1000,
        // });
      // Modified by Marieya
        setAlertMessage("Your record has been created successfully");
      })
      .catch((err) => {
        setAlertMessage(
          "Something went wrong.If any amount debited,it will be credited within 2-3 working days"
        );
      });
  };

  const paymentId = (response) => {
    if (response.status == 2) {
      let billingbaseurl = process.env.REACT_APP_API_URL_BILLING.split("//")[1];
      let protocol = window.location.protocol ? "wss:" : "ws:";
      var ws = new ReconnectingWebSocket(
        `${protocol}//${billingbaseurl}/ws/${response.payment_id}/listen/payment/status`
      );
      ws.onopen = () => {
        console.log("socket cnxn successful");
      };
      ws.onclose = (e) => {
        console.log("socket closed", e);
      };
      ws.onmessage = (e) => {
        let responseData = JSON.parse(e.data);
        if (responseData.status == 1) {
          // toast.success("Payment is completed", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          // Modified by Marieya
          setAlertMessage("Payment is completed")
          ws.close();
          submit(responseData.invoice_id);
          console.log(responseData.invoice_id, "esponseData.invoice_id")
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
      let formData = { ...props.formData };
      let selectedPlan = { ...props.selectedPlan };

      if (!!selectedPaymentId) {
        successModal();
        setAlertMessage("Your payment is processing...");
        setLoadingPay(true);
        const obj = {
          customer: {
            name: formData.first_name + " " + formData.last_name,
            email: formData.registered_email,
            contact: "+91" + formData.register_mobile,
          },
          gst: {
            cgst: formData.plan_CGST,
            sgst: formData.plan_SGST,
          },
          discount_amount: totalAmountCal.discount_amount,
          // parseFloat(
          //   props.selectedPlan.discount_amount_total_plan_cost
          //     ? props.selectedPlan.discount_amount_total_plan_cost
          //     : "0"
          // ),
          installation_charges: formData?.installation_charges,
          security_deposit: formData?.security_deposit,
          static_ip_total_cost: staticIPCost ? staticIPCost?.cost_per_ip * props.selectedPlan.time_unit : null,
          plan_cost: parseFloat(selectedPlan.plan_cost),
          // amount: isShow === true ?
          //   parseFloat(selectedPlan.final_total_plan_cost) +
          //   parseFloat(formData.installation_charges) +
          //   parseFloat(formData.security_deposit) +
          //   parseFloat(
          //     staticIPCost?.cost_per_ip ? staticIPCost?.cost_per_ip : 0
          //   ) * props.selectedPlan.time_unit : parseFloat(selectedPlan.final_total_plan_cost) +
          //   parseFloat(formData.installation_charges) +
          //   parseFloat(formData.security_deposit),

          amount: parseFloat(totalAmountCal.amount) + parseFloat(formData.installation_charges) + parseFloat(formData.security_deposit),

          gateway_id: selectedPaymentId,
          mac_bind: formData.mac_bind,
          // gst_exclude_charges: {
          //   security: formData.security_deposit,

          //   installation: formData.installation_charges,
          // },
          source: "IP",

          payload: {
            product: {
              name: formData.plan_name,
              id: formData.service_plan,
            },
            customer: {
              name: formData.first_name + " " + formData.last_name,
              email: formData.registered_email,
              contact: formData.register_mobile,
            },
          },
        };
        billingaxios.post("payment/enh", obj).then((response) => {
          if (response.data.route == true) {
            var win = window.open(`${response.data.next}`, "_blank");
            win.focus();
          }
          paymentId(response.data);
        })
        .catch((errors) => {
          setIsokbuttons(false);
          setAlertMessage("Something went wrong");
        })
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
    "security_deposit",
    "plan_type",
    "branch",
    "area",
    "pan_card"
  ];

  const requiredFieldspan = [
    "first_name",
    "last_name",
    "register_mobile",
    "registered_email",
    "alternate_mobile",
    "alternate_email",
    "landmark",
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
    "security_deposit",
    "plan_type",
    "branch",
    "area",
    "pan_card"
  ];

  const sectionWiseRequiredFields = {
    "Upload Customer Photo": [
      "customer_pic",
      "first_name",
      "last_name",
      "register_mobile",
      "registered_email",
      "alternate_mobile",
      "alternate_email",
      "area",
      "pincode",
      "house_no",
      "landmark",
      "street",
      "city",
      "district",
      "state",
      "country",
      "Aadhar_Card_No",
      "identity_proof",
      "signature",
      "address_proof",
      "pan_card"
    ],
    // "Personal Information": [
    //   "first_name",
    //   "last_name",
    //   "register_mobile",
    //   "registered_email",
    //   "area",
    // ],
    // Address: [
    //   "pincode",
    //   "house_no",
    //   "landmark",
    //   "street",
    //   "city",
    //   "district",
    //   "state",
    //   "country",
    // ],
    "Permanent Address": [
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
      "installation_charges",
      "security_deposit",
      "plan_type",
    ],
    // "Installation Charges": [],

    // "Billing Dates": ["plan_type"],
    // "Identity Proof": ["Aadhar_Card_No", "identity_proof"],
    // Signature: ["signature"],
    // "Address Proof": ["address_proof"],
  };

  const checkSectionValidity = (sectionTitle) => {
    const validationErrors = validate(props.formData);

    const requiredSections = sectionWiseRequiredFields[sectionTitle];
    if (props?.formData?.customer_documents?.Aadhar_Card_No) {
      delete validationErrors["pan_card"];
    }
    if (props?.formData?.customer_documents?.pan_card) {
      delete validationErrors["Aadhar_Card_No"];
    }
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

  const checkPermanentAddressSectionValidity = () => {
    const sectionTitle = "Permanent Address";
    const validationErrors = validate(props.formData);
    const requiredSections = sectionWiseRequiredFields[sectionTitle];
    let errors = {
      permanent_address: {},
    };
    requiredSections.map((inputField) => {
      if (
        validationErrors["permanent_address"] &&
        validationErrors["permanent_address"][inputField]
      ) {
        errors["permanent_address"][inputField] =
          validationErrors["permanent_address"][inputField];
      }
    });
    const noErrors = Object.keys(errors.permanent_address).length === 0;

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

  const { validate, Error } = useFormValidation(props.formData?.customer_documents?.pan_card ? requiredFieldspan : requiredFields);

  const handleTypeAheadInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    handleChangeFormInput({
      name,
      value,
    });
  };

  const priorCheck = () => {
    setIsokbuttons(true)
    const obj = {
      area: props.formData.area,
      ippool: props.formData.ippool,
      plan: props?.formData?.service_plan
    };
    adminaxios.post(`wallet/priorcheck`, obj).then((res) => {
      if (res.data.check == true) {
        // submit()
        submitdata()
      }
      if (res.data.check == false) {
        checkBalance()
      }
    })
    .catch((errors) => {
      // toast.error("Something went wrong", {
      //   position: toast.POSITION.TOP_RIGHT,
      //   autoClose: 1000,
      // });
      setIsokbuttons(false)
      setAlertMessage("Something went wrong");

    })
  }




  const withoutpriorCheck = () => {
    setIsokbuttons(true)
    const obj = {
      area: props.formData.area,
      plan: props?.formData?.service_plan
    };
    adminaxios.post(`wallet/priorcheck`, obj).then((res) => {
      if (res.data.check == true) {
        // submit()
        submitdata()
      }
      if (res.data.check == false) {
        checkBalance()
      }
    }).catch((errors) => {
      // toast.error("Something went wrong", {
      //   position: toast.POSITION.TOP_RIGHT,
      //   autoClose: 1000,
      // });
      setIsokbuttons(false)
      setAlertMessage("Something went wrong");

    })
  }


  //Sailaja on 11th July   Line number 1053 id="breadcrumb_margin" change the breadcrumb position
  // added Search icon css for kyc typeahead by marieya
  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <Grid
          container
          spacing={1}
          style={{ position: "relative" }}
          id="breadcrumb_margin"
        >
          <Grid item md="12">
            <Breadcrumbs
              aria-label="breadcrumb"
              separator={
                <NavigateNextIcon fontSize="small" className="navigate_icon" />
              }
            >
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color=" #377DF6"
                fontSize="14px"
              >
                Customer Relations
              </Typography>
              {/* Sailaja Added Link Tag& changes in Customers_KYC_Form Breadcrumbs line numbers 1110,1101,1112 on 13th July */}
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="#00000 !important"
                className="last_typography"
                fontSize="14px"
              >
                <Link
                  to={`${process.env.PUBLIC_URL}/app/customermanagement/customerlists/${process.env.REACT_APP_API_URL_Layout_Name}`}
                >
                  Customers</Link></Typography>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="#00000 !important"
                fontSize="14px"
                className="last_typography"
              >
                Add Customer
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <Modal
          isOpen={sucModal}
          toggle={successModal}
          centered
          backdrop="static"
        >
          {/* <ModalHeader toggle={successModal}>Processing Request</ModalHeader> */}
          <h4 style={{ padding: "15px" }}>Processing Request</h4>
          <ModalBody>
            <p>{alertMessage}</p>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={isokbuttons}
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

        <Form>
          <Row>
            <Col sm="6">
              <Row>
                <Col sm="6">
                  <FormGroup>
                    <div className="input_wrap">
                      {/* Hide Search bar for Service Plan & Payment Details on 1st August REF CUST-69*/}
                      {currentActiveFormId === "personal_details_form" && (
                        <Paper
                          component="div"
                          className="search_kyc"
                        >
                          <div style={{ margin: "-27px" }}></div>
                          <div>
                            <TypeaheadContainer
                              setSelectedId={setSelectedId}
                              leadUsers={leadUsers}
                            />
                          </div>

                        </Paper>
                      )}
                      {/* <Paper
                        component="div"
                        style={{
                          outline: "none",
                          position: "relative",
                          left: "282%",
                          top: "75px",
                          height: "37px",
                          zIndex: 1,
                        }}
                      >
                        <TypeaheadContainer
                          setSelectedId={setSelectedId}
                          leadUsers={leadUsers}
                        />
                     
                      </Paper> */}
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
                      {/* <Search className="search-icon" /> */}
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* <ProgressStepper
              setCurrentFormId={setCurrentFormId}
              setActiveSubSegment={setActiveSubSegment}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              currentSubSegment={currentSubSegment}
              setCurrentSubSegment={setCurrentSubSegment}
            /> */}

          {currentActiveFormId === "personal_details_form" && (
            <ProgressSteppedContent
              checkSectionValidity={checkSectionValidity}
              leftTabArray={["Upload Customer Photo"]}
              currentSubSegmentId={currentSubSegmentId}
              setActiveSubSegment={setActiveSubSegment}
              setCurrentSubSegment={setCurrentSubSegment}
              onClickHandlerForProgressStepper={
                onClickHandlerForProgressStepper
              }
              setShowError={setShowError}
              currentStep={currentStep}
              currentSubSegment={currentSubSegment}
              id={"personal_details_form"}
              components={[
                <FormStep1 smsToggle={smsToggle} SMSToggle={SMSToggle} EmailToggle={EmailToggle} emailToggle={emailToggle}  WHATSAPPToggle={WHATSAPPToggle} whatsappToggle={whatsappToggle} showError={showError} />,
                // <FormStep2 formTitle={"Personal Information"} />,
                // <FormStep3 formTitle={"Billing Address"} />,
                // <FormStep4 formTitle={"Service Plan"} />,
              ]}
            />
          )}
          {currentActiveFormId === "service_details_form" && (
            <ProgressSteppedContent
              leftTabArray={["Service Plan"]}
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
                <FormStep4 formTitle={"Service Plan"} staticIPCost={staticIPCost} setStaticIPCost={setStaticIPCost} setIsShow={setIsShow} isShow={isShow} setSelectStatic={setSelectStatic} togglesnmpState={togglesnmpState}
                  setTogglesnmpState={setTogglesnmpState} discountAmount={discountAmount} setDiscountAmount={setDiscountAmount} ondiscountcheckupgradeplan={ondiscountcheckupgradeplan} totalAmountCal={totalAmountCal}
                  setOndiscountcheckupgradeplan={setOndiscountcheckupgradeplan} showError={showError} />,

                // <FormStep5 formTitle={"Installation Charges"} />,
                // <FormStep6 formTitle={"Billing"} />,
              ]}
            />
          )}

          {/* {currentActiveFormId === "documents_form" && (
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
                  <FormStep8 formTitle={"Signature"} />,
                  <FormStep9 formTitle={"Address Proof"} />,
                ]}
              />
            )} */}

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
              leftTabArray={["Online Payment"]}
              id={"payment_options_form"}
              components={[
                <FormStep10
                  formTitle={"Online Payment"}
                  setSelectedPaymentId={setSelectedPaymentId}
                  setShowPayment={setShowPayment}
                  showPayment={showPayment}
                  submitdata={withoutpriorCheck}
                  formData={formData}
                  setStaticIPCost={setStaticIPCost}
                  staticIPCost={staticIPCost}
                  priorCheck={priorCheck}
                  isShow={isShow}
                  istelShow={istelShow}
                  isEmailShow={isEmailShow}
                  iswhatsShow={iswhatsShow}
                  totalAmountCal={totalAmountCal}
                />,
                // <FormStep11 formTitle={"Cash"} />,
                // <FormStep12 formTitle={"Cheque"} />,
              ]}
            >
              {/* <Button
                  color="primary"
                  type="button"
                  onClick={submitdata}
                  disabled={!submitLoad}
                >
                  {loadingPay ? " Payment Processing " : "Make Payment "}
                </Button> */}
            </ProgressSteppedContent>
          )}
        </Form>
        <ErrorModal
        isOpen={showModal}
        toggle={() => setShowModal(false)}
        message={modalMessage}
        action={() => setShowModal(false)}
      />
      </Container>
      <Modal isOpen={balance} toggle={checkBalance} centered>
        <ModalBody>
          <p>{"You do not have enough balance"}</p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="contained"
            onClick={() => {
              checkBalance()
            }}
          >
            {"Ok"}
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>

  );
};

const mapStateToProps = (state) => {
  const {
    formData,
    selectedPlan,
    errors,
    startDate,
    previousDay,
    saveAsBillingAddress,
    activeAddressBreadCrumb,
  } = state.KYCForm;
  return {
    formData,
    selectedPlan,
    errors,
    startDate,
    previousDay,
    saveAsBillingAddress,
    activeAddressBreadCrumb,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFormErrors: (payload) => dispatch(setFormErrors(payload)),
    setFormData: (payload) => dispatch(setFormData(payload)),
    handleChangeFormInput: (payload) =>
      dispatch(handleChangeFormInput(payload)),
    setActiveBreadCrumb: (payload) => dispatch(setActiveBreadCrumb(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Customerkycform);
