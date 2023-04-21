import { expect, vi } from "vitest";

export type FetchFn = (
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) => Promise<Response>;

export interface FetchParams {
  input: RequestInfo | URL;
  init?: RequestInit | undefined;
}

export const response = (status: number, body: any | undefined): Response => {
  let resp = {
    status,
    ok: status >= 200 && status < 300,
    redirected: status >= 300 && status < 400,
    json: () =>
      new Promise((resolve, reject) =>
        body ? resolve(body) : reject(new Error("no body"))
      ),
    text: () =>
      new Promise((resolve, reject) =>
        body ? resolve(body) : reject(new Error("no body"))
      ),
    headers: new Headers({}),
    clone: () => resp,
  };
  return resp as Response;
};

export const request = (url: string | URL, method: string, body?: any) => {
  let req = {
    method: method,
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(body),
  };
};

export default class MockFetch {
  private callStack: FetchParams[];
  private resultStack: Response[];
  private globalFetch: FetchFn;
  private headers: Headers;

  constructor(headers?: HeadersInit | undefined) {
    this.callStack = [];
    this.resultStack = [];
    this.globalFetch = global.fetch;
    this.headers = new Headers(headers);
  }

  start() {
    this.globalFetch = global.fetch;
    const mockFetch = this;
    global.fetch = global.fetch = vi.fn(
      (
        input: RequestInfo | URL,
        init?: RequestInit | undefined
      ): Promise<Response> => {
        return mockFetch.call(input, init);
      }
    );
  }

  finish() {
    global.fetch = this.globalFetch;
    if (this.callStack.length > 0) {
      throw new Error(`expected ${this.callStack.length} more calls`);
    }
    this.callStack = [];
    this.resultStack = [];
  }

  expect(input: RequestInfo | URL, init?: RequestInit | undefined) {
    this.callStack.push({ input, init });
    return this;
  }

  returns(resp: Response) {
    this.resultStack.push(resp);
    return this;
  }

  private call(
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ): Promise<Response> {
    if (this.resultStack.length == 0)
      throw new Error("no results left in the stack");
    if (this.callStack.length == 0)
      throw new Error("no fetch calls left in the stack");
    let result = this.resultStack.pop();
    let expected = this.callStack.pop();
    expect(result).not.toEqual(undefined);
    expect(expected).not.toEqual(undefined);
    expect(input).toStrictEqual(expected?.input);
    expect(init).toStrictEqual(expected?.init);
    return Promise.resolve(result || ({} as Response));
  }
}
