import React, { useState, useEffect } from "react";
import {
  Spinner,
  Row,
  Col,
  Input,
  Modal,
  ModalFooter,
  ModalBody,
  Label,
  Form,
  FormGroup,
  CardBody,
  Card,
  CardHeader,
} from "reactstrap";
import moment from "moment";
import { toast } from "react-toastify";
import { Accordion } from "react-bootstrap";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import useFormValidation from "../../customhooks/FormValidation";
import { customeraxios, adminaxios, networkaxios, billingaxios } from "../../../axios";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import StaticIpDetails from "./staticIpDeatils";
import atom from "../../../assets/images/other-images/nttData.png";
import payu from "../../../assets/images/other-images/PayU.png";
import axios from "axios";
// websocket
import ReconnectingWebSocket from "reconnecting-websocket";
import PaymentGatewayOptions from "./paymentGateWayOptions";
const Renew = (props) => {
  const PAYMENTSUCCESS = "Your payment was successful";
  const PAYMENTFAILD = "Your payment was failed, Please try again later.";
  const [responseData, setResponseData] = useState();
  const [isokbuttons, setIsokbuttons] = useState(true);
  const [currentPlan, setCurrentPlan] = useState({});
  const [sucModal, setSucModal] = useState(false);
  const [temproryPlan, setTmproryPlan] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [renewPlan, setRenewplan] = useState({
    payment_receipt: null,
    use_wallet: "",
    final_amount: "",
    wallet_amount: "",
    payment_method: "",
  });
  const [paymentPending, setPyamentpending] = useState(false);
  const paymentPendingModal = () => {
    setPyamentpending(!paymentPending);
  };
  const [paymentstatus, setPaymentstatus] = useState(false);
  const Paymentmodaltoggle = () => setPaymentstatus(!paymentstatus);
  const [expanded3, setexpanded3] = useState(true);
  const [errors, setErrors] = useState({});
  const [staticIPCost, setStaticIPCost] = useState({});
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [selectedGatewayObj, setSelectedGatewayObj] = useState([]);
  const handleGatewayClick = (gateway) => {
    console.log("handleGatewayClick",gateway)
    setSelectedGateway(gateway?.id);
    setSelectedGatewayObj(gateway);
  };
  // toggle show static ip details
  const [staticToggle, setStaticToggle] = useState("off");
  const [istelShow, setTelIsShow] = React.useState(false);
  function staticIpToggle() {
    setStaticToggle(staticToggle === "off" ? "on" : "off");
    setTelIsShow(!istelShow);
  }
  useEffect(() => {
    if (currentPlan?.is_static_ip === true) {
      setStaticToggle("on");
      setTelIsShow(true);
    }
  }, [currentPlan]);

  useEffect(() => {
   getPaymentGateWays()
  }, []);

  // toggle show for alreday static ip
  const [staticipToggle, setStaicIpToggle] = useState("on");
  const [staticshow, setStaticShow] = useState(true);
  function showStaticipToggle() {
    setStaicIpToggle(staticipToggle === "on" ? "off" : "on");
    setStaticShow(!staticshow);
  }

  // customer paid amount
  const [customerPaid, setCustomerPaid] = useState("");
  // ippools
  const [selectStatic, setSelectStatic] = useState();
  // sttaic iplist
  const [staticIP, setStaticIP] = useState([]);
  // get waillet amount
  const [walletAmountcal, setWalletAmountCal] = useState(0);
  const [storedWalletAmount, setStoredWalletAmount] = useState(0);
  // pool list
  const [ipPool, setIpPool] = useState([]);
  //state for wallet amount checked
  const [walletamountcheckbox, setWalletamountcheckbox] = useState(false);
  // cost
  const totalStaticCost = istelShow
    ? parseFloat(
        parseFloat(
          staticIPCost?.cost_per_ip * currentPlan.plan_time_unit
            ? staticIPCost?.cost_per_ip * currentPlan.plan_time_unit
            : 0
        )
      )
    : 0;

  const TotalGSTs =
    currentPlan?.plan_sgst === 0 && istelShow === true
      ? currentPlan.plan_cost * 0.18
      : 0;
  const TOTALGSTS =
    currentPlan?.plan_sgst === 0 && istelShow === false && staticshow === true
      ? currentPlan.plan_cost * 0.18
      : 0;
  const sendGST = currentPlan?.radius_info?.static_ip_bind
    ? TOTALGSTS
    : TotalGSTs;
  const radiusInfostaticost =
    currentPlan?.radius_info &&
    (staticshow ? currentPlan?.radius_info?.static_ip_total_cost : null);
  // const totalStatic = Number(totalStaticCost) + Number(renewPlan.final_amount)
  const totalStatic =
    Number(walletamountcheckbox === false && totalStaticCost) +
    Number(renewPlan.final_amount) +
    Number(walletamountcheckbox === false && radiusInfostaticost) +
    Number(walletamountcheckbox === false && sendGST);

  const Accordion3 = () => {
    setexpanded3(!expanded3);
  };
  const [startDate, setStartDate] = useState(
    moment().format("DD MMM YYYY,h:mm a")
  );

  const [offlinerenewfield, setOfflinerenewfield] = useState(false);
  const [onlinefield, setOnlinefield] = useState(true);

  //handle click for check box
  const handleClick = (e) => {
    setWalletamountcheckbox(e.target.checked);
  };

  const [customerlist, setCustomerlist] = useState({});
  //state for discount amount
  const [discountamount, setDiscountamount] = useState(false);
  const [ondiscountcheck, setOndiscountcheck] = useState(null);
  const [discounttoggle, setDiscounttoggle] = useState("off");
  // 2days plan checking
  const [twoDays, SetTwoDays] = useState({});
  //state for displaying URT No.
  const [refrence, setRefrence] = useState();
  const [chequeno, setChequeno] = useState();
  const [bankno, setBankno] = useState();

  const [walletAmount, setWalletAmount] = useState();
const [paymentGateways,setPaymentGateways]=useState([])
  // const paymentGateways = [
  //   { id: 1, name: "Atom", imageUrl: atom },
  //   { id: 2, name: "Payu", imageUrl: payu },
  //   // Add more payment gateways as needed
  // ];
const getPaymentGateWays =()=>{
  let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
  billingaxios
  .get("/payment/cstmr/payment/gateways/" + customerInfo?.user)
  .then((res) => {
     
      console.log(res?.data,"paymentGateways");
setPaymentGateways(res?.data);
      
    })
}
  // plan upgarde
  useEffect(() => {
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
    let id = props.id ? props.id : customerInfo.id;
    customeraxios
      .get(`/customers/check/customer/${customerInfo.id}/plan/date`)
      .then((res) => {
        SetTwoDays(res.data);
      });
    customeraxios
      .get("/customers/enh/plan/data/" + customerInfo.id)
      .then((res) => {
        setCurrentPlan(res.data);
        props.setCurrentPlan(res.data);
        setCustomerlist(res.data);

        setRenewplan((preState) => {
          return {
            ...preState,
            final_amount:
              Number(res.data.plan_cost) +
              Number(
                (walletamountcheckbox === true && istelShow === true) ||
                  SHowIpBind
                  ? res.data.radius_info?.static_ip_total_cost
                  : 0
              ),
          };
        });
      });
  }, [props.id, props.serviceobj]);

  // + totalStaticCost
  //use effect for autopopulating final amount field
  useEffect(() => {
    const totalCOst =
      Number(customerlist.plan_cost) +
      Number(
        (walletamountcheckbox === true && istelShow === true) || SHowIpBind
          ? customerlist.radius_info?.static_ip_total_cost
          : 0
      ) +
      sendGST +
      Number(
        walletamountcheckbox === true && istelShow === true
          ? staticIPCost?.cost_per_ip * currentPlan.plan_time_unit
          : 0
      );

    let final_amount = customerlist.plan_cost;
    let wallet_amount;

    if (walletamountcheckbox) {
      if (customerlist.customer_wallet_amount == 0) {
        final_amount = customerlist.plan_cost;
        wallet_amount = customerlist.customer_wallet_amount;
      } else if (
        customerlist.customer_wallet_amount &&
        customerlist.customer_wallet_amount < totalCOst
      ) {
        final_amount = totalCOst - customerlist.customer_wallet_amount;
        wallet_amount = customerlist.customer_wallet_amount;
      } else if (
        customerlist.customer_wallet_amount &&
        customerlist.customer_wallet_amount > customerlist.plan_cost
      ) {
        final_amount = 0;
        wallet_amount = totalCOst;
      }
    }
    setWalletAmount(wallet_amount);

    setRenewplan((preState) => {
      return {
        ...preState,
        final_amount: final_amount,
      };
    });
  }, [currentPlan, walletamountcheckbox, istelShow, staticshow]);

  // checking all calculations
  const [loading, setLoading] = useState(false);
  const [getCalculations, setGetCalculations] = useState();
  // static ip free
  const freeStaticIPCost = getCalculations?.radius_info?.static_ip_total_cost;
  useEffect(() => {
    const source = axios.CancelToken.source();

    let data = {
      use_wallet: walletamountcheckbox,
      discount: Number(ondiscountcheck),
      service_plan: currentPlan.id,
    };

    if (istelShow === true || SHowIpBind) {
      data.radius_info = radiusInfoIds;
    } else {
      delete data.radius_info;
    }

    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
    if (currentPlan?.area) {
      setLoading(true);
      customeraxios
        .post(`customers/get/renew/amount/${customerInfo.id}`, data, {
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
    walletamountcheckbox,
    istelShow,
    staticshow,
    currentPlan,
    ondiscountcheck,
    staticIP,
    selectStatic,
  ]);

  const Withoutwalletamount = Number(getCalculations?.amount);
  const Totalwithwalletamount =
    Number(getCalculations?.amount) + Number(storedWalletAmount);
  // + Number(walletAmountcal);

  // checking ippool condition
  const hideandSHowIPool = staticshow
    ? {
        plan: currentPlan.id,
        area: currentPlan.area,
        ippool: Number(renewPlan?.ippool)
          ? Number(renewPlan?.ippool)
          : Number(currentPlan?.radius_info?.ippool),
      }
    : {
        plan: currentPlan.id,
        area: currentPlan.area,
      };

  // online renew payment priorcheck -online

  const renewOnline = () => {
    setPaymentPaymentModal("your payment is processing .....!");
    setIsokbuttons(false);
    setYesButton(true);
    const obj = {
      plan: currentPlan.id,
      area: currentPlan.area,
    };
    const objwithPool = hideandSHowIPool;

    adminaxios
      .post(
        `wallet/priorcheck`,
        Number(renewPlan?.ippool) || currentPlan?.radius_info?.ippool
          ? objwithPool
          : obj
      )
      .then((res) => {
        if (res.data.check == true) {
          // setShowPayment(true);
          submitdata();
        }
        if (res.data.check == false) {
          Paymentmodaltoggle();
        }
      });
  };

  // const StaticCostWithoutGST = totalStaticCost- TotalGST
  const StaticIPBIND = istelShow === false && staticshow === true;
  const SHowIpBind = currentPlan?.radius_info?.static_ip_bind
    ? StaticIPBIND
    : null;
  // static ip functionality for online
  const hideandSHowstaticIP =
    istelShow === true || SHowIpBind
      ? {
          id: currentPlan?.radius_info?.id
            ? currentPlan?.radius_info?.id
            : null,
          static_ip_bind: renewPlan?.static_ip_bind
            ? renewPlan?.static_ip_bind
            : currentPlan?.radius_info?.static_ip_bind,
          ippool_id: renewPlan?.ippool
            ? renewPlan?.ippool
            : currentPlan?.radius_info?.ippool,
        }
      : null;

  const hideandSHowstaticIP1 =
    istelShow === true || SHowIpBind
      ? {
          static_ip_bind: renewPlan?.static_ip_bind
            ? renewPlan?.static_ip_bind
            : currentPlan?.radius_info?.static_ip_bind,
          ippool_id: renewPlan?.ippool
            ? renewPlan?.ippool
            : currentPlan?.radius_info?.ippool,
        }
      : null;

  // added discount amount by Marieya on line 158 on 4/08/2022
  const radiusInfoIds = currentPlan?.radius_info?.id
    ? hideandSHowstaticIP
    : hideandSHowstaticIP1;

  const submitdata = () => {
    setSucModal(true);

    let obj = { ...getCalculations };

    obj.amount = Totalwithwalletamount;
    obj.payment_gateway_id=selectedGatewayObj?.id;
    obj.payment_gateway_type=selectedGatewayObj?.gateway_type;
console.log(obj,"paymentObj");
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
    
    customeraxios
      .patch("customers/enh/onl/plan/renew/" + customerInfo.id, obj)
      .then((response) => {
        setPaymentPaymentModal("your payment is processing .....!");
        // setSucModal(true);
        successModal(true);
        if (response.data.route == true) {
          paymentId(response.data.payment_id);
          var win = window.open(`${response.data.next}`, "_blank");
          win.focus();
        }
        // setCurrentPlan({});
        setPaymentPaymentModal("your payment is processing .....!");
      })
      // .catch(function (error) {
      //   setYesButton(false);
      //   setErrorResponse(error.response);
      //   setPaymentPaymentModal(PAYMENTFAILD);
      // });
      .catch(function (error) {
        setYesButton(false);
        setErrorResponse(error.response);
        setErrorModal(true);
        setPaymentPaymentModal(PAYMENTFAILD);

        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.detail);
        }
      });
  };

  const [webresponse, setWebResponse] = useState();
  // webscoket calling
  const paymentId = (payment_id) => {
    let billingbaseurl = process.env.REACT_APP_API_URL_BILLING.split("//")[1];
    let protocol = window.location.protocol ? "wss:" : "ws:";
    var ws = new ReconnectingWebSocket(
      `${protocol}//${billingbaseurl}/ws/${payment_id}/listen/payment/status`
    );
    ws.onopen = () => {
      successModal(true);
      setSucModal(true);
      setPaymentPaymentModal("Your payment is processing...");
      console.log("socket cnxn successful");
    };
    ws.onclose = (e) => {
      console.log("socket closed", e);
    };
    ws.onmessage = (e) => {
      let responseData = JSON.parse(e.data);
      setWebResponse(responseData);
      if (responseData.status == 1) {
        // successModal(true);
        successModal(true);
        setSucModal(true);
        setPaymentPaymentModal(PAYMENTSUCCESS);
        toast.success("Payment is completed", {
          position: toast.POSITION.TOP_RIGHT,
        });
        ws.close();
        // submit(responseData.invoice_id);
        // props.Verticalcentermodaltoggle1();
      } else if (responseData.status == 3) {
        successModal(true);
        setSucModal(true);
        setYesButton(false);
        setErrorModal(true);
        setPaymentPaymentModal(PAYMENTFAILD);
      } else if (responseData.status == 2) {
        successModal(true);
        setSucModal(true);
        setPaymentPaymentModal("Your payment is processing...");
      }
    };
  };

  const successModal = () => {
    setSucModal(!sucModal);
  };

  const handleChange = (e) => {
    setRenewplan((prev) => ({
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

  const offline = () => {
    setOfflinerenewfield(true);
    setOnlinefield(false);
  };
  const online = () => {
    setOnlinefield(true);
    setOfflinerenewfield(false);
  };

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

  // renew plan -offline
  //sudha sent code for renew plan
  const renewSubmit = (e, id) => {
    e.preventDefault();
    setPaymentPaymentModal("your payment is processing .....!");
    setYesButton(true);
    setIsokbuttons(false);
    const obj = {
      plan: currentPlan.id,
      area: currentPlan.area,
    };
    const objwithPool = hideandSHowIPool;
    adminaxios
      .post(
        `wallet/priorcheck`,
        Number(renewPlan?.ippool) || currentPlan?.radius_info?.ippool
          ? objwithPool
          : obj
      )
      .then((res) => {
        if (res.data.check == true) {
          e.preventDefault();
          let data = { ...getCalculations };

          data.amount = Totalwithwalletamount;
          if (renewPlan.payment_method === "BNKTF") {
            data.bank_reference_no = renewPlan.bank_reference_no;
          } else {
            delete data.bank_reference_no;
          }
          if (renewPlan.payment_method === "CHEK") {
            data.check_reference_no = renewPlan.check_reference_no;
          } else {
            delete data.check_reference_no;
          }
          if (
            renewPlan.payment_method === "GPAY" ||
            renewPlan.payment_method === "PHNPE"
          ) {
            data.upi_reference_no = renewPlan.upi_reference_no;
          } else {
            delete data.upi_reference_no;
          }
          data.payment_method = renewPlan.payment_method;
          delete data.static_ip_bind;
          delete data.static_ip_cost;
          delete data.ippool;
          data.paid_to = JSON.parse(localStorage.getItem("token"))?.id;
          data.paid_date = moment(renewPlan.paid_date).format("YYYY-MM-DD");
          data.gst = {
            cgst: currentPlan.plan_cgst,
            sgst: currentPlan.plan_sgst,
          };
          //final_amount
          let customerInfo = JSON.parse(
            sessionStorage.getItem("customerInfDetails")
          );
          customeraxios
            .patch(`customers/enh/off/plan/renew/${customerInfo.id}`, data)
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

                toast.success(res.data.msg, {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 1000,
                });
              })();
              // props.fetchComplaints();
            })
            .catch((error) => {
              setYesButton(false);
              setErrorModal(true);
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
                setYesButton(false);
                toast.error("Something went wrong", {
                  position: toast.POSITION.TOP_RIGHT,
                });
              } else if (is404Error) {
              } else {
                toast.error("Something went wrong", {
                  position: toast.POSITION.TOP_RIGHT,
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
        setErrorModal(true);
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
    // }
  };

  // checking customer wallet function
  const [walletCOst, setWalletCost] = useState();
  const checkWalletSubmit = () => {
    setIsokbuttons(false);
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
    const wllatObj = {
      wallet_amount: Number(
        getWalletamount >= 0 ? getWalletamount.toFixed(0) : 0
      ),
    };
    adminaxios
      .post("wallet/walletcheck/" + customerInfo?.id, wllatObj)
      .then((res) => {
        setWalletCost(res.data);
        if (res.data.check === true) {
          setRenewYes(!renewYes);
        }
        if (res.data.check === false) {
          setIsokbuttons(true);
        }
      })
      .catch((err) => {
        setIsokbuttons(false);
      });
  };
  // setRenewYes(!renewYes);

  //end
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

  console.log(renewPlan, "renewPlan");
  // due date
  const getcalculatedduedate = () => {
    const { startDate, plan_time_unit, plan_unit_type, plan_offer_time_unit } =
      currentPlan;
    let addUnitType = "days";
    switch (plan_unit_type) {
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
      .add(plan_time_unit + plan_offer_time_unit, addUnitType)
      .format("DD MMM YYYY,h:mm a");
    return new_date;
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
    let finalAmountdiscount = (ondiscountcheck * customerlist.plan_cost) / 100;
    setRenewplan((prevState) => {
      return {
        ...prevState,
        final_amount: customerlist.plan_cost - finalAmountdiscount,
      };
    });
  }, [ondiscountcheck]);
  //end
  // toggle show and hide function
  function discountshowhide() {
    setDiscounttoggle(discounttoggle === "off" ? "on" : "off");
    setDiscountamount(!discountamount);
    if (discounttoggle === "on") {
      setOndiscountcheck(0);
    }
  }
  //end

  // pool list
  useEffect(() => {
    networkaxios
      .get(
        `network/ippool/${
          JSON.parse(sessionStorage.getItem("customerInfDetails")) &&
          JSON.parse(sessionStorage.getItem("customerInfDetails")).area_id
        }/get`
      )
      .then((res) => {
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
  // sorting staticip's
  const strAscending = [...staticIP]?.sort((a, b) => (a.ip > b.ip ? 1 : -1));

  // alert message
  const [renewYes, setRenewYes] = useState(false);
  const renewAlert = () => {
    const validationErrors = validate(renewPlan);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      checkWalletSubmit();
    }
  };

  // alert message for online
  const [paymentModal, setPaymentPaymentModal] = useState();
  // `Are you sure you want to Renew ?`
  useEffect(() => {
    let renewMeassage = "Are you sure you want to Renew ?  ";
    setPaymentPaymentModal(renewMeassage + twoDays?.detail);
    SetTwoDays(twoDays);
  }, [twoDays]);
  const [yesButton, setYesButton] = useState(false);

  const closeButton = () => {
    props.Verticalcentermodaltoggle1();
    props.Refreshhandler();
    props.fetchComplaints();
  };

  const [errorResponse, setErrorResponse] = useState();

  // temarary renewal
  const [tempraryMsg, setTempraryMsg] = useState(
    "Are you sure you want to Activate Temporary Renewal ?"
  );
  const [tempModal, setTempModal] = useState(false);
  const TemporaryModal = () => setTempModal(!tempModal);

  const tempraryRenewalbuffercheck = () => {
    setYesButton(true);
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
    customeraxios
      .get(`customers/checking/buffer/${customerInfo?.id}`)
      .then((res) => {
        tempraryRenewal();
      })
      .catch((err) => {
        setTempraryMsg("Something went wrong!");
        setYesButton(false);
      });
  };

  const tempraryRenewal = () => {
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    setYesButton(true);
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
    let tempData = {
      time_period: 48,
    };
    customeraxios
      .patch(`customers/v3/buffer/renew/${customerInfo?.id}`, tempData, config)
      .then((res) => {
        closeButton();
        toast.success("Plan extended successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      })
      .catch((err) => {
        setTempraryMsg("Something went wrong!");
        setYesButton(false);
      });
  };

  // webscoketresonse
  const webscoketRes = webresponse?.status === 1 || webresponse?.status === 3;

  // customer paid amount
  const getWalletamount = customerPaid - Number(getCalculations?.amount);

  // Inside your component
  const defaultErrorMessage =
    "Customer Paid should not be less than Final Amount To Be Paid";
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
      setErrorMessage("");
    }
  };

  const handleCustomerPaidChange = (e) => {
    setCustomerPaid(e.target.value);
  };

  useEffect(() => {
    // Convert getWalletamount to a number and round it
    const walletAmount = parseFloat(getWalletamount);
    const roundedWalletAmount = isNaN(walletAmount)
      ? 0
      : walletAmount.toFixed(2);

    // If the value is negative, store 0, otherwise store the rounded value
    if (roundedWalletAmount < 0) {
      setStoredWalletAmount(0);
    } else {
      setStoredWalletAmount(roundedWalletAmount);
    }
  }, [getWalletamount]);
  const discountCheck = (e) => {
    if (e?.target?.value <= 100) {
      setOndiscountcheck(e.target.value);
    }
  };
  
  return (
    <>
      {currentPlan?.area ? (
        <>
          <Accordion defaultActiveKey="0">
            <Row>
              <CardBody>
                <div className="default-according style-1" id="accordionoc">
                  <Card>
                    <CardHeader
                      className=""
                      style={{
                        border: "1px solid",
                        borderRadius: "8px",
                        width: "50%",
                        padding: "0rem 1.25rem",
                      }}
                    >
                      <h5 className="mb-0">
                        <Accordion.Toggle
                          as={Card.Header}
                          className="btn btn-link txt-white "
                          color="primary"
                          onClick={Accordion3}
                          eventKey="2"
                          aria-expanded={expanded3}
                        >
                          <span
                            style={{ display: "flex", marginLeft: "-30px" }}
                          >
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
                    <Accordion.Collapse eventKey="2">
                      <CardBody style={{ border: "none", marginLeft: "-30px" }}>
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
                                parseFloat(currentPlan.upload_speed).toFixed(
                                  0
                                ) + "Mbps"}
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
                              {currentPlan.usage_cost &&
                                parseFloat(currentPlan.usage_cost).toFixed(0)}
                            </p>
                            <p>
                              {" "}
                              <b>Plan Start Date:</b>
                              {currentPlan.plan_start_date &&
                                moment(currentPlan.plan_start_date).format(
                                  "DD MMM YYYY,h:mm a"
                                )}
                            </p>
                            <p>
                              {" "}
                              <b>Plan Due Date:</b>
                              {currentPlan.plan_end_date &&
                                moment(currentPlan.plan_end_date).format(
                                  "DD MMM YYYY,h:mm a"
                                )}
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
                              {currentPlan.balance &&
                                parseFloat(currentPlan.balance).toFixed(0)}
                            </p>
                          </>
                        )}
                      </CardBody>
                    </Accordion.Collapse>
                  </Card>
                </div>
              </CardBody>
            </Row>
          </Accordion>

          <Row hidden={customerlist?.account_status != "EXP"}>
            <Col>
              <Input
                type="checkbox"
                className="checkbox_animated"
                onClick={() => setTmproryPlan(!temproryPlan)}
              />

              <Label>
                <b>{"Temporary Renewal"}</b>
              </Label>
            </Col>
          </Row>
          <Row>
            {temproryPlan ? (
              <Col>
                <p>
                  The plan renewal date will start from today(
                  {moment().format("DD-MM-YY")}){" "}
                </p>

                <ModalFooter>
                  <Button
                    color="primary"
                    onClick={() => {
                      // setShowPayment(true);
                      // tempraryRenewal()
                      TemporaryModal();
                    }}
                    id="update_button"
                    style={{ color: "white" }}
                  >
                    Submit
                  </Button>{" "}
                  &nbsp;&nbsp;
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
                <>
                  <Modal
                    isOpen={tempModal}
                    toggle={TemporaryModal}
                    centered
                    backdrop="static"
                  >
                    <ModalBody>
                      <p style={{ textAlign: "center" }}>{tempraryMsg}</p>
                    </ModalBody>
                    <ModalFooter>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                      >
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={tempraryRenewalbuffercheck}
                          id="update_button"
                          disabled={yesButton ? yesButton : yesButton}
                        >
                          {" "}
                          {yesButton ? (
                            <Spinner size="sm" id="spinner"></Spinner>
                          ) : null}{" "}
                          &nbsp; Yes
                        </Button>
                        {/* <Button variant="outlined" onClick={TemporaryModal}>
                      Cancel
                    </Button> */}
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
                      </Stack>
                    </ModalFooter>
                  </Modal>
                </>
              </Col>
            ) : (
              <Col>
                <FormGroup
                  className="m-t-15 m-checkbox-inline mb-0"
                  style={{ display: "flex" }}
                >
                  <Label>
                    <b style={{ fontSize: "20px" }}>Payment Mode :</b>{" "}
                    &nbsp;&nbsp;
                  </Label>
                  <div className="">
                    <Input
                      className="radio_animated"
                      id="radioinline4"
                      type="radio"
                      name="online"
                      value="ONL"
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
                      value="OFL"
                      onClick={offline}
                      checked={offlinerenewfield}
                    />

                    <Label className="mb-0" for="radioinline3">
                      {Option}
                      <span className="digits"> {"Offline"}</span>
                    </Label>
                  </div>
                  {onlinefield && (
                    <>
                      <Label className="desc_label">Static IP</Label>
                      {currentPlan?.radius_info?.static_ip_bind ? (
                        <div
                          className={`franchise-switch ${staticipToggle}`}
                          onClick={showStaticipToggle}
                        />
                      ) : (
                        <div
                          className={`franchise-switch ${staticToggle}`}
                          onClick={staticIpToggle}
                        />
                      )}
                    </>
                  )}
                </FormGroup>
                {offlinerenewfield ? (
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
                              checked={walletamountcheckbox}
                              name="use_wallet"
                              value={renewPlan && renewPlan.use_wallet}
                            />
                            <Label
                              for="checkbox1"
                              style={{ fontWeight: "bold" }}
                            >
                              Wallet Amount : &nbsp;&nbsp;₹
                              {currentPlan.customer_wallet_amount}
                            </Label>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="3">
                          <>
                            <Label className="desc_label">Discount</Label>{" "}
                            &nbsp;&nbsp;
                            <div
                              style={{ top: "7px" }}
                              className={`franchise-switch ${discounttoggle}`}
                              onClick={discountshowhide}
                            />
                          </>
                        </Col>
                        {discountamount ? (
                          <>
                            <Col sm="3">
                              <FormGroup>
                                <div className="input_wrap">
                                  <Input
                                    //     noValidate
                                    //    onKeyDown={(evt) =>
                                    //     (evt.key === "e" ||
                                    //     evt.key === "E" ||
                                    //     evt.key === "-") &&
                                    //     evt.preventDefault()
                                    // }
                                    // onBlur={(e) => {
                                    //     let val = parseFloat(e.target.value);
                                    //     if (!isNaN(val)) {
                                    //         e.target.value = val.toFixed(2);
                                    //     }
                                    //     checkEmptyValue();
                                    // }}
                                    //       min="0"
                                    //       type="number"
                                    //       name="discount"
                                    //       // onBlur={checkEmptyValue}
                                    //       onChange={(e) => {
                                    //         setOndiscountcheck(e.target.value);
                                    //       }}
                                    //       value={ondiscountcheck}
                                    pattern="^\d*(\.\d{0,2})?$"
                                    onKeyDown={(evt) => {
                                      const allowedKeys = [
                                        "Backspace",
                                        "ArrowLeft",
                                        "ArrowRight",
                                      ];
                                      if (
                                        evt.key === "." &&
                                        evt.target.value.includes(".")
                                      ) {
                                        evt.preventDefault();
                                      } else if (
                                        !allowedKeys.includes(evt.key) &&
                                        !/^\d*(\.\d{0,2})?$/.test(
                                          evt.target.value + evt.key
                                        )
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
                                    type="text"
                                    name="discount"
                                    onChange={(e) => {
                                      discountCheck(e);
                                    }}
                                    value={ondiscountcheck}
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
                      {/* discount code */}

                      <Row>
                        <Col sm="3">
                          <Label className="desc_label">
                            Static IP &nbsp;&nbsp;
                          </Label>
                          {currentPlan?.radius_info?.static_ip_bind ? (
                            <div
                              style={{ top: "7px" }}
                              className={`franchise-switch ${staticipToggle}`}
                              onClick={showStaticipToggle}
                            />
                          ) : (
                            <div
                              style={{ top: "7px" }}
                              className={`franchise-switch ${staticToggle}`}
                              onClick={staticIpToggle}
                            />
                          )}
                        </Col>
                        {staticshow && (
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
                                      value={
                                        currentPlan?.radius_info?.static_ip_bind
                                      }
                                      disabled={true}
                                    />
                                  </div>
                                </FormGroup>
                              </Col>
                            )}
                            {currentPlan?.radius_info?.static_ip_bind && (
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
                                      // value={
                                      //   currentPlan?.radius_info
                                      //     ?.static_ip_total_cost
                                      // }
                                      value={
                                        getCalculations?.radius_info
                                          ?.static_ip_total_cost
                                      }
                                      disabled={true}
                                    />
                                  </div>
                                </FormGroup>
                              </Col>
                            )}
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
                        )}
                        {istelShow ? (
                          <>
                            {currentPlan?.ip_pool_name ? (
                              <></>
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
                                      <option
                                        style={{ display: "none" }}
                                      ></option>
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
                              </Col>
                            )}
                            {currentPlan?.static_ip_bind ? (
                              <></>
                            ) : (
                              <>
                                <Col sm="3">
                                  <FormGroup>
                                    <div className="input_wrap">
                                      <Label className="kyc_label">
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
                                        <option
                                          style={{ display: "none" }}
                                        ></option>
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
                                </Col>
                              </>
                            )}
                            {currentPlan?.static_ip_bind ? (
                              <></>
                            ) : (
                              <>
                                <Col md="3">
                                  <FormGroup>
                                    <div className="input_wrap">
                                      <Label className="kyc_label">
                                        Static IP Cost
                                      </Label>
                                      <Input
                                        className="form-control digits not-empty"
                                        type="text"
                                        value={
                                          getCalculations?.radius_info
                                            ?.static_ip_total_cost
                                        }
                                        disabled={true}
                                        name="static_ip_cost"
                                      />
                                    </div>
                                  </FormGroup>
                                </Col>
                              </>
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
                                className={`form-control digits not-empty${
                                  renewPlan && renewPlan.amount
                                    ? "not-empty"
                                    : ""
                                }`}
                                value={
                                  currentPlan &&
                                  parseFloat(currentPlan.plan_cost).toFixed(2)
                                }
                                type="number"
                                onBlur={checkEmptyValue}
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
                                name="final_amount"
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
                        <Col sm="3">
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
                              <Label className="form_label">
                                Customer Paid
                              </Label>
                            </div>
                            {errorMessage && (
                              <span
                                className="errortext"
                                style={{ position: "relative", top: "-25px" }}
                              >
                                {errorMessage}
                              </span>
                            )}
                          </FormGroup>
                        </Col>
                        <Col sm="3">
                          <Input
                            onChange={(e) => setWalletAmountCal(e.target.value)}
                            name=""
                            className="form-control"
                            type="number"
                            min="0"
                            disabled={true}
                            value={storedWalletAmount}
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
                            <span className="errortext">
                              {walletCOst?.check === false &&
                                `Wallet amount of max ${(walletCOst?.remaining_wallet_amount).toFixed(
                                  2
                                )} RS. is allowed.`}
                            </span>
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
                                  currentPlan.plan_time_unit +
                                    currentPlan.plan_offer_time_unit,
                                  currentPlan.plan_unit_type
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
                                value={moment(
                                  currentPlan?.plan_start_date
                                ).format("DD MMM YYYY,h:mm a")}
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
                                <option
                                  value=""
                                  style={{ display: "none" }}
                                ></option>
                                {/* Sailaja Sorting Customer 360 page-> Renew Plan -> Offline ->Payment Method * Dropdown data as alphabetical order on 10th April 2023 */}
                                <option
                                  value=""
                                  style={{ display: "none" }}
                                ></option>
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
                              <span className="errortext">
                                {errors.payment_method && "Field is required"}
                              </span>
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col sm="3" hidden={refrence != "BNKTF"}>
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
                          hidden={refrence != "GPAY" && refrence != "PHNPE"}
                        >
                          <Label
                            className="kyc_label"
                            style={{ marginTop: "-18px" }}
                          >
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
                        <Col hidden={chequeno != "CHEK"} sm="4">
                          <Label
                            className="kyc_label"
                            style={{ marginTop: "-18px" }}
                          >
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

                        <Col
                          sm="3"
                          style={{ textAlign: "left", marginTop: "10px" }}
                        >
                          <span class="uploadimagekyc" variant="contained">
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
                              disabled={
                                loading || errorMessage ? true : !isokbuttons
                              }
                              onClick={renewAlert}
                              id="update_button"
                            >
                              Renew
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
                      {/* renew alert message - offline */}
                      <Modal
                        isOpen={renewYes}
                        toggle={renewAlert}
                        centered
                        backdrop="static"
                      >
                        <ModalBody>
                          <p style={{ textAlign: "center" }}>{paymentModal}</p>
                        </ModalBody>
                        <ModalFooter>
                          {responseData?.msg || errorResponse ? (
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
                              type="button"
                              onClick={renewSubmit}
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
                {/* offline */}
                {/* {onlinefield ? (
                   <Label>
                   <b style={{ fontSize: "18px" }}>Total Amount Payable : {currentPlan &&
                                parseFloat(currentPlan?.plan_cost).toFixed(2)}</b>{" "}
                   &nbsp;&nbsp;
                 </Label>
                 ) : (
                  ""
                )} */}

                {onlinefield ? (
                  <>
                    {/* <div className="payment-gateway-options">
                      <Label>
                        <b style={{ fontSize: "20px" }}>Payment Gateway :</b>{" "}
                        &nbsp;&nbsp;
                      </Label>
                      <div className="pcard-container">
                        {paymentGateways.map((gateway) => (
                          <div
                            key={gateway.id}
                            className={`pcard ${
                              selectedGateway === gateway.id ? "selected" : ""
                            }`}
                            onClick={() => handleGatewayClick(gateway.id)}
                          >
                            <img src={gateway.imageUrl} alt={gateway.name} />
                          
                            {selectedGateway === gateway.id && (
                              <div className="ptick-mark">&#10003;</div> 
                            )}
                            
                          </div>
                        ))}
                      </div>
                    </div> */}
 
              
                    <div>
                      <StaticIpDetails
                        istelShow={istelShow}
                        currentPlan={currentPlan}
                        handleChange={handleChange}
                        ipPool={ipPool}
                        strAscending={strAscending}
                        setSelectStatic={setSelectStatic}
                        staticshow={staticshow}
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
                          {/* Send Payment Link */}
                          Proceed to Payment
                        </Button>{" "}
                        &nbsp;&nbsp;
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
                  </>
                ) : (
                  ""
                )}
              </Col>
            )}
          </Row>
          <br />
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
          {/* online plan renew */}
          <Modal
            isOpen={sucModal}
            toggle={successModal}
            centered
            backdrop="static"
          >
            <ModalBody>
              <p>{paymentModal}</p>
            </ModalBody>
            <ModalFooter>
              <>
                {webscoketRes ? (
                  <Button
                    variant="contained"
                    type="button"
                    onClick={closeButton}
                    id="resetid"
                  >
                    {"Ok"}
                  </Button>
                ) : errorModal ? (
                  <Button
                    variant="contained"
                    type="button"
                    onClick={closeButton}
                    id="resetid"
                  >
                    {"Ok"}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      type="button"
                      onClick={() => {
                        renewOnline();
                      }}
                      disabled={yesButton}
                    >
                      {"Yes"}
                    </Button>
                    <button
                      type="button"
                      name="submit"
                      className="btn btn-secondary"
                      onClick={closeButton}
                    >
                      No
                    </button>
                  </>
                )}
              </>
            </ModalFooter>
          </Modal>
        </>
      ) : (
        <Box>
          <Skeleton />
          <Skeleton animation="wave" height={30} />{" "}
          <Skeleton animation="wave" height={30} />{" "}
          <Skeleton animation="wave" height={30} />{" "}
          <Skeleton animation="wave" height={30} />{" "}
          <Skeleton animation="wave" height={30} />{" "}
          <Skeleton animation="wave" height={30} />{" "}
          <Skeleton animation="wave" height={30} />
          <Skeleton animation={false} />
        </Box>
      )}
    </>
  );
};
export default Renew;