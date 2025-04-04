# backend/models.py

from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, default="pending")
    filters = Column(String)  # JSON string for filter info

    records = relationship("SalesRecord", back_populates="task")


class SalesRecord(Base):
    __tablename__ = "sales_records"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    company = Column(String)
    model = Column(String)
    date_of_sale = Column(Date)
    price = Column(Float)

    task = relationship("Task", back_populates="records")
