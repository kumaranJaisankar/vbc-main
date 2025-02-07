import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
 
  Form,
  Label,
} from "reactstrap";
import axios from "axios";
import { customeraxios } from "../../../../axios";
// import {Globe} from "feather-icons";
import {toast} from 'react-toastify'
const AllowMacList = (props, initialValues) => {
  const { id } = useParams();

  const [leadUser, setLeadUser] = useState(props.lead);
  const [profileName, setProfileName] = useState("");
  const [activeTab5, setActiveTab5] = useState("1");
  const [update, setUpdate] = useState(true);
  const [isDisabled, setIsdisabled] = useState(true);
  useEffect(() => {
    setLeadUser(props.lead);
  }, [props.lead]);

  useEffect(() => {
    customeraxios
      .get("customers/list")
      // .then((res) => setData(res.data))
      .then((res) => {
        // console.log(res);
        setLeadUser(res.data);
      });
  }, []);

  const handleChange = (e) => {
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // setUpdate(() => ({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e, id) => {
    // if (e.key === "Enter" || e.key === "NumpadEnter") {
    e.preventDefault();

    customeraxios
    .patch('customers/rud/' + id , leadUser)
    .then((res) => {
      console.log(res);
      console.log(res.data);
      props.onUpdate(res.data);
      toast.success("Customer Information edited successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose:1000
      });
      setIsdisabled(true);
    })
    .catch(function (error) {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose:1000
      });
      console.error("Something went wrong!", error);
    });
    // }
  };
  const clicked = (e) => {
    e.preventDefault();
    console.log("u clicked");
    setIsdisabled(false);
  };


  return (
    <Fragment>
      <Row>
        <Col sm="12" style={{ paddingLeft: "7%" }}>
          <i
            className="icofont icofont-edit"
            // disabled={isDisabled}
            onClick={clicked}
            
          ></i>
        </Col>
      </Row>
      <br />
      <Container fluid={true} id="custinfo">
        <Form
          onSubmit={(e) => {
            handleSubmit(e, props.lead.id);
          }}
        >
          <br />

          <Row>
            <Col>
              <Label>Allowed MAC</Label>
              <input
                type="text"
                name="text"
                style={{ border: "none", outline: "none" }}
                // value={
                //   leadUser && leadUser.address && leadUser.address.pincode
                // }
                value="50:D4:F7:59:D9:6C"
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
            </Col>
            <Col>
              <Label>MAC login</Label>
              <input
                type="text"
                name="text"
                style={{ border: "none", outline: "none" }}
                // value={
                //   leadUser && leadUser.address && leadUser.address.pincode
                // }
                value="No"
                onChange={handleChange}
                id="afterfocus"
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
            </Col>
          </Row>

          <br />
        
<br/>
          <Row>
            <Col sm="4">
              <button type="submit" name="submit" class="btn btn-primary">
                Save
              </button>
            </Col>
          </Row>
        </Form>
      </Container>
    </Fragment>
  );
};

export default AllowMacList;
