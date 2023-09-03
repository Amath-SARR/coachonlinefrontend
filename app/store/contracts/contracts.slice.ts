import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  loading: false,
};

const contractsSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    getAllContractsOfType() {},
    getLatestContractOfType() {},
    createContract() {},
    updateContract() {},
    deleteContract() {},
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setAllContractsOfType(state, action) {},
    setLatestContractOfType(state, action) {},
  },
});

// Extract the action creators object and the reducer
const { actions, reducer: contractsReducer } = contractsSlice;
// Extract and export each action creator by name
export const {
  setLoading,
  getAllContractsOfType,
  getLatestContractOfType,
  createContract,
  updateContract,
  deleteContract,
  setAllContractsOfType,
  setLatestContractOfType,
} = actions;
// Export the reducer, either as a default or named export
export default contractsReducer;
