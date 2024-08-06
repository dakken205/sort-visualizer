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
  /**
   * Replace the data array with the sorted part for visualization
   */
  format(
    originalData: Array,
    left: number,
    mid: number,
    right: number,
    i: number,
    j: number,
    temp: Array
  ) {
    const data = [...originalData];
    const sortingPart = [
      ...temp,
      ...data.slice(i, mid + 1),
      ...data.slice(j, right + 1),
    ];

    for (let k = left; k <= right; k++) {
      data[k] = sortingPart[k - left];
    }
    return data;
  }

  sort(data: Array): SortHistory {
    const history: SortHistory = [
      {
        data: [...data],
        highlightedIndices: [],
      },
    ];

    const _merge = (left: number, mid: number, right: number) => {
      const temp = [];
      let i = left;
      let j = mid + 1;
      while (i <= mid && j <= right) {
        history.push({
          data: this.format(data, left, mid, right, i, j, temp),
          highlightedIndices: [i, j],
        });
        if (data[i] < data[j]) {
          temp.push(data[i]);
          i++;
        } else {
          temp.push(data[j]);
          j++;
        }
      }
      while (i <= mid) {
        temp.push(data[i]);
        i++;
      }
      while (j <= right) {
        temp.push(data[j]);
        j++;
      }
      for (let i = 0; i < temp.length; i++) {
        data[left + i] = temp[i];
      }
    };

    const _sort = (left: number, right: number) => {
      if (left >= right) return;

      const mid = Math.floor((left + right) / 2);
      _sort(left, mid);
      _sort(mid + 1, right);
      _merge(left, mid, right);
    };

    _sort(0, data.length - 1);
    history.push({ data: [...data], highlightedIndices: [] });
    return history;
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

@register("bogo-sort")
export class BogoSorter extends AbstractSorter {
  sort(data: Array): SortHistory {
    const history: SortHistory = [
      {
        data: [...data],
        highlightedIndices: [],
      },
    ];
    const isSorted = (data: Array) => {
      for (let i = 1; i < data.length; i++) {
        if (data[i] < data[i - 1]) {
          return false;
        }
      }
      return true;
    };
    let cnt = 0;
    while (!isSorted(data) && cnt < 1000) {
      for (let i = 1; i < data.length; i++) {
        let l = Math.floor(Math.random() * (i - 1));

        const temp = data[i];
        data[i] = data[l];
        data[l] = temp;
      }
      history.push({ data: [...data], highlightedIndices: [] });
      cnt++;
    }
    history.push({ data: [...data], highlightedIndices: [] });
    return history;
  }
}
