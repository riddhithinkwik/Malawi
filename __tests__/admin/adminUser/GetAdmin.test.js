const axios = require("axios");
const FormData = require("form-data");
const { serialize } = require("object-to-formdata");
var qs = require("qs");
var data = qs.stringify({});
const { login } = require("../../../helpers/utils.helper");
let adminUserId = "H1M5jJExYewNMrcgXcmvQrTg";

describe("GET /api/v1/admin/adminUser", () => {
  const exec = async () => {
    return new Promise(async (resolve) => {
      try {
        const formData = new FormData();

        const res = await axios({
          method: "get",
          url: `${process.env.BASE_PATH}/admin/adminUser/${adminUserId}`,
          headers: {
            "x-mei-auth-token": accessToken,
            "x-client-id": "someid",
            //...data.getHeaders(),
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

  it("should return 200 with code `SUCCESS` if the adminUser data has been received properly", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    const response = await exec();
    expect(response.statusCode).toBe(200);
    expect(response.status).toBe("SUCCESS");
  });

  it("should return 400 with code `INVALID_USER` if adminUserId is not valid ", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    adminUserId = "dd";
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_USER");
  });

  it("should return 401 with code `UNAUTHORIZED` if Unauthorized to use this content ", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    refreshToken = refreshTokenOrg;
    accessToken = "sqsq";

    const response = await exec();

    expect(response.statusCode).toBe(401);
    expect(response.status).toBe("UNAUTHORIZED");
  });
});
