import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatId: null,
    chatName: null,
    chatImage: null,
  },
  reducers: {
    setChatInfo: (state, action) => {
      state.chatId = action.payload.chatId;
      state.chatName = action.payload.chatName;
      state.chatImage = action.payload.chatImage;
    },
  },
});

export const { setChatInfo } = chatSlice.actions;

export const selectChatId = (state) => state.chat.chatId;
export const selectChatName = (state) => state.chat.chatName;
export const selectChatImage = (state) => state.chat.chatImage;

export default chatSlice.reducer;