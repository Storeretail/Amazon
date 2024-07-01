New.txt
const https = require('https');
const http = require('http');
const url = require('url');
const crypto = require('crypto');
const express = require('express');
const compression = require('compression');

const app = express();

const ipRanges = ['1.6.0.0/15', '1.22.0.0/15']; // Add more IP ranges as needed
const userAgents = ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36']; // Add more user agents as needed
const refererURLs = ['https://www.example.com', 'https://www.anotherexample.com']; // Add more referer URLs as needed
const acceptEncodings = ['gzip', 'deflate', 'br']; // Add more accept encodings as needed
const acceptLanguages = ['en-US', 'en;q=0.9', 'fr-FR']; // Add more accept languages as needed
const operatingSystems = ['Windows NT 10.0', 'Macintosh; Intel Mac OS X 10_15_7']; // Add more OS as needed
const screenResolutions = ['1920x1080', '1366x768']; // Add more resolutions as needed
const timeZones = ['UTC+05:30']; // Add more time zones as needed
const batteryStatuses = ['Charging', 'Discharging', 'Not Charging', 'Full', 'Unknown']; // Add more battery statuses as needed
const deviceModels = ['iPhone', 'Samsung Galaxy', 'Pixel']; // Add more device models as needed
const canvasData = ['canvas1', 'canvas2']; // Add more canvas fingerprints as needed
const webglData = ['webgl1', 'webgl2']; // Add more webgl fingerprints as needed
const browserCharacteristics = ['Firefox/89.0', 'Chrome/91.0.4472.124']; // Add more browser characteristics as needed
const osCharacteristics = ['Windows NT 10.0; Win64; x64', 'Macintosh; Intel Mac OS X 10_15_7']; // Add more OS characteristics as needed
const navigatorPlatforms = ['Win32', 'MacIntel', 'Linux x86_64']; // Add more navigator platforms as needed
const navigatorVendors = ['Google Inc.', 'Apple Inc.', 'Mozilla Foundation']; // Add more navigator vendors as needed
const navigatorHardwareConcurrency = [2, 4, 8, 16]; // Add more hardware concurrency values as needed

// Define your app names
const appNames = ['Flash', 'QuickTime', 'PDF Viewer', 'Java', 'Silverlight', 'Shockwave', 'Windows Media Player', 'RealPlayer', 'VLC Media Player', 'iTunes'];

let sessionSettings = null;

function generateSessionSettings() {
  const ip = getRandomIPFromRanges(ipRanges);
  const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
  const referer = refererURLs[Math.floor(Math.random() * refererURLs.length)];
  const acceptEncoding = acceptEncodings[Math.floor(Math.random() * acceptEncodings.length)];
  const acceptLanguage = acceptLanguages[Math.floor(Math.random() * acceptLanguages.length)];
  const operatingSystem = operatingSystems[Math.floor(Math.random() * operatingSystems.length)];
  const screenResolution = screenResolutions[Math.floor(Math.random() * screenResolutions.length)];
  const timeZone = timeZones[Math.floor(Math.random() * timeZones.length)];
  const batteryStatus = batteryStatuses[Math.floor(Math.random() * batteryStatuses.length)];
  const deviceModel = deviceModels[Math.floor(Math.random() * deviceModels.length)];
  const canvasData = canvasData[Math.floor(Math.random() * canvasData.length)];
  const webglData = webglData[Math.floor(Math.random() * webglData.length)];
  const browserCharacteristics = browserCharacteristics[Math.floor(Math.random() * browserCharacteristics.length)];
  const osCharacteristics = osCharacteristics[Math.floor(Math.random() * osCharacteristics.length)];
  const navigatorPlatform = navigatorPlatforms[Math.floor(Math.random() * navigatorPlatforms.length)];
  const navigatorVendor = navigatorVendors[Math.floor(Math.random() * navigatorVendors.length)];
  const navigatorHardwareConcurrency = navigatorHardwareConcurrency[Math.floor(Math.random() * navigatorHardwareConcurrency.length)];

  // Generate random number of installed plugins
  const numPlugins = Math.floor(Math.random() * 6) + 5; // Random number between 5 to 10
  const selectedPlugins = [];

  // Randomly select plugins from appNames
  for (let i = 0; i < numPlugins; i++) {
    const randomIndex = Math.floor(Math.random() * appNames.length);
    selectedPlugins.push(appNames[randomIndex]);
  }

  const installedPlugins = selectedPlugins.join(', ');

  return {
    ip,
    userAgent,
    referer,
    acceptEncoding,
    acceptLanguage,
    operatingSystem,
    screenResolution,
    timeZone,
    batteryStatus,
    deviceModel,
    canvasData,
    webglData,
    browserCharacteristics,
    osCharacteristics,
    navigatorPlatform,
    navigatorVendor,
    navigatorHardwareConcurrency,
    installedPlugins
  };
}

function getRandomIPFromRanges(ipRanges) {
  const randomIndex = Math.floor(Math.random() * ipRanges.length);
  const [start, end] = cidrToRange(ipRanges[randomIndex]);
  return randomIpFromRange(start, end);
}

function cidrToRange(cidr) {
  const [ip, prefix] = cidr.split('/');
  const mask = ~((1 << (32 - prefix)) - 1);
  const baseIp = ip.split('.').reduce((acc, octet, index) => acc + (parseInt(octet) << ((3 - index) * 8)), 0);
  const startIp = baseIp & mask;
  const endIp = baseIp | (~mask & 0xffffffff);
  return [startIp, endIp];
}

function randomIpFromRange(start, end) {
  const randomIp = Math.floor(Math.random() * (end - start + 1)) + start;
  return `${(randomIp >> 24) & 0xff}.${(randomIp >> 16) & 0xff}.${(randomIp >> 8) & 0xff}.${randomIp & 0xff}`;
}

const proxyServer = async (req, res) => {
  try {
    const targetUrl = url.parse(req.url, true).query.url;

    if (!targetUrl) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request: Missing target URL');
      return;
    }

    // Generate new session settings if not already generated
    if (!sessionSettings) {
      sessionSettings = generateSessionSettings();
    }

    const {
      ip,
      userAgent,
      referer,
      acceptEncoding,
      acceptLanguage,
      operatingSystem,
      screenResolution,
      timeZone,
      batteryStatus,
      deviceModel,
      canvasData,
      webglData,
      browserCharacteristics,
      osCharacteristics,
      navigatorPlatform,
      navigatorVendor,
      navigatorHardwareConcurrency,
      installedPlugins
    } = sessionSettings;

    const options = {
      hostname: url.parse(targetUrl).hostname,
      port: url.parse(targetUrl).port || (url.parse(targetUrl).protocol === 'https:' ? 443 : 80),
      path: url.parse(targetUrl).path,
      method: req.method,
      headers: {
        'X-Forwarded-For': ip,
        'User-Agent': userAgent,
        'Referer': referer,
        'Accept-Encoding': acceptEncoding,
        'Accept-Language': acceptLanguage,
        'Connection': 'close', // Make it look like a direct connection
        'X-Operating-System': operatingSystem,
        'X-Screen-Resolution': screenResolution,
        'X-Time-Zone': timeZone,
        'X-Battery-Status': batteryStatus,
        'X-Installed-Plugins': installedPlugins,
        'X-Device-Model': deviceModel,
        'X-Canvas-Data': canvasData,
        'X-WebGL-Data': webglData,
        'X-Browser-Characteristics': browserCharacteristics,
        'X-OS-Characteristics': osCharacteristics,
        'X-Navigator-Platform': navigatorPlatform,
        'X-Navigator-Vendor': navigatorVendor,
        'X-Navigator-Hardware-Concurrency': navigatorHardwareConcurrency
      }
    };

    const protocol = url.parse(targetUrl).protocol === 'https:' ? https : http;
    const proxyRequest = protocol.request(options, (proxyResponse) => {
      res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
      proxyResponse.pipe(res, { end: true });
    });

    proxyRequest.on('error', (err) => {
      console.error('Proxy request error:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    });

    req.pipe(proxyRequest, { end: true });

  } catch (err) {
    console.error('Proxy server error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
};

// Use middleware to handle the /proxy endpoint
app.use('/proxy', proxyServer);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});