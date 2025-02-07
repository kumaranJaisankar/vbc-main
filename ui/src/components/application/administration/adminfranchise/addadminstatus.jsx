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
  Spinner
} from "reactstrap";
import {franchiseaxios} from "../../../../axios";
import { toast } from 'react-toastify';
import {  Add } from "../../../../constant";
import useFormValidation from '../../../customhooks/FormValidation'
import ErrorModal from "../../../common/ErrorModal";

const AddAdminStatus = (props, initialValues) => {
  const [formData, setFormData] = useState({});
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  {/*Spinner state added by Marieya on 25.8.22 */}
  const [loaderSpinneer, setLoaderSpinner ] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");  
 

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
        [name]: value.charAt(0).toUpperCase() +  value.slice(1),
      }));
    }
  };



  const statusDetails = (e) => {
    setLoaderSpinner(true);
    // e.preventDefault();
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    franchiseaxios
      .post(
        "franchise/status/create",
        formData,
        config
      )
      .then((response) => {
        props.onUpdate(response.data);
        // toast.success('Status was added successfully', {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose:1000
        // })
        setShowModal(true);
        setModalMessage("Status was added successfully");
        setLoaderSpinner(false);
        resetformmanually()
      })
      // .catch(function (error) {
      //   setLoaderSpinner(false);
      //   const errorString = JSON.stringify(error);
      //   const is500Error = errorString.includes("500");
      //   const is404Error = errorString.includes("404");
      //   const is400Error = errorString.includes("400");
      //   if(is400Error){
      //     toast.error("status with this name already exists.", {
      //       position: toast.POSITION.TOP_RIGHT,
      //       autoClose: 1000,
      //     });
      //   }
        
      //   else if (is500Error) {
      //     toast.error("Something went wrong", {
      //       position: toast.POSITION.TOP_RIGHT,
      //       autoClose: 1000,
      //     });
      //   } else if (is404Error) {
      //     toast.error("API mismatch", {
      //       position: toast.POSITION.TOP_RIGHT,
      //       autoClose: 1000,
      //     });
      //   } else {
      //     toast.error("Something went wrong", {
      //       position: toast.POSITION.TOP_RIGHT,
      //       autoClose: 1000,
      //     });
      //   }
      // });
// Modified by Marieya
      .catch(function (error) {
        setLoaderSpinner(false);
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is404Error = errorString.includes("404");
        const is400Error = errorString.includes("400");
        
        let errorMessage;
        if(is400Error){
          errorMessage = "status with this name already exists.";
        } else if (is500Error) {
          errorMessage = "Something went wrong";
        } else if (is404Error) {
          errorMessage = "API mismatch";
        } else {
          errorMessage = "Something went wrong";
        }
      
        setModalMessage(errorMessage);
        setShowModal(true);
      });
      // .catch(function (error) {
      //   console.error("Something went wrong!", error);
      //   // this.setState({ errorMessage: error });
      // });
  };





  const submit = (e) => {
    e.preventDefault()
    e = e.target.name
    let newinputsData = {...inputs}
    newinputsData.status_name = newinputsData.name
     const validationErrors = validate(newinputsData)
      const noErrors = Object.keys(validationErrors).length === 0
      setErrors(validationErrors)
      if (noErrors) {
        statusDetails()
      } else {
        console.log('errors try again', validationErrors)
      }
    }

  const requiredFields = [
    'status_name',
    ]
    
    const { validate } = useFormValidation(requiredFields)

  const resetformmanually = () => {
    setFormData({
    name:'',
    })
        //Sailaja modified clear_form_data on 26th July
    document.getElementById('resetid').click()
    document.getElementById('myForm').reset()

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
  const form = useRef(null)



  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <Row style={{marginTop:"-2%"}}>
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              <Row>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">Status Name *</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{textTransform:"capitalize"}}
                      />
                    </div>
                    <span className="errortext">{errors.status_name}</span>
                  </FormGroup>
                </Col>

                 

                         
              </Row>
             


              {/* <br /><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
              <br />
              <br />
              <br />
              <br />
              <br /> */}

              <Row style={{marginTop:"-4%"}}>
          <span className="sidepanel_border" style={{position:"relative"}}></span>
{/*Spinner added to create button by Marieya on 25.8.22*/}
                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="submit"
                      className="mr-3"
                      id="create_button"
                      disabled={loaderSpinneer? loaderSpinneer:loaderSpinneer}
                    >
                      {loaderSpinneer? <Spinner size="sm" id="spinner"></Spinner>: null} &nbsp;
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
        <ErrorModal
        isOpen={showModal}
        toggle={() => setShowModal(false)}
        message={modalMessage}
        action={() => setShowModal(false)}
      />
      </Container>
    </Fragment>
  );
};

export default AddAdminStatus;



//hello