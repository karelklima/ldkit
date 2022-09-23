export function Footer() {
  return (
    <div class="bg-gray-100">
      <footer class="container mx-auto p-4">
        <p class="text-center">
          <a
            href="https://github.com/karelklima/ldkit"
            class="m-2 inline-block"
          >
            GitHub
          </a>
          <a href="https://deno.land/x/ldkit" class="m-2 inline-block">
            deno.land/x/ldkit
          </a>
          <a
            href="https://www.npmjs.com/package/ldkit"
            class="m-2 inline-block"
          >
            npmjs.com/package/ldkit
          </a>
        </p>
        <p class="text-center p-2 pb-6">
          &copy; 2021 &ndash; present{" "}
          <a href="https://karelklima.com">Karel Klima</a>
        </p>
      </footer>
    </div>
  );
}
