# backend/queue_worker.py

import threading
import time
from queue import Queue
from database import SessionLocal

queue = Queue()

def worker():
    while True:
        task_id, filters = queue.get()
        if task_id is None:
            break  # allows graceful shutdown later

        print(f"🛠️  Worker picked up task {task_id}")
        db = SessionLocal()
        try:
            from tasks import process_task  # lazy import to avoid circular issue
            process_task(task_id, filters, db)
        finally:
            db.close()
            queue.task_done()

def start_worker():
    thread = threading.Thread(target=worker, daemon=True)
    thread.start()

def enqueue_background_task(task_id, filters):
    queue.put((task_id, filters))
