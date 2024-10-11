import { fetch } from 'undici';

// Add an interface for the PyPI API response
interface PyPIResponse {
  info: {
    project_urls: {
      GitHub?: string;
      Homepage?: string;
    };
    maintainers: any[];
    version: string;
    classifiers: string[];
    release_url: string;
  };
  urls: {
    upload_time: string;
  }[];
  vulnerabilities: any[];
}

// Add an interface for the GitHub API response
interface GitHubResponse {
  stargazers_count: number;
  forks_count: number;
}

// Add this interface definition before the fetchPackageInfo function
interface PackageInfo {
  name: string;
  //version: string;
  //summary: string;
  githubUrl?: string;
  homepageUrl?: string;
  stars: number;
  forks: number;
  maintainers: number;
  latestRelease: string;
  developmentStatus: string;
  releaseDate: string;
  vulnerabilities: number;
}

/**
 * Fetches package information from PyPI and associated GitHub repository.
 * @param packageName - The name of the Python package
 * @returns An object containing package details or throws an error if fetching fails
 */
export async function fetchPackageInfo(packageName: string): Promise<PackageInfo | null> {
    try {
        console.log(`Fetching package info for: ${packageName}`);
        // Fetch package data from PyPI's JSON API
        const response = await fetch(`https://pypi.org/pypi/${packageName}/json`);
        if (!response.ok) {
            console.error(`Failed to fetch PyPI data for ${packageName}: ${response.statusText}`);
            return null;
        }
        const data = await response.json() as PyPIResponse;
        
        console.log(`PyPI data received for ${packageName}:`, JSON.stringify(data, null, 2));

        const githubUrl = data.info.project_urls?.GitHub || data.info.project_urls?.Homepage || '';
        console.log(`GitHub URL for ${packageName}:`, githubUrl);

        let stars = 0;
        let forks = 0;

        if (githubUrl && githubUrl.includes('github.com')) {
            const repoPath = githubUrl.replace('https://github.com/', '').replace(/\/$/, '');
            console.log(`Fetching GitHub data for: ${repoPath}`);
            const githubResponse = await fetch(`https://api.github.com/repos/${repoPath}`);
            if (!githubResponse.ok) {
                console.error(`Failed to fetch GitHub data for ${repoPath}: ${githubResponse.statusText}`);
            } else {
                const repoInfo = await githubResponse.json() as GitHubResponse;
                console.log(`GitHub data received for ${repoPath}:`, JSON.stringify(repoInfo, null, 2));
                stars = repoInfo.stargazers_count;
                forks = repoInfo.forks_count;
            }
        } else {
            console.log(`No valid GitHub URL found for ${packageName}`);
        }

        const developmentStatus = data.info.classifiers.find(c => c.startsWith('Development Status'))?.split(' - ')[1] || 'Unknown';
        const releaseDate = data.urls[0]?.upload_time 
            ? new Date(data.urls[0].upload_time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'Unknown';

        return {
            name: packageName,
            githubUrl,
            homepageUrl: data.info.project_urls?.Homepage || '',
            stars,
            forks,
            maintainers: data.info.maintainers?.length || 0,
            latestRelease: data.info.version || 'Unknown',
            developmentStatus,
            releaseDate,
            vulnerabilities: data.vulnerabilities?.length || 0
        };
    } catch (error) {
        console.error(`Error fetching package info for ${packageName}:`, error);
        return null;
    }
}
