/**
 * Email service configuration and utilities
 * Handles email notifications for order confirmations and status updates
 */
import nodemailer from 'nodemailer'
import { emailConfig } from '@/lib/config/env'

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  if (!emailConfig.user || !emailConfig.password) {
    return null
  }

  return nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailConfig.user,
      pass: emailConfig.password,
    },
  })
}

// Email templates
export const emailTemplates = {
  orderConfirmation: (data: {
    customerName: string
    orderId: string
    items: Array<{ name: string; qty: number; price: number; variant?: string }>
    totalPrice: number
    deliveryAddress: any
  }) => ({
    subject: `Order Confirmation - #${data.orderId.substring(0, 8)}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; }
            .header { background-color: #6366f1; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 20px; }
            .order-details { background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .item { border-bottom: 1px solid #e2e8f0; padding: 10px 0; }
            .item:last-child { border-bottom: none; }
            .total { font-weight: bold; font-size: 18px; color: #6366f1; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
            .status-badge { background-color: #fbbf24; color: #92400e; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Order Confirmed!</h1>
              <p>Thank you for your order, ${data.customerName}</p>
            </div>
            
            <div class="content">
              <h2>Order Details</h2>
              <div class="order-details">
                <p><strong>Order ID:</strong> #${data.orderId.substring(0, 8)}</p>
                <p><strong>Status:</strong> <span class="status-badge">Pending</span></p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>

              <h3>Items Ordered</h3>
              ${data.items.map(item => `
                <div class="item">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <strong>${item.name}</strong>
                      ${item.variant ? `<br><small style="color: #64748b;">Variant: ${item.variant}</small>` : ''}
                      <br><small>Quantity: ${item.qty}</small>
                    </div>
                    <div class="total">₹${(item.price * item.qty).toFixed(2)}</div>
                  </div>
                </div>
              `).join('')}
              
              <div style="text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #6366f1;">
                <div class="total">Total: ₹${data.totalPrice.toFixed(2)}</div>
              </div>

              ${data.deliveryAddress ? `
                <h3>Delivery Address</h3>
                <div class="order-details">
                  <p>${formatAddressForEmail(data.deliveryAddress)}</p>
                </div>
              ` : ''}

              <div style="background-color: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #0369a1;">What happens next?</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>We'll verify your payment details</li>
                  <li>Your order will be processed and prepared</li>
                  <li>You'll receive updates via email as your order status changes</li>
                  <li>We'll notify you when your order is ready for delivery</li>
                </ul>
              </div>
            </div>

            <div class="footer">
              <p>Thank you for choosing Party Villa!</p>
              <p>If you have any questions, please contact our support team.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  statusUpdate: (data: {
    customerName: string
    orderId: string
    oldStatus: string
    newStatus: string
    items: Array<{ name: string; qty: number; price: number; variant?: string }>
    totalPrice: number
  }) => ({
    subject: `Order Update - #${data.orderId.substring(0, 8)} is now ${data.newStatus}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; }
            .header { background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 20px; }
            .status-update { background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .order-details { background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .item { border-bottom: 1px solid #e2e8f0; padding: 10px 0; }
            .item:last-child { border-bottom: none; }
            .total { font-weight: bold; font-size: 18px; color: #6366f1; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
            .status-badge { padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; }
            .status-pending { background-color: #fef3c7; color: #92400e; }
            .status-confirmed { background-color: #dbeafe; color: #1e40af; }
            .status-delivered { background-color: #d1fae5; color: #065f46; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📦 Order Status Update</h1>
              <p>Hi ${data.customerName}, your order has been updated!</p>
            </div>
            
            <div class="content">
              <div class="status-update">
                <h2 style="margin-top: 0;">Status Changed</h2>
                <p>Your order <strong>#${data.orderId.substring(0, 8)}</strong> status has been updated from:</p>
                <div style="display: flex; align-items: center; gap: 20px; margin: 15px 0;">
                  <span class="status-badge status-${data.oldStatus}">${data.oldStatus.charAt(0).toUpperCase() + data.oldStatus.slice(1)}</span>
                  <span style="font-size: 18px;">→</span>
                  <span class="status-badge status-${data.newStatus}">${data.newStatus.charAt(0).toUpperCase() + data.newStatus.slice(1)}</span>
                </div>
              </div>

              <h3>Order Summary</h3>
              <div class="order-details">
                <p><strong>Order ID:</strong> #${data.orderId.substring(0, 8)}</p>
                <p><strong>Total Amount:</strong> ₹${data.totalPrice.toFixed(2)}</p>
                <p><strong>Items:</strong> ${data.items.length} item(s)</p>
              </div>

              ${getStatusMessage(data.newStatus)}
            </div>

            <div class="footer">
              <p>Thank you for choosing Party Villa!</p>
              <p>Track your order anytime by logging into your account.</p>
            </div>
          </div>
        </body>
      </html>
    `
  })
}

// Helper function to format address for email
function formatAddressForEmail(address: any): string {
  if (!address) return 'No address provided'
  
  const parts = []
  if (address.street || address.address) parts.push(address.street || address.address)
  if (address.city) parts.push(address.city)
  if (address.state) parts.push(address.state)
  if (address.postal_code || address.pincode) parts.push(address.postal_code || address.pincode)
  if (address.country) parts.push(address.country)
  
  return parts.length > 0 ? parts.join(', ') : 'No address provided'
}

// Helper function to get status-specific message
function getStatusMessage(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return `
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #92400e;">⏳ Order Pending</h3>
          <p>We're currently processing your order and verifying payment details. You'll receive another update once it's confirmed.</p>
        </div>
      `
    case 'confirmed':
      return `
        <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">✅ Order Confirmed</h3>
          <p>Great news! Your order has been confirmed and is being prepared for delivery. We'll notify you once it's out for delivery.</p>
        </div>
      `
    case 'delivered':
      return `
        <div style="background-color: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #065f46;">🎉 Order Delivered</h3>
          <p>Your order has been successfully delivered! We hope you enjoy your party supplies. Thank you for choosing Party Villa!</p>
        </div>
      `
    default:
      return ''
  }
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(
  customerEmail: string,
  orderData: {
    customerName: string
    orderId: string
    items: Array<{ name: string; qty: number; price: number; variant?: string }>
    totalPrice: number
    deliveryAddress: any
  }
) {
  const transporter = createTransporter()
  
  if (!transporter) {
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const template = emailTemplates.orderConfirmation(orderData)
        
    const mailOptions = {
      from: emailConfig.fromEmail,
      to: customerEmail,
      subject: template.subject,
      html: template.html
    }

    const info = await transporter.sendMail(mailOptions)
    
    return { success: true, messageId: info.messageId }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Send order status update email
export async function sendOrderStatusUpdateEmail(
  customerEmail: string,
  orderData: {
    customerName: string
    orderId: string
    oldStatus: string
    newStatus: string
    items: Array<{ name: string; qty: number; price: number; variant?: string }>
    totalPrice: number
  }
) {
  const transporter = createTransporter()
  
  if (!transporter) {
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const template = emailTemplates.statusUpdate(orderData)
    
    const mailOptions = {
      from: emailConfig.fromEmail,
      to: customerEmail,
      subject: template.subject,
      html: template.html
    }

    const info = await transporter.sendMail(mailOptions)
    
    return { success: true, messageId: info.messageId }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}