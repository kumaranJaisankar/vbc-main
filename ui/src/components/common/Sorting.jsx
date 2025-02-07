// Sailaja Created Funtion for sorting in alphabetical order
export const Sorting=(data,key)=>{

    const SortingMethod = data.sort((dropdownData,sortDropdownData) => dropdownData[key].localeCompare(sortDropdownData[key]))
   return SortingMethod
}