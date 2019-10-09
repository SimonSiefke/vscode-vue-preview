"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const ROOT = '../../';
const previewPath = 'packages/preview/dist';
exports.getUri = ({ context, relativePath, }) => vscode.Uri.file(path.join(context.extensionPath, ROOT, relativePath));
/**
 * The base for the preview files.
 */
exports.getPreviewBaseWebview = ({ webview, context, }) => webview.asWebviewUri(exports.getUri({ context, relativePath: previewPath }));
exports.getPreviewBase = ({ context }) => exports.getUri({ context, relativePath: previewPath });
exports.getNonce = () => Math.round(Math.random() * 2 ** 20);
//# sourceMappingURL=webViewUtils.js.map