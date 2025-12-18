import TerserPlugin from "terser-webpack-plugin";

export default () => {
    return {
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
