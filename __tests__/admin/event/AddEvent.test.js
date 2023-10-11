const axios = require("axios");
const FormData = require("form-data");
const { serialize } = require("object-to-formdata");
const { login } = require("../../../helpers/utils.helper");
const fs = require("fs");

describe("POST /api/v1/admin/event", () => {
  let title;
  let description;
  let startDateTime;
  let endDateTime;
  let entryRules;
  let imageIds;
  let selectedUserClass;
  let refreshToken;
  let accessToken;
  let testfile;

  beforeEach(() => {
    accessToken = "";
    refreshToken = "";
    title = "";
    description = "";
    startDateTime = "";
    endDateTime = "";
    imageIds = {};
    selectedUserClass = [];
  });

  const exec = async () => {
    return new Promise(async (resolve) => {
      try {
        const formData = new FormData();
        Object.keys(imageIds).forEach((key) => {
          formData.append(key, imageIds[key]);
        });
        const data = serialize(
          {
            endDateTime,
            entryRules,
            startDateTime,
            title,
            // imageIds,
            description,
            selectedUserClass,
          },
          { indices: true },
          formData
        );

        const res = await axios({
          method: "post",
          url: `${process.env.BASE_PATH}/admin/event`,
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

  it("should return 200 with code `SUCCESS` if  Added successfully Done", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    endDateTime = "2023-11-14T13:08:51.180Z";
    entryRules = "with friend";
    startDateTime = "2023-09-14T13:08:51.180Z";
    title = "Event in Ahmedabadhyhjy11!!";
    const fileread = fs.readFileSync(
      "/Users/krunal/Documents/projects/Malawi/__tests__/admin/Images/man.jpeg"
    );
    const fileread2 = fs.readFileSync(
      "/Users/krunal/Documents/projects/Malawi/__tests__/admin/Images/man.jpeg"
    );

    imageIds["imageIds[0]"] = fileread;
    imageIds["imageIds[1]"] = fileread2;

    testfile = fileread;
    description = "This is a event of ahmedabad";
    selectedUserClass.push("ASSOCIATE_ENGINEER");
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;

    const response = await exec();

    expect(response.statusCode).toBe(200);
    expect(response.status).toBe("SUCCESS");
  });

  it("should return 400  with code `INVALID_START_DATE_AND_TIME` if Entered Start Date is invalid", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    endDateTime = "Harshal";
    entryRules = "Faldu";
    startDateTime = "Dev";
    title = "India";

    description = "harshal.f@thinkwik.com";
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_START_DATE_AND_TIME");
  });

  it("should return 400  with code `INVALID_END_DATE_AND_TIME` if Entered End Date is invalid", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    endDateTime = "Harshal";
    entryRules = "Faldu";
    startDateTime = "2023-09-14T13:08:51.180Z";
    title = "India";

    description = "harshal.f@thinkwik.com";
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_END_DATE_AND_TIME");
  });

  it("should return 400  with code `INVALID_USER_CLASS` if Entered user class is invalid", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    endDateTime = "2023-11-14T13:08:51.180Z";
    entryRules = "Faldu";
    startDateTime = "2023-09-14T13:08:51.180Z";
    title = "India";
    selectedUserClass = ["dfdfdsfrde"];
    description = "harshal.f@thinkwik.com";
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_USER_CLASS");
  });

  it("should return 401 with code `UNAUTHORIZED` if Unauthorized to use this content ", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    endDateTime = "Dhaval";
    entryRules = "Patel";
    startDateTime = "BEMBA";
    title = "India";
    imageIds = "1639239823";
    description = "dhavaal@gmail.com";
    refreshToken = refreshTokenOrg;
    accessToken = "sd";
    const response = await exec();

    expect(response.statusCode).toBe(401);
    expect(response.status).toBe("UNAUTHORIZED");
  });
});
