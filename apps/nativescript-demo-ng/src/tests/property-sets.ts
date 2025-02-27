import { NgView, PlatformNamespaceFilter, ViewClassMeta, ɵViewUtil } from '@nativescript/angular';
import { Color, Device, platformNames, View } from '@nativescript/core';
import { createDevice } from './test-utils';
type ViewUtil = ɵViewUtil.ViewUtil;

class TestView extends View implements NgView {
  public meta: ViewClassMeta = { skipAddToDom: false };
  public nodeType: number = 1;
  public nodeName: string = 'TestView';
  public parentNode: NgView = null;
  public previousSibling: NgView;
  public nextSibling: NgView;
  public firstChild: NgView;
  public lastChild: NgView;
  public ngCssClasses: Map<string, boolean> = new Map<string, boolean>();

  public stringValue: string = '';
  public numValue: number = 0;
  public boolValue: boolean = undefined;
  public anyValue: any = undefined;
  public nested: { property: string } = { property: 'untouched' };
}

const iosDevice = createDevice(platformNames.ios);
const androidDevice = createDevice(platformNames.android);

describe('setting View properties', () => {
  function createViewUtil(device: typeof Device) {
    return new ɵViewUtil.ViewUtil([new PlatformNamespaceFilter(device)], false);
  }
  let viewUtil: ViewUtil;
  beforeAll(() => {
    viewUtil = createViewUtil(Device);
  });

  it('preserves string values', () => {
    let view = new TestView();
    viewUtil.setProperty(view, 'stringValue', 'blah');
    expect(view.stringValue).toBe('blah');
  });

  it("doesn't convert number values", () => {
    let view = new TestView();
    viewUtil.setProperty(view, 'numValue', '42');
    expect(view.numValue).toBe(<any>'42');

    viewUtil.setProperty(view, 'numValue', '42.');
    expect(<any>view.numValue).toBe(<any>'42.');

    viewUtil.setProperty(view, 'numValue', 0);
    expect(view.numValue).toBe(0);
  });

  it("doesn't convert boolean values", () => {
    let view = new TestView();
    viewUtil.setProperty(view, 'boolValue', 'true');
    expect(view.boolValue).toBe(<any>'true');
    viewUtil.setProperty(view, 'boolValue', 'false');
    expect(view.boolValue).toBe(<any>'false');
  });

  it('sets style values', () => {
    let view = new TestView();
    viewUtil.setProperty(view, 'style', 'color: red');
    expect(view.style.color.hex).toBe(new Color('red').hex);
  });

  it("doesn't convert blank strings", () => {
    let view = new TestView();
    viewUtil.setProperty(view, 'stringValue', '');
    expect(view.stringValue).toBe('');
  });

  it("doesn't convert booleans", () => {
    let view = new TestView();
    viewUtil.setProperty(view, 'boolValue', true);
    expect(view.boolValue).toBe(true);
    viewUtil.setProperty(view, 'boolValue', false);
    expect(view.boolValue).toBe(false);
  });

  it('preserves objects', () => {
    let value = { name: 'Jim', age: 23 };
    let view = new TestView();
    viewUtil.setProperty(view, 'anyValue', value);
    expect(value).toEqual(view.anyValue);
  });

  it('sets nested properties', () => {
    let view = new TestView();
    viewUtil.setProperty(view, 'nested.property', 'blah');
    expect(view.nested.property).toBe('blah');
  });

  it('sets ios property in ios', () => {
    let view = new TestView();
    let testUtil = createViewUtil(iosDevice);
    testUtil.setProperty(view, 'anyValue', 'blah', 'ios');
    expect(view.anyValue).toBe('blah');
  });

  it("doesn't set android property in ios", () => {
    let view = new TestView();
    let testUtil = createViewUtil(iosDevice);
    testUtil.setProperty(view, 'anyValue', 'blah', 'android');
    expect(view.anyValue).toBeUndefined();
  });

  it('sets android property in android', () => {
    let view = new TestView();
    let testUtil = createViewUtil(androidDevice);
    testUtil.setProperty(view, 'anyValue', 'blah', 'android');
    expect(view.anyValue).toBe('blah');
  });

  it("doesn't set ios property in android", () => {
    let view = new TestView();
    let testUtil = createViewUtil(androidDevice);
    testUtil.setProperty(view, 'anyValue', 'blah', 'ios');
    expect(view.anyValue).toBeUndefined();
  });
});
