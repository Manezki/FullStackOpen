import React from "react"
import "@testing-library/jest-dom/extend-expect"
import Blog from "./Blog"
import { render } from "../test-utils"

const testBlog = {
  title: "The king",
  author: "Manezki",
  url: "http://www.localhost:3000",
  likes: 1,
  id: "abc123",
  user: "12345",
  comments: []
}

describe("<Blog />", () => {

  describe("On a correctly working blog", () => {
    let component

    beforeEach(() => {
      component = render(
        <Blog />,
        { initialState: { blogs: [testBlog] }, initialHistory: [`/blogs/${testBlog.id}`], routePath: "/blogs/:id" }
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

    test("displays url and likes by default", () => {
      expect(
        component.container
      ).toHaveTextContent("http://www.localhost:3000")
      expect(
        component.container
      ).toHaveTextContent("1")
    })

    test("displays comments", () => {
      component = render(
        <Blog />,
        { initialState: { blogs: [{ ...testBlog, comments: [{ id: "a234", text: "Hello test" }] }] },
          initialHistory: [`/blogs/${testBlog.id}`], routePath: "/blogs/:id" }
      )

      expect(
        component.container.getElementsByClassName("comments")
      ).toBeDefined()

      expect(
        component.container.getElementsByClassName("comments")[0]
      ).toHaveTextContent("Hello test")
    })
  })

  describe("Recovers", () => {

    test("when user that created the post is deleted", () => {

      const userDeletedResponse = { ...testBlog, user: null }

      const { queryByText } = render(
        <Blog />,
        { initialState: { blogs: [userDeletedResponse] }, initialHistory: [`/blogs/${userDeletedResponse.id}`], routePath: "/blogs/:id" }
      )

      expect(
        queryByText("Added by: A deleted user")
      ).toBeTruthy()
    })
  })
})
