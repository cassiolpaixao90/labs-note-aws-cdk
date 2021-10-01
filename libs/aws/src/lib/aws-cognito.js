import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as cognito from '@aws-cdk/aws-cognito';

export class CognitoStack extends cdk.Stack {

    constructor(scope) {
        super(scope, 'AppCognito');

        /* Cognito Objects */
        /* Cognito SNS Policy */
        const cognitoSnsRole = new iam.Role(this, 'SNSRole', {
          assumedBy: new iam.ServicePrincipal('cognito-idp.amazonaws.com')
        });

      new iam.Policy(this, 'CognitoSNSPolicy', {
          policyName: 'CognitoSNSPolicy',
          roles: [cognitoSnsRole],
          statements: [
              new iam.PolicyStatement({
                  effect: iam.Effect.ALLOW,
                  actions: ['sns:publish'],
                  resources: ['*'],
              })
          ]
      });

      /* Cognito User Pool */
      this.userPool = new cognito.UserPool(this, 'UserPool', {
          userPoolName: 'App-Cognito',
          selfSignUpEnabled: true,
          accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
          autoVerify: {
            email: true,
            phone: false
          },
          signInAliases: {
            email: true,
            phone: true
          },
          mfa: cognito.Mfa.REQUIRED,
          mfaSecondFactor: {
            sms: true,
            otp: true,
          },
          smsRole: cognitoSnsRole,
          smsRoleExternalId: 'c87467be-4f34-11ea-b77f-2e728ce88125',
          customAttributes: {
              is_provider: new cognito.BooleanAttribute({ mutable: true }),
          },
          passwordPolicy: {
              minLength: 8,
              requireLowercase: false,
              requireDigits: false,
              requireSymbols: false,
              requireUppercase: false,
              tempPasswordValidity: cdk.Duration.days(7)
          },
          userVerification: {
              emailStyle: cognito.VerificationEmailStyle.CODE
          }
      });

      // /* User Pool Client */
      this.userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
          userPoolClientName: 'App-UserPool',
          generateSecret: false,
          userPool: this.userPool,
          preventUserExistenceErrors: true,
          authFlows: {
            userPassword: true,
            userSrp: true
          },
      });

      /* Identity Pool */
      this.identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
          identityPoolName: 'App-IdentityPool',
          allowUnauthenticatedIdentities: false,
          cognitoIdentityProviders: [
              {
                clientId: this.userPoolClient.userPoolClientId,
                providerName: this.userPool.userPoolProviderName
              },
          ],
      });

      /* Cognito Roles */
      /* Unauthorized Role/Policy */
      const unauthorizedRole = new iam.Role(this, 'CognitoUnAuthorizedRole', {
          assumedBy: new iam.FederatedPrincipal(
              'cognito-identity.amazonaws.com',
              {
                  StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                  },
                  'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'unauthenticated'
                  },
              },
              'sts:AssumeRoleWithWebIdentity'
          )
      });

      new iam.Policy(this, 'CognitoUnauthorizedPolicy', {
          policyName: 'CognitoUnauthorizedPolicy',
          roles: [unauthorizedRole],
          statements: [
              new iam.PolicyStatement({
                  effect: iam.Effect.ALLOW,
                  actions: [
                    'mobileanalytics:PutEvents',
                    'cognito-sync:*',
                    'cognito-identity:*'
                  ],
                  resources: ['*'],
              })
          ]
      });

      /* Authorized Role/Policy */
      const authorizedRole = new iam.Role(this, 'CognitoAuthorizedRole', {
          assumedBy: new iam.FederatedPrincipal(
              'cognito-identity.amazonaws.com',
              {
                  StringEquals: { 'cognito-identity.amazonaws.com:aud': this.identityPool.ref },
                  'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'authenticated'
                  },
              },
              'sts:AssumeRoleWithWebIdentity'
          ),
      });

      new iam.Policy(this, 'CognitoAuthorizedPolicy', {
          policyName: 'CognitoAuthorizedPolicy',
          roles: [authorizedRole],
          statements: [
              new iam.PolicyStatement({
                  effect: iam.Effect.ALLOW,
                  actions: ['mobileanalytics:PutEvents', 'cognito-sync:*', 'cognito-identity:*'],
                  resources: ['*']
              }),
              new iam.PolicyStatement({
                  effect: iam.Effect.ALLOW,
                  actions: ['execute-api:Invoke'],
                  resources: ['*']
              })
          ]
      });

      /* Create Default Policy */
      new cognito.CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoleAttachment', {
          identityPoolId: this.identityPool.ref,
          roles: {
            authenticated: authorizedRole.roleArn,
          },
      });

      new cdk.CfnOutput(this, "UserPoolId", {
        value: this.userPool.userPoolId,
      });

      new cdk.CfnOutput(this, "UserPoolClientId", {
        value: this.userPoolClient.userPoolClientId,
      });

      new cdk.CfnOutput(this, "IdentityPoolId", {
        value: this.identityPool.ref,
      });
    }
}