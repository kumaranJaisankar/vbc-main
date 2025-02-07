import React, { useMemo } from "react";
import { NewCustomerListsBranchFilterContent } from "./NewCustomerListsBranchFilterContent";
import { NewCustomerListsBranchFilterShowSelectedStrings } from "./NewCustomerListBranchFilterShowSelectedStrings";

export const NewCustomerListsBranchFiltersContainer = (props) => {
  const { customerLists } = props;

  const getAppliedFilters = () => {
    const { additionalFilters } = customerLists;
    let currentAppliedFilterOptions = [];
    Object.keys(additionalFilters).forEach((keyItem) => {
      if (additionalFilters[keyItem]["value"].type === "array") {
        if (additionalFilters[keyItem].value.strVal.length > 0) {
          currentAppliedFilterOptions = [
            ...currentAppliedFilterOptions,
            ...additionalFilters[keyItem]["value"].strVal.map((_) => ({
              displayString: _,
              type: keyItem,
            })),
          ];
        }
      }
    });
    return currentAppliedFilterOptions;
  };

  const appliedAdditionalFiltersOptions = useMemo(getAppliedFilters, [
    customerLists.additionalFilters,
  ]);

  return (
    <div style={{ position: "relative", right: "90px", top: "-15px" }}>
      <NewCustomerListsBranchFilterContent {...props} />
      {appliedAdditionalFiltersOptions.length > 0 && (
        <div
          className="selected-options"
          style={{ left: "-462px", top: "85px" }}
        >
          <NewCustomerListsBranchFilterShowSelectedStrings
            {...props}
            appliedAdditionalFiltersOptions={appliedAdditionalFiltersOptions}
          />
        </div>
      )}
    </div>
  );
};

export default NewCustomerListsBranchFiltersContainer;
