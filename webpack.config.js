import TerserPlugin from "terser-webpack-plugin";
import path, { dirname } from "path";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const plugins=[];
plugins.push(new BundleAnalyzerPlugin({ "analyzerMode": "static", "openAnalyzer": false, "reportTitle": "cables core", "reportFilename": path.join(__dirname, "dist", "report_core.html") }));

export default () => {
    return {
        "plugins": plugins,
        "mode": "production",
        "entry": "./dist/patch.js",
        "output": {
            "filename": "patch.js",
        },
        "optimization": {
            "concatenateModules": true,
            "minimizer": [new TerserPlugin({
                "extractComments": false,
                "terserOptions": {
                    "output": {"comments": false},
                    "toplevel": true
                }
            })],
            "minimize": true,
            "usedExports": true
        },
        "module": {
            "rules": [
                {"sideEffects": false},
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
    }
}
