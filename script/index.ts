import { ApiGatewayServiceClient } from '@google-cloud/api-gateway'
import { google } from '@google-cloud/api-gateway/build/protos/protos'
import { fetchOpenAPISpec } from '../shared/fetchOpenAPISpec'

async function createAPI (
  client: ApiGatewayServiceClient,
  createApiParams: google.cloud.apigateway.v1.ICreateApiRequest
) {
  const start = Date.now()
  const [operation] = await client.createApi(createApiParams)
  const [response] = await operation.promise()
  const id = response.name
  const elapsed = Date.now() - start
  return { id, elapsed, response }
}

async function createApiConfig (
  client: ApiGatewayServiceClient,
  createApiConfigParams: google.cloud.apigateway.v1.ICreateApiConfigRequest
) {
  const start = Date.now()
  const [operation] = await client.createApiConfig(createApiConfigParams)
  const [response] = await operation.promise()
  const id = response.name
  const elapsed = Date.now() - start
  return { id, elapsed, response }
}

async function createGateway (
  client: ApiGatewayServiceClient,
  createGatewayParams: google.cloud.apigateway.v1.ICreateGatewayRequest
) {
  const start = Date.now()
  const [operation] = await client.createGateway(createGatewayParams)
  const [response] = await operation.promise()
  const id = response.name
  const elapsed = Date.now() - start
  return { id, elapsed, response }
}

// creates API gateway's three components sequentially
async function createApiGateway () {
  console.log('Starting deployment ...')

  const client = new ApiGatewayServiceClient()
  const projectId = await client.auth.getProjectId()

  // create API resource
  const createApiParams = {
    apiId: 'script-api-example-id',
    parent: `projects/${projectId}/locations/global`
  }
  console.log('createApi ...')
  const createAPIResponse = await createAPI(client, createApiParams)
  console.log('API Created ...\n', createAPIResponse)

  // prep OpenAPI spec document (base64 encode it)
  const openApiDocPath = './shared/example-openapi.yaml'
  const openApiDoc = fetchOpenAPISpec(openApiDocPath)

  // create API Config resource attached to API
  const createApiConfigParams = {
    parent: createAPIResponse.id,
    apiConfigId: 'script-api-config-example-id',
    apiConfig: {
      openapiDocuments: [
        {
          document: {
            contents: openApiDoc,
            path: openApiDocPath
          }
        }
      ],
      grpcServices: null
    }
  }
  console.log('createApiConfig ...')
  const createAPIConfigResponse = await createApiConfig(
    client,
    createApiConfigParams
  )

  console.log('Api Config Created ...\n', createAPIConfigResponse)

  // create Gateway attached to API Config
  const createGatewayParams = {
    parent: `projects/${projectId}/locations/us-central1`,
    gatewayId: 'script-gateway-example-id',
    gateway: {
      apiConfig: createAPIConfigResponse.id
    }
  }
  console.log('createGateway ...')
  const createGatewayResponse = await createGateway(client, createGatewayParams)

  console.log('Gateway Created ...\n', createGatewayResponse)

  console.log(`API Id ${createAPIResponse.elapsed} - ${createAPIResponse.id}`)
  console.log(
    `API Config Id ${createAPIConfigResponse.elapsed} - ${createAPIConfigResponse.id}`
  )
  console.log(
    `Gateway Id ${createGatewayResponse.elapsed} - ${createGatewayResponse.id}`
  )
  console.log('Deployment finished')
}

createApiGateway()
