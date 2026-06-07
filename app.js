const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const jwt=require('jsonwebtoken')

// Database connection
mongoose.connect('mongodb://localhost:27017/user', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Schema of category
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);  // model 

// Schema of post
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    img: { type: String, required: true },
    categoryId: { type: String, required: true },
    description: { type: String, required: true }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

// Schema of user
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// ------------------ CATEGORY ROUTES for controller (CURD) ------------------

// Insert new category
app.post('/category', async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read all categories
app.get('/category', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete category by ID
app.delete('/category/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update category
app.put('/category/:id', async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------ POST ROUTES for controller (CURD)  ------------------

// Insert new post (Correcting the model usage)
app.post('/post', async (req, res) => {
    try {
        const newPost = new Post(req.body);
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read all posts
app.get('/post', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete post by ID
app.delete('/post/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update post
app.put('/post/:id', async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// post select by categoryId
app.get('/post/category/:cid', async(req, res)=>{
    const posts=await Post.find({categoryId: req.params.cid})
    res.json(posts)
})

// post by Id
app.get('/post/:id', async(req, res)=>{
    const posts1=await Post.findById(req.params.id)
   res.json(posts1)
})





// ------------------ USER ROUTES for controller (CURD)  ------------------

// Insert new user (Correcting the model usage)
app.post('/user', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read all users
app.get('/user', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user by ID
app.delete('/user/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user
app.put('/user/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// this a login system

// app.post('/login', async (req, res)=>{
//     const {username, password}=req.body;
//     const user=await User.findOne({username})
//     if(!user || user.password !==password)
//     {
//         return res.status(401).json({error: 'login failed'})
//     }
//     const token =jwt.sign({useId: user._id}, 'fb1ce93ce24d94c003767c1184b06171af48ac363fce6c16b957d301424c61c3',{
//         expiresIn:'1h'
//     })
//     res.status(200).json({user:{_id: User._id, username: User.username}, token})
// })
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // HARD-CODED CREDENTIALS (DEV ONLY)
  if (username !== 'admin' || password !== 'admin123') {
    return res.status(401).json({ error: 'login failed' });
  }

  const token = jwt.sign(
    { userId: 'admin-id-123' },
    'fb1ce93ce24d94c003767c1184b06171af48ac363fce6c16b957d301424c61c3',
    { expiresIn: '1h' }
  );

  res.status(200).json({
    user: {
      _id: 'admin-id-123',
      username: 'admin'
    },
    token
  });
});




app.listen(3000, () => console.log('Bro server kam gardai xa'));
