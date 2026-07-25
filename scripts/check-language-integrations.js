#!/usr/bin/env node
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const { mkdirSync, mkdtempSync, rmSync, writeFileSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { dirname, join } = require("node:path");
const { variants } = require("./variants");

const root = join(__dirname, "..");
const executable = join(
  root,
  "node_modules",
  "tree-sitter-cli",
  process.platform === "win32" ? "tree-sitter.exe" : "tree-sitter",
);

function commandOutput(result) {
  return [result.stdout, result.stderr].filter(Boolean).join("\n");
}

function assertCommandSucceeded(result, description) {
  if (result.error) {
    throw new Error(`Failed to ${description}.`, { cause: result.error });
  }
  assert.equal(
    result.status,
    0,
    `${description} failed.\n${commandOutput(result)}`,
  );
}

function assertGnuBreSelection(result, description) {
  assertCommandSucceeded(result, description);
  assert.match(result.stdout, /\(clear_command\b/);
  assert.match(result.stdout, /\(regex_literal\b/);
  assert.doesNotMatch(result.stdout, /\(regex_group_open\b/);
}

function assertNoLanguageSelected(result, description) {
  if (result.error) {
    throw new Error(`Failed to test ${description}.`, {
      cause: result.error,
    });
  }
  assert.notEqual(
    result.status,
    0,
    `${description} unexpectedly selected a language.\n${commandOutput(result)}`,
  );
  assert.match(commandOutput(result), /No language found/);
}

function main() {
  const temporaryDirectory = mkdtempSync(
    join(tmpdir(), "tree-sitter-sed-integrations-"),
  );
  const cacheDirectory = join(temporaryDirectory, "cache");
  const configDirectory = join(temporaryDirectory, "config");
  const fixtureDirectory = join(temporaryDirectory, "fixtures");
  const configPath = join(configDirectory, "config.json");

  try {
    mkdirSync(cacheDirectory);
    mkdirSync(configDirectory);
    mkdirSync(fixtureDirectory);
    writeFileSync(
      configPath,
      `${JSON.stringify({ "parser-directories": [dirname(root)] }, null, 2)}\n`,
    );

    const environment = {
      ...process.env,
      APPDATA: configDirectory,
      LOCALAPPDATA: cacheDirectory,
      NO_COLOR: "1",
      TREE_SITTER_DIR: configDirectory,
      TREE_SITTER_LIBDIR: cacheDirectory,
      XDG_CACHE_HOME: cacheDirectory,
      XDG_CONFIG_HOME: configDirectory,
    };
    const run = (arguments_) =>
      spawnSync(executable, [...arguments_, "--config-path", configPath], {
        cwd: fixtureDirectory,
        encoding: "utf8",
        env: environment,
        windowsHide: true,
      });

    const gnuBreBody = "z\ns/(a)/x/\n";
    const extensionFixture = join(fixtureDirectory, "extension.sed");
    const sedShebangFixture = join(fixtureDirectory, "sed-script");
    const gsedShebangFixture = join(fixtureDirectory, "gsed-script");
    const ereShebangFixture = join(fixtureDirectory, "ere-script");
    const shellWithSedArgumentFixture = join(
      fixtureDirectory,
      "shell-with-sed-argument",
    );
    const highlightFixture = join(fixtureDirectory, "highlight-input");

    writeFileSync(extensionFixture, gnuBreBody);
    writeFileSync(sedShebangFixture, `#!/usr/bin/sed\n${gnuBreBody}`);
    writeFileSync(gsedShebangFixture, `#!/usr/bin/env gsed\n${gnuBreBody}`);
    writeFileSync(ereShebangFixture, `#!/usr/bin/sed -E\n${gnuBreBody}`);
    writeFileSync(
      shellWithSedArgumentFixture,
      `#!/bin/sh /usr/bin/sed\n${gnuBreBody}`,
    );
    writeFileSync(highlightFixture, "s/(a)+/x/\n");

    assertGnuBreSelection(
      run(["parse", "--no-ranges", extensionFixture]),
      "select GNU BRE for a .sed file",
    );
    assertGnuBreSelection(
      run(["parse", "--no-ranges", sedShebangFixture]),
      "select GNU BRE for an option-free sed shebang",
    );
    assertGnuBreSelection(
      run(["parse", "--no-ranges", gsedShebangFixture]),
      "select GNU BRE for an option-free gsed shebang",
    );

    assertNoLanguageSelected(
      run(["parse", "--no-ranges", ereShebangFixture]),
      "sed -E shebang",
    );
    assertNoLanguageSelected(
      run(["parse", "--no-ranges", shellWithSedArgumentFixture]),
      "non-sed interpreter with a sed argument",
    );
    for (const { dialect, regexMode } of variants) {
      const scope = `source.sed.${dialect}.${regexMode}`;
      assertCommandSucceeded(
        run([
          "highlight",
          "--check",
          "--quiet",
          "--scope",
          scope,
          highlightFixture,
        ]),
        `check highlighting for ${scope}`,
      );
    }
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

main();
