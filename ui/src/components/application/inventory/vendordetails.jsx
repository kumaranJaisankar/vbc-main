import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Label,
} from "reactstrap";
import useFormValidation from "../../customhooks/FormValidation";
// import {Globe} from "feather-icons";
import { franchiseaxios } from "../../../axios";
const VendorDetails = (props, initialValues) => {
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [leadUser, setLeadUser] = useState(props.lead);
  const [isDisabled, setIsdisabled] = useState(true);
  useEffect(() => {
    setLeadUser(props.lead);
  }, [props.lead]);

  useEffect(() => {
    setIsdisabled(true);
    setLeadUser(props.lead)
  }, [props.rightSidebar]);


  const handleChange = (e) => {
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // setUpdate(() => ({ [e.target.name]: e.target.value }));
  };

 

//details update 
  const statusDetails = (id) => {
    if (!isDisabled) {
        franchiseaxios
        .patch("franchise/role/" + id + "/update", leadUser)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          props.onUpdate(res.data);
          setIsdisabled(true);
        });
      // }
    }
  };


  //validations
  const handleSubmit = (e, id) => {
    e.preventDefault();
    e = e.target.name;

    const validationErrors = validate(leadUser);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      statusDetails(id);
    } else {
      console.log("errors try again", validationErrors);
    }
  };

  const clicked = (e) => {
    e.preventDefault();
    console.log("u clicked");
    setIsdisabled(false);
  };

  const requiredFields = ["name"];
  const { validate, Error } = useFormValidation(requiredFields);
  return (
    <Fragment>
      <Row style={{ paddingLeft: "2%" }}>
        <Col sm="2">
        <EditIcon  className="icofont icofont-edit"  style={{ top: "10px", right:"56px" ,color:"#2572C5", fontSize: "27px",
              cursor: "pointer",}}   onClick={clicked}
       // disabled={isDisabled} 
      />
        
        </Col>
        <Col style={{ marginTop: "-27px" }}>
          <h6 style={{ textAlign: "center" }}>
            ID : R00{props.lead && props.lead.id}
          </h6>
        </Col>
      </Row>
      <br />
      <Container fluid={true}>
        <Form
          onSubmit={(e) => {
            handleSubmit(e, props.lead.id);
          }}
        >
          <Row>
            <Col md="4">
              <Label> Franchise Role:</Label>
              <input
                id="afterfocus"
                type="text"
                name="name"
                style={{ border: "none", outline: "none" }}
                value={leadUser && leadUser.name}
                onChange={handleChange}
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
          
              <span className="errortext">
                {errors.name}
              </span>
            </Col>
          </Row>
          <br />
          <button type="submit" name="submit" class="btn btn-primary">
            Save
          </button>
          &nbsp;
          <button
            type="submit"
            name="submit"
            class="btn btn-danger"
            onClick={props.dataClose}
          >
            Cancel
          </button>
        </Form>
      </Container>
    </Fragment>
  );
};

export default VendorDetails;
