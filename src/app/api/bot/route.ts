import { NextRequest, NextResponse } from "next/server";
import { Bot, InlineKeyboard } from "grammy";
import axios from "axios";
import { db } from "@/lib/firebaseAdmin";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.catch((err) => console.error("Bot error:", err));

// Start command — show options
bot.command("start", async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text("✍️ Generate Content", "generate_content")
    .row()
    .text("🎨 Improve Image + Content", "improve_content");

  await ctx.reply(
    "👋 Welcome! What would you like to do?",
    { reply_markup: keyboard }
  );
});

// Handle button clicks
bot.callbackQuery("generate_content", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("📸 Please send me a photo with an optional caption to generate content!");
});

bot.callbackQuery("improve_content", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("📸 Please send me a photo with a caption, I’ll improve the image and content!");
});

// Message handler
bot.on("message", async (ctx) => {
  try {
    if (ctx.message.photo?.length) {
      const photo = ctx.message.photo.at(-1)!;

      // Get file metadata
      const file = await bot.api.getFile(photo.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

      // Download image as buffer
      const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
      const imageBuffer = Buffer.from(response.data);
      const base64Image = imageBuffer.toString("base64");

      // Save to Firestore
      const docRef = await db.collection("telegramPhotos").add({
        userId: ctx.from?.id,
        caption: ctx.message.caption || null,
        timestamp: new Date(),
        imageBase64: base64Image,
      });

      console.log(`✅ Image saved to Firestore with ID: ${docRef.id}`);

      // Decide API endpoint based on last button clicked
      const userChoice = ctx.session?.choice || "generate"; // fallback

      const apiUrl =
        userChoice === "improve"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/improve-content`
          : `${process.env.NEXT_PUBLIC_BASE_URL}/api/generate-content`;

      const apiResponse = await axios.post(apiUrl, {
        type: "image",
        data: {
          base64: base64Image,
          platform: "x",
          additionalPrompt: ctx.message.caption || null,
        },
      });

      const { content, hashtags, callToAction } = apiResponse.data;

      let reply = content;
      if (hashtags?.length) reply += `\n\n${hashtags.join(" ")}`;
      if (callToAction) reply += `\n\n${callToAction}`;

      await ctx.reply(reply);
    } else if (ctx.message.text) {
      await ctx.reply("💡 Use the buttons to select a mode, then send a photo.");
    } else {
      await ctx.reply("📸 Send me a photo with a caption to get started!");
    }
  } catch (err) {
    console.error("Message handler error:", err);
    await ctx.reply("⚠️ Something went wrong while processing your request.");
  }
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Incoming update:", body);

    if (!bot.isInited()) await bot.init();

    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
