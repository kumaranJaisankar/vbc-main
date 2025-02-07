import React, { useEffect, useState } from "react"; //hooks
import { Row, Col, Form, Label, FormGroup } from "reactstrap";
import { customeraxios, networkaxios } from "../../../../axios";
import { toast } from "react-toastify";

const CpeInfo = (props) => {
  const [cpeInfo, setCpeInfo] = useState(null);

  useEffect(() => {
    networkaxios
      .get(`network/cpe/${props.lead.username}/info`)
      .then((res) => {
        console.log(res.data, "This is cpe info");
        setCpeInfo(res.data);
      });
  }, [props]);

  const handleChange = (e) => {
    setCpeInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {};

    customeraxios
      .patch("customers/rud/" + props.lead.id, data)
      .then((res) => {
        props.onUpdate(res.data);
        toast.success("Customer Information edited successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        props.setIsdisabled(true);
      })
      .catch(function (error) {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      });
  };

  return (
    <>
      {
        cpeInfo && (
          <Form
            onSubmit={handleSubmit}
          >
            <Row>
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <input
                      className={`form-control digits not-empty`}
                      type="text"
                      name="nas"
                      style={{ border: "none", outline: "none" }}
                      value={cpeInfo.nas}
                      onChange={handleChange}
                      id="afterfocus"
                      disabled={props.isDisabled}
                    ></input>
                    <Label className="placeholder_styling">Nas</Label>
                  </div>
                </FormGroup>
              </Col>

              <Col ms="3">
                <FormGroup>
                  <div className="input_wrap">
                    <input
                      className={`form-control digits not-empty`}
                      type="text"
                      name="olt"
                      style={{ border: "none", outline: "none" }}
                      value={cpeInfo.olt}
                      onChange={handleChange}
                      id="afterfocus"
                      disabled={props.isDisabled}
                    ></input>
                    <Label className="placeholder_styling">Olt</Label>
                  </div>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <div className="input_wrap">
                    <input
                      className={`form-control digits not-empty`}
                      type="text"
                      name="dp"
                      style={{ border: "none", outline: "none" }}
                      value={cpeInfo.dp}
                      onChange={handleChange}
                      id="afterfocus"
                      disabled={props.isDisabled}
                    ></input>
                    <Label className="placeholder_styling">Dp</Label>
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <br />

            <Row>
              <Col sm="4">
                <button type="submit" name="submit" class="btn btn-primary">
                  Save
                </button>
              </Col>
            </Row>
          </Form>
        )
      }
    </>
  );
};

export default CpeInfo;
