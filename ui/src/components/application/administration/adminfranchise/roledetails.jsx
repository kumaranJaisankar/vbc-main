import React, { Fragment, useEffect, useState } from "react"; //hooks
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Label,
} from "reactstrap";
import useFormValidation from "../../../customhooks/FormValidation";
// import {Globe} from "feather-icons";
import { franchiseaxios } from "../../../../axios";
import {toast} from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
const RoleDetails = (props, initialValues) => {
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
          props.onUpdate(res.data);
          toast.success("Franchise Role was edited successfully", {
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
        // .catch(function (error) {
        //   console.error("Something went wrong!", error);
        //   // this.setState({ errorMessage: error });
        // });
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
    setIsdisabled(false);
  };

  const requiredFields = ["name"];
  const { validate, Error } = useFormValidation(requiredFields);
  return (
    <Fragment>
             <EditIcon  className="icofont icofont-edit"  style={{ top: "10px", right:"56px" ,color:"#2572C5" }}   onClick={clicked}
       // disabled={isDisabled} 
      />
       
      <br />
      <Container fluid={true}>
        <Form
          onSubmit={(e) => {
            handleSubmit(e, props.lead.id);
          }}
        >
          <Row>
            <Col md="4" id="moveup">
            <div className="input_wrap">

             
              <input
                className={`form-control digits not-empty`}
                id="afterfocus"
                type="text"
                name="name"
                style={{ border: "none", outline: "none",textTransform:"capitalize" }}
                value={leadUser && leadUser.name}
                onChange={handleChange}
                // onBlur={blur}
                disabled={isDisabled}
              ></input>
          <Label className="placeholder_styling">Franchise Role *</Label>
          </div>

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
            class="btn btn-secondary"
            onClick={props.dataClose}
          >
            Cancel
          </button>
        </Form>
      </Container>
    </Fragment>
  );
};

export default RoleDetails;
