import { combineReducers, configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import {productReducer} from "./reducers"
const rootReducer = combineReducers({
    product: productReducer.reducer
});
const createStore = () =>
  configureStore({
    reducer: rootReducer,
    devTools: true,
  });

export type Store = ReturnType<typeof createStore>;
export type State = ReturnType<Store["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  State,
  unknown,
  Action
>;
export const wrapper = createWrapper<Store>(createStore);
