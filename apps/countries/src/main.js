const laconia = require("@laconia/core");
const adapterApi = require("@laconia/adapter-api");

const app = async orderDetails => {
  throw new Error("Duplicate order Id");
};

const apigateway = adapterApi.apigateway({
  inputType: "body",
  errorMappings: {
    ".*": error => ({
      body: { error: { message: error.message } },
      statusCode: 500
    })
  }
});



exports.handler = laconia(apigateway(app));