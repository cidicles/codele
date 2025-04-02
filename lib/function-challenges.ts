export interface FunctionChallenge {
  id: number
  code: string
  answer: string
  options: string[]
  difficulty: "easy" | "medium" | "hard"
  category: "array" | "string" | "object" | "algorithm" | "utility" | "math" | "date" | "dom" | "async"
}

// Helper function to shuffle array
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Export the function challenges array
export const functionChallenges: FunctionChallenge[] = [
  {
    id: 1,
    code: `function mystery(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return null;
  }
  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > result) {
      result = arr[i];
    }
  }
  return result;
}`,
    answer: "finds the maximum value in an array",
    options: [
      "finds the maximum value in an array",
      "finds the minimum value in an array",
      "finds the first element in an array",
      "finds the last element in an array",
    ],
    difficulty: "easy",
    category: "array",
  },
  {
    id: 2,
    code: `function mystery(arr) {
  return arr.reduce((sum, current) => sum + current, 0);
}`,
    answer: "calculates the sum of all elements in an array",
    options: [
      "calculates the sum of all elements in an array",
      "calculates the product of all elements in an array",
      "calculates the average of all elements in an array",
      "counts the number of elements in an array",
    ],
    difficulty: "easy",
    category: "array",
  },
  {
    id: 3,
    code: `function mystery(arr) {
  return arr.filter((value, index, self) => 
    self.indexOf(value) === index
  );
}`,
    answer: "removes duplicate elements from an array",
    options: [
      "removes duplicate elements from an array",
      "sorts the array in ascending order",
      "reverses the array",
      "removes falsy values from an array"
    ],
    difficulty: "medium",
    category: "array"
  },
  {
    id: 4,
    code: `function mystery(arr1, arr2) {
  return arr1.filter(item => arr2.includes(item));
}`,
    answer: "finds common elements between two arrays",
    options: [
      "finds common elements between two arrays",
      "combines two arrays",
      "removes elements from first array that are in second array",
      "checks if arrays are equal"
    ],
    difficulty: "medium",
    category: "array"
  },
  {
    id: 5,
    code: `function mystery(arr) {
  return arr.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {});
}`,
    answer: "counts the frequency of each element in an array",
    options: [
      "counts the frequency of each element in an array",
      "converts array to object with indices as keys",
      "groups elements by their type",
      "removes duplicate elements"
    ],
    difficulty: "medium",
    category: "array"
  },
  {
    id: 6,
    code: `function mystery(str) {
  return str.split('').reverse().join('');
}`,
    answer: "reverses a string",
    options: [
      "reverses a string",
      "removes spaces from a string",
      "converts string to uppercase",
      "checks if string is palindrome"
    ],
    difficulty: "easy",
    category: "string"
  },
  {
    id: 7,
    code: `function mystery(str) {
  return str.replace(/[aeiou]/gi, '');
}`,
    answer: "removes all vowels from a string",
    options: [
      "removes all vowels from a string",
      "removes all consonants from a string",
      "removes all numbers from a string",
      "removes all special characters from a string"
    ],
    difficulty: "easy",
    category: "string"
  },
  {
    id: 8,
    code: `function mystery(n) {
  if (n <= 1) return n;
  return mystery(n - 1) + mystery(n - 2);
}`,
    answer: "calculates the nth Fibonacci number",
    options: [
      "calculates the nth Fibonacci number",
      "calculates the factorial of n",
      "calculates the sum of numbers from 1 to n",
      "calculates the power of 2 to n"
    ],
    difficulty: "hard",
    category: "algorithm"
  },
  {
    id: 9,
    code: `function mystery(obj1, obj2) {
  return Object.keys(obj1).every(key => 
    obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
  );
}`,
    answer: "checks if obj1 is a subset of obj2",
    options: [
      "checks if obj1 is a subset of obj2",
      "merges two objects",
      "compares if objects are exactly equal",
      "copies properties from obj1 to obj2"
    ],
    difficulty: "hard",
    category: "object"
  },
  {
    id: 10,
    code: `function mystery(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 
                'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}`,
    answer: "returns the day of the week for a given date",
    options: [
      "returns the day of the week for a given date",
      "returns the month for a given date",
      "returns the year for a given date",
      "returns the number of days in the month"
    ],
    difficulty: "easy",
    category: "date"
  },
  {
    id: 26,
    code: `function mystery(element) {
  const result = [];
  while (element.parentNode) {
    result.push(element.tagName);
    element = element.parentNode;
  }
  return result;
}`,
    answer: "gets DOM element's ancestor tags",
    options: [
      "gets DOM element's ancestor tags",
      "finds child elements",
      "counts element siblings",
      "gets element attributes"
    ],
    difficulty: "medium",
    category: "dom"
  },
  {
    id: 27,
    code: `function mystery(arr) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    while (arr[left] < 0) left++;
    while (arr[right] >= 0) right--;
    if (left < right) {
      [arr[left], arr[right]] = [arr[right], arr[left]];
    }
  }
  return arr;
}`,
    answer: "separates negative and positive numbers",
    options: [
      "separates negative and positive numbers",
      "sorts array in ascending order",
      "finds median of array",
      "removes zero values"
    ],
    difficulty: "hard",
    category: "algorithm"
  },
  {
    id: 28,
    code: `function mystery(str) {
  const map = {};
  let maxChar = '';
  let maxCount = 0;
  
  for (let char of str) {
    map[char] = (map[char] || 0) + 1;
    if (map[char] > maxCount) {
      maxChar = char;
      maxCount = map[char];
    }
  }
  return maxChar;
}`,
    answer: "finds most frequent character",
    options: [
      "finds most frequent character",
      "finds first unique character",
      "finds last repeated character",
      "counts unique characters"
    ],
    difficulty: "medium",
    category: "string"
  },
  {
    id: 29,
    code: `function mystery(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}`,
    answer: "creates a debounced function",
    options: [
      "creates a debounced function",
      "creates a throttled function",
      "delays function execution",
      "creates an async wrapper"
    ],
    difficulty: "hard",
    category: "utility"
  },
  {
    id: 30,
    code: `function mystery(matrix) {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = 
      [matrix[j][i], matrix[i][j]];
    }
  }
  return matrix;
}`,
    answer: "transposes a square matrix",
    options: [
      "transposes a square matrix",
      "rotates matrix 90 degrees",
      "flips matrix horizontally",
      "reverses matrix rows"
    ],
    difficulty: "hard",
    category: "algorithm"
  },
  {
    id: 31,
    code: `function mystery(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}`,
    answer: "gets day of year (1-366)",
    options: [
      "gets day of year (1-366)",
      "gets week of year",
      "gets days in month",
      "gets day of week"
    ],
    difficulty: "medium",
    category: "date"
  },
  {
    id: 32,
    code: `async function mystery(promises, limit) {
  const results = [];
  const executing = new Set();
  
  for (const [index, promise] of promises.entries()) {
    const p = Promise.resolve(promise).then(result => {
      executing.delete(p);
      return result;
    });
    executing.add(p);
    results.push(p);
    
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}`,
    answer: "limits concurrent promise execution",
    options: [
      "limits concurrent promise execution",
      "executes promises in sequence",
      "races multiple promises",
      "retries failed promises"
    ],
    difficulty: "hard",
    category: "async"
  },
  {
    id: 34,
    code: `function mystery(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}`,
    answer: "checks if number is prime",
    options: [
      "checks if number is prime",
      "checks if number is perfect",
      "finds factors of number",
      "checks if number is composite"
    ],
    difficulty: "medium",
    category: "math"
  },
  {
    id: 35,
    code: `function mystery(element, selector) {
  const matches = (el) => 
    (el.matches || el.matchesSelector || 
     el.msMatchesSelector || el.mozMatchesSelector || 
     el.webkitMatchesSelector || el.oMatchesSelector)
    .call(el, selector);
  
  while (element && element !== document) {
    if (matches(element)) return element;
    element = element.parentElement;
  }
  return null;
}`,
    answer: "finds closest ancestor matching selector",
    options: [
      "finds closest ancestor matching selector",
      "finds all matching elements",
      "checks if element matches selector",
      "finds parent element"
    ],
    difficulty: "hard",
    category: "dom"
  },
  {
    id: 36,
    code: `function mystery(arr) {
  return arr.reduce((acc, val) => {
    const group = Math.floor(val / 10) * 10;
    acc[group] = (acc[group] || []).concat(val);
    return acc;
  }, {});
}`,
    answer: "groups numbers by decades",
    options: [
      "groups numbers by decades",
      "rounds numbers to tens",
      "sorts numbers in ranges",
      "creates number frequency map"
    ],
    difficulty: "medium",
    category: "array"
  },
  {
    id: 37,
    code: `function mystery(str) {
  const words = str.toLowerCase().split(' ');
  return words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});
}`,
    answer: "counts word frequency in text",
    options: [
      "counts word frequency in text",
      "finds longest word",
      "removes duplicate words",
      "sorts words alphabetically"
    ],
    difficulty: "medium",
    category: "string"
  },
  {
    id: 38,
    code: `function mystery(...funcs) {
  return funcs.reduce((f, g) => (...args) => f(g(...args)));
}`,
    answer: "composes functions right to left",
    options: [
      "composes functions right to left",
      "chains function calls",
      "merges function results",
      "creates function pipeline"
    ],
    difficulty: "hard",
    category: "utility"
  },
  {
    id: 11,
    code: `async function mystery(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}`,
    answer: "fetches JSON data from a URL with error handling",
    options: [
      "fetches JSON data from a URL with error handling",
      "posts data to a URL",
      "checks if a URL is valid",
      "downloads a file from a URL"
    ],
    difficulty: "medium",
    category: "async"
  },
  {
    id: 12,
    code: `function mystery(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  return Math.sqrt(
    arr.reduce((acc, curr) => acc + Math.pow(curr, 2), 0) / arr.length
  );
}`,
    answer: "calculates root mean square of array elements",
    options: [
      "calculates root mean square of array elements",
      "calculates standard deviation",
      "calculates average of squares",
      "calculates square root of sum"
    ],
    difficulty: "medium",
    category: "math"
  },
  {
    id: 13,
    code: `function mystery(str) {
  if (typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .split('')
    .sort()
    .join('');
}`,
    answer: "sorts characters in a string alphabetically",
    options: [
      "sorts characters in a string alphabetically",
      "converts string to lowercase",
      "removes duplicate characters",
      "reverses the string characters"
    ],
    difficulty: "easy",
    category: "string"
  },
  {
    id: 14,
    code: `function mystery(arr) {
  if (!Array.isArray(arr)) return {};
  return arr.reduce((acc, curr) => {
    const key = typeof curr;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});
}`,
    answer: "groups array elements by their type",
    options: [
      "groups array elements by their type",
      "counts elements by their type",
      "filters out invalid types",
      "converts array to object"
    ],
    difficulty: "medium",
    category: "array"
  },
  {
    id: 15,
    code: `function mystery(obj) {
  if (typeof obj !== 'object' || obj === null) return {};
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === 'string' || typeof value === 'number') {
      acc[value] = key;
    }
    return acc;
  }, {});
}`,
    answer: "swaps keys and values in an object",
    options: [
      "swaps keys and values in an object",
      "creates a deep copy of an object",
      "removes null values from an object",
      "converts object to array"
    ],
    difficulty: "medium",
    category: "object"
  },
  {
    id: 16,
    code: `function mystery(arr, n = 1) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const rotations = n % arr.length;
  const result = [...arr];
  for (let i = 0; i < rotations; i++) {
    result.unshift(result.pop());
  }
  return result;
}`,
    answer: "rotates array elements to the right",
    options: [
      "rotates array elements to the right",
      "rotates array elements to the left",
      "reverses array elements",
      "shifts array elements by n positions"
    ],
    difficulty: "medium",
    category: "array"
  },
  {
    id: 17,
    code: `function mystery(num) {
  if (typeof num !== 'number' || num < 0) return 0;
  return num.toString(2)
    .split('')
    .filter(bit => bit === '1')
    .length;
}`,
    answer: "counts the number of 1s in binary representation",
    options: [
      "counts the number of 1s in binary representation",
      "converts number to binary",
      "counts total digits in binary",
      "checks if number is power of 2"
    ],
    difficulty: "medium",
    category: "math"
  },
  {
    id: 18,
    code: `function mystery(arr) {
  if (!Array.isArray(arr)) return false;
  const seen = new Set();
  for (const item of arr) {
    if (seen.has(item)) return true;
    seen.add(item);
  }
  return false;
}`,
    answer: "checks if array has duplicate elements",
    options: [
      "checks if array has duplicate elements",
      "checks if array is sorted",
      "finds first duplicate element",
      "counts duplicate elements"
    ],
    difficulty: "medium",
    category: "array"
  },
  {
    id: 19,
    code: `async function mystery(promises) {
  if (!Array.isArray(promises)) return { fulfilled: [], rejected: [] };
  const results = { fulfilled: [], rejected: [] };
  const outcomes = await Promise.allSettled(promises);
  
  outcomes.forEach(outcome => {
    if (outcome.status === 'fulfilled') {
      results.fulfilled.push(outcome.value);
    } else {
      results.rejected.push(outcome.reason);
    }
  });
  
  return results;
}`,
    answer: "separates fulfilled and rejected promises",
    options: [
      "separates fulfilled and rejected promises",
      "executes promises in sequence",
      "retries failed promises",
      "combines promise results"
    ],
    difficulty: "hard",
    category: "async"
  },
  {
    id: 20,
    code: `function mystery(str) {
  if (typeof str !== 'string') return false;
  const stack = [];
  const pairs = { '(': ')', '[': ']', '{': '}' };
  
  for (const char of str) {
    if (pairs[char]) {
      stack.push(char);
    } else if (Object.values(pairs).includes(char)) {
      if (pairs[stack.pop()] !== char) return false;
    }
  }
  
  return stack.length === 0;
}`,
    answer: "validates balanced parentheses and brackets",
    options: [
      "validates balanced parentheses and brackets",
      "removes all parentheses from string",
      "counts number of parentheses",
      "checks for nested parentheses"
    ],
    difficulty: "hard",
    category: "algorithm"
  },
  {
    id: 21,
    code: `function mystery(matrix) {
  if (!Array.isArray(matrix) || !matrix.every(Array.isArray)) {
    return [];
  }
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;
  const result = Array(cols).fill().map(() => Array(rows).fill(0));
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = matrix[i][j];
    }
  }
  return result;
}`,
    answer: "transposes a matrix",
    options: [
      "transposes a matrix",
      "rotates matrix 90 degrees",
      "reverses matrix rows",
      "flips matrix diagonally"
    ],
    difficulty: "medium",
    category: "algorithm"
  },
  {
    id: 22,
    code: `function mystery(text, pattern) {
  if (typeof text !== 'string' || typeof pattern !== 'string') {
    return [];
  }
  const result = [];
  let index = text.indexOf(pattern);
  
  while (index !== -1) {
    result.push(index);
    index = text.indexOf(pattern, index + 1);
  }
  return result;
}`,
    answer: "finds all occurrences of pattern in text",
    options: [
      "finds all occurrences of pattern in text",
      "counts pattern matches",
      "replaces pattern in text",
      "splits text by pattern"
    ],
    difficulty: "medium",
    category: "string"
  },
  {
    id: 23,
    code: `function mystery(arr) {
  if (!Array.isArray(arr)) return [];
  const result = [];
  const seen = new Set();
  
  for (const num of arr) {
    if (!seen.has(num)) {
      seen.add(num);
      result.push(num);
    }
  }
  return result.sort((a, b) => a - b);
}`,
    answer: "removes duplicates and sorts array",
    options: [
      "removes duplicates and sorts array",
      "finds unique elements only",
      "sorts array in ascending order",
      "removes invalid numbers"
    ],
    difficulty: "medium",
    category: "array"
  },
  {
    id: 24,
    code: `function mystery(obj, path, defaultValue = undefined) {
  if (typeof obj !== 'object' || obj === null) return defaultValue;
  return path.split('.')
    .reduce((acc, part) => 
      acc && typeof acc === 'object' ? acc[part] : defaultValue, 
    obj);
}`,
    answer: "safely gets nested object value by path",
    options: [
      "safely gets nested object value by path",
      "sets nested object value",
      "checks if path exists in object",
      "creates nested object structure"
    ],
    difficulty: "medium",
    category: "object"
  },
  {
    id: 25,
    code: `function mystery(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  
  const mid = Math.floor(arr.length / 2);
  const sorted = [...arr].sort((a, b) => a - b);
  
  if (arr.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}`,
    answer: "calculates median of array",
    options: [
      "calculates median of array",
      "finds middle element",
      "calculates average of array",
      "finds mode of array"
    ],
    difficulty: "medium",
    category: "math"
  },
  {
    id: 26,
    code: `async function mystery(fn, retries = 3, delay = 1000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}`,
    answer: "retries failed async function with delay",
    options: [
      "retries failed async function with delay",
      "delays function execution",
      "handles async errors",
      "creates async timeout"
    ],
    difficulty: "hard",
    category: "async"
  },
  {
    id: 27,
    code: `function mystery(element) {
  if (!(element instanceof Element)) return null;
  
  const rect = element.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
    width: rect.width,
    height: rect.height
  };
}`,
    answer: "gets element's absolute position and size",
    options: [
      "gets element's absolute position and size",
      "calculates element's relative position",
      "measures element's dimensions",
      "finds element's offset parent"
    ],
    difficulty: "hard",
    category: "dom"
  },
  {
    id: 28,
    code: `function mystery(arr, k) {
  if (!Array.isArray(arr) || arr.length === 0 || k <= 0) {
    return [];
  }
  
  const freqMap = new Map();
  for (const num of arr) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }
  
  return [...freqMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([num]) => num);
}`,
    answer: "finds k most frequent elements",
    options: [
      "finds k most frequent elements",
      "finds k largest elements",
      "sorts elements by frequency",
      "returns top k unique elements"
    ],
    difficulty: "hard",
    category: "algorithm"
  },
  {
    id: 29,
    code: `function mystery(date1, date2) {
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    return 0;
  }
  
  const oneDay = 24 * 60 * 60 * 1000;
  const weekends = [];
  const start = new Date(Math.min(date1, date2));
  const end = new Date(Math.max(date1, date2));
  
  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 0 || d.getDay() === 6) {
      weekends.push(new Date(d));
    }
  }
  return weekends.length;
}`,
    answer: "counts weekends between two dates",
    options: [
      "counts weekends between two dates",
      "calculates business days",
      "finds total days between dates",
      "checks if dates are in same week"
    ],
    difficulty: "hard",
    category: "date"
  },
  {
    id: 30,
    code: `function mystery(str) {
  if (typeof str !== 'string') return false;
  
  const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const len = cleanStr.length;
  
  for (let i = 0; i < Math.floor(len / 2); i++) {
    if (cleanStr[i] !== cleanStr[len - 1 - i]) {
      return false;
    }
  }
  return true;
}`,
    answer: "checks if string is palindrome (ignoring non-alphanumeric)",
    options: [
      "checks if string is palindrome (ignoring non-alphanumeric)",
      "validates string characters",
      "reverses string content",
      "removes special characters"
    ],
    difficulty: "medium",
    category: "string"
  }
]

