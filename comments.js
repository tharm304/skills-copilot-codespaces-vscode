// Create web server

// Import modules
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const multer = require('multer');
const upload = multer({ dest: 'public/images' });
const { body, validationResult } = require('express-validator');

// Import models
const Comment = require('../models/comment');

// Set routes
router.get('/', (req, res) => {
    res.send('Comments');
});

router.get('/new', (req, res) => {
    res.render('comments/new', {
        title: 'New Comment',
        comment: new Comment(),
        moment
    });
});

router.get('/edit/:id', async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    res.render('comments/edit', {
        title: 'Edit Comment',
        comment: comment,
        moment
    });
});

router.get('/delete/:id', async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    res.render('comments/delete', {
        title: 'Delete Comment',
        comment: comment,
        moment
    });
});

router.get('/:id', async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    res.render('comments/show', {
        title: 'Comment',
        comment: comment,
        moment
    });
});

router.post('/',
    upload.single('image'),
    [
        body('name', 'Name can not be empty').isLength({ min: 1 }),
        body('email', 'Email can not be empty').isLength({ min: 1 }),
        body('content', 'Content can not be empty').isLength({ min: 1 }),
        body('image', 'Image can not be empty').isLength({ min: 1 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            let comment = new Comment({
                name: req.body.name,
                email: req.body.email,
                content: req.body.content,
                image: {
                    data: fs.readFileSync(path.join(__dirname, '../public/images/' + req.file.filename)),
                    contentType: 'image/png'
                }
            });
            try {
                comment = await comment.save();
                res.redirect(`/comments/${comment.id}`);
            } catch (err)