import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();
  let body = null;

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link ml={"auto"}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link ml={4}>Register</Link>
        </NextLink>
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
            onClick={() => {
              logout({});
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
    <Flex bg="darkslategrey" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
