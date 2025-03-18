import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export async function POST(req) {
  try {
    const { url, format } = await req.json();
    if (!url || !format) {
      return NextResponse.json(
        { error: "URL dan format harus diisi!" },
        { status: 400 },
      );
    }

    const outputFolder = path.join(process.cwd(), "public", "downloads");
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }

    const filename = `video_${Date.now()}.${format}`;
    const outputPath = path.join(outputFolder, filename);

    const ytDlpArgs =
      format === "mp3"
        ? [
            url,
            "-f",
            "bestaudio",
            "--extract-audio",
            "--audio-format",
            "mp3",
            "-o",
            outputPath,
          ]
        : [url, "-f", "best", "-o", outputPath];

    // Ganti nama variabel dari `process` ke `ytDlpProcess`
    const ytDlpProcess = spawn("yt-dlp", ytDlpArgs);

    return new Promise((resolve) => {
      let errorMsg = "";

      ytDlpProcess.stderr.on("data", (data) => {
        errorMsg += data.toString();
      });

      ytDlpProcess.on("close", (code) => {
        if (code === 0) {
          resolve(
            NextResponse.json({
              success: true,
              downloadUrl: `/downloads/${filename}`,
            }),
          );
        } else {
          console.error("yt-dlp error:", errorMsg);
          resolve(
            NextResponse.json(
              { error: "Gagal mengonversi video!", details: errorMsg },
              { status: 500 },
            ),
          );
        }
      });
    });
  } catch (error) {
    console.error("Terjadi kesalahan server:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
