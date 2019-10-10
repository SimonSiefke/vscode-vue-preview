import * as vscode from 'vscode'
import { getPreviewBase, getNonce, getPreviewBaseWebview } from './webviewUtils'
import { compile } from './compile'

const getPreviewHtml = ({
  context,
  webview,
}: {
  context: vscode.ExtensionContext
  webview: vscode.Webview
}): string => {
  const previewBaseWebview = getPreviewBaseWebview({ webview, context })

  const nonce = getNonce()
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
`
}

export const createPreviewPanel = ({ context }: { context: vscode.ExtensionContext }) => {
  const webViewPanel = vscode.window.createWebviewPanel('vuePreview', 'Vue Preview', {
    viewColumn: vscode.ViewColumn.Beside,
  })
  webViewPanel.webview.options = {
    enableScripts: true,
    enableCommandUris: true,
    localResourceRoots: [getPreviewBase({ context })],
  }
  webViewPanel.webview.html = getPreviewHtml({ context, webview: webViewPanel.webview })

  const update = ({ source }: { source: string }): void => {
    const compiled = compile({ source })
    webViewPanel.webview.postMessage(
      JSON.stringify({
        command: 'update',
        payload: {
          component: {
            render: compiled.render,
            style: compiled.style,
            script: compiled.script,
          },
        },
      })
    )
  }

  update({ source: vscode.window.activeTextEditor.document.getText() })

  vscode.workspace.onDidChangeTextDocument(event => {
    if (event.contentChanges.length === 0) {
      return
    }
    if (!vscode.window.activeTextEditor) {
      return
    }
    if (event.document.uri.fsPath !== vscode.window.activeTextEditor.document.uri.fsPath) {
      return
    }
    update({ source: event.document.getText() })
  })
}
