import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import NextLink from "next/link";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { VoteSection } from "../components/VoteSection";
import { POST_LIMIT } from "../constants";
import {
  useGetItemPricesQuery,
  useMeQuery,
  usePostsQuery,
} from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  const { data: me_data } = useMeQuery();
  const { data: item_data } = useGetItemPricesQuery();
  const {
    loading,
    data: post_data,
    fetchMore,
    variables,
  } = usePostsQuery({
    variables: {
      limit: POST_LIMIT,
      cursor: null as null | Date,
    },
    notifyOnNetworkStatusChange: true,
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
          <Link fontWeight={"bold"} color={useColorModeValue("darkblue","Cyan")}>Create Post</Link>
        </NextLink>
      </Box>
      {!loading && !post_data ? (
        <div>Query Failed</div>
      ) : loading && !post_data ? (
        <div>loading posts...</div>
      ) : (
        <Stack spacing={8}>
          {post_data!.posts.posts.map((p) =>
            !p ? null : (
              <Box
                bg={useColorModeValue("MintCream","DarkSlateGray")}
                key={p.id}
                p={5}
                borderWidth="3px"
                borderColor={useColorModeValue("darkgray","none")}
              >
                <Flex>
                  <Box>
                    <VoteSection post={p} />
                  </Box>
                  <Box>
                    <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                      <Link>
                        <Heading color={useColorModeValue("Black","White")} fontSize="xl">
                          {p.title}
                        </Heading>{" "}
                      </Link>
                    </NextLink>
                    <Text color={useColorModeValue("Black","#E0E0E0")} mt={4}>
                      {p.textSnippet}
                    </Text>
                  </Box>
                  <Box ml={"auto"}>
                    <Text mb={3}>Posted by {p.creator.username}</Text>
                    {me_data?.me?.id !== p.creator.id ? null : (
                      <EditDeletePostButtons
                        id={p.id}
                        creatorId={p.creator.id}
                      />
                    )}
                  </Box>
                </Flex>
              </Box>
            )
          )}
        </Stack>
      )}
      {
        // --- Load more button ---
        post_data && post_data.posts.hasMore ? (
          <Flex>
            <Button
              isLoading={loading}
              color={useColorModeValue("black", "white")}
              bgColor={useColorModeValue("cyan", "darkcyan")}
              m={"auto"}
              my={6}
              onClick={() => {
                fetchMore({
                  variables: {
                    limit: variables?.limit,
                    cursor:
                      post_data.posts.posts[post_data.posts.posts.length - 1]
                        .createdAt,
                  },
                  // updateQuery: (
                  //   previousValue,
                  //   { fetchMoreResult }
                  // ): PostsQuery => {
                  //   if (!fetchMoreResult) {
                  //     return previousValue as PostsQuery;
                  //   }
                  //   return {
                  //     __typename: "Query",
                  //     posts: {
                  //       __typename: "PaginatedPosts",
                  //       hasMore: (fetchMoreResult as PostsQuery).posts.hasMore,
                  //       posts: [...(previousValue as PostsQuery).posts.posts, ...(fetchMoreResult as PostsQuery).posts.posts],
                  //     },
                  //   };
                  // },
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
export default withApollo()(Index);
