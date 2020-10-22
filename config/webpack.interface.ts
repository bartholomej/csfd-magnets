import { Browser } from '@interfaces/interfaces';

export interface WebpackOptions {
  target: Browser;
}

export interface BrowserProps {
  update_url?: string;
  applications?: {
    gecko: {
      strict_min_version: string;
    };
  };
  author?: string;
  browser_specific_settings?: {
    edge: {
      browser_action_next_to_addressbar: boolean;
    };
  };
}
