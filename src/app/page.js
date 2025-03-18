"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("mp3");
  const [quality, setQuality] = useState("192kbps"); // Default quality
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDownloadLink("");

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format, quality }),
      });

      const data = await response.json();
      if (data.success) {
        setDownloadLink(data.downloadUrl);
      } else {
        alert("Gagal mengonversi video.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        YouTube to MP3/MP4 Converter
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Input
          type="text"
          placeholder="Masukkan URL YouTube"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-64"
        />
        <select
          className="border rounded p-2 dark:bg-black dark:text-white"
          value={format}
          onChange={(e) => {
            setFormat(e.target.value);
            setQuality(e.target.value === "mp3" ? "192kbps" : "720p"); // Set default quality
          }}
        >
          <option value="mp3">MP3</option>
          <option value="mp4">MP4</option>
        </select>

        {/* Pilihan kualitas berdasarkan format */}
        {format === "mp3" ? (
          <select
            className="border rounded p-2 dark:bg-black dark:text-white"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
          >
            <option value="128kbps">128kbps</option>
            <option value="192kbps">192kbps (Default)</option>
            <option value="320kbps">320kbps</option>
          </select>
        ) : (
          <select
            className="border rounded p-2 dark:bg-black dark:text-white"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
          >
            <option value="480p">480p</option>
            <option value="720p">720p (Default)</option>
            <option value="1080p">1080p</option>
          </select>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Convert"}
        </Button>
      </form>

      {downloadLink && (
        <div className="mt-4">
          <a href={downloadLink} className="text-blue-500 underline" download>
            Download File
          </a>
        </div>
      )}
    </div>
  );
}
