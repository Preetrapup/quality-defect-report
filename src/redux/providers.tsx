"use client";

/* Core */
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from "./store";

/* Instruments */


export const Providers = (props: React.PropsWithChildren) => {
  return <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {props.children}
    </PersistGate></Provider>;
};