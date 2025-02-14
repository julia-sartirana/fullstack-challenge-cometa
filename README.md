# fullstack-challenge-cometa

# 🍺 Beer Order System

A simplified beer ordering and bill-splitting system where three friends enter a bar that only sells beer. One of them tends to avoid paying, so this system ensures fairness by tracking orders and payments. This project implements an API to handle beer stock, orders, and payments, along with a Next.js frontend for interaction.

## 📌 Features

- ✅ REST API built with **Django REST Framework**
- ✅ **Next.js** frontend using **TypeScript** and **Tailwind CSS**
- ✅ Data stored **in memory** (no database required)
- ✅ Fully tested backend using **Django's TestCase**
- ✅ API endpoints for managing beer stock, orders, and payments
- ✅ **Bill tracking:** Friends can split the bill equally or pay for what they ordered
- ✅ **UI for managing payments and tracking pending amounts**
- ✅ **NYT Books Integration** with **background task**
- ✅ **Amazon purchase links** for best-selling books

---

## 🛠️ Installation and Setup

### 🔹 Backend (Django API)

#### 1️⃣ Clone this repository:

```js
git clone https://github.com/julia-sartirana/fullstack-challenge-cometa.git
cd fullstack-challenge-cometa/backend
```

#### 2️⃣ Create and activate a virtual environment:

```js
python -m venv venv
source venv/bin/activate # On macOS/Linux
venv\Scripts\activate # On Windows
```

#### 3️⃣ Install dependencies:

```js
pip install -r requirements.txt
```

#### 4️⃣ Set up environment variables:

```js
export NYT_API_KEY="your-nyt-api-key"
```

#### 5️⃣ Run the Django server:

```js
python manage.py runserver
```

The API will be available at:  
👉 http://127.0.0.1:8000/api/beer-orders/  
👉 http://127.0.0.1:8000/api/nyt-books/

#### 6️⃣ Run tests (optional):

```js
python manage.py test
```

---

### 🔹 Frontend (Next.js App)

#### 1️⃣ Navigate to the frontend directory:

```js
cd ../frontend
```

#### 2️⃣ Install dependencies:

```js
npm install
```

#### 3️⃣ Run the development server:

```js
npm run dev
```

The frontend will be available at:  
👉 http://localhost:3000/

---

## 🚀 API Endpoints

### 🔸 Get beer stock

```http
GET /api/beer-orders/stock/
```

📌 Returns the available beer stock.

### 🔸 Get current order status

```http
GET /api/beer-orders/order/
```

📌 Returns the current order details.

### 🔸 Place an order

```http
POST /api/beer-orders/order/
```

📌 Adds a beer to the order if stock is available.

**Example request body:**

```json
{
  "items": [
    {
      "name": "Corona",
      "quantity": 2
    }
  ]
}
```

### 🔸 Get the current bill

```http
GET /api/beer-orders/bill/
```

📌 Returns the current bill, including the total amount due and payments made by each friend.

**Example response:**

```json
{
  "total": 150,
  "remaining_total": 50,
  "payments": {
    "Alice": 50,
    "Bob": 50,
    "Charlie": 0
  }
}
```

### 🔸 Pay the bill

```http
POST /api/beer-orders/bill/pay/
```

📌 Allows a friend to pay either their share or a custom amount.

**Example request body:**

```json
{
  "friend": "Alice",
  "amount": 50
}
```

---

### 📚 **NYT Books API Endpoints**

### 🔹 Get books by genre

```http
GET /api/nyt-books/?genre=hardcover-fiction
```

📌 Returns a list of books from NYT Best Sellers.

**Example response:**

```json
[
  {
    "title": "ONYX STORM",
    "author": "Rebecca Yarros",
    "book_image": "https://...",
    "amazon_product_url": "https://www.amazon.com/dp/..."
  }
]
```

---

### 🔹 Trigger an update manually

```http
POST /api/nyt-books/update/
```

📌 Triggers an **immediate background update** to fetch the latest books.

**Example response:**

```json
{
  "message": "Books update triggered"
}
```

---

### 🔹 Get available genres

```http
GET /api/nyt-books/genres/
```

📌 Returns a list of available genres.

**Example response:**

```json
["hardcover-fiction", "hardcover-nonfiction"]
```

---

## 📂 Project Structure

```plaintext
fullstack-challenge-cometa/
│── backend/ # Django API
│ ├── beer_orders/ # Main app
│ │ ├── views.py # API views
│ │ ├── serializers.py # DRF serializers
│ │ ├── tests.py # Unit tests
│ │ ├── utils/ # Data storage (no DB)
│ ├── nyt_books/ # NYT Books Integration
│ │ ├── views.py # API views
│ │ ├── tasks.py # Background tasks
│ │ ├── utils.py # NYT API integration
│ │ ├── logs/ # Execution logs
│ ├── manage.py # Django entry point
│ ├── requirements.txt # Backend dependencies
│
│── frontend/ # Next.js App
│ ├── components/ # UI Components
│ ├── pages/ # Next.js pages
│ ├── hooks/ # Custom hooks for API interactions
│ ├── package.json # Frontend dependencies
│
│── README.md # Project documentation
```

---

## 🛠️ Technologies Used

### Backend:

- 🐍 **Django REST Framework** for API
- ⏳ **Background Task Manager** (Django Background Tasks)
- 📜 **Logging** for debugging

### Frontend:

- ⚛ **Next.js** (React + TypeScript)
- 🎨 **Tailwind CSS** for styling
- 🔗 **Axios** for API calls

---

## 📄 License

This project is for educational purposes and is not intended for commercial use.

---

## 📬 Contact

If you have any questions, feel free to reach out via GitHub issues.

🚀 Happy coding! 🎉
