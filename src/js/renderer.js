/**
 * @class Renderer
 *
 * Class for DOM rendering
 *
 * @namespace CsfdMagnets
 * @author Bartholomej
 * @see https://github.com/bartholomej/csfd-magnets
 */
import { browserConfig } from '../../config/browser.config';
'use strict';

export default class Renderer {
  /**
   * Assemble box, wrapper and put it on the right place
   */
  prepareBox(placingNode, movieTitle, searchUrl) {
    let wrapper = document.createElement('div');
    wrapper.classList.add('tpb-wrapper');

    let box = `
      <div id="tpb-search" class="ct-related">
        <div class="header">
          <h3>${chrome.i18n.getMessage('magnets')}: <span class="note"><a href="${browserConfig[BROWSER].repoUrl}" target="_blank">${chrome.i18n.getMessage('notOfficial')}</a></span></h3>
          <div class="controls">
            <a href="${searchUrl}" target="_blank" class="search-more edit private" title="Hledat">${chrome.i18n.getMessage('search')}</a>
          </div>
        </div>
        <div class="content">
          <!-- <div class="search-header search-state">${chrome.i18n.getMessage('searchingFor')}</a></div> -->
          <div class="search-header search-term">
            <strong>${movieTitle}</strong>
          </div>

          <!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL -->
          <svg class="loader" width="120" height="30" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="15" r="15">
                  <animate attributeName="r" from="15" to="15"
                          begin="0s" dur="0.8s"
                          values="15;9;15" calcMode="linear"
                          repeatCount="indefinite" />
                  <animate attributeName="fill-opacity" from="1" to="1"
                          begin="0s" dur="0.8s"
                          values="1;.5;1" calcMode="linear"
                          repeatCount="indefinite" />
              </circle>
              <circle cx="60" cy="15" r="9" fill-opacity="0.3">
                  <animate attributeName="r" from="9" to="9"
                          begin="0s" dur="0.8s"
                          values="9;15;9" calcMode="linear"
                          repeatCount="indefinite" />
                  <animate attributeName="fill-opacity" from="0.5" to="0.5"
                          begin="0s" dur="0.8s"
                          values=".5;1;.5" calcMode="linear"
                          repeatCount="indefinite" />
              </circle>
              <circle cx="105" cy="15" r="15">
                  <animate attributeName="r" from="15" to="15"
                          begin="0s" dur="0.8s"
                          values="15;9;15" calcMode="linear"
                          repeatCount="indefinite" />
                  <animate attributeName="fill-opacity" from="1" to="1"
                          begin="0s" dur="0.8s"
                          values="1;.5;1" calcMode="linear"
                          repeatCount="indefinite" />
              </circle>
          </svg>

          <ul></ul>
          <span class="not-found">
            ¯/\_(ツ)_/¯
            <div class="elsewhere text-center ">
              <a href="https://ulozto.cz/hledej?q=${movieTitle}" target="_blank">${chrome.i18n.getMessage('elsewhere')}</a>
            </div>
          </span>
        </div>
      </div>`;

    wrapper.innerHTML = box;
    this.insertAfter(placingNode, wrapper);
    return wrapper;
  }

  /**
   * Assemble markup for every item
   */
  createListItem(data, list) {
    let item = document.createElement('li');
    let anchor = `
        <a href="${data.link}">
          <span class="attr">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="13" height="12" viewBox="0 0 13 12">
              <path d="M3.971 6c-0.696 0.020-1.326 0.321-1.775 0.857h-0.897c-0.67 0-1.299-0.321-1.299-1.065 0-0.542-0.020-2.364 0.83-2.364 0.141 0 0.837 0.569 1.741 0.569 0.308 0 0.603-0.054 0.891-0.154-0.020 0.147-0.033 0.295-0.033 0.442 0 0.609 0.194 1.212 0.542 1.714zM11.143 10.266c0 1.085-0.717 1.734-1.788 1.734h-5.853c-1.071 0-1.788-0.65-1.788-1.734 0-1.513 0.355-3.837 2.317-3.837 0.228 0 1.058 0.931 2.397 0.931s2.17-0.931 2.397-0.931c1.962 0 2.317 2.324 2.317 3.837zM4.286 1.714c0 0.944-0.77 1.714-1.714 1.714s-1.714-0.77-1.714-1.714 0.77-1.714 1.714-1.714 1.714 0.77 1.714 1.714zM9 4.286c0 1.42-1.152 2.571-2.571 2.571s-2.571-1.152-2.571-2.571 1.152-2.571 2.571-2.571 2.571 1.152 2.571 2.571zM12.857 5.792c0 0.743-0.629 1.065-1.299 1.065h-0.897c-0.449-0.536-1.078-0.837-1.775-0.857 0.348-0.502 0.542-1.105 0.542-1.714 0-0.147-0.013-0.295-0.033-0.442 0.288 0.1 0.583 0.154 0.891 0.154 0.904 0 1.6-0.569 1.741-0.569 0.85 0 0.83 1.821 0.83 2.364zM12 1.714c0 0.944-0.77 1.714-1.714 1.714s-1.714-0.77-1.714-1.714 0.77-1.714 1.714-1.714 1.714 0.77 1.714 1.714z"></path>
            </svg>
            ${data.seedLeech[0].textContent} seeds
          </span>
          <span class="attr">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="11" height="12" viewBox="0 0 11 12">
              <path d="M8.571 9c0-0.234-0.194-0.429-0.429-0.429s-0.429 0.194-0.429 0.429 0.194 0.429 0.429 0.429 0.429-0.194 0.429-0.429zM10.286 9c0-0.234-0.194-0.429-0.429-0.429s-0.429 0.194-0.429 0.429 0.194 0.429 0.429 0.429 0.429-0.194 0.429-0.429zM11.143 7.5v2.143c0 0.355-0.288 0.643-0.643 0.643h-9.857c-0.355 0-0.643-0.288-0.643-0.643v-2.143c0-0.355 0.288-0.643 0.643-0.643h3.114l0.904 0.911c0.248 0.241 0.569 0.375 0.911 0.375s0.663-0.134 0.911-0.375l0.911-0.911h3.107c0.355 0 0.643 0.288 0.643 0.643zM8.967 3.69c0.067 0.161 0.033 0.348-0.094 0.469l-3 3c-0.080 0.087-0.194 0.127-0.301 0.127s-0.221-0.040-0.301-0.127l-3-3c-0.127-0.121-0.161-0.308-0.094-0.469 0.067-0.154 0.221-0.261 0.395-0.261h1.714v-3c0-0.234 0.194-0.429 0.429-0.429h1.714c0.234 0 0.429 0.194 0.429 0.429v3h1.714c0.174 0 0.328 0.107 0.395 0.261z"></path>
            </svg>
            ${data.size}
          </span>
          <br />
          <span class="attr">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="13" height="10" viewBox="0 0 10 13">
              <path d="M10.286 5.571v0.857c0 2.732-2.163 4.714-5.143 4.714s-5.143-1.982-5.143-4.714v-0.857c0-0.234 0.194-0.429 0.429-0.429h2.571c0.234 0 0.429 0.194 0.429 0.429v0.857c0 1.225 1.426 1.286 1.714 1.286s1.714-0.060 1.714-1.286v-0.857c0-0.234 0.194-0.429 0.429-0.429h2.571c0.234 0 0.429 0.194 0.429 0.429zM3.429 1.286v2.571c0 0.234-0.194 0.429-0.429 0.429h-2.571c-0.234 0-0.429-0.194-0.429-0.429v-2.571c0-0.234 0.194-0.429 0.429-0.429h2.571c0.234 0 0.429 0.194 0.429 0.429zM10.286 1.286v2.571c0 0.234-0.194 0.429-0.429 0.429h-2.571c-0.234 0-0.429-0.194-0.429-0.429v-2.571c0-0.234 0.194-0.429 0.429-0.429h2.571c0.234 0 0.429 0.194 0.429 0.429z"></path>
            </svg>
            ${data.linkName}
          </span>
        </a>`;
    item.innerHTML = anchor;
    list.appendChild(item);
  }

  /**
   * Helper for inserting node after some element
   */
  insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }
}
