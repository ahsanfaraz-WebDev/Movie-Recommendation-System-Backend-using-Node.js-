const mongoose = require('mongoose');


const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    reminderDate: Date,
    isRead: { type: Boolean, default: false },
  });

 module.exports = mongoose.model('Notification', notificationSchema);
