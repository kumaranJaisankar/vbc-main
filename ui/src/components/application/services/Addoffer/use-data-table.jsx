import { useState, useCallback } from 'react';

const useDataTable = ({ filterSchema = {} } = {}) => {
  const [tableData, setTableData] = useState({
    currentPageNo: 1,
    currentItemsPerPage: 10,
    pageLoadData: [],
    pageLoadDataForFilter: [],
    prevURI: null,
    nextURI: null,
    totalRows: 0,
    counts: null,
  });
  const [loadingTable, setLoadingTable] = useState(false);
  const [appliedFilterSchema, setAppliedFilterSchema] = useState(filterSchema);

  const getQueryParams = useCallback((activeTab) => {
    const { currentPageNo, currentItemsPerPage } = tableData;
    let queryParams = `?limit=${currentItemsPerPage}&page=${currentPageNo}`;
    console.log(tableData,"testTabledata")

    return queryParams;
  }, [tableData, appliedFilterSchema]);

  const handlePageChange = useCallback((page) =>
      setTableData(previousTableData => ({ ...previousTableData, currentPageNo: page })), []);

  const handlePerRowsChange = useCallback((newPerPage, page) =>
    setTableData((previousTableData) => ({
      ...previousTableData,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,
    })), []);

  return {
    tableData,
    loadingTable,
    appliedFilterSchema,
    setAppliedFilterSchema,
    setLoadingTable,
    getQueryParams,
    handlePageChange,
    handlePerRowsChange,
    setTableData,
  }
}

export default useDataTable;
