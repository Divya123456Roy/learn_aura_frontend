
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


export const createReply = createAsyncThunk(
  'reply/create',
  async ({ content, postId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post('/api/reply', { content, postId }, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to create reply');
    }
  }
);

const replySlice = createSlice({
  name: 'reply',
  initialState: {
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReply.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createReply.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Reply created successfully';
      })
      .addCase(createReply.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = replySlice.actions;
export default replySlice.reducer;
