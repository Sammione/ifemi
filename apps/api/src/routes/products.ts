import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { store, ProductRecord } from '../store';

const router = Router();

// 1. GET all products (with search & category filtering)
router.get('/', async (req: Request, res: Response): Promise<any> => {
  const { category, search } = req.query;

  try {
    const whereClause: any = {};
    if (category) {
      whereClause.category = {
        name: { equals: String(category), mode: 'insensitive' }
      };
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } }
      ];
    }

    const dbProducts = await prisma.product.findMany({
      where: whereClause,
      include: { images: true, category: true, variants: true }
    });

    if (dbProducts && dbProducts.length > 0) {
      return res.json(dbProducts);
    }
  } catch (error) {
    // Database offline or error, gracefully fallback to store
  }

  let products = store.getAllProducts();

  if (category && String(category).toUpperCase() !== 'ALL') {
    products = products.filter(
      p => p.category.toLowerCase() === String(category).toLowerCase() ||
           p.slug.toLowerCase().includes(String(category).toLowerCase())
    );
  }

  if (search) {
    const q = String(search).toLowerCase();
    products = products.filter(
      p => p.name.toLowerCase().includes(q) ||
           p.description.toLowerCase().includes(q) ||
           p.sku.toLowerCase().includes(q)
    );
  }

  res.json(products);
});

// 2. GET single product by id or slug
router.get('/:idOrSlug', async (req: Request, res: Response): Promise<any> => {
  const idOrSlug = String(req.params.idOrSlug);

  try {
    const dbProduct = await prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }]
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: true,
        variants: true,
        reviews: { where: { status: 'APPROVED' } }
      }
    });

    if (dbProduct) {
      return res.json(dbProduct);
    }
  } catch (error) {
    // Database offline, fallback to store
  }

  const product = store.getProductByIdOrSlug(idOrSlug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

// 3. POST create product (Admin)
router.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      name,
      category,
      price,
      priceGBP,
      salePrice,
      salePriceGBP,
      stock,
      threshold,
      sku,
      image,
      images,
      colors,
      sizes,
      description,
      fabricCare,
      isPublished,
      isFeatured
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, category, and price are required.' });
    }

    const created = store.createProduct({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category,
      price: Number(price),
      priceGBP: priceGBP ? Number(priceGBP) : Math.round(Number(price) / 1600),
      salePrice: salePrice ? Number(salePrice) : null,
      salePriceGBP: salePriceGBP ? Number(salePriceGBP) : null,
      stock: Number(stock) || 0,
      threshold: Number(threshold) || 5,
      sku: sku || `IFEMI-${Date.now().toString().slice(-4)}`,
      image: image || '',
      images: images || (image ? [image] : []),
      colors: colors || ['Midnight Navy'],
      sizes: sizes || ['Standard One-Size'],
      description: description || '',
      fabricCare: fabricCare || 'Gentle care recommended.',
      isPublished: isPublished !== undefined ? isPublished : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false
    });

    res.status(201).json(created);
  } catch (error) {
    console.error('Failed to create product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// 4. PUT update product (Admin)
router.put('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const id = String(req.params.id);
    const updates = req.body;

    if (updates.price) updates.price = Number(updates.price);
    if (updates.priceGBP) updates.priceGBP = Number(updates.priceGBP);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    const updated = store.updateProduct(id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Failed to update product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// 5. DELETE product (Admin)
router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const id = String(req.params.id);
    const deleted = store.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// 6. PATCH adjust product stock (Admin / Order fulfillment)
router.patch('/:id/stock', async (req: Request, res: Response): Promise<any> => {
  try {
    const id = String(req.params.id);
    const { delta } = req.body;

    if (typeof delta !== 'number') {
      return res.status(400).json({ error: 'Delta number is required' });
    }

    const updated = store.adjustProductStock(id, delta);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to adjust stock' });
  }
});

export default router;
