import React, { useRef } from "react";
import { Input, Label } from "reactstrap";

import { X } from "react-feather";

import Multiselect from "./multiselectcheckbox";
import MultiselectFranchise from "./multiselectfranchise";

export const NewWalletFilterContent = (props) => {
  const {
    showWalletListsMoreFilters,
    setShowWalletListsMoreFilters,
    walletLists: { appliedFilters },
    updateWalletLists,
    branch,
  } = props;

  const handleFilters = ({ e, id, filterName }) => {
    const { checked, name } = e.target;
    let results = [];

    if (checked) {
      results = [
        ...appliedFilters[filterName].value.results,
        { id, value: name },
      ];
    } else {
      results = appliedFilters[filterName].value.results.filter(
        (item) => item.id !== id
      );
    }

    updateWalletLists((prevState) => ({
      ...prevState,
      appliedFilters: {
        ...prevState.appliedFilters,
        [filterName]: {
          ...prevState.appliedFilters[filterName],
          value: {
            ...prevState.appliedFilters[filterName].value,
            results,
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
          display: showWalletListsMoreFilters ? "" : "none",
          marginLeft: "300px",
        }}
      >
        <div className="left-header">
          <div className="level-menu outside">
            <ul className="header-level-menu " style={{ width: "200px" }}>
              <div
                className="close-circle"
                onClick={() => setShowWalletListsMoreFilters(false)}
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
                  {branch.map((branchItem) => {
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
                                (item) => item.id === branchItem.id
                              )}
                              onChange={(e) =>
                                handleFilters({
                                  e,
                                  id: branchItem.id,
                                  filterName: "branch",
                                })
                              }
                            />
                            {branchItem.name}
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
