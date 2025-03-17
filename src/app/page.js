"use client"

import {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';

export default function Home(){
  const [url, setUrl] = useState('');

  const handleSubmit = (e)=>{
    e.preventDefault();
    console.log("URL Youtube: ", url);
  };

  return (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Youtube to MP3/MP4 Converter</h1>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input type="text" placeholder="Masukkan URL Youtube" value={url} onChange={(e) => setUrl(e.target.value)} className="w-64"/>
        <Button type="submit">Convert</Button>
      </form>
 
  </div>
  )
}
