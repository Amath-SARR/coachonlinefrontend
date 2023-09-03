import { createSlice } from '@reduxjs/toolkit';
import { readFromStorage, writeToStorage } from '../../utils/storage';

export const initialState = {
  loading: false,
  categories: readFromStorage('faqCategories') || [],
};

const faqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {
    getCategories() {},
    getTopic() {},
    getTopicByCategory() {},
    searchInTopics() {},
    createCategory() {},
    createTopic() {},
    updateCategory() {},
    updateTopic() {},
    deleteCategory() {},
    deleteTopic() {},
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setCategories(state, action) {
      writeToStorage('faqCategories', action.payload);
      state.categories = action.payload;
    },
  },
});

// Extract the action creators object and the reducer
const { actions, reducer: faqReducer } = faqSlice;
// Extract and export each action creator by name
export const {
  setLoading,
  getCategories,
  getTopic,
  getTopicByCategory,
  createCategory,
  createTopic,
  updateCategory,
  deleteTopic,
  updateTopic,
  deleteCategory,
  setCategories,
  searchInTopics,
} = actions;
// Export the reducer, either as a default or named export
export default faqReducer;
