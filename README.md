# 🚗 Sales Data Dashboard

A full-stack web app that pulls car sales data from two sources, merges it based on filters, and visualizes it beautifully using D3.js.

---

## 📦 Features

- 🧾 Create data fetch tasks from two external sources (JSON + CSV)
- ⏳ Task queue with simulated processing (`pending → in_progress → completed`)
- 🗃️ Unified SQLite backend using SQLAlchemy
- 🔍 View analytics once the task is done:
  - Bar chart: Sales by Company
  - Line chart: Sales over Time
- 🎨 Fully styled with Tailwind CSS & interactive D3 charts
- ⚡ Built with FastAPI + React + Vite

---

## 🧱 Tech Stack

| Layer        | Tech                    |
| ------------ | ----------------------- |
| Frontend     | React, Vite, Tailwind CSS, D3.js |
| Backend      | FastAPI, SQLAlchemy, SQLite |
| Data Sources | JSON + CSV              |

---

## 🚀 How to Run

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start FastAPI backend
uvicorn main:app --reload
```

The backend will be live at:
📍 http://127.0.0.1:8000

You can test it using the built-in API docs:
🔗 http://127.0.0.1:8000/docs

###  2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:
📍 http://localhost:5173


### App Structure
```Narravance/
├── backend/
│   ├── main.py            # FastAPI app
│   ├── tasks.py           # Task creation & processing
│   ├── queue_worker.py    # Background task queue
│   ├── database.py        # DB connection
│   ├── models.py          # ORM models
│   ├── schemas.py         # Pydantic schemas
│   └── data/
│       ├── source_a.json
│       └── source_b.csv
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskStatus.jsx
│   │   │   └── Charts.jsx
│   │   └── App.jsx
│   └── index.html
├── README.md
```
