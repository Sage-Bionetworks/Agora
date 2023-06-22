import { distributionMock } from '../../../src/app/testing/distribution-mocks';
import {
  comparisonGeneMock1,
  comparisonGeneMock2,
} from '../../../src/app/testing/gene-comparison-tool-mocks';

// PAGE LOADING
const PAGE_URL_PATH = '/genes/comparison';
const TUTORIAL_CLOSE_BUTTON_CLASS = '.p-dialog-header-close';
const LOADING_OVERLAY_CLASS = '.loading-overlay';

// SIGNIFICANCE THRESHOLD
const DEFAULT_SIGNIFICANCE_THRESHOLD = '0.05';
const DEFAULT_SIGNIFICANCE_QUERY = `?significanceThreshold=${DEFAULT_SIGNIFICANCE_THRESHOLD}`;
const TOGGLE_CLASS = '.gct-significance-control-toggle';
const CHICLET_CLASS = '.gct-filter-list-item';
const CHICLET_TEXT_CLASS = '.gct-filter-list-item-text';
const DEFAULT_CHICLET_TEXT = `Significance >= ${DEFAULT_SIGNIFICANCE_THRESHOLD}`;

const setUp = (queryParams: string) => {
  // TODO: remove intercepts after CI includes MongoDB connection
  cy.intercept(
    {
      method: 'GET',
      url: '/api/genes/comparison*',
    },
    { items: [comparisonGeneMock1, comparisonGeneMock2] }
  ).as('getGenesComparison');
  cy.intercept(
    {
      method: 'GET',
      url: '/api/distribution',
    },
    distributionMock
  ).as('getDistribution');

  cy.visit(`${PAGE_URL_PATH}${queryParams}`);

  // TODO: remove waits after CI includes MongoDB connection
  cy.wait('@getGenesComparison');
  cy.wait('@getDistribution');

  cy.get(TUTORIAL_CLOSE_BUTTON_CLASS, { timeout: 2_000 }).click();
  cy.get(LOADING_OVERLAY_CLASS, { timeout: 25_000 }).should(
    'have.css',
    'visibility',
    'hidden'
  );
};

describe('Component: GeneComparisonToolComponent', () => {
  it('should show significance threshold filter when URL includes query param on page load', () => {
    setUp(DEFAULT_SIGNIFICANCE_QUERY);

    cy.get(CHICLET_TEXT_CLASS).contains(DEFAULT_CHICLET_TEXT);
    cy.get(TOGGLE_CLASS).find('input').should('be.checked');
    cy.location('search').should('eq', DEFAULT_SIGNIFICANCE_QUERY);
  });

  it('should remove significance threshold filter and URL query param when significance threshold filter is removed', () => {
    setUp(DEFAULT_SIGNIFICANCE_QUERY);

    cy.get(CHICLET_CLASS, { timeout: 25_000 }).should('exist');
    cy.get('.gct-filter-list-item-clear').click();

    cy.get(TOGGLE_CLASS, { timeout: 2_000 })
      .find('input')
      .should('not.be.checked');

    cy.location('search').should('eq', '');

    cy.get(CHICLET_CLASS).should('not.exist');
  });

  it('should remove significance threshold filter and URL query param when clear all button is clicked', () => {
    setUp(DEFAULT_SIGNIFICANCE_QUERY);

    cy.get(CHICLET_CLASS, { timeout: 25_000 }).should('exist');
    cy.get('.gct-filter-list-clear-all').click();

    cy.get(TOGGLE_CLASS, { timeout: 2_000 })
      .find('input')
      .should('not.be.checked');

    cy.location('search').should('eq', '');

    cy.get(CHICLET_CLASS).should('not.exist');
  });

  it('should add significance threshold filter and add URL query param when significance threshold slider is toggled on', () => {
    setUp('');
    cy.location('search').should('eq', '');

    cy.get(TOGGLE_CLASS).find('input').should('not.be.checked');
    cy.get(TOGGLE_CLASS).click();
    cy.get(TOGGLE_CLASS).find('input').should('be.checked');

    cy.location('search').should('eq', DEFAULT_SIGNIFICANCE_QUERY);

    cy.get(CHICLET_CLASS).should('exist');
    cy.get(CHICLET_TEXT_CLASS).contains(DEFAULT_CHICLET_TEXT);
  });

  it('should remove significance threshold filter and remove URL query param when significance threshold slider is toggled off', () => {
    setUp(DEFAULT_SIGNIFICANCE_QUERY);
    cy.location('search').should('eq', DEFAULT_SIGNIFICANCE_QUERY);

    cy.get(CHICLET_CLASS).should('exist');
    cy.get(CHICLET_TEXT_CLASS).contains(DEFAULT_CHICLET_TEXT);

    cy.get(TOGGLE_CLASS).find('input').should('be.checked');
    cy.get(TOGGLE_CLASS).click();
    cy.get(TOGGLE_CLASS).find('input').should('not.be.checked');

    cy.get(CHICLET_CLASS).should('not.exist');
    cy.location('search').should('eq', '');
  });

  it('should update the significance threshold filter and URL query param when significance threshold is updated', () => {
    setUp(DEFAULT_SIGNIFICANCE_QUERY);

    const newValue = '0.95';
    cy.get('.gct-significance-control-settings').click();
    cy.get('.gct-significance-control-panel')
      .find('input')
      .clear()
      .type(newValue);
    cy.location('search').should('eq', `?significanceThreshold=${newValue}`);
    cy.get(CHICLET_TEXT_CLASS).contains(`Significance >= ${newValue}`);
  });
});
