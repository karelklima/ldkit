export class ArrayMappingStream<
  TInput,
  TOutput,
> implements Iterable<TOutput> {
  #data: TInput[];
  #mappingFunction: (input: TInput) => TOutput;
  #pointer = 0;

  constructor(data: TInput[], mappingFunction: (input: TInput) => TOutput) {
    if (!Array.isArray(data)) {
      throw new Error(
        "First argument provided to the array mapping stream must be an array.",
      );
    }
    if (!(mappingFunction instanceof Function)) {
      throw new Error(
        "Second argument provided to the array mapping stream must be a function",
      );
    }

    this.#data = data;
    this.#mappingFunction = mappingFunction;
  }

  read() {
    if (this.#pointer >= this.#data.length) {
      return null;
    }
    return this.#mappingFunction(this.#data[this.#pointer++]);
  }

  [Symbol.iterator](): Iterator<TOutput,any,undefined> {
    throw new Error("Method not implemented.");
    }
}


class ArrayIterator<T> implements Iterator<T> {
  next(...args: []|[undefined]): IteratorResult<T,any> {
  throw new Error("Method not implemented.");
  }

}