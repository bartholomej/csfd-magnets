export interface MagnetData {
  description: string;
  size: string;
  seedLeech: HTMLTableColElement[];
  linkName: string;
  link: string;
}

export interface BrowserConfig {
  chrome: BrowserConfigInside;
  opera: BrowserConfigInside;
  edge: BrowserConfigInside;
  firefox: BrowserConfigInside;
}

interface BrowserConfigInside {
  repoUrl: string;
}
