import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Input, Modal, ModalFooter, ModalBody, Label, Table, Form, ModalHeader, FormGroup, CardBody, Card, CardHeader } from "reactstrap";
import moment from "moment";
import { toast } from "react-toastify";
import { Accordion } from "react-bootstrap";
import Button from "@mui/material/Button";
import useFormValidation from "../../customhooks/FormValidation";
import { customeraxios, networkaxios, adminaxios,billingaxios } from "../../../axios";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import ReconnectingWebSocket from "reconnecting-websocket";
import StaticIpDetails from "./staticIpDeatils"
import axios from "axios"
import PaymentGatewayOptions from "./paymentGateWayOptions";
const UpgradeDaysPlan = (props) => {
  // payment modal
  const PAYMENTSUCCESS = "Your payment was successful";
  const PAYMENTFAILD = "Your payment was failed, Please try again later.";
  const [alertMessage, setAlertMessage] = useState(null);
  const [paymentstatus, setPaymentstatus] = useState(false);
  const Paymentmodaltoggle = () => setPaymentstatus(!paymentstatus);
  // customer paid amount
  const [customerPaid, setCustomerPaid] = useState('')
  const [storedWalletAmount, setStoredWalletAmount] = useState(0);
  //   disable button
  const [isokbuttons, setIsokbuttons] = useState(true);
  const [yesButton, setYesButton] = useState(false);
  const [sucModal, setSucModal] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);
  const successModal = () => {
    if (sucModal) {
      setLoadingPay(false);
    }
    setSucModal(!sucModal);
  };
  const [refrence, setRefrence] = useState();
  const [chequeno, setChequeno] = useState();
  const [bankno, setBankno] = useState();
  const [responseData, setResponseData] = useState();
  const [errorResponse, setErrorResponse] = useState();
  const [staticIPCost, setStaticIPCost] = useState({});
  const [errorModal, setErrorModal] = useState(false);
  const [upgradeData, setUpgradeData] = useState({
    payment_receipt: null,
    upgradeplan_finalamount: "",
    use_wallet: "",
    wallet_amount: "",
    payment_method: ""
  });

  const [errors, setErrors] = useState({});
  const [expanded3, setexpanded3] = useState(true);
  const Accordion3 = () => {
    setexpanded3(!expanded3);
  };
  const [startDate, setStartDate] = useState(moment().format("DD MMM YYYY,h:mm a"));
  // offlie and online methods
  const [offlinefield, setOfflinefield] = useState(false);
  const [onlinefield, setOnlinefield] = useState(true);
  const offline = () => {
    setOfflinefield(true);
    setOnlinefield(false);
  };
  const online = () => {
    setOnlinefield(true);
    setOfflinefield(false);
  };
  //state for discount amount
  const [discountamountupgradeplan, setDiscountamountupgradeplan] = useState(false);
  const [ondiscountcheckupgradeplan, setOndiscountcheckupgradeplan] = useState(null);
  const [discounttoggleupgradeplan, setDiscounttoggleupgradeplan] = useState("off");
  //wallet Amount states
  const [walletUpgradeAmount, setWalletUpgardeAmount] = useState()
  //state for wallet amount checked
  const [upgradeplanwalletamountcheckbox, setupgradeplanwalletamountcheckbox] = useState(false);
  //state for getting api data into state
  const [upgradeplandataoncheck, setUpgradeplandataoncheck] = useState({});
  //end
  // toggle show static ip details
  const [staticToggle, setStaticToggle] = useState("off")
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
  useEffect(() => {
    if (props.serviceobjdata?.is_static_ip === 1) {
      setStaticToggle("on");
      setTelIsShow(true);
    } else if (props.serviceobjdata?.is_static_ip === 0) {
      setStaticToggle("off");
      setTelIsShow(false);
    }
  }, [props.serviceobjdata]);

  // toggle show for alreday static ip
  const [staticipToggle, setStaicIpToggle] = useState("on")
  const [staticshow, setStaticShow] = useState(true)
  function showStaticipToggle() {
    setStaicIpToggle(staticipToggle === "on" ? "off" : "on")
    setStaticShow(!staticshow)
  }

  // ippools
  const [selectStatic, setSelectStatic] = useState()
  // 2days plan checking
  const [twoDays, SetTwoDays] = useState({});
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

  // sttaic iplist
  const [staticIP, setStaticIP] = useState([]);
  // static ip
  const getStaticIP = (val) => {
    networkaxios.get(`network/ippool/used_ips/${val}`).then((res) => {
      let { available_ips } = res.data;
      setStaticIP([...available_ips]);
      setStaticIPCost(res.data);
    });
  };
  const strAscending = [...staticIP]?.sort((a, b) => a.ip > b.ip ? 1 : -1,);



  // get waillet amount
  const [walletAmountcal, setWalletAmountCal] = useState(0);
  // checking all calculations
  const [getCalculations, setGetCalculations] = useState()
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const source = axios.CancelToken.source();

    let data = {
      use_wallet: upgradeplanwalletamountcheckbox,
      discount: Number(ondiscountcheckupgradeplan),
      service_plan: props.serviceobjdata.id,
    };

    if (istelShow === true || SHowIpBind) {
      data.radius_info = radiusInfoIds;
    } else {
      delete data.radius_info;
    }

    data.balance = currentPlan.balance_by_days;
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
    if (props.serviceobjdata.id) {
      setLoading(true);
      customeraxios
        .post(`customers/get/update/amount/${customerInfo.id}`, data, {
          cancelToken: source.token,
        })
        .then((res) => {
          setGetCalculations(res.data);
          console.log(res.data);
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
    upgradeplanwalletamountcheckbox,
    istelShow,
    props.serviceobjdata,
    staticshow,
    ondiscountcheckupgradeplan,
    staticIP,
    selectStatic,
  ]);


  // const Totalwithwalletamount = Number(getCalculations?.amount) + Number(walletAmountcal)
  const Withoutwalletamount = Number(getCalculations?.amount);
  const Totalwithwalletamount = Number(getCalculations?.amount) + Number(storedWalletAmount)


  // plan upgarde
  const [currentPlan, setCurrentPlan] = useState({});
  useEffect(() => {
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
    customeraxios
      .get(`/customers/check/customer/${customerInfo.id}/plan/date`)
      .then((res) => {
        SetTwoDays(res.data);
      });
    customeraxios.get("/customers/enh/plan/data/" + customerInfo.id).then((res) => {
      setCurrentPlan(res.data);
      setUpgradeplandataoncheck(res.data);
      setUpgradeData((preState) => {
        return {
          ...preState,
          upgradeplan_finalamount:
            props.serviceobjdata && parseFloat(amountpayable).toFixed(2),
        };
      });
    });
  }, [props.id, props.serviceobj]);

  const [paymentModal, setPaymentPaymentModal] = useState(
    "Are you sure you want to Upgrade plan?"
  );
  useEffect(() => {
    let changeplanMeassage = "Are you sure you want to Change Plan ?  ";
    setPaymentPaymentModal(changeplanMeassage + twoDays?.detail);
    SetTwoDays(twoDays);
  }, [twoDays]);
  //use effect for autopopulating final amount field
  useEffect(() => {
    const totalCOst = props.serviceobjdata && Number(amountpayable) + Number(upgradeplanwalletamountcheckbox === false && istelShow === true || SHowIpBind ? (currentPlan?.radius_info?.static_ip_total_cost / currentPlan?.plan_time_unit) * props.serviceobjdata.time_unit : 0)
      + sendGST + Number(upgradeplanwalletamountcheckbox === true && istelShow === true ? staticIPCost?.cost_per_ip * props.serviceobjdata.time_unit : 0);
    console.log(totalCOst, "totalCOst")

    let upgradeplan_finalamount =
      props.serviceobjdata && parseFloat(amountpayable).toFixed(2);
    let wallet_amount;
    if (upgradeplanwalletamountcheckbox) {
      if (
        upgradeplandataoncheck.customer_wallet_amount == 0 &&
        props.serviceobjdata
      ) {
        upgradeplan_finalamount = parseFloat(amountpayable).toFixed(2);
        wallet_amount = upgradeplandataoncheck.customer_wallet_amount
      } else if (
        upgradeplandataoncheck &&
        props.serviceobjdata &&
        upgradeplandataoncheck.customer_wallet_amount <
        totalCOst
      ) {
        upgradeplan_finalamount =
          totalCOst -
          upgradeplandataoncheck.customer_wallet_amount;
        wallet_amount = upgradeplandataoncheck.customer_wallet_amount;
      } else if (
        upgradeplandataoncheck &&
        props.serviceobjdata &&
        upgradeplandataoncheck.customer_wallet_amount >
        parseFloat(amountpayable).toFixed(2)
      ) {
        upgradeplan_finalamount = 0;
        wallet_amount = totalCOst;
      }
    }
    setWalletUpgardeAmount(wallet_amount);
    setUpgradeData((preState) => {
      return {
        ...preState,
        upgradeplan_finalamount: upgradeplan_finalamount,
      };
    });
  }, [upgradeplanwalletamountcheckbox, currentPlan, istelShow, staticshow]);
  //end


  const amountpayable =
    parseFloat(
      props.serviceobjdata ? props.serviceobjdata.total_plan_cost : 0
    ).toFixed(2) - parseFloat(currentPlan ? currentPlan.balance_by_monthly : 0).toFixed(2);

  const TotalGSTs = props?.serviceobjdata?.plan_sgst === 0 ? (props.serviceobjdata?.total_plan_cost) * .18 : 0;
  const enableStaticGST = istelShow === true && TotalGSTs
  const TOTALGSTS = props?.serviceobjdata?.plan_sgst === 0 && istelShow === false && staticshow === true ? (props.serviceobjdata.total_plan_cost) * .18 : 0;
  const sendGST = currentPlan?.radius_info?.static_ip_bind ? TOTALGSTS : enableStaticGST

  // calculation static ip 
  const staticipcost = currentPlan?.radius_info && (staticshow ? (currentPlan?.radius_info?.static_ip_total_cost / currentPlan?.plan_time_unit) * props.serviceobjdata.time_unit : null);
  const totalStaticCost = parseFloat(parseFloat(staticIPCost?.cost_per_ip * props.serviceobjdata.time_unit ? staticIPCost?.cost_per_ip * props.serviceobjdata.time_unit : 0))
  // static ip free 
  //  const freeStaticIPCost = props.serviceobjdata?.is_static_ip === 1 ?0 : totalStaticCost
  const freeStaticIPCost = getCalculations?.radius_info?.static_ip_total_cost

  const enablestaticIP = istelShow ? totalStaticCost : 0
  const totalStatic = Number(upgradeplanwalletamountcheckbox === false && enablestaticIP) + Number(upgradeData.upgradeplan_finalamount) + Number(upgradeplanwalletamountcheckbox === false && staticipcost) + Number(upgradeplanwalletamountcheckbox === false && sendGST)
  //handle click for wallet amount check box
  const handleClick = (e) => {
    setupgradeplanwalletamountcheckbox(e.target.checked);
  };
  const handleChange = (e, date) => {
    setUpgradeData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setGetCalculations((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name == "ippool") {
      getStaticIP(e.target.value);
    }
  };
  const [imgSrc, setImgSrc] = React.useState(null);

  async function UploadImage(e) {
    let img = URL.createObjectURL(e.target.files[0]);
    setImgSrc(img);
    let preview = await getBase64(e.target.files[0]);

    setUpgradeData((preState) => ({
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


  // checking ippool condition
  const hideandSHowIPool =
    staticshow ? {
      plan: props.serviceobjdata.id,
      area: currentPlan.area,
      ippool: Number(upgradeData?.ippool) ? Number(upgradeData?.ippool) : Number(currentPlan?.radius_info?.ippool),
    }
      : {
        plan: props.serviceobjdata.id,
        area: currentPlan.area,
      }
  // upgrade plan online
  const upgradeplanOnline = () => {
    setPaymentPaymentModal("your payment is processing .....!");
    setIsokbuttons(false);
    setYesButton(true);
    const obj = {
      plan: props.serviceobjdata.id,
      area: currentPlan.area,
    };
    const objwithPool = hideandSHowIPool
    adminaxios.post(`wallet/priorcheck`, Number(upgradeData?.ippool) || currentPlan?.radius_info?.ippool ? objwithPool : obj).then((res) => {
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
  const StaticIPBIND = istelShow === false && staticshow === true;
  const SHowIpBind = currentPlan?.radius_info?.static_ip_bind ? StaticIPBIND : null
  // const GSTAssinged = 

  const hideandSHowstaticIP = istelShow === true || SHowIpBind ?
    {
      id: currentPlan?.radius_info?.id ? currentPlan?.radius_info?.id : null,
      static_ip_bind: upgradeData?.static_ip_bind ? upgradeData.static_ip_bind : currentPlan?.radius_info?.static_ip_bind,
      ippool_id: upgradeData?.ippool ? upgradeData.ippool : currentPlan?.radius_info?.ippool,


    } : null


  const hideandSHowstaticIP1 = istelShow === true || currentPlan?.radius_info?.static_ip_bind && StaticIPBIND ?
    {
      static_ip_bind: upgradeData?.static_ip_bind ? upgradeData.static_ip_bind : currentPlan?.radius_info?.static_ip_bind,
      ippool_id: upgradeData?.ippool ? upgradeData.ippool : currentPlan?.radius_info?.ippool,


    } : null

  // checking radiusinfo id
  const radiusInfoIds = currentPlan?.radius_info?.id ? hideandSHowstaticIP : hideandSHowstaticIP1
  // online plan api
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
        // paymentId(response.data);
      }).catch((error) => {
        setYesButton(false);
        setErrorModal(true)
        setPaymentPaymentModal(PAYMENTFAILD);
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.detail);
        }
      })
  };

  // websocket connection
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
        // submit(responseData.invoice_id);
        // setLoadingPay(false);
        props.Verticalcentermodaltoggle1();
        setAlertMessage(PAYMENTSUCCESS);
      } else if (responseData.status == 3) {
        successModal(true)
        setSucModal(true)
        setPaymentPaymentModal(PAYMENTFAILD);
      } else if (responseData.status == 2) {
        successModal(true);
        setSucModal(true)
        setPaymentPaymentModal("Your payment is processing...");
      }
    };
  };





  // upgrade plan offline
  const upgradeSubmit = (e, id) => {
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
      .post(`wallet/priorcheck`, Number(upgradeData?.ippool) || currentPlan?.radius_info?.ippool ? objwithPool : obj)
      .then((res) => {
        if (res.data.check == true) {
          e.preventDefault();
          let data = { ...getCalculations };
          // let data = { ...upgradeData };
          data.amount = Totalwithwalletamount;

          // data.amount = amountpayable;
          // data.amount = parseFloat(upgradeData.upgradeplan_finalamount).toFixed(2)
          data.discount_amount = parseFloat(
            (ondiscountcheckupgradeplan * amountpayable) / 100
          ).toFixed(2);
          data.paid_date = moment(upgradeData.paid_date).format("YYYY-MM-DD");
          data.plan = props.serviceobjdata.id;
          data.gst = {
            cgst: props.serviceobjdata.plan_cgst,
            sgst: props.serviceobjdata.plan_sgst,
          };
          data.use_wallet = upgradeplanwalletamountcheckbox;
          if (upgradeplanwalletamountcheckbox === true) {
            data.wallet_amount = walletUpgradeAmount;
          } else {
            data.wallet_amount = 0;
          }
          delete data.upgradeplan_finalamount;
          // data.radius_info = radiusInfoIds;
          // data.radius_info = radiusInfoIds

          if (upgradeData.payment_method === "BNKTF") {

            data.bank_reference_no = upgradeData.bank_reference_no;
          } else {
            delete data.bank_reference_no
          }
          if (upgradeData.payment_method === 'CHEK') {
            data.check_reference_no = upgradeData.check_reference_no
          } else {
            delete data.check_reference_no
          }
          if (upgradeData.payment_method === 'GPAY' || upgradeData.payment_method === 'PHNPE') {
            data.upi_reference_no = upgradeData.upi_reference_no
          } else {
            delete data.upi_reference_no
          }
          delete data.static_ip_bind;
          delete data.static_ip_cost;
          delete data.ippool;
          data.payment_method = upgradeData.payment_method;

          data.paid_to = JSON.parse(localStorage.getItem("token"))?.id;
          let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
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
                  document.getElementById("hiddenBtn").click();
                });
                // Sailaja Modified Toast message from Plan update successfully  to Plan updated successfully on 28th March 2023
                toast.success("Plan updated successfully", {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 1000,
                });
              })();
              // props.Verticalcentermodaltoggle1();
              // props.Refreshhandler();
              setYesButton(false);
            })
            .catch(function (error) {
              setPaymentPaymentModal(PAYMENTFAILD);
              setYesButton(false);
              toast.error("Something went wrong", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
              });
              console.error("Something went wrong!", error);
            });
        }
      }).catch(function (error) {
        setErrorResponse(error.response);
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
          setUpgradeYes(!upgradeYes);
        }
        if (res.data.check === false) {
          setIsokbuttons(true)

        }
      }).catch((err) => {
        setIsokbuttons(false)
      })
  }

  const requiredFields = ["payment_method"];
  const requiredFieldsbank = ["payment_method", "bank_reference_no"];
  const requiredFieldsUTR = ['upi_reference_no', 'payment_method'];
  const requiredFieldscheck = ["check_reference_no", 'payment_method'];
  const { validate, Error } = useFormValidation(upgradeData.payment_method === "BNKTF" ? requiredFieldsbank : upgradeData.payment_method === "GPAY" || upgradeData.payment_method === "PHNPE" ? requiredFieldsUTR : upgradeData.payment_method === "CHEK" ? requiredFieldscheck : requiredFields);
  // duew date

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
    console.log(addUnitType);
    console.log(new_date);
    return new_date;
  };

  //  space in selected option
  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  const handlesearchChange = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = props.serviceplanobjbkp.filter((data) => {
      console.log(data);
      if (
        data.package_name.toLowerCase().search(value) != -1 ||
        (data.fup_limit + "").toLowerCase().search(value) != -1 ||
        (data.upload_speed + "").toLowerCase().search(value) != -1 ||
        (data.download_speed + "").toLowerCase().search(value) != -1 ||
        (data.plan_cost + "").toLowerCase().search(value) != -1
      )
        return data;
    });
    props.setServiceplanobj(result);
  };

  const searchInputField = useRef(null);

  useEffect(() => {
    props.setServiceplanobj([...props.serviceplanobjbkp]);
  }, [props.upgradeRenewChangePlan]);

  //use effect for discount
  useEffect(() => {
    let finalAmountdiscount =
      (ondiscountcheckupgradeplan * parseFloat(amountpayable).toFixed(2)) / 100;
    setUpgradeData((prevState) => {
      return {
        ...prevState,
        upgradeplan_finalamount: parseFloat(
          amountpayable - finalAmountdiscount
        ).toFixed(2),
      };
    });
  }, [ondiscountcheckupgradeplan]);
  //end

  // toggle show and hide function
  function discountshowhide() {
    setDiscounttoggleupgradeplan(
      discounttoggleupgradeplan === "off" ? "on" : "off"
    );
    setDiscountamountupgradeplan(!discountamountupgradeplan);
    if (discounttoggleupgradeplan === "on") {
      setOndiscountcheckupgradeplan(0);
    }
  }
  //end
  //use effect for autopopulating final amount field
  useEffect(() => {
    let upgradeplan_finalamount = !isNaN(amountpayable)
      ? parseFloat(amountpayable).toFixed(2)
      : 0;
    setUpgradeData((preState) => {
      return {
        ...preState,
        upgradeplan_finalamount: upgradeplan_finalamount,
      };
    });
  }, [props.serviceobjdata, currentPlan]);

  // upgrade plan alertMessage
  const [upgradeYes, setUpgradeYes] = React.useState(false);
  const upgradeAlert = () => {
    const validationErrors = validate(upgradeData)
    const noErrors = Object.keys(validationErrors).length === 0
    setErrors(validationErrors)
    if (noErrors) {
      // setUpgradeYes(!upgradeYes);
      checkWalletSubmit();

    }
  }
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
      setOndiscountcheckupgradeplan(e.target.value);
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
              <Table className="table-border-vertical">
                <thead>
                  <tr>
                    <th scope="col">{"Package Name"}</th>
                    <th scope="col">{"FUP Limit"}</th>
                    <th scope="col">{"Upload Speed"}</th>
                    <th scope="col">{"Download Speed"}</th>
                    <th scope="col">{"Plan Cost"}</th>
                    <th scope="col">{"Tax"}</th>
                    <th scope="col">{"Total Plan Cost"}</th>
                    <th scope="col">{"Duration"}</th>
                  </tr>
                </thead>
                <tbody>
                  {props.serviceplanobj.map((services) => (
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
                              onChange={(e) => props.setServiceobjdata(services)}
                            />
                            {services.package_name}
                          </Label>
                        </>
                      </td>
                      <td>{parseFloat(services.fup_limit).toFixed(0)}</td>
                      <td>
                        {parseFloat(services.upload_speed).toFixed(0) + "Mbps"}
                      </td>
                      <td>
                        {parseFloat(services.download_speed).toFixed(0) + "Mbps"}
                      </td>
                      <td>₹ {parseFloat(services.plan_cost).toFixed(2)}</td>
                      <td>
                        {services.plan_cgst ?
                          <>
                            ₹ {parseFloat(services.plan_cost * 0.18).toFixed(2)}
                          </>
                          : "₹ 0"
                        }
                      </td>
                      <td>
                        ₹{" "}
                        {parseFloat(
                          // services.plan_cost + services.plan_cost * 0.18
                          services.total_plan_cost
                        ).toFixed(2)}
                      </td>
                      <td>{services.time_unit + services.offer_time_unit + services.unit_type + "(s)"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col sm="6">
            <Accordion defaultActiveKey="0">
              <CardBody style={{ marginTop: "20px", padding: "0px" }}>
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
                          <h5>Current Plan</h5>
                        </Accordion.Toggle>
                      </h5>
                    </CardHeader>
                    <Accordion.Collapse eventKey="3">
                      <CardBody style={{ border: "none" }}>
                        {Object.keys(currentPlan).length > 0 && (
                          <>
                            <p>
                              {" "}
                              <b>Package Name:</b>
                              {currentPlan && currentPlan.plan_name}
                            </p>
                            <p>
                              {" "}
                              <b> Plan Cost: ₹</b>
                              {currentPlan &&
                                parseFloat(currentPlan.plan_cost).toFixed(2)}
                            </p>
                            <p>
                              {" "}
                              <b>Upload Speed:</b>
                              {currentPlan.upload_speed &&
                                parseFloat(currentPlan.upload_speed).toFixed(0) +
                                "Mbps"}
                            </p>
                            <p>
                              {" "}
                              <b> Download Speed:</b>
                              {currentPlan.download_speed &&
                                parseFloat(currentPlan.download_speed).toFixed(
                                  0
                                ) + "Mbps"}
                            </p>
                            <p>
                              {" "}
                              <b>Fup Limit:</b>
                              {currentPlan.fup_limit &&
                                parseFloat(currentPlan.fup_limit).toFixed(0) +
                                "GB"}
                            </p>
                            <p>
                              {" "}
                              <b>Usage Cost: ₹</b>
                              {currentPlan?.plan_usage_cost_by_days &&
                                parseFloat(currentPlan?.plan_usage_cost_by_days).toFixed(0)}
                            </p>
                            <p>
                              {" "}
                              <b>Plan Start Date:</b>
                              {currentPlan.plan_start_date &&
                                moment(currentPlan.plan_start_date).format("l")}
                            </p>
                            <p>
                              {" "}
                              <b>No.of Consumption Days:</b>
                              {currentPlan.total_days &&
                                parseFloat(currentPlan.total_days).toFixed(0)}
                            </p>
                            <p>
                              {" "}
                              <b>Remaining Balance: ₹</b>
                              {currentPlan?.balance_by_monthly &&
                                parseFloat(currentPlan?.balance_by_monthly).toFixed(0)}
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
                          eventKey="4"
                          aria-expanded={expanded3}
                        >
                          <h5>New Plan</h5>
                        </Accordion.Toggle>
                      </h5>
                    </CardHeader>
                    <Accordion.Collapse eventKey="4">
                      <CardBody style={{ border: "none" }}>
                        {Object.keys(props.serviceobjdata).length > 0 ? (
                          <>
                            <h5> New Plan</h5>
                            <p>
                              {" "}
                              <b> Package Name:</b>
                              {props.serviceobjdata &&
                                props.serviceobjdata.package_name}
                            </p>
                            <p>
                              {" "}
                              <b> Plan Cost: ₹</b>
                              {props.serviceobjdata &&
                                parseFloat(
                                  props.serviceobjdata.total_plan_cost
                                ).toFixed(2)}
                            </p>
                            <p>
                              {" "}
                              <b> Upload Speed:</b>
                              {props.serviceobjdata &&
                                parseFloat(
                                  props.serviceobjdata.upload_speed
                                ).toFixed(0) + "Mbps"}
                            </p>
                            <p>
                              {" "}
                              <b>Download Speed:</b>
                              {props.serviceobjdata &&
                                parseFloat(
                                  props.serviceobjdata.download_speed
                                ).toFixed(0) + "Mbps"}
                            </p>
                            <p>
                              {" "}
                              <b> FUP Limit:</b>
                              {props.serviceobjdata &&
                                parseFloat(
                                  props.serviceobjdata.fup_limit
                                ).toFixed(0) + "GB"}
                            </p>
                            <p>
                              {" "}
                              <b> Validity:</b>
                              {props.serviceobjdata &&
                                props.serviceobjdata.time_unit +
                                " " +
                                props.serviceobjdata.unit_type}
                            </p>
                          </>
                        ) : (
                          ""
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
                  }
                </>}
            </FormGroup>
          </Col>
        </Row>

        <br />

        {offlinefield ? (
          <div>
            <Form id="myForm" onSubmit={checkWalletSubmit}>
              <Row style={{ marginLeft: "0px" }}>
                <Col sm="4" style={{ marginTop: "-65px" }}>
                  <div className="checkbox checkbox-dark">
                    <Input
                      id="checkbox1"
                      type="checkbox"
                      onClick={handleClick}
                      // onChange={handleClick}
                      checked={upgradeplanwalletamountcheckbox}
                      name="use_wallet"
                      value={upgradeData && upgradeData.use_wallet}
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
                  <>
                    <Label className="desc_label">Discount</Label> &nbsp;&nbsp;
                    <div style={{ top: "7px" }}
                      className={`franchise-switch ${discounttoggleupgradeplan}`}
                      onClick={discountshowhide}
                    />
                  </>
                </Col>
                {/* discount code */}

                {discountamountupgradeplan ? (
                  <>
                    <Col sm="3">
                      <FormGroup>
                        <div className="input_wrap">
                          <Input
                            type="text"
                            name="discount"
                            // onBlur={checkEmptyValue}
                            onChange={(e) => {
                              discountCheck(e)
                              
                            }}
                            value={ondiscountcheckupgradeplan}
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
                            />
                          <Label className="form_label">
                            Discount (in %)
                          </Label>
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
                          <Label className="form_label">
                            Discount (in ₹)
                          </Label>
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
                            <Label
                              for="meeting-time"
                              className="kyc_label"
                            >
                              Static IP
                            </Label>
                            <Input
                              className="form-control digits not-empty"
                              type="text"
                              value={currentPlan?.radius_info?.static_ip_bind}
                              disabled={true}
                            />

                          </div>
                        </FormGroup>
                      </Col>)}
                    {currentPlan?.radius_info?.static_ip_bind &&
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Label
                              for="meeting-time"
                              className="kyc_label"
                            >
                              Static IP Cost
                            </Label>
                            <Input
                              className="form-control digits not-empty"
                              type="text"
                              // value={staticipcost ? staticipcost : currentPlan?.radius_info?.static_ip_total_cost}
                              value={getCalculations?.radius_info?.static_ip_total_cost}
                              disabled={true}
                            />

                          </div>
                        </FormGroup>
                      </Col>
                    }

                    {currentPlan?.radius_info?.ippool && (
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Label
                              for="meeting-time"
                              className="kyc_label"
                            >
                              IP Pool
                            </Label>
                            <Input
                              className="form-control digits not-empty"
                              type="text"
                              value={currentPlan?.ip_pool_name}
                              disabled={true}
                            />

                          </div>
                        </FormGroup>
                      </Col>
                    )}
                  </>
                }
                {istelShow ? (<>

                  {currentPlan?.ip_pool_name ? <>

                  </> :
                    <Col sm="3">
                      <FormGroup>
                        <div className="input_wrap">
                          <Label
                            className="kyc_label"
                          >
                            IP Pool
                          </Label>
                          <Input
                            type="select"
                            className="form-control digits"
                            onChange={handleChange}
                            name="ippool"
                          >
                            <option style={{ display: "none" }}></option>
                            {ipPool.map((ipPools) => (
                              <option
                                key={ipPools.id}
                                value={ipPools.id}
                              >
                                {ipPools.name}
                              </option>
                            ))}
                          </Input>


                        </div>
                      </FormGroup>
                    </Col>}
                  {currentPlan?.static_ip_bind ? <>
                  </> :
                    <Col sm="3">
                      <FormGroup>
                        <div className="input_wrap">
                          <Label
                            className="kyc_label"
                          >
                            Static IP
                          </Label>
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
                              <option
                                key={staticIPs.ip}
                                value={staticIPs.ip}
                              >
                                {staticIPs.ip}
                              </option>
                            ))}
                          </Input>


                        </div>
                      </FormGroup>
                    </Col>}
                  {currentPlan?.static_ip_bind ? <>
                    {/* <Col md="3">
                      <FormGroup>
                        <div className="input_wrap">
                          <Label className="kyc_label">Static IP Cost Per Month </Label>
                          <Input
                            className="form-control digits not-empty"
                            type="text"
                            value={props.serviceobjdata?.is_static_ip === 1 ? 0:staticIPCost?.cost_per_ip}
                            disabled={true}
                            name="static_ip_cost"
                          />
                        </div>
                      </FormGroup>
                    </Col> */}
                  </> :
                    <Col sm="3">
                      <FormGroup>
                        <div className="input_wrap">
                          <Label
                            for="meeting-time"
                            className="kyc_label"
                          >
                            Static IP Cost
                          </Label>
                          <Input
                            className="form-control digits not-empty"
                            type="text"
                            // value={props.serviceobjdata?.is_static_ip === 1 ? 0:staticIPCost?.cost_per_ip}
                            value={getCalculations?.radius_info?.static_ip_total_cost}
                            disabled={true}
                          />

                        </div>
                      </FormGroup>
                    </Col>
                  }


                  {currentPlan?.static_ip_cost ? "" :
                    <Col md="3">
                      <FormGroup>
                        <div className="input_wrap">

                          <Label className="kyc_label">
                            Total Amount{" "}
                          </Label>
                          <input
                            className={`form-control digits not-empty`}
                            type="number"
                            min="0"
                            onKeyDown={(evt) =>
                              (evt.key === "e" ||
                                evt.key === "E" ||
                                evt.key === "." ||
                                evt.key === "-") &&
                              evt.preventDefault()
                            }
                            value={totalStatic}
                            style={{ border: "none", outline: "none" }}
                            disabled={true}
                            id="afterfocus"
                          ></input>
                        </div>
                      </FormGroup>
                    </Col>}
                </>
                ) : ("")}
              </Row>
              <Row style={{ marginTop: "3%" }}>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        name="amount"
                        className={`form-control digits not-empty${upgradeData && upgradeData.amount ? "not-empty" : ""
                          }`}
                        value={
                          props.serviceobjdata &&
                          parseFloat(props.serviceobjdata?.total_plan_cost).toFixed(2)
                        }
                        type="number"
                        disabled={true}
                        onChange={handleChange}
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
                        name="upgradeplan_finalamount"
                        value={parseFloat(
                          Withoutwalletamount
                        ).toFixed(2)}
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
                <Col
                  sm="3"
                >

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
                          startDate,
                          props.serviceobjdata.time_unit + props.serviceobjdata.offer_time_unit,
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
                <Col sm="3" >
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
                      <Label className="form_label">
                        {" "}
                        Payment Method *
                      </Label>
                      <span className="errortext">{errors.payment_method && "Field is required"}</span>
                    </div>
                  </FormGroup>
                </Col>
              </Row>


              <Row>

                <Col
                  sm="3"
                  style={{
                    textAlign: "left",
                    // marginTop: "-11px" 
                    marginTop: "-7px"
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
                    marginTop: "-7px"
                  }}
                  hidden={refrence != 'GPAY' && refrence != 'PHNPE'}
                >
                  <Label className="kyc_label">
                    UTR No. *
                  </Label>
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
                    marginTop: "-7px"
                  }}
                  hidden={chequeno != 'CHEK'}
                >
                  <Label className="kyc_label">
                    {" "}
                    Cheque No. *
                  </Label>
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


                <Col sm="4" style={{ textAlign: "left" }}>
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
                <Col>
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
                  <Button
                    variant="contained"
                    disabled={loading || errorMessage ? true : !isokbuttons}
                    onClick={upgradeAlert}
                    id="accept_button"
                  >
                    Upgrade plan
                  </Button>
                  &nbsp;
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
              {/* upgrade alertMessage */}
              <Modal isOpen={upgradeYes} toggle={upgradeAlert} centered>
                <ModalBody>
                  <p>{paymentModal}</p>
                </ModalBody>
                <ModalFooter>
                  {responseData?.plan_name || errorResponse ? (
                    <Button
                      variant="contained"
                      type="button"
                      onClick={() => {
                        props.Verticalcentermodaltoggle1();
                        props.setServiceobjdata({});
                        props.fetchComplaints()
                      }}
                      id="resetid"
                    >
                      {"Close"}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={upgradeSubmit}
                      type="button"
                      disabled={yesButton}
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
              strAscending={strAscending}
              staticshow={staticshow}
              staticipcost={staticipcost}
              staticIPCost={staticIPCost}
              totalStaticCost={freeStaticIPCost}
              setSelectStatic={setSelectStatic}
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
                id="accept_button"
              >
                {loadingPay ? " Payment Processing " : "upgrade plan "}
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

        <Modal isOpen={sucModal} toggle={successModal} centered>
          <ModalBody>
            <p>{paymentModal}</p>
          </ModalBody>
          <ModalFooter>
          {errorModal ? (
                  <Button
                    variant="contained"
                    type="button"
                    onClick={() => {
                      props.Verticalcentermodaltoggle1();
                      props.setServiceobjdata({});
                    }}
                    id="resetid"
                  >
                    {"Ok"}
                  </Button>
                ) :(
                <>
            <Button
              variant="contained"
              type="button"
              onClick={() => {
                // setShowPayment(true);
                upgradeplanOnline()
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
      </>
    ) : (
      <Box >
        <Skeleton />
        <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} />
        <Skeleton animation={false} />
      </Box>
    )}
    </>
  );
};
export default UpgradeDaysPlan;
