const AWS = require('aws-sdk');
require('dotenv').config();

const dynamoDB = new AWS.DynamoDB({
  region: 'us-east-1',
  endpoint: process.env.DYNAMODB_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const params = {
  TableName: 'TestTable',
  KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

dynamoDB.createTable(params, (err, data) => {
  console.log('Creating table...');
  if (err && err.code !== 'ResourceInUseException') {
    console.error('Error creating table:', err);
  } else {
    console.log('Table created successfully:');
  };
})