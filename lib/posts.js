import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import unified from 'unified';
import remark from 'remark-parse'
import html from 'remark-html'
import highlight from 'remark-highlight.js'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
  // Get file names under /posts
  return getPostInDirRecur(postsDirectory).sort(
    (a, b) => (a.date > b.date) ? -1 : 1,
  );
}


export function getAllPostIds() {
  const allPostsRecur = getPostInDirRecur(postsDirectory);

  // Returns an array that looks like this:
  // [
  //   {
  //     id: [ '2020', '01', 'ssg-ssr' ],
  //     title: 'When to Use Static Generation v.s. Server-side Rendering',
  //     date: '2020-01-02'
  //   },
  //   {
  //     id: [ '2077', 'cyberpunk' ],
  //     title: 'Cyberpunk 2077',
  //     date: '2077-07-07'
  //   },
  //   {
  //     id: [ 'ssg-ssr' ],
  //     title: 'When to Use Static Generation v.s. Server-side Rendering',
  //     date: '2020-01-02'
  //   }
  // ]
  console.log("get path:", allPostsRecur)
  return allPostsRecur.map(post => {
    return {
      params: {
        id: post.id,
      }
    }
  })
}

export async function getPostData(idArray) {
  idArray[idArray.length-1] = idArray[idArray.length-1] + ".md";
  const fullPath = path.join(postsDirectory, ...idArray)
  console.log("fullpath", fullPath)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  const processedContent = await unified()
  .use(remark)
  .use(highlight)
  .use(html)
  .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the id

  return {
    id: idArray,
    contentHtml,
    ...matterResult.data
  }
}




// return return matter.data of a file
function parseFile(path) {
  const fileContents = fs.readFileSync(path, 'utf-8');
  const matterResult = matter(fileContents);

  return {
    ...matterResult.data,
  }
}


function getPostInDirRecur(dirname) {
  const filenames = fs.readdirSync(dirname);

  const allPostData = [];
  for (let filename of filenames) {
    if (isDir(filename)) {
      const subDirPosts = getPostInDirRecur(path.join(dirname, filename));
      const subDirPostsWithPrefix = subDirPosts.map(post => {
        return {
          ...post, // original data
          id: [filename, ...post.id], // prefix id with dirname
        }
      })
      allPostData.push(...subDirPostsWithPrefix)
    } else {
      const id = filename.replace(/\.md$/, '');
      const fullpath = path.join(dirname, filename);
      allPostData.push({
        id: [id],
        ...parseFile(fullpath),
      });
    }
  }
  return allPostData;
}


function isDir(path) {
  return !(/\.md$/.test(path))
}