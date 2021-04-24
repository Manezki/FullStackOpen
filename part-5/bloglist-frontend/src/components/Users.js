import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { initUsers } from "../reducers/usersReducer"
import { Link } from "react-router-dom"


const Users = () => {
  const dispatch = useDispatch()
  const users = useSelector(({ users }) => users)

  useEffect(() => {
    dispatch(initUsers())
  }, [dispatch])

  if (!users) {
    return (
      <div className="usersList">
        <h2>Users</h2>
        <p>Fetching users...</p>
      </div>
    )
  }

  return (
    <div className="usersList">
      <h2>Users</h2>
      <div className="container">
        <div className="userRow">
          <h3 className="left">Username</h3>
          <h3 className="right">Blogs</h3>
        </div>
        {
          users.map((user) => {
            return (
              <div className="userItem userRow" key={user.id}>
                <div className="left"><Link to={`/users/${user.id}`}>{user.name}</Link></div>
                <div className="right">{user.blogs.length}</div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Users
