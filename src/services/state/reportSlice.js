import { createSlice } from '@reduxjs/toolkit';

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    selectedFilters: {},
    dropdownStates: {},
    filterTransactions: {},
    dashboardTimeFilter: 'today',
  },
  reducers: {
    setSelectedFilters: (state, action) => {
      const { id, filters } = action.payload;
      state.selectedFilters[id] = filters;
    },
    setIsOpenDropdownFilter: (state, action) => {
      const { id, isOpen } = action.payload;
      state.dropdownStates[id] = isOpen;
    },

    setFilterTransactions: (state, action) => {
      const { filterKey, filterValue } = action.payload;
      state.filterTransactions[filterKey] = filterValue;
    },
    resetFilterTransactions: (state) => {
      state.filterTransactions = {};
      state.selectedFilters = {};
    },
    setDashboardTimeFilter: (state, action) => {
      state.dashboardTimeFilter = action.payload;
    },
  },
});

export const {
  setSelectedFilters,
  setIsOpenDropdownFilter,
  setFilterTransactions,
  resetFilterTransactions,
  setDashboardTimeFilter,
} = reportSlice.actions;

export default reportSlice.reducer;

export const getSelectedFilters = (state, id) =>
  state.report.selectedFilters[id];
export const getDropdownState = (state, id) => state.report.dropdownStates[id];

export const getFilterTransactionByKey = (state, key) =>
  state.report.filterTransactions[key];
export const getAllFilterTransaction = (state) =>
  state.report.filterTransactions;
export const getDashboardTimeFilter = (state) => state.report.dashboardTimeFilter;
