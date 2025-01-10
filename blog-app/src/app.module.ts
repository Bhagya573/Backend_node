import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/post.entity'; 
import { PostsService } from './posts/posts.service';
import { PostsController } from './posts/posts.controller'; 

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mongodb',
        url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog-app',
        useUnifiedTopology: true,
        synchronize: true, 
        entities: [Post],
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature([Post]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    console.log('Connected to MongoDB successfully!');
  }
}