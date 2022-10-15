import { useApolloClient } from "@apollo/client";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [logout, { loading: logoutloading }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });
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
            color="pink"
            ml={6}
            variant="link"
            onClick={async () => {
              await logout();
              await apolloClient.resetStore();
            }}
            isLoading={logoutloading}
          >
            Logout
          </Button>
        </Flex>
      </>
    );
  }
  return (
    <Flex zIndex={1} position="sticky" top={0} bg="darkslategrey" p={4}>
      <Box>
        <NextLink href="/">
          <Link ml={4}>Home</Link>
        </NextLink>
      </Box>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
