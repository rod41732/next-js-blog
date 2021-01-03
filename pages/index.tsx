import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../components/layout";
import { getSortedPostsData } from "../lib/posts";
import { Box, Flex, Text } from "rebass";
import { formatDate } from "../lib/date-format";
import Container from "../components/container";
import HomeHeader from "../components/home-header";
import styles from "./index.module.css";

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <HomeHeader />
      <Container>
        <Text as="h1"> Blog posts </Text>
        <Flex>
          {allPostsData.map((post) => (
            <Box p={3} m={2} width={1 / 2} className={styles.card}>
              <Link href={`/posts/${post.id.join("/")}`}>
                <a style={{ color: "unset", textDecoration: "none" }}>
                  <Flex flexDirection="column" height="100%">
                    <Text as="h2"> {post.title}</Text>
                    <Text color="secondaryText">
                      {post.description ?? "no description provided"}
                    </Text>
                    <Text style={{ marginTop: "auto" }}>
                      {" "}
                      Posted: {formatDate(post.date)}{" "}
                    </Text>
                  </Flex>

                </a>
              </Link>
            </Box>
          ))}
        </Flex>
      </Container>
    </Layout>
  );
}
