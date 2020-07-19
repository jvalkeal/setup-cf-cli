import * as setupPlugins from '../src/setup-plugins';

describe('cli installer tests', () => {
  beforeAll(async () => {}, 300000);

  afterAll(async () => {}, 100000);

  it('Parse valid json', async () => {
    const config = setupPlugins.parse(
      '[{"repo":"foo","id":"bar"}]',
      undefined,
      undefined
    );
    expect(config.plugins).toHaveLength(1);
    expect(config.plugins[0].repo).toBe('foo');
    expect(config.plugins[0].id).toBe('bar');
  }, 100000);

  it('Config without json', async () => {
    const config = setupPlugins.parse(undefined, 'foo', 'bar');
    expect(config.plugins).toHaveLength(1);
    expect(config.plugins[0].repo).toBe('foo');
    expect(config.plugins[0].id).toBe('bar');
  }, 100000);
});
