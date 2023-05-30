import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { configuration } from 'src/configs/configuration';

export default async function sendMail(mailerService: MailerService, sendMailOptions: ISendMailOptions) {
  // mail diversion in dev env
  if (!configuration().production) {
    sendMailOptions.subject += `(Diverted from ${sendMailOptions.to})`;
    sendMailOptions.to = configuration().mailerDiversionEmail;
  }
  mailerService.sendMail(sendMailOptions).catch((err) => {
    console.log(err);
  });
}
