import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";

export async function POST(req) {
  try {
    const { url, format, quality } = await req.json();
    if (!url || !format || !quality) {
      return NextResponse.json(
        { error: "URL, format, dan kualitas harus diisi!" },
        { status: 400 },
      );
    }

    // Pastikan process.cwd() tidak menyebabkan error
    const outputFolder = path.join(
      globalThis.process.cwd(),
      "public/downloads",
    );
    await fs.mkdir(outputFolder, { recursive: true });

    // Ambil judul video
    const titleProcess = spawn("yt-dlp", ["--get-title", url]);

    const titlePromise = new Promise((resolve, reject) => {
      let title = "";

      titleProcess.stdout.on("data", (data) => {
        title += data.toString();
      });

      titleProcess.stderr.on("data", (data) => {
        console.error("Error getting title:", data.toString());
      });

      titleProcess.on("close", (code) => {
        if (code === 0) {
          resolve(title.trim().replace(/[^a-zA-Z0-9-_]/g, "_")); // Bersihkan karakter aneh
        } else {
          reject(new Error("Gagal mendapatkan judul video!"));
        }
      });
    });

    const title = await titlePromise;

    // Buat nama file berdasarkan format & kualitas
    const filename = `${title}_${quality}.${format}`;
    const outputPath = path.join(outputFolder, filename);

    // Argumen yt-dlp untuk mengunduh dengan kualitas yang dipilih
    const ytDlpArgs =
      format === "mp3"
        ? [
            url,
            "-f",
            "bestaudio",
            "--extract-audio",
            "--audio-format",
            "mp3",
            "--audio-quality",
            quality.replace("kbps", ""), // Hapus teks 'kbps' agar sesuai dengan yt-dlp
            "-o",
            outputPath,
          ]
        : [
            url,
            "-f",
            `bestvideo[height<=${quality.replace("p", "")}]+bestaudio/best[height<=${quality.replace("p", "")}]`,
            "-o",
            outputPath,
          ];

    // Jalankan yt-dlp untuk download
    const process = spawn("yt-dlp", ytDlpArgs);

    return new Promise((resolve) => {
      process.on("close", (code) => {
        if (code === 0) {
          resolve(
            NextResponse.json({
              success: true,
              downloadUrl: `/downloads/${filename}`,
            }),
          );
        } else {
          resolve(
            NextResponse.json(
              { error: "Gagal mengonversi video!" },
              { status: 500 },
            ),
          );
        }
      });
    });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
