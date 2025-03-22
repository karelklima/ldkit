import { App } from "../../components/App.tsx";
import { Jumbo } from "../../components/Jumbo.tsx";

export default function OntologyResource() {
  return (
    <App>
      <Jumbo>ldkit:Resource</Jumbo>

      <p class="text-center text-xl md:text-3xl font-bold leading-tight pb-7 md:pb-10">
        Welcome, fellow ontologist!
      </p>

      <div class="max-w-xl m-auto markdown-body">
        <h2>Overview</h2>
        <p>
          <code>ldkit:Resource</code>{" "}
          is a term that is used internally in the LDkit library when building
          entities from the RDF graph into shapes defined by data schema. Each
          entity to be decoded from the graph must be of type{" "}
          <code>ldkit:Resource</code> in order to be processed correctly.
        </p>

        <h2>Identifier</h2>
        <ul>
          <li>
            Prefixed IRI: <code>ldkit:Resource</code>
          </li>
          <li>
            Full IRI: <code>https://ldkit.io/ontology/Resource</code>
          </li>
        </ul>

        <h2>Links</h2>
        <ul>
          <li>
            <a href="/ontology">LDkit Ontology</a>
          </li>
          <li>
            <a href="/ontology/IRI">ldkit:IRI</a>
          </li>
        </ul>
      </div>
    </App>
  );
}
