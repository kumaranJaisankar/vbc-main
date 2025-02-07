import React, { Fragment,useState } from "react";
import { Container, Row, Col, Form, FormGroup, Input, Label ,Button} from "reactstrap";
const AddChannel = () => {


  const [toggleTranscoder, setToggleTranscoder] = useState("off");
  const [isShow, setIsShow] = React.useState(false);
  function togglesnmp() {
    setToggleTranscoder(toggleTranscoder === "off" ? "on" : "off");
    setIsShow(!isShow);
  }
  const [addLogo, setAddLogo] = React.useState(null);

  async function UploadImage(e) {
    let img = URL.createObjectURL(e.target.files[0]);
    setAddLogo(img);
    let preview = await getBase64(e.target.files[0]);

  }

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

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
                        style={{ textTransform: "capitalize" }}
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
                        style={{ textTransform: "capitalize" }}
                      ></Input>
                      <Label className="placeholder_styling">Number *</Label>
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
                      <Label className="placeholder_styling">
                        Description *
                      </Label>
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
                      <Label className="placeholder_styling">URL *</Label>
                    </div>
                  </FormGroup>
                </Col>
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
                        Channel ID *
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col>
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
                <Col>
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="unit"
                        className="form-control digits not-empty"
                        onBlur={checkEmptyValue}
                      >
                        <option value="H" selected>
                          SD
                        </option>
                        <option value="D">HD</option>
                        <option value="D">FHD</option>
                      </Input>
                      <Label className="placeholder_styling">Quality *</Label>
                    </div>
                  </FormGroup>
                </Col>
                </Row>
                <Row>
                <Col>
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="unit"
                        className="form-control digits not-empty"
                        onBlur={checkEmptyValue}
                      >
                        <option value="H" selected>
                          Free
                        </option>
                        <option value="D">Paid</option>
                      </Input>
                      <Label className="placeholder_styling">Type *</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="text"
                        name="name"
                        className="form-control digits"
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                        // disabled={}
                      />
                      <Label className="placeholder_styling">
                        Price (per month) *
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
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
                      Language *
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
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
                      Genre *
                      </Label>
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
                      Protocol *
                      </Label>
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
                        <option value="D">Music</option>
                        <option value="D">News</option>
                        <option value="D">Movies</option>
                        <option value="D">Sports</option>
                        <option value="D">Food</option>
                        <option value="D">Lifestyle</option>
                      </Input>
                      <Label className="placeholder_styling">Categories *</Label>
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
                        <option value="D">Base1</option>
                        <option value="D">TRAI 1</option>
                        <option value="D">TRAI 1</option>
                        <option value="D">DD Package</option>
                        <option value="D">Test Bouquet</option>
                        <option value="D">Mega Bouquet</option>
                      </Input>
                      <Label className="placeholder_styling">Packages *</Label>
                    </div>
                  </FormGroup>
                </Col>
                </Row>
               <Row>
                 <Col sm="3">
                 <Label>Enable Transcoder : </Label>
                 <div style={{top:"6px"}}
                    className={`franchise-switch ${toggleTranscoder}`}
                    onClick={togglesnmp}
                  />
                 </Col>
                 <Col sm="3">
                 {isShow ? (
                  
                  <div className="input_wrap">
                    <Input
                      type="select"
                      name="unit"
                      className="form-control digits not-empty"
                      onBlur={checkEmptyValue}
                    >
                       
                      <option value="D">Base1</option>
                      <option value="D">TRAI 1</option>
                      <option value="D">TRAI 1</option>
                      <option value="D">DD Package</option>
                      <option value="D">Test Bouquet</option>
                      <option value="D">Mega Bouquet</option>
                    </Input>
                    <Label className="placeholder_styling">Transcoder Profiles *</Label>
                  </div>
                 ):("")}
                 </Col>


                 <Col
                      sm="3"
                      style={{ textAlign: "left", marginTop: "10px" }}
                    >
                      <span class="uploadimagekyc" variant="contained">
                        Logo
                        <Input
                          name="payment_receipt"
                         
                          className="form-control"
                          type="file"
                          id="upload"
                          onChange={UploadImage}
                          style={{
                            paddingTop: "3px",
                            position: "absolute",
                            left: "0",
                            top: "0",
                            opacity: "0",
                            cursor: "pointer",
                          }}
                        />
                      </span>
                    </Col>
                    <Col sm="3">
                      <img
                        src={addLogo}
                        style={{ width: "200px", marginTop: "15px" }}
                        className="imgsrc"
                      />
                    </Col>
               </Row>
             <br/>
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
export default AddChannel;