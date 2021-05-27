describe("Blog app", function() {
  beforeEach(function() {
    cy.request("POST", "http://localhost:3003/api/testing/reset")
    cy.request("POST", "http://localhost:3003/api/users/", {
      name: "Test user",
      username: "testuser",
      password: "secret"
    })
    cy.visit("http://localhost:3000")
  })

  it("Login form is shown", function() {
    cy.contains("Login")
  })

  describe("Login",function() {
    it("succeeds with correct credentials", function() {
      cy.get("#username").type("testuser")
      cy.get("#password").type("secret")
      cy.get("#login-button").click()

      cy.contains("‘Test user‘ logged in")
      cy.contains("Logout")
    })

    it("fails with wrong credentials", function() {
      cy.get("#username").type("nonexistent")
      cy.get("#password").type("wrong")
      cy.get("#login-button").click()

      cy.get("html").get(".error").should("contain", "Invalid username or password")
      cy.get("html").should("not.contain", "‘nonexistent‘ logged in")
      cy.get("html").should("not.contain", "Logout")
    })

    it("remains at login screen after failed login attempt", function() {
      cy.get("#username").type("nonexistent")
      cy.get("#password").type("wrong")
      cy.get("#login-button").click()

      cy.contains("Login")
    })

    describe("When logged in", function() {
      beforeEach(function() {
        cy.request("POST", "http://localhost:3003/api/login/", {
          username: "testuser",
          password: "secret"
        }).then((response) => {
          localStorage.setItem("loggedInUser", JSON.stringify(response.body))
          cy.visit("http://localhost:3000")
        })
      })

      it("a new blog can be created", function() {
        cy.contains("Logout")
        cy.contains("Add a new blog").click()
        cy.get("#newblog-title").type("testblog")
        cy.get("#newblog-author").type("testuser")
        cy.get("#newblog-url").type("http://localhost:3000")
        cy.get("#newblog-submit").click()

        cy.get(".blog").contains("testblog")
      })

      it("can navigate to a blog", function() {
        cy.createBlog({
          title: "testblog",
          author: "testuser",
          url: "http://localhost:3000"
        })
        cy.visit("http://localhost:3000")

        cy.get(".blog").contains("testblog").click()

        cy.contains("testblog")
        cy.contains("By: testuser")
      })

      it("user can delete a blog submitted by him", function() {
        // User's token in added to the post request
        cy.createBlog({
          title: "testblog",
          author: "testuser",
          url: "http://localhost:3000"
        })
        cy.visit("http://localhost:3000")
        cy.get(".blog").contains("testblog").click()

        cy.contains("testblog")
          .get("#deleteButton").click()
        cy.should("not.contain", "testblog")
      })

      it("blogs are sorted by likes", function() {
        // User's token in added to the post request
        cy.createBlog({
          title: "testblog",
          author: "testuser",
          url: "http://localhost:3000"
        })
        cy.createBlog({
          title: "testblog2",
          author: "testuser",
          url: "http://localhost:3000",
          likes: 1
        })
        cy.visit("http://localhost:3000")

        cy.get(".blog").contains("testblog")
        cy.get(".blog").contains("testblog2")

        cy.get(".blog").then((blogs) => {
          console.log(blogs)
          cy.wrap(blogs[0]).should("contain", "testblog2")
          cy.wrap(blogs[1]).should("contain", "testblog")
        })

      })
    })
  })
})