import React, { useRef } from 'react'
import { CardBody, Input, Label } from 'reactstrap'
import { Search, X } from 'react-feather'
import DatePicker from 'react-datepicker'
import { BranchShowSelectedStrings } from './FranchiseShowSelectedStrings'
// import leadSource from '../leadStatus.json'


//changed css on line 15 by Marieya
export const FranchiseFilterContent = (props) => {
  const ContainerForStringFilter = (props) => {
    const inputRef = useRef(null)
    return (
      <CardBody
        style={{ zIndex: '9999', position:"absolute",right:"99%" }}
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
            {/*commented out is not contains by mareiya */}
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

  return (
    <div
      className="filter-container"
      style={props.levelMenu ? { display: '' } : { display: 'none' }}
    >
      <div className="left-header">
        <div className="level-menu outside">
 {/* Sailaja fixed FRA-11 filter card is overlapping on Edit pannel on 16th August Ref  FRA-11 */}
          <ul
            className="header-level-menu "
            style={{ width: '245px', zIndex: 2,left:"-188px" }}
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
                <span>Franchise Name</span>
              </a>
              {ContainerForStringFilter({
                id: 1,
                tableHeader: 'name',
                filterText: props.filterText,
                setFilterText: props.setFilterText,
                onChangeHandler: props.onChangeHandler,
                optionKeys: props.optionKeys,
              })}
            </li>
            <li>
              <a href="#javascript">
                <span>{'Type'}</span>
              </a>
              <ul
//  Sailaja fixed FRA-11 filter 2nd card is overlapping with previous card on 16th August Ref  FRA-11 

                className="header-level-sub-menu "
                style={{
                  width: '245px',
                  maxHeight: '300px',
                  overflow: 'scroll',
                  right:"99%",
                  zIndex:2
                }}
              >
                {props.franchiseType.map((lead) => {
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
                                'type.' + lead.id,
                              )
                            }
                            onChange={(e) =>
                              props.onChangeHandler(
                                e,
                                'type',
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

         
         
          </ul>
        </div>
      </div>
    </div>
  )
}
