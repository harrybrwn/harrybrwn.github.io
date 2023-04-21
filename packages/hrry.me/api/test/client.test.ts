import { describe, test, beforeEach, afterEach, expect, vi } from "vitest";
import { Client } from "../src";
import MockFetch, { response } from "./fetch";

let localStorageMock = {
  clear: vi.fn(),
  getItem: vi.fn(),
  key: vi.fn(),
  removeItem: vi.fn(),
  setItem: vi.fn(),
  length: 0,
};
vi.stubGlobal("localStorage", localStorageMock);

test("failed test", () => {
  expect(false).to.be.true;
});

describe("client", () => {
  let api: Client;
  const base = new URL("http://localhost:8080/");
  let mockFetch: MockFetch;

  beforeEach(() => {
    api = new Client(new URL(base));
    mockFetch = new MockFetch();
    mockFetch.start();
  });

  afterEach(() => {
    mockFetch.finish();
    vi.restoreAllMocks();
  });

  test("new", () => {
    expect(api.url).toStrictEqual(base);
    expect(api.url.origin).to.eq("http://localhost:8080");
    expect(api.url.protocol).to.eq("http:");
    expect(api.url.host).to.eq("localhost:8080");
    expect(api.url.port).to.eq("8080");
    expect(api.url.pathname).to.eq("/");
  });

  test("login", () => {
    const input = { username: "jim", password: "fdsafdsa" };
    mockFetch
      .expect(new URL("/api/login", new URL(base)), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        credentials: "include",
      })
      .returns(response(200, { msg: "yee", result: true }));
    api.login(input).then((result) => {
      expect(result.msg).to.eq("yee");
      expect(result.result).to.eq(true);
    });
  });

  test("token", () => {
    const input = { username: "jimmy", password: "abcdefg" };
    mockFetch
      .expect(new URL("/api/token", base), {
        method: "POST",
        body: JSON.stringify(input),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
      .returns(
        response(200, {
          token: "<token>",
          refresh_token: "sample-refresh-token",
          token_type: "bearer",
          expires: 1,
        })
      );

    localStorageMock.getItem = vi.fn((k: string): string | null => {
      if (k === "_refresh") return "sample-refresh-token";
      return null;
    });

    api.token(input).then((token) => {
      expect(token.expires).to.eq(1);
      expect(token.type).to.eq("bearer");
      expect(token.refresh).to.eq("sample-refresh-token");
      expect(token.token).to.eq("<token>");
      expect(localStorageMock.getItem).toHaveBeenCalledOnce();
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    });
  });
});
