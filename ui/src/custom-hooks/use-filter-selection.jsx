import { useCallback, useMemo } from "react";

const useFilterSelection = ({ filtersData, setFiltersData, initialFilterData }) => {
  const appliedFilters = useMemo(() => {
    let currentAppliedFilters = [];
    Object.keys(filtersData).forEach(keyItem => {
      const filterType = filtersData[keyItem]?.type;
      if(filterType === 'array') {
        if (filtersData[keyItem].results.length > 0) {
          currentAppliedFilters = [
            ...currentAppliedFilters,
            ...filtersData[keyItem].results.map((item) => ({
              displayString: item.value,
              type: keyItem,
            }))
          ];
        }
      }
      if((filterType === 'date' || filterType === 'string') && filtersData[keyItem]?.strVal) {
        currentAppliedFilters.push({
          displayString: filtersData[keyItem]?.label,
          type: keyItem
        })
      }
    })

    return currentAppliedFilters;
  }, [filtersData]);

  const clearAllFilters = useCallback(() => 
    setFiltersData(initialFilterData)
  , [setFiltersData, initialFilterData]);

  const removeFilter = useCallback((selectedOption) => {
    const filterType = selectedOption?.type;
    const displayString = selectedOption?.displayString;

    if(filtersData[filterType]?.type === 'array') {
      setFiltersData(previousFilters => ({
        ...previousFilters,
        [filterType]: {
          ...previousFilters[filterType],
          results: previousFilters[filterType]?.results?.filter(item => item.value !== displayString)
        }
      }))
    }
    if(filtersData[filterType]?.type === 'date' || filtersData[filterType]?.type === 'string') {
      setFiltersData(previousFilters => ({
        ...previousFilters,
        [filterType]: initialFilterData[filterType]
      }))
    }
  }, [filtersData, setFiltersData]);

  const handleMultiplSelection = useCallback(({ event, id, filterName }) => {
    const { checked, name } = event.target;
    let results = [];

    if (checked) {
      results = [...filtersData[filterName]?.results, { id, value: name }]
    } else {
      results = filtersData[filterName]?.results.filter(item => item.id !== id);
    }

    setFiltersData(previousFilters => ({
      ...previousFilters,
      [filterName]: {
        ...previousFilters[filterName],
        results
      }
    }));
  }, [filtersData, setFiltersData]);

  const handleChange = useCallback(({ name, value, placeholder = 'dateplaceholder' }) => {
    const regex = new RegExp(placeholder, "gi");

    setFiltersData(previousFilters => ({
      ...previousFilters,
      [name]: {
        ...previousFilters[name],
        strVal: value,
        label: previousFilters[name]?.label?.replace(regex, value)
      }
    }));
  }, [filtersData, setFiltersData]);

  return {
    appliedFilters,
    clearAllFilters,
    removeFilter,
    handleChange,
    handleMultiplSelection
  }
}

export default useFilterSelection;