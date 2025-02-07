import React from "react";
import {
    Row,
    Col,
    Input,
    Label,
    FormGroup,
} from "reactstrap";
const StaticIpDetails = (props) => {
    const { istelShow, currentPlan, handleChange, ipPool, strAscending, staticshow, staticipcost, staticIPCost,totalStaticCost ,setSelectStatic} = props
    return (
        <>
            {staticshow &&
                <Row>
                    {currentPlan?.radius_info?.ippool && (
                        <Col sm="4">
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
                    {currentPlan?.radius_info?.static_ip_bind && (
                        <Col sm="4">
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
                        </Col>
                    )}
                    {currentPlan?.radius_info?.static_ip_bind  && (
                        <Col sm="4">
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
                                        value={totalStaticCost}
                                        disabled={true}
                                    />

                                </div>
                            </FormGroup>
                        </Col>
                    )}

                </Row>
            }
            {istelShow && (
                <Row>
                    {currentPlan?.radius_info?.ippool ? (
                        <></>
                    ) :
                        (<Col sm="4">
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
                        </Col>)
                    }
                    {currentPlan?.radius_info?.static_ip_bind ? (
                        <></>
                    ) : (
                        <Col sm="4">
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
                    )}
                    {currentPlan?.radius_info?.static_ip_bind?
                        <>
                        {/* <Col md="4">
                            <FormGroup>
                                <div className="input_wrap">
                                    <Label className="kyc_label">
                                        Static IP Cost {" "}
                                    </Label>
                                    <Input
                                        className="form-control digits not-empty"
                                        type="text"
                                        value={totalStaticCost}
                                        disabled={true}
                                        name="static_ip_cost"
                                    />
                                </div>
                            </FormGroup>
                        </Col> */}
                        </>
                        :
                        <Col md="4">
                            <FormGroup>
                                <div className="input_wrap">
                                    <Label className="kyc_label">
                                        Static IP Cost {" "}
                                    </Label>
                                    <Input
                                        className="form-control digits not-empty"
                                        type="text"
                                        value={totalStaticCost}
                                        disabled={true}
                                        name="static_ip_cost"
                                    />
                                </div>
                            </FormGroup>
                        </Col>
                    }
                </Row>
            )}
        </>
    )
}
export default StaticIpDetails;