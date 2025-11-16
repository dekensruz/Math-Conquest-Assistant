#!/bin/bash

echo "========================================"
echo "  Math Assistant - Démarrage"
echo "========================================"
echo ""

echo "[1/2] Démarrage du backend..."
cd backend
source venv/bin/activate 2>/dev/null || python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
python main.py &
BACKEND_PID=$!
cd ..

sleep 3

echo "[2/2] Démarrage du frontend..."
cd frontend
npm install > /dev/null 2>&1
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "  Les deux serveurs sont en cours de démarrage"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8000"
echo "========================================"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les serveurs"

# Attendre que l'utilisateur appuie sur Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

