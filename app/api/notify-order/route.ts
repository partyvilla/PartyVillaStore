import { NextResponse } from 'next/server'
import { telegramConfig } from '@/lib/config/env'

export async function POST(request: Request) {
  try {
    const { orderId, customerName, payeeName, upiRef, amount } = await request.json()

    // Validate required fields
    if (!orderId || !customerName || !payeeName || !upiRef || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { botToken, chatId } = telegramConfig

    // Validate environment variables
    if (!botToken || !chatId) {
      return NextResponse.json(
        { error: 'Telegram configuration missing' },
        { status: 500 }
      )
    }

    // Format the message with order details
    const message = `🚨 *New Order Received*
    
📋 *Order Details:*
• Order ID: \`${orderId}\`
• Customer: ${customerName}
• Payee: ${payeeName}
• Amount: ₹${amount}
• UPI Reference: \`${upiRef}\`

💰 Payment completed successfully!`

    // Send message to Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        chat_id: chatId, 
        text: message,
        parse_mode: 'Markdown'
      }),
    })

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.text()
      return NextResponse.json(
        { error: 'Failed to send Telegram notification' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}