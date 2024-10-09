import * as vscode from 'vscode';
import { HoverProvider } from './hoverProvider';

/**
 * This function is called when the extension is activated.
 * It registers the HoverProvider for Python files.
 * @param context - The extension context
 */
export function activate(context: vscode.ExtensionContext) {
	console.log('Activating Python Package Tracker extension.');
	const hoverProvider = new HoverProvider();

	// Register the HoverProvider for Python language
	const providerDisposable = vscode.languages.registerHoverProvider('python', hoverProvider);
	context.subscriptions.push(providerDisposable);

	// Log activation message for debugging purposes
	console.log('Python Package Tracker extension is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('python-package-inspector.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Python Package Inspector!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
