#!/usr/bin/env node
require("../index.js")
  .main()
  .catch((err) => {
    process.stderr.write(`TAPAC MCP server failed: ${err.stack || err}\n`);
    process.exit(1);
  });
