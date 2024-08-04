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
        history.push({ data: [...data], highlightedIndices: [j, j + 1] });
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
    const history: SortHistory = [
      {
        data: [...data],
        highlightedIndices: [],
      },
    ];
    for (let i = 0; i < data.length; i++) {
      for (let j = i - 1; j >= 0; j--) {
        history.push({ data: [...data], highlightedIndices: [j, j + 1] });
        if (data[j + 1] < data[j]) {
          const temp = data[j];
          data[j] = data[j + 1];
          data[j + 1] = temp;
          history.push({ data: [...data], highlightedIndices: [j, j + 1] });
        } else {
          break;
        }
      }
    }
    history.push({ data: [...data], highlightedIndices: [] });
    return history;
  }
}

@register("selection-sort")
export class SelectionSorter extends AbstractSorter {
  sort(data: Array): SortHistory {
    const history: SortHistory = [
      {
        data: [...data],
        highlightedIndices: [],
      },
    ];
    for (let i = 0; i < data.length; i++) {
      let min = Infinity;
      let min_j = i;
      for (let j = i; j < data.length; j++) {
        history.push({ data: [...data], highlightedIndices: [i, j] });
        if (data[j] < min) {
          min = data[j];
          min_j = j;
        }
      }
      const temp = data[i];
      data[i] = data[min_j];
      data[min_j] = temp;
      history.push({ data: [...data], highlightedIndices: [i, min_j] });
    }
    history.push({ data: [...data], highlightedIndices: [] });
    return history;
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
    const history: SortHistory = [
      {
        data: [...data],
        highlightedIndices: [],
      },
    ];
    const stack_low = [0];
    const stack_high = [data.length - 1];
    while (stack_low.length > 0) {
      const low = stack_low.pop()!;
      const high = stack_high.pop()!;
      if (low < high) {
        let pivot = low;
        let i = low + 1;
        let j = high;
        while (i < j) {
          while (data[j] > data[pivot] && i < j) {
            history.push({ data: [...data], highlightedIndices: [i, j] });
            j--;
          }
          while (data[i] <= data[pivot] && i < j) {
            history.push({ data: [...data], highlightedIndices: [i, j] });
            i++;
          }
          if (i < j) {
            const temp = data[i];
            data[i] = data[j];
            data[j] = temp;
            history.push({
              data: [...data],
              highlightedIndices: [i, j],
            });
          }
        }
        let pos = Math.min(i, j);
        if (data[pivot] > data[pos]) {
          const temp = data[pos];
          data[pos] = data[pivot];
          data[pivot] = temp;
          history.push({ data: [...data], highlightedIndices: [pivot, pos] });
        } else {
          pos--;
        }
        if (pos + 1 < high) {
          stack_low.push(Math.min(pos + 1, high));
          stack_high.push(high);
        }
        if (low < pos - 1) {
          stack_low.push(low);
          stack_high.push(Math.max(pos - 1, low));
        }
      }
    }
    history.push({ data: [...data], highlightedIndices: [] });
    return history;
  }
}
