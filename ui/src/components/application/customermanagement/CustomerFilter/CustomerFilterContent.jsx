import React, { useRef } from "react";
import { CardBody, Input, Label } from "reactstrap";
import { Search, X } from "react-feather";
import DatePicker from "react-datepicker";
import { CustomerShowSelectedStrings } from "./CustomerShowSelectedStrings";
// import leadSource from '../leadStatus.json'

export const CustomerFilterContent = (props) => {
  const ContainerForStringFilter = (props) => {
    const inputRef = useRef(null);
    return (
      <CardBody
        style={{ width: "200px", zIndex: "9999" }}
        className="filter-cards-view animate-chk header-level-sub-menu submenu-div "
        id={props.id}
      >
        <div style={{ padding: "20px" }}>
          <div className="job-filter">
            <div className="faq-form">
              <Input
                ref={inputRef}
                autoFocus={inputRef.current === document.activeElement}
                key={`${props.tableHeader}`}
                className="form-control"
                type="text"
                placeholder="Search.."
                value={props.filterText && props.filterText[props.tableHeader]}
                onChange={(e) =>
                  props.setFilterText({
                    ...props.filterText,
                    [props.tableHeader]: e.target.value,
                  })
                }
              />
              <Search className="search-icon" />
            </div>
          </div>

          <div className="checkbox-animated">
            <Label className="d-block" htmlFor="chk-ani">
              <Input
                className="checkbox_animated"
                id="chk-ani"
                type="checkbox"
                checked={
                  props.optionKeys &&
                  props.optionKeys.includes(
                    `${props.tableHeader}.isNotIncludes`
                  )
                }
                onChange={(e) =>
                  props.onChangeHandler(
                    e,
                    props.tableHeader,
                    "isNotIncludes",
                    "is not contains"
                  )
                }
              />
              is not contains
            </Label>
            <Label className="d-block" htmlFor="chk-ani0">
              <Input
                className="checkbox_animated"
                id="chk-ani0"
                type="checkbox"
                checked={
                  props.optionKeys &&
                  props.optionKeys.includes(`${props.tableHeader}.includes`)
                }
                onChange={(e) =>
                  props.onChangeHandler(
                    e,
                    props.tableHeader,
                    "includes",
                    "is contains"
                  )
                }
              />
              is contains
            </Label>
          </div>
        </div>
      </CardBody>
    );
  };
  //filter
  const xyz = () => {
    // alert('clicked')
    //document.getElementById('abc').className.add('showcard');
    var element = document.getElementById("departmentNameId");
    element.classList.add("showcard");
  };

  const { showFilterInAllTab, timeSelectionRadioButtonsComponent } = props;

  return (
    <>
      {showFilterInAllTab ? (
        <>
          <div
            style={{
              backgroundColor: "white",
              padding: 20,
              zIndex: 9999,
              position: "absolute",
              left: "88px",
              width: "200px"
            }}
            className="expirydate"
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <Label className="mb-0" for="radioinline1">
                  <Input
                    className="radio_animated"
                    id="radioinline1"
                    type="radio"
                    name="created_at.Active"
                    checked={
                      props.optionKeys &&
                      props.optionKeys.includes("created_at.Active")
                    }
                    onChange={(e) => {
                      props.setShowDateRadioButton(true);
                      props.onCreatedCheckboxChange(e, "created_at", "Active");
                      props.setCurrentActiveOrExpired("ACT");
                      props.clearAllFilterRadioButton();
                      props.setFilterText({
                        ...props.filterText,
                        ["Active"]: e.target.checked,
                      });
                    }}
                  />
                  Active
                </Label>
              </div>
              <div>
                <Label className="d-block" for="radioinline2">
                  <Input
                    className="radio_animated"
                    id="radioinline2"
                    name="created_at.Expired"
                    type="radio"
                    checked={
                      props.optionKeys &&
                      props.optionKeys.includes("created_at.Expired")
                    }
                    onChange={(e) => {
                      props.setShowDateRadioButton(true);
                      props.onCreatedCheckboxChange(e, "created_at", "Expired");
                      props.setCurrentActiveOrExpired("EXP");
                      props.clearAllFilterRadioButton();
                      props.setFilterText({
                        ...props.filterText,
                        ["Expired"]: e.target.checked,
                      });
                    }}
                  />
                  Expired
                </Label>
              </div>
            </div>
            {timeSelectionRadioButtonsComponent}
          </div>
        </>
      ) : (
        <div
          className="filter-container"
          style={props.levelMenu ? { display: "" } : { display: "none" }}
        >
          <div className="left-header">
            <div className="level-menu outside">
              <ul
                className="header-level-menu "
              >
                <div
                  className="close-circle"
                  onClick={() => props.setLevelMenu(false)}
                  style={{ position: "absolute", right: "5px", zIndex: 202 }}
                >
                  <a href="#javascript">
                    <X />
                  </a>
                </div>

                {/* <li>
                  <ShowSelectedStrings
                    options={props.options}
                    setOptions={props.setOptions}
                    clearAllFilter={props.clearAllFilter}
                    applyFilter={props.applyFilter}
                    setOptionKeys={props.setOptionKeys}
                    filterText={props.filterText}
                    setFilterText={props.setFilterText}
                    clearFilterText={props.clearFilterText}
                    filterSelectionOptions={props.filterSelectionOptions}
                    filterSelectionOptionsFunc={props.filterSelectionOptionsFunc}
                    hideApply={props.hideApply}
                  />
                </li> */}
                <li>
                  <a href="#javascript">
                    <span>First Name</span>
                  </a>
                  {ContainerForStringFilter({
                    id: 1,
                    tableHeader: "first_name",
                    filterText: props.filterText,
                    setFilterText: props.setFilterText,
                    onChangeHandler: props.onChangeHandler,
                    optionKeys: props.optionKeys,
                  })}
                </li>

                <li id="abc">
                  <a href="#javascript" onClick={xyz}>
                    <span>Last Name</span>
                  </a>
                  {ContainerForStringFilter({
                    // id: 'departmentNameId',
                    id: 2,
                    tableHeader: "last_name",
                    filterText: props.filterText,
                    setFilterText: props.setFilterText,
                    onChangeHandler: props.onChangeHandler,
                    optionKeys: props.optionKeys,
                  })}
                </li>

                {/* created date from to */}
                <li>
                  {" "}
                  <a href="#javascript">
                    <span>Created date</span>
                  </a>
                  <ul
                    className="header-level-sub-menu "
                    style={{ width: "320px", height: "400px " }}
                  >
                    <div style={{ display: "flex", whiteSpace: "nowrap" }}>
                      <li>
                        <Label className="mb-0" for="radioinline1">
                          <Input
                            className="radio_animated"
                            // className="checkbox_animated"
                            // id="chk-ani"
                            id="radioinline1"
                            type="radio"
                            name="created_at.Active"
                            checked={
                              props.optionKeys &&
                              props.optionKeys.includes("created_at.Active")
                            }
                            onChange={(e) => {
                              props.onCreatedCheckboxChange(
                                e,
                                "created_at",
                                "Active"
                              );

                              props.setFilterText({
                                ...props.filterText,
                                ["Active"]: e.target.checked,
                              });
                            }}
                          />
                          Active
                        </Label>
                      </li>
                      <li>
                        <Label className="d-block" for="radioinline2">
                          <Input
                            className="radio_animated"
                            // className="checkbox_animated"
                            // id="chk-ani1"
                            id="radioinline2"
                            name="created_at.Expired"
                            type="radio"
                            checked={
                              props.optionKeys &&
                              props.optionKeys.includes("created_at.Expired")
                            }
                            onChange={(e) => {
                              props.onCreatedCheckboxChange(
                                e,
                                "created_at",
                                "Expired"
                              );

                              // props.onCreatedCheckboxChange(
                              //   {...e , target:{
                              //     ...e.target,checked:false
                              //   }},
                              //   "created_at",
                              //   "Active"
                              // )

                              // props.onCreatedCheckboxChange(
                              //   {...e , target:{
                              //     ...e.target,checked:false
                              //   }},
                              //   "created_at",
                              //   "Online"
                              // )

                              props.setFilterText({
                                ...props.filterText,
                                ["Expired"]: e.target.checked,
                              });
                            }}
                          />
                          Expired
                        </Label>
                      </li>
                      <li>
                        <Label className="d-block" for="radioinline3online">
                          <Input
                            className="radio_animated"
                            // className="checkbox_animated"
                            id="radioinline3online"
                            type="radio"
                            name="created_at.Online"
                            checked={
                              props.optionKeys &&
                              props.optionKeys.includes("created_at.Online")
                            }
                            onChange={(e) => {
                              props.onCreatedCheckboxChange(
                                e,
                                "created_at",
                                "Online"
                              );

                              // props.onCreatedCheckboxChange(
                              //   {...e , target:{
                              //     ...e.target,checked:false
                              //   }},
                              //   "created_at",
                              //   "Active"
                              // )

                              // props.onCreatedCheckboxChange(
                              //   {...e , target:{
                              //     ...e.target,checked:false
                              //   }},
                              //   "created_at",
                              //   "Expired"
                              // )
                              props.setFilterText({
                                ...props.filterText,
                                ["Online"]: e.target.checked,
                              });
                            }}
                          />
                          Online
                        </Label>
                      </li>
                    </div>

                    <li>
                      <span>
                        <label className="col-sm-3 col-form-label text-right">
                          {"from"}
                        </label>
                        <br />
                        <div className="col-xl-5 col-sm-9">
                          <div className="date-picker-for-filter">
                            <DatePicker
                              dateFormat="dd-MM-yyyy"
                              className="form-control digits"
                              selected={
                                props.optionKeys &&
                                props.optionKeys.includes(
                                  "created_at.created_date_from"
                                ) &&
                                props.filterText &&
                                props.filterText["created_date_from"]
                              }
                              onChange={(date) => {
                                props.dateHandler(
                                  date,
                                  "created_at",
                                  "created_date_from"
                                );
                                props.setFilterText({
                                  ...props.filterText,
                                  ["created_date_from"]: new Date(date),
                                });
                              }}
                            />
                          </div>
                        </div>
                      </span>
                    </li>
                    <li>
                      <span>
                        <label className="col-sm-3 col-form-label text-right">
                          {"to"}
                        </label>
                        <br />
                        <div className="col-xl-5 col-sm-9">
                          <div className="date-picker-for-filter">
                            <DatePicker
                              dateFormat="dd-MM-yyyy"
                              popperPlacement="top-start"
                              className="form-control digits"
                              selected={
                                props.optionKeys &&
                                props.optionKeys.includes(
                                  "created_at.created_date_to"
                                ) &&
                                props.filterText &&
                                props.filterText["created_date_to"]
                              }
                              onChange={(date) => {
                                props.dateHandler(
                                  date,
                                  "created_at",
                                  "created_date_to"
                                );
                                props.setFilterText({
                                  ...props.filterText,
                                  ["created_date_to"]: new Date(date),
                                });
                              }}
                            />
                          </div>
                        </div>
                      </span>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#javascript">
                    <span>{"Branch"}</span>
                  </a>
                  <ul
                    className="header-level-sub-menu "
                    style={{
                      width: "245px",
                      maxHeight: "300px",
                      overflow: "scroll",
                    }}
                  >
                    {props.branch.map((lead) => {
                      return (
                        <li>
                          <span>
                            <Label className="d-block" htmlFor="chk-ani">
                              <Input
                                className="checkbox_animated"
                                id="chk-facebook"
                                type="checkbox"
                                checked={
                                  props.optionKeys &&
                                  props.optionKeys.includes(
                                    "branch." + lead.name
                                  )
                                }
                                onChange={(e) =>
                                  props.onChangeHandler(
                                    e,
                                    "branch",
                                    lead.name,
                                    lead.name
                                  )
                                }
                              />
                              {lead.name}
                            </Label>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </li>
                <li>
                  <a href="#javascript">
                    <span>{"Zone"}</span>
                  </a>
                  <ul
                    className="header-level-sub-menu "
                    style={{
                      width: "245px",
                      maxHeight: "300px",
                      overflow: "scroll",
                    }}
                  >
                    {props.zone.map((lead) => {
                      return (
                        <li>
                          <span>
                            <Label className="d-block" htmlFor="chk-ani">
                              <Input
                                className="checkbox_animated"
                                id="chk-facebook"
                                type="checkbox"
                                checked={
                                  props.optionKeys &&
                                  props.optionKeys.includes("zone." + lead.name)
                                }
                                onChange={(e) =>
                                  props.onChangeHandler(
                                    e,
                                    "zone",
                                    lead.name,
                                    lead.name
                                  )
                                }
                              />
                              {lead.name}
                            </Label>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </li>
                <li>
                  <a href="#javascript">
                    <span>{"Area"}</span>
                  </a>
                  <ul
                    className="header-level-sub-menu "
                    style={{
                      width: "245px",
                      maxHeight: "300px",
                      overflow: "scroll",
                    }}
                  >
                    {props.areaa.map((lead) => {
                      return (
                        <li>
                          <span>
                            <Label className="d-block" htmlFor="chk-ani">
                              <Input
                                className="checkbox_animated"
                                id="chk-facebook"
                                type="checkbox"
                                checked={
                                  props.optionKeys &&
                                  props.optionKeys.includes("area." + lead.id)
                                }
                                onChange={(e) =>
                                  props.onChangeHandler(
                                    e,
                                    "area",
                                    lead.id,
                                    lead.name
                                  )
                                }
                              />
                              {lead.name}
                            </Label>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </li>
                {/* <li>
              <a href="#javascript">
                <span>Status</span>
              </a>
              {ContainerForStringFilter({
                id: 1,
                tableHeader: "first_name",
                filterText: props.filterText,
                setFilterText: props.setFilterText,
                onChangeHandler: props.onChangeHandler,
                optionKeys: props.optionKeys,
              })}
            </li> */}
                {/* end */}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
