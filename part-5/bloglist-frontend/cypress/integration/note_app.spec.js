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

        cy.contains("testblog; by testuser")
      })

      it("user can like a blog", function() {
        cy.createBlog({
          title: "testblog",
          author: "testuser",
          url: "http://localhost:3000"
        })
        cy.visit("http://localhost:3000")

        cy.contains("testblog; by testuser").contains("View").click()
        cy.contains("Likes: 0").contains("Like").click()
        cy.contains("Likes: 1")
      })

      it("user can delete a blog submitted by him", function() {
        // User's token in added to the post request
        cy.createBlog({
          title: "testblog",
          author: "testuser",
          url: "http://localhost:3000"
        })
        cy.visit("http://localhost:3000")

        cy.contains("testblog; by testuser").contains("View").click()
        cy.contains("testblog; by testuser")
          .get("#deleteButton").click()
        cy.should("not.contain", "testblog; by testuser")
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

        cy.contains("testblog; by testuser")
        cy.contains("testblog2; by testuser")

        cy.get(".blog").then((blogs) => {
          blogs.map((i, el) => {
            cy.wrap(el).contains("View").click()
          })
        })
        cy.get(".blog").then((blogs) => {
          let highLike = 99999

          blogs.map((i, blog) => {
            return cy.wrap(blog)
              .contains("Likes: ")
              .invoke("text")
              .then((el) => {
                const likes = Number(el.match(/(\d)/)[1])
                cy.wrap(likes).should("be.lte", highLike)
                highLike = likes
              })
          })
        })
      })
    })
  })
})