// eslint-disable-next-line require-await
exports.handler = async (event) => {
  const AWS = require("aws-sdk");

  const requestParams = JSON.parse(event.body);
  const newPass = requestParams.newPass;
  const email = requestParams.email;

  AWS.config.update({
    accessKeyId: "AKIAJTQG3TNUQDRGXZOA",
    secretAccessKey: "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",
    region: "eu-west-2",
  });

  const ses = new AWS.SES({ apiVersion: "2010-12-01" });
  const params = {
    Destination: {
      ToAddresses: [email], // Must be array
    },
    // ConfigurationSetName: <<ConfigurationSetName>>,
    Message: {
      Body: {
        Html: {
          // HTML Format of the email
          Charset: "UTF-8",
          Data: `<html>
                  <body>
                    >> Success. Your Examgap password has been reset.
                    <br /><br />
                    Your new password is:<br /><br />
                    <strong><code>${newPass}</code></strong>
                  </body>
              </html>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Password reset",
      },
    },
    Source: "support@examgap.com",
  };

  return ses
    .sendEmail(params)
    .promise()
    .then((data) => {
      console.log("email submitted to SES", data);
      return {
        statusCode: 200,
        body: `Message sent`,
      };
    })
    .catch((error) => {
      console.log(error);
      return {
        statusCode: 500,
        body: `Message unsuccesfully sent, error: ${error}`,
      };
    });
};
