var http = require("http");
var log4js = require("log4js");
var staticFile = require("node-static");
var fs = require("fs");
var path = require("path");

var env = process.env.NODE_ENV || "DEBUG"

if(env=="DEBUG") {
  var siteFile = "sites.json";
  var logFile = "websites.log";
}else{
  var siteFile = "/etc/websites/sites.json";
  var logFile = "/var/log/websites.log";
}

var sites = JSON.parse(fs.readFileSync(siteFile));

log4js.configure({
  appenders: [
    { type: "file", filename: logFile, category: "website" },
    { type: "console"}
  ]
});

var logger = log4js.getLogger("website");

logger.setLevel("INFO");

function createServer(site) {
  details = sites[site];
  details.server = new staticFile.Server(details.directory);
  details.notFoundPage = site404(details) || common404(details);
  logger.info("server for site "+site+" from "+details.directory);
}

function common404(details){
  return  path.relative(details.directory, path.resolve(__dirname,"404.html"));
}

function site404(details){
  if(details.notFoundPage){
    return details.notFoundPage;
  }
  else
  {
    file = path.resolve(details.directory, "404.html");
    if(fs.existsSync(file)) {
      return  path.relative(details.directory, file);
    }else{
      return false;
    }
  }
}

function about(request){
  client_ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
  return request.headers.host+" "+request.method+" "+request.url+" "+client_ip+" "+request.headers["user-agent"];
}

function handleRequest(request, response) {
  request.addListener("end", function () {

    site = sites[request.headers.host] || sites["default"];
    if(site){
      site.server.serve(request, response, function(err, result) {
        if(err) {
           logger.error(about(request)+" "+err.status);
          if(err.status == 404){
            site.server.serveFile(site.notFoundPage, 404, {}, request, response);
          }
          else
          {
            response.writeHead(err.status, err.headers);
            response.end();
          }
        }else{
          logger.info(about(request)+" 200");
        }
      })
    }
    else {
      logger.error(request.headers.host+" "+ request.connection.remoteAddress+" "+ request.method+" "+request.url+" "+ "NO DEFAULT SERVER");
      response.end();
    }
  }).resume();
}

logger.info("Zipi_Static starting up...");
for (site in sites) { createServer(site) }
http.createServer(handleRequest).listen(8080);
