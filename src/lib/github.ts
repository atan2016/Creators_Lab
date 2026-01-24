interface GitHubRepoInfo {
  name: string
  description: string | null
  stars: number
  forks: number
  updatedAt: string
  url: string
}

export async function getGitHubRepoInfo(url: string): Promise<GitHubRepoInfo | null> {
  try {
    // Extract owner and repo from GitHub URL
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) {
      return null
    }

    const [, owner, repo] = match
    const repoName = repo.replace(/\.git$/, '')

    // Fetch repo info from GitHub API
    const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        })
      }
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    return {
      name: data.name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      updatedAt: data.updated_at,
      url: data.html_url,
    }
  } catch (error) {
    console.error('Error fetching GitHub repo info:', error)
    return null
  }
}

export function validateGitHubUrl(url: string): boolean {
  const githubUrlPattern = /^https?:\/\/github\.com\/[^\/]+\/[^\/]+/
  return githubUrlPattern.test(url)
}
