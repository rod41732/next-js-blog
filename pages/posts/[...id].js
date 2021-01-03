import Layout from '../../components/layout'
import Head from 'next/head'
import { getAllPostIds, getPostData } from '../../lib/posts'
import { formatDate } from "../../lib/date-format";
import { Text } from 'rebass';
import Container from '../../components/container';
import BlogNavbar from '../../components/navbar';

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id)
  return {
    props: {
      postData
    }
  }
}

export default function Post({ postData }) {
  const { title, id, date, description = "No description provided" } = postData;
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div style={{
        maxHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <BlogNavbar title={title}/>
        <Layout>
          <Container>
            <Text color="text" as="h1"> {title}</Text>
            <Text color="secondaryText"> {description} </Text>
            <Text color="text"> Posted on: {formatDate(date)}</Text>
            <hr />
            <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />

            <div> footer show next/prev post </div>
            <div> site footer </div> 
          </Container>
        </Layout>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  console.log(paths);
  return {
    paths,
    fallback: false,
  }
}