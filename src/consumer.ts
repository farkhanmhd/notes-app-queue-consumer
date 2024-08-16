import dotenv from 'dotenv';
import amqp from 'amqplib';
import NotesService from './NotesService';
import MailSender from './MailSender';
import Listener from './listener';

dotenv.config();

const init = async () => {
  const notesService = new NotesService();
  const mailSender = new MailSender();
  const listener = new Listener(notesService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER as string);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:notes', {
    durable: true,
  });

  channel.consume('export:notes', listener.listen, { noAck: true });
};

init();
