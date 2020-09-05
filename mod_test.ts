// see https://github.com/jonschlinkert/word-wrap/blob/0a0e06bfe215f3bf3f15f084b3640ed354770a19/test.js
import { assertEquals } from "https://deno.land/std@0.68.0/testing/asserts.ts";

import wrap from "./mod.ts";

const str =
  "A project without documentation is like a project that doesn't exist. Verb solves this by making it dead simple to generate project documentation, using simple markdown templates, with zero configuration required.        ";

Deno.test("should use defaults to wrap words in the given string:", function () {
  assertEquals(
    wrap(str),
    "A project without documentation is like a project \nthat doesn't exist. Verb solves this by making it \ndead simple to generate project documentation, \nusing simple markdown templates, with zero \nconfiguration required.        ",
  );
});

Deno.test("should wrap to the specified width:", function () {
  assertEquals(
    wrap(str, { width: 40 }),
    "A project without documentation is like \na project that doesn't exist. Verb \nsolves this by making it dead simple to \ngenerate project documentation, using \nsimple markdown templates, with zero \nconfiguration required.        ",
  );
});

Deno.test("should indent the specified amount:", function () {
  assertEquals(
    wrap(str, { indent: "      " }),
    "      A project without documentation is like a project \n      that doesn't exist. Verb solves this by making it \n      dead simple to generate project documentation, \n      using simple markdown templates, with zero \n      configuration required.        ",
  );
});

Deno.test("should use the given string for newlines:", function () {
  assertEquals(
    wrap(str, { newline: "\n\n-" }),
    "A project without documentation is like a project \n\n-that doesn't exist. Verb solves this by making it \n\n-dead simple to generate project documentation, \n\n-using simple markdown templates, with zero \n\n-configuration required.        ",
  );
});

Deno.test("should run the escape function on each line", function () {
  assertEquals(
    wrap(str, {
      escape: function (e) {
        return e.replace("'", "\\'");
      },
    }),
    "A project without documentation is like a project \nthat doesn\\'t exist. Verb solves this by making it \ndead simple to generate project documentation, \nusing simple markdown templates, with zero \nconfiguration required.        ",
  );
});

Deno.test("should trim trailing whitespace:", function () {
  assertEquals(
    wrap(str, { trim: true }),
    "A project without documentation is like a project\nthat doesn't exist. Verb solves this by making it\ndead simple to generate project documentation,\nusing simple markdown templates, with zero\nconfiguration required.",
  );
});

Deno.test("should handle strings with just newlines", function () {
  assertEquals(wrap("\r\n", { indent: "\r\n", width: 18 }), "\r\n");
});

Deno.test("should handle newlines that occur at the same position as `options.width`", function () {
  assertEquals(wrap("asdfg\nqwert", { width: 5 }), "asdfg\nqwert");
  assertEquals(
    wrap("aaaaaa\nbbbbbb\ncccccc", { width: 6 }),
    "aaaaaa\nbbbbbb\ncccccc",
  );
});

Deno.test("should handle strings that break where there are multiple spaces", function () {
  assertEquals(wrap("foo foo.  bar", { width: 8 }), "foo foo.  \nbar");
  assertEquals(
    wrap("foo foo.  bar", { width: 8, trim: true }),
    "foo foo.\nbar",
  );
});

Deno.test("should cut one long word", function () {
  assertEquals(
    wrap("Supercalifragilisticexpialidocious", { width: 24, cut: true }),
    "Supercalifragilisticexpi\nalidocious",
  );
});

Deno.test("should cut long words", function () {
  assertEquals(
    wrap(
      "Supercalifragilisticexpialidocious and Supercalifragilisticexpialidocious",
      { width: 24, cut: true },
    ),
    "Supercalifragilisticexpi\nalidocious and Supercali\nfragilisticexpialidociou\ns",
  );
});

Deno.test("should wrap on zero space characters", function () {
  assertEquals(
    wrap("Supercalifragilistic\u200Bexpialidocious", { width: 24 }),
    "Supercalifragilistic\u200B\nexpialidocious",
  );
});
