# backend/schemas.py

from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class TaskCreate(BaseModel):
    start_date: date
    end_date: date
    makes: Optional[List[str]] = []

class TaskOut(BaseModel):
    id: int
    status: str

    class Config:
        orm_mode = True

class SalesRecordOut(BaseModel):
    company: str
    model: str
    date_of_sale: date
    price: float

    class Config:
        orm_mode = True
