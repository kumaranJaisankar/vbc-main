import React, { useEffect, useState } from "react"
import {
    Col,
    Input,
    FormGroup,
    Label,Row
} from "reactstrap";
import { adminaxios } from "../../../../axios";

// Sailaja imported common component Sorting on 29th March 2023
import { Sorting } from  "../../../common/Sorting";


const KpiFieldsNew = (props) => {
    const [kpibranchlist, setKpibranchList] = useState([]);
    const [buttondisable, setKpiButtondisable] = useState(true);
    //state for franchise filter based on branch
    const [onfilterkpibranch, setOnfilterKpibranch] = useState([]);
    // by default franchise list
    const [franchiseList, setFranchiseList] = useState([])

    useEffect(() => {
        if (
            props.inputs?.branch !== undefined ||
            props.inputs?.franchise !== undefined 

        ) {
            setKpiButtondisable(false)
        }
    }, [props.inputs]);

    // branch list
    useEffect(() => {
        adminaxios
            .get("accounts/branch/list")
            .then((res) => {
                // setKpibranchList([...res.data]);
// Sailaja sorting the Reports -> Branch Dropdown data as alphabetical order on 29th March 2023
                setKpibranchList(Sorting(([...res.data]),'name'));

            })
            .catch((err) => console.log(err));
    }, []);

    //get franchise options based on branch selection
    const getlistoffranchises = (name) => {
        adminaxios
            .get(`franchise/${name}/branch`)
            .then((response) => {
                // setOnfilterKpibranch(response.data);
// Sailaja sorting the Reports -> Franchise Dropdown data as alphabetical order on 29th March 2023
                setOnfilterKpibranch(Sorting((response.data),'name'));
            })
            .catch(function (error) {
                console.error("Something went wrong!", error);
            });
    };   

    useEffect(()=>{
        adminaxios
        .get(`franchise/${JSON.parse(localStorage.getItem("token")) &&
        JSON.parse(localStorage.getItem("token")).branch?.id}/branch`)
        .then((response) => {
            setOnfilterKpibranch(response.data);
        })
        .catch(function (error) {
            console.error("Something went wrong!", error);
        });
    },[])
    //handle change event
    const handleInputChange = (event) => {
        event.persist();
        props.setInputs((inputs) => ({
            ...inputs,
            [event.target.name]: event.target.value,
        }));
        let val = event.target.value;

        const target = event.target;
        var value = target.value;
        const name = target.name;
        if (name == "branch") {
            getlistoffranchises(val);
        }
    };

    // query params
    // var startDate = moment().format("YYYY-MM-DD");
    // var endDate = moment().format("YYYY-MM-DD");
    // let connection = `&created=${startDate}&created_end=${endDate}`;

    return(
        <>
        <Row  className="total_kpi">
            {JSON.parse(localStorage.getItem("token")) &&
            JSON.parse(localStorage.getItem("token")).franchise?.name ? "":
            <>
            
        {JSON.parse(localStorage.getItem("token")) &&
                JSON.parse(localStorage.getItem("token")).branch?.name ?
                <Col sm="2">
                <FormGroup>
                    <div className="input_wrap">
                        <Label className="kyc_label">Branch </Label>
                        <Input
                            // draft
                            className={`form-control digits not-empty`}
                            value={
                                JSON.parse(localStorage.getItem("token")) &&
                                JSON.parse(localStorage.getItem("token")).branch ?.name
                            }
                            type="text"
                            name="franchise"
                            onChange={handleInputChange}
                            style={{ textTransform: "capitalize" }}
                            disabled={true}
                        />

                    </div>
                </FormGroup>
            </Col>
            :
            <Col sm="2">
            <FormGroup>
                <div className="input_wrap">
                    <Label className="kyc_label">Branch </Label>
                    <Input
                        type="select"
                        name="branch"
                        className="form-control digits"
                        onChange={handleInputChange}
                        value={props.inputs && props.inputs.branch}
                    >
                        <option style={{ display: "none" }}></option>
                        <option value={"ALL1"}>All</option>
                        {kpibranchlist.map((branchreport) => (
                            <>
                                <option key={branchreport.id} value={branchreport.id}>
                                    {branchreport.name}
                                </option>
                            </>
                        ))}
                    </Input>

                </div>
            </FormGroup>
        </Col>
}

            
            </>
}
            {JSON.parse(localStorage.getItem("token")) &&
            JSON.parse(localStorage.getItem("token")).franchise?.name ?
            <Col sm="2">
                    <FormGroup>
                        <div className="input_wrap">
                            <Label className="kyc_label">Franchise </Label>
                            <Input
                                // draft
                                className={`form-control digits not-empty`}
                                value={
                                    JSON.parse(localStorage.getItem("token")) &&
                                    JSON.parse(localStorage.getItem("token")).franchise &&
                                    JSON.parse(localStorage.getItem("token")).franchise.name
                                }
                                type="text"
                                name="franchise"
                                onChange={handleInputChange}
                                style={{ textTransform: "capitalize" }}
                                disabled={true}
                            />

                        </div>
                    </FormGroup>
                </Col>
            :

            <Col sm="2">
                <FormGroup>
                    <div className="input_wrap">
                        <Label className="kyc_label">Franchise</Label>
                        <Input
                            type="select"
                            name="franchise"
                            className="form-control digits"
                            onChange={handleInputChange}
                            value={props.inputs && props.inputs.franchise}
                        >
                            <option style={{ display: "none" }}></option>
                            <option value={"ALL2"}>All</option>
                            {onfilterkpibranch.map((reportonfranchise) => (
                                <option key={reportonfranchise.id} value={reportonfranchise.id}>
                                    {reportonfranchise.name}
                                </option>
                            ))}
                        </Input>


                    </div>
                </FormGroup>
            </Col>
}
            <Col sm="2">
                <div className="input_wrap">
                    <Label for="meeting-time" className="kyc_label">
                        Select Date Range
                    </Label>
                    <Input
                        className={`form-control-digits not-empty`}
                        type="select"
                        name="daterange"
                        onChange={props.basedonkpirangeselector}
                        style={{
                            border: "1px solid rgba(25, 118, 210, 0.5",
                            borderRadius: "4px",
                        }}
                    >
                        <option value="" style={{ display: "none" }}></option>
                        <option value="ALL6" selected>Untill Today</option>
                        <option value="today" >
                            Today
                        </option>
                        <option value="yesterday">Yesterday</option>
                        <option value="lastweek">Last Week</option>
                        <option value="last7days">Last 7 Days</option>
                        <option value="last30days">Last 30 Days</option>
                        <option value="lastmonth">Last Month</option>
                        <option value="custom">Custom</option>
                    </Input>
                </div>
            </Col>
            {props.showhidecustomfieldskpi ? (
                <>
                    <Col sm="2">
                        {/* <Col sm="7"> */}
                        <FormGroup>
                            <div className="input_wrap">
                                <Label for="meeting-time" className="kyc_label">
                                    From Date
                                </Label>
                                <Input
                                    className={`form-control-digits not-empty`}
                                    onChange={props.customKpiHandler}
                                    type="date"
                                    id="meeting-time"
                                    name="start_date"
                                    value={!!props.kpicustomstartdate && props.kpicustomstartdate}
                                />
                            </div>
                        </FormGroup>
                    </Col>
                    <Col sm="2">
                        {/* <Col sm="7" style={{ marginLeft: "-6px" }}> */}
                        <FormGroup>
                            <div className="input_wrap">
                                <Label for="meeting-time" className="kyc_label">
                                    To Date
                                </Label>
                                <Input
                                    className={`form-control-digits not-empty`}
                                    onChange={props.customKpiHandler}
                                    type="date"
                                    id="meeting-time"
                                    name="end_date"
                                    value={!!props.kpicustomenddate && props.kpicustomenddate}
                                />
                            </div>
                        </FormGroup>
                    </Col>
                </>
            ) : (
                ""
            )}
            </Row>
        </>
    )
}
export default KpiFieldsNew