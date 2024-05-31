"use client";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import UserContext from "./UserContext";

export default function ReduxProvider({ children }) {
  let client = new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_BACKEND}/graphql`,
    cache: new InMemoryCache(),
    fetchOptions: {
      mode: "no-cors",
    },
  });

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <UserContext>{children}</UserContext>
      </ApolloProvider>
    </Provider>
  );
}
