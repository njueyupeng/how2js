import * as React from "react"
import { PageProps, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { FaStar } from "react-icons/fa"
import { Alert } from "../components/mdx/alert"
import {
  Container,
  Stack,
  Text,
  Badge,
  Box,
  Flex,
  Grid,
  useColorModeValue,
  Link as ChakraLink,
  Tag,
  TagLeftIcon,
  TagLabel,
  usePrefersReducedMotion,
} from "@chakra-ui/react"
import { Link } from "../components/link"
import { Layout } from "../components/blocks/layout"
import { MotionBox } from "../components/blocks/motion-box"
import { FullWidthContainer } from "../components/blocks/full-width-container"
import { Spacer } from "../components/blocks/spacer"
import { SkipNavContent } from "../components/a11y/skip-nav"
import { Heading } from "../components/typography/heading"
import { PrimaryButton, SubtleButton } from "../components/buttons"
import { space } from "../constants/space"
import { SEO } from "../components/seo"
import { homepage } from "../constants/json-ld"
import { Button } from "@chakra-ui/react"

type RepositoryInfo = {
  stargazerCount: number
  description: string
  name: string
  url: string
}

type DataProps = {
  posts: {
    nodes: {
      title: string
      description: string
      slug: string
    }[]
  }
  garden: {
    nodes: {
      title: string
      slug: string
    }[]
  }
}

const cardGradients = [
  `linear(to-tr, #A774F2, #F25D76, #FF964F)`,
  `linear(to-tr, #9B7BFE, #54B5F0, #88F2A9)`,
  `linear(to-tr, #933890, #E08896, #CC98DD, #D1CEE2)`,
  `linear(to-tr, #6666DE, #5778C9, #94D1C9, #A1D8FF)`,
  `linear(to-tr, #3e206d, #af3942, #d66a38, #eacc15)`,
  `linear(to-tr, #511a2a, #cb598d, #b24ecb, #ebb8eb)`,
]

const openSourceRepos = [
  {
    name: `gatsby-source-tmdb`,
    url: `https://github.com/LekoArts/gatsby-source-tmdb`,
  },
  {
    name: `thanks-contributors`,
    url: `https://github.com/LekoArts/thanks-contributors`,
  },
  {
    name: `lekoarts-stats`,
    url: `https://github.com/LekoArts/lekoarts-stats`,
  },
  {
    name: `portfolio-v2`,
    url: `https://github.com/LekoArts/portfolio-v2`,
  },
]

const Index: React.FC<PageProps<DataProps>> = ({ data }) => {
  const shouldReduceMotion = usePrefersReducedMotion()
  const [firstPost, ...rest] = data.posts.nodes
  const otherPosts = [...rest]
  return (
    <Layout>
      <SEO>
        <script type="application/ld+json">{JSON.stringify(homepage)}</script>
      </SEO>
      <SkipNavContent>
        <FullWidthContainer variant="hero">
          <Stack align="center" spacing="5" py={space.paddingLarge}>
            <Heading as="h1">Hi, I???m YuPeng!</Heading>
            <Text variant="prominent" maxWidth="45ch" textAlign="center">
              ????????????????????????????????????????????????????????????
              <strong>?????????????????????</strong>{" "}
              ??????????????????????????????????????????????????????
              ???????????????????????????????????????????????????????????????????????????
            </Text>
            <Text variant="prominent" maxWidth="40ch" textAlign="center">
              <PrimaryButton
                to={"https://www.plaso.cn/?page_id=2484&kid=120"}
                newPage={true}
                isExternal={true}
              >
                ??????????????????
              </PrimaryButton>
            </Text>
          </Stack>
        </FullWidthContainer>
        <FullWidthContainer variant="light">
          <Stack alignItems="flex-start" spacing={24} py={space.paddingMedium}>
            <Stack alignItems="flex-start" spacing={[6, 8]}>
              <Badge variant="light">Latest Post</Badge>
              <Box>
                <Heading as="h2">{firstPost.title}</Heading>
                <Text variant="lightContainer">{firstPost.description}</Text>
              </Box>
              <PrimaryButton to={firstPost.slug}>
                Continue Reading
              </PrimaryButton>
            </Stack>
            <Stack direction="column" width="100%" spacing={6}>
              <Flex justifyContent="space-between" alignItems="center">
                <Badge variant="light">More Posts</Badge>
                <SubtleButton to="/writing">Read all</SubtleButton>
              </Flex>
              <Grid
                templateColumns={[`repeat(1, 1fr)`, null, `repeat(3, 1fr)`]}
                gap={[4, null, 8]}
              >
                {otherPosts.map((item, index) => (
                  <Link
                    to={item.slug}
                    key={item.slug}
                    borderRadius="lg"
                    _hover={{
                      textDecoration: `none`,
                      boxShadow: shouldReduceMotion ? `outline` : null,
                    }}
                  >
                    <MotionBox
                      bgGradient={cardGradients[index]}
                      p={4}
                      borderRadius="lg"
                      height={[`150px`, null, null, `200px`, `250px`]}
                      boxShadow="lg"
                      display="flex"
                      alignItems="flex-end"
                      color="white"
                      fontSize={[`lg`, null, `md`, `1.125rem`, `1.3125rem`]}
                      sx={{ textShadow: `0 1px 2px rgba(0, 0, 0, 0.5)` }}
                    >
                      {item.title}
                    </MotionBox>
                  </Link>
                ))}
              </Grid>
            </Stack>
            <Stack direction="column" width="100%" spacing={6}>
              <Flex justifyContent="space-between" alignItems="center">
                <Badge variant="light">Digital Garden</Badge>
                <SubtleButton to="/garden">Read all</SubtleButton>
              </Flex>
              <Grid
                templateColumns={[`repeat(1, 1fr)`, null, `repeat(3, 1fr)`]}
                gap={[4, null, 8]}
              >
                {data.garden.nodes.map((item, index) => (
                  <Link
                    to={item.slug}
                    key={item.slug}
                    borderRadius="lg"
                    _hover={{
                      textDecoration: `none`,
                      boxShadow: shouldReduceMotion ? `outline` : null,
                    }}
                  >
                    <MotionBox
                      bgGradient={cardGradients[index + 3]}
                      p={4}
                      borderRadius="lg"
                      height={[`125px`, null, null, `175px`]}
                      boxShadow="lg"
                      display="flex"
                      alignItems="flex-end"
                      color="white"
                      fontSize={[`lg`, null, `md`, `1.125rem`, `1.3125rem`]}
                      sx={{ textShadow: `0 1px 2px rgba(0, 0, 0, 0.5)` }}
                    >
                      {item.title}
                    </MotionBox>
                  </Link>
                ))}
              </Grid>
            </Stack>
            <Stack direction="column" width="100%" spacing={6}>
              <Flex justifyContent="space-between" alignItems="center">
                <Badge variant="light">Art</Badge>
                <SubtleButton to="/art">See all art</SubtleButton>
              </Flex>
              <Grid
                gridTemplateColumns={[`repeat(1, 1fr)`, null, `repeat(2, 1fr)`]}
                gap={[4, null, 8]}
              >
                <Link
                  to="/art/photography"
                  aria-label="View my photography"
                  borderRadius="lg"
                  _hover={{
                    boxShadow: shouldReduceMotion ? `outline` : null,
                  }}
                >
                  <MotionBox
                    sx={{
                      ".gatsby-image-wrapper": {
                        borderRadius: `lg`,
                        verticalAlign: `top`,
                      },
                      img: { borderRadius: `lg` },
                      boxShadow: `lg`,
                      height: `100%`,
                      width: `100%`,
                      borderRadius: `lg`,
                    }}
                  >
                    <StaticImage
                      src="../images/pages-index-photography-preview.jpg"
                      alt=""
                      layout="constrained"
                      quality={90}
                      formats={[`auto`, `webp`, `avif`]}
                      placeholder="blurred"
                      width={720}
                      aspectRatio={16 / 9}
                    />
                  </MotionBox>
                </Link>
                <Link
                  to="/art/3d"
                  aria-label="View my 3D art"
                  borderRadius="lg"
                  _hover={{
                    boxShadow: shouldReduceMotion ? `outline` : null,
                  }}
                >
                  <MotionBox
                    sx={{
                      ".gatsby-image-wrapper": {
                        borderRadius: `lg`,
                        verticalAlign: `top`,
                      },
                      img: { borderRadius: `lg` },
                      boxShadow: `lg`,
                      height: `100%`,
                      width: `100%`,
                      borderRadius: `lg`,
                    }}
                  >
                    <StaticImage
                      src="../images/pages-index-3d-preview.jpg"
                      alt=""
                      layout="constrained"
                      quality={90}
                      formats={[`auto`, `webp`, `avif`]}
                      placeholder="blurred"
                      width={720}
                      aspectRatio={16 / 9}
                    />
                  </MotionBox>
                </Link>
              </Grid>
            </Stack>
          </Stack>
        </FullWidthContainer>
        <Container>
          <Flex
            alignItems="center"
            flexDirection="column"
            py={space.paddingLarge}
          >
            <Heading as="h2">Open Source</Heading>
            <Text variant="prominent" maxWidth="40ch" textAlign="center">
              Working in the open, interacting with the community & building
              projects that are accessible to everyone fill me with joy.
            </Text>
            <Spacer axis="vertical" size={20} />
            <Stack direction="column" width="100%" spacing={6}>
              <Flex justifyContent="space-between" alignItems="center">
                <Badge variant="dark">Featured Projects</Badge>
                <SubtleButton isExternal to="https://www.github.com/LekoArts">
                  GitHub
                </SubtleButton>
              </Flex>
              <Flex justifyContent="space-between" flexWrap="wrap">
                {openSourceRepos.map(repo => (
                  <ChakraLink key={repo.url} href={repo.url} p={2}>
                    {repo.name}
                  </ChakraLink>
                ))}
              </Flex>
            </Stack>
          </Flex>
        </Container>
      </SkipNavContent>
    </Layout>
  )
}

export default Index

export const query = graphql`
  {
    posts: allPost(
      filter: { published: { eq: true } }
      sort: { fields: date, order: DESC }
      limit: 4
    ) {
      nodes {
        title
        description
        slug
      }
    }
    garden: allGarden(
      limit: 3
      sort: { fields: lastUpdated, order: DESC }
      filter: { slug: { ne: "/garden/what-is-a-digital-garden" } }
    ) {
      nodes {
        title
        slug
      }
    }
  }
`
