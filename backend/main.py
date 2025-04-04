# backend/main.py

from fastapi import FastAPI, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas
from queue_worker import start_worker
from tasks import create_task_and_enqueue, get_task_status, get_task_data

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for local frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

start_worker()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create new task
@app.post("/tasks/", response_model=schemas.TaskOut)
def create_task(task: schemas.TaskCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    print("✅ Received task request:", task)
    return create_task_and_enqueue(task, db, background_tasks)


# Get task status
@app.get("/tasks/{task_id}", response_model=schemas.TaskOut)
def read_task_status(task_id: int, db: Session = Depends(get_db)):
    return get_task_status(task_id, db)

# Get data for a task
@app.get("/tasks/{task_id}/data", response_model=list[schemas.SalesRecordOut])
def read_task_data(task_id: int, db: Session = Depends(get_db)):
    return get_task_data(task_id, db)
