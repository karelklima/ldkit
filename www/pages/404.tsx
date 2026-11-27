import { App } from "../components/App.tsx";
import { Jumbo } from "../components/Jumbo.tsx";

export default function NotFoundPage() {
  return (
    <App>
      <Jumbo>Oops!</Jumbo>
      <p class="text-center text-xl leading-10 mt-4">
        Something went wrong, the page you requested is missing!
        <br />
        Hopefully we will find it soon.
      </p>
    </App>
  );
}
