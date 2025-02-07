import React, { useMemo } from "react";
import Box from '@mui/material/Box';
import { NewWalletShowSelectedStrings } from "./NewWalletShowSelectedStrings";
import { NewWalletFilterContent } from "./NewWalletFilterContent";

export const NewWalletListMoreFiltersContainer = (props) => {
  const { walletLists } = props;
  const [expiryDate, setExpiryDate] = React.useState('');

  const getAppliedFilters = () => {
    const { appliedFilters } = walletLists;
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
    walletLists.appliedFilters,
  ]);

  return (
    <>
      <NewWalletFilterContent expiryDate={expiryDate} setExpiryDate={setExpiryDate} {...props} />
      {appliedFiltersOptions.length > 0 && (
        <Box sx={{ marginTop: '15px' }}>
          <NewWalletShowSelectedStrings
            {...props}
            setExpiryDate={setExpiryDate}
            appliedFiltersOptions={appliedFiltersOptions}
          />
        </Box>
      )}
    </>
  );
};

export default NewWalletListMoreFiltersContainer;
