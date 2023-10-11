const axios = require("axios");
const FormData = require("form-data");
const { serialize } = require("object-to-formdata");
const { login } = require("../../../helpers/utils.helper");
let eventId = "89VF14dX9Saa2oirEQe8Pqgd";

describe("PUT /api/v1/admin/event/", () => {
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
          method: "put",
          url: `${process.env.BASE_PATH}/admin/event/${eventId}`,
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

  it("should return 200 with code `SUCCESS` if Edit Event successfully done ", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    endDateTime = "2023-11-14T13:08:51.180Z";
    entryRules = "with friend";
    startDateTime = "2023-09-14T13:08:51.180Z";
    title = "Event in !!";

    description = "This is a event of ahmedabad";
    selectedUserClass.push("ASSOCIATE_ENGINEER");
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;

    const response = await exec();

    expect(response.statusCode).toBe(200);
    expect(response.status).toBe("SUCCESS");
  });

  it("should return 400 with code `EVENT_ALREADY_EXIST` if event title is already exist", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    endDateTime = "2023-11-14T13:08:51.180Z";
    entryRules = "with friend";
    startDateTime = "2023-09-14T13:08:51.180Z";
    title = "Event in Ahmedabadhyhjy11!!";

    description = "This is a event of ahmedabad";
    selectedUserClass.push("ASSOCIATE_ENGINEER");
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;

    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("EVENT_ALREADY_EXIST");
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

  it("should return 400 with code `INVALID_EVENT` if event id is envalid ", async () => {
    const {
      useraccessToken: accessTokenOrg,
      userRefreshToken: refreshTokenOrg,
    } = await login();
    eventId = "dedewewd ";
    endDateTime = "2023-11-14T13:08:51.180Z";
    entryRules = "with friend";
    startDateTime = "2023-09-14T13:08:51.180Z";
    title = "Event in Ahmedabadhyhjy11!!";

    description = "This is a event of ahmedabad";
    selectedUserClass.push("ASSOCIATE_ENGINEER");
    refreshToken = refreshTokenOrg;
    accessToken = accessTokenOrg;

    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_EVENT");
  });
});
