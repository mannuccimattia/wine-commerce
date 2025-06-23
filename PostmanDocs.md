### Postman Testing - Rotte

#### Wines

> **Entry point** - GET - `http://127.0.0.1:3000/`

> **Index All** - GET - `http://127.0.0.1:3000/api/wines`

> **Index w/ Search** - GET - `http://127.0.0.1:3000/api/wines?search=search_param_here&sort=asc`  
> Parametri:

- Search: name, vintage, winemaker
- Sort: ASC/DESC

> **Index w/ Category** - GET - `http://127.0.0.1:3000/api/wines/category/category_id_here`

> **Index Bestsellers** - GET - `http://127.0.0.1:3000/api/wines/bestseller`

> **Index PremiumVintage** - GET - `http://127.0.0.1:3000/api/wines/premiumvintage`

> **Get Categories** - GET - `http://127.0.0.1:3000/api/wines/getcategories`

> **Get Denominations** - GET - `http://127.0.0.1:3000/api/wines/getdenominations`

> **Get Regions** - GET - `http://127.0.0.1:3000/api/wines/getregions`

> **Show** - GET - `http://127.0.0.1:3000/api/wines/id_here`

#### Chatbot

> **Send message** - POST - `http://localhost:3000/api/chat`  
> Body: raw JSON
>
> ```json
> { "message": "I am sending a message to Chatbot" }
> ```

#### Orders

> **Create Order** - POST - `http://localhost:3000/api/order`  
> Body: raw JSON
>
> ```json
> {
>   "cliente": {
>     "firstName": "Mario",
>     "lastName": "Rossi",
>     "email": "mario.rossi@example.com",
>     "address": "Via Roma 123",
>     "city": "Milano",
>     "zip_code": "20100"
>   },
>   "carrello": [
>     {
>       "id": 6,
>       "nome": "Gaia & Rey",
>       "prezzo": 350.0,
>       "qty": 1
>     }
>   ],
>   "subtotale": 350.0,
>   "shippingCost": 8.9
> }
> ```
