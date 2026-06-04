import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CompareState = {
  firstId: string | null;
  secondId: string | null;
  isSelectingSecond: boolean; // true after first compare click
};

const initialState: CompareState = {
  firstId: null,
  secondId: null,
  isSelectingSecond: false,
};

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    startCompare(state, action: PayloadAction<string>) {
      // user picked first property
      state.firstId = action.payload;
      state.secondId = null;
      state.isSelectingSecond = true;
    },
    setSecondCompare(state, action: PayloadAction<string>) {
      state.secondId = action.payload;
      state.isSelectingSecond = false;
    },
    resetCompare(state) {
      state.firstId = null;
      state.secondId = null;
      state.isSelectingSecond = false;
    },
  },
});

export const { startCompare, setSecondCompare, resetCompare } =
  compareSlice.actions;

export default compareSlice.reducer;
