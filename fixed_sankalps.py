from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta
from typing import List, Optional
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.sankalp import Sankalp
from app.schemas.sankalp import SankalpCreate, SankalpResponse
from app.core.sankalp_catalog import SANKALP_QUALITIES

router = APIRouter()

@router.get("/qualities")
def get_sankalp_qualities():
    return SANKALP_QUALITIES

@router.post("/", response_model=SankalpResponse)
def set_today_sankalp(
    payload: SankalpCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    now = datetime.utcnow()
    today_start = datetime.combine(now.date(), datetime.min.time())
    today_end = datetime.combine(now.date(), datetime.max.time())
    
    existing = db.query(Sankalp).filter(
        Sankalp.user_id == current_user.id,
        Sankalp.date >= today_start,
        Sankalp.date <= today_end
    ).first()

    if existing:
        existing.quality = payload.quality
        existing.date = now
        db.commit()
        db.refresh(existing)
        return existing

    new_sankalp = Sankalp(
        user_id=current_user.id,
        quality=payload.quality,
        date=now
    )
    db.add(new_sankalp)
    db.commit()
    db.refresh(new_sankalp)
    return new_sankalp

@router.get("/today", response_model=Optional[SankalpResponse])
def get_today_sankalp(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    now = datetime.utcnow()
    today_start = datetime.combine(now.date(), datetime.min.time())
    today_end = datetime.combine(now.date(), datetime.max.time())
    
    sankalp = db.query(Sankalp).filter(
        Sankalp.user_id == current_user.id,
        Sankalp.date >= today_start,
        Sankalp.date <= today_end
    ).order_by(Sankalp.date.desc()).first()

    if not sankalp:
        sankalp = db.query(Sankalp).filter(
            Sankalp.user_id == current_user.id,
            Sankalp.date >= now - timedelta(hours=24)
        ).order_by(Sankalp.date.desc()).first()

    return sankalp
