import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { PrismaClient } from '@prisma/client';
import * as Utils from '../../utils/utils';

const prisma = new PrismaClient();

@Injectable()
export class CatsService {
  constructor(private readonly mailerService: MailerService) {}

  create(createCatDto: CreateCatDto) {
    return prisma.cats.create({ data: createCatDto });
  }

  async findAll() {
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

  sendMail() {
    this.mailerService
      .sendMail({
        to: 'user.name@example.com', // list of receivers
        from: 'noreply@skulljs.com', // sender address
        subject: '[skulljs] The cats have been created ✔', // Subject line
        template: 'cats',
        context: {
          // Data to be sent to template engine.
          name: 'john doe',
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async printPDFFromClass(id: number): Promise<Buffer> {
    const cat = await prisma.cats.findUnique({ where: { id } });
    const pdf = new Utils.PDFGenerator()
      .createDocument()
      .addNewPageListener()
      .newPage()
      .writeTitle('Export Cat')
      .writeSubtitle(`Cat N°${cat.id}`)
      .writeLabelValuePair('name', cat.name, 200)
      .writeLabelValuePair('weight', cat.weight, 200)
      .writeLabelValuePair('color', cat.color, 200)
      .writeLabelValuePair('eyes_color', cat.eyes_color, 200);

    return pdf.closeAndGetBytes();
  }

  async printPDFFromEJS(id: number): Promise<Buffer> {
    const cat = await prisma.cats.findUnique({ where: { id } });
    return Utils.EJSToPDF({ template: 'cats', context: { cat } });
  }
}
