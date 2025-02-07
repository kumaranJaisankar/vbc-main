import React, { useState } from "react";
import { Row, Col, Input, Label, FormGroup } from "reactstrap";
import UpgradePlan from "./upgradeplan"
import UpgradeDaysPlan from "./upgradeDaysPlan"
const UpgradeOPtion = (props) => {
    const [daysfield, setDaysfield] = useState(false);
    const [gbfield, setGBfield] = useState(true);
    const { upgradeRenewChangePlan, isRenewChangePlanModalOpen, toggleRenewChangePlanModalOpen,
        setServiceObjData, serviceObjData, serviceplanobj, serviceplanobjbkp, setServiceplanobj, selectID, RefreshHandler ,
        upgradeDays,upgradeDayskp,setUpgradeDayskp,setUpgradeDays} = props

    const DayWise = () => {
        setDaysfield(true);
        setGBfield(false);
    };
    const GBWise = () => {
        setGBfield(true);
        setDaysfield(false);
    };
      return (
        <>
            <Row>
                <Col>
                    <FormGroup
                        className="m-t-15 m-checkbox-inline mb-0"
                        style={{ display: "flex" }}
                    >
                        <div className="">
                            <Input
                                className="radio_animated"
                                id="gbplan"
                                type="radio"
                                name="gb"
                                value="option1"
                                defaultChecked
                                onClick={GBWise}
                                checked={gbfield}
                            />

                            <Label className="mb-0" for="gbplan">
                                {Option}
                                <span className="digits"> {"GB"}</span>
                            </Label>
                        </div>

                        <div className="">
                            <Input
                                className="radio_animated"
                                id="daysplan"
                                type="radio"
                                name="days"
                                value="option1"
                                onClick={DayWise}
                                checked={daysfield}
                            />

                            <Label className="mb-0" for="daysplan">
                                {Option}
                                <span className="digits"> {"Days"}</span>
                            </Label>
                        </div>
                    </FormGroup>
                </Col>
            </Row>

            {gbfield ?
                (<UpgradePlan
                    upgradeRenewChangePlan={upgradeRenewChangePlan}
                    serviceobj={isRenewChangePlanModalOpen}
                    Verticalcentermodaltoggle1={toggleRenewChangePlanModalOpen}
                    setServiceobjdata={setServiceObjData}
                    serviceobjdata={serviceObjData}
                    serviceplanobj={serviceplanobj}
                    serviceplanobjbkp={serviceplanobjbkp}
                    setServiceplanobj={setServiceplanobj}
                    id={selectID}
                    Refreshhandler={RefreshHandler}
                    fetchComplaints={props.fetchComplaints}
                />) :

                ""
            }

            {daysfield &&
                <UpgradeDaysPlan
                    upgradeRenewChangePlan={upgradeRenewChangePlan}
                    serviceobj={isRenewChangePlanModalOpen}
                    Verticalcentermodaltoggle1={toggleRenewChangePlanModalOpen}
                    setServiceobjdata={setServiceObjData}
                    serviceobjdata={serviceObjData}
                    serviceplanobj={upgradeDays}
                    serviceplanobjbkp={upgradeDayskp}
                    setServiceplanobj={setUpgradeDays}
                    id={selectID}
                    Refreshhandler={RefreshHandler}
                    fetchComplaints={props.fetchComplaints}
                />
            }
        </>
    )
}

export default UpgradeOPtion;