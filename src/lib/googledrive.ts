/**
 * Validates if a URL is a valid Google Drive URL
 * Supports both file and folder links
 */
export function validateGoogleDriveUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    
    // Check if it's a drive.google.com domain
    if (!urlObj.hostname.includes('drive.google.com')) {
      return false
    }

    // Check for common Google Drive URL patterns:
    // - drive.google.com/file/d/{id}
    // - drive.google.com/drive/folders/{id}
    // - drive.google.com/open?id={id}
    const pathname = urlObj.pathname
    const hasFilePattern = pathname.includes('/file/d/')
    const hasFolderPattern = pathname.includes('/drive/folders/') || pathname.includes('/folders/')
    const hasOpenPattern = pathname === '/open' && urlObj.searchParams.has('id')

    return hasFilePattern || hasFolderPattern || hasOpenPattern
  } catch {
    return false
  }
}
