const axios = require("axios");
const FormData = require("form-data");
const { serialize } = require("object-to-formdata");

describe("POST /api/v1/admin/auth/forgotPassword", () => {
  let email;

  beforeEach(() => {
    email = "riddhi.p@thinkwik.com";
  });

  const exec = async () => {
    return new Promise(async (resolve) => {
      try {
        const formData = new FormData();

        const data = serialize({ email }, { indices: true }, formData);

        const res = await axios({
          method: "post",
          url: `${process.env.BASE_PATH}/admin/auth/forgotPassword`,
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
  it("should return 200 with code `SUCCESS` if forgot password link send successfully", async () => {
    email = "admin@mei.org.mw";

    const response = await exec();

    expect(response.statusCode).toBe(200);
    expect(response.status).toBe("SUCCESS");
  });

  it("should return 400 with code `NO_USER_FOUND_FOR_THIS_EMAIL` if user not found for this email ", async () => {
    email = "dW@gmail.com";
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("NO_USER_FOUND_FOR_THIS_EMAIL");
  });

  it("should return 400 with code `INVALID_EMAIL` if Email address is invalid", async () => {
    email = "111";
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_EMAIL");
  });
});
