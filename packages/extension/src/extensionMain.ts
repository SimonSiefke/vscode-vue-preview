import * as vscode from 'vscode'
import { createPreviewPanel } from './Preview'

const isFileVue = ()=>  vscode.window.activeTextEditor?.document.languageId === 'vue'

export const activate = (context: vscode.ExtensionContext) => {
  vscode.commands.registerCommand('vuePreview.openPreview', ()=>{
    if(!isFileVue()){
      vscode.window.showErrorMessage('no vue file')
      return 
    }
    createPreviewPanel({context})
  })

  // if(isFileVue()){
  //   createPreviewPanel({context})
  // }
}
