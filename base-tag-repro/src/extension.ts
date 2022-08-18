import * as vscode from 'vscode';

let currentPanel: vscode.WebviewPanel | undefined;

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('baseTagRepro.open', async () => {
			if (currentPanel) {
				currentPanel.reveal();
				return;
			}

			const bundledUri = vscode.Uri.joinPath(
				vscode.Uri.parse(context.extensionPath),
				'bundled'
			);

			const htmlContent = new TextDecoder().decode(
				await vscode.workspace.fs.readFile(vscode.Uri.joinPath(bundledUri, 'index.html'))
			);

			currentPanel = vscode.window.createWebviewPanel(
				'repro',
				'Base Tag repro',
				vscode.ViewColumn.Beside,
				{
					enableScripts: true,
				}
			);

			currentPanel.onDidDispose(() => {
				currentPanel = undefined;
			});

			const baseHref = currentPanel.webview.asWebviewUri(bundledUri);

			currentPanel.webview.html = htmlContent
				.replace('<head>', `<head><base href="${baseHref}">`)
				.replace('src="/assets/b.js"', `src="${baseHref}/assets/b.js"`);
		})
	);
}
