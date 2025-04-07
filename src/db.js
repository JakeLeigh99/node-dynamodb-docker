const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1',
  endpoint: process.env.DYNAMODB_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const TABLE_NAME = 'TestTable';

async function scanTable() {
  const params = { TableName: TABLE_NAME };
  return dynamoDB.scan(params).promise();
};

async function addItem(id, name) {
  const params = {
    TableName: TABLE_NAME,
    Item: { id, name },
  };
  
  return dynamoDB.put(params).promise();
}

module.exports = { scanTable, addItem };