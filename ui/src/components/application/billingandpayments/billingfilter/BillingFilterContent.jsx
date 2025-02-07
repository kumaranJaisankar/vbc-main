import React, { useRef } from 'react'
import { CardBody, Input, Label } from 'reactstrap'
import { Search, X } from 'react-feather'
import DatePicker from 'react-datepicker'
import { BranchShowSelectedStrings } from './BillingShowSelectedStrings'
// import leadSource from '../leadStatus.json'

export const BillingFilterContent = (props) => {
  const ContainerForStringFilter = (props) => {
    const inputRef = useRef(null)
    return (
      <CardBody
        style={{ width: '200px', zIndex: '9999', marginTop: '9%' }}
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
            <Label className="d-block" htmlFor="chk-ani">
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

  const paymentmethodoptions = props.filterDataBkp && props.filterDataBkp.payments && props.filterDataBkp.payments.map((lead) => {
    return lead.payment_method
  })

  const pmtoptions = new Set(paymentmethodoptions ? paymentmethodoptions.filter(p=>p!=null) : [])



  return (
    <div
      className="filter-container"
      style={props.levelMenu ? { display: '' } : { display: 'none' }}
    >
      <div className="left-header">
        <div className="level-menu outside">
          <ul
            className="header-level-menu "
            style={{ width: '245px', zIndex: 200 }}
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
                <span>Payment ID</span>
              </a>
              {ContainerForStringFilter({
                id: 1,
                tableHeader: 'payment_id',
                filterText: props.filterText,
                setFilterText: props.setFilterText,
                onChangeHandler: props.onChangeHandler,
                optionKeys: props.optionKeys,
              })}
            </li>
            <li>
              <a href="#javascript">
                <span>{'Payment Method'}</span>
              </a>
              <ul
                className="header-level-sub-menu "
                style={{
                  width: '245px',
                  maxHeight: '300px',
                  overflow: 'scroll',
                }}
              >
                {[...pmtoptions].map((pmtmethod) => {
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
                                'payment_method.' + pmtmethod,
                              )
                            }
                            onChange={(e) =>
                              props.onChangeHandler(
                                e,
                                'payment_method',
                                pmtmethod,
                                pmtmethod,
                              )
                            }
                          />
                          {pmtmethod}
                        </Label>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </li> 
            {/* <li id="abc">
              <a href="#javascript">
                <span>Payment Method</span>
              </a>
              {ContainerForStringFilter({
                id: 2,
                tableHeader: 'payment_mode',
                filterText: props.filterText,
                setFilterText: props.setFilterText,
                onChangeHandler: props.onChangeHandler,
                optionKeys: props.optionKeys,
              })}
            </li> */}

         
         
          </ul>
        </div>
      </div>
    </div>
  )
}
