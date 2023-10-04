const axios = require("axios");
const FormData = require("form-data");
const { serialize } = require("object-to-formdata");

describe("POST /api/v1/admin/auth/resetPassword", () => {
  let email;
  let token;
  let newPassword;
  let confirmPassword;

  beforeEach(() => {
    email = "";
    token = "";
    newPassword = "";
    confirmPassword = "";
  });

  const exec = async () => {
    return new Promise(async (resolve) => {
      try {
        const formData = new FormData();

        const data = serialize(
          { email, token, newPassword, confirmPassword },
          { indices: true },
          formData
        );

        const res = await axios({
          method: "post",
          url: `${process.env.BASE_PATH}/admin/auth/resetPassword`,
          headers: {
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

  it("should return 200 with code `SUCCESS` Resetpassword successfully", async () => {
    email = "qa@mei.org.mw";
    token = "testing";
    newPassword = 12345678900;
    confirmPassword = 12345678900;

    const response = await exec();

    expect(response.statusCode).toBe(200);
    expect(response.status).toBe("SUCCESS");
  });

  it("should return 400 with code `INVALID_RESET_PASSWORD_TOKEN` if link  is invalid/expired", async () => {
    email = "admin@mei.org.mw";
    token = "qq";
    newPassword = 1234567890;
    confirmPassword = 1234567890;
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_RESET_PASSWORD_TOKEN");
  });

  it("should return 400 with code `PASSWORDS_DO_NOT_MATCH` if New password & Confirm password are diffrent", async () => {
    email = "qa@mei.org.mw";
    token = "testing";
    newPassword = 12345678900;
    confirmPassword = 1234567890;
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("PASSWORDS_DO_NOT_MATCH");
  });

  it("should return 400 with code `INVALID_EMAIL` if Email address is invalid", async () => {
    email = "";
    token = "testing";
    newPassword = 12345678900;
    confirmPassword = 1234567890;
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_EMAIL");
  });
});
