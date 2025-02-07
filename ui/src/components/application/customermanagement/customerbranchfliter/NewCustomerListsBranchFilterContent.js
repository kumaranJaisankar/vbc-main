import React from "react";
import { Input, Label } from "reactstrap";
import { X } from "react-feather";

export const NewCustomerListsBranchFilterContent = (props) => {
  const {
    showCustomerListsBranchMoreFilters,
    setShowCustomerListsBranchMoreFilters,
    customerLists: { additionalFilters },
    updateCustomerLists,
    franchiseBranches,
    franchise,
  } = props;

  const handleFilterBranchSelection = ({ e, id }) => {
    const { checked, name } = e.target;
    let { franchiseBranches } = additionalFilters;
    if (checked) {
      franchiseBranches["value"].strVal.push(name);
      franchiseBranches["value"].idVal.push(id);
    } else {
      franchiseBranches["value"].strVal = franchiseBranches[
        "value"
      ].strVal.filter((item) => item !== name);
      franchiseBranches["value"].idVal = franchiseBranches[
        "value"
      ].idVal.filter((item) => item !== id);
    }

    updateCustomerLists((prevState) => ({
      ...prevState,
      additionalFilters: {
        ...prevState.additionalFilters,
        franchiseBranches: {
          ...prevState.additionalFilters.franchiseBranches,
          ...franchiseBranches,
        },
      },
    }));
  };

  const handleFilterFranchiseSelection = ({ e, id }) => {
    const { checked, name } = e.target;
    let { franchises } = additionalFilters;
    if (checked) {
      franchises["value"].strVal.push(name);
      franchises["value"].idVal.push(id);
    } else {
      franchises["value"].strVal = franchises["value"].strVal.filter(
        (item) => item !== name
      );
      franchises["value"].idVal = franchises["value"].idVal.filter(
        (item) => item !== id
      );
    }

    updateCustomerLists((prevState) => ({
      ...prevState,
      additionalFilters: {
        ...prevState.additionalFilters,
        franchises: {
          ...prevState.additionalFilters.franchises,
          ...franchises,
        },
      },
    }));
  };

  return (
    <>
      <div
        className="filter-container"
        style={
          showCustomerListsBranchMoreFilters
            ? { display: "" }
            : { display: "none" }
        }
      >
        <div className="left-header">
          <div className="level-menu outside">
            <ul
              className="header-level-menu "
            >
              <div
                className="close-circle"
                onClick={() => setShowCustomerListsBranchMoreFilters(false)}
                style={{ position: "absolute", right: "5px", zIndex: 202 }}
              >
                <a href="#javascript">
                  <X />
                </a>
              </div>
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
                  {franchiseBranches.map((branchItem) => {
                    return (
                      <li>
                        <span>
                          <Label className="d-block" htmlFor="chk-ani">
                            <Input
                              className="checkbox_animated"
                              id="chk-facebook"
                              type="checkbox"
                              name={branchItem.name}
                              checked={additionalFilters.franchiseBranches.value.idVal.includes(
                                branchItem.id
                              )}
                              onChange={(e) => {
                                handleFilterBranchSelection({
                                  e,
                                  id: branchItem.id,
                                });
                              }}
                            />
                            {branchItem.name}
                          </Label>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li>
                <a href="#javascript">
                  <span>{"Franchise"}</span>
                </a>
                <ul
                  className="header-level-sub-menu"
                  style={{
                    width: "245px",
                    maxHeight: "300px",
                    overflow: "scroll",
                  }}
                >
                  {franchise.map((franchiseItem) => {
                    return (
                      <li>
                        <span>
                          <Label className="d-block" htmlFor="chk-ani">
                            <Input
                              className="checkbox_animated"
                              id="chk-facebook"
                              type="checkbox"
                              name={franchiseItem.name}
                              checked={additionalFilters.franchises.value.idVal.includes(
                                franchiseItem.id
                              )}
                              onChange={(e) => {
                                handleFilterFranchiseSelection({
                                  e,
                                  id: franchiseItem.id,
                                });
                              }}
                            />
                            {franchiseItem.name}
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
