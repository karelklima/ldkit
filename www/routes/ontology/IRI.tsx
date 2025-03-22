import { App } from "../../components/App.tsx";
import { Jumbo } from "../../components/Jumbo.tsx";

export default function OntologyIRI() {
  return (
    <App>
      <Jumbo>ldkit:IRI</Jumbo>

      <p class="text-center text-xl md:text-3xl font-bold leading-tight pb-7 md:pb-10">
        Welcome, fellow ontologist!
      </p>

      <div class="max-w-xl m-auto markdown-body">
        <h2>Overview</h2>
        <p>
          <code>ldkit:IRI</code>{" "}
          is a term that represents an Internationalized Resource Identifier,
          specially designed to be used with LDkit library in schema
          definitions.
        </p>

        <h2>Identifier</h2>
        <ul>
          <li>
            Prefixed IRI: <code>ldkit:IRI</code>
          </li>
          <li>
            Full IRI: <code>https://ldkit.io/ontology/IRI</code>
          </li>
        </ul>

        <h2>Links</h2>
        <ul>
          <li>
            <a href="/ontology">LDkit Ontology</a>
          </li>
          <li>
            <a href="/ontology/Resource">ldkit:Resource</a>
          </li>
        </ul>
      </div>
    </App>
  );
}
