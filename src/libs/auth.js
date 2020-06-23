'use-strict';
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-explicit-any */
const axios = require('axios');
const tough = require('tough-cookie');
const axiosCookieJarSupport = require('axios-cookiejar-support');
const tokens = require('../utils/tokens');
const Endpoints = require('../utils/endpoints');
const { stringify } = require('querystring');
const fs = require('fs').promises;
axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();
const deviceAuthPath = `${__dirname}/deviceAuthDetails.json`;
const exchangeCode = 'd2ad778847474e75b0d73da376fd8551';

export class Auth {
  public userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36';
  async GenerateDeviceAuth(code: any) {
    if (!code) {
      const instance = axios.create({ jar: cookieJar, withCredentials: true });

      await instance.get(Endpoints.API_REPUTATION, { headers: { 'User-Agent': this.userAgent }, responseType: 'json' });

      await instance.get(Endpoints.CSRF_TOKEN, { headers: { 'User-Agent': this.userAgent } });

      const csrf = cookieJar.toJSON().cookies.find((x) => x.key === 'XSRF-TOKEN');

      const dataAuth = {
        email: email,
        password: password,
        rememberMe: false,
      };

      try {
        await instance.post(Endpoints.API_LOGIN, dataAuth, {
          headers: {
            'x-xsrf-token': csrf.value,
            'Content-Type': 'application/json',
            'User-Agent': this.userAgent,
          },
        });
      } catch (err) {
        await instance.post(Endpoints.API_LOGIN, dataAuth, {
          headers: {
            'x-xsrf-token': csrf.value,
            'Content-Type': 'application/json',
            'User-Agent': this.userAgent,
          },
        });
      }

      code = await instance
        .get(Endpoints.API_EXCHANGE_CODE, {
          headers: {
            'x-xsrf-token': csrf.value,
            'User-Agent': this.userAgent,
          },
          responseType: 'json',
        })
        .then((res) => {
          return res.data;
        });
    }

    const iosToken = await axios
      .post(Endpoints.OAUTH_TOKEN, stringify({ grant_type: 'exchange_code', exchange_code: code }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `basic ${tokens.launcherToken}`,
          'User-Agent': this.userAgent,
        },
        responseType: 'json',
      })
      .then((res) => {
        return res.data;
      });

    const deviceAuthDetails = await axios
      .post(
        `${Endpoints.DEVICE_AUTH}/${iosToken.account_id}/deviceAuth`,
        {},
        { headers: { Authorization: `bearer ${iosToken.access_token}` }, responseType: 'json' },
      )
      .then((res) => {
        return res.data;
      });
    return {
      accountId: deviceAuthDetails.accountId,
      deviceId: deviceAuthDetails.deviceId,
      secret: deviceAuthDetails.secret,
    };
  }
  async getDeviceAuth(exchange: string) {
    let deviceAuthDetails;
    let deviceAuthFileBuffer = '';
    try {
      deviceAuthFileBuffer = await fs.readFile(deviceAuthPath);
    } catch (err) {
      await fs.writeFile(deviceAuthPath, '');
    }
    if (deviceAuthFileBuffer.length !== 0) {
      deviceAuthDetails = JSON.parse(deviceAuthFileBuffer);
    } else {
      deviceAuthDetails = await this.GenerateDeviceAuth(exchange);
      await fs.writeFile(deviceAuthPath, JSON.stringify(deviceAuthDetails));
    }
    const dataAuth = {
      grant_type: 'device_auth',
      account_id: deviceAuthDetails.accountId,
      device_id: deviceAuthDetails.deviceId,
      secret: deviceAuthDetails.secret,
    };
    const fortniteToken = await axios
      .post(Endpoints.OAUTH_TOKEN, stringify(dataAuth), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `basic ${tokens.launcherToken}`,
        },
        responseType: 'json',
      })
      .then((res) => {
        return res.data;
      });
    // console.log(`Your fortnite token is ${fortniteToken.access_token}`);
    return fortniteToken.access_token;
  }
  /**
   * Get OAuth Token for Fortnite Game access
   * @param {string} exchange Token from getOAuthExchangeToken()
   * @returns {object} JSON Object of result
   */
  async getFortniteOAuthToken(exchange: any) {
    const headers: any = {};
    headers['Authorization'] = `basic ${tokens.fortniteToken}`;
    const res = await axios({
      url: Endpoints.OAUTH_TOKEN,
      headers: headers,
      method: 'POST',
      data: stringify({
        GRANT_TYPE: 'exchange_code',
        EXCHANGE_CODE: exchange,
        includePerms: false,
        TOKEN_TYPE: 'eg1',
      }),
    })
      .then((response: any) => {
        return response.data.access_token;
      })
      .catch((error: any) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.reponse.status);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
      });
    return res;
  }
  /**
   *
   * @param {string} token access_token from login data
   * @returns {object} Json objext of result
   */
  async getOAuthExchangeToken(token: any) {
    const headers: any = {};
    headers['Authorization'] = `bearer ${token}`;
    const res = await axios({
      url: Endpoints.OAUTH_EXCHANGE,
      headers: headers,
      method: 'GET',
    })
      .then((response: any) => {
        return response.data.code;
      })
      .catch(function (error: any) {
        return { error: `[getOAuthExchangeToken] Unknown response from gateway ${Endpoints.OAUTH_EXCHANGE}` };
      });
    return res;
  }
  async login(fixAuth: boolean, exchangeCode: string) {
    if (fixAuth != true) {
      const token = await this.getDeviceAuth('aaaaaabbbbcccwe');
      return token;
    } else {
      const token = await this.getDeviceAuth(exchangeCode);
      return token;
    }
  }
}
