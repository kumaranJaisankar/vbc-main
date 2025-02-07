import React, { useState, useEffect , useRef} from "react";
import MUIButton from "@mui/material/Button";
import { Modal, ModalBody, Button } from "reactstrap";
import { servicesaxios } from "../../../axios";
import { FormGroup, Input, Label, Row, Col, Table, Form } from "reactstrap";
import { unitType1 } from "./data";
import { toast } from "react-toastify";
const AddOffers = () => {
  const [addOffersModal, setAddOffersModal] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const [serivedata, setServiceData] = useState({});
  const [serviceListObj, setServiceListObj] = useState({});
  const[defaultServiceList, setDefaultServiceList] = useState([])
  
  const showAddOffersModal = () => {setServiceData({}); setServiceListObj({});setAddOffersModal(!addOffersModal)};
 
  const handleInputChange = (e) => {
    setServiceData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    servicesaxios
      .get("plans/dropdown")
      .then((res) => {
        setServiceList(res.data);
        setDefaultServiceList(res.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

 

  const offerSubmit = (e) => {
    e.preventDefault();

    let data = [
      {
        id: serviceListObj.id,
        offer_time_unit: parseFloat(serivedata.offer_time_unit),
        offer_time_unit_type: 'mon',
      },
    ];
    servicesaxios
      .post(`plans/offer`, data)
      .then((res) => {
        setAddOffersModal(false);
        toast.success("Offer addded Successfully", {});
      })
      .catch(function (error) {
        toast.error("Something went wrong", {});
      });
  };

  const searchInputField = useRef(null);

  const handlesearchChange = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = defaultServiceList.filter((serviceList) => {
      if (serviceList.package_name.toLowerCase().search(value) != -1) return serviceList;
    });
    setServiceList(result);
  };

  return (
    <>
      <MUIButton variant="outlined" onClick={showAddOffersModal}>
        Add Offers
      </MUIButton>

      <Modal
        isOpen={addOffersModal}
        toggle={showAddOffersModal}
        centered
        style={{ maxWidth: "1000px" }}
      >
        <ModalBody
          style={{
            padding: "35px",
            maxHeight: "600px",
            overflow: "auto",
          }}
        >

          <Row>
          <Form>
            <input
              className="form-control"
              type="text"
              placeholder="Search For Package name "
              onChange={(event) => handlesearchChange(event)}
              ref={searchInputField}
              style={{
                border: "1px solid #ced4da",
                backgroundColor: "white",
                width: "550px",
              }}
            />
          </Form>
          </Row>
          <Row style={{ maxHeight: "300px", overflow: "auto" }}>
            <Col>
              <Table className="table-border-vertical">
                <thead>
                  <tr>
                    <th scope="col">{"Package Name"}</th>
                    <th scope="col">{"Pack Validity"}</th>
                    <th scope="col">{"Upload speed"}</th>
                    <th scope="col">{"Download Speed"}</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceList &&
                    serviceList.map((services) => (
                      <tr>
                        <td scope="row" style={{ width: "35%" }}>
                          {" "}
                          <>
                            <Label className="d-block" for="edo-ani1">
                              <Input
                                className="radio_animated"
                                type="radio"
                                id="edo-ani1"
                                key={services.id}
                                value={services.id}
                                name="package_name"
                                onChange={(e) => setServiceListObj(services)}
                              />
                              {services.package_name}
                            </Label>
                          </>
                        </td>
                        <td>
                          {services.time_unit +
                            " " +
                            services.unit_type +
                            "(s)"}
                        </td>
                        <td>
                          {parseFloat(services.upload_speed).toFixed(0) +
                            "Mbps"}
                        </td>
                        <td>
                          {parseFloat(services.download_speed).toFixed(0) +
                            "Mbps"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Col>
          </Row>
          <br />
          <br />
          <Form>
            <Row>
              <Col md="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      name="amount"
                      className={`form-control digits not-empty${
                        serivedata && serivedata.package_name ? "not-empty" : ""
                      }`}
                      value={serviceListObj && serviceListObj.package_name}
                      type="text"
                      // onBlur={checkEmptyValue}
                      onChange={handleInputChange}
                    />
                    <Label className="placeholder_styling">Package Name</Label>
                  </div>
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      name="amount"
                      className={`form-control digits not-empty${
                        serivedata && serivedata.time_unit ? "not-empty" : ""
                      }`}
                      value={
                        serviceListObj.time_unit && serviceListObj.unit_type
                          ? serviceListObj.time_unit +
                            serviceListObj.unit_type +
                            "(s)"
                          : ""
                      }
                      type="text"
                      onChange={handleInputChange}
                    />
                    <Label className="placeholder_styling">Pack Validity</Label>
                  </div>
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      className={`form-control digits not-empty`}
                      type="number"
                      key={serivedata.id}
                      value={serivedata.offer_time_unit}
                      name="offer_time_unit"
                      onChange={(e) => handleInputChange(e, serivedata.id)}
                      min="0"
                      onKeyDown={(evt) =>
                        (evt.key === "e" ||
                          evt.key === "E" ||
                          evt.key === "." ||
                          evt.key === "-") &&
                        evt.preventDefault()
                      }
                    />
                    <Label className="placeholder_styling">
                      Offer Time Unit
                    </Label>
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      className={`form-control digits not-empty`}
                      id="afterfocus"
                      type="select"
                      name="offer_time_unit_type"
                      style={{
                        border: "none",
                        outline: "none",
                      }}
                      value={serivedata.offer_time_unit_type}
                      onChange={(e) => handleInputChange(e, serivedata.id)}
                    >
                      {unitType1.map((unittype) => {
                        //   if (!!unittype && services.offer_time_unit_type) {
                        return (
                          <option
                            value={unittype.id}
                            selected={
                              unittype.id == serivedata.offer_time_unit_type
                                ? "selected"
                                : ""
                            }
                          >
                            {unittype.name}
                          </option>
                        );
                        //   }
                      })}
                    </Input>
                    <Label className="placeholder_styling">
                      Offer Unit Type
                    </Label>
                  </div>
                </FormGroup>
              </Col>

              
            </Row>
            <div style={{ float: "right" }}>
              <Button color="primary" onClick={offerSubmit}>
                {"Save"}
              </Button>
              &nbsp;&nbsp;
              <Button color="secondary" onClick={()=>showAddOffersModal()}>
                {"Cancel"}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};
export default AddOffers;
