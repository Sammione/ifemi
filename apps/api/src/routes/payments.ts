import { Router, Request, Response } from 'express';
import { store } from '../store';

const router = Router();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_mock_paystack_key';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_stripe_key';

// 1. Paystack: Initialize Payment
router.post('/paystack/initialize', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, amount, currency = 'NGN', metadata } = req.body;

    if (!email || !amount) {
      return res.status(400).json({ error: 'Email and amount are required' });
    }

    const reference = `pst_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    // In live mode with real PAYSTACK_SECRET_KEY, you would call https://api.paystack.co/transaction/initialize
    // We provide realistic initialization response
    const authorization_url = `https://checkout.paystack.com/${reference}`;

    res.json({
      status: true,
      message: 'Authorization URL created',
      data: {
        authorization_url,
        access_code: `code_${Date.now()}`,
        reference
      }
    });
  } catch (error) {
    console.error('Paystack initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize Paystack payment' });
  }
});

// 2. Paystack: Verify Payment
router.post('/paystack/verify', async (req: Request, res: Response): Promise<any> => {
  try {
    const { reference, orderNumber } = req.body;

    if (!reference) {
      return res.status(400).json({ error: 'Reference is required' });
    }

    // In test / simulation or live mode, acknowledge success
    if (orderNumber) {
      store.updateOrderStatus(orderNumber, 'CONFIRMED');
    }

    res.json({
      status: true,
      message: 'Verification successful',
      data: {
        status: 'success',
        reference,
        gateway_response: 'Successful'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// 3. Stripe: Create Payment Intent (GBP / Cross-border)
router.post('/stripe/create-intent', async (req: Request, res: Response): Promise<any> => {
  try {
    const { amount, currency = 'gbp', orderId } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const clientSecret = `pi_mock_${Date.now()}_secret_${Math.floor(Math.random() * 100000)}`;

    res.json({
      clientSecret,
      currency: currency.toLowerCase(),
      amount
    });
  } catch (error) {
    console.error('Stripe intent error:', error);
    res.status(500).json({ error: 'Failed to create Stripe payment intent' });
  }
});

export default router;
