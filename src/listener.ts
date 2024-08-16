import { Message } from 'amqplib';
import NotesService from './NotesService';
import MailSender from './MailSender';

export default class Listener {
  private _notesService: NotesService;

  private _mailSender: MailSender;

  constructor(notesService: NotesService, mailSender: MailSender) {
    this._notesService = notesService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message: Message | null) {
    if (!message) {
      return;
    }
    try {
      const { userId, targetEmail } = JSON.parse(message.content.toString());

      const notes = await this._notesService.getNotes(userId);
      const result = await this._mailSender.sendEmail(
        targetEmail,
        JSON.stringify(notes)
      );

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}
