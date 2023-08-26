import { Injectable, NotFoundException } from '@nestjs/common'
import { faker } from '@faker-js/faker'
import { PrismaService } from 'src/prisma.service'
import { returnCategoryObject } from './return-category.object'
import { CategoryDto } from './category.dto'

@Injectable()
export class CategoryService {
	constructor(private prismaService: PrismaService) {}

	async byId(id: number) {
		const category = await this.prismaService.category.findUnique({
			where: { id },
			select: returnCategoryObject
		})

		if (!category) {
			throw new NotFoundException('Категория не найдена')
		}

		return category
	}

	async bySlug(slug: string) {
		const category = await this.prismaService.category.findUnique({
			where: { slug },
			select: returnCategoryObject
		})

		if (!category) {
			throw new NotFoundException('Категория не найдена')
		}

		return category
	}

	async getAll() {
		return this.prismaService.category.findMany({
			select: returnCategoryObject
		})
	}

	async create() {
		return this.prismaService.category.create({
			data: {
				name: '',
				slug: ''
			}
		})
	}

	async update(id: number, dto: CategoryDto) {
		return this.prismaService.category.update({
			where: {
				id
			},
			data: {
				name: dto.name,
				slug: faker.helpers.slugify(dto.name).toLowerCase()
			}
		})
	}

	async detele(id: number) {
		return this.prismaService.category.delete({
			where: {
				id
			}
		})
	}
}
