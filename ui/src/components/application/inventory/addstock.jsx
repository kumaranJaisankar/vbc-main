import React, { Fragment, useEffect, useState } from "react";
// import Breadcrumb from "../../layout/breadcrumb";
import {
  Container,
  Row,
  Col,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import axios from "axios";
// import ReactCrop from "react-image-crop";


const AddStock = (props,initialValues) => {
    const [upImg, setUpImg] = useState();

  const [data, setData] = useState([]);
  const [startDate, setstartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get(`${process.env.PUBLIC_URL}/api/user-edit-table.json`)
      .then((res) => setData(res.data));
  }, []);

  const handleChange = (date) => {
    setstartDate(date);
  };
  const addDays = (date) => {
    setstartDate(date, 4);
  };

  const setEndDate = (date) => {
    setendDate(date);
  };

  const  handleSearchform = (e) => {
    
    e.persist();
    setInputs((inputs) => ({ ...inputs, [e.target.name]: e.target.value }));
  };

  const validate = (inputs) => {
    const errors = {};
     //mobilenumber error
      if (inputs.filtermobilenumber) {
        var pattern = new RegExp(/^[6789]\d{9}$/);
        if ((!pattern.test(inputs.filtermobilenumber)) || (inputs.filtermobilenumber.length != 10)){
          // errors.onlynumber='Please enter only number';
          errors.filtermobilenumber = (
            <i
              style={{ color: "#ff6666", fontSize: "30px" }}
              className="icofont icofont-exclamation"
            ></i>
          );
        } 
    }
     //email
      if (inputs.filteremail) {
        var pattern = new RegExp(
          /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
        );
        if (!pattern.test(inputs.filteremail)) {
          // errors.validemail = 'Please enter valid email';
          errors.filteremail = (
            <i
              style={{ color: "#ff6666", fontSize: "30px" }}
              className="icofont icofont-exclamation"
            ></i>
          );
        }
      }
    return errors;
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(inputs);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      console.log(inputs);
    } else {
      console.log("errors try again", validationErrors);
    }
  };
  
  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <div className="edit-profile">
          <Row>
            <Col sm="12">
              <Form className="card" onSubmit={handleSubmit}>
                <CardHeader>
                  <Col sm="12">
                         <h6>Add Stock</h6>
                  </Col>
                </CardHeader>

                <CardBody>
                  <Row>
                

                    <Col sm="3">
                      <FormGroup>
                        <Label>Vendor/Supplier</Label>
                        <Input
                          type="select"
                          name="franchise"
                          className="form-control digits"
                        >
                          <option selected>Select Vendor or Supplier</option>
                          <option value="25">Vendor</option>
                          <option value="50">Supplier</option>
                          
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label>Main Category</Label>
                        <Input
                          type="select"
                          name="branch"
                          className="form-control digits"
                        >
                          <option selected>Main Category</option>
                           <option value="25">demotest</option>
                          <option value="50">VEPAGUNTA</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label>Sub Category</Label>
                        <Input
                          type="select"
                          name="area"
                          placeholder="Select Status"
                          className="form-control digits"
                        >
                          <option selected>Sub Category</option>
                         
                          <option value="50">ECIL</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label>Product</Label>
                        <Input
                          type="select"
                          name="area"
                          placeholder="Select Status"
                          className="form-control digits"
                        >
                          <option selected>Select Product</option>
                        
                        </Input>
                      </FormGroup>
                    </Col>
                    
                  </Row>

                  <Row>
                    
                  <Col sm="3">
                      <FormGroup>
                        <Label>Stock Type</Label>
                        <Input
                          type="select"
                          name="area"
                          placeholder="Select Status"
                          className="form-control digits"
                        >
                          <option selected>Stock Type</option>
                          <option value="25">New</option>
                          <option value="50">Refurbished</option>
                        </Input>
                      </FormGroup>
                    </Col>
                 

                    <Col sm="3">
                      <FormGroup>
                        <Label className="form-label">Invoice No</Label>
                        <Input
                          className="form-control"
                          type="text"
                          name="filteremail"
                          onChange={handleSearchform}
                        />
                       <div
                          style={{
                            position: "absolute",
                            top: "40%",
                            left: "80%",
                          }}
                        >
                          {errors.filteremail}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>


                  <Row>
                    <Col sm="12" xl="12">
                    <Label className="form-label">Upload</Label>

                      <div className="input-cropper">
                        <input type="file" />
                      </div>
                      {/* <ReactCrop
                        src={upImg}

                        //   onImageLoaded={onLoad}
                        //   onChange={(c) => setCrop(c)}
                        //   onComplete={makeClientCrop}
                      /> */}
                      {/* {previewUrl && (
                      <img
                        alt="Crop preview"
                        src={previewUrl}
                        style={{ maxWidth: "100%" }}
                        className="crop-portion"
                      />
                    )} */}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label> Notes </Label>
                        <Input
                          type="textarea"
                          className="form-control"
                          name="notes"
                          rows="3"
                          
                        />

                      </FormGroup>
                    </Col>
                  </Row>
                 
                  <div className="text-right">
                    <button className="btn btn-primary" type="submit">
                      Submit
                    </button>
                  </div>
                </CardBody>
             
              </Form>
            </Col>


          </Row>
        </div>
      </Container>
    </Fragment>
  );
};

export default AddStock;
