import React from "react"
import { render as rtlRender } from "@testing-library/react"
import { Provider } from "react-redux"
// Import your own reducer


// Following idea from https://redux.js.org/recipes/writing-tests#middleware
const createDummyStore = () => {
  const state = {
    next: jest.fn(),
    dispatch: jest.fn(),
    getState: jest.fn(() => {}),
    subscribe: jest.fn()
  }

  return state
}

const render = (
  ui,
  {
    store = createDummyStore(),
    ...renderOptions
  } = {}
) => {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
export * from "@testing-library/react"
// override render method
export { render, createDummyStore }
