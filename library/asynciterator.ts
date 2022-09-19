import { AsyncIterator } from "https://esm.sh/asynciterator@3.7.0";

export {
  ArrayIterator,
  type AsyncIterator,
  MappingIterator,
} from "https://esm.sh/asynciterator@3.7.0";

type TreeNode<T> = {
  [property: string]: T[] | TreeNode<T>;
};

export type Tree<T> = T[] | TreeNode<T>;

type Subtree<T> = {
  type: "node";
  tree: TreeNode<T>;
  parent?: Subtree<T>;
  items: string[];
  path: string[];
  index: number;
} | {
  type: "leaf";
  parent?: Subtree<T>;
  items: T[];
  path: string[];
  index: number;
};

export class TreeIterator<T> extends AsyncIterator<[...string[], T]> {
  private _tree: Tree<T>;
  private _pointer: Subtree<T>;

  constructor(tree: Tree<T>) {
    super();
    this._tree = tree;
    this._pointer = this._buildPointerFromSource(tree);
    this.readable = true;
  }

  read() {
    if (this.closed) {
      return null;
    }

    this._findNextCommonSegment();
    this._findNextLeaf();

    const p = this._pointer;
    if (p.type === "leaf") {
      p.index++;
      if (p.index < p.items.length) {
        return [...p.path, p.items[p.index]] as [...string[], T];
      }
      if (!p.parent) {
        this.close();
      }
    }
    if (p.type === "node") {
      this.close();
    }

    return null;
  }

  protected _buildPointerFromSource(
    tree: Tree<T>,
    path: string[] = [],
  ): Subtree<T> {
    if (tree.constructor === Object && !Array.isArray(tree)) {
      return {
        tree,
        parent: this._pointer,
        type: "node",
        items: Object.keys(tree),
        path,
        index: -1,
      };
    }
    if (Array.isArray(tree)) {
      return {
        parent: this._pointer,
        type: "leaf",
        items: tree,
        path,
        index: -1,
      };
    } else {
      throw new Error(
        "Invalid tree specified, expecting arrays in plain objects.",
      );
    }
  }

  protected _findNextCommonSegment() {
    while (this._pointer.parent !== null) {
      const p = this._pointer;
      if (p.type === "leaf" && p.index < p.items.length - 1) {
        // Points to a leaf that is not yet exhausted
        break;
      }
      if (p.index >= p.items.length - 1 && this._pointer.parent) {
        this._pointer = this._pointer.parent!;
      } else {
        break;
      }
    }
  }

  protected _findNextLeaf() {
    while (this._pointer.type !== "leaf") {
      const p = this._pointer;
      p.index++;
      if (p.index >= p.items.length) {
        // no other keys present, the tree is exhausted;
        break;
      }
      const key = p.items[p.index];
      const source = this._pointer.tree[key];
      this._pointer = this._buildPointerFromSource(source, [...p.path, key]);
    }
  }
}
