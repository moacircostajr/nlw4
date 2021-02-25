import nodemailer, { Transporter } from 'nodemailer'
import { resolve } from 'path'
import handlebars from 'handlebars'
import fs from 'fs'

class SendMailService {

  private client: Transporter

  // não é permitido usar async/await no construtor
  constructor() {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user, // generated ethereal user
          pass: account.pass, // generated ethereal password
        },
      });
      this.client = transporter
    })
  }

  async execute(to: string, subject: string, body: string) {
    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')
    const templateFileContent = fs.readFileSync(npsPath).toString('utf8')

    const mailTemplateParse = handlebars.compile(templateFileContent)
    const html = mailTemplateParse(
      {
        name: to,
        title: subject,
        description: body
      }
    )

    const message = await this.client.sendMail(
      {
        to,
        subject,
        html,
        from: 'NPS <noreply@nps.com.br>'
      }
    )
    console.log("Message sent: %s", message.messageId)
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message))
  }
}

export default new SendMailService()