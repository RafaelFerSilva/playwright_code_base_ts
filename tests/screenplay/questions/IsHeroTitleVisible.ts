import { Question, Actor } from '@screenplay/core/Actor';
import { expect } from '@playwright/test';
import { BrowseTheWeb } from '@screenplay/abilities/BrowseTheWeb';

export class IsHeroTitleVisible implements Question {
  static onPage() {
    return new IsHeroTitleVisible();
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const browser = actor.abilityTo(BrowseTheWeb);
    const element = browser.page.getByTestId('hero-title');
    try {
      await expect(element).toBeVisible();
      return true;
    } catch {
      return false;
    }
  }
}
