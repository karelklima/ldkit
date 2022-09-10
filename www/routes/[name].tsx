import { App } from "../components/App.tsx";
import { Jumbo } from "../components/Jumbo.tsx";

export default function Home() {
  return (
    <App activeLink="/">
      <Jumbo>LDkit</Jumbo>
      <p class="text-center">Under construction!</p>
    </App>
  );
}
