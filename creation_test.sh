#!/bin/bash

NAME="kestreltest"                         # Nombre del proyecto
EMAIL="maguhoyossi@ittepic.edu.mx"          # Correo al que se conectará la aplicación
DOMAIN="kestreltest.vercel.app"      # Dominio que se enlazará a la naplicación
CONNECTIONSTRING="postgresql://postgres:wsVDLq67PCKEINdJ@db.wihcefsmgiuxiamuvyfy.supabase.co:5432/postgres" # String de conexión Marvi 
PROJECTID="kstfimilolfdkubyctgy" # ID de la BD en supabase a la que se debe enlazar la aplicación

npx turbo gen workspace --type=app --name=$NAME --destination=apps/$NAME --copy=base

cd apps/$NAME

npx supabase init

npx supabase db diff -f initCommit --db-url $CONNECTIONSTRING 

npx supabase db dump --data-only -f supabase/seed.sql --db-url $CONNECTIONSTRING

npx supabase start

npx supabase login

npx supabase link --project-ref $PROJECTID

npx supabase db push

npx supabase stop

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

vercel domains add $DOMAIN

echo "Añadido del dominio exitoso"

vercel --cwd apps/$NAME

echo "Deploy de $NAME exitoso"

vercel logout 