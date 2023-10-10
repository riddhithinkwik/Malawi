const axios = require("axios");
const FormData = require("form-data");
const { serialize } = require("object-to-formdata");
const { login } = require("../../../helpers/utils.helper");

describe("POST /api/v1/admin/mentor", () => {
  let permanentAddress;
  let email;
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
    email = "";
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
            email,
          },
          { indices: true },
          formData
        );
        const res = await axios({
          method: "post",
          url: `${process.env.BASE_PATH}/admin/mentor`,
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
    telephone = "12345658930";
    email = "harshal.f@thinkwik.com";
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    const response = await exec();

    expect(response.statusCode).toBe(200);
    expect(response.status).toBe("SUCCESS");
  });

  it("should return 400 with code `MENTOR_ALREADY_EXISTS` if entered email address is already Exists ", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    firstName = "Dhaval";
    lastName = "Patel";
    fieldOfSpecialization = "BEMBA";
    permanentAddress = "India";
    telephone = "1639239823";
    email = "dhaval@gmail.com";
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("MENTOR_ALREADY_EXISTS");
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
    email = "dhavaal@gmail.com";
    refreshToken = refreshTokenOrg;
    accessToken = "sd";
    const response = await exec();

    expect(response.statusCode).toBe(401);
    expect(response.status).toBe("UNAUTHORIZED");
  });
});
