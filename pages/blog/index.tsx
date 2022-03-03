import React from 'react'
import { Pane, majorScale } from 'evergreen-ui'
import matter from 'gray-matter'
import path from 'path'
import fs from 'fs'
import Container from '../../components/container'
import HomeNav from '../../components/homeNav'
import PostPreview from '../../components/postPreview'
import { posts as postsFromCMS } from '../../data/content'

const Blog = ({ posts }) => {
  return (
    <Pane>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          {posts.map((post) => (
            <Pane key={post.title} marginY={majorScale(5)}>
              <PostPreview post={post} />
            </Pane>
          ))}
        </Container>
      </main>
    </Pane>
  )
}

Blog.defaultProps = {
  posts: [],
}

/**
 * Need to get the posts from the
 * fs and our CMS
 */

// service side code => in this function scope, that why we can use fs node utils
export function getStaticProps(ctx) {
  const postsToDisplay = ctx.preview ? postsFromCMS.draft : postsFromCMS.published
  const cmsPosts = postsToDisplay.map((post) => {
    const { data } = matter(post) // parse string into json value
    return data
  })

  const postsPath = path.join(process.cwd(), 'data/posts')
  const filesNames = fs.readdirSync(postsPath)

  const filePosts = filesNames.map((name) => {
    const fullpath = path.join(process.cwd(), 'data/posts', name)
    const file = fs.readFileSync(fullpath)
    const { data } = matter(file)
    return data
  })

  return {
    props: {
      posts: [...cmsPosts, ...filePosts],
    },
  }
}

export default Blog
