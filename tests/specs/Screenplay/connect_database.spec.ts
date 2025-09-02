import{ expect } from "@playwright/test";
import { test } from '@fixtures/dbAdapter';
import { Actor } from "@screenplay/core/Actor";
import { AccessDatabase } from "@screenplay/abilities/AccessDatabase";

test.describe('Connect Database - Screenplay', () => {
  test('Should Be Possible Access Home Page', async ({ dbAdapter }) => {
    const actor = new Actor('Tester').whoCan(AccessDatabase.using(dbAdapter));
    const results = await actor.abilityTo(AccessDatabase).executeScript('tests/sql/test.sql');
    expect(results[0].id).toEqual(1);
  });
})
