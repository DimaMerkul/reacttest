import React, { useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'

import { useQuery } from '@apollo/client'
import arrayMove from 'array-move'

import postQuery from 'GraphQL/Queries/post.graphql'
import postsIdsQuery from 'GraphQL/Queries/posts-ids.graphql'

import { ROOT, POST } from 'Router/routes'

import {
  Back,
  Column,
  Container,
  PostAuthor,
  PostBody,
  PostComment,
  PostContainer,
} from './styles'

const SortableContainer = sortableContainer(({ children }) => (
  <div>{children}</div>
))

const SortableItem = sortableElement(({ value }) => (
  <PostComment mb={2}>{value}</PostComment>
))

function Post() {
  const [comments, setComments] = useState([])
  const history = useHistory()
  const {
    params: { postId },
  } = useRouteMatch()

  const handleClick = () => history.push(ROOT)

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    setComments(arrayMove(comments, newIndex, oldIndex))
  }

  const { data, loading } = useQuery(postQuery, {
    variables: {
      id: postId,
      next: true
    }
  })

  const reponse = useQuery(postsIdsQuery, {
    variables: {
      id: postId,
      next: true
    }
  })

  const posts = reponse?.data?.posts?.data || []
  const post = data?.post || {}

  useEffect(() => {
    setComments(post.comments?.data || [])
  }, [post])

  const onPrevious = (id) => {
    const pageIndex = posts.findIndex((p) => +p.id === +id)
    if (pageIndex !== -1 && posts[pageIndex - 1]) {
      history.push(POST(posts[pageIndex - 1].id))
    }
  }

  const onNext = async (id) => {
    const pageIndex = await posts.findIndex((p) => +p.id === +id)

    if (pageIndex !== -1 && posts[pageIndex + 1]) {
      history.push(POST(posts[pageIndex + 1].id))
    }
  }

  return (
    <Container>
      <Column>
        <Back onClick={handleClick}>Back</Back>
      </Column>
      {loading ? (
        'Loading...'
      ) : (
        <>
          <Column>
            <h4>Need to add next/previous links</h4>
            <PostContainer key={post.id}>
              <h3>{post.title}</h3>
              <PostAuthor>by {post.user.name}</PostAuthor>
              <PostBody mt={2}>{post.body}</PostBody>
            </PostContainer>

            <div>
              <button type='button' onClick={(e) => onPrevious(post.id)}>Prev</button>
              <button type='button' onClick={(e) => onNext(post.id)}>Next</button>
            </div>
          </Column>

          <Column>
            <h4>Incorrect sorting</h4>
            Comments:
            <SortableContainer onSortEnd={handleSortEnd}>
              {comments.map((comment, index) => (
                <SortableItem
                  index={index}
                  key={comment.id}
                  mb={3}
                  value={comment.body}
                />
              ))}
            </SortableContainer>
          </Column>
        </>
      )}
    </Container>
  )
}

export default Post
