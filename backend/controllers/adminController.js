import User from "../models/userModel.js";
import Resume from "../models/resumeModel.js";
import mongoose from "mongoose";

// Get admin dashboard statistics
export const getAdminStats = async (req, res) => {
  try {
    // Total users count
    const totalUsers = await User.countDocuments();
    
    // Total resumes count
    const totalResumes = await Resume.countDocuments();
    
    // Resumes created per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const resumesByDay = await Resume.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    // Fill in missing days with 0
    const allDates = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const existing = resumesByDay.find(item => item.date === dateStr);
      allDates.push({
        date: dateStr,
        count: existing ? existing.count : 0
      });
    }

    res.status(200).json({
      totalUsers,
      totalResumes,
      resumesByDay: allDates,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({
      message: "Failed to fetch admin statistics",
      error: error.message,
    });
  }
};

