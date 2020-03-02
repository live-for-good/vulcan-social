Package.describe({
  name: "lfg-social",
  summary: "Live for Good social package",
  documentation: "README.md",
  version: "0.0.1",
});

Package.onUse(function(api) {
  api.use([
    "vulcan:core@1.12.3",
    "vulcan:forms@1.12.3",
    "vulcan:accounts@1.12.3",
    "vulcan:validation-workflows",
  ]);

  api.mainModule("lib/server/main.js", "server");
  api.mainModule("lib/client/main.js", "client");
});

Package.onTest(function(api) {
  api.use([
    "vulcan:core@1.12.3",
    "vulcan:forms@1.12.3",
    "vulcan:accounts@1.12.3",
    "vulcan:validation-workflows",
  ]);
  api.use([
    "accounts-password",
    "ecmascript",
    "meteortesting:mocha",
    "hwillson:stub-collections",
    "vulcan:test",
  ]);
  api.mainModule("./test/server/index.js", "server");
});
