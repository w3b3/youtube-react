#! /bin/bash

echo 'REACT_APP_CLIENT_ID=${{ secrets.REACT_APP_CLIENT_ID }}\n' > .env.production
echo 'REACT_APP_API_KEY=${{ secrets.REACT_APP_API_KEY }}' > .env.production
