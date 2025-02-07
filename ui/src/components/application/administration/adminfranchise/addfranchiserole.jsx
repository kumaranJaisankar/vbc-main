import React, { Fragment, useState, useRef, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  CardHeader,
} from "reactstrap";
import ImageUploader from "react-images-upload";
import useFormValidation from '../../../customhooks/FormValidation'
import axios from "axios";
import {franchiseaxios} from "../../../../axios";
import { toast } from 'react-toastify';
import {  Add  } from "../../../../constant";

const AddFranchiseRole = (props, initialValues) => {
  const [assign, setAssign] = useState();
  const [user, setUser] = useState();
  const [formData, setFormData] = useState({
   
    category:"",
    subject:""
  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [image, setimage] = useState({ pictures: [] });
 

  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;
    if (target.name === "roles" || target.name === "permissions") {
      value = [target.value];
    }

    if (target.type === "checkbox") {
      if (target.checked) {
        formData.hobbies[value] = value;
      } else {
        formData.hobbies.splice(value, 1);
      }
    } else {
      setFormData((preState) => ({
        ...preState,
        [name]: value,
      }));
    }
  };


  const roleDetails = (e) => {
    // e.preventDefault();
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    franchiseaxios
      .post(
        "franchise/role/create",
        formData,
        config
      )
      .then((response) => {
        props.onUpdate(response.data);
        toast.success('Role was added successfully', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose:1000
        })
        resetformmanually()
      })
      .catch(function (error) {
        toast.error(error.response.data.detail)
        console.error("Something went wrong!", error);
        // this.setState({ errorMessage: error });
      });
  };

// validationErrors



const submit = (e) => {
  e.preventDefault()
  e = e.target.name

   const validationErrors = validate(inputs)
    const noErrors = Object.keys(validationErrors).length === 0
    setErrors(validationErrors)
    if (noErrors) {
      roleDetails()
    } else {
      console.log('errors try again', validationErrors)
    }
  }


  const requiredFields = [
  'name',
  ]
  
  const { validate, Error } = useFormValidation(requiredFields)




  const resetformmanually = () => {
    setFormData({
    name:'',
    })
    document.getElementById('resetid').click()
  }
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually()
      setErrors({})
    }
  }, [props.rightSidebar])




  


  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  const resetInputField = () => {};
  const resetForm = function () {
    setInputs((inputs) => {
      var obj = {};
      for (var name in inputs) {
        obj[name] = "";
      }
      return obj;
    });
    setErrors({})

  };

  const form = useRef(null);


  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              <Row>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{textTransform:"capitalize"}}
                      />
                      <Label className="placeholder_styling">Name</Label>
                    </div>
                    <span className="errortext">{errors.name}</span>
                  </FormGroup>
                </Col>

                 

                         
              </Row>
             


              <br /><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
              <br />
              <br />
              <br />
              <br />
              <br />
              <Row>
                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="submit"
                      className="mr-3"
                      onClick={resetInputField}
                    >
                      {Add}
                    </Button>
                    <Button type="reset" color="btn btn-primary" id="resetid">
                      Reset
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default AddFranchiseRole;



