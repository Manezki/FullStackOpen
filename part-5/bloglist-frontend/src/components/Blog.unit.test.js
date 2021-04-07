import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, fireEvent } from "@testing-library/react"
import Blog from "./Blog"

describe("<Blog />", () => {
  let component
  const handleBlogLikeMock = jest.fn()
  const handleBlogDeleteMock = jest.fn()
  const testBlog = {
    title: "The king",
    author: "Manezki",
    url: "http://www.localhost:3000",
    likes: 1,
    id: "abc123",
    user: "12345"
  }
  const testUser = {
    name: "Hello",
    username: "World",
    id: "12345"
  }

  beforeEach(() => {
    component = render(
      <Blog blog={testBlog} loggedInUser={testUser} handleBlogLike={handleBlogLikeMock} handleBlogDelete={handleBlogDeleteMock} />
    )
  })

  test("displays title and author by default", () => {
    expect(
      component.container
    ).toHaveTextContent("The king")
    expect(
      component.container
    ).toHaveTextContent("Manezki")
  })

  test("does not displays url or likes by default", () => {
    expect(
      component.container
    ).not.toHaveTextContent("http://www.localhost:3000")
    expect(
      component.container
    ).not.toHaveTextContent("1")
  })

  test("displays url or likes after 'View' button is clicked", () => {
    const viewButton = component.getByRole("button")

    fireEvent.click(viewButton)

    expect(
      component.container
    ).toHaveTextContent("http://www.localhost:3000")
    expect(
      component.container
    ).toHaveTextContent("1")
  })

  test("likeHandler is triggered on like-clicks", () => {
    const viewButton = component.getByRole("button")

    fireEvent.click(viewButton)

    const likeButton = component.getByText("Like")

    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    // Avoid the internal method by inferring the call from mocked API
    expect(
      handleBlogLikeMock.mock.calls
    ).toHaveLength(2)
  })
})