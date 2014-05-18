#!/bin/bash
# monitor static sites on stdout
NODE_ENV=PRODUCTION node /root/websites/app.js &
echo $! > /var/run/static_sites.pid
