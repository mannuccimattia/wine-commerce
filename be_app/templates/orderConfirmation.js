const createEmailTemplate = (orderDetails) => {
  const { cartItems, shippingCost, total, customerEmail, customerDetails } =
    orderDetails;

  return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Thank you for your order!</h2>
            <p>Dear ${customerDetails.firstName} ${
    customerDetails.lastName
  },</p>
            <p>Your order has been confirmed and is being processed.</p>
            
            <h3>Shipping Address:</h3>
            <p style="margin-bottom: 20px;">
                ${customerDetails.firstName} ${customerDetails.lastName}<br>
                ${customerDetails.address}<br>
                ${customerDetails.city}, ${customerDetails.zip_code}
            </p>
            
            <h3>Order Summary:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="background-color: #f8f9fa;">
                    <th style="padding: 10px; text-align: left;">Product</th>
                    <th style="padding: 10px; text-align: right;">Quantity</th>
                    <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
                ${cartItems
                  .map(
                    (item) => `
                    <tr>
                        <td style="padding: 10px;">${item.name}</td>
                        <td style="padding: 10px; text-align: right;">
                          ${item.qty}
                        </td>
                        <td style="padding: 10px; text-align: right;">€${(
                          Number(item.prezzo) * item.qty
                        ).toFixed(2)}</td>
                    </tr>
                `
                  )
                  .join("")}
                <tr style="border-top: 2px solid #dee2e6;">
                    <td colspan="2" style="padding: 10px;"><strong>Shipping</strong></td>
                    <td style="padding: 10px; text-align: right;">€${shippingCost.toFixed(
                      2
                    )}</td>
                </tr>
                <tr>
                    <td colspan="2" style="padding: 10px;"><strong>Total</strong></td>
                    <td style="padding: 10px; text-align: right;"><strong>€${total.toFixed(
                      2
                    )}</strong></td>
                </tr>
            </table>
            
            <p style="margin-top: 20px;">Thank you for choosing Bool Wines!</p>
        </div>
    `;
};

module.exports = createEmailTemplate;
