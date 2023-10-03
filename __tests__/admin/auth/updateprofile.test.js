const axios = require("axios");
const FormData = require("form-data");
const { serialize } = require("object-to-formdata");
const { login } = require("../../../helpers/utils.helper");

describe("PUT /api/v1/admin/auth/me", () => {
  let title;
  let firstName;
  let lastName;
  let avatar;
  let telephone;
  let refreshToken;
  let accessToken;

  beforeEach(() => {
    accessToken = "";
    refreshToken = "";
    title = "";
    firstName = "";
    lastName = "";
    avatar = "";
    telephone = "";
  });

  const exec = async () => {
    return new Promise(async (resolve) => {
      try {
        const formData = new FormData();

        const data = serialize(
          { title, firstName, lastName, telephone, avatar },
          { indices: true },
          formData
        );

        const res = await axios({
          method: "put",
          url: `${process.env.BASE_PATH}/admin/auth/me`,
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
        } else {
          console.log(e);
        }
        return resolve(e);
      }
    });
  };

  it("should return 200 with code `SUCCESS` if all fields are updated", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    title = "MISS";
    firstName = "Prajapati";
    lastName = "Riddhi";
    telephone = "9825919765";
    avatar = "HriKoVDZetLuBS1ODY5ZBezW";

    const response = await exec();

    expect(response.statusCode).toBe(200);
    expect(response.status).toBe("SUCCESS");
  });

  it("should return 200 with code `SUCCESS` if all fields are updated without any changing data", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    // title = "";

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
});
