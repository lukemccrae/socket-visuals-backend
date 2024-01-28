import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { type Construct } from 'constructs';

export class SocketVisualsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an AppSync API with WebSocket support
    const api = new appsync.GraphqlApi(this, 'MyGraphqlApi', {
      name: 'SocketVisualsApi',
      schema: appsync.SchemaFile.fromAsset(
        'infra/graphql/graphql/schema.graphql'
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY
        }
      }
    });

    // Attach the policy to your role
    const subscriptionLambdaRole = new iam.Role(
      this,
      'SubscriptionLambdaExecutionRole',
      {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
      }
    );

    const cloudWatchLogsPolicy = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents'
          ],
          resources: ['*'] // Adjust this to limit resources as needed
        })
      ]
    });

    const cloudwatchPolicy = new iam.Policy(this, 'CloudWatchLogsPolicy', {
      document: cloudWatchLogsPolicy
    });

    subscriptionLambdaRole.attachInlinePolicy(cloudwatchPolicy);

    // Define a Lambda function for handling subscriptions
    const subscriptionLambda = new lambda.Function(this, 'subscriptionLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('src/lambdas/subscriptionLambda/dist'),
      role: subscriptionLambdaRole
    });

    // Create a new resolver for the subscription
    const subscriptionResolver = new appsync.Resolver(
      this,
      'subscriptionResolver',
      {
        typeName: 'Subscription',
        fieldName: 'onMessage',
        dataSource: appsync.LambdaDataSource,
        pipelineConfig: [
          {
            functions: [subscriptionLambda]
          }
        ]
      }
    );

    // Attach the resolver to the API
    api.addResolver(subscriptionResolver);
  }
}
