# Bus Booking System

A full-stack Bus Booking System developed using Django REST Framework and React. The application allows users to browse available buses, select seats, book tickets, and manage their bookings.

## Technologies Used

**Backend**
- Python
- Django
- Django REST Framework
- MySQL
- Token Authentication

**Frontend**
- React.js
- JavaScript
- HTML
- CSS
- Axios
- React Router

## Features

- User registration and login
- Token-based authentication
- View available buses
- View bus details and travel information
- Seat selection and booking
- Prevent duplicate seat bookings
- User-specific booking history
- Cancel bookings
- Automatically update seat availability after cancellation
- Django Admin for managing buses, trips, seats, and bookings
- Responsive frontend design

## Project Structure

```text
bus-booking/
│
├── backend/
│   ├── busconfig/
│   ├── project/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd bus-booking
```

### 2. Backend Setup

```bash
cd backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
```

Configure your MySQL database and database credentials in the Django settings.

Run migrations:

```bash
python manage.py migrate
```

Create an admin account:

```bash
python manage.py createsuperuser
```

Start the Django server:

```bash
python manage.py runserver
```

Backend URL: http://127.0.0.1:8000/

Django Admin: http://127.0.0.1:8000/admin/

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend

npm install
npm run dev
```

Frontend URL: http://localhost:5173/

## Future Improvements

- Online payment gateway integration
- Email booking confirmations
- Deployment to a cloud hosting platform

## Author

Developed as a Full Stack Development project using Django REST Framework and React.