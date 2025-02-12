import { ToTitleCasePipe } from './title-case.pipe';

describe('Pipe: TitleCasee', () => {
  it('create an instance', () => {
    const pipe = new ToTitleCasePipe();
    expect(pipe).toBeTruthy();
  });
});
