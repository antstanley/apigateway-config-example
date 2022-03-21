import * as API from '@pulumi/google-native/apigateway/v1'
import { fetchOpenAPISpec } from '../shared/fetchOpenAPISpec'

const apiId = 'pulumi-native-api-id'
const apiOptions: API.ApiArgs = {
  apiId,
  location: 'global'
}

const api = new API.Api(apiId, apiOptions)

const openApiDocPath = '../shared/example-openapi.yaml'

const openApiDoc = fetchOpenAPISpec(openApiDocPath)

const apiConfigId = 'pulumi-native-api-config-id'

const apiConfigOptions: API.ConfigArgs = {
  apiId,
  apiConfigId,
  openapiDocuments: [
    {
      document: {
        contents: openApiDoc,
        path: openApiDocPath
      }
    }
  ],
  location: 'global'
}

const apiConfig = new API.Config(apiConfigId, apiConfigOptions, {
  dependsOn: [api]
})

const gatewayId = 'pulumi-native-gateway-id'

const gatewayOptions: API.GatewayArgs = {
  apiConfig: apiConfig.name,
  gatewayId
}

const gateway = new API.Gateway(gatewayId, gatewayOptions, {
  dependsOn: [apiConfig]
})

export { api, apiConfig, gateway }
