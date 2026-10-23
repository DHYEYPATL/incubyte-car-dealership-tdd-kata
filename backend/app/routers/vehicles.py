from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user, require_admin
from app.models import User, Vehicle
from app.schemas import VehicleCreate, VehicleResponse

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])


@router.get("", response_model=list[VehicleResponse])
def list_vehicles(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return all vehicles."""
    return db.query(Vehicle).all()


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
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    if vehicle.quantity <= 0:
        raise HTTPException(status_code=400, detail="Vehicle out of stock")

    vehicle.quantity -= 1
    db.commit()
    return vehicle
