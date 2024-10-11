# Python Package Inspector

Python Package Inspector is a Visual Studio Code extension that provides quick and detailed information about Python packages directly in your editor. The main purpose of this extension is to help check if AI coding assistants are hallucinating when suggesting imports.

## Features

- Hover over Python import statements to view package information
- Displays package details including:
  - Latest release version
  - Development status
  - Release date
  - Number of maintainers
  - Known vulnerabilities
  - GitHub stars and forks (if available)
  - Links to GitHub repository and homepage

![Feature demonstration](images/feature-demo.gif)

## Requirements

- Visual Studio Code version 1.60.0 or higher
- An active internet connection to fetch package information

## Installation

1. Open Visual Studio Code
2. Go to the Extensions view (Ctrl+Shift+X)
3. Search for "Python Package Inspector"
4. Click Install

## Usage

1. Open a Python file in VSCode
2. Hover over any import statement
3. A tooltip will appear with detailed information about the package

## Extension Settings

This extension contributes the following settings:

* `pythonPackageInspector.enable`: Enable/disable this extension
* `pythonPackageInspector.cacheTimeout`: Set the timeout (in minutes) for cached package information

## Known Issues

- The extension may occasionally experience delays when fetching information for packages with large GitHub repositories
- Some packages may not display GitHub information if their repository URL is not correctly specified on PyPI
 - Standard Library packages are currently based on Python 3.12.1 and may not work for other versions
 - Functionality is based off the name of the module in the import statement, so if the package on PyPI has a different name, the extension will only pull data where there is an exact match.

## Release Notes

### 1.0.0

Initial release of Python Package Inspector

- Hover functionality for Python import statements
- Display of package information from PyPI and GitHub
- Caching mechanism to improve performance

## Contributing

Contributions to the Python Package Inspector are welcome! Please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute to this project. (Coming Soon)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the PyPI and GitHub APIs for providing the package information
- Icons used in the extension are from [Font Awesome](https://fontawesome.com/)

## Support

If you encounter any issues or have suggestions for improvements, please file an issue on the [GitHub repository](https://github.com/yourusername/python-package-inspector/issues).

---

**Enjoy using Python Package Inspector!**
