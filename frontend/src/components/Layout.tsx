import { Box, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { NavBar } from "./NavBar";
import { Wrapper, WrapperVariant } from "./Wrapper";

interface LayoutProps {
  children: React.ReactNode;
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <Box bg={useColorModeValue("#CCF4D9","DarkTeal")}>
        <NavBar />
        <ColorModeSwitcher m={4} size="lg" float={"right"} />
        <Wrapper variant={variant}>{children}</Wrapper>
      </Box>
    </>
  );
};
