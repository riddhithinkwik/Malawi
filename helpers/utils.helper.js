const FormData = require("form-data");
const { serialize } = require("object-to-formdata");
const axios = require("axios");
const {
  EMAIL,
  PASSWORD,
  PHONECODE,
  PHONENUMBER,
  FIRSTNAME,
  LASTNAME,
  USERNAME,
  OTPTEXT,
} = require("./config.helper");

async function sleep({ seconds }) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

async function userid() {
  await sleep({ seconds: 0.1 });

  const formData = new FormData();

  const verifyOTPData = serialize(
    {
      phoneCode: PHONECODE,
      phoneNumber: PHONENUMBER,
      firstName: FIRSTNAME,
      lastName: LASTNAME,
      userName: USERNAME,
      otpText: OTPTEXT,
    },
    { indices: true },
    formData
  );

  const res = await axios({
    method: "post",
    url: `${process.env.BASE_PATH}/auth/verifyOtp`,
    headers: {
      "x-client-id": "E8kJGrinqwyRT2rg",
    },
    data: verifyOTPData,
  });

  return {
    userID: res.data.data.user.id,
  };
}

async function login() {
  await sleep({ seconds: 0.1 });

  const formData = new FormData();

  const loginData = serialize(
    { email: EMAIL, password: PASSWORD },
    { indices: true },
    formData
  );

  const loginRes = await axios({
    method: "post",
    url: `${process.env.BASE_PATH}/auth/login`,
    headers: {
      "x-client-id": "E8kJGrinqwyRT2rg",
    },
    data: loginData,
  });
  //console.log(loginRes.data);
  return {
    userAccessToken: loginRes.data.data.accessToken,
    userRefreshToken: loginRes.data.data.refreshToken,
    email: loginRes.data.data.user.email,
  };
}

module.exports = {
  userid,
  login,
};
