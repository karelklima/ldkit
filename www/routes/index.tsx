import { App } from "../components/App.tsx";
import { Jumbo } from "../components/Jumbo.tsx";
import { IconArrowRight } from "../components/Icons.tsx";

export default function Home() {
  return (
    <App activeLink="/">
      <div class="flex flex-col items-center">
        <Jumbo>LDkit</Jumbo>
        <p class="text-5xl font-bold leading-tight pb-10">
          <span class="text-red-800">Linked Data</span> query toolkit<br />
          for <span class="text-red-800">TypeScript</span> developers
        </p>
        <div class="flex flex-row">
          <pre class="p-6 bg-gray-800 text-white rounded-l-lg">
          npm i ldkit
          </pre>
          <a href="/docs" class="block bg-red-800 rounded-r-lg text-white p-6">
            <IconArrowRight />
          </a>
        </div>
      </div>
    </App>
  );
}
