import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, fireEvent } from "@testing-library/react"
import Blogsubmission from "./BlogSubmission"

describe("<Blog />", () => {
  let component
  const handleBlogSubmissionMock = jest.fn()
  const testBlog = {
    title: "The king",
    author: "Manezki",
    url: "http://www.localhost:3000",
    likes: 1,
    id: "abc123",
    user: "12345"
  }

  beforeEach(() => {
    component = render(
      <Blogsubmission handleBlogSubmission={handleBlogSubmissionMock} />
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

    expect(handleBlogSubmissionMock.mock.calls).toHaveLength(1)
    expect(handleBlogSubmissionMock.mock.calls[0][0].title).toBe(testBlog.title)
    expect(handleBlogSubmissionMock.mock.calls[0][0].author).toBe(testBlog.author)
    expect(handleBlogSubmissionMock.mock.calls[0][0].url).toBe(testBlog.url)
  })
})
