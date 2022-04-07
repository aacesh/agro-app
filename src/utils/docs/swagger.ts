import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger"
import {Logger} from "@nestjs/common"

// swagger
const swaggerConfig = new DocumentBuilder()
.setTitle('YoApp Supporter API')
.setDescription('This api is upto version 1.0 and lower')
.setVersion('1.0')
.addTag('app')
.addSecurity('basic', {
  type: 'http',
  scheme: 'basic'
})
.addBearerAuth()
.build()

export default function (app: any) {
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  Logger.log('Swagger initialized')
  SwaggerModule.setup('swagdocs', app, document)
}
