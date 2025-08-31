
import { BrowseTheWeb } from '@screenplay/abilities/BrowseTheWeb';
import { Task, Actor } from '@screenplay/core/Actor';

export class NavigateTo implements Task {
  constructor(private url: string) {}

  static theUrl(url: string = '/') {
    return new NavigateTo(url);
  }

  async performAs(actor: Actor): Promise<void> {
    const browser = actor.abilityTo(BrowseTheWeb);
    await browser.page.goto(this.url);
  }
}
