import React, { useMemo } from "react";
import Box from '@mui/material/Box';
import { NewLeadFilterContent } from "./NewLeadFilterContent";
import { NewLeadShowSelectedStrings } from "./NewLeadShowSelectedStrings";

export const NewLeadListsMoreFiltersContainer = (props) => {
  const { leadLists } = props;
  const [expiryDate, setExpiryDate] = React.useState('');

  const getAppliedFilters = () => {
    const { appliedFilters } = leadLists;
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
        if (appliedFilters[keyItem].value.results.length > 0) {
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
    return currentAppliedFilterOptions;
  };

  const appliedFiltersOptions = useMemo(getAppliedFilters, [
    leadLists.appliedFilters,
  ]);

  return (
    <>
      <NewLeadFilterContent expiryDate={expiryDate} setExpiryDate={setExpiryDate} {...props} />
      {appliedFiltersOptions.length > 0 && (
        <Box sx={{ marginTop: '15px' }}>
          <NewLeadShowSelectedStrings
            {...props}
            setExpiryDate={setExpiryDate}
            appliedFiltersOptions={appliedFiltersOptions}
          />
        </Box>
      )}
    </>
  );
};

export default NewLeadListsMoreFiltersContainer;
