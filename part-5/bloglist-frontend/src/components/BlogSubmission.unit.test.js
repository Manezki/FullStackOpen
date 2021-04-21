import React from "react"
import "@testing-library/jest-dom/extend-expect"
import Blogsubmission from "./BlogSubmission"
import { render, fireEvent, createDummyStore } from "../test-utils"

jest.mock("../reducers/blogReducer", () => ({
  createBlog: jest.fn((params) => params)
}))

import { createBlog } from "../reducers/blogReducer"

describe("<Blog />", () => {
  let component
  let store

  const submissionFormVisibilityRef = {
    current: {
      toggleVisibility: jest.fn()
    }
  }

  const testBlog = {
    title: "The king",
    author: "Manezki",
    url: "http://www.localhost:3000",
    likes: 1,
    id: "abc123",
    user: "12345"
  }

  beforeEach(() => {
    store = createDummyStore()
    component = render(
      <Blogsubmission submissionFormVisibilityRef={submissionFormVisibilityRef} />,
      { store: store }
    )
  })

  test("input values are correctly passed to submission handler", () => {
    const titleInput = component.container.querySelector("#newblog-title")
    fireEvent.change(titleInput, {
      target: { value: testBlog.title }
    })

    const authorInput = component.container.querySelector("#newblog-author")
    fireEvent.change(authorInput, {
      target: { value: "Manezki" }
    })

    const urlInput = component.container.querySelector("#newblog-url")
    fireEvent.change(urlInput, {
      target: { value: "http://www.localhost:3000" }
    })

    const form = component.container.querySelector("form")
    fireEvent.submit(form)

    expect(store.dispatch.mock.calls).toHaveLength(1)
    expect(submissionFormVisibilityRef.current.toggleVisibility.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe(testBlog.title)
    expect(createBlog.mock.calls[0][0].author).toBe(testBlog.author)
    expect(createBlog.mock.calls[0][0].url).toBe(testBlog.url)
  })
})
