const bcrypt = require("bcrypt")
const User = require("../models/user")

describe("User", () => {
  test("as JSON should not return a passwordHash", async () => {
    const manezki = {
      name: "manezki",
      username: "manezki",
      password: "12345",
    }

    manezki.passwordHash = await bcrypt.hash(manezki.password, 8)

    const userManezki = await User(manezki)

    expect(JSON.stringify(userManezki)).not.toContain("passwordHash")
  })
})
