// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';
import sanitizeHtml from 'sanitize-html';

// -------------------------------------------------------------------------- //
// Service
// -------------------------------------------------------------------------- //
@Injectable()
export class SynapseApiService {
  wikis: { [key: string]: any } = {};

  constructor(private http: HttpClient) {}

  getWiki(ownerId: string, wikiId: string) {
    const key = ownerId + wikiId;
    if (this.wikis[key]) {
      return of(this.wikis[key]);
    } else {
      return this.http
        .get(
          'https://repo-prod.prod.sagebase.org/repo/v1/entity/' +
            ownerId +
            '/wiki/' +
            wikiId
        )
        .pipe(
          tap((wiki: any) => {
            this.wikis[key] = wiki;
          })
        );
    }
  }

  renderHtml(html: string) {
    // Sanitize
    let sanitized = sanitizeHtml(html);

    // Add bold tags
    sanitized = sanitized.replace(/\*\*(.*?)\*\*/g, this.replaceBold);

    // Add syn links
    sanitized = sanitized.replace(/\[here\]\((.*?)\)/g, this.replaceSynLinks);

    // Add emails
    sanitized = sanitized.replace(
      /([a-zA-Z0-9.*_-]+@[a-zA-Z0-9 .*_-]+\.[a-zA-Z0-9*_-]+)/gi,
      this.replaceEmail
    );

    // Add variables
    sanitized = sanitized.replace(/\${(.*?)}/g, this.replaceVariable);

    return sanitized;
  }

  replaceSynLinks(match: string, content: string) {
    return (
      '<a href="https://synapse.org/#!Synapse:' +
      content +
      '" target="_blank">here</a>'
    );
  }

  replaceBold(match: string, content: string) {
    return '<b>' + content + '</b>';
  }

  replaceVariable(match: string, content: string) {
    let params: any = null;

    try {
      const contentArr = content.split('?');
      params = new URLSearchParams(
        contentArr.length > 1 ? contentArr[1] : contentArr[0]
      );
    } catch (err) {
      console.error(err);
    }

    if (params) {
      if (params.has('fileName')) {
        return (
          '<img src="' +
          params.get('fileName') +
          ' alt="' +
          (params.get('amp;altText') || '') +
          '"/>'
        );
      } else if (params.has('vimeoId')) {
        return (
          '<iframe src="https://player.vimeo.com/video/' +
          params.get('vimeoId') +
          '?autoplay=0&speed=1" frameborder="0" allow="autoplay; encrypted-media" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
        );
      }
    }

    return '';
  }

  replaceEmail(match: string, content: string) {
    // Remove all spaces and *
    content = content.replace(/(\s|\*)/g, '');

    if (content) {
      return (
        '<a class="link email-link" href="mailto:' +
        content +
        '">' +
        content +
        '</a>'
      );
    }

    return content;
  }
}
