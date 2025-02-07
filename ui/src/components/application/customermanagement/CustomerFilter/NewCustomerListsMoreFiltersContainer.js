import React, { useMemo } from "react";
import Box from '@mui/material/Box';
import { NewCustomerFilterContent } from "./NewCustomerFilterContent";
import { NewCustomerShowSelectedStrings } from "./NewCustomerShowSelectedStrings";
import  uniq from 'lodash/uniq';
export const NewCustomerListsMoreFiltersContainer = (props) => {
  const { customerLists } = props;
  const [expiryDate, setExpiryDate] = React.useState('');

  const getAppliedFilters = () => {
    const { appliedFilters } = customerLists;
    let currentAppliedFilterOptions = [];
    Object.keys(appliedFilters).forEach((keyItem) => {
      if (
        appliedFilters[keyItem]["value"].type === "text" ||
        appliedFilters[keyItem]["value"].type === "date" 
      ) {
        if (appliedFilters[keyItem]["value"].strVal) {
          currentAppliedFilterOptions.push({
            displayString: appliedFilters[keyItem]["value"].label,
            type: keyItem,
          });
        }
      } else if (appliedFilters[keyItem]["value"].type === "array") {
        if (appliedFilters[keyItem].value.results.length > 0 && keyItem =='branch'|| keyItem =='zone' || keyItem =='area') {
          currentAppliedFilterOptions = [
            ...currentAppliedFilterOptions,
            ...appliedFilters[keyItem]["value"].results.map((item) => {

                return {
                  displayString: item.title,
                  type: keyItem,
                  }
           
            })
          ];
        }else if (appliedFilters[keyItem].value.results.length > 0) {
          currentAppliedFilterOptions = [
            ...currentAppliedFilterOptions,
            ...appliedFilters[keyItem]["value"].results.map((item) => ({
              displayString: item.value,
              type: keyItem,
            }))
          ];
        }
      }
    });
    return uniq(currentAppliedFilterOptions, 'displayString');
  };

  const appliedFiltersOptions = useMemo(getAppliedFilters, [
    customerLists.appliedFilters,
  ]); 
// commented off  from line 58 to 66 for the additional serach box coming due to filters by Marieya on 26th july.
  return (
    <>
      <NewCustomerFilterContent expiryDate={expiryDate} setExpiryDate={setExpiryDate} {...props} />
      {/* {appliedFiltersOptions.length > 0 && (
        <Box sx={{ marginTop: '15px' }}>
          <NewCustomerShowSelectedStrings
            {...props}
            setExpiryDate={setExpiryDate}
            appliedFiltersOptions={appliedFiltersOptions}
          />
        </Box>
      )} */}
    </>
  );
};

export default NewCustomerListsMoreFiltersContainer;
