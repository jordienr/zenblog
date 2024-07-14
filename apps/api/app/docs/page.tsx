import { contract } from "@/contract";

const methodExamples = {
  getPosts: `const posts = await client.getPosts();`,
  getPostBySlug: `const post = await client.getPostBySlug('hello-world');`,
} as const;

export default function Page() {
  // const contractString = JSON.stringify(contract, null, 2);

  // const methodKeys = Object.keys(contract);

  // const methods = methodKeys.map((methodKey) => {
  //   const method = contract[methodKey];
  //   return (
  //     <div key={methodKey}>
  //       <h2>{methodKey}</h2>
  //       <p>{method.summary}</p>
  //       <pre>{methodExamples[methodKey]}</pre>
  //     </div>
  //   );
  // });

  return (
    <div>
      <h1>Zenblog API Docs</h1>

      {/* {methods.map((m) => m)} */}
    </div>
  );
}
