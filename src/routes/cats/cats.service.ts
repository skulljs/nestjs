import { Injectable } from '@nestjs/common';
import { Session as SessionExpress } from 'express-session';
import { Roles } from 'src/guards/is-authorized/roles';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import * as Utils from '../../utils/utils';

@Injectable()
export class CatsService {
  constructor(private readonly mailerService: MailerService, private readonly prisma: PrismaService, private readonly configService: ConfigService) {}

  create(createCatDto: CreateCatDto) {
    return this.prisma.cats.create({ data: createCatDto });
  }

  login(session: SessionExpress) {
    session.user = { isLogged: true, role: Roles.Admin };
    return session.user;
  }

  findAll() {
    return this.prisma.cats.findMany();
  }

  async findAllShuffle() {
    return (await this.prisma.cats.findMany()).shuffle();
  }

  async findAllAsyncForEach() {
    const data = [];
    const cats = await this.prisma.cats.findMany();
    await cats.asyncForEach(async (cat) => {
      const catDb = await this.prisma.cats.findUnique({ where: { id: cat.id } });
      delete catDb.id;
      data.push({ id: cat.id, data: catDb });
    });
    return data;
  }

  admin() {
    return { msg: 'Hello Skulljs Admin !', production: this.configService.get('production') };
  }

  async crypto() {
    const rawData = 'iAmATestString';
    const encryptedData = Utils.crypto.encrypt(rawData);
    return { rawData: Utils.crypto.decrypt(encryptedData), encryptedData: encryptedData, hash: await Utils.crypto.hash(rawData) };
  }

  sendMail() {
    Utils.sendMail(this.mailerService, {
      to: 'user.name@example.com', // list of receivers
      subject: '[skulljs] The cats have been created ✔', // Subject line
      template: 'cats',
      context: {
        // Data to be sent to template engine.
        name: 'john doe',
      },
    });
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
