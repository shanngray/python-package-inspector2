1. To Do List
Core Features
Handle Different Import Styles
Support various Python import statements such as import package, from package import module, and aliased imports.
Expand Package Information
Include additional details like download statistics, license information, and package descriptions from PyPI.
Manage API Rate Limiting
Implement caching strategies to minimize API calls.
Consider using GitHub authentication tokens to increase rate limits for GitHub API requests.
Cache Optimization
Persist cache data between sessions using local storage or files.
Implement cache invalidation strategies to ensure data freshness.
UI Enhancements
Improve Hover Display
Enhance the formatting of the hover tooltip for better readability.
Add icons or hyperlinks to GitHub repositories or PyPI pages.
Prevent Hover Overlaps
Detect other extensions that provide hover features and adjust positioning or z-index accordingly.
Responsive Design
Ensure the hover tooltip adapts to different screen sizes and themes.
Error Handling & Resilience
Robust Error Handling
Gracefully handle scenarios where API requests fail or return incomplete data.
Provide user-friendly error messages or fallback content in the hover tooltip.
Fallback Mechanisms
Display basic package information from PyPI when GitHub data is unavailable.
Performance Optimization
Asynchronous Processing
Ensure that API requests and data processing do not block the editor's main thread.
Debouncing Hover Events
Implement debouncing to prevent excessive API calls when the user hovers rapidly over multiple packages.
Testing & Documentation
Unit Tests
Write unit tests for each module (extension.ts, hoverProvider.ts, pypi.ts) to ensure individual components work as expected.
Integration Tests
Test the interaction between different modules and the overall functionality of the extension.
Contributor Documentation
Create detailed documentation explaining the project structure, coding standards, and contribution guidelines.
Deployment
Prepare for Publication
Finalize package.json with all necessary fields and ensure scripts for building and packaging are working.
Add README
Provide a comprehensive README file with installation instructions, usage examples, feature descriptions, and contribution guidelines.
---
2. Commenting the Code
Below are the updated code snippets with added comments to enhance readability and understanding for other contributors.
src/extension.ts
src/hoverProvider.ts
src/pypi.ts
package.json
> Note: Since package.json is a configuration file, inline comments are not typically used. Ensure that the description, scripts, and other fields are well-documented in the project's README for clarity.
---
3. Test Plan
To ensure that the MVP (Minimum Viable Product) of your VSCode extension works as intended, the following test plan outlines various test cases and scenarios.
1. Unit Tests
a. fetchPackageInfo Function (src/pypi.ts)
Valid Package with GitHub Repository
Input: A valid Python package name that has a GitHub repository.
Expected Output: An object containing accurate stars, forks, maintainers, and latestRelease information.
Valid Package without GitHub Repository
Input: A valid Python package name that does not have a GitHub repository.
Expected Output: An object with stars and forks set to 0, and correct maintainers and latestRelease.
Invalid Package Name
Input: A non-existent or invalid Python package name.
Expected Output: null indicating that fetching failed.
Malformed GitHub URL
Input: A package with an incorrectly formatted GitHub URL in project_urls.
Expected Output: stars and forks remain 0, and the function handles the scenario without crashing.
GitHub API Failure
Input: Simulate a failure (e.g., network issue) when fetching data from GitHub.
Expected Output: stars and forks remain 0, and the error is logged without affecting the extension.
b. HoverProvider Class (src/hoverProvider.ts)
Provide Hover on Valid Import Statement
Input: Hover over a valid import package statement in a Python file.
Expected Output: A hover tooltip displaying the correct package information.
No Hover on Non-import Text
Input: Hover over a word that is not part of an import statement.
Expected Output: No hover tooltip is displayed.
Caching Mechanism
Input: Hover over the same package multiple times.
Expected Output: After the first hover, subsequent hovers retrieve data from the cache without making new API calls.
2. Integration Tests
Extension Activation
Scenario: Open a Python file in VSCode.
Expectation: The extension activates without errors and registers the HoverProvider.
Hover Functionality with Multiple Packages
Scenario: Hover over different package imports within the same file.
Expectation: Each hover displays the correct information for the respective package.
Handling Multiple Rapid Hovers
Scenario: Quickly hover over multiple package imports in succession.
Expectation: The extension handles rapid requests without crashing or slowing down the editor.
Graceful Degradation
Scenario: Network is disconnected.
Expectation: The extension does not crash, and hover tooltips either show cached data or a graceful error message.
3. Manual Testing
Installation Verification
Scenario: Install the extension in a fresh VSCode environment.
Expectation: All dependencies install correctly, and the extension activates as expected.
Real-world Usage
Scenario: Use the extension in a sample Python project with various dependencies.
Expectation: Hovering over import statements displays accurate and formatted package information.
Edge Cases
Scenario: Hover over dynamically imported packages or aliased imports.
Expectation: The extension either handles these cases gracefully or ignores them without errors.
4. Performance Testing
Response Time
Measurement: Time taken for the hover tooltip to appear after hovering over a package name.
Expectation: Hover tooltips appear within 200-500ms for a smooth user experience.
Resource Usage
Measurement: Monitor CPU and memory usage of VSCode with the extension active.
Expectation: The extension does not cause significant performance degradation.
5. Compatibility Testing
VSCode Versions
Scenario: Test the extension across different VSCode versions specified in package.json (^1.60.0).
Expectation: The extension works seamlessly in all compatible versions.
Operating Systems
Scenario: Test the extension on Windows, macOS, and Linux environments.
Expectation: Consistent functionality and appearance across all operating systems.
6. Regression Testing
After Updates
Scenario: After making changes or adding new features, retest existing functionalities.
Expectation: No previously working features are broken by new changes.
7. Documentation Verification
README Accuracy
Scenario: Follow the installation and usage instructions in the README.
Expectation: The extension installs and functions as described without issues.
Comment Clarity
Scenario: Review the added comments in the code.
Expectation: Comments clearly explain the purpose and functionality of code sections, aiding new contributors.
---
Conclusion
By following the outlined To Do list, enhancing your code with comprehensive comments, and adhering to the detailed test plan, you'll be well-equipped to develop a robust and user-friendly VSCode extension. Ensuring thorough testing and clear documentation will not only help in creating a reliable MVP but also facilitate future enhancements and contributions from other developers.
Feel free to reach out if you need further assistance or have additional questions!