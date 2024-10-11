import * as vscode from 'vscode';
import { fetchPackageInfo } from './pypi';

// List of Python 3.12.1 standard library packages
const standardLibraryPackages = [
    '__future__', '__hello__', '_aix_support', '_asyncio', '_bisect', '_blake2', '_bz2', '_codecs_cn', '_codecs_hk', '_codecs_iso2022', '_codecs_jp', '_codecs_kr', '_codecs_tw', '_collections_abc', '_compat_pickle', '_compression', '_contextvars', '_crypt', '_csv', '_ctypes', '_ctypes_test', '_curses', '_curses_panel', '_datetime', '_dbm', '_decimal', '_elementtree', '_hashlib', '_heapq', '_json', '_lsprof', '_lzma', '_markupbase', '_md5', '_multibytecodec', '_multiprocessing', '_opcode', '_osx_support', '_pickle', '_posixshmem', '_posixsubprocess', '_py_abc', '_pydatetime', '_pydecimal', '_pyio', '_pylong', '_queue', '_random', '_scproxy', '_sha1', '_sha2', '_sha3', '_sitebuiltins', '_socket', '_sqlite3', '_ssl', '_statistics', '_strptime', '_struct', '_sysconfigdata__darwin_darwin', '_testbuffer', '_testcapi', '_testclinic', '_testimportmultiple', '_testinternalcapi', '_testmultiphase', '_testsinglephase', '_threading_local', '_uuid', '_weakrefset', '_xxinterpchannels', '_xxsubinterpreters', '_xxtestfuzz', '_zoneinfo', 'abc', 'aifc', 'antigravity', 'argparse', 'array', 'ast', 'audioop', 'base64', 'bdb', 'binascii', 'bisect', 'bz2', 'cProfile', 'calendar', 'cgi', 'cgitb', 'chunk', 'cmath', 'cmd', 'code', 'codecs', 'codeop', 'colorsys', 'compileall', 'configparser', 'contextlib', 'contextvars', 'copy', 'copyreg', 'crypt', 'csv', 'dataclasses', 'datetime', 'decimal', 'difflib', 'dis', 'doctest', 'enum', 'fcntl', 'filecmp', 'fileinput', 'fnmatch', 'fractions', 'ftplib', 'functools', 'genericpath', 'getopt', 'getpass', 'gettext', 'glob', 'graphlib', 'grp', 'gzip', 'hashlib', 'heapq', 'hmac', 'imaplib', 'imghdr', 'inspect', 'io', 'ipaddress', 'keyword', 'linecache', 'locale', 'lzma', 'mailbox', 'mailcap', 'math', 'mimetypes', 'mmap', 'modulefinder', 'netrc', 'nis', 'nntplib', 'ntpath', 'nturl2path', 'numbers', 'opcode', 'operator', 'optparse', 'os', 'pathlib', 'pdb', 'pickle', 'pickletools', 'pipes', 'pkgutil', 'platform', 'plistlib', 'poplib', 'posixpath', 'pprint', 'profile', 'pstats', 'pty', 'py310_core', 'py_compile', 'pyclbr', 'pydoc', 'pyexpat', 'queue', 'quopri', 'random', 'readline', 'reprlib', 'resource', 'rlcompleter', 'runpy', 'sched', 'secrets', 'select', 'selectors', 'shelve', 'shlex', 'shutil', 'signal', 'site', 'smtplib', 'sndhdr', 'socket', 'socketserver', 'sre_compile', 'sre_constants', 'sre_parse', 'ssl', 'stat', 'statistics', 'string', 'stringprep', 'struct', 'subprocess', 'sunau', 'symtable', 'sysconfig', 'syslog', 'tabnanny', 'tarfile', 'telnetlib', 'tempfile', 'termios', 'textwrap', 'this', 'threading', 'timeit', 'token', 'tokenize', 'trace', 'traceback', 'tracemalloc', 'tty', 'turtle', 'types', 'typing', 'unicodedata', 'uu', 'uuid', 'warnings', 'wave', 'weakref', 'webbrowser', 'xdrlib', 'xxlimited', 'xxlimited_35', 'xxsubtype', 'zipapp', 'zipimport', 'zlib'
];

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

        // Check if the package is in the standard library
        if (standardLibraryPackages.includes(packageName)) {
            return new vscode.Hover(`${packageName} is part of the standard library for Python 3.12.1.`);
        }

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
            `📦 Latest Release: ${packageInfo.latestRelease}\n` +
            `🚀 Development Status: ${packageInfo.developmentStatus}\n` +
            `📆 Release Date: ${packageInfo.releaseDate}\n` +
            `👥 Maintainers: ${packageInfo.maintainers}\n` +
            `⚠️ Vulnerabilities: ${packageInfo.vulnerabilities}\n` +
            (packageInfo.githubUrl ? 
                `⭐ Stars: ${packageInfo.stars}\n` +
                `🍴 Forks: ${packageInfo.forks}\n` +
                `🔗 [View on GitHub](${packageInfo.githubUrl})\n`
            : ``) +
            (packageInfo.homepageUrl ? 
                `🏠 [Homepage](${packageInfo.homepageUrl})`
            : `ℹ️ No homepage found`));
        console.log(`Hover info created for: ${packageName}`);

        return new vscode.Hover(markdown);
    }
}
