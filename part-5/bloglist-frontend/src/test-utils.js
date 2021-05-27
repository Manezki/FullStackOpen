import React from "react"
import { render as rtlRender } from "@testing-library/react"
import { Provider } from "react-redux"
import { createStore, applyMiddleware, combineReducers } from "redux"
import thunk from "redux-thunk"
import { MemoryRouter, Route } from "react-router-dom"

// Import your own reducer
import notificationReducer from "./reducers/notificationReducer"
import loginReducer from "./reducers/loginReducer"
import usersReducer from "./reducers/usersReducer"
import blogReducer from "./reducers/blogReducer"

export const createDummyStore = (initialState) => {
  // Create Store with initial state
  const store = createStore(
    combineReducers({
      notification: notificationReducer,
      blogs: blogReducer,
      loggedInUser: loginReducer,
      users: usersReducer
    }),
    initialState,
    applyMiddleware(thunk)
  )
  return store
}

const render = (
  ui,
  {
    initialState,
    store = createDummyStore(initialState),
    initialHistory = ["/"],
    routePath = "/",
    ...renderOptions
  } = {}
) => {
  function Wrapper({ children }) {
    // Add Router to the render
    return <Provider store={store}>
      <MemoryRouter initialEntries={initialHistory}>
        <Route path={routePath}>
          {children}
        </Route>
      </MemoryRouter>
    </Provider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
export * from "@testing-library/react"
// override render method
export { render }
