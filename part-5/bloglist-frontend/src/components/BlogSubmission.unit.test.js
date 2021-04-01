import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, fireEvent } from "@testing-library/react"
import Blogsubmission from "./BlogSubmission"
import blogService from "./../services/blogs"

jest.mock("./../services/blogs")

describe("<Blog />", () => {
  let component
  const setBlogsMock = jest.fn()
  const addNotificationMock = jest.fn()
  const blogFormRefMock = jest.fn()
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
      <Blogsubmission blogs={[]} setBlogs={setBlogsMock} addNotification={addNotificationMock} blogFormRef={blogFormRefMock} />
    )
  })

  test("input values are correctly passed to submission handler", () => {
    const mocker = blogService.create.mockResolvedValue({
      testBlog
    })

    const titleInput = component.container.querySelector("#title")
    fireEvent.change(titleInput, {
      target: { value: testBlog.title }
    })

    const authorInput = component.container.querySelector("#author")
    fireEvent.change(authorInput, {
      target: { value: "Manezki" }
    })

    const urlInput = component.container.querySelector("#url")
    fireEvent.change(urlInput, {
      target: { value: "http://www.localhost:3000" }
    })

    const form = component.container.querySelector("form")
    fireEvent.submit(form)

    // Submission is handled inside the 'blog form' functional components, infer the call from the mocked API
    expect(mocker.mock.calls).toHaveLength(1)
    expect(mocker.mock.calls[0][0].title).toBe(testBlog.title)
    expect(mocker.mock.calls[0][0].author).toBe(testBlog.author)
    expect(mocker.mock.calls[0][0].url).toBe(testBlog.url)
  })
})
