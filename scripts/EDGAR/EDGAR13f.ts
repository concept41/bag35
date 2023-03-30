import { EDGARClient } from "./EDGARClient";

export async function EDGAR13f() {
  console.log('running EDGAR13f()');
  const client = new EDGARClient();
  console.log(await client.get());
}

EDGAR13f();
