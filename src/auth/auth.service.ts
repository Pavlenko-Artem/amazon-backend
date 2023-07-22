import { BadRequestException, Injectable } from '@nestjs/common'
import { faker } from '@faker-js/faker'
import { PrismaService } from 'src/prisma.service'
import { AuthDto } from './auth.dto'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'

@Injectable()
export class AuthService {
	constructor(
		private prismaService: PrismaService,
		private jwtService: JwtService
	) {}

	async register(dto: AuthDto) {
		const oldUser = await this.prismaService.user.findUnique({
			where: { email: dto.email }
		})

		if (oldUser) throw new BadRequestException('Пользователь уже существует')

		const user = await this.prismaService.user.create({
			data: {
				email: dto.email,
				name: faker.person.firstName(),
				avatarPath: faker.image.avatar(),
				phone: faker.phone.number('+7 (###) ###-##-##'),
				password: faker.internet.password()
			}
		})

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields,
			tokens
		}
	}

	private async issueTokens(userId: number) {
		const data = { id: userId }

		const accessToken = this.jwtService.sign(data, {
			expiresIn: '1h'
		})

		const refreshToken = this.jwtService.sign(data, {
			expiresIn: '7d'
		})

		return { accessToken, refreshToken }
	}

	private returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email
		}
	}
}
