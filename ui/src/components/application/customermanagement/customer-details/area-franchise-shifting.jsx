import React, { useState } from "react"
import { Row, Col, Input, Label, FormGroup, Modal, ModalBody, ModalHeader, } from "reactstrap";
import AreaShiffting from "./area-shiffting"
import MUIButton from "@mui/material/Button";
import FranchiseShifting from "./franchise-shifting"
import { CUSTOMER_LIST } from "../../../../utils/permissions";
import CloseIcon from '@mui/icons-material/Close';
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
    var token = JSON.parse(storageToken);
}
const AreaFrachiseShifting = (props) => {
    const [areaWise, setAreaWise] = useState(false)
    const [fraWise, setFraWise] = useState(true)
    const AreaWises = () => {
        setAreaWise(true);
        setFraWise(false);
    };
    const FranWise = () => {
        setFraWise(true);
        setAreaWise(false);
    };

    const [areaShift, setAreaShift] = useState()
    const AreaShifftingModal = () => setAreaShift(!areaShift)

    return (
        <>


            <MUIButton
                variant="outlined"
                size="medium"
                className="cust_action"
                onClick={() => {
                    AreaShifftingModal();
                }}

            >
                Shifting
            </MUIButton>
            <Modal toggle={AreaShifftingModal}
                isOpen={areaShift} centered size="lg" backdrop="static">

                <ModalBody>


                    <Row>
                        <Col sm="10">
                            <FormGroup
                                className="m-t-15 m-checkbox-inline mb-0"
                                style={{ display: "flex" }}
                            >
                                <div className="">
                                    <Input
                                        className="radio_animated"
                                        id="daysplan"
                                        type="radio"
                                        name="days"
                                        value="option1"
                                        onClick={FranWise}
                                        checked={fraWise}
                                    />

                                    <Label className="mb-0" for="daysplan">
                                        {Option}
                                        <span className="digits"> {"Area To Area Shifting"}</span>
                                    </Label>
                                </div>
                                <div className="">
                                    <Input
                                        className="radio_animated"
                                        id="gbplan"
                                        type="radio"
                                        name="gb"
                                        value="option1"
                                        defaultChecked
                                        onClick={AreaWises}
                                        checked={areaWise}
                                    />

                                    <Label className="mb-0" for="gbplan">
                                        {Option}
                                        <span className="digits"> {"Franchise To Franchise Shifting"}</span>
                                    </Label>
                                </div>


                            </FormGroup>
                        </Col>
                        <Col style={{ textAlign: "end", cursor: "pointer" }}>

                            <CloseIcon onClick={() => {
                                AreaShifftingModal();
                            }} />
                        </Col>
                    </Row>
                    <hr />
                    <>
                        {fraWise &&
                            <>
                                {token.permissions.includes(CUSTOMER_LIST.AREA_SHIFTING) ? (
                                    <AreaShiffting profileDetails={props?.profileDetails} fetchComplaints={props.fetchComplaints} AreaShifftingModal={AreaShifftingModal} />
                                ) : "Insufficient Permissions"}
                            </>
                        }
                    </>
                    <>
                        {areaWise &&
                            <>
                                {token.permissions.includes(CUSTOMER_LIST.FRANCHISE_SHIFTING) ? (
                                    <FranchiseShifting profileDetails={props?.profileDetails} AreaShifftingModal={AreaShifftingModal} />
                                ) : "Insufficient Permissions"}
                            </>
                        }
                    </>
                </ModalBody>
            </Modal>
        </>
    )
}
export default AreaFrachiseShifting;