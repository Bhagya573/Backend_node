// src/posts/posts.controller.ts
import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Set the HTTP status to 201 Created for POST requests
  async createPost(
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('author') author: string,
  ): Promise<PostEntity> {
    return this.postsService.createPost(title, content, author);
  }

  @Get()
  async getAllPosts(): Promise<PostEntity[]> {
    return this.postsService.getAllPosts();
  }
}