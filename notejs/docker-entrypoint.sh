#!/bin/bash

cd /app
npm install
./node_modules/nodemon/bin/nodemon.js --legacy-watch index.js