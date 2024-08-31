import React from 'react';
import Deeds from '@/components/deeds/Deeds';


export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Deeds/>
      </div>
    </main>
  );
}
