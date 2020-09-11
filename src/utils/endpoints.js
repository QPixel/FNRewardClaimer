const Endpoints =  Object.freeze({
  // New Logins
  CSRF_TOKEN: 'https://www.epicgames.com/id/api/csrf',
  API_LOGIN: 'https://www.epicgames.com/id/api/login',
  API_EXCHANGE_CODE: 'https://www.epicgames.com/id/api/exchange/generate',
  API_REPUTATION: 'https://www.epicgames.com/id/api/reputation',
  API_AUTHORIZATION_CODE: 'https://www.epicgames.com/id/api/redirect?clientId=ec684b8c687f479fadea3cb2ad83f5c6&responseType=code',
  // Login
  OAUTH_TOKEN: 'https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/token',
  OAUTH_EXCHANGE: 'https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/exchange',
  OAUTH_KILL_SESSION: 'https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/sessions/kill',
  EULA: 'https://eulatracking-public-service-prod06.ol.epicgames.com/eulatracking/api/public/agreements',
  ENTITLEMENTS: 'https://entitlement-public-service-prod08.ol.epicgames.com/entitlement/api/account',
  ORDER_PURCHASE:
    'https://orderprocessor-public-service-ecomprod01.ol.epicgames.com/orderprocessor/api/shared/accounts',
  CAPTCHA_PURCHASE: 'https://www.epicgames.com/store/purchase',
  DEVICE_AUTH: 'https://account-public-service-prod.ol.epicgames.com/account/api/public/account',

  // Launcher
  MANIFEST:
    'https://launcher-public-service-prod06.ol.epicgames.com/launcher/api/public/assets/Windows/4fe75bbc5a674f4f9b356b5c90567da5/Fortnite?label=Live',
  LAUNCHER: 'https://launcher-public-service-prod06.ol.epicgames.com/launcher/api/',
  // Fortnite Public Service
  STAGING_API: 'https://fortnite-public-service-stage.ol.epicgames.com/fortnite/api/version',
  PUBLIC_BASE_URL: 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api',
  CLOUD_STORAGE: 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/cloudstorage/system',
  // LIGHTSWITCH
  LIGHT_SWITCH: 'https://lightswitch-public-service-prod06.ol.epicgames.com/lightswitch/api/service/bulk/status',
});
module.exports = Endpoints;