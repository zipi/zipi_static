# Zipi Static
A very small node.js project to implement virtual hosting for static sites with node-static.

Can run in user space and provide a proxy server for a large number of static page sites.

It would be hard to say that it's better than just using VirtualHost in Apache, but it is smaller, and simpler to configure.

## Configure
Use sites.json to create an object with a property for each site's FQDN.
The value is an object with a directory property for the directory to be served, optional notFoundFile for custom 404 page,
or you can just put a 404.html page in the served directory, or don't worry about 404's and get the default page.

If a server is configured with "default" instead of a FQDN it will be used as the default for any unconfigured FQDN that is requested.
Without a default unconfigured sites will get an empty response.


