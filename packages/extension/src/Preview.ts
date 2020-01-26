import * as vscode from 'vscode'
import { getPreviewBase, getNonce, getPreviewBaseWebview, getUri } from './webviewUtils'
import { compile } from './compile'
import { isFileVue } from './extensionMain'
import { Message } from './MessageTypes'

const iconPathNormal = 'packages/extension/images/bolt_original_yellow_optimized.svg'
const iconPathError = 'packages/extension/images/bolt_original_red_optimized.svg'

const measureExecutionTime: (fn: () => void) => void = fn => {
  const NS_PER_MS = 1e6
  const NS_PER_SEC = 1e9
  const start = process.hrtime()
  fn()
  const elapsedTime = process.hrtime(start)
  const elapsedTimeMs = (elapsedTime[0] * NS_PER_SEC + elapsedTime[1]) / NS_PER_MS

  const maxAllowedTime = 5
  if (elapsedTimeMs > maxAllowedTime) {
    false && vscode.window.showErrorMessage(`performance violation: ${elapsedTimeMs}ms`)
    console.log('took: ' + elapsedTimeMs)
  }
}

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
    <link rel="stylesheet" nonce="${nonce}" href="${previewBaseWebview}/preview.css">
    <style id="style" nonce="${nonce}"></style>
  </head>
  <body>
    <div id="app"></div>
    <!--<script type="module" src="${previewBaseWebview}/vue.js" nonce="${nonce}"></script>-->
    <script type="module" src="${previewBaseWebview}/previewMain.js" nonce="${nonce}"></script>
  </body>
</html>
`
}

export const createPreviewPanel = ({ context }: { context: vscode.ExtensionContext }) => {
  const state: { error: string | undefined } = {
    error: undefined,
  }
  const webViewPanel = vscode.window.createWebviewPanel('vuePreview', 'Vue Preview', {
    viewColumn: vscode.ViewColumn.Beside,
    preserveFocus: true,
  })
  webViewPanel.iconPath = state.error
    ? getUri({ context, relativePath: iconPathError })
    : getUri({ context, relativePath: iconPathNormal })
  webViewPanel.webview.options = {
    enableScripts: true,
    enableCommandUris: true,
    localResourceRoots: [getPreviewBase({ context })],
  }
  webViewPanel.webview.html = getPreviewHtml({ context, webview: webViewPanel.webview })

  const update = (source: string | undefined): void => {
    if (!source) {
      return
    }
    const compiled = compile(source)
    if (compiled.error) {
      state.error = 'compile error'
      webViewPanel.iconPath = state.error
        ? getUri({ context, relativePath: iconPathError })
        : getUri({ context, relativePath: iconPathNormal })
      return
    }
    if (state.error && !compiled.error) {
      state.error = undefined
      webViewPanel.iconPath = state.error
        ? getUri({ context, relativePath: iconPathError })
        : getUri({ context, relativePath: iconPathNormal })
    }
    const messages: Message[] = [
      {
        type: 'updateStyle',
        payload: {
          style: compiled.style || '',
        },
      },
      {
        type: 'updateRender',
        payload: {
          render: compiled.render || '',
        },
      },
      {
        type: 'updateScript',
        payload: {
          script: compiled.script || '',
        },
      },
      {
        type: 'updateProps',
        payload: {
          props: compiled.previewProps || '',
        },
      },
    ]
    webViewPanel.webview.postMessage(JSON.stringify(messages))
  }

  update(vscode.window.activeTextEditor?.document.getText())

  vscode.window.onDidChangeActiveTextEditor(textEditor => {
    if (!isFileVue()) {
      return
    }
    update(textEditor?.document.getText())
  })

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
    // measureExecutionTime(() => {
    update(event.document.getText())
    // })
  })

  context.subscriptions.push(
    webViewPanel.webview.onDidReceiveMessage((message: any) => {
      if (message.type === 'setError') {
        const error = message.payload
        state.error = error
        webViewPanel.iconPath = state.error
          ? getUri({ context, relativePath: iconPathError })
          : getUri({ context, relativePath: iconPathNormal })
      }
    })
  )
}
