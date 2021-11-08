const Express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const app = Express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.get('/api/posts', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.techtudo.com.br/');

    const pageContent = await page.evaluate(() => {
        const postsTitles = [];
        const postsCategory = [];
        const linksPosts = [];
        const images = [];
        const timePosts = [];
        const posts = [];

        document.querySelectorAll("body div.bastian-feed-item a.feed-post-link").forEach((title) => (postsTitles.push(title.innerText)));
        document.querySelectorAll("body div.bastian-feed-item .feed-post-metadata-section").forEach((category) => (postsCategory.push(category.innerText)));
        document.querySelectorAll("body div.bastian-feed-item .feed-post-datetime").forEach((timePost) => (timePosts.push(timePost.innerText)));
        document.querySelectorAll("body div.bastian-feed-item a.feed-post-link").forEach((link) => (linksPosts.push(link.href)));
        document.querySelectorAll("body div.bastian-feed-item .bstn-fd-picture-image").forEach((image) => (images.push(image.src)));

        const lenghtPosts = postsCategory.length === postsTitles.length ? postsTitles.length : 0;

        for (let _i = 0; _i < lenghtPosts; _i++) {
            posts.push({
                id: _i,
                title: postsTitles[_i],
                category: postsCategory[_i],
                imageLink: images[_i],
                link: linksPosts[_i],
                timepost: timePosts[_i]
            });
        }
        return posts;
    })
    await browser.close();
    res.send(pageContent)
})
app.get('/', (req, res) => {
    res.send('Welcome the Scraping Rest API');
})

app.listen(3000, () => {
    console.log("🖥 Server started in port 3000");
    console.log("http://localhost:3000/");
})