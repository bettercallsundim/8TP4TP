"use client";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import GraphQL_wrapper from "./GraphQL_wrapper";

export default function ReduxProvider({ children }) {
  let client = new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_BACKEND}/graphql`,
    cache: new InMemoryCache(),
  });

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <GraphQL_wrapper>{children}</GraphQL_wrapper>
      </ApolloProvider>
    </Provider>
  );
}
