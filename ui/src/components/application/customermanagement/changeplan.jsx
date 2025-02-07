import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Input, Modal, ModalFooter, ModalBody, Label, Table, Form, FormGroup, CardBody, Card, CardHeader } from "reactstrap";
import moment from "moment";
import axios from "axios"
import { toast } from "react-toastify";
import { Accordion } from "react-bootstrap";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import isEmpty from "lodash/isEmpty";
import ReconnectingWebSocket from "reconnecting-websocket";
import useFormValidation from "../../customhooks/FormValidation";
import { customeraxios, adminaxios, networkaxios,billingaxios } from "../../../axios";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import StaticIpDetails from "./staticIpDeatils"
import PaymentGatewayOptions from "./paymentGateWayOptions";
const Changeplan = (props) => {
  const PAYMENTSUCCESS = "Your payment was successful";
  const PAYMENTFAILD = "Your payment was failed, Please try again later.";
  const [responseData, setResponseData] = useState();
  const [isokbuttons, setIsokbuttons] = useState(true);
  const [currentPlan, setCurrentPlan] = useState({});
  const [alertMessage, setAlertMessage] = useState(null);
  const [sucModal, setSucModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);
  const [changeplan, setChangeplan] = useState({
    payment_receipt: null,
    use_wallet: "",
    changeplan_finalamount: "",
    wallet_amount: "",
    payment_method: ""
  });
  const [paymentstatus, setPaymentstatus] = useState(false);
  const Paymentmodaltoggle = () => setPaymentstatus(!paymentstatus);
  //state for wallet amount checked
  const [changeplanwalletamountcheckbox, setchangeplanwalletamountcheckbox] =
    useState(false);
  //state for getting api data into state
  const [changeplandataoncheck, setChangeplandataoncheck] = useState({});
  //end
  const [radioButtonPlanId, setRadioButtonPlanId] = useState();
  const [expanded3, setexpanded3] = useState(true);
  const [errors, setErrors] = useState({});
  const Accordion3 = () => {
    setexpanded3(!expanded3);
  };
  const [startDate, setStartDate] = useState(moment().format("DD MMM YYYY,h:mm a"));
  const [offlinefield, setOfflinefield] = useState(false);
  const [onlinefield, setOnlinefield] = useState(true);
  //state for discount amount
  const [discountamountchangeplan, setDiscountamountchangeplan] = useState(false);
  const [ondiscountcheckchangeplan, setOndiscountcheckchangeplan] = useState(null);
  const [discounttogglechangeplan, setDiscounttogglechangeplan] = useState("off");
  // get waillet amount
  const [walletAmountcal, setWalletAmountCal] = useState(0);
  // cost
  const [walletAmount, setWalletAmount] = useState();
  // customer paid amount
  const [customerPaid, setCustomerPaid] = useState('')
  const [storedWalletAmount, setStoredWalletAmount] = useState(0);
  //states for UTR and Cheque No.
  const [refrence, setRefrence] = useState();
  const [chequeno, setChequeno] = useState();
  const [bankno, setBankno] = useState();
  const [staticIPCost, setStaticIPCost] = useState({});
  // toggle show static ip details
  const [staticToggle, setStaticToggle] = useState("off");
  const [istelShow, setTelIsShow] = React.useState(false);
  function staticIpToggle() {
    setStaticToggle(staticToggle === "off" ? "on" : "off");
    setTelIsShow(!istelShow);
  }
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [paymentGateways,setPaymentGateways]=useState([])
  const [selectedGatewayObj, setSelectedGatewayObj] = useState([]);
  const handleGatewayClick = (gateway) => {
    console.log("handleGatewayClick",gateway)
    setSelectedGateway(gateway?.id);
    setSelectedGatewayObj(gateway);
  };
  useEffect(() => {
    if (props.serviceobjdata?.is_static_ip === 1) {
      setStaticToggle("on");
      setTelIsShow(true);
    } else if (props.serviceobjdata?.is_static_ip === 0) {
      setStaticToggle("off");
      setTelIsShow(false);
    }
  }, [props.serviceobjdata]);
  useEffect(() => {
    getPaymentGateWays();
  }, []);
  const getPaymentGateWays =()=>{
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
    billingaxios
    .get("/payment/cstmr/payment/gateways/" + customerInfo?.user)
    .then((res) => {
       
        console.log(res?.data,"paymentGateways");
  setPaymentGateways(res?.data);
        
      })
  }
  // toggle show for alreday static ip
  const [staticipToggle, setStaicIpToggle] = useState("on")
  const [staticshow, setStaticShow] = useState(true)
  function showStaticipToggle() {
    setStaicIpToggle(staticipToggle === "on" ? "off" : "on")
    setStaticShow(!staticshow)
  }
  // sttaic iplist
  const [staticIP, setStaticIP] = useState([]);
  // ippools
  const [selectStatic, setSelectStatic] = useState()

  // checking all calculations
  const [getCalculations, setGetCalculations] = useState()
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const source = axios.CancelToken.source();

    let data = {
      use_wallet: changeplanwalletamountcheckbox,
      discount: Number(ondiscountcheckchangeplan),
      service_plan: props.serviceobjdata.id,
    };

    if (istelShow === true || SHowIpBind) {
      data.radius_info = radiusInfoIds;
    } else {
      delete data.radius_info;
    }

    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
    if (props.serviceobjdata.id) {
      setLoading(true);
      customeraxios
        .post(`customers/get/update/amount/${customerInfo.id}`, data, {
          cancelToken: source.token,
        })
        .then((res) => {
          setGetCalculations(res.data);
          setLoading(false);
        })
        .catch((thrown) => {
          if (axios.isCancel(thrown)) {
            console.log("Request canceled", thrown.message);
          } else {
            // handle error
          }
          setLoading(false);
        });
    }

    return () => {
      source.cancel();
    };
  }, [
    changeplanwalletamountcheckbox,
    istelShow,
    props.serviceobjdata,
    staticshow,
    ondiscountcheckchangeplan,
    staticIP,
    selectStatic,
  ]);

  const Withoutwalletamount = Number(getCalculations?.amount);
  const Totalwithwalletamount = Number(getCalculations?.amount) + Number(storedWalletAmount)




  // 2days plan checking
  const [twoDays, SetTwoDays] = useState({});
  // plan upgarde
  useEffect(() => {
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
    customeraxios
      .get(`/customers/check/customer/${customerInfo.id}/plan/date`)
      .then((res) => {
        SetTwoDays(res.data);
      });
    customeraxios
      .get("/customers/enh/plan/data/" + customerInfo.id)
      .then((res) => {
        setCurrentPlan(res.data);
        setChangeplandataoncheck(res.data);
        setChangeplan((preState) => {
          return {
            ...preState,
            changeplan_finalamount:
              props.serviceobjdata && parseFloat(amountpayable).toFixed(2),
          };
        });
      });
  }, [props.id, props.serviceobj]);
  //end
  // //use effect for autopopulating final amount field
  useEffect(() => {
    let changeplan_finalamount = !isNaN(amountpayable)
      ? parseFloat(amountpayable).toFixed(2)
      : 0;
    setChangeplan((preState) => {
      return {
        ...preState,
        changeplan_finalamount: changeplan_finalamount,
      };
    });
  }, [props.serviceobjdata, currentPlan]);

  //use effect for autopopulating final amount field
  useEffect(() => {
    const totalCOst = props.serviceobjdata && Number(amountpayable)
      + Number(changeplanwalletamountcheckbox === false && istelShow === true || SHowIpBind ? (currentPlan?.radius_info?.static_ip_total_cost / currentPlan?.plan_time_unit) * props.serviceobjdata.time_unit : 0)
      + sendGST + Number(changeplanwalletamountcheckbox === true && istelShow === true ? staticIPCost?.cost_per_ip * props.serviceobjdata.time_unit : 0);
    console.log(totalCOst, "totalCOst")
    let changeplan_finalamount = props.serviceobjdata && parseFloat(amountpayable).toFixed(2);
    let wallet_amount;
    // currentPlan.customer_wallet_amount
    if (changeplanwalletamountcheckbox) {
      if (
        changeplandataoncheck.customer_wallet_amount == 0 &&
        props.serviceobjdata
      ) {
        changeplan_finalamount = parseFloat(amountpayable).toFixed(2);
        wallet_amount = changeplandataoncheck.customer_wallet_amount;
      } else if (
        changeplandataoncheck &&
        props.serviceobjdata &&
        changeplandataoncheck.customer_wallet_amount <
        totalCOst
      ) {
        changeplan_finalamount =
          totalCOst -
          changeplandataoncheck.customer_wallet_amount;
        wallet_amount = changeplandataoncheck.customer_wallet_amount;
      } else if (
        changeplandataoncheck &&
        props.serviceobjdata &&
        changeplandataoncheck.customer_wallet_amount >
        parseFloat(amountpayable).toFixed(2)
      ) {
        changeplan_finalamount = 0;
        wallet_amount = totalCOst;
      }
    }
    setWalletAmount(wallet_amount);
    setChangeplan((preState) => {
      return {
        ...preState,
        changeplan_finalamount: changeplan_finalamount,
      };
    });
  }, [changeplanwalletamountcheckbox, currentPlan, istelShow, staticshow]);
  //end
  const amountpayable = props.serviceobjdata ? parseFloat(props.serviceobjdata.total_plan_cost).toFixed(2) : 0;
  // static cots
  const totalStaticCost = istelShow ? parseFloat(parseFloat(staticIPCost?.cost_per_ip * props.serviceobjdata.time_unit
    ? staticIPCost?.cost_per_ip * props.serviceobjdata.time_unit
    : 0
  )
  ) : 0;


  // static ip free 
  const freeStaticIPCost = getCalculations?.radius_info?.static_ip_total_cost
  // const totalStatic = Number(amountpayable) + Number(totalStaticCost)
  const TotalGSTs = props?.serviceobjdata?.plan_sgst === 0 && istelShow === true ? (props.serviceobjdata.total_plan_cost) * .18 : 0;
  const TOTALGSTS = props?.serviceobjdata?.plan_sgst === 0 && istelShow === false && staticshow === true ? (props.serviceobjdata.total_plan_cost) * .18 : 0;
  const sendGST = currentPlan?.radius_info?.static_ip_bind ? TOTALGSTS : TotalGSTs;
  const staticipcost = currentPlan?.radius_info && (staticshow ? (currentPlan?.radius_info?.static_ip_total_cost / currentPlan?.plan_time_unit) * props.serviceobjdata.time_unit : null);
  const totalStatic = Number(changeplanwalletamountcheckbox === false && totalStaticCost) + Number(changeplan.changeplan_finalamount) + Number(changeplanwalletamountcheckbox === false && staticipcost) + Number(changeplanwalletamountcheckbox === false && sendGST);

  // checking ippool condition
  const hideandSHowIPool =
    staticshow ? {
      plan: props.serviceobjdata.id,
      area: currentPlan.area,
      ippool: Number(changeplan?.ippool) ? Number(changeplan?.ippool) : Number(currentPlan?.radius_info?.ippool),
    } : {
      plan: props.serviceobjdata.id,
      area: currentPlan.area,
    }
  // online chnage plan
  const changeplanOnline = () => {
    setPaymentPaymentModal("your payment is processing .....!");
    setIsokbuttons(false);
    setYesButton(true);
    const obj = {
      plan: props.serviceobjdata.id,
      area: currentPlan.area,
    };
    const objwithPool = hideandSHowIPool
    adminaxios.post(`wallet/priorcheck`, Number(changeplan?.ippool) || currentPlan?.radius_info?.ippool ? objwithPool : obj).then((res) => {
      if (res.data.check == true) {
        // setShowPayment(true);
        submitdata();
      }
      if (res.data.check == false) {
        Paymentmodaltoggle();
      }
    });
  };


  // GST Calculation
  // const StaticCostWithoutGST = totalStaticCost- TotalGST1
  // const GSTASSINED = staticipcost ? staticipcost -TotalGST:totalStaticCost - TotalGST1 ;
  const StaticCostWithoutGST = props.serviceobjdata.time_unit * 212
  const GSTASSINED = currentPlan?.radius_info?.static_ip_bind && props.serviceobjdata.time_unit * 212;


  //  STatic
  const StaticIPBIND = istelShow === false && staticshow === true;
  const SHowIpBind = currentPlan?.radius_info?.static_ip_bind ? StaticIPBIND : null
  const hideandSHowstaticIP =
    istelShow === true || SHowIpBind ? {
      id: currentPlan?.radius_info?.id ? currentPlan?.radius_info?.id : null,
      static_ip_bind: changeplan.static_ip_bind ? changeplan.static_ip_bind : currentPlan?.radius_info?.static_ip_bind,
      ippool_id: changeplan.ippool ? changeplan.ippool : currentPlan?.radius_info?.ippool,

    }
      : null

  const hideandSHowstaticIP1 =
    istelShow === true || currentPlan?.radius_info?.static_ip_bind && StaticIPBIND ? {
      static_ip_bind: changeplan.static_ip_bind ? changeplan.static_ip_bind : currentPlan?.radius_info?.static_ip_bind,
      ippool_id: changeplan.ippool ? changeplan.ippool : currentPlan?.radius_info?.ippool,

    }
      : null


  const submitdata = () => {
    setSucModal(true);

    let obj = { ...getCalculations };
    obj.plan = props.serviceobjdata.id;
    obj.amount = Totalwithwalletamount;
    obj.payment_gateway_id=selectedGatewayObj?.id;
    obj.payment_gateway_type=selectedGatewayObj?.gateway_type;
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
    customeraxios
      .patch("customers/enh/onl/plan/update/" + customerInfo.id, obj)
      .then((response) => {
        setPaymentPaymentModal("your payment is processing .....!")
        successModal(true);
        if (response.data.route == true) {
          paymentId(response.data.payment_id);
          var win = window.open(`${response.data.next}`, "_blank");
          win.focus();
        }
        setPaymentPaymentModal("your payment is processing .....!")
      }).catch((error) => {
        setYesButton(false);
        setErrorModal(true)
        setPaymentPaymentModal(PAYMENTFAILD);
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.detail);
        }
      })
  };

  const paymentId = (payment_id) => {
    let billingbaseurl = process.env.REACT_APP_API_URL_BILLING.split("//")[1];
    console.log(billingbaseurl, "billingbaseurl");
    let protocol = window.location.protocol ? "wss:" : "ws:";
    var ws = new ReconnectingWebSocket(
      `${protocol}//${billingbaseurl}/ws/${payment_id}/listen/payment/status`
    );
    ws.onopen = () => {
      successModal(true);
      setSucModal(true)
      setPaymentPaymentModal("Your payment is processing...");
      console.log("socket cnxn successful");
    };
    ws.onclose = (e) => {
      console.log("socket closed", e);
    };
    ws.onmessage = (e) => {
      let responseData = JSON.parse(e.data);
      if (responseData.status == 1) {
        successModal(true);
        setSucModal(true)
        setPaymentPaymentModal(PAYMENTSUCCESS);
        toast.success("Payment is completed", {
          position: toast.POSITION.TOP_RIGHT,
        });
        ws.close();
        setLoadingPay(false);
        props.Verticalcentermodaltoggle1();
        setAlertMessage(PAYMENTSUCCESS);
        props.fetchComplaints();
      } else if (responseData.status == 3) {
        successModal(true)
        setSucModal(true)
        setYesButton(false);
        setPaymentPaymentModal(PAYMENTFAILD);
      } else if (responseData.status == 2) {
        successModal(true);
        setSucModal(true)
        setPaymentPaymentModal("Your payment is processing...");
      }

    };
  };

  const successModal = () => {

    setSucModal(!sucModal);
  };

  const handleChange = (e, date) => {
    setChangeplan((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setGetCalculations((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // setStartDate(date.target.value);
    if (e.target.name == "ippool") {
      getStaticIP(e.target.value);
    }
  };

  const offline = () => {
    setOfflinefield(true);
    setOnlinefield(false);
  };
  const online = () => {
    setOnlinefield(true);
    setOfflinefield(false);
  };

  const [imgSrc, setImgSrc] = React.useState(null);
  async function UploadImage(e) {
    let img = URL.createObjectURL(e.target.files[0]);
    setImgSrc(img);
    let preview = await getBase64(e.target.files[0]);

    setChangeplan((preState) => ({
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
  // filter
  const handlesearchChange = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = props.changeplanlistBkp.filter((data) => {
      if (
        data.package_name.toLowerCase().search(value) != -1 ||
        (data.fup_limit + "").toLowerCase().search(value) != -1 ||
        (data.upload_speed + "").toLowerCase().search(value) != -1 ||
        (data.download_speed + "").toLowerCase().search(value) != -1 ||
        (data.plan_cost + "").toLowerCase().search(value) != -1
      )
        return data;
    });
    props.setChangeplan([...result]);
  };

  useEffect(() => {
    props.setChangeplan([...props.changeplanlistBkp]);
  }, [props.upgradeRenewChangePlan]);

  const searchInputField = useRef(null);

  // checking radiusinfo id
  const radiusInfoIds = currentPlan?.radius_info?.id ? hideandSHowstaticIP : hideandSHowstaticIP1
  // changes plan

  //tookk sudha changes
  const changeplanSubmit = (e, id) => {
    e.preventDefault();
    setIsokbuttons(false);
    setPaymentPaymentModal("your payment is processing .....!");
    setYesButton(true);
    const obj = {
      plan: props.serviceobjdata.id,
      area: currentPlan.area,
    };
    const objwithPool = hideandSHowIPool
    adminaxios
      .post(`wallet/priorcheck`, Number(changeplan?.ippool) || currentPlan?.radius_info?.ippool ? objwithPool : obj)
      .then((res) => {
        if (res.data.check == true) {
          e.preventDefault();
          // let data = { ...changeplan };
          let data = { ...getCalculations };
          data.amount = Totalwithwalletamount;
          data.plan = props.serviceobjdata.id;
          data.paid_date = moment(getCalculations.paid_date).format("YYYY-MM-DD");

          //delete of final amount in api
          delete data.changeplan_finalamount;


          if (changeplan.payment_method === "BNKTF") {

            data.bank_reference_no = changeplan.bank_reference_no;
          } else {
            delete data.bank_reference_no
          }
          if (changeplan.payment_method === 'CHEK') {
            data.check_reference_no = changeplan.check_reference_no
          } else {
            delete data.check_reference_no
          }
          if (changeplan.payment_method === 'GPAY' || changeplan.payment_method === 'PHNPE') {
            data.upi_reference_no = changeplan.upi_reference_no
          } else {
            delete data.upi_reference_no
          }
          data.payment_method = changeplan.payment_method;
          delete data.static_ip_bind;
          delete data.static_ip_cost;
          delete data.ippool;

          data.paid_to = JSON.parse(localStorage.getItem("token"))?.id;
          //final_amount
          let customerInfo = JSON.parse(
            sessionStorage.getItem("customerInfDetails")
          );

          customeraxios
            .patch(`customers/enh/off/plan/update/${customerInfo.id}`, data)
            .then((res) => {
              setResponseData(res.data);
              setPaymentPaymentModal(PAYMENTSUCCESS);
              (async function submission() {
                adminaxios.get(`wallet/amount`).then((response) => {
                  localStorage.setItem(
                    "wallet_amount",
                    JSON.stringify(response.data.wallet_amount)
                  );
                  //now click the hidden button using Javascript
                  document.getElementById("hiddenBtn").click();
                });
                toast.success("Plan change successfully", {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 1000,
                });
                props.setUpdateInfoCount((prevState) => {
                  return prevState + 1;
                });
              })();
            })
            .catch(function (error) {
              setYesButton(false);
              setPaymentPaymentModal(PAYMENTFAILD);
              const errorString = JSON.stringify(error);
              const is500Error = errorString.includes("500");
              const is404Error = errorString.includes("404");
              if (error.response && error.response.data.detail) {
                setYesButton(false);
                toast.error(error.response && error.response.data.detail, {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 1000,
                });
              } else if (is500Error) {
                setYesButton(false);
                toast.error("Something went wrong", {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 1000,
                });
              } else if (is404Error) {
                setYesButton(false);
              } else {
                toast.error("Something went wrong", {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 1000,
                });
              }
            });
        }
        if (res.data.check == false) {
          Paymentmodaltoggle();
        }
      })
      .catch(function (error) {

        setErrorResponse(error.response);
        setPaymentPaymentModal(PAYMENTFAILD);
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is404Error = errorString.includes("404");
        if (error.response && error.response.data.detail) {
          toast.error(error.response && error.response.data.detail, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        } else if (is500Error) {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        } else if (is404Error) {
        } else {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        }
      });
  };








  // checking customer wallet function
  const [walletCOst, setWalletCost] = useState();
  const checkWalletSubmit = () => {
    setIsokbuttons(false)
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
    const wllatObj = {
      wallet_amount: Number(getWalletamount >= 0 ? (getWalletamount).toFixed(0) : 0),
    };
    adminaxios
      .post("wallet/walletcheck/" + customerInfo?.id, wllatObj)
      .then((res) => {
        setWalletCost(res.data);
        if (res.data.check === true) {
          setChangeYes(!changeYes);
        }
        if (res.data.check === false) {
          setIsokbuttons(true)

        }
      }).catch((err) => {
        setIsokbuttons(false)
      })
  }
  //end

  const requiredFields = ["payment_method"];
  const requiredFieldsbank = ["payment_method", "bank_reference_no"];
  const requiredFieldsUTR = ['upi_reference_no', 'payment_method'];
  const requiredFieldscheck = ["check_reference_no", 'payment_method'];
  const { validate, Error } = useFormValidation(changeplan.payment_method === "BNKTF" ? requiredFieldsbank : changeplan.payment_method === "GPAY" || changeplan.payment_method === "PHNPE" ? requiredFieldsUTR : changeplan.payment_method === "CHEK" ? requiredFieldscheck : requiredFields);

  // due date
  const getcalculatedduedate = () => {
    const { time_unit, unit_type, offer_time_unit } = props.serviceobjdata;
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
    const new_date = moment(startDate)
      .add(time_unit + offer_time_unit, addUnitType)
      .format("DD MMM YYYY,h:mm a");
    return new_date;
  };

  //handle click for wallet amount check box
  const handleClick = (e) => {
    setchangeplanwalletamountcheckbox(e.target.checked);
  };

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  //use effect for discount
  useEffect(() => {
    let finalAmountdiscount =
      (ondiscountcheckchangeplan * parseFloat(amountpayable).toFixed(2)) / 100;
    setChangeplan((prevState) => {
      return {
        ...prevState,
        changeplan_finalamount: parseFloat(
          props.serviceobjdata && amountpayable - finalAmountdiscount
        ).toFixed(2),
      };
    });
  }, [ondiscountcheckchangeplan]);
  //end

  function discountshowhide() {
    setDiscounttogglechangeplan(
      discounttogglechangeplan === "off" ? "on" : "off"
    );
    setDiscountamountchangeplan(!discountamountchangeplan);
    if (discounttogglechangeplan === "on") {
      setOndiscountcheckchangeplan(0);
    }
  }

  // change plan alertMessage

  const [changeYes, setChangeYes] = useState(false);
  const changeAlert = () => {
    const validationErrors = validate(changeplan);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {

      checkWalletSubmit();
    }
  };
  // select subplan

  const selectSubplan = (e, services) => {
    const value = e.target.value;
    const subplan = services.sub_plans.find((s) => s.id == value);
    props.setServiceobjdata({ ...subplan, serviceid: services.id });
  };

  // alert message
  const [paymentModal, setPaymentPaymentModal] = useState();
  // "Are you sure you want to Change Plan?"
  useEffect(() => {
    let changeplanMeassage = "Are you sure you want to Change Plan ?  ";
    setPaymentPaymentModal(changeplanMeassage + twoDays?.detail);
    SetTwoDays(twoDays);
  }, [twoDays]);

  const [yesButton, setYesButton] = useState(false);

  const closeButton = () => {
    props.Verticalcentermodaltoggle1();
    props.Refreshhandler();
    props.fetchComplaints();
  };

  const [errorResponse, setErrorResponse] = useState();

  // pool list
  const [ipPool, setIpPool] = useState([]);
  // pool list
  useEffect(() => {
    networkaxios
      .get(
        `network/ippool/${JSON.parse(sessionStorage.getItem("customerInfDetails"))?.area_id
        }/get`
      ).then((res) => {
        setIpPool([...res.data]);
      });
  }, []);


  // static ip
  const getStaticIP = (val) => {
    networkaxios.get(`network/ippool/used_ips/${val}`).then((res) => {
      let { available_ips } = res.data;
      setStaticIP([...available_ips]);
      setStaticIPCost(res.data);
    });
  };

  const strAscending = [...staticIP]?.sort((a, b) => (a.ip > b.ip ? 1 : -1));
  // customer paid amount 
  const getWalletamount = customerPaid - Number(getCalculations?.amount);

  // Inside your component
  const defaultErrorMessage = 'Customer Paid should not be less than Final Amount To Be Paid';
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage);

  useEffect(() => {
    validateCustomerPaid(customerPaid);
  }, [customerPaid, Totalwithwalletamount]);

  //...

  const validateCustomerPaid = (value) => {
    // Convert both values to number for correct comparison
    const finalAmount = parseFloat(Totalwithwalletamount);
    const customerPaid = parseFloat(value);

    if (customerPaid < finalAmount || isNaN(customerPaid)) {
      setErrorMessage(defaultErrorMessage);
    } else {
      setErrorMessage('');
    }
  }

  const handleCustomerPaidChange = (e) => {
    setCustomerPaid(e.target.value);
  };

  useEffect(() => {
    // Convert getWalletamount to a number and round it
    const walletAmount = parseFloat(getWalletamount);
    const roundedWalletAmount = isNaN(walletAmount) ? 0 : walletAmount.toFixed(2);

    // If the value is negative, store 0, otherwise store the rounded value
    if (roundedWalletAmount < 0) {
      setStoredWalletAmount(0);
    } else {
      setStoredWalletAmount(roundedWalletAmount);
    }
  }, [getWalletamount]);

  const discountCheck=(e)=>{
    if (e?.target?.value <= 100){
      setOndiscountcheckchangeplan(e.target.value);
    } 
    }
  return (
    <>    {currentPlan?.area ? (
      <>
        <Row>
          <Col>
            <b style={{ fontSize: "20px" }}>Select Plan</b>

            <Form>
              <input
                className="form-control"
                type="text"
                placeholder="Search For Package Name, Amount, Upload Speed, Download Speed, FUP Limit"
                onChange={(event) => handlesearchChange(event)}
                ref={searchInputField}
                style={{
                  border: "1px solid #ced4da",
                  backgroundColor: "white",
                  width: "550px",
                }}
              />
            </Form>
            <br />

            <Row style={{ maxHeight: "300px", overflow: "auto" }}>
              <Col>
                <Table className="table-border-vertical">
                  <thead>
                    <tr>
                      <th scope="col">{"Package Name"}</th>
                      <th scope="col">{"Duration"}</th>
                      <th scope="col">{"FUP Limit"}</th>
                      <th scope="col">{"Upload Speed"}</th>
                      <th scope="col">{"Download Speed"}</th>
                      <th scope="col">{"Plan Cost"}</th>
                      <th scope="col">{"Tax"}</th>
                      <th scope="col">{"Total Plan Cost"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.changeplanlist.map((services) => (
                      <tr>
                        <td scope="row">
                          {" "}
                          <>
                            <Label className="d-block" for="edo-ani1">
                              <Input
                                className="radio_animated"
                                type="radio"
                                id="edo-ani1"
                                key={services.id}
                                value={services.id}
                                name="package_name"
                                onChange={(e) => {
                                  setRadioButtonPlanId(services.id);
                                  props.setServiceobjdata(services);
                                }}
                              />
                              {services.package_name}
                            </Label>
                          </>
                        </td>
                        <td>
                          <Input
                            type="select"
                            name="plan"
                            className={`form-control not-empty`}
                            // value={}
                            onChange={(e) => selectSubplan(e, services)}
                            onBlur={checkEmptyValue}
                            disabled={
                              isEmpty(radioButtonPlanId) &&
                              !(radioButtonPlanId == services.id)
                            }
                          >
                            {/* Sailaja Commented off  Block of code till Input on 4th April 2023 */}
                            {services &&
                              services.sub_plans
                                .map((subplan) => (
                                  <option key={subplan.id} value={subplan.id}>
                                    {subplan.time_unit +
                                      subplan.unit_type +
                                      "(s)"}
                                  </option>
                                ))
                                }
                          </Input>

                        </td>
                        <td>{parseFloat(services.fup_limit).toFixed(0)}</td>
                        <td>
                          {parseFloat(services.upload_speed).toFixed(0) +
                            "Mbps"}
                        </td>
                        <td>
                          {parseFloat(services.download_speed).toFixed(0) +
                            "Mbps"}
                        </td>
                        {!isEmpty(props.serviceobjdata) &&
                          props.serviceobjdata.serviceid == services.id ? (
                          <>
                            <td>
                              ₹{" "}
                              {parseFloat(
                                props.serviceobjdata.plan_cost
                              ).toFixed(2)}
                            </td>
                            <td>
                              ₹{" "}
                              {parseFloat(
                                props.serviceobjdata.plan_cost * 0.18
                              ).toFixed(2)}{" "}
                            </td>
                            <td>
                              ₹{" "}
                              {parseFloat(
                                props.serviceobjdata.total_plan_cost
                              ).toFixed(2)}
                            </td>
                          </>
                        ) : (
                          <>
                            <td>
                              ₹ {parseFloat(services.plan_cost).toFixed(2)}
                            </td>
                            <td>
                              ₹ {services?.plan_cgst === 0 && services?.plan_sgst === 0 ? "0" : parseFloat(services.plan_cost * 0.18).toFixed(2)}

                            </td>
                            <td>
                              ₹{" "}
                              {parseFloat(services.total_plan_cost).toFixed(2)}
                            </td>
                          </>
                        )}
                        {/* <td>{services.time_unit+ services.offer_time_unit+ services.unit_type + "(s)"}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col sm="6">
            <Accordion defaultActiveKey="0">
              <CardBody>
                <div className="default-according style-1" id="accordionoc">
                  <Card>
                    <CardHeader
                      className=""
                      style={{
                        border: "1px solid",
                        borderRadius: "8px",
                        padding: "0rem 1.25rem",
                      }}
                    >
                      <h5 className="mb-0">
                        <Accordion.Toggle
                          as={Card.Header}
                          className="btn btn-link txt-white "
                          color="primary"
                          onClick={Accordion3}
                          eventKey="3"
                          aria-expanded={expanded3}
                        >
                          <span style={{ display: "flex", marginLeft: "-30px" }}>
                            {" "}
                            <b style={{ fontSize: "20px" }}>
                              {" "}
                              Current Plan : &nbsp;{" "}
                            </b>
                            {Object.keys(currentPlan).length > 0 && (
                              <>
                                <h5> {currentPlan && currentPlan.plan_name}</h5>
                              </>
                            )}
                          </span>
                        </Accordion.Toggle>
                      </h5>
                    </CardHeader>
                    <Accordion.Collapse eventKey="3">
                      <CardBody style={{ border: "none" }}>
                        {Object.keys(currentPlan).length > 0 && (
                          <>
                            <p>
                              {" "}
                              <b>Package Name :</b> &nbsp;
                              {currentPlan && currentPlan.plan_name}
                            </p>
                            <p>
                              {" "}
                              <b> Plan Cost : ₹</b> &nbsp;
                              {currentPlan &&
                                parseFloat(currentPlan.plan_cost).toFixed(2)}
                            </p>
                            <p>
                              {" "}
                              <b>Upload Speed :</b> &nbsp;
                              {currentPlan.upload_speed &&
                                parseFloat(currentPlan.upload_speed).toFixed(0) +
                                "Mbps"}
                            </p>
                            <p>
                              {" "}
                              <b> Download Speed :</b> &nbsp;
                              {currentPlan.download_speed &&
                                parseFloat(currentPlan.download_speed).toFixed(
                                  0
                                ) + "Mbps"}
                            </p>
                            <p>
                              {" "}
                              <b>Fup Limit :</b> &nbsp;
                              {currentPlan.fup_limit &&
                                parseFloat(currentPlan.fup_limit).toFixed(0) +
                                "GB"}
                            </p>
                            <p>
                              {" "}
                              <b>Usage Cost : ₹</b> &nbsp;
                              {currentPlan.usage_cost &&
                                parseFloat(currentPlan.usage_cost).toFixed(0)}
                            </p>
                            <p>
                              {" "}
                              <b>Plan Start Date :</b> &nbsp;
                              {currentPlan.plan_start_date &&
                                moment(currentPlan.plan_start_date).format("l")}
                            </p>
                            <p>
                              {" "}
                              <b>No.of Consumption Days :</b> &nbsp;
                              {currentPlan.total_days &&
                                parseFloat(currentPlan.total_days).toFixed(0)}
                            </p>
                          </>
                        )}
                      </CardBody>
                    </Accordion.Collapse>
                  </Card>
                </div>
              </CardBody>
            </Accordion>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup
              className="m-t-15 m-checkbox-inline mb-0"
              style={{ display: "flex" }}
            >
              <Label>
                <b style={{ fontSize: "20px" }}>Payment Mode :</b> &nbsp;&nbsp;
              </Label>
              <div className="">
                <Input
                  className="radio_animated"
                  id="radioinline4"
                  type="radio"
                  name="online"
                  value="option1"
                  defaultChecked
                  onClick={online}
                  checked={onlinefield}
                />

                <Label className="mb-0" for="radioinline4">
                  {Option}
                  <span className="digits"> {"Online"}</span>
                </Label>
              </div>

              <div className="">
                <Input
                  className="radio_animated"
                  id="radioinline3"
                  type="radio"
                  name="offline"
                  value="option1"
                  onClick={offline}
                  checked={offlinefield}
                />

                <Label className="mb-0" for="radioinline3">
                  {Option}
                  <span className="digits"> {"Offline"}</span>
                </Label>
              </div>
              {onlinefield &&
                <>
                  <Label className="desc_label">Static IP</Label>
                  {currentPlan?.radius_info?.static_ip_bind ?
                    <div
                      className={`franchise-switch ${staticipToggle}`}
                      onClick={showStaticipToggle} /> :
                    <div
                      className={`franchise-switch ${staticToggle}`}
                      onClick={staticIpToggle}
                    />
                  }</>}
            </FormGroup>
          </Col>
        </Row>
        <br />
        {offlinefield ? (
          <div>
            <Form id="myForm" onSubmit={checkWalletSubmit}>
              <Row style={{ marginLeft: "0px" }}>
                <Col sm="4">
                  <div className="checkbox checkbox-dark">
                    <Input
                      id="checkbox1"
                      type="checkbox"
                      onClick={handleClick}
                      // onChange={handleClick}
                      checked={changeplanwalletamountcheckbox}
                      name="use_wallet"
                      value={changeplan && changeplan.use_wallet}
                    />
                    <Label for="checkbox1" style={{ fontWeight: "bold" }}>
                      Wallet Amount : &nbsp;&nbsp;₹
                      {currentPlan.customer_wallet_amount}
                    </Label>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm="3">
                  <Label className="desc_label">Discount</Label> &nbsp;&nbsp;
                  <div style={{ top: "7px" }}
                    className={`franchise-switch ${discounttogglechangeplan}`}
                    onClick={discountshowhide}
                  />
                </Col>
                {discountamountchangeplan ? (
                  <>
                    <Col sm="3">
                      <FormGroup>
                        <div className="input_wrap">
                          <Input
                            type="text"
                            name="discount"
                            // onBlur={checkEmptyValue}
                            onChange={(e) => {
                              discountCheck(e);
                              // setOndiscountcheckchangeplan(e.target.value);
                              // console.log(setOndiscountcheckchangeplan, "setOndiscountcheckchangeplan")
                            }}
                            onKeyDown={(evt) => {
                              const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight"];
                              if (evt.key === "." && evt.target.value.includes(".")) {
                                  evt.preventDefault();
                              } else if (
                                  !allowedKeys.includes(evt.key) && 
                                  !/^\d*(\.\d{0,2})?$/.test(evt.target.value + evt.key)
                              ) {
                                  evt.preventDefault();
                              }
                          }}
                        onBlur={(e) => {
                            let val = parseFloat(e.target.value);
                            if (!isNaN(val)) {
                                e.target.value = val.toFixed(2);
                            } else {
                                e.target.value = ""; // reset the value if it's not a number
                            }
                            checkEmptyValue();
                        }}
                            // min="0"
                            // onKeyDown={(evt) =>
                            //   (evt.key === "e" ||
                            //     evt.key === "E" ||
                            //     evt.key === "." ||
                            //     evt.key === "-") &&
                            //   evt.preventDefault()
                            // }
                            value={ondiscountcheckchangeplan}
                          />
                          <Label className="form_label">Discount (in %)</Label>
                          <span className="errortext">
                            {errors.discount}
                          </span>
                        </div>
                      </FormGroup>
                    </Col>

                    <Col sm="3">
                      <FormGroup>
                        <div className="input_wrap">
                          <Input
                            type="number"
                            disabled={true}
                            className="form-control digits not-empty"
                            name="discount_amount"
                            value={getCalculations?.discount_amount}

                          />
                          <Label className="form_label">Discount (in ₹)</Label>
                        </div>
                      </FormGroup>
                    </Col>
                  </>
                ) : (
                  ""
                )}
              </Row>
              <Row>
                <Col sm="3">
                  <Label className="desc_label">Static IP</Label> &nbsp;&nbsp;
                  {currentPlan?.radius_info?.static_ip_bind ?
                    <div style={{ top: "7px" }}
                      className={`franchise-switch ${staticipToggle}`}
                      onClick={showStaticipToggle} /> :
                    <div style={{ top: "7px" }}
                      className={`franchise-switch ${staticToggle}`}
                      onClick={staticIpToggle}
                    />
                  }
                </Col>
                {staticshow &&
                  <>
                    {currentPlan?.radius_info?.static_ip_bind && (
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">

                            <Input
                              className="form-control digits not-empty"
                              type="text"
                              value={currentPlan?.radius_info?.static_ip_bind}
                              disabled={true}
                            />
                            <Label
                              for="meeting-time"
                              className="form_label"
                            >
                              Static IP
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    )}
                    {currentPlan?.radius_info?.static_ip_bind &&
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">

                            <Input
                              className="form-control digits not-empty"
                              type="text"
                              // value={staticipcost ? staticipcost : currentPlan?.radius_info?.static_ip_total_cost}
                              value={getCalculations?.radius_info?.static_ip_total_cost}
                              disabled={true}
                            />
                            <Label
                              for="meeting-time"
                              className="form_label"
                            >
                              Static IP Cost
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    }

                    {currentPlan?.radius_info?.ippool && (
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">

                            <Input
                              className="form-control digits not-empty"
                              type="text"
                              value={currentPlan?.ip_pool_name}
                              disabled={true}
                            />
                            <Label
                              for="meeting-time"
                              className="form_label"
                            >
                              IP Pool
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    )}
                  </>
                }
                {istelShow ? (
                  <>
                    {currentPlan?.ip_pool_name ? (
                      <>

                      </>
                    ) : (
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Label className="kyc_label">IP Pool</Label>
                            <Input
                              type="select"
                              className="form-control digits"
                              onChange={handleChange}
                              name="ippool"
                            >
                              <option style={{ display: "none" }}></option>
                              {ipPool.map((ipPools) => (
                                <option key={ipPools.id} value={ipPools.id}>
                                  {ipPools.name}
                                </option>
                              ))}
                            </Input>
                          </div>
                        </FormGroup>
                      </Col>
                    )}
                    {currentPlan?.static_ip_bind ? (
                      <>

                      </>
                    ) : (
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Label className="kyc_label">Static IP</Label>
                            <Input
                              type="select"
                              className="form-control digits"
                              onChange={(event) => {
                                handleChange(event);
                                setSelectStatic(event.target.value);
                              }}
                              name="static_ip_bind"
                            >
                              <option style={{ display: "none" }}></option>
                              {strAscending.map((staticIPs) => (
                                <option key={staticIPs.ip} value={staticIPs.ip}>
                                  {staticIPs.ip}
                                </option>
                              ))}
                            </Input>
                          </div>
                        </FormGroup>
                      </Col>
                    )}
                    {currentPlan?.static_ip_bind ? (
                      <>
                        {/* <Col md="3">
                          <FormGroup>
                            <div className="input_wrap">
                              <Label className="kyc_label">Static IP Cost Per Month </Label>
                              <Input
                                className="form-control digits not-empty"
                                type="text"
                                value={props.serviceobjdata?.is_static_ip === 1 ? 0: staticIPCost?.cost_per_ip}
                                disabled={true}
                                name="static_ip_cost"
                              />
                            </div>
                          </FormGroup>
                        </Col> */}
                      </>
                    ) : (
                      <Col md="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Label className="kyc_label">Static IP Cost
                              {/* Per Month  */}
                            </Label>
                            <Input
                              className="form-control digits not-empty"
                              type="text"
                              value={getCalculations?.radius_info?.static_ip_total_cost}
                              disabled={true}
                              name="static_ip_cost"
                            />
                          </div>
                        </FormGroup>
                      </Col>

                    )}

                  </>
                ) : (
                  ""
                )}
              </Row>
              <Row style={{ marginTop: "3%" }}>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        name="amount"
                        className={`form-control digits not-empty ${changeplan && changeplan.amount ? "not-empty" : ""
                          }`}
                        value={
                          props.serviceobjdata &&
                          parseFloat(props?.serviceobjdata?.plan_cost).toFixed(2)
                        }
                        type="number"
                        onChange={handleChange}
                        disabled={true}
                      />
                      <Label className="form_label">Plan Amount</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="number"
                        onChange={handleChange}
                        disabled={true}
                        className="form-control digits not-empty"
                        name="changeplan_finalamount"
                        value={
                          Withoutwalletamount &&
                          parseFloat(Withoutwalletamount).toFixed(2)
                        }
                      />
                      <Label className="form_label">
                        Final Amount To Be Paid
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col
                  sm="3"
                >
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        onChange={handleCustomerPaidChange}
                        name=""
                        className="form-control"
                        type="number"
                        min="0"
                        onKeyDown={(evt) =>
                          (evt.key === "e" ||
                            evt.key === "E" ||
                            evt.key === "." ||
                            evt.key === "-") &&
                          evt.preventDefault()
                        }
                      />
                      <Label className="form_label">Customer Paid</Label>
                    </div>
                    {errorMessage && <span className="errortext" style={{ position: "relative", top: "-25px" }}>{errorMessage}</span>}
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <Input
                    onChange={(e) => setWalletAmountCal(e.target.value)}
                    name=""
                    className="form-control"
                    type="number"
                    min="0"
                    value={storedWalletAmount}
                    disabled={true}
                    onKeyDown={(evt) =>
                      (evt.key === "e" ||
                        evt.key === "E" ||
                        evt.key === "." ||
                        evt.key === "-") &&
                      evt.preventDefault()
                    }
                  />
                  <Label className="form_label">Wallet Amount</Label>
                  <div style={{ position: "relative", top: "-25px" }}>
                    <span className="errortext">{walletCOst?.check === false && `Wallet amount of max ${(walletCOst?.remaining_wallet_amount).toFixed(2)} RS. is allowed.`}</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control digits not-empty"
                        type="text"
                        value={startDate}
                        name="paid_date"
                        onChange={handleChange}
                        disabled={true}
                      />

                      <Label for="meeting-time" className="form_label">
                        Start Date
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control digits not-empty"
                        type="text"
                        value={getcalculatedduedate(
                          props.serviceobjdata.time_unit +
                          props.serviceobjdata.offer_time_unit,
                          props.serviceobjdata.unit_type
                        )}
                        name=""
                        onChange={handleChange}
                        disabled={true}
                      />

                      <Label for="meeting-time" className="form_label">
                        Due Date
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control digits not-empty"
                        type="text"
                        value={moment(currentPlan?.plan_start_date).format("DD MMM YYYY,h:mm a")}
                        name=""
                        onChange={handleChange}
                        disabled={true}
                      />

                      <Label for="meeting-time" className="form_label">
                        Last Renewal Date
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
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
                        <option value="" style={{ display: "none" }}></option>
                        <option value="BNKTF">Bank Transfer</option>
                        <option value="CASH">Cash</option>
                        <option value="CHEK">Cheque</option>
                        <option value="GPAY">Google Pay</option>
                        <option value="PAYTM">PayTM</option>
                        <option value="PHNPE">PhonePe</option>
                      </Input>

                      <Label className="form_label"> Payment Method *</Label>
                      <span className="errortext">
                        {errors.payment_method && "Field is required"}
                      </span>
                    </div>
                  </FormGroup>
                </Col>
              </Row>


              <Row>

                <Col
                  sm="3"
                  style={{
                    textAlign: "left",
                    marginTop: "-19px"
                  }}
                  hidden={refrence != "BNKTF"}
                >
                  <Label
                    className="kyc_label"
                    style={{ marginTop: "-18px" }}
                  >
                    Bank Reference No. *
                  </Label>
                  <Input
                    onChange={handleChange}
                    name="bank_reference_no"
                    className="form-control"
                    type="text"
                  />
                  <span className="errortext">
                    {errors.bank_reference_no}
                  </span>
                </Col>
                <Col
                  sm="3"
                  style={{
                    textAlign: "left",
                    // marginTop: "-11px"
                    marginTop: "-21px",
                  }}
                  hidden={refrence != "GPAY" && refrence != "PHNPE"}
                >
                  <Label className="kyc_label">UTR No. *</Label>
                  <Input
                    onChange={handleChange}
                    name="upi_reference_no"
                    className="form-control"
                    type="text"
                  />
                  <span className="errortext">
                    {errors.upi_reference_no}
                  </span>
                </Col>
                <Col
                  sm="3"
                  style={{
                    textAlign: "left",
                    marginTop: "-21px",
                  }}
                  hidden={chequeno != "CHEK"}
                >
                  <Label className="kyc_label"> Cheque No. *</Label>
                  <Input
                    onChange={handleChange}
                    name="check_reference_no"
                    className="form-control"
                    type="text"
                  />
                  <span className="errortext">
                    {errors.check_reference_no}
                  </span>
                </Col>
                <Col sm="3" style={{ textAlign: "left" }}>
                  <span class="uploadimagekyc">
                    Upload Receipt
                    <Input
                      name="payment_receipt"
                      onChange={UploadImage}
                      className="form-control"
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
                <ModalFooter>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      disabled={loading || errorMessage ? true : !isokbuttons}
                      onClick={changeAlert}
                      id="accept_button"
                    >
                      Change plan
                    </Button>
                    &nbsp;
                  </Stack>
                  <button
                    type="button"
                    name="submit"
                    className="btn btn-secondary"
                    onClick={() => {
                      props.Verticalcentermodaltoggle1();
                      props.setServiceobjdata({});
                    }}
                    id="resetid"
                  >
                    Cancel
                  </button>
                </ModalFooter>
              </Col>

              {/* Change plan alert */}

              <Modal
                isOpen={changeYes}
                toggle={changeAlert}
                centered
                backdrop="static"
              >
                <ModalBody s>
                  {/* <p>{"Are you sure you want to Change plan?"}</p> */}
                  <p style={{ textAlign: "center" }}> {paymentModal}</p>
                </ModalBody>
                <ModalFooter>
                  {responseData?.plan_name ? (
                    <Button
                      variant="contained"
                      type="button"
                      onClick={closeButton}
                      id="resetid"
                    >
                      {"Close"}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={changeplanSubmit}
                      type="button"
                      disabled={yesButton}
                    // id="yes_button"
                    >
                      {"Yes"}
                    </Button>
                  )}

                  {yesButton ? (
                    ""
                  ) : (
                    <button
                      type="button"
                      name="submit"
                      className="btn btn-secondary"
                      onClick={() => {
                        props.Verticalcentermodaltoggle1();
                        props.setServiceobjdata({});
                      }}
                    >
                      No
                    </button>
                  )}
                </ModalFooter>
              </Modal>
            </Form>
          </div>
        ) : (
          ""
        )}
        {onlinefield ? (
          
          <div>
            <StaticIpDetails istelShow={istelShow}
              currentPlan={currentPlan}
              handleChange={handleChange}
              ipPool={ipPool}
              setSelectStatic={setSelectStatic}
              strAscending={strAscending}
              staticshow={staticshow}
              staticipcost={staticipcost}
              staticIPCost={staticIPCost}
              totalStaticCost={freeStaticIPCost}
            />
              <Label>
                   <b style={{ fontSize: "18px" }}>Total Amount Payable : {getCalculations &&
                                parseFloat(getCalculations?.amount).toFixed(2)}</b>{" "}
                   &nbsp;&nbsp;
                 </Label>
             <PaymentGatewayOptions  paymentGateways={paymentGateways} selectedGateway={selectedGateway} handleGatewayClick={handleGatewayClick}/>
            <ModalFooter>
              <Button
                type="submit"
                variant="contained"

                onClick={successModal}
                disabled={!isokbuttons}
                id="accept_button"
              >
                {loadingPay ? " Payment Processing " : "Change plan "}
              </Button>
              <button
                type="button"
                name="submit"
                className="btn btn-secondary"
                onClick={() => {
                  props.Verticalcentermodaltoggle1();
                  props.setServiceobjdata({});
                }}
                id="resetid"
              >
                Cancel
              </button>
            </ModalFooter>
          </div>
        ) : (
          ""
        )}

        <Modal isOpen={paymentstatus} toggle={Paymentmodaltoggle} centered>
          <ModalBody>
            <p>{"You do not have enough balance"}</p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="contained"
              onClick={() => {
                props.Verticalcentermodaltoggle1();
                props.setServiceobjdata({});
              }}
            >
              {"Ok"}
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={sucModal} toggle={successModal} centered backdrop="static">
          <ModalBody>
            <p>{paymentModal}</p>
          </ModalBody>
          
          <ModalFooter>
          {errorModal ? (
           
            <Button
            type="button"
            name="submit"
            className="btn btn-secondary"
            onClick={() => {
              props.Verticalcentermodaltoggle1();
              props.setServiceobjdata({});
            }}
          >
            Ok
          </Button>):(
             <>
            <Button
              variant="contained"
              type="button"
              onClick={() => {
                // setShowPayment(true);
                changeplanOnline();
              }}
              disabled={yesButton}
            // id="yes_button"
            >
              {"Yes"}
            </Button>


            <button
              type="button"
              name="submit"
              className="btn btn-secondary"
              onClick={() => {
                props.Verticalcentermodaltoggle1();
                props.setServiceobjdata({});
              }}
            >
              No
            </button>
            </>
            )}
          </ModalFooter>

        </Modal>
      </>) : (
      <Box >
        <Skeleton />
        <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} />
        <Skeleton animation={false} />
      </Box>
    )}
    </>
  );
};
export default Changeplan;
