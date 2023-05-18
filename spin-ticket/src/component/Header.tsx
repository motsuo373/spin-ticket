import { Box, Container, Flex, Heading } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

export const Header = () => {
  return (
    <Box px={4} bgColor="yellow.800">
      <Container maxW="container.lg">
        <Flex
          as="header"
          py="4"
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex alignItems="center">
            <Image src="/target.png" alt="logo" width={50} height={50} />
            <Heading
              as="h1"
              fontSize="2xl"
              cursor="pointer"
              marginLeft={4}
              color={"white"}
            >
              もつおバウンティ
            </Heading>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
