import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, BoxProps, IconButton } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
  boxProps?: BoxProps;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
  boxProps,
}) => {
  const { data: me_data } = useMeQuery();
  const [deletePost] = useDeletePostMutation();
  if (me_data?.me?.id !== creatorId) {
    return null;
  }
  return (
    <Box {...boxProps}>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton icon={<EditIcon />} mr={4} aria-label="Edit Post" />
      </NextLink>
      <IconButton
        icon={<DeleteIcon />}
        aria-label="Delete post"
        onClick={() => {
          deletePost({
            variables: { id },
            update: (cache) => {
              cache.evict({ id: "Post:" + id });
            },
          });
        }}
      />
    </Box>
  );
};
