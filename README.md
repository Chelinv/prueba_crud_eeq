# CV_CRUD

Proyecto CRUD (FastAPI + React) — instrucciones básicas para desarrollo y despliegue local.

Requisitos
- Python 3.10+ (virtualenv)
- Node.js 16+ / npm

Instalación (backend)
```powershell
cd C:\Users\P2276\Documents\CRUD\backend
venv\Scripts\activate
python -m pip install -r requirements.txt
```

Instalación (frontend)
```powershell
cd C:\Users\P2276\Documents\CRUD\frontend
npm install
```

Ejecutar en desarrollo
```powershell
# Backend
cd C:\Users\P2276\Documents\CRUD\backend
venv\Scripts\activate; uvicorn main:app --reload

# Frontend
cd C:\Users\P2276\Documents\CRUD\frontend
npm run dev
```

Cómo subir a GitHub (resumen)
1. Crear repo nuevo en GitHub (vía web o `gh repo create`)
2. En tu máquina, desde la raíz del proyecto:
```powershell
cd C:\Users\P2276\Documents\CRUD
git init
git add .
git commit -m "Initial commit"
# Añadir remoto (HTTPS)
git remote add origin https://github.com/<TU_USUARIO>/<TU_REPO>.git
git branch -M main
git push -u origin main
```

Si usas HTTPS y te pide credenciales, puedes configurar un Personal Access Token (PAT) en GitHub e introducirlo como contraseña o usar `gh auth login`.

Notas
- Asegúrate de no subir el virtualenv ni `node_modules` (están en `.gitignore`).
- Si quieres, puedo crear el repo remoto (necesitarás autenticación `gh`), o generar un `.github/workflows` para CI.
