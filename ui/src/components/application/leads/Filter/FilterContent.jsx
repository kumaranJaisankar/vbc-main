import React, { useRef } from 'react'
import { CardBody, Input, Label } from 'reactstrap'
import { Search, X } from 'react-feather'
import DatePicker from 'react-datepicker'

export const FilterContent = (props) => {
  const ContainerForStringFilter = (props) => {
    const inputRef = useRef(null)
    // Sailaja fixed card body overlapping issue(12th Line)for First Name & Last Name on 21st July
    return (
      <CardBody
        style={{ zIndex: '9999', position:"absolute",right:"99%"}}
        className="filter-cards-view animate-chk header-level-sub-menu submenu-div "
        id={props.id}
      >
        <div style={{ padding: '20px' }}>
          <div className="job-filter">
            <div className="faq-form">
              <Input
                ref={inputRef}
                autoFocus={inputRef.current === document.activeElement}
                key={`${props.tableHeader}`}
                className="form-control"
                type="text"
                placeholder="Search"
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
            {/* <Label className="d-block" htmlFor="chk-ani">
              <Input
                className="checkbox_animated"
                id="chk-ani"
                type="checkbox"
                checked={
                  props.optionKeys &&
                  props.optionKeys.includes(
                    `${props.tableHeader}.isNotIncludes`,
                  )
                }
                onChange={(e) =>
                  props.onChangeHandler(
                    e,
                    props.tableHeader,
                    'isNotIncludes',
                    'is not contains',
                  )
                }
              />
              Is not contains
            </Label> */}
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
                    'includes',
                    'is contains',
                  )
                }
              />
              Is contains
            </Label>
          </div>
        </div>
      </CardBody>
    )
  }
//Sailaja CHanged marginLeft as 45rem for filter
//changed to 50 rem by Marieya
  return (
    <div
      className="filter-container"
      style={props.levelMenu ? { display: '' } : { display: 'none' }}
    >
      <div className="left-header">
        <div className="level-menu outside">
          <ul
            className="header-level-menu "
            style={{ width: '245px', zIndex: 200, top:"60px",marginLeft:"50rem"}}
          >
            <div
              className="close-circle"
              onClick={() => props.setLevelMenu(false)}
              style={{ position: 'absolute', right: '5px', zIndex: 202 }}
            >
              <a href="#javascript">
                <X />
              </a>
            </div>
            <li>
              <a href="#javascript">
                <span>First Name</span>
              </a>
              {ContainerForStringFilter({
                id: 1,
                tableHeader: 'first_name',
                filterText: props.filterText,
                setFilterText: props.setFilterText,
                onChangeHandler: props.onChangeHandler,
                optionKeys: props.optionKeys,
              })}
            </li>
            <li id="abc">
              <a href="#javascript">
                <span>Last Name</span>
              </a>
              {ContainerForStringFilter({
                id: 2,
                tableHeader: 'last_name',
                filterText: props.filterText,
                setFilterText: props.setFilterText,
                onChangeHandler: props.onChangeHandler,
                optionKeys: props.optionKeys,
              })}
            </li>
{/* Sailaja fixed card body overlapping issue(146th & 147th Lines) for Lead Source card on 21st July */}

            <li>
              <a href="#javascript">
                <span>{'Lead Source'}</span>
              </a>
              <ul
                className="header-level-sub-menu "
                style={{
                  width: '245px',
                  maxHeight: '300px',
                  overflow: 'scroll',
                  position:"absolute",
                  right:"99%",
                }}
              >
                {props.sourceby.map((lead) => {
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
                                'lead_source.' + lead.id,
                              )
                            }
                            onChange={(e) =>
                              props.onChangeHandler(
                                e,
                                'lead_source',
                                lead.id,
                                lead.name,
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
              {' '}
     {/* Sailaja fixed card body overlapping issue(189th Line) for Created Date card on 21st July */}
        
              <a href="#javascript">
                <span>Created Date</span>
              </a>
              <ul className="header-level-sub-menu " style={{ width: '270px', position:"absolute",right:"99%"}}>
                <li>
                  <span>
                    <label className="col-sm-3 col-form-label text-right">
                      {'From'}
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
                              'created_at.created_date_from',
                            ) &&
                            props.filterText &&
                            props.filterText['created_date_from']
                          }
                          onChange={(date) => {
                            props.dateHandler(
                              date,
                              'created_at',
                              'created_date_from',
                            )
                            props.setFilterText({
                              ...props.filterText,
                              ['created_date_from']: new Date(date),
                            })
                          }}
                        />
                      </div>
                    </div>
                  </span>
                </li>
                <li>
                  <span>
                    <label className="col-sm-3 col-form-label text-right">
                      {'To'}
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
                              'created_at.created_date_to',
                            ) &&
                            props.filterText &&
                            props.filterText['created_date_to']
                          }
                          onChange={(date) => {
                            props.dateHandler(
                              date,
                              'created_at',
                              'created_date_to',
                            )
                            props.setFilterText({
                              ...props.filterText,
                              ['created_date_to']: new Date(date),
                            })
                          }}
                        />
                      </div>
                    </div>
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
