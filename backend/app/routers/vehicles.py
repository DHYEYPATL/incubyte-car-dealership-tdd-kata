from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user, require_admin
from app.models import User, Vehicle
from app.schemas import VehicleCreate, VehicleUpdate, VehicleResponse, RestockRequest

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])


def get_vehicle_or_404(db: Session, vehicle_id: int) -> Vehicle:
    """Look up a vehicle by ID or raise 404."""
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle


def apply_vehicle_filters(query, search, category, min_price, max_price):
    """Apply optional filters to a Vehicle query."""
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                Vehicle.make.ilike(pattern),
                Vehicle.model.ilike(pattern),
            )
        )
    if category:
        query = query.filter(Vehicle.category.ilike(category))
    if min_price is not None:
        query = query.filter(Vehicle.price >= min_price)
    if max_price is not None:
        query = query.filter(Vehicle.price <= max_price)
    return query


@router.get("", response_model=list[VehicleResponse])
def list_vehicles(
    search: str | None = Query(default=None),
    category: str | None = Query(default=None),
    min_price: float | None = Query(default=None),
    max_price: float | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return all vehicles, optionally filtered by search term, category, or price range."""
    query = apply_vehicle_filters(db.query(Vehicle), search, category, min_price, max_price)
    return query.all()


@router.get("/search", response_model=list[VehicleResponse])
def search_vehicles(
    search: str | None = Query(default=None),
    category: str | None = Query(default=None),
    min_price: float | None = Query(default=None),
    max_price: float | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Search vehicles by make, model, category, or price range."""
    query = apply_vehicle_filters(db.query(Vehicle), search, category, min_price, max_price)
    return query.all()


@router.post("", response_model=VehicleResponse, status_code=201)
def create_vehicle(
    vehicle: VehicleCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Create a new vehicle (admin only)."""
    db_vehicle = Vehicle(**vehicle.model_dump())
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle


@router.post("/{vehicle_id}/purchase", response_model=VehicleResponse)
def purchase_vehicle(
    vehicle_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Purchase a vehicle, decreasing its quantity by 1."""
    vehicle = get_vehicle_or_404(db, vehicle_id)

    if vehicle.quantity <= 0:
        raise HTTPException(status_code=400, detail="Vehicle out of stock")

    vehicle.quantity -= 1
    db.commit()
    return vehicle


@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(
    vehicle_id: int,
    vehicle: VehicleUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Update an existing vehicle (admin only)."""
    db_vehicle = get_vehicle_or_404(db, vehicle_id)

    for field, value in vehicle.model_dump().items():
        setattr(db_vehicle, field, value)
    db.commit()
    return db_vehicle


@router.delete("/{vehicle_id}", response_model=VehicleResponse)
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Delete a vehicle (admin only)."""
    db_vehicle = get_vehicle_or_404(db, vehicle_id)

    db.delete(db_vehicle)
    db.commit()
    return db_vehicle


@router.post("/{vehicle_id}/restock", response_model=VehicleResponse)
def restock_vehicle(
    vehicle_id: int,
    restock: RestockRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Restock a vehicle, adding to its quantity (admin only)."""
    db_vehicle = get_vehicle_or_404(db, vehicle_id)

    db_vehicle.quantity += restock.quantity
    db.commit()
    return db_vehicle
