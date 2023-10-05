const axios = require("axios");
const FormData = require("form-data");
const { serialize } = require("object-to-formdata");
var qs = require("qs");
var data = qs.stringify({});
const { login } = require("../../../helpers/utils.helper");
let adminUserId = "moHcNvUxl7ioJRIfatvLhp4X";

describe("PUT /api/v1/admin/adminUser", () => {
  let title;
  let firstName;
  let lastName;
  let refreshToken;
  let accessToken;

  beforeEach(() => {
    accessToken = "";
    refreshToken = "";
    title = "";
    firstName = "";
    lastName = "";
  });

  const exec = async () => {
    return new Promise(async (resolve) => {
      try {
        const formData = new FormData();

        const data = serialize(
          {
            title,
            firstName,
            lastName,
          },
          { indices: true },
          formData
        );
        const res = await axios({
          method: "put",
          url: `${process.env.BASE_PATH}/admin/adminUser/${adminUserId}`,
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

  it("should return 200 with code `SUCCESS` if adminUser Update successfully Done", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    title = "MRS";
    firstName = "Riddhia";
    lastName = "Prajapatia";
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    const response = await exec();

    expect(response.statusCode).toBe(200);
    expect(response.status).toBe("SUCCESS");
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

  it("should return 400 with code `INVALID_USER` if adminUser is invalid ", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    adminUserId = "asadqwasdw";
    title = "MRS";
    firstName = "Riddhia";
    lastName = "Prajapatia";
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_USER");
  });

  it("should return 400 with code `INVALID_TITLE` if entered title is invalid ", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    adminUserId = "asadqwasdw";
    title = "MRSss";
    firstName = "Riddhia";
    lastName = "Prajapatia";
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_TITLE");
  });
});
