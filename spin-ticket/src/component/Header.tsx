import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
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
            <Image src="/kings-logo.png" alt="logo" width={50} height={50} />
            <Box alignItems="center">
              <Heading
                as="h1"
                fontSize="3xl"
                cursor="pointer"
                marginLeft={4}
                color={"white"}
              >
                神宮寺生誕祭
              </Heading>
              <Text as="h2" fontSize={"md"} color="white" marginLeft={4}>
                ~お寺参り編withもつお~
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
