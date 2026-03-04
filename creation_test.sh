#!/bin/bash

NAME="test"
EMAIL="maguhoyossi@ittepic.edu.mx"

npx turbo gen workspace --type=app --name=$NAME --destination=apps/$NAME --copy=base

cd apps/$NAME

npm i --force

cd ../../

git add .

git commit -m "Añadido de $NAME en apps"

git push

echo "Se generó $NAME"

vercel login $EMAIL

echo "Conexión a Vercel Exitosa"

vercel project add $NAME

echo "Creación de proyecto $NAME vacío"

vercel git connect

echo "Conexión de github al proyecto $NAME exitosa"

vercel link --cwd apps/$NAME --project $NAME

echo "Enlazado del proyecto exitoso"

vercel domains add $NAME-alveus.vercel.app

echo "Añadido del dominio exitoso"

vercel --cwd apps/$NAME

echo "Deploy del test exitoso"

vercel logout 