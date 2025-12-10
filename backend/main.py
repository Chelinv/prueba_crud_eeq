from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
import os
import models
import schemas
from conexion import engine, get_db
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # << Importa esto

# Crea las tablas en la DB si no existen (solo para el primer uso/test)
# models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="API de Clientes")

# Leer orígenes permitidos desde la variable de entorno CORS_ORIGINS
# Formato: "https://mi-frontend.onrender.com,http://localhost:5173"
cors_env = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
origins = [o.strip() for o in cors_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# --- CREATE (POST) ---
@app.post("/clientes/", response_model=schemas.ClienteResponse, status_code=status.HTTP_201_CREATED)
def create_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    """Crea un nuevo cliente en la base de datos."""
    
    db_cliente = models.ClienteDB(
        cliente=cliente.cliente,
        tipo_factura=cliente.tipo_factura,
        precios=cliente.precios
    )
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente

# --- READ (GET - Todos) ---
@app.get("/clientes/", response_model=list[schemas.ClienteResponse])
def read_clientes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtiene una lista de clientes con paginación."""
    
    clientes = db.query(models.ClienteDB).offset(skip).limit(limit).all()
    return clientes

# --- READ (GET - Por ID) ---
@app.get("/clientes/{cliente_id}", response_model=schemas.ClienteResponse)
def read_cliente(cliente_id: int, db: Session = Depends(get_db)):
    """Obtiene un cliente específico por su ID."""
    
    db_cliente = db.query(models.ClienteDB).filter(models.ClienteDB.id == cliente_id).first()
    if db_cliente is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente no encontrado")
    return db_cliente

# --- UPDATE (PUT/PATCH) ---
@app.patch("/clientes/{cliente_id}", response_model=schemas.ClienteResponse)
def update_cliente(cliente_id: int, cliente_update: schemas.ClienteUpdate, db: Session = Depends(get_db)):
    """Actualiza parcialmente un cliente existente por su ID."""
    
    db_cliente = db.query(models.ClienteDB).filter(models.ClienteDB.id == cliente_id).first()
    if db_cliente is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente no encontrado")

    # Itera sobre los campos actualizables y aplica los cambios si no son None
    update_data = cliente_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_cliente, key, value)

    db.commit()
    db.refresh(db_cliente)
    return db_cliente

# --- DELETE (DELETE) ---
@app.delete("/clientes/{cliente_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cliente(cliente_id: int, db: Session = Depends(get_db)):
    """Elimina un cliente existente por su ID."""
    
    db_cliente = db.query(models.ClienteDB).filter(models.ClienteDB.id == cliente_id)
    
    if db_cliente.first() is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente no encontrado")
    
    db_cliente.delete(synchronize_session=False)
    db.commit()
    return {"ok": True}

