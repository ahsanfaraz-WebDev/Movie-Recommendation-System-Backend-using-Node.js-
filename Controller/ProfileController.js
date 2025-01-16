// Controllers/ProfileController.js
const Profile = require('../Model/Profile');
const mongoose = require('mongoose');

const addProfile = async (req, res) => {
  const { name, role, biography, filmography, awards, dateOfBirth, nationality, knownFor, photoUrl } = req.body;
  
  try {
    const newProfile = new Profile({ name, role, biography, filmography, awards, dateOfBirth, nationality, knownFor, photoUrl });
    await newProfile.save();
    res.status(201).json({ message: 'Profile added successfully', profile: newProfile });
  } catch (err) {
    console.error('Error adding profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const profileId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(profileId)) {
      return res.status(400).json({ message: 'Invalid profile ID format' });
    }
    
    const updatedProfile = await Profile.findByIdAndUpdate(
      profileId,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.status(200).json(updatedProfile);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const profileId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(profileId)) {
      return res.status(400).json({ message: 'Invalid profile ID format' });
    }
    
    const profile = await Profile.findByIdAndDelete(profileId);
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (err) {
    console.error('Error deleting profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addProfile,
  updateProfile,
  deleteProfile,
};
