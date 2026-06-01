<script lang="ts">
  import type { TPBResult } from "piratebay-scraper/interfaces";
  import { REPO_URL } from "../utils/browser.config";
  import { isDev } from "../utils/helpers";

  // Props (Svelte 5 runune)
  interface Props {
    movieTitle: string;
    searchUrl: string;
    urlPath: string;
    alternativeSiteDomain: string;
  }
  let {
    movieTitle = $bindable(),
    searchUrl = $bindable(),
    urlPath,
    alternativeSiteDomain,
  }: Props = $props();

  // Internal reactive state
  let loading = $state(true);
  let items = $state<TPBResult[]>([]);
  let notFound = $state(false);

  const repoUrl = REPO_URL;
  const _ = browser.i18n.getMessage;
  const devFlag = isDev ? "<sup>&beta;</sup>" : "";

  // Exposed methods for programmatic control from outside Svelte context
  export function updateSearch(params: {
    movieTitle: string;
    searchUrl: string;
  }) {
    movieTitle = params.movieTitle;
    searchUrl = params.searchUrl;
    loading = true;
    items = [];
    notFound = false;
  }

  export function setResults(newItems: TPBResult[]) {
    loading = false;
    items = newItems;
    notFound = newItems.length === 0;
  }

  export function setError() {
    loading = false;
    items = [];
    notFound = true;
  }

  // Helper to extract quality and format tags from torrent title
  function parseTorrentTitle(title: string): string {
    const qualityMatch = title.match(/(2160p|1080p|720p|480p|3d|4k|uhd)/i);
    const codecMatch = title.match(/(x265|x264|hevc|h264|h265|avi|mkv|mp4)/i);
    const sourceMatch = title.match(
      /(bluray|web-dl|webrip|brrip|dvdrip|hdtv|web|hdrip)/i,
    );

    const tags: string[] = [];
    if (qualityMatch) tags.push(qualityMatch[1].toUpperCase());
    if (sourceMatch) tags.push(sourceMatch[1].toUpperCase());
    if (codecMatch) tags.push(codecMatch[1].toLowerCase());

    return tags.length > 0 ? tags.join(" • ") : "TORRENT";
  }
</script>

<div id="tpb-search" class="updated-box">
  <div class="updated-box-header">
    <h3>
      {@html devFlag}{_("magnets")}
      <span class="box-header-new">
        <a href={repoUrl} target="_blank">{_("notOfficial")}</a>
      </span>
    </h3>
    <div class="updated-box-header-action">
      <a href={searchUrl} class="button" target="_blank" title="Hledat"
        >{_("search")}</a
      >
    </div>
  </div>
  <div class="updated-box-content">
    <div class="updated-box-content-padding">
      <i class="icon icon-arrow-right"></i>
      {movieTitle}
    </div>

    {#if loading}
      <!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL -->
      <svg
        class="loader"
        width="120"
        height="30"
        viewBox="0 0 120 30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="15" cy="15" r="15">
          <animate
            attributeName="r"
            from="15"
            to="15"
            begin="0s"
            dur="0.8s"
            values="15;9;15"
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            from="1"
            to="1"
            begin="0s"
            dur="0.8s"
            values="1;.5;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="60" cy="15" r="9" fill-opacity="0.3">
          <animate
            attributeName="r"
            from="9"
            to="9"
            begin="0s"
            dur="0.8s"
            values="9;15;9"
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            from="0.5"
            to="0.5"
            begin="0s"
            dur="0.8s"
            values=".5;1;.5"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="105" cy="15" r="15">
          <animate
            attributeName="r"
            from="15"
            to="15"
            begin="0s"
            dur="0.8s"
            values="15;9;15"
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            from="1"
            to="1"
            begin="0s"
            dur="0.8s"
            values="1;.5;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    {/if}

    {#each items as item}
      {@const seedersNum = parseInt(String(item.seeders)) || 0}
      {@const ratingColor =
        seedersNum > 50 ? "red" : seedersNum > 10 ? "blue" : "grey"}
      <article class="article aside-films-article">
        <header class="article-header">
          <h3>
            <a href={item.link}>
              <span class="film-title-name">
                {item.title}
              </span>
            </a>
          </h3>
          <p>
            <span class="info">{parseTorrentTitle(item.title)}</span>
          </p>
        </header>
        <div>
          <p class="film-creators">
            <span title={_("seeders")}>
              <i class="icon icon-globe-circle"></i>
              <span>{item.seeders}</span>
            </span>
            <span class="bullet"></span>
            <span title={_("size")}>
              <i class="icon icon-move"></i>
              <span>{item.size}</span>
            </span>
          </p>
        </div>
      </article>
    {/each}

    {#if notFound}
      <span class="not-found active"> ¯/\_(ツ)_/¯ </span>
    {/if}

    {#if !notFound && items.length > 0}
      <div class="box-content-more">
        <a href={searchUrl}>{_("more")} <i class="icon icon-arrow-down"></i></a>
      </div>
    {/if}

    <div class="box-content-more">
      <a href="https://webshare.cz/#/search?what={movieTitle}" target="_blank">
        {_("elsewhere")}
      </a>
    </div>

    <div class="box-content-more">
      <a href="https://{alternativeSiteDomain}/{urlPath}">
        {_("openOnSite")}
        {alternativeSiteDomain}
      </a>
    </div>
  </div>
</div>
