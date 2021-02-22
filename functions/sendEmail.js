// eslint-disable-next-line require-await
exports.handler = async (event) => {
  const AWS = require("aws-sdk");

  const requestParams = JSON.parse(event.body);
  const email = requestParams.email;
  const message = requestParams.message;
  const name = requestParams.name;

  AWS.config.update({
    accessKeyId: "AKIAJTQG3TNUQDRGXZOA",
    secretAccessKey: "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",
    region: "eu-west-2",
  });

  const ses = new AWS.SES({ apiVersion: "2010-12-01" });
  const params = {
    Destination: {
      ToAddresses: ["owen@examgap.com"], // Must be array
    },
    // ConfigurationSetName: <<ConfigurationSetName>>,
    Message: {
      Body: {
        Html: {
          // HTML Format of the email
          Charset: "UTF-8",
          Data: `<html>
                  <body>
                    Message from: ${name}
                    <br />
                    Email: ${email}
                    <br />
                    ${message}
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
        Data: "Contact Form",
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
