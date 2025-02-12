import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import { Response, Request, Headers, fetch } from "cross-fetch";

// ✅ Asegurar compatibilidad con Jest en entornos sin TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// ✅ Mockear Fetch API en Jest
global.Response = Response;
global.Request = Request;
global.Headers = Headers;
(global as any).fetch = fetch;

// ✅ Mockear BroadcastChannel para evitar errores con `msw`
class MockBroadcastChannel {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  postMessage() {}
  close() {}
  onmessage = null;
  onmessageerror = null;
}

(global as any).BroadcastChannel = MockBroadcastChannel;
