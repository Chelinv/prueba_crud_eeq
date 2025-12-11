import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

# ================================
# 1. OBTENER DATABASE_URL
# ================================
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL no está configurada")

# ================================
# 2. AÑADIR SSL PARA RENDER
# ================================
# Render siempre usa sslmode=require
if "render.com" in DATABASE_URL and "sslmode" not in DATABASE_URL:
    DATABASE_URL += "?sslmode=require"



# ================================
# 3. CREAR ENGINE
# ================================
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

# ================================
# 4. CONFIGURAR SESIÓN
# ================================
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ================================
# 5. BASE DE MODELOS
# ================================
Base = declarative_base()

# ================================
# 6. VALIDAR CONEXIÓN
# ================================
try:
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    print("🔥 [conexion] Conexión a PostgreSQL exitosa.")
except Exception as e:
    print("❌ [conexion] Error al conectar a PostgreSQL:", e)

# ================================
# 7. DEPENDENCIA PARA FASTAPI
# ================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
