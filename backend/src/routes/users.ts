import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken, requirePatient } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();
const prisma = new PrismaClient();

// Validation middleware
const validateProfileUpdate = [
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
];

// Get user profile
router.get('/profile', authenticateToken, requirePatient, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      age: true,
      gender: true,
      address: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      profile: {
        select: {
          id: true,
          bloodGroup: true,
          allergies: true,
          medicalHistory: true,
          currentMedications: true,
          emergencyContact: true,
          insuranceInfo: true,
          createdAt: true,
          updatedAt: true,
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

// Update user profile
router.put('/profile', authenticateToken, requirePatient, validateProfileUpdate, asyncHandler(async (req, res) => {
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

  const { name, phone, age, gender, address } = req.body;

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      name: name || undefined,
      phone: phone || undefined,
      age: age ? parseInt(age) : undefined,
      gender: gender || undefined,
      address: address || undefined,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      age: true,
      gender: true,
      address: true,
      role: true,
      updatedAt: true,
    },
  });

  logger.info(`User profile updated: ${req.user?.email}`, {
    userId: req.user?.id,
    updatedFields: Object.keys(req.body),
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user: updatedUser },
  });
}));

// Update patient profile (medical information)
router.put('/profile/medical', authenticateToken, requirePatient, [
  body('bloodGroup')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Invalid blood group'),
  body('allergies')
    .optional()
    .isArray()
    .withMessage('Allergies must be an array'),
  body('currentMedications')
    .optional()
    .isArray()
    .withMessage('Current medications must be an array'),
  body('emergencyContact')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid emergency contact number'),
  body('insuranceInfo')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Insurance information must be less than 200 characters'),
], asyncHandler(async (req, res) => {
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

  const { bloodGroup, allergies, medicalHistory, currentMedications, emergencyContact, insuranceInfo } = req.body;

  // Update or create patient profile
  const patientProfile = await prisma.patientProfile.upsert({
    where: { userId: req.user!.id },
    update: {
      bloodGroup: bloodGroup || undefined,
      allergies: allergies || undefined,
      medicalHistory: medicalHistory || undefined,
      currentMedications: currentMedications || undefined,
      emergencyContact: emergencyContact || undefined,
      insuranceInfo: insuranceInfo || undefined,
    },
    create: {
      userId: req.user!.id,
      bloodGroup: bloodGroup || undefined,
      allergies: allergies || undefined,
      medicalHistory: medicalHistory || undefined,
      currentMedications: currentMedications || undefined,
      emergencyContact: emergencyContact || undefined,
      insuranceInfo: insuranceInfo || undefined,
    },
    select: {
      id: true,
      bloodGroup: true,
      allergies: true,
      medicalHistory: true,
      currentMedications: true,
      emergencyContact: true,
      insuranceInfo: true,
      updatedAt: true,
    },
  });

  logger.info(`Patient medical profile updated: ${req.user?.email}`, {
    userId: req.user?.id,
    updatedFields: Object.keys(req.body),
  });

  res.json({
    success: true,
    message: 'Medical profile updated successfully',
    data: { profile: patientProfile },
  });
}));

// Get user consultations
router.get('/consultations', authenticateToken, requirePatient, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  // Build where clause
  const where: any = { userId: req.user!.id };
  if (status) {
    where.status = status;
  }

  // Get consultations with pagination
  const consultations = await prisma.consultation.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
    select: {
      id: true,
      date: true,
      time: true,
      type: true,
      status: true,
      symptoms: true,
      prescription: true,
      doctorNotes: true,
      followUpDate: true,
      isEmergency: true,
      createdAt: true,
      updatedAt: true,
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

// Get specific consultation
router.get('/consultations/:id', authenticateToken, requirePatient, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const consultation = await prisma.consultation.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
    select: {
      id: true,
      date: true,
      time: true,
      type: true,
      status: true,
      symptoms: true,
      prescription: true,
      doctorNotes: true,
      followUpDate: true,
      isEmergency: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!consultation) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Consultation not found',
      },
    });
  }

  res.json({
    success: true,
    data: { consultation },
  });
}));

// Delete user account
router.delete('/account', authenticateToken, requirePatient, asyncHandler(async (req, res) => {
  // Soft delete - mark as inactive instead of actually deleting
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { isActive: false },
  });

  logger.info(`User account deactivated: ${req.user?.email}`, {
    userId: req.user?.id,
    ip: req.ip,
  });

  res.json({
    success: true,
    message: 'Account deactivated successfully',
  });
}));

export default router;
