// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { HelperService } from './';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Service: Helper', () => {
  let helperService: HelperService;

  beforeEach(async () => {
    helperService = new HelperService();
  });

  it('should create', () => {
    expect(helperService).toBeDefined();
  });

  it('should set loading', () => {
    helperService.setLoading(true);
    expect(helperService.loading).toEqual(true);
  });

  it('should get loading', () => {
    const res = helperService.getLoading();
    expect(res).toEqual(false);
  });

  it('should get tissue tooltip text', () => {
    const res = helperService.getTissueTooltipText('ACC');
    expect(res).toEqual('Anterior Cingulate Cortex');
  });

  it('should get scroll top', () => {
    const res = helperService.getScrollTop();
    expect(res).toEqual({ x: 0, y: 0 });
  });

  it('should get offset', () => {
    const res = helperService.getOffset('');
    expect(res).toEqual({ top: 0, left: 0 });
  });

  it('should truncate number to fixed', () => {
    const res = helperService.truncateNumberToFixed(0.123, 2);
    expect(res).toEqual('0.12');
  });

  it('should get significant figures', () => {
    const res = helperService.getSignificantFigures(0.123, 2);
    expect(res).toEqual(0.12);
  });

  it('should set GCT selection', () => {
    const mock = ['A'];
    helperService.setGCTSelection(mock);
    expect(helperService.gctSelection).toEqual(mock);
  });

  it('should get GCT selection', () => {
    const mock = ['A'];
    helperService.setGCTSelection(mock);
    const res = helperService.getGCTSelection();
    expect(res).toEqual(mock);
  });

  it('should delete GCT selection', () => {
    const mock = ['A'];
    helperService.setGCTSelection(mock);
    helperService.deleteGCTSelection();
    expect(helperService.gctSelection).toEqual([]);
  });

  it('should get color', () => {
    const res = helperService.getColor('primary');
    expect(res).toEqual('#3c4a63');
  });

  it('should get url param', () => {
    //window.location.search = '?test=42';
    const res = helperService.getUrlParam('test');
    expect(res).toEqual(null);
  });
});
