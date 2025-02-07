import React, { useEffect, useState } from "react";
import {
    Col,
    Input,
    FormGroup,
    Label, Row, Spinner
} from "reactstrap";
import { adminaxios } from "../../../axios";

// Sailaja imported common component Sorting on 28th March 2023
import { Sorting } from "../../common/Sorting";

const Walletfilter = (props) => {
    const [branchlist, setbranchList] = useState([]);
    //state for franchise filter based on branch
    const [onfilterbranch, setOnfilterbranch] = useState([]);
    const [buttondisable, setButtondisable] = useState(true);
    useEffect(() => {
        if (
            props.inputs?.branch !== undefined ||
            props.inputs?.franchise !== undefined

        ) {
            setButtondisable(false)
        }
    }, [props.inputs]);
    // branch list
    useEffect(() => {
        adminaxios
            .get("accounts/branch/list")
            .then((res) => {
                // setbranchList([...res.data]);
                // Sailaja sorting the Finance-> Wallet -> Branch Dropdown data as alphabetical order on 28th March 2023
                setbranchList(Sorting(([...res.data]), 'name'));
            })
            .catch((err) => console.log(err));
    }, []);

    //get franchise options based on branch selection
    useEffect(() => {
        adminaxios
            .get(
                `franchise/${JSON.parse(localStorage.getItem("token"))?.branch?.id
                }/branch`
            )
            .then((response) => {
                setOnfilterbranch(response.data);
            })
            .catch(function (error) {
                console.error("Something went wrong!", error);
            });
    }, []);
    const getlistoffranchises = (name) => {
        adminaxios
            .get(`franchise/${name}/branch`)
            .then((response) => {
                console.log(response.data);
                // setOnfilterbranch(response.data);
                // Sailaja sorting the   Finance-> Wallet -> Franchise Dropdown data as alphabetical order on 28th March 2023
                setOnfilterbranch(Sorting((response.data), 'name'));
            })
            .catch(function (error) {
                console.error("Something went wrong!", error);
            });
    };
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
    return (
        <>
            <Row>
                {
                    JSON.parse(localStorage.getItem("token"))?.branch?.name ? (
                        <Col sm="2">
                            <FormGroup>
                                <div className="input_wrap">
                                    <Label className="kyc_label">Branch </Label>
                                    <Input
                                        className={`form-control digits not-empty`}
                                        value={
                                            JSON.parse(localStorage.getItem("token"))?.branch?.name
                                        }
                                        type="text"
                                        name="branch"
                                        onChange={handleInputChange}
                                        style={{ textTransform: "capitalize" }}
                                        disabled={true}
                                    />
                                </div>
                            </FormGroup>
                        </Col>
                    ) :
                        <Col sm="2">
                            <FormGroup>
                                <div className="input_wrap">
                                    <Label className="kyc_label">Branch </Label>
                                    <Input
                                        type="select"
                                        name="branch"
                                        className="form-control digits"
                                        onChange={(e) => { handleInputChange(e); props.handleBranchSelect(e); }}
                                        value={props.inputs && props.inputs.branch}  >
                                        <option style={{ display: "none" }}></option>
                                        <option value={"ALL1"}>All</option>
                                        {branchlist.map((branchreport) => (
                                            <>
                                                <option key={branchreport.id} value={branchreport.id}>
                                                    {branchreport.name}
                                                </option>
                                            </>
                                        ))}
                                    </Input>
                                </div>
                            </FormGroup>
                        </Col>}
                {JSON.parse(localStorage.getItem("token"))?.franchise?.name ? (
                    <Col sm="2">
                        <FormGroup>
                            <div className="input_wrap">
                                <Label className="kyc_label">Franchise </Label>
                                <Input
                                    type="text"
                                    name="franchiselistt"
                                    className="form-control digits"
                                    onChange={handleInputChange}
                                    disabled={true}
                                    value={
                                        JSON.parse(localStorage.getItem("token"))?.franchise?.name
                                    }
                                ></Input>
                            </div>
                        </FormGroup>
                    </Col>) :
                    <Col sm="2">
                        <FormGroup>
                            <div className="input_wrap">
                                <Label className="kyc_label">Franchise</Label>
                                <Input
                                    type="select"
                                    name="franchise"
                                    className="form-control digits"
                                    onChange={(e) => { handleInputChange(e); props.handleFranchiseSelect(e) }}
                                    value={props.inputs && props.inputs.franchise}
                                >
                                    <option style={{ display: "none" }}></option>
                                    <option value={"ALL2"}>All</option>
                                    {onfilterbranch.map((reportonfranchise) => (
                                        <option key={reportonfranchise.id} value={reportonfranchise.id}>
                                            {reportonfranchise.name}
                                        </option>
                                    ))}
                                </Input>
                            </div>
                        </FormGroup>
                    </Col>}
                <Col sm="2">
                    <div className="input_wrap">
                        <Label for="meeting-time" className="kyc_label">
                            Select Date Range
                        </Label>
                        <Input
                            className={`form-control-digits not-empty`}
                            type="select"
                            name="daterange"
                            onChange={props.basedonrangeselector}
                            style={{
                                border: "1px solid rgba(25, 118, 210, 0.5",
                                borderRadius: "4px",
                            }}
                        >
                            {/* Sailaja Changed Until Spell on 26th July */}
                            <option value="" style={{ display: "none" }}></option>
                            <option value="ALL6" selected>Until Today</option>
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
                {props.calender ? (
                    <>
                        <Col sm="2">
                            <FormGroup>
                                <div className="input_wrap">
                                    <Label for="meeting-time" className="kyc_label">
                                        Start Date
                                    </Label>
                                    <Input
                                        className={`form-control-digits not-empty`}
                                        onChange={props.customHandler}
                                        // className={`form-control digits ${formData && formData.code ? 'not-empty' : ''}`}
                                        // value={data1 && data1.start_date}
                                        type="date"
                                        id="meeting-time"
                                        name="start_date"
                                        value={!!props.customstartdate && props.customstartdate}
                                    />

                                </div>
                            </FormGroup>
                        </Col>
                        <Col sm="2">
                            <FormGroup>
                                <div className="input_wrap">
                                    <Label for="meeting-time" className="kyc_label">
                                        End Date
                                    </Label>
                                    <Input
                                        className={`form-control-digits not-empty`}
                                        onChange={props.customHandler}
                                        id="meeting-time"
                                        name="end_date"
                                        type="date"
                                        value={!!props.customenddate && props.customenddate}
                                    />
                                </div>
                            </FormGroup>
                        </Col>
                    </>
                ) : (
                    ""
                )}

            </Row>
            <Row>
                <Col>
                    <button
                        className="btn btn-primary openmodal"
                        id=""
                        type="button" onClick={() => { props.fetchwalletLists(props.inputs) }}
                        disabled={props.searchLoader ? props.searchLoader : props.searchLoader}
                    >  {props.searchLoader ? <Spinner size="sm"> </Spinner> : null} &nbsp; <b>Search
                        </b>
                    </button></Col>
            </Row>
        </>
    )
}
export default Walletfilter;