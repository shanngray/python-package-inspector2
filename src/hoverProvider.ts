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
        console.log('Range:', range);
        if (!range) {
            console.log('No range found');
            return;
        }

        const importStatement = document.getText(range);
        console.log('Import statement:', importStatement);
        const packageNameMatch = importStatement.match(importRegex);
        const packageName = packageNameMatch ? packageNameMatch[1] || packageNameMatch[2] : null;
        console.log('Package name:', packageName);
        if (!packageName) {
            console.log('No package name found');
            return;
        }

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
                    // If fetching fails, provide a default message
                    console.log(`Package info not found for: ${packageName}`);
                    return new vscode.Hover(`No information available for ${packageName}`);
                }
            } catch (error) {
                console.error(`Error fetching package info for ${packageName}:`, error);
                return new vscode.Hover(`Error fetching information for ${packageName}`);
            }
        }

        // Create markdown content for the hover tooltip
        const markdown = new vscode.MarkdownString(`**${packageName}**\n\n` +
            `📅 Latest Release: ${packageInfo.latestRelease}\n` +
            `👥 Maintainers: ${packageInfo.maintainers}\n` +
            (packageInfo.githubUrl ? 
                `⭐ Stars: ${packageInfo.stars}\n` +
                `🍴 Forks: ${packageInfo.forks}\n` +
                `🔗 [View on GitHub](${packageInfo.githubUrl})`
            : `ℹ️ No GitHub repository found`));
        console.log(`Hover info created for: ${packageName}`);

        return new vscode.Hover(markdown);
    }
}
