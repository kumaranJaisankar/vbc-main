import React from "react";
import Stack from "@mui/material/Stack";
import { Typeahead } from "react-bootstrap-typeahead";
import { getAppliedFiltersObj } from "../ConstatantData";
import "react-bootstrap-typeahead/css/Typeahead.css";

export const NewLeadShowSelectedStrings = (props) => {
  const {
    leadLists,
    appliedFiltersOptions,
    updateleadLists,
    setExpiryDate
  } = props;

  const clearAllFilter = () => {
    let clonedCustLists = { ...leadLists };
    clonedCustLists.appliedFilters = JSON.parse(JSON.stringify(getAppliedFiltersObj()));
    updateleadLists(clonedCustLists);
    setExpiryDate('');
  };

  const handleFilterSelectionChange = (selectedOptions) => {
    const removedFilterOption = appliedFiltersOptions.find(
      item => !selectedOptions.some(selecteItem => selecteItem.displayString === item.displayString)
    );

    if (
      removedFilterOption.type === "zone" ||
      removedFilterOption.type === "area" ||
      removedFilterOption.type === "branch"
    ) {
      updateleadLists((prevState) => { 
        return {
          ...prevState,
          appliedFilters: {
            ...prevState.appliedFilters,
            [removedFilterOption.type]: {
              value: {
                ...prevState.appliedFilters[removedFilterOption.type].value,
                results: prevState.appliedFilters[removedFilterOption.type].value.results.filter((item) => item.value !== removedFilterOption.displayString)
              }
            }
          },
      }});
    }
    else {
      updateleadLists((prevState) => ({
        ...prevState,
        appliedFilters: {
          ...prevState.appliedFilters,
          [removedFilterOption.type]: {
            ...getAppliedFiltersObj()[removedFilterOption.type],
          },
        },
      }));
    }
  };

  return (
    <Stack spacing={2} direction="row">
      <button class="rbt-token">
        <a
          style={{ color: "#7366ff" }}
          className="filter-clear-text"
          onClick={() => clearAllFilter()}
        >
          Clear
        </a>
      </button>
      <Typeahead 
        selected={appliedFiltersOptions}
        id="selected-strings-typeahead"
        emptyLabel=""
        open={false}
        inputProps={{ onFocus: false }}
        multiple
        options={appliedFiltersOptions}
        onChange={(selectedOptions) => {
          handleFilterSelectionChange(selectedOptions);
        }}
        labelKey={(option) => `${option.displayString || ""}`}
      />
    </Stack>
  );
};
