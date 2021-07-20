import * as React from "react"
import { Flex } from "@chakra-ui/react"
import { useLocation } from "@reach/router"
import { useSiteMetadata } from "../../hooks/use-site-metadata"
import { useDistinctCategories } from "../../hooks/use-distinct-categories"
import { Link } from "../link"
import { Navigation } from "./navigation"
import { FullWidthContainer } from "./full-width-container"
import { Spacer } from "./spacer"

const Logo: React.FC = () => {
  const { avatar } = useSiteMetadata()
  return (
    <Link
      to="/"
      transform="scale(1)"
      _hover={{ transform: `scale(1.1)` }}
      aria-label="lekoarts.de, Back to homepage"
    >
      <img
        src={avatar}
        style={{ width: "35px", height: "35px", borderRadius: "20px" }}
      />
    </Link>
  )
}

type HeaderProps = {
  subnavigation?: React.ReactNode
}

export const Header: React.FC<HeaderProps> = ({
  subnavigation = undefined,
}) => {
  const categorySlugs = useDistinctCategories()
  const location = useLocation()
  const isCategoryPage = categorySlugs.includes(location.pathname)
  const variant = subnavigation ? `navigationWithSub` : `navigation`
  const height = subnavigation ? `navigationWithSubHeight` : `navigationHeight`

  return (
    <>
      <FullWidthContainer
        variant={isCategoryPage ? `fullBleed` : variant}
        height={height}
      >
        <Flex
          as="header"
          alignItems="center"
          justifyContent="space-between"
          py="13px"
        >
          <Logo />
          <Navigation />
        </Flex>
        {subnavigation}
      </FullWidthContainer>
      {!isCategoryPage && <Spacer size={height} axis="vertical" />}
    </>
  )
}
