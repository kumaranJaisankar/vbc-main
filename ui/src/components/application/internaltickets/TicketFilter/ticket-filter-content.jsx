import React from "react";
import { Input, Label } from "reactstrap";
import { X } from "react-feather";
import DatePicker from "react-datepicker";
import moment from "moment";

export const TicketFilterContent = (props) => {
  return (
    <div
      className="filter-container"
      style={props.levelMenu ? { display: "" } : { display: "none" }}
    >
      <div className="left-header">
        <div className="level-menu outside">
          <ul
            className="header-level-menu "
            style={{ width: "245px", zIndex: 200, marginLeft:"72%", marginTop:"8%" }}
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
                <span>{'Category'}</span>
              </a>
              <ul
                className="header-level-sub-menu "
                style={{
                  width: '245px',
                  maxHeight: '300px',
                  overflow: 'scroll',
                  marginTop:"17%",
                }}
              >
                {props.helpDeskFilters?.category.map((lead) => {
                  return (
                    <li>
                      <span>
                        <Label className="d-block" htmlFor="chk-ani">
                          <Input
                            className="checkbox_animated"
                            id="chk-facebook"
                            type="checkbox"
                            name={lead.category}
                            checked={props.appliedFilterSchema.ticket_category?.results.some(
                              item => item.id === lead.id
                            )}
                            onChange={(event) =>
                              props.handleMultiplSelection(
                                {
                                  event,
                                  id: lead.id,
                                  filterName: 'ticket_category'
                                }
                              )
                            }
                          />
                          {lead.category}
                        </Label>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </li>

            <li>
              <a href="#javascript">
                <span>{'Sub Category'}</span>
              </a>
              <ul
                className="header-level-sub-menu "
                style={{
                  width: '245px',
                  maxHeight: '300px',
                  overflow: 'scroll',
                }}
              >
                {props.helpDeskFilters?.subcategory.map((lead) => {
                  return (
                    <li>
                      <span>
                        <Label className="d-block" htmlFor="chk-ani">
                          <Input
                            className="checkbox_animated"
                            id="chk-facebook"
                            type="checkbox"
                            name={lead.name}
                            checked={props.appliedFilterSchema.subcategory?.results.some(
                              item => item.id === lead.id
                            )}
                            onChange={(event) =>
                              props.handleMultiplSelection(
                                {
                                  event,
                                  id: lead.id,
                                  filterName: 'subcategory'
                                }
                              )
                            }
                          />
                          {lead.name}
                        </Label>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </li>
            <li>
              <a href="#javascript">
                <span>{'Assigned'}</span>
              </a>
              <ul
                className="header-level-sub-menu "
                style={{
                  width: '245px',
                  maxHeight: '300px',
                  overflow: 'scroll',
                }}
              >
                {props.assignedTo.map((lead) => {
                  return (
                    <li>
                      <span>
                        <Label className="d-block" htmlFor="chk-ani">
                          <Input
                            className="checkbox_animated"
                            id="chk-facebook"
                            type="checkbox"
                            name={lead.username}
                            checked={props.appliedFilterSchema.assigned?.results.some(
                              item => item.id === lead.id
                            )}
                            onChange={(event) =>
                              props.handleMultiplSelection({ event, id: lead.id, filterName: 'assigned' })
                            }
                          />
                          {lead.username}
                        </Label>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </li>

<li>
              <a href="#javascript">
                <span>{'Status'}</span>
              </a>
              <ul
                className="header-level-sub-menu "
                style={{
                  width: '245px',
                  maxHeight: '300px',
                  overflow: 'scroll',
                }}
              >
                {props.helpDeskFilters?.status.map((lead) => {
                  return (
                    <li>
                      <span>
                        <Label className="d-block" htmlFor="chk-ani">
                          <Input
                            className="checkbox_animated"
                            id="chk-facebook"
                            type="checkbox"
                            name={lead.name}
                            checked={props.appliedFilterSchema.status?.results.some(
                              item => item.id === lead.id
                            )}
                            onChange={(event) =>
                              props.handleMultiplSelection({ event, id: lead.id, filterName: 'status' })
                            }
                          />
                          {lead.name}
                        </Label>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </li>
            <li>
              <a href="#javascript">
                <span>{'Priority'}</span>
              </a>
              <ul
                className="header-level-sub-menu "
                style={{
                  width: '245px',
                  maxHeight: '300px',
                  overflow: 'scroll',
                }}
              >
                {props.helpDeskFilters?.priority_sla.map((lead) => {
                  return (
                    <li>
                      <span>
                        <Label className="d-block" htmlFor="chk-ani">
                          <Input
                            className="checkbox_animated"
                            id="chk-facebook"
                            type="checkbox"
                            name={lead.name}
                            checked={props.appliedFilterSchema.priority_sla?.results.some(
                              item => item.id === lead.id
                            )}
                            onChange={(event) =>
                              props.handleMultiplSelection({ event, id: lead.id, filterName: 'priority_sla' })
                            }
                          />
                          {lead.name}
                        </Label>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </li>
            <li>
              {" "}
              <a href="#javascript">
                <span>Open Date</span>
              </a>
              <ul className="header-level-sub-menu " style={{ width: "270px" }}>
                <li>
                  <span>
                    <label className="col-sm-3 col-form-label text-right">
                      {"From"}
                    </label>
                    <br />
                    <div className="col-xl-5 col-sm-9">
                      <div className="date-picker-for-filter">
                        <DatePicker
                          dateFormat="dd-MM-yyyy"
                          className="form-control digits"
                          selected={props.appliedFilterSchema?.open_date?.strVal 
                            ? new Date(props.appliedFilterSchema?.open_date?.strVal)
                            : false
                          }
                          onChange={(date) => {
                            props.handleChange(
                              {
                                name: 'open_date',
                                value: moment(date).format('YYYY-MM-DD'),
                              }
                            );
                          }}
                        />
                      </div>
                    </div>
                  </span>
                </li>
                <li>
                  <span>
                    <label className="col-sm-3 col-form-label text-right">
                      {"To"}
                    </label>
                    <br />
                    <div className="col-xl-5 col-sm-9">
                      <div className="date-picker-for-filter">
                        <DatePicker
                          dateFormat="dd-MM-yyyy"
                          className="form-control digits"
                          selected={props.appliedFilterSchema?.open_date_end?.strVal 
                            ? new Date(props.appliedFilterSchema?.open_date_end?.strVal)
                            : false
                          }
                          onChange={(date) => {
                            props.handleChange(
                              {
                                name: 'open_date_end',
                                value: moment(date).format('YYYY-MM-DD'),
                              }
                            );
                          }}
                        />
                      </div>
                    </div>
                  </span>
                </li>
              </ul>
            </li>
            {/* assigned_date    */}
            <li>
              {" "}
              <a href="#javascript">
                <span>Assigned Date</span>
              </a>
              <ul className="header-level-sub-menu " style={{ width: "270px" }}>
                <li>
                  <span>
                    <label className="col-sm-3 col-form-label text-right">
                      {"From"}
                    </label>
                    <br />
                    <div className="col-xl-5 col-sm-9">
                      <div className="date-picker-for-filter">
                        <DatePicker
                          dateFormat="dd-MM-yyyy"
                          className="form-control digits"
                          selected={props.appliedFilterSchema?.assigned_date?.strVal 
                            ? new Date(props.appliedFilterSchema?.assigned_date?.strVal)
                            : false
                          }
                          onChange={(date) => {
                            props.handleChange(
                              {
                                name: 'assigned_date',
                                value: moment(date).format('YYYY-MM-DD'),
                              }
                            );
                          }}
                        />
                      </div>
                    </div>
                  </span>
                </li>
                <li>
                  <span>
                    <label className="col-sm-3 col-form-label text-right">
                      {"To"}
                    </label>
                    <br />
                    <div className="col-xl-5 col-sm-9">
                      <div className="date-picker-for-filter">
                        <DatePicker
                          dateFormat="dd-MM-yyyy"
                          className="form-control digits"
                          selected={props.appliedFilterSchema?.assigned_date_end?.strVal 
                            ? new Date(props.appliedFilterSchema?.assigned_date_end?.strVal)
                            : false
                          }
                          onChange={(date) => {
                            props.handleChange(
                              {
                                name: 'assigned_date_end',
                                value: moment(date).format('YYYY-MM-DD'),
                              }
                            );
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
                <span>{'Area'}</span>
              </a>
              <ul
                className="header-level-sub-menu "
                style={{
                  width: '245px',
                  maxHeight: '300px',
                  overflow: 'scroll',
                }}
              >
                {props.area.map((lead) => {
                  return (
                    <li>
                      <span>
                        <Label className="d-block" htmlFor="chk-ani">
                          <Input
                            className="checkbox_animated"
                            id="chk-facebook"
                            type="checkbox"
                            name={lead.name}
                            checked={props.appliedFilterSchema.area?.results.some(
                              item => item.id === lead.id
                            )}
                            onChange={(event) =>
                              props.handleMultiplSelection({ event, id: lead.id, filterName: 'area' })
                            }
                          />
                          {lead.name}
                        </Label>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </li> <li>
              <a href="#javascript">
                <span>{'Franchise'}</span>
              </a>
              <ul
                className="header-level-sub-menu "
                style={{
                  width: '245px',
                  maxHeight: '300px',
                  overflow: 'scroll',
                }}
              >
                {props.franchise.map((lead) => {
                  return (
                    <li>
                      <span>
                        <Label className="d-block" htmlFor="chk-ani">
                          <Input
                            className="checkbox_animated"
                            id="chk-facebook"
                            type="checkbox"
                            name={lead.name}
                            checked={props.appliedFilterSchema.franchise?.results.some(
                              item => item.id === lead.id
                            )}
                            onChange={(event) =>
                              props.handleMultiplSelection({ event, id: lead.id, filterName: 'franchise' })
                            }
                          />
                          {lead.name}
                        </Label>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
