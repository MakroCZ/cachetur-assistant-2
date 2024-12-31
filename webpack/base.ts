import TerserPlugin from "terser-webpack-plugin";
import { Configuration, BannerPlugin } from "webpack";
import { generateHeader } from "../plugins/userscript.plugin";

const config: Configuration = {
    entry: "./src/index.ts",
    target: "web",
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.m?ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                resourceQuery: /raw/,
                type: 'asset/source',
            }
        ],
    },
    externals: {
        "@trim21/gm-fetch": "GM_fetch",
        i18next: "i18next",
        "i18next-browser-languagedetector": "i18nextBrowserLanguageDetector",
        "i18next-http-backend": "i18nextHttpBackend",
    },
    optimization: {
        minimize: false,
        minimizer: [new TerserPlugin({
            // minify: TerserPlugin.swcMinify,
            terserOptions: {
                format: {
                    comments: false,
                },
                compress: false,
                mangle: false,
            },
            extractComments: false,
        })],
    },
    plugins: [
        new BannerPlugin({
            banner: generateHeader,
            raw: true,
        })
    ],
    cache: false
};

export default config;