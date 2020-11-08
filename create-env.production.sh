#! /bin/bash

cat > .env.production << "EOF"
REACT_APP_CLIENT_ID=${{ secrets.REACT_APP_CLIENT_ID }}
REACT_APP_API_KEY=${{ secrets.REACT_APP_API_KEY }}
EOF
