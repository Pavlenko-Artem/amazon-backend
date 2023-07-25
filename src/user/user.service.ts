import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { returnUserObject } from './return-user.object'
import { Prisma } from '@prisma/client'
import { UserDto } from './user.dto'
import { hash } from 'argon2'

@Injectable()
export class UserService {
	constructor(private prismaService: PrismaService) {}

	async byId(id: number, selectObject: Prisma.UserSelect = {}) {
		const user = await this.prismaService.user.findUnique({
			where: { id },
			select: {
				...returnUserObject,
				favorites: {
					select: {
						id: true,
						name: true,
						price: true,
						images: true,
						slug: true
					}
				},
				...selectObject
			}
		})

		if (!user) {
			throw new Error('Пользователь не найден')
		}

		return user
	}

	async updateProfile(id: number, dto: UserDto) {
		const isSameUser = await this.prismaService.user.findUnique({
			where: { email: dto.email }
		})

		if (isSameUser && id !== isSameUser.id)
			throw new BadRequestException('Email уже используется')

		const user = await this.byId(id)

		return this.prismaService.user.update({
			where: {
				id
			},
			data: {
				email: dto.email,
				name: dto.name,
				avatarPath: dto.avatarPath,
				phone: dto.email,
				password: dto.password ? await hash(dto.password) : user.password
			}
		})
	}
}
