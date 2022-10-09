import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { useGetItemPricesQuery, usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import { useState } from "react";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 20,
    cursor: null as null | Date,
  });
  const [{ data: item_data }] = useGetItemPricesQuery();
  const [{ fetching, data: post_data }] = usePostsQuery({
    variables,
  });

  return (
    <Layout>
      <Flex>
        <Heading fontSize={30} mt={10} textAlign={"center"}>
          TXDOT Analysis Tool
        </Heading>
      </Flex>
      <br />
      <Box textAlign={"left"} mb={2}>
        <NextLink href="/create-post">
          <Link color={"cyan"}>Create Post</Link>
        </NextLink>
      </Box>
      {!fetching && !post_data ? (
        <div>Query Failed</div>
      ) : fetching && !post_data ? (
        <div>loading posts...</div>
      ) : (
        <Stack spacing={8}>
          {post_data!.posts.posts.map((p) => (
            <Box
              bgColor={"DarkSlateGray"}
              color={"white"}
              key={p.id}
              p={5}
              borderWidth="3px"
            >
              <Heading color={"white"} fontSize="xl">
                {p.title}
              </Heading>
              <Text color={"#E0E0E0"} mt={4}>
                {p.textSnippet}
              </Text>
            </Box>
          ))}
        </Stack>
      )}
      {
        // --- Load more button ---
        post_data && post_data.posts.hasMore ? (
          <Flex>
            <Button
              isLoading={fetching}
              color={"white"}
              bgColor={"darkcyan"}
              m={"auto"}
              my={6}
              onClick={() => {
                setVariables({
                  limit: variables.limit,
                  cursor:
                    post_data.posts.posts[post_data.posts.posts.length - 1]
                      .createdAt,
                });
              }}
            >
              Load more...
            </Button>
          </Flex>
        ) : null
      }

      <br />
      <Box textAlign={"center"}>Placeholder Text</Box>
      {!item_data ? (
        <div>loading bid data...</div>
      ) : (
        item_data.get_item_prices.map((p) => (
          <Box
            textAlign={"center"}
            key={(p.item_code, p.project, p.contractor)}
          >
            {p.item_code} --- {p.project} --- {p.contractor} --- Bid Price:{" "}
            {p.unit_bid_price}
          </Box>
        ))
      )}
    </Layout>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
