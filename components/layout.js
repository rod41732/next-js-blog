import Head from 'next/head'
import Link from 'next/link'
import HomeHeader from '../components/home-header';

export const siteTitle = 'rod41732 - blog';

export default function Layout({ children, home }) {
  return (
    <div style={{position: "relative", flex: "0 1 auto", overflow: "auto"}}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="rod41732's blog - A software developer's blog"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main>{children}</main>
      {!home && (
        <div>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  )
}
