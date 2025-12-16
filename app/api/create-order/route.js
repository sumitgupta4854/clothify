import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { amount, currency = 'INR', receipt, notes } = await request.json();

    const options = {
      amount: amount * 100, // Razorpay expects amount in paisa
      currency,
      receipt,
      notes,
    };

    const order = await razorpay.orders.create(options);

    return Response.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return Response.json({ error: 'Failed to create order' }, { status: 500 });
  }
}