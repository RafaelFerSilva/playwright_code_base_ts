import { test } from '@playwright/test';
import { Actor } from '@screenplay/core/Actor';
import { NavigateTo } from '@screenplay/tasks/NavigateTo';
import { IsHeroTitleVisible } from '@screenplay/questions/IsHeroTitleVisible';

test.describe('Home Page - Screenplay', () => {

  test('Should Be Possible Access Home Page', async ({ page }) => {
    const actor = new Actor('Tester').whoCan(BrowseTheWeb.using(page));

    await actor.attemptsTo(NavigateTo.theUrl());

    const isVisible = await actor.asksFor(IsHeroTitleVisible.onPage());
    if (!isVisible) {
      throw new Error('Hero title is not visible');
    }
  });
});
