const createEmailTemplate = (orderDetails) => {
    const { cartItems, shippingCost, total, customerEmail } = orderDetails;

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Grazie per il tuo ordine!</h2>
            <p>Gentile cliente,</p>
            <p>Il tuo ordine è stato confermato ed è in fase di elaborazione.</p>
            
            <h3>Riepilogo Ordine:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="background-color: #f8f9fa;">
                    <th style="padding: 10px; text-align: left;">Prodotto</th>
                    <th style="padding: 10px; text-align: right;">Quantità</th>
                    <th style="padding: 10px; text-align: right;">Prezzo</th>
                </tr>
                ${cartItems.map(item => `
                    <tr>
                        <td style="padding: 10px;">${item.nome}</td>
                        <td style="padding: 10px; text-align: right;">${item.qty}</td>
                        <td style="padding: 10px; text-align: right;">€${(item.prezzo * item.qty).toFixed(2)}</td>
                    </tr>
                `).join('')}
                <tr style="border-top: 2px solid #dee2e6;">
                    <td colspan="2" style="padding: 10px;"><strong>Spedizione</strong></td>
                    <td style="padding: 10px; text-align: right;">€${shippingCost.toFixed(2)}</td>
                </tr>
                <tr>
                    <td colspan="2" style="padding: 10px;"><strong>Totale</strong></td>
                    <td style="padding: 10px; text-align: right;"><strong>€${total.toFixed(2)}</strong></td>
                </tr>
            </table>
            
            <p style="margin-top: 20px;">Grazie per aver scelto Bool Wines!</p>
        </div>
    `;
};

module.exports = createEmailTemplate;