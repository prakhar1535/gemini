// app/api/bot/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Bot } from "grammy";
import axios from "axios";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

// Catch-all bot errors
bot.catch((err) => {
  console.error("Bot error:", err);
});

bot.on("message", async (ctx) => {
  try {
    if (ctx.message.photo?.length) {
      const photo = ctx.message.photo.at(-1)!;

      // Get file metadata
      const file = await bot.api.getFile(photo.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

      // Download image
      const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
      const base64 = Buffer.from(response.data).toString("base64");

      // ✅ Use caption (if provided) as instruction
      // Example: "write in roman" → Gemini will follow this
      const userInstruction = ctx.message.caption?.trim();

      const apiResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/generate-content`,
        {
          type: "image",
          data: {
            base64,
            platform: "x", // default platform (can be extended later)
            additionalPrompt: userInstruction || null,
          },
        }
      );

      const { content, hashtags, callToAction } = apiResponse.data;

      let reply = content;
      if (hashtags?.length) reply += `\n\n${hashtags.join(" ")}`;
      if (callToAction) reply += `\n\n${callToAction}`;

      await ctx.reply(reply);
    } else if (ctx.message.text) {
      // Regular text messages → just echo or later hook into your text API
      await ctx.reply("You said: " + ctx.message.text);
    } else {
      await ctx.reply(
        "📸 Send me a photo (optionally with a caption like 'write in roman') to generate AI content!"
      );
    }
  } catch (err) {
    console.error("Message handler error:", err);
    await ctx.reply("⚠️ Sorry, something went wrong while processing your request.");
  }
});

// ✅ Webhook handler for Next.js
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Incoming update:", body);

    if (!bot.isInited()) {
      await bot.init();
    }

    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
