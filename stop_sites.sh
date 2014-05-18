#!/bin/bash
# stop static sites
kill `/bin/cat /var/run/static_sites.pid`
