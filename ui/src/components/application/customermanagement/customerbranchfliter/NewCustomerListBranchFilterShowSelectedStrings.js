import React, { Fragment } from "react";
import { Row, Col } from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import {  getAdditionalFiltersObj } from "../data";
import "react-bootstrap-typeahead/css/Typeahead.css";

export const NewCustomerListsBranchFilterShowSelectedStrings = (props) => {
  const {
    customerLists: { additionalFilters },
    appliedAdditionalFiltersOptions,
    updateCustomerLists,
  } = props;

  const clearAllFilter = () => {
    updateCustomerLists((prevState) => ({
      ...prevState,
      additionalFilters: JSON.parse(JSON.stringify(getAdditionalFiltersObj()))
    }));
  };

  const handleFilterSelectionChange = (selectedOptions) => {
    let cloneAppliedFiltersOptions = [...appliedAdditionalFiltersOptions];
    let cloneSelectedOptions = [
      ...selectedOptions.map((item) => item.displayString),
    ];

    appliedAdditionalFiltersOptions.forEach((optionItem, index) => {
      if (cloneSelectedOptions.includes(optionItem.displayString)) {
        const selectedOptionIndex = cloneSelectedOptions.findIndex(
          (item) => optionItem.displayString === item
        );
        cloneAppliedFiltersOptions.splice(index, 1);
        cloneSelectedOptions.splice(selectedOptionIndex, 1);
      }
    });

    const deletedOption = { ...cloneAppliedFiltersOptions[0] };
    if (
      deletedOption.type === "franchises" ||
      deletedOption.type === "franchiseBranches"
    ) {
      updateCustomerLists((prevState) => ({
        ...prevState,
        additionalFilters: {
          ...prevState.additionalFilters,
          [deletedOption.type]: {
            value: {
              ...prevState.additionalFilters[deletedOption.type].value,
              strVal: [
                ...prevState.additionalFilters[
                  deletedOption.type
                ].value.strVal.filter(
                  (item) => item !== deletedOption.displayString
                ),
              ],
            },
          },
        },
      }));
    } else {
      updateCustomerLists((prevState) => ({
        ...prevState,
        additionalFilters: {
          ...prevState.additionalFilters,
          [deletedOption.type]: {
            ...getAdditionalFiltersObj()[deletedOption.type],
          },
        },
      }));
    }
  };

  return (
    <Fragment>
      <Row>
        <Col sm="2 clear-text">
          <button class="rbt-token">
            <a
              style={{ color: "#7366ff" }}
              className="filter-clear-text"
              onClick={() => clearAllFilter()}
            >
              Clear
            </a>
          </button>
        </Col>
        <Col sm="9">
          <Typeahead
            selected={appliedAdditionalFiltersOptions}
            id="selected-strings-typeahead"
            emptyLabel=""
            open={false}
            inputProps={{ onFocus: false }}
            multiple
            options={appliedAdditionalFiltersOptions}
            onChange={(selectedOptions) => {
              handleFilterSelectionChange(selectedOptions);
            }}
            labelKey={(option) => `${option.displayString || ""}`}
          />
        </Col>
      </Row>
    </Fragment>
  );
};
