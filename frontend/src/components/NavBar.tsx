import { useApolloClient } from "@apollo/client";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { FaHome } from "react-icons/fa";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery();
  let body = null;

  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
        <Flex>
          <NextLink href="/login">
            <Link ml={4}>Login</Link>
          </NextLink>
          <NextLink href="/register">
            <Link ml={4}>Register</Link>
          </NextLink>
        </Flex>
      </>
    );
  } else {
    body = (
      <>
        <Flex>
          <Box fontWeight={"bold"}>{data.me.username}</Box>
          <Button
            color={useColorModeValue("#990000", "pink")}
            ml={6}
            variant="link"
            onClick={async () => {
              await logout({});
              await apolloClient.resetStore();
            }}
            isLoading={logoutFetching}
          >
            Logout
          </Button>
        </Flex>
      </>
    );
  }
  return (
    <Flex
      zIndex={1}
      position="sticky"
      top={0}
      bg={useColorModeValue("MediumAquaMarine", "DarkSlateGray")}
      p={4}
    >
      <Box>
        <NextLink href="/">
          <IconButton
            aria-label="Home"
            icon={<FaHome />}
          />
        </NextLink>
      </Box>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
