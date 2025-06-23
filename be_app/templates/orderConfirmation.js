const createEmailTemplate = (orderDetails) => {
  const { cartItems, shippingCost, total, customerEmail, customerDetails } =
    orderDetails;

  return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Grazie per il tuo ordine!</h2>
            <p>Gentile ${customerDetails.firstName} ${
    customerDetails.lastName
  },</p>
            <p>Il tuo ordine è stato confermato ed è in fase di elaborazione.</p>
            
            <h3>Indirizzo di Spedizione:</h3>
            <p style="margin-bottom: 20px;">
                ${customerDetails.firstName} ${customerDetails.lastName}<br>
                ${customerDetails.address}<br>
                ${customerDetails.city}, ${customerDetails.zip_code}
            </p>
            
            <h3>Riepilogo Ordine:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="background-color: #f8f9fa;">
                    <th style="padding: 10px; text-align: left;">Prodotto</th>
                    <th style="padding: 10px; text-align: right;">Quantità</th>
                    <th style="padding: 10px; text-align: right;">Prezzo</th>
                </tr>
                ${cartItems
                  .map(
                    (item) => `
                    <tr>
                        <td style="padding: 10px;">${item.nome}</td>
                        <td style="padding: 10px; text-align: right;">${
                          item.qty
                        }</td>
                        <td style="padding: 10px; text-align: right;">€${(
                          Number(item.prezzo) * item.qty
                        ).toFixed(2)}</td>
                    </tr>
                `
                  )
                  .join("")}
                <tr style="border-top: 2px solid #dee2e6;">
                    <td colspan="2" style="padding: 10px;"><strong>Spedizione</strong></td>
                    <td style="padding: 10px; text-align: right;">€${shippingCost.toFixed(
                      2
                    )}</td>
                </tr>
                <tr>
                    <td colspan="2" style="padding: 10px;"><strong>Totale</strong></td>
                    <td style="padding: 10px; text-align: right;"><strong>€${total.toFixed(
                      2
                    )}</strong></td>
                </tr>
            </table>
            
            <p style="margin-top: 20px;">Grazie per aver scelto Bool Wines!</p>
        </div>
    `;
};

module.exports = createEmailTemplate;
