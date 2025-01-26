import express, {Request, Response} from 'express';
import {HttpStatus, SETTINGS} from './settings';
import {postRepository} from './repositories/post-repository';
import {blogRepository} from './repositories/blog-repository';
import {postRouter} from './controllers/post-controller';
import {blogRouter} from './controllers/blog-controller';


export const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send({'Version': 'mongo 2.0'});
});

app.delete(SETTINGS.API.ALL_DATA, async (req: Request, res: Response) => {
    await postRepository.deleteAllPosts();
    await blogRepository.deleteAllBlogs();
    res.sendStatus(HttpStatus.NO_CONTENT);
});

app.use(SETTINGS.API.POSTS, postRouter);
app.use(SETTINGS.API.BLOGS, blogRouter);