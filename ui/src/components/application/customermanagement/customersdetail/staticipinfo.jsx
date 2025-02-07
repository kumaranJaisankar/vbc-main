import React, { useState, useEffect } from "react";
import { Row, Col, Input, Label, FormGroup, Button, Spinner } from "reactstrap";
import { networkaxios, customeraxios ,billingaxios} from "../../../../axios";
import EditStaticIpInfo from "./editstaticipinfo"
import { toast } from "react-toastify";
import { Sorting } from "../../../common/Sorting";
const StaticIpInfo = (props) => {
    const [staticData, setStaticData] = useState() //main state   
    const [ipPool, setIpPool] = useState([]);   // pool list  
    const [staticIP, setStaticIP] = useState([]);  // sttaic iplist
    const [loader, setLoader] = useState(false) //loader
    const [selectIppool, setSelectIPpool] = useState();
    const [getcalculation, setGetcalculations] = useState()
    const [getpaymentmethod, setGetPaymentMethod] = useState()

    const [showPaymentType, setShowPaymentType] = useState(false);
    const [payment, setPayment] = useState([]);
    //    handle input change
    const handleChange = (event) => {
        setStaticData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
        if (event.target.name == "ippool") {
            getStaticIP(event.target.value);
        }
        if (event.target.name == "ippool" || event.target.name == "static_ip_bind") {
            setShowPaymentType(true);
        }
    }
    // pool list
    useEffect(() => {
        networkaxios
            .get(
                `network/ippool/${props?.customerInfo?.area?.id}/get`)
            .then((res) => {
                setIpPool([...res.data]);
            });
    }, []);

    // static ip
    const getStaticIP = (val) => {
        setLoader(true)
        networkaxios.get(`network/ippool/used_ips/${val}`).then((res) => {
            let { available_ips } = res.data;
            setStaticIP([...available_ips]);
            setLoader(false)
        });
    };

    // already static ip is there we need ipool
    useEffect(() => {
        setLoader(true)
        if (props.customerInfo?.radius_info?.static_ip_bind) {
            networkaxios.get(`network/ippool/used_ips/${props.customerInfo?.radius_info?.ippool?.id}`).then((res) => {
                let { available_ips } = res.data;
                setStaticIP([...available_ips]);
                setLoader(false)
            })
        }
    }, [])
    // sorting staticip's
    const strAscending = [...staticIP]?.sort((a, b) => (a.ip > b.ip ? 1 : -1));

    // calculation
    useEffect(() => {
        setLoader(true)
        let caldata = {
            ...staticData,
            customer_id: props?.customerInfo?.id,
            // offline_payment_modes : getpaymentmethod
        }
        console.log(caldata,"caldata")
        customeraxios.post(`customers/static_ip/update/amount`, caldata)
            .then((res) => {
                setLoader(false)
                setGetcalculations(res.data)
            }).catch((err)=>{
                setLoader(false)
            })
    }, [selectIppool])

    // use effect for payment
  useEffect(() => {
    billingaxios
      .get(`payment/options`)
      .then((res) => {
        let { offline_payment_modes } = res.data;
        setPayment([...offline_payment_modes]);
        // Sailaja sorting the Finance-> Billing History -> Offline Payment Type Dropdown data as alphabetical order on 28th March 2023
        setPayment(Sorting([...offline_payment_modes], "name"));
        // setReportstatus([...status]);
      })
      .catch((err) =>
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        })
      );
  }, []);

    // submit api 
    const staticIPSubmit = () => {
        setLoader(true)
        // let data = {...getcalculation}
        let data = { 
            ...getcalculation, 
            payment_method: getpaymentmethod 
          };      
        customeraxios.patch(`customers/static_ip/update/${props?.customerInfo?.id}`, data).then((res) => {
            setLoader(false)
            props.onUpdate(data);
            toast.success(res.data.msg, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
            });
            window.location.reload();
        }).catch((error) => {
            setLoader(false)
            const errorString = JSON.stringify(error);
            const is500Error = errorString.includes("500");
            const is404Error = errorString.includes("400");
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
                toast.error("API mismatch", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
            } else {
                toast.error("Something went wrong", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
            }
        })
    }
    return (
        <>
            {props?.customerInfo?.radius_info?.static_ip_bind ? (
                <EditStaticIpInfo customerInfo={props.customerInfo} ipPool={ipPool} strAscending={strAscending}
                    setGetcalculations={setGetcalculations} getStaticIP={getStaticIP} getcalculation={getcalculation}
                    getpaymentmethod={getpaymentmethod}
                    onUpdate={props.onUpdate}
                />
            ) : <>
                <Row>
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
                                        setSelectIPpool(event.target.value)
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
                    <Col md="3">
                        <FormGroup>
                            <div className="input_wrap">
                                <Label className="kyc_label">
                                Static IP Cost Per Month
                                </Label>
                                <Input
                                    className="form-control digits not-empty"
                                    type="text"
                                    value={getcalculation?.radius_info?.static_ip_total_cost_per_month}
                                    disabled={true}
                                    name="static_ip_total_cost_per_month"
                                />
                            </div>
                        </FormGroup>
                    </Col>
                    <Col md="3">
                        <FormGroup>
                            <div className="input_wrap">
                                <Label className="kyc_label">
                                    Amount To Be Paid
                                </Label>
                                <Input
                                    className="form-control digits not-empty"
                                    type="text"
                                    value={getcalculation?.amount}
                                    disabled={true}
                                    name="amount"
                                />
                            </div>
                        </FormGroup>
                    </Col>
                    {showPaymentType && (
    <Col sm="3">
        <FormGroup>
            <div className="input_wrap">
                <Label className="kyc_label">Payment Method</Label>
                <select
                    className="form-control digits not-empty"
                    style={{ border: "none", outline: "none" }}
                    id="afterfocus"
                    type="select"
                    name="payment_method"
                    // value={basicInfo.offline_payment_mode}
                    onChange={(event) => {
                        handleChange(event);
                        setGetPaymentMethod(event.target.value)
                    }}                >
                    <option style={{ display: "none" }}></option>
                    {/* <option value="ALL3">All</option> */}
                    {payment.map((paymentreport) => (
                        <option key={paymentreport.id} value={paymentreport.id}>
                            {paymentreport.name}
                        </option>
                    ))}
                </select>
            </div>
        </FormGroup>
    </Col>
)}
                </Row>
                <Row>
                    <Col>
                        <Button
                            type="submit"
                            variant="contained"
                            id="save_button"
                            onClick={staticIPSubmit}
                            disabled={loader}
                        >
                            {loader ? <Spinner size="sm"> </Spinner> : null}
                            Save
                        </Button>
                    </Col>
                </Row>
            </>
            }
        </>
    )
}
export default StaticIpInfo;