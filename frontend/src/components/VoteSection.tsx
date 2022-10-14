import { ApolloCache, gql } from "@apollo/client";
import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  PostSnippetFragment,
  useMeQuery,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";

interface VoteSectionProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) {
      return;
    }
    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value },
    });
  }
};

export const VoteSection: React.FC<VoteSectionProps> = ({ post }) => {
  const [, setLoadingState] = useState<
    "upvote-loading" | "downvote-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteMutation();

  const router = useRouter();
  const { data, loading } = useMeQuery();

  return (
    <Flex
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      mr={4}
    >
      <IconButton
        onClick={async () => {
          if (!loading && !data?.me) {
            router.replace("/login?next=" + router.pathname);
          } else {
            if (post.voteStatus === 1) {
              return;
            }
            setLoadingState("upvote-loading");
            await vote({
              variables: {
                postId: post.id,
                value: 1,
              },
              update: (cache) => updateAfterVote(1, post.id, cache),
            });
            setLoadingState("not-loading");
          }
        }}
        bgColor={post.voteStatus === 1 ? useColorModeValue("#10E796","teal") : undefined}
        aria-label="Upvote"
        icon={<TriangleUpIcon />}
        size={"sm"}
        h={8}
      />
      {post.points}
      <IconButton
        onClick={async () => {
          if (!loading && !data?.me) {
            router.replace("/login?next=" + router.pathname);
          } else {
            if (post.voteStatus === -1) {
              return;
            }
            setLoadingState("downvote-loading");
            await vote({
              variables: {
                postId: post.id,
                value: -1,
              },
              update: (cache) => updateAfterVote(-1, post.id, cache),
            });
            setLoadingState("not-loading");
          }
        }}
        bgColor={post.voteStatus === -1 ? useColorModeValue("LightPink", "LightCoral") : undefined}
        aria-label="Downvote"
        icon={<TriangleDownIcon />}
        size={"sm"}
        h={8}
      />
    </Flex>
  );
};
