const axios = require("axios");
const FormData = require("form-data");
const { serialize } = require("object-to-formdata");

describe("POST /admin/auth/login", () => {
  let email;
  let password;

  beforeEach(() => {
    email = "";
    password = "";
  });

  const exec = async () => {
    return new Promise(async (resolve) => {
      try {
        const formData = new FormData();

        const data = serialize(
          { email, password },
          { indices: true },
          formData
        );

        const res = await axios({
          method: "post",
          url: `${process.env.BASE_PATH}/admin/auth/login`,
          headers: {
            "x-client-id": "someid",
            ...data.getHeaders(),
          },
          data: data,
        });
        console.log(data);

        return resolve(res.data);
      } catch (e) {
        if (e.isAxiosError) {
          return resolve(e.response.data);
        }
        return resolve(e);
      }
    });
  };

  //Enter valid Email and password for Login
  it("should return 200 with code `SUCCESS` if Login successfully", async () => {
    email = "qa@mei.org.mw";
    password = "12345678900";
    const response = await exec();

    expect(response.statusCode).toBe(200);
    expect(response.status).toBe("SUCCESS");
  });

  //enter invalid Email and password
  it("should return 400 with code `INVALID_LOGIN_ATTEMPT` if user not found", async () => {
    email = "asdasdasd@gmail.com";
    password = "112ss233";
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_LOGIN_ATTEMPT");
  });

  //enter invalid Email or password
  it("should return 400 with code `INVALID_LOGIN_ATTEMPT` if emailid or Password is incorrect", async () => {
    email = "qa@mei.org.mw";
    password = "112ss233";
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_LOGIN_ATTEMPT");
  });

  //enter only Email id
  it("should return 400 with code `INVALID_PASSWORD` if password is not valid", async () => {
    email = "qa@mei.org.mw";
    password = "";
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_PASSWORD");
  });

  //enter only password
  it("should return 400 with code `INVALID_EMAIL` if Email address is invalid", async () => {
    email = "";
    password = "Tw@123456";
    const response = await exec();

    expect(response.statusCode).toBe(400);
    expect(response.status).toBe("INVALID_EMAIL");
  });
});
