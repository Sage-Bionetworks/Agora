describe('App', () => {
  beforeEach(async () => {
    await browser.get('/');
  });

  xit('should have a title', async () => {
    await browser.getTitle().then((value) => {
      console.log(value);
      expect(value).toEqual('Agora');
    });
  });

  xit('should have header', async () => {
    await element(by.css('h1'))
      .isPresent()
      .then((value) => {
        expect(value).toEqual(true);
      });
  });

  // Add new app.e2e.ts tests
  xit('should have <app>', async () => {
    await element(by.css('app'))
      .isPresent()
      .then((value) => {
        expect(value).toEqual(true);
      });
  });
});
