import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'news-page',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NewsPageComponent {
  wikiId = '611426';
  className = 'news-page-content';
}
