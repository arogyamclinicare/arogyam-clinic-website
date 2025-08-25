import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken, requirePatient, requireDoctor } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();
const prisma = new PrismaClient();

// Validation middleware
const validateConsultationBooking = [
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom((value) => {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        throw new Error('Consultation date cannot be in the past');
      }
      
      return true;
    }),
  body('time')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Please provide a consultation time'),
  body('type')
    .isIn(['VIDEO', 'PHONE', 'IN_PERSON'])
    .withMessage('Invalid consultation type'),
  body('symptoms')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Symptoms must be between 10 and 1000 characters'),
  body('isEmergency')
    .optional()
    .isBoolean()
    .withMessage('Emergency flag must be a boolean'),
];

const validateConsultationUpdate = [
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom((value) => {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        throw new Error('Consultation date cannot be in the past');
      }
      
      return true;
    }),
  body('time')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Please provide a consultation time'),
  body('type')
    .optional()
    .isIn(['VIDEO', 'PHONE', 'IN_PERSON'])
    .withMessage('Invalid consultation type'),
  body('symptoms')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Symptoms must be between 10 and 1000 characters'),
  body('status')
    .optional()
    .isIn(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])
    .withMessage('Invalid consultation status'),
];

// Book new consultation
router.post('/', authenticateToken, requirePatient, validateConsultationBooking, asyncHandler(async (req, res) => {
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

  const { date, time, type, symptoms, isEmergency = false } = req.body;

  // Check if user has any conflicting consultations on the same date
  const conflictingConsultation = await prisma.consultation.findFirst({
    where: {
      userId: req.user!.id,
      date: new Date(date),
      status: {
        in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'],
      },
    },
  });

  if (conflictingConsultation) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'You already have a consultation scheduled on this date',
      },
    });
  }

  // Create consultation
  const consultation = await prisma.consultation.create({
    data: {
      userId: req.user!.id,
      date: new Date(date),
      time,
      type,
      symptoms,
      isEmergency,
      status: 'SCHEDULED',
    },
    select: {
      id: true,
      date: true,
      time: true,
      type: true,
      status: true,
      symptoms: true,
      isEmergency: true,
      createdAt: true,
    },
  });

  logger.info(`Consultation booked: ${req.user?.email}`, {
    userId: req.user?.id,
    consultationId: consultation.id,
    date: consultation.date,
    type: consultation.type,
  });

  res.status(201).json({
    success: true,
    message: 'Consultation booked successfully',
    data: { consultation },
  });
}));

// Get all consultations (for doctors/admins)
router.get('/', authenticateToken, requireDoctor, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, type, date, isEmergency } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  // Build where clause
  const where: any = {};
  
  if (status) where.status = status;
  if (type) where.type = type;
  if (isEmergency !== undefined) where.isEmergency = isEmergency === 'true';
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

// Get specific consultation
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const consultation = await prisma.consultation.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          age: true,
          gender: true,
          profile: {
            select: {
              bloodGroup: true,
              allergies: true,
              medicalHistory: true,
              currentMedications: true,
              emergencyContact: true,
            },
          },
        },
      },
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

  // Check if user has permission to view this consultation
  if (req.user!.role === 'PATIENT' && consultation.userId !== req.user!.id) {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Access denied',
      },
    });
  }

  res.json({
    success: true,
    data: { consultation },
  });
}));

// Update consultation
router.put('/:id', authenticateToken, requireDoctor, validateConsultationUpdate, asyncHandler(async (req, res) => {
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
  if (req.body.date !== undefined) updateData.date = new Date(req.body.date);
  if (req.body.time !== undefined) updateData.time = req.body.time;
  if (req.body.type !== undefined) updateData.type = req.body.type;
  if (req.body.symptoms !== undefined) updateData.symptoms = req.body.symptoms;
  if (req.body.status !== undefined) updateData.status = req.body.status;
  if (req.body.prescription !== undefined) updateData.prescription = req.body.prescription;
  if (req.body.doctorNotes !== undefined) updateData.doctorNotes = req.body.doctorNotes;
  if (req.body.followUpDate !== undefined) {
    updateData.followUpDate = req.body.followUpDate ? new Date(req.body.followUpDate) : null;
  }

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

  logger.info(`Consultation updated: ${req.user?.email}`, {
    userId: req.user?.id,
    consultationId: id,
    updatedFields: Object.keys(updateData),
  });

  res.json({
    success: true,
    message: 'Consultation updated successfully',
    data: { consultation: updatedConsultation },
  });
}));

// Cancel consultation
router.patch('/:id/cancel', authenticateToken, requirePatient, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if consultation exists and belongs to user
  const consultation = await prisma.consultation.findFirst({
    where: {
      id,
      userId: req.user!.id,
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

  // Check if consultation can be cancelled
  if (consultation.status === 'COMPLETED' || consultation.status === 'CANCELLED') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Consultation cannot be cancelled',
      },
    });
  }

  // Cancel consultation
  const cancelledConsultation = await prisma.consultation.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });

  logger.info(`Consultation cancelled: ${req.user?.email}`, {
    userId: req.user?.id,
    consultationId: id,
  });

  res.json({
    success: true,
    message: 'Consultation cancelled successfully',
    data: { consultation: cancelledConsultation },
  });
}));

// Get consultation statistics
router.get('/stats/overview', authenticateToken, requireDoctor, asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  // Get today's consultations
  const todayConsultations = await prisma.consultation.count({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  // Get pending consultations
  const pendingConsultations = await prisma.consultation.count({
    where: {
      status: {
        in: ['SCHEDULED', 'CONFIRMED'],
      },
    },
  });

  // Get emergency consultations
  const emergencyConsultations = await prisma.consultation.count({
    where: {
      isEmergency: true,
      status: {
        in: ['SCHEDULED', 'CONFIRMED'],
      },
    },
  });

  // Get consultations by type
  const consultationsByType = await prisma.consultation.groupBy({
    by: ['type'],
    _count: {
      type: true,
    },
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  res.json({
    success: true,
    data: {
      todayConsultations,
      pendingConsultations,
      emergencyConsultations,
      consultationsByType: consultationsByType.map(item => ({
        type: item.type,
        count: item._count.type,
      })),
    },
  });
}));

export default router;
