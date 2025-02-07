import React from 'react';
import { TicketFilterContent } from './ticket-filter-content';
import SelectedFilters from '../../../common/selected-filters';
import useFilterSelection from '../../../../custom-hooks/use-filter-selection';
import { filterSchemaToApply } from '../ticket.constants';

export const TicketFilterContainer = (props) => {
  const { appliedFilterSchema, setAppliedFilterSchema } = props;
  const {
    handleMultiplSelection,
    handleChange,
    appliedFilters,
    clearAllFilters,
    removeFilter
  } = useFilterSelection({
    filtersData: appliedFilterSchema,
    setFiltersData: setAppliedFilterSchema,
    initialFilterData: filterSchemaToApply,
  });

  return (
    <>
      <TicketFilterContent
        appliedFilterSchema={props.appliedFilterSchema}
        setLevelMenu={props.setLevelMenu}
        levelMenu={props.levelMenu}
        handleChange={handleChange}
        handleMultiplSelection={handleMultiplSelection}
        helpDeskFilters={props?.helpDeskFilters}
        assignedTo={props.assignedTo}
        area={props.area}
        franchise={props.franchise}
      />
      <SelectedFilters
        appliedFilters={appliedFilters}
        clearAllFilters={clearAllFilters}
        removeFilter={removeFilter}
      />
    </>
  )
}
