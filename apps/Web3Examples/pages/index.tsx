import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import examples from "@/examples.json";

const SimpleBar = dynamic(() => import("simplebar-react"), {
  ssr: false,
});

export default dynamic(() => Promise.resolve(Home), { ssr: false });

function Home() {
  if (typeof window === "undefined") return null;
  return (
    <>
      <Head>
        <title>Hello Web3!</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className="flex justify-center items-center bg-[#f7f8fa] p-2"
      >
        {/* @ts-ignore */}
        <SimpleBar className="w-full h-full rounded-lg md:rounded-3xl">
          <div
            className="flex flex-col w-full h-full gap-4 p-4 overflow-auto rounded-lg shadow-sm md:gap-8 md:p-8 md:shadow-inner md:rounded-3xl md:bg-[rgba(0,0,0,0.4)]
            md:backdrop-blur-[4px]"
          >
            <div className="w-full text-3xl font-bold md:text-white">
              Web3 代码示例
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {examples.map(({ name, description, url, technologyStack }) => (
                <div
                  key={name}
                  className="flex flex-col gap-2 md:gap-4 p-2 transition-all duration-200 ease-in-out bg-white md:border-white rounded-md md:bg-inherit md:p-4 hover:border
                text-[#24292f] md:text-white border-gray-300 border md:border-0"
                >
                  <div className="flex justify-between">
                    <Link className="text-2xl" href={url}>
                      {name}
                    </Link>
                  </div>
                  <div className="text-sm text-[#57606a] md:text-inherit">
                    {description}
                  </div>
                  <div className="text-sm font-bold">技术栈</div>
                  <ul>
                    {technologyStack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </SimpleBar>
      </main>
    </>
  );
}
