import { Handlers, PageProps } from "$fresh/server.ts";
import { ModuleDoc } from "https://deno.land/x/deno_doc_components@0.4.14/doc/module_doc.tsx";
import {
  DocPageNavItem,
  ModuleIndexPanel,
} from "$doc_components/doc/module_index_panel.tsx";
import { SymbolDoc } from "$doc_components/doc/symbol_doc.tsx";

import { api } from "../../data/api.ts";
import { App } from "../../components/App.tsx";

interface Data {
  base: URL;
  modules: typeof api;
  current?: string;
  currentSymbol?: string;
  currentProperty?: string;
}

export const handler: Handlers<Data> = {
  GET(_req, ctx) {
    const base = new URL(_req.url);
    base.pathname = "/api";
    const slug = ctx.params.slug !== undefined ? ctx.params.slug : "";

    const match = slug.match(
      /^([a-zA-Z_\/.]+)?(~[a-zA-Z0-9_]+)?(\.[a-zA-Z_.]+)?$/,
    );

    if (match === null) {
      return ctx.renderNotFound();
    }

    const current = match[1] ? `/${match[1]}` : undefined;
    const currentSymbol = match[2] ? match[2].substring(1) : undefined;
    const currentProperty = match[3] ? match[3].substring(1) : undefined;

    const resp = ctx.render({
      base,
      current,
      currentSymbol,
      currentProperty,
      modules: api,
    });
    return resp;
  },
};

const createTitle = (props: PageProps<Data>) => {
  const { current, currentSymbol, currentProperty } = props.data;

  const chunks = ["API"];

  if (current) {
    chunks.push(` · ${current}`);
  }

  if (currentSymbol) {
    chunks.push(`~${currentSymbol}`);
  }

  if (currentProperty) {
    chunks.push(`.${currentProperty}`);
  }
  return chunks.join("");
};

export default function ApiPage(props: PageProps<Data>) {
  return (
    <App title={createTitle(props)}>
      <div class="mx-auto max-w-screen-lg flex flex-col md:flex-row-reverse gap-6 py-6">
        <Content {...props} />
        <Sidebar {...props} />
      </div>
    </App>
  );
}

function Sidebar(props: PageProps<Data>) {
  const url = new URL("https://deno.land/x/ldkit");
  return (
    <ModuleIndexPanel
      base={url}
      path="/"
      current={props.data.current}
      currentSymbol={props.data.currentSymbol}
    >
      {props.data.modules as DocPageNavItem[]}
    </ModuleIndexPanel>
  );
}

function Content(props: PageProps<Data>) {
  const { current, currentSymbol, currentProperty } = props.data;

  const url = new URL("https://deno.land/x/ldkit");

  let module = api.find((item) => item.path === current);
  if (!module) {
    module = api[0];
  }

  url.pathname = `${url.pathname}${module.path}`;

  if (!currentSymbol) {
    return (
      <div class="flex-1">
        <ModuleDoc url={url} sourceUrl={url.href}>
          {module.items}
        </ModuleDoc>
      </div>
    );
  }

  let symbol = module.items.find((item) => item.name === currentSymbol);
  if (!symbol) {
    symbol = module.items[0];
  }

  return (
    <div class="flex-1">
      <SymbolDoc url={url} name={symbol.name} property={currentProperty}>
        {[symbol]}
      </SymbolDoc>
    </div>
  );
}
