#!/bin/bash
# run static sites
NODE_ENV=PRODUCTION node /root/websites/app.js > /dev/null 2>&1 &
echo $! > /var/run/static_sites.pid
