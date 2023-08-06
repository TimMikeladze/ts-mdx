/* eslint-disable no-useless-constructor */
/* eslint-disable no-use-before-define */
/**
 * Interface definition for a Person object.
 * @interface
 */
interface Person {
  // The name of the person.
  age: number
  // The age of the person.
  gender: Gender
  name: string // The gender of the person (using the Gender enum).
  sayHello: () => void // A function property with no parameters and no return value.
}

/**
 * Enum definition for gender values.
 * @enum {string}
 */
enum Gender {
  // Represents the male gender.
  Female = 'female',
  Male = 'male' // Represents the female gender.
}

/**
 * Abstract class definition for an Animal.
 * @abstract
 */
abstract class Animal {
  /**
   * Creates an instance of Animal.
   * @param {string} name - The name of the animal.
   */
  constructor(public name: string) {}

  /**
   * Abstract method declaration for making a sound.
   * @abstract
   * @returns {void}
   */
  abstract makeSound(): void

  /**
   * Moves the animal a certain distance.
   * @param {number} distance - The distance to move.
   */
  move(distance: number) {
    console.log(`${this.name} moved ${distance} meters.`)
  }
}

/**
 * Class definition for a Dog that extends the Animal class.
 * @extends {Animal}
 */
class Dog extends Animal {
  /**
   * Creates an instance of Dog.
   * @param {string} name - The name of the dog.
   * @param {string} breed - The breed of the dog.
   */
  constructor(
    name: string,
    private breed: string
  ) {
    super(name) // Call the constructor of the base class (Animal).
  }

  /**
   * Static method to create a puppy with a given name.
   * @param {string} name - The name of the puppy.
   * @returns {Dog} - A new Dog instance.
   */
  static createPuppy(name: string): Dog {
    return new Dog(name, 'Unknown')
  }

  /**
   * Implementation of the makeSound abstract method.
   * @override
   * @returns {void}
   */
  makeSound() {
    console.log('Woof! Woof!')
  }
}

/**
 * Decorator function to log method calls and their arguments.
 * @param {any} target - The target object (class prototype).
 * @param {string} propertyKey - The name of the property (method) being decorated.
 * @param {PropertyDescriptor} descriptor - The property descriptor for the method.
 * @returns {PropertyDescriptor} - The modified property descriptor.
 */
function logMethod(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    console.log(
      `Calling ${propertyKey} with arguments: ${JSON.stringify(args)}`
    )
    const result = originalMethod.apply(this, args)
    console.log(`Method ${propertyKey} returned: ${result}`)
    return result
  }
  return descriptor
}

/**
 * Constant for the mathematical constant Pi.
 * @const {number}
 */
export const pi = 3.141592653589793

/**
 * Function to add two numbers.
 * @param {number} a - The first number to add.
 * @param {number} b - The second number to add.
 * @returns {number} - The sum of the two numbers.
 */
export const add = (a: number, b: number): number => a + b

/**
 * Helper class for mathematical operations.
 */
export class MathHelper {
  /**
   * Static method to multiply two numbers with a decorator.
   * @param {number} a - The first number to multiply.
   * @param {number} b - The second number to multiply.
   * @returns {number} - The product of the two numbers.
   */
  @logMethod
  static multiply(a: number, b: number): number {
    return a * b
  }
}

/**
 * Exported enum for gender values.
 * @export
 * @enum {string}
 */
export { Gender }

/**
 * Exported interface for Person object.
 * @export
 * @interface
 */
export { Person }

/**
 * Default export for the Greeter class.
 * @export
 * @class
 */
export default class Greeter {
  /**
   * Creates an instance of Greeter.
   * @param {string} greeting - The greeting message.
   */
  constructor(private greeting: string) {}

  /**
   * Method to greet a person.
   * @param {string} name - The name of the person to greet.
   * @returns {string} - The greeting message.
   */
  greet(name: string): string {
    return `${this.greeting}, ${name}!`
  }
}
