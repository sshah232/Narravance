# backend/tasks.py

import json
import pandas as pd
import time
from datetime import datetime
from sqlalchemy.orm import Session
from models import Task, SalesRecord
from schemas import TaskCreate
from queue_worker import enqueue_background_task
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_JSON_PATH = os.path.join(BASE_DIR, "data/source_a.json")
DATA_CSV_PATH = os.path.join(BASE_DIR, "data/source_b.csv")

def create_task_and_enqueue(task_data: TaskCreate, db: Session, background_tasks):
    filters = {
        "start_date": str(task_data.start_date),
        "end_date": str(task_data.end_date),
        "makes": task_data.makes,
    }
    task = Task(status="pending", filters=json.dumps(filters))
    db.add(task)
    db.commit()
    db.refresh(task)

    # enqueue simulated job
    background_tasks.add_task(enqueue_background_task, task.id, filters)

    return task

def get_task_status(task_id: int, db: Session):
    return db.query(Task).filter(Task.id == task_id).first()

def get_task_data(task_id: int, db: Session):
    return db.query(SalesRecord).filter(SalesRecord.task_id == task_id).all()

def process_task(task_id: int, filters: dict, db: Session):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return

    task.status = "in_progress"
    db.commit()

    time.sleep(5)  # Simulated delay

    # Load and process JSON
    with open(DATA_JSON_PATH) as f:
        json_data = json.load(f)

    df_a = pd.DataFrame(json_data)

    # Load and process CSV
    df_b = pd.read_csv(DATA_CSV_PATH)

    # Parse dates
    df_a['date_of_sale'] = pd.to_datetime(df_a['date_of_sale']).dt.date
    df_b['date_of_sale'] = pd.to_datetime(df_b['date_of_sale']).dt.date

    # Filter
    start = datetime.strptime(filters["start_date"], "%Y-%m-%d").date()
    end = datetime.strptime(filters["end_date"], "%Y-%m-%d").date()

    df_a = df_a[(df_a['date_of_sale'] >= start) & (df_a['date_of_sale'] <= end)]
    df_b = df_b[(df_b['date_of_sale'] >= start) & (df_b['date_of_sale'] <= end)]

    if filters["makes"]:
        df_b = df_b[df_b['company'].isin(filters["makes"])]

    combined_df = pd.concat([df_a, df_b])

    # Save to DB
    for _, row in combined_df.iterrows():
        record = SalesRecord(
            task_id=task_id,
            company=row["company"],
            model=row["model"],
            date_of_sale=row["date_of_sale"],
            price=row["price"]
        )
        db.add(record)

    task.status = "completed"
    db.commit()
