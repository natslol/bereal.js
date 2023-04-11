# BeReal.js

[![CodeFactor](https://www.codefactor.io/repository/github/natslol/bereal.js/badge)](https://www.codefactor.io/repository/github/natslol/bereal.js)

# Installation 

`npm install --save bereal.js`

[![NPM](https://nodei.co/npm/bereal.js.png)](https://nodei.co/npm/bereal.js/)

# How To Get Refresh Token

### iOS
1. Download [Http traffic capture](https://apps.apple.com/us/app/http-traffic-capture/id1585539533) from the App Store.
2. Open the app, and accept VPN configuration.
3. Create a CA certificate in management and trust it, follow the instruction.
4. Go back to the app, and press `START`.
5. Open the BeReal app and click around a bit (not 1 second). 
6. Go back to the app, press `STOP`, and click on the orange band.
7. Now, find the current record `https://securetoken.googleapis.com`.
8. Click on the request, click on the JSON request body, find `refreshToken` and copy `refreshToken` data.
9. Finaly, and past it int the `.env` file.

### Android
> **Warning** Later 😔

# Preview

![](https://i.imgur.com/59Yv27Y.gif)
