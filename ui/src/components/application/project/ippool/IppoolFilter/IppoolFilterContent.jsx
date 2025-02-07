import React, { useRef } from 'react'
import { CardBody, Input, Label } from 'reactstrap'
import { Search, X } from 'react-feather'
// Sailaja Fixed IP Pool Filter Cards on 20th July REF NET_02
  
export const IppoolFilterContent = (props) => {
  const ContainerForStringFilter = (props) => {
    const inputRef = useRef(null)
    return (
      <CardBody
        style={{ width: '200px', zIndex: '9999', position:"absolute",right:"99%" }}
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
                    'Is Not contains',
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
                    'Is Contains',
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
// Sailaja Fixed IP Pool Filter Card-1 on 20th July REF NET_02
  return (
    <div
      className="filter-container"
      style={props.levelMenu ? { display: '' } : { display: 'none' }}
    >
      <div className="left-header">
        <div className="level-menu outside" style={{position:"absolute",right:"21%"}}>
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
            <li>
              <a href="#javascript">
                <span>IP Pool Name</span>
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
            <li id="abc">
              <a href="#javascript">
                <span>Branch</span>
              </a>
              {ContainerForStringFilter({
                id: 2,
                tableHeader: 'branch',
                filterText: props.filterText,
                setFilterText: props.setFilterText,
                onChangeHandler: props.onChangeHandler,
                optionKeys: props.optionKeys,
              })}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
