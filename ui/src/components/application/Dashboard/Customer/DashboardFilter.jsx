import React, { useEffect, useState } from "react";
import { Col, Input, FormGroup, Label, Row } from "reactstrap";
import { adminaxios } from "../../../../axios";
// Sailaja imported common component Sorting on 24th March 2023
import { Sorting } from "../../../common/Sorting";

const DashboardFilters = (props) => {
    const [branchlist, setbranchList] = useState([]);
    const [buttondisable, setButtondisable] = useState(true);
    //state for franchise filter based on branch
    const [onfilterbranch, setOnfilterbranch] = useState([]);
    // get zone list in based on franchise
    const [reportszone, setReportszone] = useState([]);
    // dashboard arre
    const [aralist, setAreaList] = useState([])



    useEffect(() => {
        if (
            props.inputs?.branch !== undefined ||
            props.inputs?.franchise !== undefined ||
            props.inputs?.zone !== undefined ||
            props.inputs?.area !== undefined 
        ) {
            setButtondisable(false);
        }
    }, [props.inputs]);

    // branch list
    useEffect(() => {
        adminaxios
            .get("accounts/branch/list")
            .then((res) => {
                setbranchList(Sorting([...res?.data], 'name'));

            })
            .catch((err) => console.log(err));
    }, []);

    //get franchise options based on branch selection
    useEffect(() => {
        if (JSON.parse(localStorage.getItem("token"))?.branch === null) {

        } else {

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
        }
    }, []);
    const getlistoffranchises = (val) => {
        adminaxios
            .get(`franchise/${val}/branch`)
            .then((response) => {
                setOnfilterbranch(Sorting((response?.data), 'name'));

            })
            .catch(function (error) {
                console.error("Something went wrong!", error);
            });
    };

    //get zone options based on franchise selection
    const getlistofzones = (val) => {
        adminaxios
            .get(`franchise/${val}/zones`)
            .then((response) => {
                setReportszone(Sorting((response?.data), 'name'));
            })
            .catch(function (error) {
                console.error("Something went wrong!", error);
            });
    };
    useEffect(() => {
        if (JSON.parse(localStorage.getItem("token"))?.franchise === null) {

        } else {
            adminaxios
                .get(`franchise/${JSON.parse(localStorage.getItem("token"))?.franchise?.id}/zones`
                )
                .then((response) => {
                    setReportszone(response.data);
                })
                .catch(function (error) {
                    console.error("Something went wrong!", error);
                });
        }
    }, []);

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
        if (name == "franchise") {
            getlistofzones(val);
        }

        if (name == "zone") {
            getdashboardArea(val)
        }
    };

    //get area options based on zone


    const getdashboardArea = (val) => {

        adminaxios
            .get(`accounts/zone/${val}/areas`)
            .then((response) => {
                setAreaList(response.data);
            })
            .catch(function (error) {
                console.error("Something went wrong!", error);
            });

    }

    return (
        <>
            <Row>
                {JSON.parse(localStorage.getItem("token"))?.branch?.name ? (
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
                ) : (
                    <Col sm="2">
                        <FormGroup>
                            <div className="input_wrap">
                                <Label className="kyc_label">Branch </Label>
                                <Input
                                    type="select"
                                    name="branch"
                                    className="form-control digits"
                                    onChange={(e) => { handleInputChange(e); props.handleBranchSelect(e) }}
                                    value={props.inputs && props.inputs.branch}
                                >
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
                    </Col>
                )}
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
                    </Col>
                ) : (
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
                                        <option
                                            key={reportonfranchise.id}
                                            value={reportonfranchise.id}
                                        >
                                            {reportonfranchise.name}
                                        </option>
                                    ))}
                                </Input>
                            </div>
                        </FormGroup>
                    </Col>
                )}


                <Col sm="2">
                    <FormGroup>
                        <div className="input_wrap">
                            <Label className="kyc_label">Zone</Label>
                            <Input
                                type="select"
                                name="zone"
                                className="form-control digits"
                                onChange={(e) => { handleInputChange(e); props.handleZoneSelect(e) }}
                                value={props.inputs && props.inputs.zone}
                            >
                                <option style={{ display: "none" }}></option>
                                <option value={"ALL3"}>All</option>
                                {reportszone.map((zonereport) => (
                                    <option key={zonereport.id} value={zonereport.id}>
                                        {zonereport.name}
                                    </option>
                                ))}
                            </Input>
                        </div>
                    </FormGroup>
                </Col>
                <Col sm="2">
                    <FormGroup>
                        <div className="input_wrap">
                            <Label className="kyc_label" style={{ whiteSpace: "nowrap" }}>
                                Area
                            </Label>
                            <Input
                                type="select"
                                name="area"
                                className="form-control digits"
                                onChange={(e) => { handleInputChange(e); props.handleAreaSelect(e) }}
                                value={props.inputs && props.inputs.area}
                            >
                                <option style={{ display: "none" }}></option>
                                <>
                                    <option value={"ALL4"}>All</option>
                                    {aralist.map((item) => (
                                        <option value={item.id}>{item.name}</option>
                                    ))}
                                </>
                            </Input>
                        </div>
                    </FormGroup>
                </Col>


            </Row>
        </>
    );
};

export default DashboardFilters;
