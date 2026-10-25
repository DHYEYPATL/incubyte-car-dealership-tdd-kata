"""Database seed script for demo and cloud deployments."""
import os
from sqlalchemy.orm import Session

from app.database import SessionLocal, Base, engine
from app.models import User, Vehicle
from app.auth import hash_password

INITIAL_VEHICLES = [
    {"make": "Toyota", "model": "Camry", "category": "Sedan", "price": 25000.0, "quantity": 6},
    {"make": "Honda", "model": "Civic", "category": "Sedan", "price": 22500.0, "quantity": 2},
    {"make": "Ford", "model": "Mustang", "category": "Coupe", "price": 36000.0, "quantity": 0},
    {"make": "Tesla", "model": "Model 3", "category": "Electric", "price": 42000.0, "quantity": 4},
    {"make": "BMW", "model": "3 Series", "category": "Sedan", "price": 44500.0, "quantity": 1},
    {"make": "Chevrolet", "model": "Tahoe", "category": "SUV", "price": 56000.0, "quantity": 3},
]

DEMO_USERS = [
    {"username": "admin", "password": "admin123", "role": "admin"},
    {"username": "user", "password": "user123", "role": "user"},
]


def seed_database(db: Session = None) -> dict:
    """Seed sample vehicles and demo users if they don't already exist."""
    close_db = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_db = True

    results = {"vehicles_seeded": 0, "users_seeded": 0}

    try:
        # Seed vehicles if table is empty
        existing_vehicle_count = db.query(Vehicle).count()
        if existing_vehicle_count == 0:
            for v_data in INITIAL_VEHICLES:
                vehicle = Vehicle(**v_data)
                db.add(vehicle)
                results["vehicles_seeded"] += 1

        # Seed demo users if not present
        for u_data in DEMO_USERS:
            existing_user = db.query(User).filter(User.username == u_data["username"]).first()
            if not existing_user:
                new_user = User(
                    username=u_data["username"],
                    hashed_password=hash_password(u_data["password"]),
                    role=u_data["role"],
                )
                db.add(new_user)
                results["users_seeded"] += 1

        db.commit()
    finally:
        if close_db:
            db.close()

    return results


if __name__ == "__main__":
    summary = seed_database()
    print(f"Seed complete: {summary}")
