import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { initUsers } from "../reducers/usersReducer"
import { useParams } from "react-router-dom"


const Users = () => {
  const id = useParams().id

  const dispatch = useDispatch()
  const user = useSelector(({ users }) => users.find((user) => user.id === id))

  useEffect(() => {
    dispatch(initUsers())
  }, [dispatch])

  if (!user) {
    return (
      <div className="usersList">
        <h2>Users</h2>
        <p>Fetching users...</p>
      </div>
    )
  }

  return (
    <div>
      <h2>{user.user}</h2>
      <h3>Added blogs:</h3>
      <ul>
        {
          user.blogs.map((blog) => <li key={`${user.id}-${blog.id}`}>{blog.title}</li>)
        }
      </ul>
    </div>
  )
}

export default Users
