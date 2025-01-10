// src/posts/posts.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) 
    private readonly postRepository: Repository<Post>,
  ) {}

  // Create a new post
  async createPost(title: string, content: string, author: string): Promise<Post> {
    const newPost = this.postRepository.create({ title, content, author });
    return this.postRepository.save(newPost); // Directly return the result
  }

  // Get all posts
  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.find(); // Directly return the result
  }

}