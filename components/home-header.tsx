import React from "react";
import Image from "next/image";
import { Box, Flex, Heading, Text } from "rebass";
import styles from "./home-header.module.css";

export default function HomeHeader() {
  return (
    <Flex
      backgroundColor="backgroundInverted"
      py={4}
      flexDirection="column"
      alignItems="center"
    >
      <Image
        className={styles.avatar}
        src="/images/profile.jpg"
        alt="author's avatar"
        width={128}
        height={128}
      />
      <Heading pt={2} as="h1" color="textInverted" fontSize={4}>
        Rodchananat's Blog
      </Heading>
      <Text color="textInverted"> A software developer's blog</Text>
      <Box
        mt={2}
        px={2}
        py={1}
        sx={{
          border: "1px solid black",
          borderColor: "textInverted",
          borderRadius: 8,
        }}
      >
        <a
          href="https://github.com/rod41732"
          style={{ textDecoration: "none" }}
        >
          <Flex flexDirection="row" alignItems="center" justifyContent="center">
            {/* <Box px={2}> */}
            <Image width={24} height={24} src="/images/github-logo.png" />
            {/* </Box> */}
            <Text pl={2} color="textInverted">
              {" "}
              GitHub{" "}
            </Text>
          </Flex>
        </a>
      </Box>
    </Flex>
  );
}
