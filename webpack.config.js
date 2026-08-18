import TerserPlugin from "terser-webpack-plugin";
import path, { dirname } from "path";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { fileURLToPath } from "url";
import cablesWebpackConfig from "@cables/cables/src/webpack/webpack.config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const plugins=[];
// plugins.push(new BundleAnalyzerPlugin({ "analyzerMode": "static", "openAnalyzer": false, "reportTitle": "cables core", "reportFilename": path.join(__dirname, "dist", "report_core.html") }));

export default () => {
  const cablesConfigs = cablesWebpackConfig({
      "mode": "production",
      "entry": "./gen/export/patch.cables",
      "output": {
        "path": path.resolve("./gen/patch/")
      },
      "options": {
        "combinejs": true,
        "minify": false,
        "index": false,
        "analyze": {
          "path": "./gen/reports"
        }
      },
      "plugins": plugins,
    });
  return [
    ...cablesConfigs,
    {
      "plugins": plugins,
            "dependencies": cablesConfigs.map((c) => { return c.name; }),
    "mode": "production",
    "entry": "./gen/patch/js/patch.js",
    "output": {
      "path": path.resolve("./gen/patch/js/"),
      "filename": "patch_webpack.js",
    },
    "optimization": {
      "concatenateModules": true,
      "minimizer": [new TerserPlugin({
        "extractComments": false,
        "terserOptions": {
          "output": { "comments": false },
          "toplevel": true
        }
      })],
      "minimize": true,
      "usedExports": true
    },
    "module": {
      "rules": [
        { "sideEffects": false },
        {
          "test": /\.js$/,
          "enforce": 'pre',
          "use": [
            {
              "loader": "webpack-strip-blocks",
              "options": {
                "blocks": ["minimalcore"],
                "start": '/*',
                "end": '*/'
              }
            }
          ]
        }
      ]
    },
  }];
}
