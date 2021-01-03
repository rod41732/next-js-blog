---
title: "[Next.js] recursive algorithm for getting all static paths"
description: "มาทำ dynamic routing ให้รองรับ blog ที่แยก content ตามเดือนกันเถอะ"
date: "2021-01-02"
---

# Introduction

เวลาเราเขียน blog หลายๆคน คงอยากให้ content ของเราเป็นระเบียบมากขึ้น และสามารถกลับมาดูทีหลังได้ 
เลยจะแยกบทความที่เราเขียนใส่โฟลเดอร์เป็นเดือนๆ เช่น `2020/01`, `2020/02`, ..., `2021/01`  แทนที่จะเก็บใส่โฟลเดอร์เดียว 

ในบทความนี้ผมจะมาสอน setup routing เพื่อรองรับการทำงานแบบนั้นครับ และโพสต่างๆก็จะเข้าถึงได้ผ่าน URL ในรูปแบบ `mysite.com/posts/2021/01/dynamic-routing-next-js` 

# รู้จักกับ dynamic routing

## Static routing

ใน Next.js จะมีการ routing ตามโครงสร้างไฟล์ในโฟลเดอร์ pages โดยอัตโนมัติ เช่นถ้าเรามีไฟล์ `pages/about-me.js` ก็จะเป็น route `/about-me`

## Dynamic routing

นอกจาก static routing แล้ว Next.js ยังมีฟีเจอร์ dynamic routing ที่ทำให้เราสามารถ generate route ขึ้นมาได้ ตัวอย่างเช่น

ใน tutorial ของ Next.js ก็จะ[สอนการทำ blog](https://nextjs.org/learn/basics/create-nextjs-app) โดยใช้ dynamic routing โดย

แต่ละไฟล์ในโฟลเดอร์ที่เก็บ content ของ blog ก็จะถูกเอามาสร้างเป็นหน้าเว็บ เช่น

- `posts/ssg-ssr.md` --> path `/posts/ssg-ssr`
- `posts/ssg-ssr.md` --> path `/posts/ssg-ssr`

ก็คือเป็น pattern `/posts/:id` นั่นเอง

โดยเรา define dynamic route จากไฟล์ `pages/posts/[id].js`

(สำหรับรายละเอียดเพิ่มเติมเกี่ยวกับ routing สามารถ follow ตัว tutorial ได้[ที่นี่](https://nextjs.org/learn/basics/dynamic-routes))

### Catch all paths

พระเอกของงานนี้เลยก็คือ catch all paths ซึ่งเป็น dynamic routing รูปแบบนึง ซึ่งทำให้เราสามารถ match หลายๆ route segments ได้ เช่น รูปแบบ `/posts/*id` ซึ่งจะ match path `/posts/foo`, `/posts/foo/bar`, `/posts/foo/bar/baz ` (สามารถ match หลายๆ segments ได้) โดยหากเราต้องการ match path ดังกล่าวทำได้โดยการสร้างไฟล์ `posts/pages/[...id].js` (ในชื่อไฟล์จะมีจุด 3 จุด)

ซึ่งก็จะทำให้เราสามารถ match path ในรูปแบบ `/posts/2020/01/post-1`
`/posts/2020/02/post-2` ได้ตามที่เราต้องการ

# Let's implement it!

พูดมาตั้งนาน เรามาเริ่ม implement กันเถอะ

> Note: code ในบทความนี้จะ base-on ตัว tutorial ของ Next.js

ในที่นี้สมมติเราจะให้ blog ของเราอยู่ใต้ path `/posts` ทั้งหมด (เช่น `/posts/2021/01/next-js-tutorial`)
และเราเก็บจะ content ของ blog เราเป็นไฟล์ markdown ไว้ใต้โฟลเดอร์ posts ทั้งหมด (เหมือน[ขั้นตอนนี้](https://nextjs.org/learn/basics/data-fetching/blog-data) ใน Next.js tutorial)

## Overview
ไฟล์และโฟลเดอร์ที่สำคัญๆและถูกล่าวถึงในบทความนี้คือ

- `pages/posts/[...id].js` ซึ่งเป็น dynamic path ที่เราจะใช้ทำ routing 
- โฟลเดอร์ `posts` ที่เก็บไฟล์ markdown ที่เป็นบทความของเรา
- ไฟล์ `lib/pages.js` เก็บฟังก์ชันที่ใช้ดึงข้อมูลจากโฟลเดอร์ `pages` ของเราให้ `getStaticPaths` และ `getStaticProps` ใน `pages/posts/[...id].js` (หรือหน้าอื่นๆในอนาคต) เรียกใช้

## Set up dynamic route

ก่อนอื่นเราสร้างไฟล์ `pages/posts/[...id].js` ก่อน เพื่อสร้าง dynamic path `/posts/*id`
และแสดงผลบทความเรา โดยมีโค้ดตามด้านล่างนี้

```javascript
// file: pages/posts/[...id].js
import { getAllPostIds, getPostData } from "../../lib/posts";

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export default function Post({ postData }) {
  return (
    <div>
      <h1>{postData.title}</h1>
      <div>{postData.id}</div>
      <div>{postData.date} </div>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </div>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}
```

## Implement function for `getStaticPaths`

Next.js จะใช้ path จากฟังก์ชัน `getStaticPaths` เพื่อ generate page ไว้ล่วงหน้า (Static Site Generation -- SSG) 

โดยเราจะให้ `getStaticPaths` จะไปเรียก `getAllPostIds` ใน `lib/posts.js` อีกที

>  ใน `lib/posts.js` เราจะเขียนฟังก์ชันต่างๆที่ใช้ดึงข้อมูลจาก file system เพื่อให้ code ให้หน้าต่างๆ เรียกใช้อีกที



## Algorithm from getting markdown files <a name="foo" href="#foo">🔗</a>

เราไม่สามารถใช้โค้ดตาม tutorial ที่แค่ทำการ list ไฟล์ในโฟลเดอร์ `pages` ได้
เนื่องจากเราไม่ได้เก็บไฟล์ไว้ในโฟลเดอร์ pages โดยตรงแต่เก็บเป็นโฟลเดอร์ย่อยๆ (เช่น `2020/01, 2020/02, ...`)

เราจะเขียนฟังก์ชันนี้เพื่อให้สามารถ list รายชื่อไฟล์ markdown ในโฟลเดอร์ย่อยๆทั้งหมดได้
```js
// file: lib/posts.js
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

function parseFile(path) {
  const fileContents = fs.readFileSync(path, "utf-8");
  const matterResult = matter(fileContents);

  return {
    ...matterResult.data,
  };
}

function isDir(path) {
  return !/\.md$/.test(path);
}

function getPostInDirRecur(dirname) {
  const filenames = fs.readdirSync(dirname);

  const allPostData = [];
  for (let filename of filenames) {
    if (isDir(filename)) {
      const subDirPosts = getPostInDirRecur(path.join(dirname, filename));
      const subDirPostsWithPrefix = subDirPosts.map((post) => {
        return {
          ...post, // original data
          id: [filename, ...post.id], // prefix id with dirname
        };
      });
      allPostData.push(...subDirPostsWithPrefix);
    } else {
      const id = filename.replace(/\.md$/, "");
      const fullpath = path.join(dirname, filename);
      allPostData.push({
        id: [id],
        ...parseFile(fullpath),
      });
    }
  }
  return allPostData;
}
```

จากนั้นจะเขียนฟังก์ชันฟังก์ชัน `getAllPostIds` เพื่อให้ `getStaticPaths` เรียกใช้ใน `pages/posts/[...id].js` เรียก

> `getAllPostIds` จะเรียก `getPostInDirRecur` ที่โฟลเดอร์ `pages` ที่เก็บไฟล์ markdown 

```js
// file: lib/posts.js
const postsDirectory = path.join(process.cwd(), "posts");

export function getAllPostIds() {
  const allPostsRecur = getPostInDirRecur(postsDirectory);

  // console.log(allPostsRecur)
  return allPostsRecur.map((post) => {
    return {
      params: {
        id: post.id,
      },
    };
  });
}
```

ฟังก์ชัน `getPostInDirRecur` จะทำการ traverse ไปในโฟลเดอร์ย่อยๆทั้งหมด เพื่อ list รายชื่อไฟล์ markdown ออกมาทั้งหมด

หากลองเอาฟังก์ชันทีกล่าวไปมาลองรันก็จะได้ผลประมาณนี้
![foo](/images/2021/01/dynamic-routing-next-js/recur-result.png)

## How it works

หลักการทำงาน เมื่อเรียกฟังก์ชัน `getPostInDirRecur(dirname)` ซึ่งมีการทำงานแบบ [recursive](https://www.geeksforgeeks.org/recursive-functions/)

1. จะดึงรายชื่อไฟล์และโฟลเดอร์ใน `dirname`
2. สร้างตัวแปร `result` เก็บรายชื่อ markdown ใต้ `dirname` นี้
3. วนลูปในรายชื่อไฟล์ของ `dirname`

- ถ้าเป็นไฟล์ก็เอาไปใส่ใน list `result` เลย
  - สังเกตว่า path ที่เรา return จะเป็น array เพราะการใช้ path แบบ catch all ตรง id ที่ return มาต้องเป็น array
- แต่ถ้าเป็นโฟลเดอร์ก็เรียกฟังก์ชัน `getPostInDirRecur` เพื่อดึงรายชื่อไฟล์ markdown ในโฟลเดอร์ย่อยนั้นๆต่ออีก
  - แต่ก่อนเอาไฟล์ไปใส่ใน list result ก็เอาชื่อโฟลเดอร์ย่อย (01) นั้น ไปแทรกหน้า id

> ตัวอย่างเช่น
>
> - สมมติเรากำลังเรียกฟังก์ชัน `getPostInDirRecur` ที่โฟลเดอร์ 2021 แล้ว แล้วเจอโฟลเดอร์ย่อย 01
> - เราทำการเรียกฟังก์ชัน `getPostInDirRecur` กับโฟลเดอร์ 01 เพื่อ list รายชื่อไฟล์ใต้โฟลเดอร์ 01 ก่อน ซึ่งจะได้ผลออกมาเป็น ค่าที่ return กลับมาหมายความว่าในโหลเดอร์ 01 นั้นมีไฟล์ชื่อ `dynamic-routing-next-js` กับ `welcome` อยู่

```js
[{ id: ["dynamic-routing-next-js"] }, { id: ["welcome"] }];
```

> - เมื่อฟังก์ชัน return กลับแล้ว ในการทำงานของ getPostInDirRecur กับโฟลเดอร์ 2021 ก่อนที่จะเอารายชื่อ file ไปใส่ใน list ให้ จะเอาชื่อโฟลเดอร์ย่อย (01) แทรกข้างหน้าข้าง
>   `id` ของแต่ละไฟล์ก่อน จะได้เป็น

```js
[{ id: ["01", "dynamic-routing-next-js"] }, { id: ["01", "welcome"] }];
```

> - ซึ่งจะหมายความว่าในโฟลเดอร์ 2021 มีไฟล์ `01/dynamic-routing-next-js` และ `01/welcome`
> - เมื่อ `getPostInDirRecur('2021')` ทำงานเสร็จก็จะ return กลับไปที่ `getPostInDir('pages')` ก่อนที่จะเอาไฟล์ไปใส่ใน list ก็ทำอย่างเดียวกันคือจะเอาชือ่โฟลเดอร์ (2021) ไปแทรกข้างหน้า id เช่นกัน จะได้เป็น (หากย้อนกลับไปดูในรูปก่อนหน้าก็จะเห็นว่ามีไฟล์ที่มี `id` เป็นแบบนี้)
```js
[{ id: ["2021", "01", "dynamic-routing-next-js"] }, { id: ["2021", "01", "welcome"] }];
```



4. เมื่อทำการ list file เสร็จก็จะ return array ของไฟล์ markdown ทั้งหมดในโฟลเดอร์นั้นกลับไป

## Implement getStaticProps

`getStaticProps` ใช้ดึง content ของแต่ละหน้าบทความสำหรับ

เราจะเขียนโค้ดสำหรับดึง content บทความจากไฟล์ markdown ไว้ใน `lib/posts.js`

```js
// file: Lib/posts.js
export async function getPostData(idArray) {
  idArray[idArray.length - 1] = idArray[idArray.length - 1] + ".md"; // add extension to file name
  const fullPath = path.join(postsDirectory, ...idArray);
  console.log("fullpath", fullPath);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id
  return {
    id: idArray,
    contentHtml,
    ...matterResult.data,
  };
}
```
จากนั้นให้ `getStaticProps` ในไฟล์ `pages/posts/[...id].js` เรียกอีกที
```js
// file: pages/posts/[...id].js
export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id) // id is array
  return {
    props: {
      postData
    }
  }
}
```
# Test it
เมื่อเราทำเสร็จแล้วเราก็จะลองเทสดู 
1. ลองสร้างไฟล์ในโฟลเดอร์ posts เช่น `2021/01/hello.md`

```markdown
---
title: 'Hello world !'
date: '2020-01-02'
---

# This is test page
```

2. จากนั้นลองเข้าไปที่ `localhost:3000/posts/2021/01/hello.md` ก็จะเห็นหน้าเว็บแบบนี้

![result-page](/images/2021/01/dynamic-routing-next-js/result-page.png)


# The end
