from datetime import datetime

# Initial beer stock data
stock = {
    "last_updated": datetime.now(),
    "beers": [
        {"name": "Corona", "price": 115, "quantity": 35},
        {"name": "Quilmes", "price": 120, "quantity": 0},
        {"name": "Club Colombia", "price": 110, "quantity": 25},
    ],
}

# Initial order data
order = {
    "created": datetime.now(),
    "paid": False,
    "subtotal": 0,
    "taxes": 0,
    "total": 0,
    "discounts": 0,
    "items": [],
    "rounds": [],
}
