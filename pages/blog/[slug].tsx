import React, { FC } from 'react'
import hydrate from 'next-mdx-remote/hydrate'
import renderToString from 'next-mdx-remote/render-to-string'
import { majorScale, Pane, Heading, Spinner } from 'evergreen-ui'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Post } from '../../types'
import Container from '../../components/container'
import HomeNav from '../../components/homeNav'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'

import { posts as postsFromCMS } from '../../data/content'

const BlogPost: FC<Post> = ({ source, frontMatter }) => {
  const content = hydrate(source)
  const router = useRouter()

  // if slug is not found among those fetch at build time, the page is in fallback state, router from Next can get this state and we display a loader
  if (router.isFallback) {
    return (
      <Pane width="100%" height="100%">
        <Spinner size={48} />
      </Pane>
    )
  }
  return (
    <Pane>
      <Head>
        <title>{`Known Blog | ${frontMatter.title}`}</title>
        <meta name="description" content={frontMatter.summary} />
      </Head>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          <Heading fontSize="clamp(2rem, 8vw, 6rem)" lineHeight="clamp(2rem, 8vw, 6rem)" marginY={majorScale(3)}>
            {frontMatter.title}
          </Heading>
          <Pane>{content}</Pane>
        </Container>
      </main>
    </Pane>
  )
}

BlogPost.defaultProps = {
  source: '',
  frontMatter: { title: 'default title', summary: 'summary', publishedOn: '' },
}

// SSR
// We have to give Next Js the path to be able to load pre load content dynamically
// We need to have the path at build time in order to get the data from cms or db
export function getStaticPaths() {
  const postsPath = path.join(process.cwd(), 'data/posts')
  const filesNames = fs.readdirSync(postsPath)

  const slugs = filesNames.map((name) => {
    const fullpath = path.join(process.cwd(), 'data/posts', name)
    const file = fs.readFileSync(fullpath)
    const { data } = matter(file)
    return data
  })

  return {
    paths: slugs.map((s) => ({ params: { slug: s.slug } })),
    fallback: true, // if set to false, if slug generated at built time not foud => 404 // If true it will get the slug to getStaticProps and try to fetch this slug not generated at build time
  }
}

export async function getStaticProps({ params, preview }) {
  let post: any
  try {
    const filePath = path.join(process.cwd(), 'data/posts', `${params.slug}.mdx`)
    post = fs.readFileSync(filePath, 'utf-8')
  } catch (e) {
    const collection = preview ? postsFromCMS.draft : postsFromCMS.published
    const cmsPosts = collection.map((p) => matter(p))
    const match = cmsPosts.find((p) => {
      return p.data.slug === params.slug
    })
    post = match.content
  }

  const { data } = matter(post)

  const mdxSource = await renderToString(post, { scope: data })

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
    },
  }
}

/**
 * Need to get the paths here
 * then the the correct post for the matching path
 * Posts can come from the fs or our CMS
 */
export default BlogPost
