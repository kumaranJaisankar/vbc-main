import React, { Fragment } from "react";
import { Container, Row, Col, Form,FormGroup,Input, Label,Button} from "reactstrap";
const AddBroadcaster = () => {

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
                        type="text"
                        name="name"
                        className="form-control digits"
                        onBlur={checkEmptyValue}
                        style={{textTransform:"capitalize"}}
                      ></Input>
                      <Label className="placeholder_styling">Contact Person *</Label>
                    </div>
                  </FormGroup>
                </Col>
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
                      <Label className="placeholder_styling">Mobile *</Label>
                    </div>
                  </FormGroup>
                </Col>
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
                      <Label className="placeholder_styling">Landline *</Label>
                    </div>
                  </FormGroup>
                </Col>
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
                      <Label className="placeholder_styling">Email *</Label>
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
                      <Label className="placeholder_styling">City *</Label>
                    </div>
                  </FormGroup>
                </Col>
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
                      <Label className="placeholder_styling">State *</Label>
                    </div>
                  </FormGroup>
                </Col>
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
                      <Label className="placeholder_styling">PIN *</Label>
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
                        rows="2"
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">Address *</Label>
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
export default AddBroadcaster;