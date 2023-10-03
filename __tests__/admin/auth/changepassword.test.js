const axios = require("axios");
const FormData = require("form-data");
const { serialize } = require("object-to-formdata");
const { PASSWORD } = require("../../../helpers/config.helper");
const { login } = require("../../../helpers/utils.helper");

describe("PUT /api/v1/admin/auth/password", () => {
  let refreshToken;
  let accessToken;
  let password;
  let newPassword;
  let confirmPassword;

  beforeEach(() => {
    accessToken = "";
    refreshToken = "";
    password = PASSWORD;
    newPassword = PASSWORD;
    confirmPassword = PASSWORD;
  });

  const exec = async () => {
    return new Promise(async (resolve) => {
      try {
        const formData = new FormData();
        const data = serialize(
          { password, newPassword, confirmPassword },
          { indices: true },
          formData
        );

        const res = await axios({
          method: "put",
          url: `${process.env.BASE_PATH}/admin/auth/password`,
          headers: {
            "x-mei-auth-token": accessToken,
            "x-client-id": "someid",
            ...data.getHeaders(),
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

  it("should return 200 with code `SUCCESS` if all fields are valid", async () => {
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

  it("should return 400 with code `INVALID_PASSWORD` if password is not valid", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    password = "";
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_PASSWORD");
  });

  //if neewpassword and confirmpassword are mismach
  it("should return 400 with code `PASSWORDS_DO_NOT_MATCH` if New password & Confirm password are diffrent", async () => {
    // newPassword = 123456789;
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    confirmPassword = 123456789055;
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("PASSWORDS_DO_NOT_MATCH");
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
