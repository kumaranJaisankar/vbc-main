import React, { Fragment } from "react";
import {
  Row,
  Col,
  Container,
  Form,
  Label,
  Input,
  FormGroup,
  Button,
} from "reactstrap";
import { iptvaxios } from "../../../../axios";
import { TreeSelect } from "antd";
import "antd/dist/antd.css";

const BouquetEditForm = (props) => {
    console.log(props)
  return (
    <Fragment>
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form id="myForm">
              <Row>
                <Col md="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input type="text" name="name" />
                      <Label className="placeholder_styling">
                        Bouquet Name
                      </Label>
                    </div>
                  </FormGroup>
                </Col>

                <Col md="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input type="text" name="price" />
                      <Label className="placeholder_styling">
                        Monthly Price
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col sm="12">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="textarea"
                        name="description"
                      />
                      <Label className="placeholder_styling">Description</Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="button"
                      className="mr-3"
                    >
                      Add
                    </Button>

                    <Button type="reset" color="btn btn-secondary" id="resetid">
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

export default BouquetEditForm;
