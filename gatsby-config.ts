import { GatsbyConfig } from "gatsby"
import { slugifyOptions } from "utils"
import { site } from "./src/constants/meta"

require(`dotenv`).config()

const shouldAnalyseBundle = process.env.ANALYSE_BUNDLE

const gatsbyConfig: GatsbyConfig = {
  flags: {
    DEV_SSR: true,
    FAST_DEV: true,
  },
  siteMetadata: {
    siteTitle: site.title,
    siteTitleDefault: site.titleDefault,
    siteUrl: site.url,
    siteDescription: site.description,
    siteImage: site.image,
    twitter: site.twitter,
    avatar: site.avatar,
  },
  plugins: [
    `gatsby-theme-core`,
    `@chakra-ui/gatsby-plugin`,
    `gatsby-plugin-image`,
    `gatsby-plugin-react-helmet`,
    // Overwrite the default "slugify" option
    {
      resolve: `gatsby-plugin-page-creator`,
      options: {
        path: `${__dirname}/src/pages`,
        slugify: slugifyOptions,
      },
    },
    {
      resolve: `gatsby-omni-font-loader`,
      options: {
        enableListener: true,
        preconnect: [`https://fonts.gstatic.com`],
        interval: 300,
        timeout: 30000,
        web: [
          {
            name: `Inter`,
            file: `https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap`,
          },
          {
            name: `Crimson Pro`,
            file: `https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@600..800&display=swap`,
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: site.titleDefault,
        short_name: site.title,
        description: site.description,
        start_url: `/`,
        background_color: `#0f172a`,
        theme_color: `#ea580c`,
        display: `standalone`,
        icons: [
          {
            src: `/android-chrome-192x192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `/android-chrome-512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/`,
        excludes: [
          `/dev-404-page`,
          `/404`,
          `/404.html`,
          `/offline-plugin-app-shell-fallback`,
          `/privacy-policy`,
          `/legal-notice`,
        ],
        query: `
        {
          posts: allPost(filter: { published: { eq: true } } ) {
            nodes {
              path: slug
              lastmod: lastUpdated
            }
          }
          garden: allGarden {
            nodes {
              lastmod: lastUpdated
              path: slug
            }
          }
          other: allSitePage(filter: { pluginCreator: { name: { ne: "default-site-plugin" } } } ) {
            nodes {
              path
            }
          }
        }
        `,
        resolveSiteUrl: () => site.url,
        resolvePages: ({ posts, garden, other }) =>
          [].concat(posts.nodes, garden.nodes, other.nodes),
        serialize: ({ path, lastmod }) => ({
          url: path,
          lastmod,
        }),
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
        {
          site {
            siteMetadata {
              title: siteTitleDefault
              description: siteDescription
              siteUrl
              site_url: siteUrl
            }
          }
        }
        `,
        feeds: [
          {
            query: `
            {
              allPost(filter: { published: { eq: true } }, sort: { fields: date, order: DESC } ) {
                nodes {
                  title
                  date
                  description
                  slug
                }
              }
            }
            `,
            serialize: ({ query: { site: s, allPost } }) =>
              allPost.nodes.map(node => {
                const url = `${s.siteMetadata.siteUrl}${node.slug}`
                const content = `<p>${node.description}</p><div style="margin-top: 50px; font-style: italic;"><strong><a href="${url}">Keep reading</a>.</strong></div><br /> <br />`

                return {
                  title: node.title,
                  url,
                  guid: url,
                  date: node.date,
                  description: node.description,
                  custom_elements: [{ "content:encoded": content }],
                }
              }),
            output: `/rss.xml`,
            title: site.titleDefault,
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-gatsby-cloud`,
      options: {
        allPageHeaders: [`Permissions-Policy: interest-cohort=()`],
      },
    },
    shouldAnalyseBundle && {
      resolve: `gatsby-plugin-perf-budgets`,
      options: {},
    },
    shouldAnalyseBundle && {
      resolve: `gatsby-plugin-webpack-bundle-analyser-v2`,
      options: {},
    },
    {
        resolve: `gatsby-plugin-baidu-tongji`,
        options: {
        // 百度统计站点ID
          siteid: "ff8165db1cb3534d15f8b0f5b129381c",
          // 配置统计脚本插入位置，默认值为 false, 表示插入到 body 中, 为 true 时插入脚本到 head 中
          head: true,
        },
      },
  ].filter(Boolean),
}

export default gatsbyConfig
