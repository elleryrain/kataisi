import { Telegraf } from "telegraf";
import { InputMediaPhoto } from "telegraf/types";
import { Readable } from "stream";

export class TelegramBot {
  private bot: Telegraf;
  private chatId: number | null = null;

  constructor(private botToken: string) {
    this.bot = new Telegraf(botToken);
  }

  public async start(): Promise<void> {
    this.bot.start((ctx) => {
      this.chatId = ctx.chat.id;
      ctx.reply("Бот активирован!");
    });
    await this.bot.launch();
  }

  // Метод для отправки информации о велосипеде
  public async sendBikeInfo(
    imageBuffers: Buffer[],
    model: string,
    description: string
  ): Promise<void> {
    if (!this.chatId) {
      throw new Error(
        "Chat ID не установлен. Пользователь не активировал бота."
      );
    }

    // Создаем медиа-группу
    const media: InputMediaPhoto[] = imageBuffers.map((buffer, index) => ({
      type: "photo",
      media: { source: buffer }, // Буфер изображения
      caption:
        index === 0
          ? `**Модель**: ${model}\n**Описание**: ${description}`
          : undefined,
      parse_mode: "Markdown", // Для форматирования текста
    }));

    try {
      await this.bot.telegram.sendMediaGroup(this.chatId, media);
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
      throw error;
    }
  }
}
