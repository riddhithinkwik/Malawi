const axios = require("axios");
const FormData = require("form-data");
const { serialize } = require("object-to-formdata");
const { login } = require("../../../helpers/utils.helper");
let mentorId = "Fy5xbwag945O04sdRd4wWXTA";

describe("PUT /api/v1/admin/adminUser", () => {
  let permanentAddress;

  let fieldOfSpecialization;
  let firstName;
  let lastName;
  let telephone;
  let refreshToken;
  let accessToken;

  beforeEach(() => {
    accessToken = "";
    refreshToken = "";
    permanentAddress = "";

    fieldOfSpecialization = "";
    firstName = "";
    lastName = "";
    telephone = "";
  });

  const exec = async () => {
    return new Promise(async (resolve) => {
      try {
        const formData = new FormData();

        const data = serialize(
          {
            firstName,
            lastName,
            fieldOfSpecialization,
            permanentAddress,
            telephone,
          },
          { indices: true },
          formData
        );
        const res = await axios({
          method: "put",
          url: `${process.env.BASE_PATH}/admin/mentor/${mentorId}`,
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

  it("should return 200 with code `SUCCESS` if adminUser Added successfully Done", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    firstName = "Harshal";
    lastName = "Faldu";
    fieldOfSpecialization = "BCA";
    permanentAddress = "India";
    telephone = "12345678900";
    email = "harshal.f@thinkwik.com";
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
    firstName = "Dhaval";
    lastName = "Patel";
    fieldOfSpecialization = "BEMBA";
    permanentAddress = "India";
    telephone = "1639239823";

    refreshToken = refreshTokenOrg;
    accessToken = "sd";
    const response = await exec();

    expect(response.statusCode).toBe(401);
    expect(response.status).toBe("UNAUTHORIZED");
  });

  it("should return 400 with code `INVALID_MENTOR` if the Mentor Id is invalid or Blank ", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    mentorId = "das";
    firstName = "";
    lastName = "";
    fieldOfSpecialization = "";
    permanentAddress = "";
    telephone = "";

    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;

    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_MENTOR");
  });
});
