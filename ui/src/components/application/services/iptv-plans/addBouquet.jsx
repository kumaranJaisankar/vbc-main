import React, { Fragment } from "react";
import { Container, Row, Col, Form,FormGroup,Input, Label,Button} from "reactstrap";
const AddBouquet = () => {

    function checkEmptyValue(e) {
        if (e.target.value == "") {
          e.target.classList.remove("not-empty");
        } else {
          e.target.classList.add("not-empty");
        }
      }
  return (
    <Fragment>
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form>
              <Row>
                <Col sm="3">
                <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="text"
                        name="name"
                        className="form-control digits"
                        onBlur={checkEmptyValue}
                        style={{textTransform:"capitalize"}}
                      ></Input>
                      <Label className="placeholder_styling">Name *</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="3">
                <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="unit"
                        className="form-control digits not-empty"
                        onBlur={checkEmptyValue}
                      >
                        <option value="H" selected>
                          Active
                        </option>
                        <option value="D">Inactive</option>
                      </Input>
                      <Label className="placeholder_styling">Status *</Label>
                    </div>
                  </FormGroup>
                </Col>


                <Col sm="3">
                <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="unit"
                        className="form-control digits not-empty"
                        onBlur={checkEmptyValue}
                      >
                        <option value="H" >
                        MSO Bouquet
                        </option>
                        <option value="D">Broadcaster Bouquet</option>

                      </Input>
                      <Label className="placeholder_styling">Bouquet Type *</Label>
                    </div>
                  </FormGroup>
                 
                </Col>
                <Col>
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="unit"
                        className="form-control digits"
                        onBlur={checkEmptyValue}
                      >
                          <option value="H" style={{display:"none"}}></option>
                        <option value="D">Star Network</option>
                        <option value="D">Colors</option>
                        <option value="D">Door Darshan</option>
                        <option value="D">Disovery</option>
                        <option value="D">Sun</option>
                        <option value="D">hari</option>
                      </Input>
                      <Label className="placeholder_styling">Broadcaster *</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="3">
                <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="unit"
                        className="form-control digits"
                        onBlur={checkEmptyValue}
                      >
                          <option value="" style={{ display: "none" }}></option>
                        <option value="H" >
                         SANSKAR
                        </option>
                        <option value="D">INDIA VOICE</option>
                        <option value="D">DHAMAL</option>

                      </Input>
                      <Label className="placeholder_styling">Channels *</Label>
                    </div>
                  </FormGroup>
                 
                </Col>
                
              
                </Row>
               <Row>
               <Col>
                    <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="textarea"
                        className="form-control digits"
                        name="notes"
                        rows="3"
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">Description *</Label>
                    </div>
                  </FormGroup>
                    </Col>
               </Row>
               <Row>
               <Col>
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="text"
                        name="name"
                        className="form-control digits"
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                      />
                      <Label className="placeholder_styling">
                        Price (per month) *
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
               </Row>
               <Row>
                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      name="autoclose2Toast"
                      color="btn btn-primary"
                      type="button"
                      className="mr-3"
                    >
                      {"Add"}
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
export default AddBouquet;