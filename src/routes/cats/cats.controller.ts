import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { Authorize } from 'src/decorators/authorize.decorator';
import { IsAuthorizedGuard } from 'src/guards/is-authorized/is-authorized.guard';
import { Roles } from 'src/guards/is-authorized/roles';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';

@ApiTags('cats')
@Controller('cats')
@UseGuards(IsAuthorizedGuard)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @ApiOkResponse({ type: Cat })
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Get()
  @ApiOkResponse({ type: Cat })
  findAll() {
    return this.catsService.findAll();
  }

  @Get('shuffle')
  @ApiOkResponse({ type: Cat })
  findAllShuffle() {
    return this.catsService.findAllShuffle();
  }

  @Get('asyncForEach')
  @ApiOkResponse({ type: Cat })
  findAllAsyncForEach() {
    return this.catsService.findAllAsyncForEach();
  }

  @Get('admin')
  @Authorize(Roles.Admin)
  admin() {
    return this.catsService.admin();
  }

  @Get('crypto')
  crypto() {
    return this.catsService.crypto();
  }

  @Post('sendMail')
  sendMail() {
    return this.catsService.sendMail();
  }

  @Get(':id')
  @ApiOkResponse({ type: Cat })
  findOne(@Param('id') id: string) {
    return this.catsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Cat })
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(+id, updateCatDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Cat })
  remove(@Param('id') id: string) {
    return this.catsService.remove(+id);
  }

  @Get('pdfClass/:id')
  async printPDFFromClass(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.catsService.printPDFFromClass(+id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=example.pdf',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @Get('pdfTemplate/:id')
  async printPDFFromTemplate(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.catsService.printPDFFromTemplate(+id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=example.pdf',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
