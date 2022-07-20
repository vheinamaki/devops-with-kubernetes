const k8s = require("@kubernetes/client-node");
const axios = require("axios").default;
const express = require("express");

const main = async () => {
  const kc = new k8s.KubeConfig();

  const isDev = process.env.NODE_ENV === "development";

  log("Environment: " + isDev ? "Dev" : "Prod");
  isDev ? kc.loadFromDefault() : kc.loadFromCluster();

  const networkingApi = kc.makeApiClient(k8s.NetworkingV1Api);
  const coreApi = kc.makeApiClient(k8s.CoreV1Api);

  // Create resources

  log("Creating service...");
  try {
    await coreApi.createNamespacedService("default", {
      apiVersion: "v1",
      kind: "Service",
      metadata: { name: "dummysite-svc" },
      spec: {
        type: "ClusterIP",
        selector: { app: "dummysite-controller" },
        ports: [{ port: 2345, protocol: "TCP", targetPort: 8000 }],
      },
    });
  } catch (e) {
    if (e.body?.reason === "AlreadyExists") {
      log("Service already found, not recreating");
    } else {
      throw e;
    }
  }

  log("Creating ingress...");
  try {
    await networkingApi.createNamespacedIngress("default", {
      apiVersions: "networking.k8s.io/v1beta1",
      kind: "Ingress",
      metadata: { name: "dummysite-ingress" },
      spec: {
        rules: [
          {
            http: {
              paths: [
                {
                  path: "/",
                  pathType: "Prefix",
                  backend: {
                    service: {
                      name: "dummysite-svc",
                      port: { number: 2345 },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    });
  } catch (e) {
    if (e.body?.reason === "AlreadyExists") {
      log("Ingress already found, not recreating");
    } else {
      throw e;
    }
  }

  let website = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>No dummysite set</title>
    </head>
    <body>
      <p>No dummysite has been set yet.</p>
    </body>
  </html>
  `;

  // Start express server

  const port = process.env.port || 8000;

  const app = express();

  app.get("/", (req, res) => {
    res.send(website);
  });

  app.listen(port, () => {
    log(`DummySite server started on port ${port}`);
  });

  // Listen for dummysite resource
  const watch = new k8s.Watch(kc);

  watch.watch(
    "/apis/stable.dwk/v1/dummysites",
    {},
    async (type, dummySite) => {
      switch (type) {
        case "ADDED":
        case "MODIFIED":
          try {
            log("DummySite resource received:");
            log("Event Type: " + type);
            log(dummySite);
            const url = dummySite.spec.website_url;
            log(`Replacing site with content from ${url}`);
            const res = await axios.get(url, {
              headers: {
                Accept: "text/html, */*",
              },
              responseType: "text",
            });
            website = res.data;
            log("Content replaced successfully");
          } catch (e) {
            log.error("Failed to update DummySite");
            log.error(e);
          }
          break;

        default:
          break;
      }
    },
    (err) => {
      if (err) {
        log.error("Watch error:");
        // Crash the controller if resource watching failed
        throw err;
      } else {
        log("Watch terminated succesfully");
      }
    }
  );
};

const timeStamp = () => `[${new Date().toISOString()}]`;

const log = (msg) => console.log(timeStamp(), msg);

log.error = (msg) => console.error(timeStamp(), "ERROR:", msg);

(async () => {
  try {
    await main();
  } catch (e) {
    log.error(e);
  }
})();
