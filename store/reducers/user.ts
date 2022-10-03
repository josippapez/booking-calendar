import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

type User = {
  id: string;
  email: string;
  role: string;
};
export interface UserData {
  user: User;
}

const initialState: UserData = {
  user: {
    id: "",
    email: "",
    role: "",
  },
};

export const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    removeUser: state => {
      state.user = {
        id: "",
        email: "",
        role: "",
      };
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, (state, action) => {
      state.user = {
        id: "",
        email: "",
        role: "",
      };
    });
  },
});

export const { setUser, removeUser } = user.actions;

export default user.reducer;
