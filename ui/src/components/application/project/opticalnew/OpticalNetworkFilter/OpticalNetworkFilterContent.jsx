import React, { useRef } from "react";
import { CardBody, Input, Label } from "reactstrap";
import { Search, X } from "react-feather";
import DatePicker from "react-datepicker";
import { OpticalNetworkShowSelectedStrings } from "./OpticalNetworkShowSelectedStrings";

export const OpticalNetworkFilterContent = (props) => {
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
    var element = document.getElementById("departmentNameId");
    element.classList.add("showcard");
  };
  return (
    <div
      className="filter-container"
      style={props.levelMenu ? { display: "" } : { display: "none" }}
    >
      <div className="left-header">
        <div className="level-menu outside">
          <ul
            className="header-level-menu "
            style={{ width: "245px", zIndex: 200 , marginLeft:"-18%", marginTop:"8%"}}
          >
            <div
              className="close-circle"
              onClick={() => props.setLevelMenu(false)}
              style={{ position: "absolute", right: "5px", zIndex: 0 }}
            >
              <a href="#javascript">
                <X />
              </a>
            </div>
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
                  position:"absolute",
                  right:"99%",
                }}
              >
 {/* Sailaja fixed Zone Card and Sub Zone filter card position(122th Line) on 20th July REF NET_13 */}
 
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
          </ul>
        </div>
      </div>
    </div>
  );
};
