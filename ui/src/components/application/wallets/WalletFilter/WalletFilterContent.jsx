import React, { useRef ,useState} from "react";
import { CardBody, Input, Label } from "reactstrap";
import { Search, X } from "react-feather";
import DatePicker from "react-datepicker";
import { WalletShowSelectedStrings } from "./WalletShowSelectedStrings";
// import leadSource from '../leadStatus.json'
import Multiselect from './multiselectcheckbox';
import MultiselectFranchise from "./multiselectfranchise";







export const WalletFilterContent = (props) => {

  
  const [showfranchisefilter,setShowfranchisefilter] = useState(true);
  
  const tokenInfo = JSON.parse(localStorage.getItem("token"));
  console.log(tokenInfo,"hi")
  let franchisefilter = true;
  if(tokenInfo && tokenInfo.user_type === "Franchise Owner"){
   franchisefilter = false;
    
   }

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

  return (
    <div
      className="filter-container"
      style={props.levelMenu ? { display: "block" } : { display: "none" }}
    >
      <div className="left-header">
        <div className="level-menu outside">
          <ul
            className="header-level-menu "
            style={{ width: "245px", zIndex: 200,marginLeft:"-5.0rem" }}
          >
            <div
              className="close-circle"
              onClick={() => props.setLevelMenu(false)}
              style={{ position: "absolute", right: "5px", zIndex: 1 }}
            >
              <a href="#javascript">
                <X />
              </a>
            </div>

            { franchisefilter ? 
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
                  zIndex: 1,
                }}
              >
                <Multiselect
                 style={{zIndex:1}}
                setOptions={props.setOptions}
                options={props.options}
                optionKeys={props.optionKeys}
                allList={props.branch}
                filteredData={props.filteredData}
                setFiltereddata={props.setFiltereddata}
                setFilteredTableData={props.setFilteredTableData}
                filteredDataBkp={props.filteredDataBkp}
                filterwithinfilter={props.filterwithinfilter}
                setFilterwithinfilter={props.setFilterwithinfilter}
                />
                {/* {props.branch.map((branchitem) => {
                  return (
                    <li>
                      <span>
                        <Label className="d-block" htmlFor="chk-ani">
                          <Input
                            className="checkbox_animated"
                            id="chk-facebook"
                            type="checkbox"
                            name={branchitem.branch}
                            checked={

                              props.selectedBranch.includes(branchitem.branch)
                            }
                            // checked={
                            //   props.optionKeys &&
                            //   props.optionKeys.includes("branch." + lead.branch)
                            // }
                            onChange={(e) =>
                              props.onChangeHandler(
                                e,
                                "branch",
                                branchitem.branch,
                                branchitem.branch,
                                branchitem.franchises.map((item)=>
                                item.franchise
                                )
                              )
                            }
                          />
                          {branchitem.branch}
                          <ul style={{marginTop:"10px"}}>
                            {branchitem.franchises.map((item) => {
                              return (
                                <li>
                                  <span>
                                    <Label
                                      className="d-block"
                                      htmlFor="chk-ani"
                                    >
                                      <Input
                                        className="checkbox_animated"
                                        name={item.franchise}
                                        id="chk-facebook"
                                        type="checkbox"
                                        checked={
                                          props.selectedBranch.includes(item.franchise)
                                        }
                                        // checked={
                                        //   props.optionKeys &&
                                        //   props.optionKeys.includes(
                                        //     "franchise." + lead.franchise
                                        //   )
                                        // }
                                        onChange={(e) =>
                                          props.onChangeHandler(
                                            e,
                                            "franchise",
                                            item.franchise,
                                            item.franchise,
                                            branchitem
                                          )
                                        }
                                      />
                                      {item.franchise}
                                    </Label>
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </Label>
                      </span>
                    </li>
                  );
                })} */}
              </ul>
            </li>
 :""}
            <li>
          
              <a href="#javascript">
                <span>{"Franchise"}</span>
              </a>
            
              <ul
                className="header-level-sub-menu "
                style={{
                  width: "245px",
                  maxHeight: "300px",
                  overflow: "scroll",
                  zIndex:1
                }}
              >
              
              <div>

                <MultiselectFranchise
                 allList={props.branch}
                 filteredData={props.filteredData}
                 setFiltereddata={props.setFiltereddata}
                 setFilteredTableData={props.setFilteredTableData}
                 filteredDataBkp={props.filteredDataBkp}
                 setOptions={props.setOptions}
                  options={props.options}
                optionKeys={props.optionKeys}
                
                
                />
              </div> 

                {/* {props.franchise.map((lead) => {
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
                                "franchise." + lead.name
                              )
                            }
                            onChange={(e) =>
                              props.onChangeHandler(
                                e,
                                "franchise",
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
                })} */}
              </ul>
            </li>
            
          </ul>
        </div>
      </div>
    </div>
  );
};
