# Video Stream Project

This project allows capturing video streams of students taking a test, storing the streams in AWS S3, and allowing administrators to view them.

## Stack

- **Frontend**: React
- **Backend**: Django
- **Cloud Storage**: AWS S3

## Installation

### Backend

1. Install the Python dependencies:

pip install -r requirements.txt

2. Run the Django server:

python manage.py runserver

### Frontend

1. Install the React dependencies:

npm install

2. Start the React development server:

npm start

## Environment Variables

### React

Create a `.env` file in the `client` directory:

REACT_APP_API_URL=http://localhost:8000

### Django

Configure AWS credentials in the `settings.py` file.