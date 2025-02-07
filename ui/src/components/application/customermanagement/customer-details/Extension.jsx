import React, { useState } from "react"
import MUIButton from "@mui/material/Button";
import { Row, Col, Input, Label, FormGroup, Modal, ModalBody, ModalFooter, Button, Spinner } from "reactstrap";
import moment from "moment";
import { customeraxios } from "../../../../axios";
import { toast } from "react-toastify";
import useFormValidation from "../../../customhooks/FormValidation";
const CustomerExtension = (props) => {
    const [extendModal, setExtendModal] = useState()
    const dateExtendModal = () => setExtendModal(!extendModal)
    const [extendDays, setExtendDays] = useState({})
    const [loader, setLoader] = useState(false)
    const [newExpiryDate, setNewExpiryDate] = useState();
    const [errors, setErrors] = useState({});
    const handleChange = (event) => {
        setExtendDays((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
        setNewExpiryDate(moment(props?.profileDetails?.expiry_date).add(event.target.value, 'days').format("DD MMM YYYY"));
    }

    const daysExtending = () => {
        setLoader(true)
        customeraxios.patch(`customers/plan/extension/${props?.profileDetails?.id}`, extendDays)
            .then((res) => {
                setLoader(false)
                dateExtendModal()
                props.fetchComplaints()
                toast.success("Date was Expended successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
            }).catch((error) => {
                setLoader(false)
                toast.error("Something went wrong", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                })
            })
    }

    // validations
    const requiredFields = ['days'];
    const { validate, Error } = useFormValidation(requiredFields);

    const validateExtend = (e) => {
        e.preventDefault()
        const validationErrors = validate(extendDays);
        const noErrors = Object.keys(validationErrors).length === 0;
        setErrors(validationErrors);
        if (noErrors) {
            daysExtending();
        }
    };


    return (
        <>
            <MUIButton
                variant="outlined"
                size="medium"
                className="cust_action"
                onClick={() => {
                    dateExtendModal();
                }}
            >
                Extend
            </MUIButton>
            <Modal toggle={dateExtendModal}
                isOpen={extendModal} centered size="lg" backdrop="static">
                <ModalBody>
                    <Row>
                        <Col>
                            <Label className="kyc_label">Current Expiry Date</Label>
                            <Input
                                value={moment(props?.profileDetails?.expiry_date).format("DD MMM YYYY")}
                                disabled={true}
                            />
                        </Col>
                        <Col>
                            <FormGroup>
                                <div className="input_wrap">

                                    <Label className="kyc_label">No.Of Days</Label>
                                    <Input
                                        onChange={handleChange}
                                        name="days"
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
                                </div>
                                <span className="errortext">
                                {errors.days && "Field is required"}
                              </span>
                            </FormGroup>
                        </Col>
                        <Col>
                            <Label className="kyc_label">New Expiry Date</Label>
                            <Input
                                value={newExpiryDate}
                                disabled={true}
                            />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Row style={{ textAlign: "end" }}>
                        <Col >

                            <Button
                                variant="contained"
                                id="update_button"
                                onClick={validateExtend}
                                style={{ color: "white" }}
                                disabled={loader}
                            >
                                {loader ? <Spinner size="sm"> </Spinner> : null}
                                Proceed   &nbsp; &nbsp; &nbsp;
                            </Button>
                            &nbsp;&nbsp;&nbsp;
                            <MUIButton variant="outlined"
                                size="medium"
                                className="cust_action"
                                onClick={() => {
                                    dateExtendModal();
                                }}
                            >
                                Cancel
                            </MUIButton>
                        </Col>
                    </Row>
                </ModalFooter>
            </Modal>
        </>
    )
}
export default CustomerExtension;