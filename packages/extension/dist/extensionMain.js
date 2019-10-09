"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const compile_1 = require("./compile");
const webViewUtils_1 = require("./webViewUtils");
const getPreviewHtml = ({ context, webview, }) => {
    const previewBaseWebview = webViewUtils_1.getPreviewBaseWebview({ webview, context });
    const nonce = webViewUtils_1.getNonce();
    // TODO base
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'none'; img-src 'self' data:; style-src vscode-resource: 'nonce-${nonce}'; script-src 'nonce-${nonce}' 'unsafe-eval';"
    >
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style id="style" nonce="${nonce}"></style>
  </head>
  <body>
    <div id="app"></div>
    <script src="${previewBaseWebview}/vue.js" nonce="${nonce}"></script>
    <script src="${previewBaseWebview}/previewMain.js" nonce="${nonce}"></script>
  </body>
</html>
`;
};
exports.activate = (context) => {
    // vscode.window.onDidChangeActiveTextEditor(event => {
    //   if (event.document.languageId !== 'vue') {
    //     console.log('not vue')
    //     return
    //   }
    //   console.log(event.document.languageId)
    // })
    if (vscode.window.activeTextEditor &&
        vscode.window.activeTextEditor.document.languageId === 'vue') {
        const text = vscode.window.activeTextEditor.document.getText();
        const webViewPanel = vscode.window.createWebviewPanel('vuePreview', 'Vue Preview', {
            viewColumn: vscode.ViewColumn.Beside,
        });
        webViewPanel.webview.options = {
            enableScripts: true,
            enableCommandUris: true,
            localResourceRoots: [webViewUtils_1.getPreviewBase({ context })],
        };
        webViewPanel.webview.html = getPreviewHtml({ context, webview: webViewPanel.webview });
        const updateWebviewPanel = ({ source }) => {
            try {
                const compiled = compile_1.compile({ source });
                console.log(compiled);
                webViewPanel.webview.postMessage(JSON.stringify({
                    command: 'update',
                    payload: {
                        component: {
                            render: compiled.render,
                            style: compiled.style,
                            script: compiled.script,
                        },
                    },
                }));
            }
            catch (error) {
                vscode.window.showErrorMessage(error);
            }
        };
        updateWebviewPanel({ source: vscode.window.activeTextEditor.document.getText() });
        vscode.workspace.onDidChangeTextDocument(event => {
            if (event.contentChanges.length === 0) {
                return;
            }
            if (!vscode.window.activeTextEditor) {
                return;
            }
            if (event.document.uri.fsPath !== vscode.window.activeTextEditor.document.uri.fsPath) {
                return;
            }
            updateWebviewPanel({ source: event.document.getText() });
        });
    }
};
//# sourceMappingURL=extensionMain.js.map