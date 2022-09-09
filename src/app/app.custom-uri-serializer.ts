import {UrlSerializer, UrlTree, DefaultUrlSerializer} from '@angular/router';

// CustomUrlSerializer strips parentheses from legacy Agora URLs
// before parsing; this prevents legacy path parts (e.g. (genes-router:genes-list)
// from being stripped before Angular route handling.
export class CustomUrlSerializer implements UrlSerializer {
  parse(url: any): UrlTree {
    const dus = new DefaultUrlSerializer();
    url = url.replace('(','').replace(')','');
    return dus.parse(url);
  }

  serialize(tree: UrlTree): any {
    const dus = new DefaultUrlSerializer();
    return dus.serialize(tree);
  }
}

