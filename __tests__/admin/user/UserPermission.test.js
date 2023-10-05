const axios = require("axios");
const FormData = require("form-data");
const { serialize } = require("object-to-formdata");
var qs = require("qs");
var data = qs.stringify({});
const { login } = require("../../../helpers/utils.helper");
let userId = "614nxDBlVMoGZMJl5tCGc6HJ";

describe("PUT /api/v1/admin/user", () => {
  let userStatus;
  let userClass;
  let mentorId;
  let refreshToken;
  let accessToken;

  beforeEach(() => {
    accessToken = "";
    refreshToken = "";
    userStatus = "";
    userClass = "";
    mentorId = "";
  });

  const exec = async () => {
    return new Promise(async (resolve) => {
      try {
        const formData = new FormData();

        const data = serialize(
          {
            userStatus,
            userClass,
            mentorId,
          },
          { indices: true },
          formData
        );
        const res = await axios({
          method: "put",
          url: `${process.env.BASE_PATH}/admin/user/${userId}/approval`,
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

  it("should return 200 with code `SUCCESS` if the User successfully Verified or Rejected", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    userStatus = "VERIFIED";
    userClass = "CRAFTSPERSON";
    mentorId = "Fy5xbwag945O04sdRd4wWXTA";
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    const response = await exec();

    //console.log(response);
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

  it("should return 400 with code `INVALID_USER_STATUS` if User Status is invalid ", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    userStatus = "ok";
    userClass = "CRAFTSPERSON";
    mentorId = "Fy5xbwag945O04sdRd4wWXTA";
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_USER_STATUS");
  });

  it("should return 400 with code `INVALID_USER_CLASS` if User Class  is invalid ", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    userStatus = "VERIFIED";
    userClass = "CRAFTSPERSONsddddddd";
    mentorId = "Fy5xbwag945O04sdRd4wWXTA";
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_USER_CLASS");
  });

  it("should return 400 with code `INVALID_USER` if User Status is invalid ", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    userId = "sdasw";
    userStatus = "VERIFIED";
    userClass = "CRAFTSPERSON";
    mentorId = "Fy5xbwag945O04sdRd4wWXTA";
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_USER");
  });

  it("should return 400 with code `INVALID_MENTOR_ID` if Mentor ID is invalid ", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    userStatus = "VERIFIED";
    userClass = "CRAFTSPERSON";
    mentorId = "dsdd";
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_MENTOR_ID");
  });
});
