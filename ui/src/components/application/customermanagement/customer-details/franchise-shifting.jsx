import React, { useState } from "react"
import { useEffect } from "react";
import { Row, Col, Input, Label, Table, Button, FormGroup, Form, Modal, ModalBody, ModalFooter, Spinner } from "reactstrap";
import { adminaxios, customeraxios, networkaxios } from "../../../../axios";
import isEmpty from "lodash/isEmpty";
import { toast } from "react-toastify";
import MUIButton from "@mui/material/Button";
import useFormValidation from "../../../customhooks/FormValidation";
import moment from "moment";
const FranchiseShifting = (props) => {
    const [getfralist, setGetFraList] = useState([])
    const [radioButtonPlanId, setRadioButtonPlanId] = useState();
    const [changeplan, setChangeplan] = useState([]);
    const [serviceObjData, setServiceObjData] = useState([]);
    const [franchise, setFranchise] = useState()
    const [paymentoption, setsetPaymentOPtion] = useState()
    const [errors, setErrors] = useState({});
    const [getAreas, setGetAreas] = useState([])
    const [shiftingCharges, setShiftingCharges] = useState(0);
    // don't have balance
    const [paymentstatus, setPaymentstatus] = useState(false);
    const Paymentmodaltoggle = () => setPaymentstatus(!paymentstatus);
    // button disabled
    const [isDisbaled, setIsDisabled] = useState(false)

    const [isDisbaledwithamount, setIsDisabledwithamount] = useState(true)
    // static ip toggle
    const [staticToggle, setStatisToggle] = useState('off')
    const [showStatic, setShowStatic] = useState(false)
    function staticIPToggle() {
        setStatisToggle(staticToggle === "off" ? "on" : "off");
        setShowStatic(!showStatic);
    }


    // already static ip 
    const [staticExit, setStaticExit] = useState("on")
    const [showExit, setSHowExit] = useState(true)
    const showExitingStatic = () => {
        setStaticExit(staticExit === "on" ? "off" : "on")
        setSHowExit(!showExit)
    }


    const handleChange = (event) => {
        let val = event.target.value;
        const target = event.target;
        setFranchise((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
        const name = target.name;
        if (name == "new_franchise") {
            const value = parseInt(event.target.value);
            const selectedOption = getfralist.find((option) => option.id === value);
            setShiftingCharges(selectedOption?.shifting_charges);
            getAreaList(val);
        }
        if (event.target.name == "ippool") {
            getStaticIP(event.target.value);
        }
        setGetCalculations((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));


        // const value = parseInt(event.target.value);
        // const selectedOption = getfralist.find((option) => option.id === value);
        // setShiftingCharges(selectedOption?.shifting_charges);
    };

    // get franchise list
    useEffect(() => {
        adminaxios.get(`franchise/${props?.profileDetails?.area?.zone?.branch?.id}/branch`).then((res) => {
            setGetFraList([...res.data])
        })
    }, [])


    // area list api

    const getAreaList = (val) => {
        adminaxios.get(`franchise/areas/${val}`)
            .then((response) => {
                const formattedAreas = response.data.map((areaObj) => areaObj.area);
                setGetAreas(formattedAreas);
            })
    }

    // ippool cost
    const [staticIPCost, setStaticIPCost] = useState({});
    // pool list
    const [ipPool, setIpPool] = useState([]);
    // ippools
    const [selectStatic, setSelectStatic] = useState()
    // sttaic iplist
    const [staticIP, setStaticIP] = useState([]);
    // pool list
    useEffect(() => {
        if (franchise?.new_area) {

            networkaxios
                .get(
                    `network/ippool/${franchise?.new_area}/get`
                ).then((res) => {
                    setIpPool([...res.data]);
                });
        }
    }, [franchise?.new_area]);


    // static ip
    const getStaticIP = (val) => {
        networkaxios.get(`network/ippool/used_ips/${val}`).then((res) => {
            let { available_ips } = res.data;
            setStaticIP([...available_ips]);
            setStaticIPCost(res.data);
        });
    };
    const strAscending = [...staticIP]?.sort((a, b) => (a.ip > b.ip ? 1 : -1));
    // select subplan

    const selectSubplan = (e, services) => {
        const value = e.target.value;
        const subplan = services.sub_plans.find((s) => s.id == value);
        setServiceObjData({ ...subplan, serviceid: services.id });
    };
    function checkEmptyValue(e) {
        if (e.target.value == "") {
            e.target.classList.remove("not-empty");
        } else {
            e.target.classList.add("not-empty");
        }
    }

    //   change plan api
    useEffect(() => {
        if (franchise?.new_area) {
            let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
            adminaxios.get(`accounts/area/${franchise?.new_area}/otherplans/${props?.profileDetails?.service_plan?.id}/${customerInfo.id}`).then((res) => {
                setChangeplan(res.data)
            })
        }

    }, [franchise?.new_area])

    const StaticIPBIND = showStatic === false && showExit === true;
    const SHowIpBind = props?.profileDetails?.radius_info?.static_ip_bind ? StaticIPBIND : null
    // api calculations for 
    const [getCalculations, setGetCalculations] = useState()
    const addNewStaticIpDetails = showStatic === true ? {
        id: null,
        static_ip_bind: franchise?.static_ip_bind,
        ippool_id: franchise?.ippool
    } : null
    const exitStaticIPDetails = {
        id: props?.profileDetails?.radius_info?.id,
        static_ip_bind: props?.profileDetails?.radius_info?.static_ip_bind,
        ippool_id: props?.profileDetails?.radius_info?.ippool?.id
    }

    const checkingStaticIP = props?.profileDetails?.radius_info?.static_ip_bind ? exitStaticIPDetails : addNewStaticIpDetails

    //  calculation api call

    useEffect(() => {
        let data = {
            service_plan: serviceObjData?.id,
            area_id: franchise?.new_area
        };
        if (showStatic === true || SHowIpBind) {
            data.radius_info = checkingStaticIP
        } else {
            delete data.radius_info
        }

        let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
        if (serviceObjData?.id) {
            // setIsDisabledwithamount(true);
            customeraxios.post(`customers/get/update/amount/${customerInfo.id}`, data).then((res) => {
                setGetCalculations(res.data)
                setIsDisabledwithamount(false);
                console.log(res.data)
            })
        }
    }, [serviceObjData, selectStatic, showStatic, showExit, staticIP])




    // checking ippool condition
    const hideandSHowIPool =
        showExit ? {
            plan: serviceObjData?.id,
            area: franchise?.new_area,
            ippool: Number(franchise?.ippool) ? Number(franchise?.ippool) : Number(props?.profileDetails?.radius_info?.ippool?.id),
        } : {
            plan: serviceObjData?.id,
            area: franchise?.new_area,
        }
    // api call for fracnhsie shifting

    const changefranchiseSubmit = (e, id) => {
        setIsDisabled(true)
        const obj = {
            plan: serviceObjData?.id,
            area: franchise?.new_area
        }
        const objwithPool = hideandSHowIPool

        adminaxios.post(`wallet/priorcheck`, Number(franchise?.ippool) || props?.profileDetails?.radius_info?.ippool?.id ? objwithPool : obj).then((res) => {
            if (res.data.check == true) {
                const data = { ...getCalculations }
                // data.new_service_plan = serviceObjData?.id;
                data.paid_to = JSON.parse(localStorage.getItem("token"))?.id;
                data.customer_id = props?.profileDetails?.id;
                data.plan = serviceObjData?.id;
                data.use_wallet = 'False';
                data.paid_date = moment().format("YYYY-MM-DD");
                data.new_franchise = franchise.new_franchise;
                data.new_area = franchise.new_area;
                data.shifting_charges = shiftingCharges;
                console.log(data,"data")
                customeraxios.patch(`customers/off/franchise/areashift/${props?.profileDetails?.id}`, data).then((res) => {
                    props.AreaShifftingModal();
                    toast.success("Franchise Shifting is completed", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    window.location.reload();
                }).catch((error) => {
                    toast.error("Something went wrong", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1000,
                    })
                    setIsDisabled(false)
                })
            } if (res.data.check == false) {
                Paymentmodaltoggle()
            }
        }).catch((error) => {
            setIsDisabled(false)
        })
    }


    const requiredFields = ["payment_method", 'new_franchise', 'new_area'];
    const requiredFieldsbank = ["payment_method", "bank_reference_no", 'new_franchise', 'new_area'];
    const requiredFieldsUTR = ['upi_reference_no', 'payment_method', 'new_franchise', 'new_area'];
    const requiredFieldscheck = ["check_reference_no", 'payment_method', 'new_franchise', 'new_area'];
    const { validate, Error } = useFormValidation(franchise?.payment_method === "BNKTF" ? requiredFieldsbank : franchise?.payment_method === "GPAY" || franchise?.payment_method === "PHNPE" ? requiredFieldsUTR : franchise?.payment_method === "CHEK" ? requiredFieldscheck : requiredFields);

    const changeAlert = (e) => {
        e.preventDefault()
        const validationErrors = validate(franchise);
        const noErrors = Object.keys(validationErrors).length === 0;
        setErrors(validationErrors);
        if (noErrors) {
            changefranchiseSubmit();
        }
    };

    return (
        <>
            <Row>
                <Col>
                    <Label className="kyc_label">Franchise</Label>
                    <Input value={props?.profileDetails?.area?.franchise?.name}
                        disabled={true}
                    />
                </Col>
                <Col>
                    <Label className="kyc_label">Franchise To</Label>
                    <Input type="select" name="new_franchise" onChange={handleChange}>
                        <option style={{ display: "none" }}></option>
                        {getfralist?.map((branches) => (
                            <option key={branches.id} value={branches.id}>
                                {branches.name}
                            </option>
                        ))}
                    </Input>
                    <span className="errortext">
                        {errors.new_franchise && "Field is required"}
                    </span>
                </Col>
                <Col>
                    <Label className="kyc_label">Area To</Label>
                    <Input type="select" name="new_area" onChange={handleChange}>
                        <option style={{ display: "none" }}></option>
                        {getAreas?.map((areas) => (
                            <option key={areas.id} value={areas.id}>
                                {areas.name}
                            </option>
                        ))}
                    </Input>
                    <span className="errortext">
                        {errors.new_area && "Field is required"}
                    </span>
                </Col>
                <Col>
                    <Label className="kyc_label">Shifting Charges</Label>
                    <Input value={shiftingCharges}
                        disabled={true}
                    />
                </Col>
            </Row>
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
                            {changeplan.map((services) => (
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
                                                        setServiceObjData(services);
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
                                            onChange={(e) => selectSubplan(e, services)}
                                            onBlur={checkEmptyValue}
                                            disabled={
                                                isEmpty(radioButtonPlanId) &&
                                                !(radioButtonPlanId == services.id)
                                            }
                                        >
                                            {services &&
                                                services.sub_plans
                                                    .map((subplan) => (
                                                        <option key={subplan.id} value={subplan.id}>
                                                            {subplan.time_unit +
                                                                subplan.unit_type +
                                                                "(s)"}
                                                        </option>
                                                    ))
                                                    .reverse()}
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
                                    {!isEmpty(serviceObjData) &&
                                        serviceObjData.serviceid == services.id ? (
                                        <>
                                            <td>
                                                ₹{" "}
                                                {parseFloat(
                                                    serviceObjData.plan_cost
                                                ).toFixed(2)}
                                            </td>
                                            <td>
                                                ₹{" "}
                                                {parseFloat(
                                                    serviceObjData.plan_cost * 0.18
                                                ).toFixed(2)}{" "}
                                            </td>
                                            <td>
                                                ₹{" "}
                                                {parseFloat(
                                                    serviceObjData.total_plan_cost
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
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <br /><br />
            <Form onSubmit={changefranchiseSubmit}>
                <Row>
                    <Col>
                        <Label className="kyc_label">Static IP : </Label> &nbsp;&nbsp;
                        {props?.profileDetails?.radius_info?.ippool ?
                            <div
                                className={`franchise-switch ${staticExit}`}
                                onClick={showExitingStatic} /> :

                            <div
                                className={`franchise-switch ${staticToggle}`}
                                onClick={staticIPToggle} />
                        }

                    </Col>
                </Row>
                <br /><br />
                <Row>
                    <Col sm="4">
                        <FormGroup>
                            <div className="input_wrap">
                                <Input
                                    className="form-control digits not-empty"
                                    type="test"
                                    value={
                                        JSON.parse(localStorage.getItem("token"))?.username
                                    }
                                    name="paid_to"
                                    onChange={handleChange}
                                    disabled={true}
                                />
                                <Label for="meeting-time" className="form_label">
                                    Collected By *
                                </Label>
                            </div>
                        </FormGroup>
                    </Col>
                    <Col sm="4">
                        <FormGroup>
                            <div className="input_wrap">
                                <Input
                                    name="amount"
                                    className={`form-control digits not-empty ${changeplan && changeplan.amount ? "not-empty" : ""
                                        }`}
                                    value={
                                        serviceObjData &&
                                        parseFloat(serviceObjData?.plan_cost).toFixed(2)
                                    }
                                    type="number"
                                    onChange={handleChange}
                                    disabled={true}
                                />
                                <Label className="form_label">Plan Amount</Label>
                            </div>
                        </FormGroup>
                    </Col>
                    <Col sm="4">
                        <FormGroup>
                            <div className="input_wrap">
                                <Input
                                    type="number"
                                    onChange={handleChange}
                                    disabled={true}
                                    className="form-control digits not-empty"
                                    name="changeplan_finalamount"
                                    value={
                                        getCalculations &&
                                        parseFloat(getCalculations?.amount).toFixed(2)
                                    }
                                />
                                <Label className="form_label">
                                    Final Amount To Be Paid
                                </Label>
                            </div>
                        </FormGroup>
                    </Col>
                </Row>
                {showStatic &&
                    <Row>
                        <Col sm="4" id="moveup">
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
                        <Col sm="4" id="moveup">
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
                        <Col md="4" id="moveup">
                            <FormGroup>
                                <div className="input_wrap">
                                    <Label className="kyc_label">Static IP Cost Per Month </Label>
                                    <Input
                                        className="form-control digits not-empty"
                                        type="text"
                                        value={staticIPCost?.cost_per_ip}
                                        disabled={true}
                                        name="static_ip_cost"
                                    />
                                </div>
                            </FormGroup></Col>
                    </Row>}
                {/* exit static ip */}
                {showExit && props?.profileDetails?.radius_info?.ippool &&
                    <Row>
                        <Col sm="4">
                            <FormGroup>
                                <div className="input_wrap">

                                    <Input
                                        className="form-control digits not-empty"
                                        type="text"
                                        value={props?.profileDetails?.radius_info?.static_ip_bind}
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
                        <Col sm="4">
                            <FormGroup>
                                <div className="input_wrap">

                                    <Input
                                        className="form-control digits not-empty"
                                        type="text"
                                        value={props?.profileDetails?.radius_info?.static_ip_total_cost}
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
                        <Col sm="4">
                            <FormGroup>
                                <div className="input_wrap">

                                    <Input
                                        className="form-control digits not-empty"
                                        type="text"
                                        value={props?.profileDetails?.radius_info?.ippool?.name}
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
                    </Row>
                }
                <Row>
                    <Col sm="4" >
                        <FormGroup>
                            <div className="input_wrap">
                                <Label className="kyc_label"> Payment Method *</Label>
                                <Input
                                    type="select"
                                    name="payment_method"
                                    className="form-control digits not-empty"
                                    onChange={(event) => {
                                        handleChange(event);
                                        setsetPaymentOPtion(event.target.value);
                                    }}
                                >
                                    <option value="" style={{ display: "none" }}></option>
                                    <option value="GPAY">Google Pay</option>
                                    <option value="PHNPE">PhonePe</option>
                                    <option value="BNKTF">Bank Transfer</option>
                                    <option value="CHEK">Cheque</option>
                                    <option value="CASH">Cash</option>
                                    <option value="PAYTM">PayTM</option>
                                </Input>

                                <span className="errortext">
                                    {errors.payment_method && "Field is required"}
                                </span>
                            </div>
                        </FormGroup>
                    </Col>
                    <Col
                        sm="4"
                        hidden={paymentoption != "BNKTF"}
                    >  <Label className="kyc_label"
                    >  Bank Reference No. *  </Label>
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
                        sm="4"
                        hidden={paymentoption != "GPAY" && paymentoption != "PHNPE"}
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
                        sm="4"
                        hidden={paymentoption != "CHEK"}
                    >  <Label className="kyc_label"> Cheque No. *</Label>
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
                </Row>
                <Row style={{ textAlign: "end" }}>
                    <Col>
                    <Button
                            variant="contained"
                            id="update_button"
                            style={{ color: "white" }}
                            onClick={changeAlert}
                            disabled={ isDisbaledwithamount|| isDisbaled}
                            

                        >
                            {isDisbaled ? <Spinner size="sm"> </Spinner> : null}
                            Submit
                        </Button>
                        &nbsp;&nbsp;&nbsp;
                        <MUIButton variant="outlined"
                            size="medium"
                            className="cust_action"
                            onClick={() => {
                                props.AreaShifftingModal();
                            }}
                        >
                            Cancel
                        </MUIButton>
                    </Col>
                </Row>
            </Form>
            {/* u don't have enogh balance */}
            <Modal isOpen={paymentstatus} toggle={Paymentmodaltoggle} centered style={{maxHeight: '80%'}}>
                <ModalBody  style={{overflowY: 'auto'}}>
                    <p>{"You do not have enough balance"}</p>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="contained"
                        onClick={() => {
                            props.AreaShifftingModal();
                        }}
                    >
                        {"Ok"}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    )
}
export default FranchiseShifting;