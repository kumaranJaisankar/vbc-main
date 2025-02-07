import React, { Fragment, useState, useEffect, useRef } from "react"; //hooks
import {
  Row,
  Col,
  Nav,
  NavLink,
  NavItem,
  TabContent,
  TabPane,
  Form,
  Table,
  Input,
  Button,
} from "reactstrap";
import { adminaxios } from "../../../axios";
import { Search } from "../../../constant";
import isEmpty from "lodash/isEmpty";
import { connect } from "react-redux";
import { closeCustomiser } from "../../../redux/kyc-form/actions"; 

const AllPlans = (props) => {
  const { formData } = props;

  const [plansList, setPlanList] = useState([]);
  const [BasicLineTab, setBasicLineTab] = useState("1");
  const [filteredData, setFiltereddata] = useState(plansList);
  const [allplanscheck, setAllplanscheck] = useState("");
  // const [uncheck, setUncheck] = useState();
  // useEffect(() => {
  //   servicesaxios.get("plans/create").then((response) => {
  //     setFiltereddata(response.data);
  //     setPlanList(response.data);
  //   });
  // }, []);
  useEffect(() => {
    setAllplanscheck("");
  }, [props.isformclose]);
  useEffect(() => {
    adminaxios
      .get(`accounts/area/${props.formData && props.formData.area}/plans`)
      .then((res) => {
        setFiltereddata(res.data);
        setPlanList([...res.data]);
      })
      .catch((error) => console.log(error, "errors in getting service data"));
  }, []);

  const handlesearchChange = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = plansList.filter((plansListt) => {
      console.log(plansList);
      if (
        plansListt.plan_cost.toString().search(value) != -1 ||
        plansListt.package_name.toLowerCase().search(value) != -1
      )
        return plansListt;
    });
    console.log(result);
    setFiltereddata(result);
  };
  const closeCustomizer = () => {
    document.querySelector(".customizer-contain").classList.remove("open");
    setAllplanscheck("");
  };

  const planselection = (selectedid) => {
    console.log(selectedid);
    let currentSelectedPlan = plansList.filter(
      (item) => item.id == selectedid
    )[0];
    props.setSelectedPlan({
      ...currentSelectedPlan,
      final_total_plan_cost: currentSelectedPlan.total_plan_cost,
    });
    console.log(currentSelectedPlan, "cureent");
    props.handleChangeFormInput({
      name: "plan_name",
      value: currentSelectedPlan.package_name,
    });
    props.handleChangeFormInput({
      name: "service_plan",
      value: currentSelectedPlan.id,
    });
    closeCustomizer();
  };

  const searchInputField = useRef(null);

  return (
    <Fragment>
      <Row>
        <Col sm="8">
          <Form>
            <input
              className="form-control"
              type="text"
              placeholder="Search for Plan or Enter Amount"
// Sailaja Added capitalize each work as per QA Team advice on 6th March
              onChange={(event) => handlesearchChange(event)}
              ref={searchInputField}
              style={{
                border: "1px solid #ced4da",
                backgroundColor: "white",
                marginLeft: "22px",
              }}
            />
            <Search className="search-icon" />
          </Form>
        </Col>
      </Row>
      <br />
      <Row>
        <Nav className="border-tab" tabs style={{ width: "100%" }}>
          <Col>
            <NavItem>
              <NavLink
                style={{ textAlign: "left" }}
                href="#javascript"
                className={BasicLineTab === "1" ? "active" : ""}
                onClick={() => setBasicLineTab("1")}
              >
                Best Selling Plan
              </NavLink>
            </NavItem>
          </Col>
        </Nav>
      </Row>
      <TabContent activeTab={BasicLineTab}>
        <TabPane className="fade show" tabId="1">
          {/* <p className="mb-0 m-t-30"> */}
          <Row style={{ textAlign: "center" }}>
            <Col sm="2"></Col>
            <Col sm="4">
              <Table
                bordered={true}
                className="table table-bordered"
                style={{ width: "max-content" }}
              >
                <thead>
                  <tr>
                    <td></td>
                    <td>Plan Cost</td>
                    <td>Plan Description</td>
                    <td>Gb</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, i) => (
                    <tr>
                      <td>
                        <Input
                          className="radio_animated"
                          type="radio"
                          id="edo-ani1"
                          name="gateway_type"
                          onClick={(e) => {
                            setAllplanscheck(item.id);
                          }}
                          checked={allplanscheck == item.id}
                          // onChange={handleUncheckradiobtn}
                        />
                      </td>
                      <td>
                        <i className="fa fa-inr"></i>&nbsp;
                        {parseFloat(item.plan_cost).toFixed(0)}
                      </td>
                      <td>
                        Plan: {item.package_name}
                        <br /> Validity {item.time_unit} days
                        <br />
                        Speed:{item.upload_speed}Mbps
                        <br />
                        Total Plan Cost:{item.total_plan_cost}
                      </td>
                      <td>
                        <p> {item.download_speed}Gb</p>
                      </td>
                      <td>
                        <Button
                          type="button"
                          className=""
                          color="primary"
                          onClick={() => planselection(item.id)}
                          disabled={
                            isEmpty(allplanscheck) &&
                            !(allplanscheck == item.id)
                          }
                        >
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>

          {/* </p> */}
        </TabPane>
      </TabContent>
    </Fragment>
  );
};
const mapStateToProps = (state) => {
  const { formData, showCustomizer, selectedPlan, service, errors, startDate } =
    state.KYCForm;
  return {
    formData,
    showCustomizer,
    selectedPlan,
    service,
    errors,
    startDate,
  };
};

export default connect(mapStateToProps)(AllPlans);
