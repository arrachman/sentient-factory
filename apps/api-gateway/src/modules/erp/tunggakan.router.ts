import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';

const router = Router();

/**
 * GET /erp/tunggakan
 * List all arrears/outstanding payments (tunggakan)
 */
router.get('/erp/tunggakan', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement arrears list logic
    res.json({
      success: true,
      data: [],
      message: 'Arrears retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /erp/tunggakan/:id
 * Get single arrears record by ID
 */
router.get('/erp/tunggakan/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // TODO: Implement get arrears by ID logic
    res.json({
      success: true,
      data: null,
      message: `Arrears ${id} retrieved successfully`,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /erp/tunggakan
 * Create new arrears record
 */
router.post('/erp/tunggakan', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement create arrears logic
    res.status(201).json({
      success: true,
      data: req.body,
      message: 'Arrears record created successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /erp/tunggakan/:id
 * Update existing arrears record
 */
router.put('/erp/tunggakan/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // TODO: Implement update arrears logic
    res.json({
      success: true,
      data: { id, ...req.body },
      message: `Arrears ${id} updated successfully`,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /erp/tunggakan/:id
 * Delete arrears record
 */
router.delete('/erp/tunggakan/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // TODO: Implement delete arrears logic
    res.json({
      success: true,
      message: `Arrears ${id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
