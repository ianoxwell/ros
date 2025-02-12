import { CookBookPage } from './app.po';

describe('cook-book App', () => {
	let page: CookBookPage;

	beforeEach(() => {
		page = new CookBookPage();
	});

	it('should display message saying app works', () => {
		page.navigateTo();
		expect(page.getParagraphText()).toEqual('app works!');
	});
});
