// Controllers/NewsController.js
const News = require('../Model/News');

// Create a new news article
const createNews = async (req, res) => {
  const { title, content, category, imageUrl } = req.body;
  const author = req.userId;

  try {
    const newNews = new News({
      title,
      content,
      category,
      imageUrl,
      author
    });

    await newNews.save();
    res.status(201).json({ message: 'News article created successfully', news: newNews });
  } catch (err) {
    console.error('Error creating news article:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all news articles
const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ datePublished: -1 });
    res.status(200).json(news);
  } catch (err) {
    console.error('Error fetching news articles:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single news article by ID
const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }
    res.status(200).json(news);
  } catch (err) {
    console.error('Error fetching news article:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a news article
const updateNews = async (req, res) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedNews) {
      return res.status(404).json({ message: 'News article not found' });
    }
    res.status(200).json({ message: 'News article updated', news: updatedNews });
  } catch (err) {
    console.error('Error updating news article:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a news article
const deleteNews = async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews) {
      return res.status(404).json({ message: 'News article not found' });
    }
    res.status(200).json({ message: 'News article deleted' });
  } catch (err) {
    console.error('Error deleting news article:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
};
