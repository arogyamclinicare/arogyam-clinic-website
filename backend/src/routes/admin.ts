import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();
const prisma = new PrismaClient();

// Validation middleware
const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  body('age')
    .optional()
    .isInt({ min: 1, max: 120 })
    .withMessage('Age must be between 1 and 120'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address must be less than 200 characters'),
  body('role')
    .optional()
    .isIn(['PATIENT', 'DOCTOR', 'STAFF'])
    .withMessage('Invalid role'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('isVerified')
    .optional()
    .isBoolean()
    .withMessage('isVerified must be a boolean'),
];

const validateConsultationUpdate = [
  body('status')
    .isIn(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])
    .withMessage('Invalid consultation status'),
  body('prescription')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Prescription must be less than 2000 characters'),
  body('doctorNotes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Doctor notes must be less than 2000 characters'),
  body('followUpDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid follow-up date'),
];

// Get all users (with pagination and filtering)
router.get('/users', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, isActive, isVerified, search } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  // Build where clause
  const where: any = {};
  
  if (role) where.role = role;
  if (isActive !== undefined) where.isActive = isActive === 'true';
  if (isVerified !== undefined) where.isVerified = isVerified === 'true';
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } },
      { phone: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  // Get users with pagination
  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      age: true,
      gender: true,
      role: true,
      isActive: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          consultations: true,
        },
      },
    },
  });

  // Get total count
  const total = await prisma.user.count({ where });

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    },
  });
}));

// Get specific user
router.get('/users/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      consultations: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          date: true,
          time: true,
          type: true,
          status: true,
          symptoms: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          consultations: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'User not found',
      },
    });
  }

  res.json({
    success: true,
    data: { user },
  });
}));

// Update user
router.put('/users/:id', authenticateToken, requireAdmin, validateUserUpdate, asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: errors.array(),
      },
    });
  }

  const { id } = req.params;
  const updateData: any = {};

  // Only include fields that are provided
  if (req.body.name !== undefined) updateData.name = req.body.name;
  if (req.body.phone !== undefined) updateData.phone = req.body.phone;
  if (req.body.age !== undefined) updateData.age = req.body.age ? parseInt(req.body.age) : null;
  if (req.body.gender !== undefined) updateData.gender = req.body.gender;
  if (req.body.address !== undefined) updateData.address = req.body.address;
  if (req.body.role !== undefined) updateData.role = req.body.role;
  if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive;
  if (req.body.isVerified !== undefined) updateData.isVerified = req.body.isVerified;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'User not found',
      },
    });
  }

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      age: true,
      gender: true,
      role: true,
      isActive: true,
      isVerified: true,
      updatedAt: true,
    },
  });

  logger.info(`User updated by admin: ${req.user?.email}`, {
    adminId: req.user?.id,
    userId: id,
    updatedFields: Object.keys(updateData),
  });

  res.json({
    success: true,
    message: 'User updated successfully',
    data: { user: updatedUser },
  });
}));

// Deactivate/activate user
router.patch('/users/:id/toggle-status', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'User not found',
      },
    });
  }

  // Toggle status
  const newStatus = !existingUser.isActive;
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { isActive: newStatus },
    select: {
      id: true,
      email: true,
      name: true,
      isActive: true,
      updatedAt: true,
    },
  });

  logger.info(`User status toggled by admin: ${req.user?.email}`, {
    adminId: req.user?.id,
    userId: id,
    newStatus,
  });

  res.json({
    success: true,
    message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
    data: { user: updatedUser },
  });
}));

// Get all consultations (admin view)
router.get('/consultations', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, type, date, isEmergency, userId } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  // Build where clause
  const where: any = {};
  
  if (status) where.status = status;
  if (type) where.type = type;
  if (isEmergency !== undefined) where.isEmergency = isEmergency === 'true';
  if (userId) where.userId = userId;
  if (date) {
    const searchDate = new Date(date as string);
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    where.date = {
      gte: searchDate,
      lt: nextDay,
    };
  }

  // Get consultations with pagination
  const consultations = await prisma.consultation.findMany({
    where,
    orderBy: [
      { isEmergency: 'desc' },
      { date: 'asc' },
      { time: 'asc' },
    ],
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          age: true,
          gender: true,
        },
      },
    },
  });

  // Get total count
  const total = await prisma.consultation.count({ where });

  res.json({
    success: true,
    data: {
      consultations,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    },
  });
}));

// Update consultation status
router.patch('/consultations/:id/status', authenticateToken, requireAdmin, validateConsultationUpdate, asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: errors.array(),
      },
    });
  }

  const { id } = req.params;
  const { status, prescription, doctorNotes, followUpDate } = req.body;

  // Check if consultation exists
  const existingConsultation = await prisma.consultation.findUnique({
    where: { id },
  });

  if (!existingConsultation) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Consultation not found',
      },
    });
  }

  // Update consultation
  const updateData: any = { status };
  if (prescription !== undefined) updateData.prescription = prescription;
  if (doctorNotes !== undefined) updateData.doctorNotes = doctorNotes;
  if (followUpDate !== undefined) {
    updateData.followUpDate = followUpDate ? new Date(followUpDate) : null;
  }

  const updatedConsultation = await prisma.consultation.update({
    where: { id },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  logger.info(`Consultation status updated by admin: ${req.user?.email}`, {
    adminId: req.user?.id,
    consultationId: id,
    newStatus: status,
  });

  res.json({
    success: true,
    message: 'Consultation status updated successfully',
    data: { consultation: updatedConsultation },
  });
}));

// Get system statistics
router.get('/stats', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  // User statistics
  const totalUsers = await prisma.user.count();
  const activeUsers = await prisma.user.count({ where: { isActive: true } });
  const verifiedUsers = await prisma.user.count({ where: { isVerified: true } });
  const newUsersToday = await prisma.user.count({
    where: { createdAt: { gte: startOfDay } },
  });
  const newUsersThisMonth = await prisma.user.count({
    where: { createdAt: { gte: startOfMonth } },
  });

  // Consultation statistics
  const totalConsultations = await prisma.consultation.count();
  const todayConsultations = await prisma.consultation.count({
    where: { date: { gte: startOfDay } },
  });
  const thisMonthConsultations = await prisma.consultation.count({
    where: { date: { gte: startOfMonth } },
  });
  const pendingConsultations = await prisma.consultation.count({
    where: { status: { in: ['SCHEDULED', 'CONFIRMED'] } },
  });
  const emergencyConsultations = await prisma.consultation.count({
    where: { isEmergency: true },
  });

  // User role distribution
  const usersByRole = await prisma.user.groupBy({
    by: ['role'],
    _count: { role: true },
  });

  // Consultation status distribution
  const consultationsByStatus = await prisma.consultation.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  // Consultation type distribution
  const consultationsByType = await prisma.consultation.groupBy({
    by: ['type'],
    _count: { type: true },
  });

  res.json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        active: activeUsers,
        verified: verifiedUsers,
        newToday: newUsersToday,
        newThisMonth: newUsersThisMonth,
        byRole: usersByRole.map(item => ({
          role: item.role,
          count: item._count.role,
        })),
      },
      consultations: {
        total: totalConsultations,
        today: todayConsultations,
        thisMonth: thisMonthConsultations,
        pending: pendingConsultations,
        emergency: emergencyConsultations,
        byStatus: consultationsByStatus.map(item => ({
          status: item.status,
          count: item._count.status,
        })),
        byType: consultationsByType.map(item => ({
          type: item.type,
          count: item._count.type,
        })),
      },
    },
  });
}));

export default router;
