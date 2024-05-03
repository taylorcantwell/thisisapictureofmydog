import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image src="/dog.JPG" width={1170 / 2} height={1462 / 2} alt="my-dog" />
    </main>
  );
}
