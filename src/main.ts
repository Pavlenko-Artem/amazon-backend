import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as morgan from 'morgan'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix('api')
	app.enableCors()
	app.use(morgan('dev'))
	await app.listen(5000)
}
bootstrap()
