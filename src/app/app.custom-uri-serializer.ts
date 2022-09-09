import {UrlSerializer, UrlTree, DefaultUrlSerializer} from '@angular/router';

// CustomUrlSerializer strips parentheses from legacy Agora URLs
// before parsing; this prevents legacy path parts (e.g. (genes-router:genes-list)
// from being stripped before Angular route handling.
export class CustomUrlSerializer implements UrlSerializer {
  parse(url: any): UrlTree {
    let dus = new DefaultUrlSerializer();
    url = url.replace('(','').replace(')','');
    return dus.parse(url);
  }

  serialize(tree: UrlTree): any {
    let dus = new DefaultUrlSerializer();
    return dus.serialize(tree);
  }
}

