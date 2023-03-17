import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../../prisma.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import * as Utils from '../../utils/utils';

@Injectable()
export class CatsService {
  constructor(private readonly mailerService: MailerService, private readonly prisma: PrismaService) {}

  create(createCatDto: CreateCatDto) {
    return this.prisma.cats.create({ data: createCatDto });
  }

  async findAll() {
    return (await this.prisma.cats.findMany()).shuffle();
  }

  admin() {
    return { msg: 'Hello Skulljs !' };
  }

  findOne(id: number) {
    return this.prisma.cats.findUnique({ where: { id } });
  }

  update(id: number, updateCatDto: UpdateCatDto) {
    return this.prisma.cats.update({ where: { id }, data: updateCatDto });
  }

  remove(id: number) {
    return this.prisma.cats.delete({ where: { id } });
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
    const cat = await this.prisma.cats.findUnique({ where: { id } });
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

  async printPDFFromTemplate(id: number): Promise<Buffer> {
    const cat = await this.prisma.cats.findUnique({ where: { id } });
    return Utils.templateToPDF({ template: 'cats', context: { cat } });
  }
}
