import React, { useRef } from "react";
import { CardBody, Input, Label } from "reactstrap";
import {  Search, X } from "react-feather";
import moment from "moment";
import { getAppliedFiltersObj } from "../ConstatantData";

const LastNameFirstNameStringFilterContainer = (props) => {
  const {
    id,
    fieldName,
    fieldValue,
    handleFirstLastNameChange,
  } = props;
  const inputRef = useRef(null);
  return (
    <CardBody
      style={{ width: "200px", zIndex: "9999" }}
      className="filter-cards-view animate-chk header-level-sub-menu submenu-div "
      id={id}
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
              placeholder="Search"
              value={fieldValue}
              name={fieldName}
              onChange={handleFirstLastNameChange}
            />
            <Search className="search-icon" />
          </div>
        </div>

        
      </div>
    </CardBody>
  );
};

const getStartEndDate = (val) => {
  let todayDate = new Date();
  const tomorrowDate = moment(new Date().setDate(new Date().getDate() + 1)).format('YYYY-MM-DD');
  const startDate = moment(todayDate).format('YYYY-MM-DD');
  if (val === 'today') {
    return {
      startDate, endDate: todayDate
    };
  } else if (val === 'tomorrow') {
    return {
      startDate: tomorrowDate,
      endDate: tomorrowDate,
    }
  } return {
    startDate,
    endDate: todayDate.setDate(todayDate.getDate() + 7),
  }
}

export const NewLeadFilterContent = (props) => {
  const {
    showLeadListsMoreFilters,
    setShowLeadListsMoreFilters,
    leadLists: { appliedFilters },
    updateleadLists,
    setExpiryDate,
    lead,
  } = props;

  const handleChange = (event) => {
    setExpiryDate(event.target.value);
    const { startDate, endDate } = getStartEndDate(event.target.value);
    const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
    updateleadLists((prevState) => ({
      ...prevState,
      appliedFilters: {
        ...prevState.appliedFilters,
        expiry_date: {
          value: {
            ...prevState.appliedFilters.expiry_date.value,
            strVal: startDate,
            label: getAppliedFiltersObj().expiry_date.value.label.replace(/{dateplaceholder}/gi, startDate),
          },
        },
        expiry_date_end: {
          value: {
            ...prevState.appliedFilters.expiry_date_end.value,
            strVal: formattedEndDate,
            label: getAppliedFiltersObj().expiry_date_end.value.label.replace(/{dateplaceholder}/gi, formattedEndDate),
          },
        },
      },
    }));
  };

  const handleExpiryChange = (name, dateValue) => {
    updateleadLists((prevState) => ({
      ...prevState,
      appliedFilters: {
        ...prevState.appliedFilters,
        [name]: {
          value: {
            ...prevState.appliedFilters[name].value,
            strVal: moment(dateValue).format('YYYY-MM-DD'),
            label: getAppliedFiltersObj()[name].value.label.replace(/{dateplaceholder}/gi, moment(dateValue).format('YYYY-MM-DD')),
          },
        },
      },
    }));
  };

  const handleFilters = ({ e, id, filterName }) => {
    const { checked, name } = e.target;
    let results = [];

    if (checked) {
      results = [...appliedFilters[filterName].value.results, { id, value: name }]
    } else {
      results = appliedFilters[filterName].value.results.filter(item => item.id !== id);
    }

    updateleadLists((prevState) => ({
      ...prevState,
      appliedFilters: {
        ...prevState.appliedFilters,
        [filterName]: {
          ...prevState.appliedFilters[filterName],
          value: {
            ...prevState.appliedFilters[filterName].value,
            results,
          }
        }
      },
    }));
  };

  const handleCreatedAtStatusChange = ({ target }) => {
    const { checked, name } = target;
    const [, statusValue] = name.split(".");
    if (checked) {
      updateleadLists((prevState) => ({
        ...prevState,
        appliedFilters: {
          ...prevState.appliedFilters,
          created_at_status: {
            value: {
              ...prevState.appliedFilters.created_at_status.value,
              strVal: statusValue,
              label: getAppliedFiltersObj().created_at_status.value.label.replace(
                /{statusplaceholder}/gi,
                statusValue
              ),
            },
          },
        },
      }));
    }
  };

  const handleCreatedAtDateChange = (date, name) => {
    const filterFormFieldName = name;

    updateleadLists((prevState) => ({
      ...prevState,
      appliedFilters: {
        ...prevState.appliedFilters,
        [filterFormFieldName]: {
          value: {
            ...prevState.appliedFilters[filterFormFieldName].value,
            strVal: date,
            label: getAppliedFiltersObj()[
              filterFormFieldName
            ].value.label.replace(/{dateplaceholder}/gi, date),
          },
        },
      },
    }));
  };

  const handleFirstLastNameChange = (e) => {
    const { name, value } = e.target;
    let displayLabel = getAppliedFiltersObj()[name].value.label.replace(
      /{nameplaceholder}/gi,
      value
    );
    displayLabel = displayLabel.replace(
      /{containsplaceholder}/gi,
      appliedFilters[name].contains.strVal
        ? ""
        : ":"
    );
    updateleadLists((prevState) => ({
      ...prevState,
      appliedFilters: {
        ...prevState.appliedFilters,
        [name]: {
          ...prevState.appliedFilters[name],
          value: {
            ...prevState.appliedFilters[name].value,
            strVal: value,
            label: displayLabel,
          },
        },
      },
    }));
  };

  const handleContainsCheckboxChange = ({ e, fieldName }) => {
    let displayLabel = getAppliedFiltersObj()[fieldName].value.label.replace(
      /{nameplaceholder}/gi,
      appliedFilters[fieldName].value.strVal
    );
    displayLabel = displayLabel.replace(
      /{containsplaceholder}/gi,
      appliedFilters[fieldName].contains.strVal
        ? "contains"
        : "does not contain"
    );
    updateleadLists((prevState) => ({
      ...prevState,
      appliedFilters: {
        ...prevState.appliedFilters,
        [fieldName]: {
          ...prevState.appliedFilters[fieldName],
          contains: {
            ...prevState.appliedFilters[fieldName].contains,
            strVal: !prevState.appliedFilters[fieldName].contains.strVal,
          },
          value: {
            ...prevState.appliedFilters[fieldName].value,
            label: displayLabel,
          },
        },
      },
    }));
  };

  return (
    <>
      <div
        className="filter-container"
        style={{
          display: showLeadListsMoreFilters ? "" : "none",
          marginLeft: '600px'
        }}
      >
        <div className="left-header">
          <div className="level-menu outside">
            <ul
              className="header-level-menu "
              style={{ width: '200px' }}
            >
              <div
                className="close-circle"
                onClick={() => setShowLeadListsMoreFilters(false)}
                style={{ position: "absolute", right: "5px", zIndex: 202, background:"#f1effe" }}
              >
                <a href="#javascript">
                  <X />
                </a>
              </div>
              <li>
                <a href="#javascript">
                  <span>First Name</span>
                </a>
                <LastNameFirstNameStringFilterContainer
                  id="first_name"
                  fieldName={"first_name"}
                  fieldValue={appliedFilters.first_name.value.strVal}
                  containsValue={appliedFilters.first_name.contains.strVal}
                  handleContainsCheckboxChange={(e) =>
                    handleContainsCheckboxChange({
                      e,
                      fieldName: "first_name",
                    })
                  }
                  handleFirstLastNameChange={(e) =>
                    handleFirstLastNameChange(e)
                  }
                />
              </li>

              <li id="abc">
                <a href="#javascript" onClick={() => { }}>
                  <span>Last Name</span>
                </a>
                <LastNameFirstNameStringFilterContainer
                  id="last_name"
                  fieldName={"last_name"}
                  fieldValue={appliedFilters.last_name.value.strVal}
                  containsValue={appliedFilters.last_name.contains.strVal}
                  handleContainsCheckboxChange={(e) =>
                    handleContainsCheckboxChange({
                      e,
                      fieldName: "last_name",
                    })
                  }
                  handleFirstLastNameChange={(e) =>
                    handleFirstLastNameChange(e)
                  }
                />
              </li>


              <li>
                <a href="#javascript">
                  <span>{"Lead Source"}</span>
                </a>
                <ul
                  className="header-level-sub-menu "
                  style={{
                    width: "245px",
                    maxHeight: "300px",
                    overflow: "scroll",
                  }}
                >
                  {lead.map((leadItem) => {
                    return (
                      <li>
                        <span>
                          <Label className="d-block" htmlFor="chk-ani">
                            <Input
                              className="checkbox_animated"
                              id="chk-facebook"
                              type="checkbox"
                              name={leadItem.name}
                              checked={appliedFilters.lead_source.value.results.some(
                                item => item.id === leadItem.id
                              )}
                              onChange={(e) =>
                                handleFilters({
                                  e,
                                  id: leadItem.id,
                                  filterName: 'lead_source'
                                })
                              }
                            />
                            {leadItem.name}
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
    </>
  );
};
