import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-blog');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@blog.com',
        password: 'admin123',
        role: 'admin',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        bio: 'Administrator of the blog platform. Passionate about technology and writing.',
        location: 'San Francisco, CA'
      },
      {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
        bio: 'Full-stack developer passionate about React and modern web technologies.',
        location: 'New York, NY'
      },
      {
        username: 'sarah_writer',
        email: 'sarah@example.com',
        password: 'password123',
        role: 'user',
        avatar: 'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=100',
        bio: 'Technical writer and UI/UX designer. Love creating beautiful and functional interfaces.',
        location: 'Austin, TX'
      },
      {
        username: 'tech_guru',
        email: 'guru@example.com',
        password: 'password123',
        role: 'user',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
        bio: 'Senior software engineer with 10+ years of experience in backend development.',
        location: 'Seattle, WA'
      }
    ]);

    console.log('Created users');

    // Create posts
    const posts = await Post.create([
      {
        title: 'Getting Started with React Hooks',
        excerpt: 'Learn how to use React Hooks to build modern, functional components with state and lifecycle methods.',
        content: `
          <p>React Hooks revolutionized how we write React components. In this comprehensive guide, we'll explore the most commonly used hooks and how to implement them effectively in your applications.</p>
          
          <h2>What are React Hooks?</h2>
          <p>Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 and have since become the standard way to write React components.</p>
          
          <h3>The useState Hook</h3>
          <p>The useState hook is the most fundamental hook. It allows you to add state to functional components:</p>
          
          <pre><code>import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}</code></pre>
          
          <h3>The useEffect Hook</h3>
          <p>The useEffect hook lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined in React classes.</p>
          
          <h2>Best Practices</h2>
          <ul>
            <li>Only call hooks at the top level of your React functions</li>
            <li>Don't call hooks inside loops, conditions, or nested functions</li>
            <li>Use the ESLint plugin for React Hooks to enforce these rules</li>
            <li>Create custom hooks to share stateful logic between components</li>
          </ul>

          <h2>Conclusion</h2>
          <p>React Hooks provide a more direct API to the React concepts you already know. They offer a powerful way to compose behavior and share logic between components without the complexity of higher-order components or render props.</p>
        `,
        image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
        author: users[1]._id, // johndoe
        tags: ['react', 'javascript', 'hooks', 'frontend'],
        likes: 42,
        views: 256
      },
      {
        title: 'Building Scalable Node.js Applications',
        excerpt: 'Best practices for building and deploying Node.js applications that can handle millions of users.',
        content: `
          <p>When building Node.js applications for scale, there are several key principles and patterns you should follow to ensure your application can handle increased load and maintain performance.</p>
          
          <h2>Architecture Patterns</h2>
          <p>A well-structured Node.js application should follow these architectural principles:</p>
          
          <h3>1. Microservices Architecture</h3>
          <p>Break your application into smaller, independent services that can be developed, deployed, and scaled independently.</p>
          
          <h3>2. Event-Driven Architecture</h3>
          <p>Leverage Node.js's event-driven nature to build responsive applications that can handle concurrent operations efficiently.</p>
          
          <h2>Performance Optimization</h2>
          <ul>
            <li>Use clustering to take advantage of multi-core systems</li>
            <li>Implement caching strategies with Redis</li>
            <li>Optimize database queries and use connection pooling</li>
            <li>Use CDNs for static assets</li>
          </ul>
          
          <h2>Monitoring and Logging</h2>
          <p>Implement comprehensive monitoring and logging to track application performance and identify bottlenecks.</p>
        `,
        image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
        author: users[0]._id, // admin
        tags: ['nodejs', 'backend', 'scalability', 'performance'],
        likes: 67,
        views: 423
      },
      {
        title: 'Modern CSS Grid Layouts',
        excerpt: 'Master CSS Grid to create complex, responsive layouts with ease. Learn the fundamentals and advanced techniques.',
        content: `
          <p>CSS Grid is one of the most powerful layout systems available in CSS. It allows you to create complex, responsive layouts with minimal code.</p>
          
          <h2>Grid Basics</h2>
          <p>CSS Grid Layout introduces a two-dimensional grid system to CSS. Unlike flexbox, which is largely a one-dimensional system, Grid can handle both columns and rows.</p>
          
          <h3>Creating a Grid Container</h3>
          <pre><code>.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}</code></pre>
          
          <h2>Advanced Grid Techniques</h2>
          <p>Learn about grid areas, auto-placement, and responsive design with CSS Grid.</p>
        `,
        image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
        author: users[2]._id, // sarah_writer
        tags: ['css', 'grid', 'layout', 'responsive', 'frontend'],
        likes: 34,
        views: 189
      },
      {
        title: 'Database Design Principles',
        excerpt: 'Learn the fundamental principles of database design, normalization, and optimization for better performance.',
        content: `
          <p>Good database design is crucial for application performance, data integrity, and maintainability. This guide covers the essential principles every developer should know.</p>
          
          <h2>Normalization</h2>
          <p>Database normalization is the process of organizing data to reduce redundancy and improve data integrity.</p>
          
          <h3>First Normal Form (1NF)</h3>
          <p>Eliminate repeating groups and ensure each column contains atomic values.</p>
          
          <h3>Second Normal Form (2NF)</h3>
          <p>Meet 1NF requirements and eliminate partial dependencies.</p>
          
          <h2>Indexing Strategies</h2>
          <p>Proper indexing can dramatically improve query performance, but it comes with trade-offs in storage and write performance.</p>
        `,
        image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800',
        author: users[3]._id, // tech_guru
        tags: ['database', 'sql', 'mongodb', 'design', 'performance'],
        likes: 89,
        views: 567
      }
    ]);

    console.log('Created posts');

    // Create comments
    await Comment.create([
      {
        content: 'Great article! This really helped me understand hooks better.',
        author: users[0]._id, // admin
        post: posts[0]._id
      },
      {
        content: 'The useState example was particularly helpful. Thanks for sharing!',
        author: users[2]._id, // sarah_writer
        post: posts[0]._id
      },
      {
        content: 'Excellent guide on Node.js scalability. The microservices section was very insightful.',
        author: users[1]._id, // johndoe
        post: posts[1]._id
      },
      {
        content: 'CSS Grid has been a game-changer for my layouts. Thanks for the comprehensive guide!',
        author: users[3]._id, // tech_guru
        post: posts[2]._id
      },
      {
        content: 'Database design is often overlooked. This article covers the fundamentals perfectly.',
        author: users[0]._id, // admin
        post: posts[3]._id
      }
    ]);

    console.log('Created comments');

    // Add some likes and bookmarks
    posts[0].likedBy = [users[0]._id, users[2]._id];
    posts[1].likedBy = [users[1]._id, users[2]._id, users[3]._id];
    await Promise.all(posts.map(post => post.save()));

    users[0].bookmarks = [posts[1]._id, posts[2]._id];
    users[1].bookmarks = [posts[0]._id];
    await Promise.all(users.map(user => user.save()));

    console.log('✅ Seed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@blog.com / admin123');
    console.log('User: john@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();