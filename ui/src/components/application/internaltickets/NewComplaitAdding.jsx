import React from "react";
import {
    Col,
    Label,
    FormGroup, Row
} from "reactstrap";

const NewComplaintAdding = (props) => {
    const {  leadForSubmit, handleChange, isEditDisabled, techniciandata } = props

    return (
        <>
            <Row>
                <Col>
                    <h6> Technician:</h6>
                </Col>
            </Row>
            <Row>
                <Col md="3" >
                    <FormGroup>
                        <div className="input_wrap">
                            <Label className="kyc_label">Technician Comment *</Label>
                            <select
                                className={`form-control digits not-empty`}
                                id="afterfocus"
                                type="select"
                                name="technician_comment"
                                style={{ border: "none", outline: "none" }}
                                value={
                                    leadForSubmit &&
                                    leadForSubmit.technician_comment &&
                                    leadForSubmit.technician_comment.id
                                }
                                // onChange={handleChange}
                                onChange={(event) => {
                                    handleChange(event);
                                }}
                                disabled={isEditDisabled}

                            >
                                <option style={{ display: "none" }}></option>
                                {techniciandata.map((item) => {
                                    // if (
                                    //     !!categories &&
                                    //     leadForSubmit &&
                                    //     leadForSubmit.ticket_category
                                    // ) {
                                    return (
                                        <option
                                            key={item.id}
                                            value={item.id}
                                        // selected={
                                        //     categories.id == leadForSubmit.ticket_category.id
                                        //         ? "selected"
                                        //         : ""
                                        // }
                                        >
                                            {item.name}
                                        </option>
                                    );
                                    // }
                                })}
                            </select>
                        </div>
                    </FormGroup>
                </Col>

            </Row>
            
        </>
    )
}

export default NewComplaintAdding