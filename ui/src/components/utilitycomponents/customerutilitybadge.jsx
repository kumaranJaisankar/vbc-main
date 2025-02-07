import React, { useState } from "react";
import { Nav, NavItem, NavLink, Input, Label } from "reactstrap";
import { CustomerFilterContainer } from "../application/customermanagement/CustomerFilter/CustomerFilterContainer";
const AllIcon = require("../../assets/images/All.svg");
const PendingIcon = require("../../assets/images/Pending.svg");
const CompletedIcon = require("../../assets/images/Completed.svg");

const Customerutilitybadge = (props) => {
  const [BasicLineTab, setBasicLineTab] = useState("1");
  const {
    handleTableDataFilter,
    rowlength,
    getFilterDataBydateForExpired,
    getFilterDataByysterdayForExpired,
    LastWeekForExpired,
    OnemonthForExpired,
    clearAllFilterRadioButton,
  } = props;
  const [expireddata, setEpiredData] = useState(false);
  const [showDateRadioButtons, setShowDateRadioButton] = useState(false);
  const [currentActiveOrExpired, setCurrentActiveOrExpired] = useState("");

  const handleDataFilter = (status, tabId) => {
    handleTableDataFilter(status);
    setBasicLineTab(tabId);
  };

  document.addEventListener("mousedown", (event) => {
    const outsideClick = document.querySelector(".expirydate");

    if (outsideClick && outsideClick.contains(event.target)) {
      setEpiredData(true);
    } else {
      if (event.target.className !== "btn btn-primary nav-link") {
        setEpiredData(false);
      }
    }
  });
  return (
    <Nav
      className="border-tab"
      tabs
      style={{
        backgroundColor: "transparent",
        marginBottom: "3rem",
        marginTop: "2rem",
      }}
    >
      <NavItem style={{ backgroundColor: "transparent" }}>
        <NavLink
          href="#javascript"
          className={BasicLineTab === "1" ? "badge-active active" : ""}
          onClick={() => {
            handleDataFilter("All", "1");
            setEpiredData(true);
          }}
        >
          <img style={{ padding: "5px" }} src={AllIcon} alt="All" />
          <span
            className={
              BasicLineTab === "1"
                ? "utility-badge-text-active"
                : "utility-badge-text"
            }
          >
            All
          </span>
          <span
            className={
              BasicLineTab === "1"
                ? "utility-badge-numbers-active"
                : "utility-badge-numbers"
            }
          >
            {rowlength.All}
          </span>
        </NavLink>

        {expireddata && (
          <>
            <CustomerFilterContainer
              showFilterInAllTab={true}
              levelMenu={props.levelMenu}
              setLevelMenu={props.setLevelMenu}
              filteredData={props.filteredData}
              setFiltereddata={props.setFiltereddata}
              filteredDataBkp={props.filteredDataBkp}
              loading={props.loading}
              setLoading={props.setLoading}
              showTypeahead={props.showTypeahead}
              branch={props.branch}
              zone={props.zone}
              areaa={props.areaa}
              apiCallCount={props.apiCallCount}
              setShowDateRadioButton={setShowDateRadioButton}
              setCurrentActiveOrExpired={setCurrentActiveOrExpired}
              clearAllFilterRadioButton={clearAllFilterRadioButton}
              timeSelectionRadioButtonsComponent={
                showDateRadioButtons ? (
                  <div>
                    <div>
                      <Input
                        className="radio_animated"
                        id="radio11"
                        type="radio"
                        name="radio1"
                        checked={props.allFilterRadioButtonValue === "Today"}
                        onChange={() =>
                          getFilterDataBydateForExpired(
                            "Today",
                            currentActiveOrExpired
                          )
                        }
                      />
                      <Label for="radio11">{"Today"}</Label>
                    </div>

                    <div>
                      <Input
                        className="radio_animated"
                        id="radio55"
                        type="radio"
                        name="radio1"
                        checked={props.allFilterRadioButtonValue === "Tomorrow"}
                        onChange={() =>
                          getFilterDataByysterdayForExpired(
                            "Tomorrow",
                            currentActiveOrExpired
                          )
                        }
                      />
                      <Label for="radio55">{"Tomorrow"}</Label>
                    </div>
                    <div>
                      <Input
                        className="radio_animated"
                        id="radio22"
                        type="radio"
                        name="radio1"
                        checked={
                          props.allFilterRadioButtonValue === "Yesterday"
                        }
                        onChange={() =>
                          getFilterDataByysterdayForExpired(
                            "Yesterday",
                            currentActiveOrExpired
                          )
                        }
                      />
                      <Label for="radio22">{"Yesterday"}</Label>
                    </div>
                    <div>
                      <Input
                        className="radio_animated"
                        id="radio66"
                        type="radio"
                        name="radio1"
                        checked={
                          props.allFilterRadioButtonValue === "Next7Days"
                        }
                        onChange={() =>
                          getFilterDataByysterdayForExpired(
                            "Next7Days",
                            currentActiveOrExpired
                          )
                        }
                      />
                      <Label for="radio66">{"Next7Days"}</Label>
                    </div>

                    <div>
                      <Input
                        className="radio_animated"
                        id="radio33"
                        type="radio"
                        name="radio1"
                        checked={
                          props.allFilterRadioButtonValue === "Last7Days"
                        }
                        onChange={() =>
                          LastWeekForExpired(
                            "Last7Days",
                            currentActiveOrExpired
                          )
                        }
                      />
                      <Label for="radio33">{"Last7Days"}</Label>
                    </div>

                    <div>
                      <Input
                        className="radio_animated"
                        id="radio44"
                        type="radio"
                        name="radio1"
                        checked={
                          props.allFilterRadioButtonValue === "LastMonth"
                        }
                        onChange={() =>
                          OnemonthForExpired(
                            "LastMonth",
                            currentActiveOrExpired
                          )
                        }
                      />
                      <Label for="radio44">{"LastMonth"}</Label>
                    </div>
                  </div>
                ) : (
                  <></>
                )
              }
            />
          </>
        )}
      </NavItem>
      <NavItem style={{ backgroundColor: "transparent" }}>
        <NavLink
          href="#javascript"
          className={BasicLineTab === "2" ? "badge-active active" : ""}
          onClick={(event) => {
            handleDataFilter("KYCConfirmed", "2");
            setEpiredData(false);
          }}
        >
          <img style={{ padding: "5px" }} src={CompletedIcon} alt="All" />
          <span
            className={
              BasicLineTab === "2"
                ? "utility-badge-text-active"
                : "utility-badge-text"
            }
          >
            KYC Confirmed
          </span>
          <span
            className={
              BasicLineTab === "2"
                ? "utility-badge-numbers-active"
                : "utility-badge-numbers"
            }
          >
            {rowlength.KYCConfirmed}
          </span>
        </NavLink>
      </NavItem>
      <NavItem style={{ backgroundColor: "transparent" }}>
        <NavLink
          href="#javascript"
          className={BasicLineTab === "3" ? "badge-active active" : ""}
          onClick={(event) => {
            handleDataFilter("Provisioning", "3");
            setEpiredData(false);
          }}
        >
          <img style={{ padding: "5px" }} src={CompletedIcon} alt="All" />
          <span
            className={
              BasicLineTab === "3"
                ? "utility-badge-text-active"
                : "utility-badge-text"
            }
          >
            Provisioning{" "}
          </span>
          <span
            className={
              BasicLineTab === "3"
                ? "utility-badge-numbers-active"
                : "utility-badge-numbers"
            }
          >
            {rowlength.Provisioning}
          </span>
        </NavLink>
      </NavItem>
      <NavItem style={{ backgroundColor: "transparent" }}>
        <NavLink
          href="#javascript"
          className={BasicLineTab === "4" ? "badge-active active" : ""}
          onClick={(event) => {
            handleDataFilter("Installation", "4");
            setEpiredData(false);
          }}
        >
          <img style={{ padding: "5px" }} src={CompletedIcon} alt="All" />
          <span
            className={
              BasicLineTab === "4"
                ? "utility-badge-text-active"
                : "utility-badge-text"
            }
          >
            Installation{" "}
          </span>
          <span
            className={
              BasicLineTab === "4"
                ? "utility-badge-numbers-active"
                : "utility-badge-numbers"
            }
          >
            {rowlength.Installation}
          </span>
        </NavLink>
      </NavItem>
      <NavItem style={{ backgroundColor: "transparent" }}>
        <NavLink
          href="#javascript"
          className={BasicLineTab === "5" ? "badge-active active" : ""}
          onClick={(event) => {
            handleDataFilter("Active", "5");
            setEpiredData(false);
          }}
        >
          <img style={{ padding: "5px" }} src={CompletedIcon} alt="All" />
          <span
            className={
              BasicLineTab === "5"
                ? "utility-badge-text-active"
                : "utility-badge-text"
            }
          >
            Active{" "}
          </span>
          <span
            className={
              BasicLineTab === "5"
                ? "utility-badge-numbers-active"
                : "utility-badge-numbers"
            }
          >
            {rowlength.Active}
          </span>
        </NavLink>
      </NavItem>

      <NavItem style={{ backgroundColor: "transparent" }}>
        <NavLink
          href="#javascript"
          className={BasicLineTab === "6" ? "badge-active active" : ""}
          onClick={(event) => {
            handleDataFilter("Expired", "6");
            setEpiredData(false);
          }}
        >
          <img style={{ padding: "5px" }} src={CompletedIcon} alt="All" />
          <span
            className={
              BasicLineTab === "6"
                ? "utility-badge-text-active"
                : "utility-badge-text"
            }
          >
            Expired{" "}
          </span>
          <span
            className={
              BasicLineTab === "6"
                ? "utility-badge-numbers-active"
                : "utility-badge-numbers"
            }
          >
            {rowlength.Expired}
          </span>
        </NavLink>
        {/* {expireddata ? (
          <div
            style={{
              backgroundColor: "white",
              padding: "10px 70px 0px 30px",
              position: "absolute",
              zIndex: "9999",
            }}
            className="expirydate"
          >
            <div className="radio radio-primary">
              <Input
                id="radio11"
                type="radio"
                name="radio1"
                value="option1"
                onChange={() => getFilterDataBydateForExpired("Today")}
              />
              <Label for="radio11">{"Today"}</Label>
            </div>
            <div className="radio radio-primary">
              <Input
                id="radio55"
                type="radio"
                name="radio1"
                value="option1"
                onChange={() => getFilterDataByysterdayForExpired("Tomorrow")}
              />
              <Label for="radio55">{"Tomorrow"}</Label>
            </div>
            <div className="radio radio-primary">
              <Input
                id="radio22"
                type="radio"
                name="radio1"
                value="option1"
                onChange={() => getFilterDataByysterdayForExpired("Yesterday")}
              />
              <Label for="radio22">{"Yesterday"}</Label>
            </div>
            <div className="radio radio-primary">
              <Input
                id="radio66"
                type="radio"
                name="radio1"
                value="option1"
                onChange={() => getFilterDataByysterdayForExpired("Next7Days")}
              />
              <Label for="radio66">{"Next7Days"}</Label>
            </div>

            <div className="radio radio-primary">
              <Input
                id="radio33"
                type="radio"
                name="radio1"
                value="option1"
                onChange={() => LastWeekForExpired("Last7Days")}
              />
              <Label for="radio33">{"Last7Days"}</Label>
            </div>
            <div className="radio radio-primary">
              <Input
                id="radio44"
                type="radio"
                name="radio1"
                value="option1"
                onChange={() => OnemonthForExpired("LastMonth")}
              />
              <Label for="radio44">{"LastMonth"}</Label>
            </div>
          </div>
        ) : (
          ""
        )} */}
      </NavItem>
      <NavItem style={{ backgroundColor: "transparent" }}>
        <NavLink
          href="#javascript"
          className={BasicLineTab === "7" ? "badge-active active" : ""}
          onClick={(event) => {
            handleDataFilter("Suspended", "7");
            setEpiredData(false);
          }}
        >
          <img style={{ padding: "5px" }} src={CompletedIcon} alt="All" />
          <span
            className={
              BasicLineTab === "7"
                ? "utility-badge-text-active"
                : "utility-badge-text"
            }
          >
            Suspended{" "}
          </span>
          <span
            className={
              BasicLineTab === "7"
                ? "utility-badge-numbers-active"
                : "utility-badge-numbers"
            }
          >
            {rowlength.Suspended}
          </span>
        </NavLink>
      </NavItem>
      <NavItem style={{ backgroundColor: "transparent" }}>
        <NavLink
          href="#javascript"
          className={BasicLineTab === "8" ? "badge-active active" : ""}
          onClick={(event) => {
            handleDataFilter("Offline", "8");
            setEpiredData(false);
          }}
        >
          <img style={{ padding: "5px" }} src={CompletedIcon} alt="All" />
          <span
            className={
              BasicLineTab === "8"
                ? "utility-badge-text-active"
                : "utility-badge-text"
            }
          >
            Off-line{" "}
          </span>
          <span
            className={
              BasicLineTab === "8"
                ? "utility-badge-numbers-active"
                : "utility-badge-numbers"
            }
          >
            {rowlength.Offline}
          </span>
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default Customerutilitybadge;
