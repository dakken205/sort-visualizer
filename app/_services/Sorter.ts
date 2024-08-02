import { Array, SortHistory } from "@/app/_types";

export const Sorters: {
  [algorithmIdentifier: string]: new () => AbstractSorter;
} = {};

function register(algorithmIdentifier: string) {
  return function (target: new () => AbstractSorter) {
    Sorters[algorithmIdentifier] = target;
  };
}

export abstract class AbstractSorter {
  abstract sort(data: Array): SortHistory;
}

@register("bubble-sort")
export class BubbleSorter extends AbstractSorter {
  sort(data: Array): SortHistory {
    const history: SortHistory = [
      {
        data: [...data],
        highlightedIndices: [],
      },
    ];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data.length - i - 1; j++) {
        if (data[j] > data[j + 1]) {
          const temp = data[j];
          data[j] = data[j + 1];
          data[j + 1] = temp;
          history.push({ data: [...data], highlightedIndices: [j, j + 1] });
        }
      }
    }
    history.push({ data: [...data], highlightedIndices: [] });
    return history;
  }
}

@register("insertion-sort")
export class InsertionSorter extends AbstractSorter {
  sort(data: Array): SortHistory {
    throw new Error("Not implemented!");
  }
}

@register("selection-sort")
export class SelectionSorter extends AbstractSorter {
  sort(data: Array): SortHistory {
    throw new Error("Not implemented!");
  }
}

@register("merge-sort")
export class MergeSorter extends AbstractSorter {
  sort(data: Array): SortHistory {
    throw new Error("Not implemented!");
  }
}

@register("quick-sort")
export class QuickSorter extends AbstractSorter {
  sort(data: Array): SortHistory {
    throw new Error("Not implemented!");
  }
}
