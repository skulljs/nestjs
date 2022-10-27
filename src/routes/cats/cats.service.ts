import { Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class CatsService {
  create(createCatDto: CreateCatDto) {
    return prisma.cats.create({ data: createCatDto });
  }

  findAll() {
    return prisma.cats.findMany();
  }

  findOne(id: number) {
    return prisma.cats.findUnique({ where: { id } });
  }

  update(id: number, updateCatDto: UpdateCatDto) {
    return prisma.cats.update({ where: { id }, data: updateCatDto });
  }

  remove(id: number) {
    return prisma.cats.delete({ where: { id } });
  }
}
