import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigatewayv2';
import { CorsHttpMethod, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import * as apigi from '@aws-cdk/aws-apigatewayv2-integrations';

interface ApplicationAPIProps {
  teamsLambdaServices: lambda.IFunction;
}

export class ApplicationAPI extends cdk.Construct {
  public readonly httpApi: apigw.HttpApi;

  constructor(scope: cdk.Construct, id: string, props: ApplicationAPIProps) {
    super(scope, id);

    // API Gateway ------------------------------------------------------
    this.httpApi = new apigw.HttpApi(this, 'Teams-ApiGateway', {
      apiName: 'Teams-ApiGateway',
      createDefaultStage: true,
      corsPreflight: {
        allowHeaders: ["*"],
        allowMethods: [CorsHttpMethod.ANY],
        allowOrigins: ["*"],
        maxAge: cdk.Duration.days(10)
      }
    });

    // Lambda Service -------------------------------------------------
    const waterLambdaServiceIntegration = new apigi.LambdaProxyIntegration({
      handler: props.teamsLambdaServices
    });

    this.httpApi.addRoutes({
      path: `/{proxy+}`,
      methods: [HttpMethod.ANY],
      integration: waterLambdaServiceIntegration,
    });

    // Outputs -----------------------------------------------------------
    new cdk.CfnOutput(this, 'URL', {
      value: `${this.httpApi.apiEndpoint}/teams`
    });
  }
}
