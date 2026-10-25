const version = process.versions.node;
const stableNode24 = /^24\.(\d+)\.\d+$/.exec(version);

if (!stableNode24 || Number(stableNode24[1]) < 3) {
  console.error(
    `Verification requires Node 24.3 or newer within 24.x; found ${version}. Select a supported Node version on PATH and rerun the command.`,
  );
  process.exit(1);
}

console.log(`Verification runtime: Node ${version}`);
