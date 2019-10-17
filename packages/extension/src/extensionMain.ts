import * as vscode from 'vscode'
import { createPreviewPanel } from './Preview'

const isFileVue = () =>
  vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.languageId === 'vue'

const doSyntaxHighlightingForPreviewProps = async () => {
  try {
    const veturGrammarConfiguration = vscode.workspace.getConfiguration('vetur.grammar')
    const customBlocksConfiguration = veturGrammarConfiguration.get('customBlocks') as object
    if (customBlocksConfiguration['preview-props']) {
      return
    }
    const choice = await vscode.window.showInformationMessage(
      'Vue Preview: Update syntax highlighting for <preview-props>?',
      'yes',
      'no'
    )
    await veturGrammarConfiguration.update(
      'customBlocks',
      {
        ...customBlocksConfiguration,
        'preview-props': 'json',
      },
      true
    )
    if (choice !== 'yes') {
      return
    }
    await vscode.commands.executeCommand('vetur.generateGrammar')
  } catch (error) {
    console.error(error)
    vscode.window.showErrorMessage(error)
  }
}

export const activate = (context: vscode.ExtensionContext) => {
  doSyntaxHighlightingForPreviewProps()
  vscode.commands.registerCommand('vuePreview.openPreview', () => {
    if (!isFileVue()) {
      vscode.window.showErrorMessage('no vue file')
      return
    }
    createPreviewPanel({ context })
  })

  
  if (isFileVue() && vscode.workspace.getConfiguration('vuePreview').get('autoOpen')) {
    createPreviewPanel({ context })
  }
}
