import os
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Cadena de conexión (lee de la variable de entorno DATABASE_URL o usa el valor por defecto local)
# Formato: postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:1234@localhost/prueba")

# 2. Creación del motor de la base de datos
engine = create_engine(DATABASE_URL)

# 3. Configuración de la sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Clase base para los modelos ORM
Base = declarative_base()

# 5. Función para obtener la sesión de DB (dependencia de FastAPI)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Intento de conexión al iniciar el módulo: imprime si la conexión es exitosa o no.
try:
    with engine.connect() as conn:
        # Ejecuta una consulta simple para validar la conexión
        conn.execute(text("SELECT 1"))
    print("[conexion] Conexión a la base de datos: OK")
except Exception as e:
    print(f"[conexion] Error al conectar a la base de datos: {e}")