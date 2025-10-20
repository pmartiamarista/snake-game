import path from "path";
import { fileURLToPath } from "url";
import webpack from "webpack";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const isProduction = process.env.NODE_ENV === "production";
const devServerPort = process.env.DEV_SERVER_PORT || 8000;

export default {
  entry: "./index.ts",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bootstrap.js",
    publicPath: "/",
    clean: {
      keep: /index\.html$/
    }
  },
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? "source-map" : "eval-source-map",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.CELL_SIZE": JSON.stringify(process.env.CELL_SIZE || "10"),
      "process.env.WORLD_WIDTH": JSON.stringify(process.env.WORLD_WIDTH || "64"),
      "process.env.BASE_FPS": JSON.stringify(process.env.BASE_FPS || "3"),
      "process.env.BASE_CELL_SIZE": JSON.stringify(process.env.BASE_CELL_SIZE || "20"),
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public")
    },
    compress: true,
    port: devServerPort,
    hot: process.env.HOT_RELOAD !== 'false',
    liveReload: process.env.HOT_RELOAD !== 'false',
    open: true,
    historyApiFallback: true
  },
  experiments: {
    asyncWebAssembly: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimize: isProduction,
    splitChunks: isProduction ? {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        wasm: {
          test: /\.wasm$/,
          name: 'wasm',
          chunks: 'all',
          type: 'asset/resource',
        }
      }
    } : false,
    usedExports: isProduction,
    sideEffects: false,
  },
  performance: {
    hints: isProduction ? "warning" : false,
    maxAssetSize: 500000,  // 500KB
    maxEntrypointSize: 500000,  // 500KB
    assetFilter: function(assetFilename) {
      return !assetFilename.endsWith('.wasm');
    }
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  }
};