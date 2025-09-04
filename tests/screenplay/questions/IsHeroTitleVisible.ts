
import { Question } from '@interfaces/IQuestion';
import { expect } from '@playwright/test';
import { BrowseTheWeb } from '@screenplay/abilities/BrowseTheWeb';
import { Actor } from '@screenplay/core/Actor';

export class IsHeroTitleVisible implements Question {
  private expectedText: string;

  constructor(expectedText: string) {
    this.expectedText = expectedText;
  }

  static onPage(expectedText: string = 'Test Automation Practice'): IsHeroTitleVisible {
    return new IsHeroTitleVisible(expectedText);
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const browser = actor.abilityTo(BrowseTheWeb);
    const element = browser.page.getByTestId('hero-title');
    try {
      await expect(element).toHaveText(this.expectedText);
      return true;
    } catch {
      return false;
    }
  }
}
