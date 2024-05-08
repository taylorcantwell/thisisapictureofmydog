import { Button } from '@/ui/button';
import { GithubIcon, Heart, ShareIcon, TwitterIcon } from 'lucide-react';
import Image from 'next/image';
import { Comments } from './_components/Comments';

interface HomeProps {
  searchParams: { page?: number };
}

export default function Home(props: HomeProps) {
  return (
    <div className="bg-slate-50 min-h-svh">
      <div className="py-8 px-4 md:px-32 flex flex-col max-w-[1400px] h-full">
        <Header />
        <main className="flex flex-row flex-wrap gap-12 pt-16">
          <div className="relative h-min shrink-0">
            <div className="flex items-center gap-2 right-8 bottom-4 absolute">
              <Button
                className="group relative rounded-full p-2 transition-colors hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                size="icon"
                variant="ghost"
              >
                <Heart className="h-6 w-6 text-red-500 group-hover:text-red-600 dark:text-red-400 dark:group-hover:text-red-500" />
                <span className="absolute -top-2 -right-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white dark:bg-red-400">
                  5
                </span>
              </Button>
            </div>

            <Image
              src="/dog.JPG"
              width={1170 / 3}
              height={1462 / 3}
              alt="my-dog"
              className="rounded p-3 border border-teal-200 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400"
            />
          </div>

          <Comments page={props.searchParams.page} />
        </main>

        <Footer />
      </div>
    </div>
  );
}

function Header() {
  return (
    <header>
      <h1 className=" text-4xl text-center md:text-start md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text">
        This is a picture of my dog.
      </h1>

      <p className="text-2xl font-medium text-gray-600 dark:text-gray-400 mt-2">
        Her name is Lila.
      </p>
    </header>
  );
}

function Footer() {
  return (
    <footer className="w-full  mt-auto">
      <div className="flex flex-col justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-4">
          <a
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="#"
          >
            <ShareIcon className="h-5 w-5" />
            Share
          </a>

          <a
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="#"
          >
            <TwitterIcon className="h-5 w-5" />
            Twitter
          </a>

          <a
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="#"
          >
            <GithubIcon className="h-5 w-5" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
