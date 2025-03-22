import { App } from "../../components/App.tsx";
import { Jumbo } from "../../components/Jumbo.tsx";

export default function Ontology() {
  return (
    <App>
      <Jumbo>LDkit ontology</Jumbo>

      <p class="text-center text-xl md:text-3xl font-bold leading-tight pb-7 md:pb-10">
        Welcome, fellow ontologist!
      </p>

      <div class="max-w-xl m-auto markdown-body">
        <h2>Overview</h2>
        <p>
          LDkit ontology is a collection of terms that are utilized when working
          with LDkit library for optimal developer experience.
        </p>

        <h2>Namespace</h2>
        <ul>
          <li>
            Prefix: <code>ldkit</code>
          </li>
          <li>
            URL: <code>https://ldkit.io/ontology/</code>
          </li>
        </ul>

        <h2>Terms</h2>
        <ul>
          <li>
            <a href="/ontology/IRI">ldkit:IRI</a>
          </li>
          <li>
            <a href="/ontology/Resource">ldkit:Resource</a>
          </li>
        </ul>
      </div>
    </App>
  );
}
