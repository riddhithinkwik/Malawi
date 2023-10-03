const axios = require("axios");
const FormData = require("form-data");
const { serialize } = require("object-to-formdata");
const { login } = require("../../../helpers/utils.helper");

describe("POST /admin/auth/token/refresh", () => {
  let refreshToken;
  let accessToken;

  beforeEach(() => {
    accessToken = "";
    refreshToken = "";
  });

  const exec = async () => {
    return new Promise(async (resolve) => {
      try {
        const formData = new FormData();

        const data = serialize({ refreshToken }, { indices: true }, formData);

        const res = await axios({
          method: "post",
          url: `${process.env.BASE_PATH}/admin/auth/token/refresh`,
          headers: {
            "x-mei-auth-token": accessToken,
            "x-client-id": "someid",
          },
          data: data,
        });
        return resolve(res.data);
      } catch (e) {
        if (e.isAxiosError) {
          return resolve(e.response.data);
        }
        return resolve(e);
      }
    });
  };

  it("should return 200 with code `SUCCESS` Successfully generated a refresh token.", async () => {
    const {
      userRefreshToken: refreshTokenOrg,
      useraccessToken: accessTokenOrg,
    } = await login();
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;

    const response = await exec();

    expect(response.statusCode).toBe(200);
    expect(response.status).toBe("SUCCESS");
  });

  it("should return 400 with code `INVALID_REFRESH_TOKEN` if Token is invalid", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    refreshToken = "";
    accessToken = accessTokenOrg;

    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_REFRESH_TOKEN");
  });

  it("should return 401 with code `UNAUTHORIZED` if Unauthorized to use this content ", async () => {
    refreshToken = "dddddsdsa";
    const response = await exec();

    expect(response.statusCode).toBe(401);
    expect(response.status).toBe("UNAUTHORIZED");
  });
});
