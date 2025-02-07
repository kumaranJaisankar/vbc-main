import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Modal,
  ModalFooter,
  ModalBody,
  Label,
  Form,
} from "reactstrap";
import { customeraxios, billingaxios, adminaxios } from "../../../axios";
import useFormValidation from "../../customhooks/FormValidation";
import moment from "moment";
import { toast } from "react-toastify";
import pick from "lodash/pick";
import { isEmpty } from "lodash";
import ErrorModal from "../../common/ErrorModal";

const OfflinePayment = (props) => {
  const [renewPlan, setRenewplan] = useState({});
  const [errors, setErrors] = useState({});
  const [assignedTo, setAssignedTo] = useState([]);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  // success
  const [offlinesuccess, setOfflinesuccess] = useState(false);
  const OfflincesuccessModal = () => setOfflinesuccess(!offlinesuccess);
  // customer create error
  const [offlineerror, setOfflineError] = useState(false);
  const OffelineErrorModal = () => setOfflineError(!offlineerror);
  //states for URT and Cheque No.
  const [refrence, setRefrence] = useState();
  const [chequeno, setChequeno] = useState();
  const [bankno, setBankno] = useState();
  // priorcheck wallet balance
  const [balance, setBalance] = useState(false);
  const walletBalance = () => setBalance(!balance);
  // disabled button
  const [isOkButtons, setIsOkButtons] = useState(true);
  // Error modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const handleChange = (e) => {
    setRenewplan((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  useEffect(() => {
    customeraxios.get(`customers/display/users`).then((res) => {
      let { assigned_to } = res.data;

      setAssignedTo([...assigned_to]);
    });
  }, []);

  const [imgSrc, setImgSrc] = React.useState(null);

  async function UploadImage(e) {
    let img = URL.createObjectURL(e.target.files[0]);
    setImgSrc(img);
    let preview = await getBase64(e.target.files[0]);

    setRenewplan((preState) => ({
      ...preState,

      payment_receipt: preview,
    }));
  }

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const getNewDateForDueDate = () => {
    const { unit_type, time_unit, offer_time_unit } = props.selectedPlan;
    console.log(unit_type);
    let addUnitType = "days";
    switch (unit_type) {
      case "mon":
        addUnitType = "M";
        break;
      case "week":
        addUnitType = "W";
        break;
      case "day":
        addUnitType = "d";
        break;
      case "hour":
        addUnitType = "h";
        break;
      case "min":
        addUnitType = "m";
        break;
      default: {
        addUnitType = "h";
      }
    }

    const new_date = moment(props.startDate)
      .add(time_unit + offer_time_unit, addUnitType)
      .format("YYYY-MM-DD");
    console.log(addUnitType);
    console.log(new_date);
    return new_date;
  };

  // gst
  const staticCost =
    props.staticIPCost?.cost_per_ip * props?.selectedPlan?.time_unit;
  const CGST = (staticCost * 9) / 100;
  const SGST = (staticCost * 9) / 100;
  const TotalGST = CGST + SGST;

  const offlineProrcheck = (e) => {
    e.preventDefault();
    setIsOkButtons(false);
    const dataObj = {
      area: props?.formData?.area,
      ippool: props?.formData?.ippool,
      plan: props?.formData?.service_plan,
    };
    const validationErrors = validate(renewPlan);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      adminaxios
        .post(`wallet/priorcheck`, dataObj)
        .then((res) => {
          if (res.data.check == true) {
            setIsOkButtons(false);

            var config = {
              headers: {
                "Content-Type": "application/json",
              },
            };
            let data = { ...renewPlan };
            data.amount = parseFloat(
              parseFloat(props.totalPayableAmount).toFixed(2)
            );
            data.gst = {
              cgst: props.formData.plan_CGST,
              sgst: props.formData.plan_SGST,
            };
            data.installation_charges = props.formData?.installation_charges;
            data.security_deposit = props.formData?.security_deposit;

            data.static_ip_total_cost = props.staticIPCost?.cost_per_ip
              ? props.staticIPCost?.cost_per_ip * props.selectedPlan.time_unit
              : null;
            data.plan_cost = parseFloat(props.selectedPlan.plan_cost);
            data.discount_amount = props.totalAmountCal.discount_amount;
            //  parseFloat(
            //   props.selectedPlan.discount_amount_total_plan_cost
            //     ? props.selectedPlan.discount_amount_total_plan_cost
            //     : "0"
            // );
            data.collected_by = JSON.parse(localStorage.getItem("token"))?.id;
            //final_amount
            billingaxios
              .post(`payment/enh/offline`, data)
              .then((res) => {
                setIsOkButtons(false);
                (async function submission() {
                  let objForCreateUser = {};
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
                    // "service_type"
                  );

                  objForCreateUser.customer = {
                    ...objForCreateUser.customer,
                    radius_info: {
                      authentication_protocol: "15615451",
                      ip_mode: "151515",
                      ip_address: "vinayaka nagar colony",
                      mac_bind: formDataobj.mac_bind,
                      // ippool: formDataobj.ippool ? formDataobj.ippool : null,
                      // static_ip_bind: formDataobj.static_ip_bind
                      //   ? formDataobj.static_ip_bind
                      //   : null,
                      //   static_ip_total_cost: props.staticIPCost?.cost_per_ip
                      // ? props.staticIPCost?.cost_per_ip * props.selectedPlan.time_unit
                      // : null,
                      // static_ip_cgst:9,
                      // static_ip_sgst:9,
                      // static_ip_cost:WithoutGST,
                      nasport_bind: "56132198465",
                      option_82: "51191565466",
                      ...props.totalAmountCal.radius_info,
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
                  objForCreateUser.customer = {
                    ...objForCreateUser.customer,
                    email_flag: props.isEmailShow,
                    sms_flag: props.istelShow,
                    whatsapp_flag:props.iswhatsShow
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
                  objForCreateUser.payment_id = res.data.payment_id;
                  objForCreateUser.payment_method = res.data.payment_method;
                  //URT NO.and Cheque No.
                  objForCreateUser.upi_reference_no = res.data.upi_reference_no;
                  objForCreateUser.check_reference_no =
                    res.data.check_reference_no;
                  objForCreateUser.transaction_no = res.data.transaction_no;
                  objForCreateUser.bank_reference_no =
                    res.data.bank_reference_no;

                  objForCreateUser.billing_date = startDate;
                  objForCreateUser.discount_amount =
                    props.totalAmountCal.discount_amount;
                  // parseFloat(
                  //   props.selectedPlan.discount_amount_total_plan_cost
                  // );
                  objForCreateUser.network_info = null;
                  objForCreateUser.duedate = props.previousDay;
                  // let amount =
                  //   parseFloat(props.selectedPlan.total_plan_cost) +
                  //   parseFloat(formDataobj.installation_charges) +
                  //   parseFloat(formDataobj.security_deposit) + (formDataobj ? formDataobj.static_ip_amount : 0);
                  // objForCreateUser.amount = amount.toFixed(0);
                  objForCreateUser.amount = parseFloat(
                    parseFloat(props.totalPayableAmount).toFixed(2)
                  );
                  objForCreateUser.installation_charges =
                    formDataobj.installation_charges;
                  objForCreateUser.security_deposit =
                    formDataobj.security_deposit;

                  customeraxios
                    .post("customers/enh/create", objForCreateUser, config)
                    .then((res) => {
                      // toast.success("Customer created successfully", {
                      //   position: toast.POSITION.TOP_RIGHT,
                      //   autoClose: 1000,
                      // });
                      // setModalMessage("Customer created successfully.");
                      // setShowModal(true);
// Modified by Marieya
                      OfflincesuccessModal();
                    })
                    .catch((error) => {
                      setIsOkButtons(true);
                      const errorString = JSON.stringify(error);
                      const is500Error = errorString.includes("500");
                      const is404Error = errorString.includes("404");
                      if (error.response && error.response.data.detail) {
                        // toast.error(
                        //   error.response && error.response.data.detail,
                        //   {
                        //     position: toast.POSITION.TOP_RIGHT,
                        //     autoClose: 1000,
                        //   }
                        // );
                        setModalMessage(
                          error.response && error.response.data.detail
                        );
                        setShowModal(true);
                      } else if (is500Error) {
                        // toast.error("Something went wrong", {
                        //   position: toast.POSITION.TOP_RIGHT,
                        //   autoClose: 1000,
                        // });
                        OffelineErrorModal();
                      } else if (is404Error) {
                        // toast.error("API mismatch", {
                        //   position: toast.POSITION.TOP_RIGHT,
                        //   autoClose: 1000,
                        // });
                        setModalMessage("API mismatch");
                        setShowModal(true);
                      } else {
                        // toast.error("Something went wrong", {
                        //   position: toast.POSITION.TOP_RIGHT,
                        //   autoClose: 1000,
                        // });
                        setModalMessage("Something went wrong");
                        setShowModal(true);
                      }
                    });
                })();
                setIsOkButtons(false);
              })

              .catch(function (error) {
                setIsOkButtons(true);
                // toast.error("Something went wrong", {
                //   position: toast.POSITION.TOP_RIGHT,
                //   autoClose: 1000,
                // });
                setModalMessage("Something went wrong");
                setShowModal(true);
                console.error("offlinepayment", error);
              });
          }
          if (res.data.check == false) {
            walletBalance();
          }
        })
        .catch((errors) => {
          // toast.error("Something went wrong", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          setModalMessage("Something went wrong");
          setShowModal(true);
        });
    } else {
      setIsOkButtons(true);
      console.log("errors try again", validationErrors);
    }
  };

  const OfflineSubmit = (e) => {
    setIsOkButtons(false);
    e.preventDefault();
    const dataObj = {
      area: props?.formData?.area,
      plan: props?.formData?.service_plan,
    };
    const validationErrors = validate(renewPlan);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      adminaxios
        .post(`wallet/priorcheck`, dataObj)
        .then((res) => {
          if (res.data.check == true) {
            var config = {
              headers: {
                "Content-Type": "application/json",
              },
            };
            let data = { ...renewPlan };
            data.amount = parseFloat(
              parseFloat(props.totalPayableAmount).toFixed(2)
            );
            data.gst = {
              cgst: props.formData.plan_CGST,
              sgst: props.formData.plan_SGST,
            };
            data.installation_charges = props.formData?.installation_charges;
            data.security_deposit = props.formData?.security_deposit;
            // data.static_ip_cost = props.staticIPCost?.cost_per_ip
            // ? props.taticIPCost?.cost_per_ip * props.selectedPlan.time_unit
            // : null;
            data.plan_cost = parseFloat(props.selectedPlan.plan_cost);
            data.discount_amount = props.totalAmountCal.discount_amount;
            data.collected_by = JSON.parse(localStorage.getItem("token"))?.id;
            //final_amount
            billingaxios
              .post(`payment/enh/offline`, data)
              .then((res) => {
                setIsOkButtons(false);
                (async function submission() {
                  let objForCreateUser = {};
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
                    "pan_card",
                    "installation_charges"
                    // "service_type"
                  );
                  // objForCreateUser.customer = {
                  //   ...objForCreateUser.customer,
                  //   network_info: {
                  //     ip_address: "127.0.0.1",
                  //     NAS_id: 1,
                  //     Dpe_id: 2,
                  //     // NAS_id: formDataobj.nas,
                  //     // Dpe_id: formDataobj.hardware_name,
                  //     Cpe_id: 1,
                  //   },
                  // };
                  objForCreateUser.customer = {
                    ...objForCreateUser.customer,
                    alternate_mobile: !isEmpty(formDataobj.alternate_mobile)
                      ? formDataobj.alternate_mobile
                      : null,
                    alternate_email: !isEmpty(formDataobj.alternate_email)
                      ? formDataobj.alternate_email.toLowerCase()
                      : null,
                    registered_email:
                      formDataobj.registered_email.toLowerCase(),
                    radius_info: {
                      authentication_protocol: "15615451",
                      ip_mode: "151515",
                      ip_address: "vinayaka nagar colony",
                      mac_bind: formDataobj.mac_bind,
                      // ippool_id: formDataobj.ippool ? formDataobj.ippool : null,
                      // static_ip_bind: formDataobj.static_ip_bind
                      //   ? formDataobj.static_ip_bind
                      //   : null,
                      // static_ip_cost: formDataobj.static_ip_cost
                      //   ? formDataobj.static_ip_cost * props.selectedPlan.time_unit
                      //   : null,
                      ippool: null,
                      nasport_bind: "56132198465",
                      option_82: "51191565466",
                    },
                  };
                  // objForCreateUser.customer={
                  //   ...objForCreateUser.customer,
                  //   customer_documents:{
                  //     pan_card:formDataobj.pan_card ? formDataobj.pan_card:null
                  //   }
                  // };
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
                  objForCreateUser.customer = {
                    ...objForCreateUser.customer,
                    email_flag: props.isEmailShow,
                    sms_flag: props.istelShow,
                    whatsapp_flag:props.iswhatsShow
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
                  objForCreateUser.payment_id = res.data.payment_id;
                  objForCreateUser.payment_method = res.data.payment_method;
                  //URT NO.and Cheque No.
                  objForCreateUser.upi_reference_no = res.data.upi_reference_no;
                  objForCreateUser.check_reference_no =
                    res.data.check_reference_no;
                  objForCreateUser.transaction_no = res.data.transaction_no;
                  objForCreateUser.bank_reference_no =
                    res.data.bank_reference_no;

                  objForCreateUser.billing_date = startDate;
                  objForCreateUser.discount_amount =
                    props.totalAmountCal.discount_amount;
                  // parseFloat(
                  //   props.selectedPlan.discount_amount_total_plan_cost
                  // );
                  objForCreateUser.network_info = null;
                  objForCreateUser.duedate = props.previousDay;
                  // let amount =
                  //   parseFloat(props.selectedPlan.total_plan_cost) +
                  //   parseFloat(formDataobj.installation_charges) +
                  //   parseFloat(formDataobj.security_deposit) + (formDataobj ? formDataobj.static_ip_amount : 0);
                  // objForCreateUser.amount = amount.toFixed(0);
                  objForCreateUser.amount = parseFloat(
                    parseFloat(props.totalPayableAmount).toFixed(2)
                  );
                  objForCreateUser.installation_charges =
                    formDataobj.installation_charges;
                  objForCreateUser.security_deposit =
                    formDataobj.security_deposit;
                  console.log(objForCreateUser, "objForCreateUser");
                  customeraxios
                    .post("customers/enh/create", objForCreateUser, config)
                    .then((res) => {
                      // toast.success("Customer created successfully", {
                      //   position: toast.POSITION.TOP_RIGHT,
                      //   autoClose: 1000,
                      // });
                      // setModalMessage("Customer created successfully");
                      // setShowModal(true);

                      OfflincesuccessModal();
                    })
                    .catch((error) => {
                      setIsOkButtons(true);
                      const errorString = JSON.stringify(error);
                      const is500Error = errorString.includes("500");
                      const is404Error = errorString.includes("404");
                      if (error.response && error.response.data.detail) {
                        // toast.error(
                        //   error.response && error.response.data.detail,
                        //   {
                        //     position: toast.POSITION.TOP_RIGHT,
                        //     autoClose: 1000,
                        //   }
                        // );
                        setModalMessage(error.response && error.response.data.detail);
                        setShowModal(true);
                      } else if (is500Error) {
                        // toast.error("Something went wrong", {
                        //   position: toast.POSITION.TOP_RIGHT,
                        //   autoClose: 1000,
                        // });
                        OffelineErrorModal();
                      } else if (is404Error) {
                        // toast.error("API mismatch", {
                        //   position: toast.POSITION.TOP_RIGHT,
                        //   autoClose: 1000,
                        // });
                        setModalMessage("API mismatch");
                        setShowModal(true);
                      } else {
                        // toast.error("Something went wrong", {
                        //   position: toast.POSITION.TOP_RIGHT,
                        //   autoClose: 1000,
                        // });
                        setModalMessage("Something went wrong");
                        setShowModal(true);
                      }
                    });
                })();
                setIsOkButtons(false);
              })

              .catch(function (error) {
                setIsOkButtons(true);
                // toast.error("Something went wrong", {
                //   position: toast.POSITION.TOP_RIGHT,
                //   autoClose: 1000,
                // });
                setModalMessage("Something went wrong");
                  setShowModal(true);
                console.error("offlinepayment", error);
              });
          }
          if (res.data.check == false) {
            walletBalance();
          }
        })
        .catch((errors) => {
          // toast.error("Something went wrong", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          setModalMessage("Something went wrong");
           setShowModal(true);
        });
    } else {
      setIsOkButtons(true);
      console.log("errors try again", validationErrors);
    }
  };
  const requiredFields = ["payment_method"];
  const requiredFieldsbank = ["payment_method", "bank_reference_no"];
  const requiredFieldsUTR = ["upi_reference_no", "payment_method"];
  const requiredFieldscheck = ["check_reference_no", "payment_method"];
  const { validate, Error } = useFormValidation(
    renewPlan.payment_method === "BNKTF"
      ? requiredFieldsbank
      : renewPlan.payment_method === "GPAY" ||
        renewPlan.payment_method === "PHNPE"
      ? requiredFieldsUTR
      : renewPlan.payment_method === "CHEK"
      ? requiredFieldscheck
      : requiredFields
  );

  return (
    <FormGroup>
      <div>
        {/* <ModalBody  > */}
        {/* <h4>Offline Payment</h4> */}
        <Form id="myForm">
          <Row>
            <Col sm="6">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label"> Collected By *</Label>
                  <Input
                    className="form-control digits not-empty"
                    type="test"
                    value={JSON.parse(localStorage.getItem("token"))?.username}
                    name="collected_by"
                    onChange={handleChange}
                    disabled={true}
                  />
                </div>
                {/* <div className="input_wrap">
                  <Label className="kyc_label"> Paid To *</Label>
                    <Input
                      type="select"
                      name="collected_by"
                      onChange={handleChange}
                      onBlur={checkEmptyValue}
                      className={`form-control digits ${
                        renewPlan && renewPlan.user ? "not-empty" : ""
                      }`}
                      value={renewPlan && renewPlan.user}
                    >
                      <option style={{ display: "none" }}></option>
                      {assignedTo.map((assignedto) => (
                        <option key={assignedto.id} value={assignedto.id}>
                          {assignedto.username}
                        </option>
                      ))}
                    </Input>

                    
                    <span className="errortext">{errors.collected_by}</span>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "14%",
                      left: "73%",
                    }}
                  ></div> */}
              </FormGroup>
            </Col>
            <Col sm="6">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Paid Amount</Label>
                  <Input
                    name="amount"
                    className={`form-control digits not-empty${
                      renewPlan && renewPlan.amount ? "not-empty" : ""
                    }`}
                    value={parseFloat(props.totalPayableAmount).toFixed(0)}
                    type="number"
                    onBlur={checkEmptyValue}
                    onChange={handleChange}
                    disabled={true}
                  />
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <FormGroup>
                <div className="input_wrap">
                  <Label for="meeting-time" className="kyc_label">
                    Start Date
                  </Label>
                  <Input
                    className="form-control digits not-empty"
                    type="date"
                    value={startDate}
                    disabled={true}
                    name=""
                    onChange={handleChange}
                  />
                </div>
              </FormGroup>
            </Col>

            <Col sm="6">
              <FormGroup>
                <div className="input_wrap">
                  <Label for="meeting-time" className="kyc_label">
                    Due Date
                  </Label>
                  <Input
                    disabled={true}
                    className="form-control digits not-empty"
                    type="date"
                    value={getNewDateForDueDate(
                      startDate,
                      props.selectedPlan.plan_time_unit,
                      props.selectedPlan.plan_unit_type
                    )}
                    name=""
                    onChange={handleChange}
                  />
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm="6">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label"> Payment Method *</Label>
                  <Input
                    type="select"
                    name="payment_method"
                    className="form-control digits not-empty"
                    onChange={(event) => {
                      handleChange(event);
                      setRefrence(event.target.value);
                      setChequeno(event.target.value);
                      setBankno(event.target.value);
                    }}
                  >
                    {/* Sailaja Sorting KYC Form ->Offline  ->Payment Method * Dropdown data as alphabetical order on 10th April 2023 */}
                    <option value="" style={{ display: "none" }}></option>
                    <option value="BNKTF">Bank Transfer</option>
                    <option value="CASH">Cash</option>
                    <option value="CHEK">Cheque</option>
                    <option value="GPAY">Google Pay</option>
                    <option value="PAYTM">PayTM</option>
                    <option value="PHNPE">PhonePe</option>
                  </Input>

                  <span className="errortext">
                    {errors.payment_method && "Selection is required"}
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col
              sm="6"
              style={{ textAlign: "left" }}
              hidden={refrence != "BNKTF"}
            >
              <Label className="kyc_label"> Bank Reference No. *</Label>
              <Input
                onChange={handleChange}
                name="bank_reference_no"
                className="form-control"
                type="text"
              />
              <span className="errortext">{errors.bank_reference_no}</span>
            </Col>
            <Col
              sm="6"
              style={{ textAlign: "left" }}
              hidden={refrence != "GPAY" && refrence != "PHNPE"}
            >
              <Label className="kyc_label"> UTR No. *</Label>
              <Input
                onChange={handleChange}
                name="upi_reference_no"
                className="form-control"
                type="text"
              />
              <span className="errortext">{errors.upi_reference_no}</span>
            </Col>
            <Col
              sm="6"
              style={{ textAlign: "left" }}
              hidden={chequeno != "CHEK"}
            >
              <Label className="kyc_label"> Cheque No. *</Label>
              <Input
                onChange={handleChange}
                name="check_reference_no"
                className="form-control"
                type="text"
              />
              <span className="errortext">{errors.check_reference_no}</span>
            </Col>

            <Col sm="6" style={{ textAlign: "left", marginTop: "10px" }}>
              <span class="uploadimagekyc">
                Upload Receipt
                <Input
                  name="payment_reciept"
                  onChange={UploadImage}
                  className="form-control"
                  accept="image/*"
                  type="file"
                  id="upload"
                  style={{
                    paddingTop: "3px",
                    position: "absolute",
                    left: "0",
                    top: "0",
                    opacity: "0",
                    cursor: "pointer",
                  }}
                />
              </span>
            </Col>
            <Col sm="4">
              <img
                src={imgSrc}
                style={{ width: "200px", marginTop: "15px" }}
                className="imgsrc"
              />
            </Col>
          </Row>

          <br />

          <Col>
            {/* <ModalFooter> */}
            {/* <Button
                  color="secondary"
                  onClick={() => {
                      props.setPaymentRadiovalue("send to phone")
                    props.Paymentmodaltoggle(null);
                    props.showpaymenttype(false);
                  }}
                >
                  {"Cancel"}
                </Button> */}
            <Button
              color="primary"
              disabled={!isOkButtons}
              type="submit"
              className="pay_offline"
              onClick={
                props?.formData?.ippool ? offlineProrcheck : OfflineSubmit
              }
              id="update_button"
            >
              {" "}
              Submit
            </Button>{" "}
            &nbsp;
            {/* </ModalFooter> */}
          </Col>
        </Form>
        {/* </ModalBody> */}
      </div>
      {/* successmodal */}
      <Modal
        toggle={OfflincesuccessModal}
        isOpen={offlinesuccess}
        centered
        backdrop="static"
      >
        <ModalBody>{"Your record has been created successfully"}</ModalBody>
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

      {/* error modal */}
      <Modal
        toggel={OffelineErrorModal}
        isOpen={offlineerror}
        centered
        backdrop="static"
      >
        <ModalBody>
          {"Can't create customer due to insufficient data."}
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() =>
              window.location.replace(
                "/app/customermanagement/customerlists/"
              )
            }
          >
            Ok
          </Button>
        </ModalFooter>
      </Modal>
      {/* priorcheck wallet balance */}
      <Modal isOpen={balance} toggle={walletBalance} centered>
        <ModalBody>
          <p>{"You do not have enough balance"}</p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="contained"
            onClick={() => {
              walletBalance();
            }}
          >
            {"Ok"}
          </Button>
        </ModalFooter>
      </Modal>
      <ErrorModal
        isOpen={showModal}
        toggle={() => setShowModal(false)}
        message={modalMessage}
        action={() => setShowModal(false)}
      />
    </FormGroup>
  );
};
export default OfflinePayment;
