import User from '../models/User.js';
import Chat from '../models/Chat.js';
import DiseaseReport from '../models/DiseaseReport.js';
import CropRecommendation from '../models/CropRecommendation.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/user/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalChats = await Chat.countDocuments();
    const totalDiseaseReports = await DiseaseReport.countDocuments();
    const totalCropRecs = await CropRecommendation.countDocuments();

    res.json({
      totalUsers,
      totalChats,
      totalDiseaseReports,
      totalCropRecs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getUsers, deleteUser, getDashboardStats };
