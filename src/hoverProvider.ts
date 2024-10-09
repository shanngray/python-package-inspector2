import * as vscode from 'vscode';
import { fetchPackageInfo } from './pypi';

/**
 * HoverProvider class implements the HoverProvider interface.
 * It provides hover information for Python import statements.
 */
export class HoverProvider implements vscode.HoverProvider {
    // Cache to store fetched package information to reduce redundant API calls
    private packageCache: Map<string, any> = new Map();

    /**
     * Provides hover information when the user hovers over a package name in an import statement.
     * @param document - The current text document
     * @param position - The position of the cursor
     * @param token - Cancellation token
     * @returns A Hover object with package information or undefined
     */
    async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Hover | undefined> {
        console.log('provideHover called.');
        // Regex to match import statements and capture the package name
        const importRegex = /(?:import\s+(\w+)|from\s+(\w+)\s+import)/;
        const range = document.getWordRangeAtPosition(position, importRegex);
        if (!range) return;

        const importStatement = document.getText(range);
        const packageNameMatch = importStatement.match(importRegex);
        const packageName = packageNameMatch ? packageNameMatch[1] || packageNameMatch[2] : null;
        if (!packageName) return;

        console.log(`Package name extracted: ${packageName}`);

        // Check if the package information is already cached
        let packageInfo = this.packageCache.get(packageName);
        if (!packageInfo) {
            console.log(`Fetching package info for: ${packageName}`);
            try {
                // Fetch package information from PyPI and GitHub
                packageInfo = await fetchPackageInfo(packageName);
                if (packageInfo) {
                    // Store the fetched information in the cache
                    this.packageCache.set(packageName, packageInfo);
                    console.log(`Package info cached for: ${packageName}`);
                } else {
                    // If fetching fails, do not provide hover information
                    console.log(`Package info not found for: ${packageName}`);
                    return;
                }
            } catch (error) {
                console.error(`Error fetching package info for ${packageName}:`, error);
                return;
            }
        }

        // Create markdown content for the hover tooltip
        const markdown = new vscode.MarkdownString(`**${packageName}**\n\n` +
            `⭐ Stars: ${packageInfo.stars}\n` +
            `🍴 Forks: ${packageInfo.forks}\n` +
            `👥 Maintainers: ${packageInfo.maintainers}\n` +
            `📅 Latest Release: ${packageInfo.latestRelease}`);
        console.log(`Hover info created for: ${packageName}`);

        return new vscode.Hover(markdown);
    }
}