import {
  Stack,
  StackProps,
  Duration,
  CfnOutput,
  RemovalPolicy,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, "AppVpc", {
      maxAzs: 2,
      natGateways: 0,
    });

    // ECS cluster
    const cluster = new ecs.Cluster(this, "AppCluster", {
      vpc,
      clusterName: "myapp-cluster",
    });

    // DynamoDB
    const table = new dynamodb.Table(this, "AppTable", {
      tableName: "MyAppTable",
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // ECR Repos
    const backendRepo = ecr.Repository.fromRepositoryName(
      this,
      "BackendRepo",
      "myapp-backend"
    );
    const frontendRepo = ecr.Repository.fromRepositoryName(
      this,
      "FrontendRepo",
      "myapp-client"
    );

    // Backend service
    const backendTaskDef = new ecs.FargateTaskDefinition(
      this,
      "BackendTaskDef",
      {
        cpu: 256,
        memoryLimitMiB: 512,
      }
    );

    const backendContainer = backendTaskDef.addContainer("BackendContainer", {
      image: ecs.ContainerImage.fromEcrRepository(backendRepo),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: "backend" }),
      environment: {
        TABLE_NAME: table.tableName,
        NODE_ENV: "production",
      },
    });
    backendContainer.addPortMappings({ containerPort: 3000 });
    table.grantReadWriteData(backendTaskDef.taskRole);

    const backendService = new ecs.FargateService(this, "BackendService", {
      cluster,
      taskDefinition: backendTaskDef,
      desiredCount: 1,
      assignPublicIp: true,
    });

    // Frontend service
    const frontendTaskDef = new ecs.FargateTaskDefinition(
      this,
      "FrontendTaskDef",
      {
        cpu: 256,
        memoryLimitMiB: 512,
      }
    );

    const frontendContainer = frontendTaskDef.addContainer(
      "FrontendContainer",
      {
        image: ecs.ContainerImage.fromEcrRepository(frontendRepo),
        logging: ecs.LogDrivers.awsLogs({ streamPrefix: "frontend" }),
      }
    );
    frontendContainer.addPortMappings({ containerPort: 80 });

    const frontendService = new ecs.FargateService(this, "FrontendService", {
      cluster,
      taskDefinition: frontendTaskDef,
      desiredCount: 1,
      assignPublicIp: true,
    });

    // Outputs
    new CfnOutput(this, "DynamoDBTable", {
      value: table.tableName,
    });

    new CfnOutput(this, "BackendServiceName", {
      value: backendService.serviceName,
    });

    new CfnOutput(this, "FrontendServiceName", {
      value: frontendService.serviceName,
    });
  }
}
