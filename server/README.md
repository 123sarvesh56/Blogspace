# MERN Blog Backend

A complete backend API for a MERN stack blog application with authentication, CRUD operations, and admin features.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin/User)
  - Password hashing with bcrypt
  - Protected routes

- **User Management**
  - User registration and login
  - Profile management
  - Follow/unfollow system
  - User search

- **Blog Posts**
  - Create, read, update, delete posts
  - Rich text content support
  - Image uploads with Cloudinary
  - Tags and categories
  - Like/bookmark system
  - View tracking
  - SEO-friendly slugs

- **Comments System**
  - Nested comments (replies)
  - Like comments
  - Comment moderation

- **Admin Features**
  - Admin dashboard with statistics
  - User management (promote/demote roles)
  - Content moderation
  - Delete any post/comment

- **Security Features**
  - Rate limiting
  - Input sanitization
  - XSS protection
  - CORS configuration
  - Helmet security headers

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Upload**: Multer + Cloudinary
- **Security**: Helmet, express-rate-limit, express-mongo-sanitize
- **Validation**: express-validator

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/mern-blog
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   CLIENT_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system or use MongoDB Atlas.

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Posts
- `GET /api/posts` - Get all posts (with pagination, search, filters)
- `GET /api/posts/:slug` - Get single post
- `POST /api/posts` - Create new post (auth required)
- `PUT /api/posts/:id` - Update post (auth required)
- `DELETE /api/posts/:id` - Delete post (auth required)
- `POST /api/posts/:id/like` - Like/unlike post (auth required)
- `POST /api/posts/:id/bookmark` - Bookmark/unbookmark post (auth required)

### Comments
- `GET /api/comments/post/:postId` - Get comments for post
- `POST /api/comments` - Create comment (auth required)
- `PUT /api/comments/:id` - Update comment (auth required)
- `DELETE /api/comments/:id` - Delete comment (auth required)
- `POST /api/comments/:id/like` - Like/unlike comment (auth required)

### Users
- `GET /api/users/:username` - Get user profile
- `POST /api/users/:id/follow` - Follow/unfollow user (auth required)
- `GET /api/users/me/bookmarks` - Get user bookmarks (auth required)
- `GET /api/users/:id/followers` - Get user followers
- `GET /api/users/:id/following` - Get user following

### Upload
- `POST /api/upload/image` - Upload image (auth required)
- `DELETE /api/upload/image/:publicId` - Delete image (auth required)

### Admin (Admin only)
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/posts` - Get all posts
- `DELETE /api/admin/posts/:id` - Delete post
- `GET /api/admin/comments` - Get all comments
- `DELETE /api/admin/comments/:id` - Delete comment

## Database Models

### User
- username, email, password
- role (user/admin)
- profile info (avatar, bio, location, etc.)
- followers/following arrays
- bookmarks array

### Post
- title, slug, excerpt, content
- author reference
- tags array
- status (draft/published/archived)
- likes count and likedBy array
- views count
- timestamps

### Comment
- content, author, post references
- parent reference (for nested comments)
- likes count and likedBy array
- status (approved/pending/spam)

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-blog
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=https://your-frontend-domain.com
```

### Deploy to Railway/Render/Heroku
1. Push your code to GitHub
2. Connect your repository to your hosting platform
3. Set environment variables
4. Deploy

### MongoDB Atlas Setup
1. Create account at MongoDB Atlas
2. Create a new cluster
3. Get connection string
4. Update MONGODB_URI in your environment

### Cloudinary Setup (for image uploads)
1. Create account at Cloudinary
2. Get your cloud name, API key, and API secret
3. Update environment variables

## Default Admin Account
After running the seed script:
- **Email**: admin@blog.com
- **Password**: admin123

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.