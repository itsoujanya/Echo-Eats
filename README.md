# ECHO-EATS Voice Assistant

A full-stack voice-enabled food ordering web application that allows users to browse food items, search menus using voice commands, manage their cart, and place food orders through an interactive and user-friendly interface.

The application is built using:

- React.js
- Vite
- Django
- Python
- MySQL
- CSS
- JavaScript
- React Router
- React Speech Recognition

---

# Features

🎤 Voice-based food search

🍔 Browse food menu

🔍 Search food items instantly

🛒 Add items to cart

➕ Increase or decrease quantity

🧾 View cart summary

📦 Place food orders

💾 Store order details in MySQL

⚡ Fast and responsive user interface

---

# Tech Stack

## Frontend

- React.js
- Vite
- HTML
- CSS
- JavaScript

## Backend

- Python
- Django

## Database

- MySQL

## Voice Recognition

- React Speech Recognition
- Web Speech API

---

# Project Structure

```
ECHO_EATS_VOICE_ASSISTANT_DJANGO-main/
│
├── Backend/
│   ├── Backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── app/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── admin.py
│   │   ├── urls.py
│   │   └── migrations/
│   │
│   ├── manage.py
│   ├── requirements.txt
│   └── venv/
│
├── FrontEnd/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md
```

---

# Installation

## Step 1: Clone the Repository

```bash
git clone <repository-link>
cd ECHO_EATS_VOICE_ASSISTANT_DJANGO-main
```

---

## Step 2: Backend Setup

Navigate to the backend folder.

```bash
cd Backend
```

Create a virtual environment.

```bash
python -m venv venv
```

Activate the virtual environment.

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

---

## Step 3: Install Required Backend Packages

```bash
pip install django
pip install razorpay
pip install openai
pip install django-cors-headers
pip install mysqlclient
```

Or install all dependencies at once.

```bash
pip install -r requirements.txt
```

---

## Step 4: Start MySQL Server

Before running the project, make sure MySQL is running.

### Windows

Press **Win + R**

Type

```
services.msc
```

Locate **MySQL80**

If it is stopped, click **Start**.

---

## Step 5: Configure Database

Update the database configuration inside **Backend/settings.py**

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "echo_eats",
        "USER": "root",
        "PASSWORD": "your_password",
        "HOST": "localhost",
        "PORT": "3306",
    }
}
```

If using a cloud-hosted MySQL-compatible database (TiDB Cloud), configure the connection credentials accordingly.

---

## Step 6: Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Step 7: Frontend Setup

Open another terminal.

```bash
cd FrontEnd
npm install
```

This installs:

- react
- react-router-dom
- react-speech-recognition
- vite

---

## Step 8: Run Backend Server

```bash
cd Backend
python manage.py runserver 3000
```

---

## Step 9: Run Frontend

```bash
cd FrontEnd
npm run dev
```

---

# Open in Browser

Frontend

```
http://localhost:5173
```

Backend

```
http://127.0.0.1:3000
```

---

# Functionalities

## Voice Search

Users can search food items simply by speaking.

Example voice commands

- Pizza
- Burger
- Chicken Biryani
- Masala Dosa
- Cold Coffee

The application converts speech into text and automatically searches the available menu items.

---

## Browse Menu

Users can

- View available food items
- Browse different food categories
- View food prices
- Check food images

---

## Cart Management

Users can

- Add food items to cart
- Remove items from cart
- Increase quantity
- Decrease quantity
- View total bill

---

## Order Placement

Users can

- Review selected items
- Confirm order
- Place food orders
- View order summary

---

# Database Operations

## Add Order

```sql
INSERT INTO orders(customer_name, food_name, quantity, total_price)
VALUES ('Soujanya','Veg Burger',2,240);
```

---

## View Orders

```sql
SELECT * FROM orders;
```

---

## Latest Orders

```sql
SELECT * FROM orders
ORDER BY id DESC;
```

---

# Voice Recognition

The application uses **React Speech Recognition** and the **Web Speech API** to recognize spoken food names and instantly display matching menu items.

Example

```javascript
recognition.start();
```

---

# Dependencies

Frontend

Installed using

```bash
npm install
```

Main dependencies

- react
- react-router-dom
- react-speech-recognition
- vite

Backend

Installed using

```bash
pip install -r requirements.txt
```

Main dependencies

- Django
- mysqlclient
- django-cors-headers
- razorpay
- openai

---

# Future Enhancements

🔐 User Authentication

💳 Online Payment Gateway Integration

📍 Live Order Tracking

⭐ Restaurant Ratings and Reviews

❤️ Favorite Food Items

🤖 AI-based Food Recommendations

🌙 Dark Mode

📱 Progressive Web App (PWA)

🌐 Multi-language Voice Commands

🔔 Real-time Order Notifications

---

# Author

**Soujanya S.**
