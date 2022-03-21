import * as apiGateway from '@pulumi/gcp/apigateway'
import { fetchOpenAPISpec } from '../shared/fetchOpenAPISpec'

const apiId = 'pulumi-classic-api-id'
const apiOptions: apiGateway.ApiArgs = {
  apiId
}

const api = new apiGateway.Api(apiId, apiOptions)

const openApiDocPath = '../shared/example-openapi.yaml'

const openApiDoc = fetchOpenAPISpec(openApiDocPath)

const apiConfigId = 'pulumi-classic-api-config-id'

const apiConfigOptions: apiGateway.ApiConfigArgs = {
  api: api.apiId,
  apiConfigId,
  openapiDocuments: [
    {
      document: {
        contents: openApiDoc,
        path: openApiDocPath
      }
    }
  ]
}

const apiConfig = new apiGateway.ApiConfig(apiConfigId, apiConfigOptions, {
  dependsOn: [api]
})

const gatewayId = 'pulumi-classic-gateway-id'

const gatewayOptions: apiGateway.GatewayArgs = {
  apiConfig: apiConfig.name,
  gatewayId
}

const gateway = new apiGateway.Gateway(gatewayId, gatewayOptions, {
  dependsOn: [apiConfig]
})

export { api, apiConfig, gateway }
