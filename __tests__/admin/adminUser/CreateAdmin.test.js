const axios = require("axios");
const FormData = require("form-data");
const { serialize } = require("object-to-formdata");
const { login } = require("../../../helpers/utils.helper");

describe("POST /api/v1/admin/adminUser", () => {
  let title;
  let email;
  let password;
  let firstName;
  let lastName;
  let refreshToken;
  let accessToken;

  beforeEach(() => {
    accessToken = "";
    refreshToken = "";
    title = "";
    email = "";
    password = "";
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
            email,
            password,
            firstName,
            lastName,
          },
          { indices: true },
          formData
        );
        const res = await axios({
          method: "post",
          url: `${process.env.BASE_PATH}/admin/adminUser`,
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
    title = "MRS";
    email = "riddhi.p+4@thinkwik.com";
    password = "123456789";
    firstName = "Riddhi";
    lastName = "Prajapati";
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    const response = await exec();

    expect(response.statusCode).toBe(200);
    expect(response.status).toBe("SUCCESS");
  });

  it("should return 400 with code `EMAIL_ALREADY_EXISTS` if enteerd email address is already Exists ", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    title = "MRS";
    email = "chitrodajm@gmail.com";
    password = "123456789";
    firstName = "Riddhi";
    lastName = "Prajapati";
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("EMAIL_ALREADY_EXISTS");
  });

  it("should return 401 with code `UNAUTHORIZED` if Unauthorized to use this content ", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    title = "MRS";
    email = "chitrodajm@gmail.com";
    password = "123456789";
    firstName = "Riddhi";
    lastName = "Prajapati";
    refreshToken = refreshTokenOrg;
    accessToken = "sqsq";

    const response = await exec();

    expect(response.statusCode).toBe(401);
    expect(response.status).toBe("UNAUTHORIZED");
  });

  it("should return 400 with code `INVALID_TITLE` if the title is invalid or Blank ", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    // title = "MRS";
    email = "chitrodajm@gmail.com";
    password = "123456789";
    firstName = "Riddhi";
    lastName = "Prajapati";
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;

    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_TITLE");
  });

  it("should return 400 with code `INVALID_EMAIL` if the email is invalid or Blank ", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    title = "MRS";
    //email = "chitrodajm@gmail.com";
    password = "123456789";
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;

    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_EMAIL");
  });

  it("should return 400 with code `INVALID_PASSWORD` if the Password is invalid or Blank ", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    title = "MRS";
    email = "chitrodajm@gmail.com";
    //password = "123456789";
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;

    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_PASSWORD");
  });
});
