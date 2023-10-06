const axios = require("axios");
const FormData = require("form-data");
const { serialize } = require("object-to-formdata");
var qs = require("qs");
var data = qs.stringify({});
const { login } = require("../../../helpers/utils.helper");
let mentorId = "NRQyHEj2AIFMiCclI3AKLZet";

describe("DELETE /api/v1/admin/mentor", () => {
  const exec = async () => {
    return new Promise(async (resolve) => {
      try {
        const formData = new FormData();

        const res = await axios({
          method: "delete",
          url: `${process.env.BASE_PATH}/admin/mentor/${mentorId}`,
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

  it("should return 200 with code `SUCCESS` if delete Mentor successfully Done", async () => {
    const {
      mentoraccessToken: accessTokenOrg,
      mentorRefreshToken: refreshTokenOrg,
    } = await login();
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    const response = await exec();

    expect(response.statusCode).toBe(200);
    expect(response.status).toBe("SUCCESS");
  });

  it("should return 400 with code `INVALID_MENTOR` if MentorId is not valid ", async () => {
    const {
      mentoraccessToken: accessTokenOrg,
      mentorRefreshToken: refreshTokenOrg,
    } = await login();
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    mentorId = "dfsdfs";
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_MENTOR");
  });

  it("should return 401 with code `UNAUTHORIZED` if Unauthorized to use this content ", async () => {
    const {
      mentoraccessToken: accessTokenOrg,
      mentorRefreshToken: refreshTokenOrg,
    } = await login();
    refreshToken = refreshTokenOrg;
    accessToken = "sqsq";

    const response = await exec();

    expect(response.statusCode).toBe(401);
    expect(response.status).toBe("UNAUTHORIZED");
  });
});
