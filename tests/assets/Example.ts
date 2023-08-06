/**
 * @file This is a file.
 * @author Tim
 */

/**
 * This is an interface.
 */
export interface Interface {
  bar?: string
  /**
   * This is a property.
   */
  foo: string
}

/**
 * This is a type
 */
export type Type = {
  bar?: string
  /**
   * This is a property.
   */
  foo: string
}

/**
 * This is an enum.
 */
export enum Enum {
  /**
   * This is a property.
   */
  bar = 'bar',
  foo = 'foo'
}

/**
 * This is a basic class.
 *
 * @export
 * @class BasicClass
 * @example
 * const basicClass = new BasicClass()
 * basicClass.hello()
 */
export class BasicClass {
  /**
   * This is a constructor.
   * @memberof BasicClass
   * @example
   * const basicClass = new BasicClass()
   */
  // eslint-disable-next-line no-useless-constructor
  constructor() {}

  /**
   * This is a basic method.
   *
   * @memberof BasicClass
   */
  hello() {}
}

export class AnotherClass {
  /**
   * This is a constructor.
   * @memberof AnotherClass
   * @example
   * const anotherClass = new AnotherClass()
   */
  private static foo = 'bar'
  private bar = 'foo'
  // eslint-disable-next-line no-useless-constructor
  constructor() {}

  static hello() {}
}

/**
 * This is an abstract class.
 * @abstract
 */
export abstract class AbstractClass {
  /**
   * This is a constructor.
   * @memberof AbstractClass
   * @example
   * const abstractClass = new AbstractClass()
   */
  // eslint-disable-next-line no-useless-constructor
  constructor() {}

  abstract hello(): void
}
