import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { store, OrderRecord } from '../store';

const router = Router();

// 1. GET all orders (for Admin backoffice)
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const dbOrders = await prisma.order.findMany({
      include: {
        items: true,
        user: true,
        shippingAddress: true
      },
      orderBy: { createdAt: 'desc' }
    });

    if (dbOrders && dbOrders.length > 0) {
      return res.json(dbOrders);
    }
  } catch (error) {
    // Fallback to store
  }

  const { status, search } = req.query;
  let orders = store.getAllOrders();

  if (status && String(status).toUpperCase() !== 'ALL') {
    orders = orders.filter(o => o.orderStatus === String(status).toUpperCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    orders = orders.filter(
      o => o.orderNumber.toLowerCase().includes(q) ||
           o.customerName.toLowerCase().includes(q) ||
           o.email.toLowerCase().includes(q) ||
           (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
    );
  }

  res.json(orders);
});

// 2. GET single order by id or orderNumber
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
  const id = String(req.params.id);

  try {
    const dbOrder = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }]
      },
      include: {
        items: true,
        user: true,
        shippingAddress: true
      }
    });

    if (dbOrder) {
      return res.json(dbOrder);
    }
  } catch (error) {
    // Fallback to store
  }

  const order = store.getOrderById(id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(order);
});

// 3. POST create Order (Checkout)
router.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      userId,
      cartItems = [],
      shippingAddress,
      billingAddress,
      email,
      phone,
      currency = 'NGN',
      shippingRegion = 'NIGERIA'
    } = req.body;

    // Delivery fee
    let deliveryFee = 0;
    if (currency === 'GBP') {
      deliveryFee = shippingRegion === 'UK' ? 6.50 : 15.00;
    } else {
      deliveryFee = shippingRegion === 'NIGERIA' ? 3500 : 12000;
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      subtotal += price * quantity;
      orderItems.push({
        productId: item.productId || item.id || '',
        name: item.name || 'Artisanal Piece',
        quantity,
        price,
        size: item.size,
        color: item.color,
        sku: item.sku
      });
    }

    const totalAmount = subtotal + deliveryFee;
    const prefix = currency === 'GBP' ? 'IFEMI-UK' : 'IFEMI-NG';
    const orderNumber = `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`;

    const customerName = shippingAddress?.fullName ||
      (shippingAddress?.firstName ? `${shippingAddress.firstName} ${shippingAddress.lastName || ''}`.trim() : 'Guest Client');

    const newOrder = store.createOrder({
      orderNumber,
      userId: userId || null,
      customerName,
      email: email || shippingAddress?.email || 'guest@example.com',
      phone: phone || shippingAddress?.phone || '',
      currency,
      subtotal,
      deliveryFee,
      totalAmount,
      paymentStatus: 'PAID',
      orderStatus: 'CONFIRMED',
      deliveryStatus: `Order confirmed. Preparing dispatch to ${shippingAddress?.city || 'destination'}.`,
      shippingRegion,
      shippingAddress: {
        fullName: customerName,
        address: shippingAddress?.address || '',
        city: shippingAddress?.city || '',
        state: shippingAddress?.state || '',
        phone: shippingAddress?.phone || phone || '',
        country: shippingAddress?.country || (shippingRegion === 'UK' ? 'United Kingdom' : 'Nigeria'),
        postalCode: shippingAddress?.postalCode
      },
      items: orderItems,
      courier: shippingRegion === 'UK' ? 'Royal Mail Tracked 24' : 'GIG Logistics Express'
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(500).json({ error: 'Failed to process order' });
  }
});

// 4. PATCH update order status (Admin)
router.patch('/:id/status', async (req: Request, res: Response): Promise<any> => {
  try {
    const id = String(req.params.id);
    const { status, courier, trackingNumber } = req.body;

    const updated = store.updateOrderStatus(id, status, courier, trackingNumber);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Failed to update order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
