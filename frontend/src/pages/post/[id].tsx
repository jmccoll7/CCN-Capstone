import { withUrqlClient } from "next-urql";
import React from "react";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Layout } from "../../components/Layout";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";

export const Post = ({}) => {
  const [{ data, error, fetching }] = useGetPostFromUrl();

  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }
  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>Post not found.</Box>
      </Layout>
    );
  }
  return (
    <Layout>
      <Flex>
        <Heading mb={4}>{data?.post?.title}</Heading>
        <EditDeletePostButtons
          boxProps={{
            ml: "auto",
          }}
          id={data.post.id}
          creatorId={data.post.creator.id}
        />
      </Flex>
      {data?.post?.text}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
