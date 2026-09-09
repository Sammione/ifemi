import { Router, Request, Response } from 'express';
import { store } from '../store';

const router = Router();

// GET all categories
router.get('/', (req: Request, res: Response) => {
  const categories = store.getAllCategories();
  res.json(categories);
});

// POST create category
router.post('/', (req: Request, res: Response): any => {
  const { name, image, featured } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const created = store.createCategory({
    name,
    slug,
    image: image || '/images/products/kaftan-1.jpg',
    productsCount: 0,
    featured: Boolean(featured)
  });

  res.status(201).json(created);
});

// DELETE category
router.delete('/:id', (req: Request, res: Response): any => {
  const id = String(req.params.id);
  const deleted = store.deleteCategory(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.json({ success: true, message: 'Category deleted' });
});

export default router;
