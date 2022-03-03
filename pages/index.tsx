import React, { FC } from 'react'
import { Pane, majorScale } from 'evergreen-ui'
import Container from '../components/container'
import Hero from '../components/hero'
import HomeNav from '../components/homeNav'
import FeatureSection from '../components/featureSection'
import { home } from '../data/content'

const Home: FC<{ content: { hero: any; features: any[] } }> = ({ content }) => {
  return (
    <Pane>
      <header>
        <HomeNav />
        <Container>
          <Hero content={content.hero} />
        </Container>
      </header>
      <main>
        {content.features.map((feature, i) => (
          <FeatureSection
            key={feature.title}
            title={feature.title}
            body={feature.body}
            image="/docs.png"
            invert={i % 2 === 0}
          />
        ))}
      </main>
      <footer>
        <Pane background="overlay" paddingY={majorScale(9)}>
          <Container>hello footer</Container>
        </Pane>
      </footer>
    </Pane>
  )
}

Home.defaultProps = {
  content: {
    features: [{ title: 'default feature', body: 'default body' }],
    hero: { title: 'default title', body: 'default body' },
  },
}

export default Home

/**
 * Should really get this content from our CMS
 */

export function getStaticProps(ctx) {
  const content = ctx.preview ? home.draft : home.published
  return { props: { content } }
}
