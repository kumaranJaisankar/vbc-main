import React, { useRef, useState ,useEffect} from "react";
import { adminaxios } from "../../../../axios";
import { CardBody, Input, Label } from "reactstrap";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MUIBox from "@mui/material/Box";
import {Search, X } from "react-feather";
import DatePicker from "react-datepicker";
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MUIDatePicker from '@mui/lab/DatePicker';
import moment from "moment";
import { getAppliedFiltersObj } from "../data";
import BranchMultiSelectFilter from "./BranchMultiSelectFilter";

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

        {/* <div className="checkbox-animated">
          <Label className="d-block" htmlFor="chk-ani">
            <Input
              className="checkbox_animated"
              id="chk-ani"
              type="checkbox"
              checked={containsValue}
              onChange={handleContainsCheckboxChange}
            />
            is not contains
          </Label>
          <Label className="d-block" htmlFor="chk-ani0">
            <Input
              className="checkbox_animated"
              id="chk-ani0"
              type="checkbox"
              checked={!containsValue}
              onChange={handleContainsCheckboxChange}
            />
            is contains
          </Label>
        </div> */}
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

export const NewCustomerFilterContent = (props) => {
  const [branchdata, setBranchdata] = useState([]);

  const {
    showCustomerListsMoreFilters,
    setShowCustomerListsMoreFilters,
    customerLists: { appliedFilters },
    updateCustomerLists,
    expiryDate,
    setExpiryDate,
    branch,
    zone,
    area,
    currentTab,
  } = props;

  useEffect(() => {

    // adminaxios.get(`accounts/branches/zones/areas/mine`).then((res) => {
    //   console.log(res.data, "i am branch filter");
    //   setBranchdata(res.data);
    // });
  }, []);

  const handleChange = (event) => {
    setExpiryDate(event.target.value);
    const { startDate, endDate } = getStartEndDate(event.target.value);
    const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
    updateCustomerLists((prevState) => ({
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
    updateCustomerLists((prevState) => ({
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

    updateCustomerLists((prevState) => ({
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
      updateCustomerLists((prevState) => ({
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

    updateCustomerLists((prevState) => ({
      ...prevState,
      appliedFilters: {
        ...prevState.appliedFilters,
        [filterFormFieldName]: {
          value: {
            ...prevState.appliedFilters[filterFormFieldName].value,
            strVal: date,
            label: getAppliedFiltersObj()[
              filterFormFieldName
            ].value.label.replace(/{dateplaceholder}/gi,   moment(date).format('YYYY-MM-DD')),

            
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
    updateCustomerLists((prevState) => ({
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
    updateCustomerLists((prevState) => ({
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
          display: showCustomerListsMoreFilters ? "" : "none",
          marginLeft: '76%'
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
                onClick={() => setShowCustomerListsMoreFilters(false)}
                style={{ position: "absolute", right: "5px", zIndex: 202 }}
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
                  <span>GST IN</span>
                </a>
                <ul
                  className="header-level-sub-menu "
                  style={{
                    width: "245px",
                    maxHeight: "300px",
                    overflow: "scroll",
                  }}
                >
                  <li>
                    <span>
                      <Label className="mb-0" for="radioinline14">
                        <Input
                          className="radio_animated"
                          id="radioinline14"
                          type="radio"
                          name="created_at_status.Yes"
                          checked={
                            appliedFilters.created_at_status.value.strVal ===
                            "Yes"
                          }
                          onChange={(e) => {
                            handleCreatedAtStatusChange(e);
                          }}

                        />
                        Yes
                      </Label>

                    </span>
                  </li>

                  <li>
                    <span>
                      {/* <Label className="mb-0" for="radioinline1">  */}
                      <Label className="d-block" for="radioinline15">
                        <Input
                          className="radio_animated"
                          id="radioinline15"
                          type="radio"
                          name="created_at_status.No"
                          checked={
                            appliedFilters.created_at_status.value.strVal ===
                            "No"
                          }
                          onChange={(e) => {
                            handleCreatedAtStatusChange(e);
                          }}

                        />
                        No
                      </Label>

                    </span>
                  </li>

                </ul>
              </li> 
              {/* <li id="abc">
                <a href="#javascript" onClick={() => { }}>
                  <span>GST IN</span>
                </a>
                <LastNameFirstNameStringFilterContainer
                  id="gst_number"
                  fieldName={"gst_number"}
                  fieldValue={appliedFilters.gst_number.value.strVal}
                  containsValue={appliedFilters.gst_number.contains.strVal}
                  handleContainsCheckboxChange={(e) =>
                    handleContainsCheckboxChange({
                      e,
                      fieldName: "gst_number",
                    })
                  }
                  handleFirstLastNameChange={(e) =>
                    handleFirstLastNameChange(e)
                  }
                />
              </li> */}
              <li>
                {" "}
                <a href="#javascript">
                  <span>Custom Date</span>
                </a>
                <ul
                  className="header-level-sub-menu "
                  style={{ width: "380px", height: "150px ",display:"flex" }}
                >
                  <div style={{ display: "flex", whiteSpace: "nowrap" }}>
                    {/* <li>
                      <Label className="mb-0" for="radioinline1">
                        <Input
                          className="radio_animated"
                          id="radioinline1"
                          type="radio"
                          name="created_at_status.Active"
                          checked={
                            appliedFilters.created_at_status.value.strVal ===
                            "Active"
                          }
                          onChange={(e) => {
                            handleCreatedAtStatusChange(e);
                          }}
                        />
                        Active
                      </Label>
                    </li>
                    <li>
                      <Label className="d-block" for="radioinline2">
                        <Input
                          className="radio_animated"
                          id="radioinline2"
                          name="created_at_status.Expired"
                          type="radio"
                          checked={
                            appliedFilters.created_at_status.value.strVal ===
                            "Expired"
                          }
                          onChange={(e) => {
                            handleCreatedAtStatusChange(e);
                          }}
                        />
                        Expired
                      </Label>
                    </li>
                    <li>
                      <Label className="d-block" for="radioinline3online">
                        <Input
                          className="radio_animated"
                          id="radioinline3online"
                          type="radio"
                          name="created_at_status.Online"
                          checked={
                            appliedFilters.created_at_status.value.strVal ===
                            "Online"
                          }
                          onChange={(e) => {
                            handleCreatedAtStatusChange(e);
                          }}
                        />
                        Online
                      </Label>
                    </li> */}
                    {/* new connections filter */}
                    {/* <li>
                      <Label className="d-block" for="radioinline3online">
                        <Input
                          className="radio_animated"
                          id="radioinline3online"
                          type="radio"
                          name="created_at_status.Online"
                          checked={
                            appliedFilters.created_at_status.value.strVal ===
                            "Online"
                          }
                          onChange={(e) => {
                            handleCreatedAtStatusChange(e);
                          }}
                        />
                        New Connections
                      </Label>
                    </li> */}
                    {/* end */}
                  </div>

                  <li>
                    <span>
                      <label className="col-sm-3 col-form-label text-right">
                        {"From"}
                      </label>
                      <br />
                      <div className="col-xl-5 col-sm-9">
                        <div className="date-picker-for-filter">
                          <DatePicker
                            className="form-control digits"
                            name="created_at_from_date"
                            selected={
                              appliedFilters.created_at_from_date.value.strVal
                            }
                            onChange={(date) => {
                              handleCreatedAtDateChange(
                                date,
                                "created_at_from_date"
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
                            popperPlacement="top-start"
                            className="form-control digits"
                            name="created_at_to_date"
                            selected={
                              appliedFilters.created_at_to_date.value.strVal
                            }
                            onChange={(date) => {
                              handleCreatedAtDateChange(
                                date,
                                "created_at_to_date"
                              );
                            }}
                          />
                        </div>
                      </div>
                    </span>
                  </li>
                </ul>
              </li>
              {
                currentTab === 'act' &&
                (
                  <li>
                    <a href="#javascript">
                      <span>About to Expire</span>
                    </a>
                    <ul
                      className="header-level-sub-menu "
                      style={{ width: "475px", height: "400px ", padding: '20px' }}
                    >
                      <div style={{ display: "flex", whiteSpace: "nowrap" }}>
                        <FormControl>
                          <FormLabel id="demo-controlled-radio-buttons-group">Expiry</FormLabel>
                          <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={expiryDate}
                            onChange={handleChange}
                          >
                            <FormControlLabel value="today" control={<Radio />} label="Today" />
                            <FormControlLabel value="tomorrow" control={<Radio />} label="Tomorrow" />
                            <FormControlLabel value="one_week" control={<Radio />} label="One Week" />
                          </RadioGroup>
                        </FormControl>
                      </div>
                      <MUIBox sx={{ display: 'flex', justifyContent: 'center', fontWeight: 500 }}>OR</MUIBox>
                      <div>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <MUIBox sx={{ mt: '10px' }}>
                            <MUIDatePicker
                              label="From"
                              value={appliedFilters.expiry_date.value.strVal}
                              onChange={(newValue) => {
                                handleExpiryChange('expiry_date', newValue);
                              }}
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </MUIBox>
                          <MUIBox sx={{ mt: '10px' }}>
                            <MUIDatePicker
                              label="To"
                              value={appliedFilters.expiry_date_end.value.strVal}
                              onChange={(newValue) => {
                                handleExpiryChange('expiry_date_end', newValue);
                              }}
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </MUIBox>
                        </LocalizationProvider>
                      </div>
                    </ul>
                  </li>
                )
              }

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
                  <BranchMultiSelectFilter
                  branchdata={branchdata}
                  updateCustomerLists={updateCustomerLists}
                  // customerLists={customerLists}
                  appliedFilters={appliedFilters}
                  />
                  {/* {branch.map((branchItem) => {
                    return (
                      <li>
                        <span>
                          <Label className="d-block" htmlFor="chk-ani">
                            <Input
                              className="checkbox_animated"
                              id="chk-facebook"
                              type="checkbox"
                              name={branchItem.name}
                              checked={appliedFilters.branch.value.results.some(
                                item => item.id === branchItem.id
                              )}
                              onChange={(e) =>
                                handleFilters({
                                  e,
                                  id: branchItem.id,
                                  filterName: 'branch'
                                })
                              }
                            />
                            {branchItem.name}
                          </Label>
                        </span>
                      </li>
                    );
                  })} */}
                </ul>
              </li>
              {/* <li>
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
                  {zone.map((zoneItem) => {
                    return (
                      <li>
                        <span>
                          <Label className="d-block" htmlFor="chk-ani">
                            <Input
                              className="checkbox_animated"
                              id="chk-facebook"
                              type="checkbox"
                              name={zoneItem.name}
                              checked={appliedFilters.zone.value.results.some(
                                item => item.id === zoneItem.id
                              )}
                              onChange={(e) =>
                                handleFilters({
                                  e,
                                  id: zoneItem.id,
                                  filterName: 'zone'
                                })
                              }
                            />
                            {zoneItem.name}
                          </Label>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </li> */}
              {/* <li>
                <a href="#javascript">
                  <span>{"Area"}</span>
                </a>
                <ul
                  className="header-level-sub-menu"
                  style={{
                    width: "245px",
                    maxHeight: "300px",
                    overflow: "scroll",
                  }}
                >
                  {area.map((areaItem) => {
                    return (
                      <li>
                        <span>
                          <Label className="d-block" htmlFor="chk-ani">
                            <Input
                              className="checkbox_animated"
                              id="chk-facebook"
                              type="checkbox"
                              name={areaItem.name}
                              checked={appliedFilters.area.value.results.some(
                                item => item.id === areaItem.id
                              )}
                              onChange={(e) =>
                                handleFilters({
                                  e,
                                  id: areaItem.id,
                                  filterName: 'area'
                                })
                              }
                            />
                            {areaItem.name}
                          </Label>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
