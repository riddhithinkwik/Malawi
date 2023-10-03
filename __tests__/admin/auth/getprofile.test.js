const axios = require("axios");
const qs = require("qs");
const { login } = require("../../../helpers/utils.helper");

describe("GET /api/v1/admin/auth/me", () => {
  let refreshToken;
  let accessToken;

  beforeEach(() => {
    accessToken = "";
    refreshToken = "";
  });
  const exec = async () => {
    return new Promise(async (resolve) => {
      try {
        const res = await axios({
          method: "get",
          url: `${process.env.BASE_PATH}/admin/auth/me`,
          headers: {
            "x-mei-auth-token": accessToken,
            "x-client-id": "someid",
          },
        });

        return resolve(res.data);
      } catch (e) {
        if (e.isAxiosError) {
          return resolve(e.response.data);
        } else {
          console.log(e);
        }
        return resolve(e);
      }
    });
  };

  it("should return 200 with code `SUCCESS` If the admin successfully retrieves the data", async () => {
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

  it("should return 401 with code `UNAUTHORIZED` if Unauthorized to use this content ", async () => {
    const { accessToken: accessTokenOrg, refreshToken: refreshTokenOrg } =
      await login();
    refreshToken = refreshTokenOrg;
    accessToken = "sqsq";

    const response = await exec();

    expect(response.statusCode).toBe(401);
    expect(response.status).toBe("UNAUTHORIZED");
  });
});
