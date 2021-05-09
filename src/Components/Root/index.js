import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import faker from 'faker'
import { nanoid } from 'nanoid'

import postsQuery from 'GraphQL/Queries/posts.graphql'

import { POST } from 'Router/routes'
import Pagination from 'react-js-pagination';

import { Column, Container, Post, PostAuthor, PostBody } from './styles'

import ExpensiveTree from '../ExpensiveTree'
import './pagination.css';

require("bootstrap/dist/css/bootstrap.css");

function Root() {
  const [count, setCount] = useState(0)
  const [fields, setFields] = useState([
    {
      name: faker.name.findName(),
      id: nanoid(),
    },
  ])

  const [page, setPage] = useState(1)

  const changePage = (pageNumber) => {
    setPage(pageNumber)
  }
  const [value, setValue] = useState('')
  const limit = 10
  const { data, loading } = useQuery(postsQuery, {
    variables: {
      page,
      limit
    }
  })

  function handlePush() {
    setFields([{ name: faker.name.findName(), id: nanoid() }, ...fields])
  }

  function handleAlertClick() {
    setTimeout(() => {
      alert(`You clicked ${count} times`)
    }, 2500)
  }

  const posts = data?.posts.data || []

  return (
    <Container>
      <Column>
        {loading
          ? 'Loading...'
          : posts.map((post, index) => (
            <Post mx={4} key={index}>
              <NavLink href={POST(post.id)} to={POST(post.id)}>
                {post.title}
              </NavLink>
              <PostAuthor>by {post.user.name}</PostAuthor>
              <PostBody>{post.body}</PostBody>
            </Post>
          ))}
        <div>
        <Pagination
          activePage={page}
          itemsCountPerPage={limit}
          totalItemsCount={50}
          pageRangeDisplayed={5}
          onChange={changePage}
        />
          {/* Pagination here */}
        </div>
      </Column>
      <Column>
        <h4>Slow rendering</h4>
        <label>
          Enter something here:
          <br />
          <input
            value={value}
            onChange={({ target }) => setValue(target.value)}
          />
        </label>
        <p>So slow...</p>
        <ExpensiveTree />

        <h4>Closures</h4>
        <p>You clicked {count} times</p>
        <button type="button" onClick={() => setCount(count + 1)}>
          Click me
        </button>
        <button type="button" onClick={handleAlertClick}>
          Show alert
        </button>
      </Column>

      <Column>
        <h4>Incorrect form field behavior</h4>
        <button type="button" onClick={handlePush}>
          Add more
        </button>
        <ol>
          {fields.map((field, index) => (
            <li key={index}>
              {field.name}:<br />
              <input type="text" />
            </li>
          ))}
        </ol>
      </Column>
    </Container>
  )
}

export default Root
