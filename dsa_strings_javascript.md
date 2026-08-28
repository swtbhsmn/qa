# Wekan SDE-2 DSA — Strings & Arrays in JavaScript

Interview-ready JavaScript solutions with patterns and complexity.

## 1. Longest Substring Without Repeating Characters

```js
function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    if (seen.has(char) && seen.get(char) >= left) {
      left = seen.get(char) + 1;
    }

    seen.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

console.log(lengthOfLongestSubstring("abcabcbb")); // 3
```

- **Pattern:** Sliding Window + Map
- **Time:** O(n)
- **Space:** O(n)

## 2. Longest Valid Parentheses

```js
function longestValidParentheses(s) {
  const stack = [-1];
  let maxLength = 0;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      stack.push(i);
    } else {
      stack.pop();

      if (stack.length === 0) {
        stack.push(i);
      } else {
        maxLength = Math.max(maxLength, i - stack[stack.length - 1]);
      }
    }
  }

  return maxLength;
}

console.log(longestValidParentheses(")()())")); // 4
```

- **Pattern:** Stack
- **Time:** O(n)
- **Space:** O(n)

## 3. Valid Anagram

```js
function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  const freq = {};

  for (const char of s) {
    freq[char] = (freq[char] || 0) + 1;
  }

  for (const char of t) {
    if (!freq[char]) return false;
    freq[char]--;
  }

  return true;
}

console.log(isAnagram("listen", "silent")); // true
```

- **Pattern:** Frequency Map
- **Time:** O(n)
- **Space:** O(n)

## 4. Group Anagrams

```js
function groupAnagrams(words) {
  const map = new Map();

  for (const word of words) {
    const key = word.split("").sort().join("");

    if (!map.has(key)) map.set(key, []);
    map.get(key).push(word);
  }

  return [...map.values()];
}

console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
```

- **Pattern:** Hash Map
- **Time:** O(n × k log k)

### Optimized Group Anagrams

```js
function groupAnagramsOptimized(words) {
  const map = new Map();

  for (const word of words) {
    const count = new Array(26).fill(0);

    for (const char of word) {
      count[char.charCodeAt(0) - 97]++;
    }

    const key = count.join("#");

    if (!map.has(key)) map.set(key, []);
    map.get(key).push(word);
  }

  return [...map.values()];
}
```

- **Time:** O(n × k)

## 5. First Non-Repeating Character

```js
function firstUniqueChar(str) {
  const freq = {};

  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  for (const char of str) {
    if (freq[char] === 1) return char;
  }

  return null;
}

console.log(firstUniqueChar("aabbcddee")); // c
```

### Return Index

```js
function firstUniqCharIndex(s) {
  const freq = {};

  for (const char of s) {
    freq[char] = (freq[char] || 0) + 1;
  }

  for (let i = 0; i < s.length; i++) {
    if (freq[s[i]] === 1) return i;
  }

  return -1;
}
```

## 6. String Compression

```js
function compressString(str) {
  if (!str.length) return "";

  let result = "";
  let count = 1;

  for (let i = 1; i <= str.length; i++) {
    if (str[i] === str[i - 1]) {
      count++;
    } else {
      result += str[i - 1] + count;
      count = 1;
    }
  }

  return result;
}

console.log(compressString("aaabbccccd")); // a3b2c4d1
```

- **Time:** O(n)
- **Space:** O(n)

## 7. Check Palindrome

```js
function isPalindrome(str) {
  let left = 0;
  let right = str.length - 1;

  while (left < right) {
    if (str[left] !== str[right]) return false;
    left++;
    right--;
  }

  return true;
}

console.log(isPalindrome("racecar")); // true
```

- **Pattern:** Two Pointers
- **Time:** O(n)
- **Space:** O(1)

## 8. Valid Palindrome With Special Characters

```js
function validPalindrome(str) {
  const s = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }

  return true;
}

console.log(validPalindrome("A man, a plan, a canal: Panama")); // true
```

## 9. Longest Palindromic Substring

```js
function longestPalindrome(s) {
  if (s.length < 2) return s;

  let start = 0;
  let maxLength = 1;

  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      const length = right - left + 1;

      if (length > maxLength) {
        maxLength = length;
        start = left;
      }

      left--;
      right++;
    }
  }

  for (let i = 0; i < s.length; i++) {
    expand(i, i);     // odd length
    expand(i, i + 1); // even length
  }

  return s.substring(start, start + maxLength);
}

console.log(longestPalindrome("babad")); // "bab" or "aba"
```

- **Pattern:** Expand Around Center
- **Time:** O(n²)
- **Space:** O(1)

## 10. Sliding Window — Maximum Sum Subarray of Size K

```js
function maxSumSubarray(arr, k) {
  let windowSum = 0;
  let maxSum = -Infinity;

  for (let i = 0; i < arr.length; i++) {
    windowSum += arr[i];

    if (i >= k - 1) {
      maxSum = Math.max(maxSum, windowSum);
      windowSum -= arr[i - k + 1];
    }
  }

  return maxSum;
}

console.log(maxSumSubarray([2, 1, 5, 1, 3, 2], 3)); // 9
```

- **Pattern:** Fixed Sliding Window
- **Time:** O(n)

## 11. Minimum Size Subarray Sum

```js
function minSubArrayLen(target, nums) {
  let left = 0;
  let sum = 0;
  let minLength = Infinity;

  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];

    while (sum >= target) {
      minLength = Math.min(minLength, right - left + 1);
      sum -= nums[left];
      left++;
    }
  }

  return minLength === Infinity ? 0 : minLength;
}

console.log(minSubArrayLen(7, [2, 3, 1, 2, 4, 3])); // 2
```

- **Pattern:** Variable Sliding Window
- **Time:** O(n)

## 12. Most Frequent Character

```js
function mostFrequentChar(str) {
  const freq = {};
  let result = null;
  let maxCount = 0;

  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;

    if (freq[char] > maxCount) {
      maxCount = freq[char];
      result = char;
    }
  }

  return result;
}

console.log(mostFrequentChar("aaabbbcccc")); // c
```

## 13. Find Duplicate Characters

```js
function duplicateCharacters(str) {
  const freq = {};
  const result = [];

  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  for (const char in freq) {
    if (freq[char] > 1) result.push(char);
  }

  return result;
}

console.log(duplicateCharacters("programming"));
```

## 14. Two Sum in Sorted Array

```js
function twoSumSorted(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];

    if (sum === target) return [left, right];

    if (sum < target) left++;
    else right--;
  }

  return [-1, -1];
}

console.log(twoSumSorted([1, 2, 4, 6, 10], 8)); // [1, 3]
```

- **Pattern:** Two Pointers
- **Time:** O(n)
- **Space:** O(1)

## 15. Remove Duplicates From Sorted Array

```js
function removeDuplicates(nums) {
  if (!nums.length) return 0;

  let left = 0;

  for (let right = 1; right < nums.length; right++) {
    if (nums[right] !== nums[left]) {
      left++;
      nums[left] = nums[right];
    }
  }

  return left + 1;
}

const nums = [1, 1, 2, 2, 3];
const length = removeDuplicates(nums);

console.log(length); // 3
console.log(nums.slice(0, length)); // [1, 2, 3]
```

## 16. Missing Number

```js
function missingNumber(nums) {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  let actualSum = 0;

  for (const num of nums) {
    actualSum += num;
  }

  return expectedSum - actualSum;
}

console.log(missingNumber([3, 0, 1])); // 2
```

### XOR Solution

```js
function missingNumberXOR(nums) {
  let result = nums.length;

  for (let i = 0; i < nums.length; i++) {
    result ^= i;
    result ^= nums[i];
  }

  return result;
}

console.log(missingNumberXOR([3, 0, 1])); // 2
```

- **Time:** O(n)
- **Space:** O(1)

## 17. Find Duplicate Number

```js
function findDuplicate(nums) {
  const seen = new Set();

  for (const num of nums) {
    if (seen.has(num)) return num;
    seen.add(num);
  }

  return -1;
}

console.log(findDuplicate([1, 3, 4, 2, 2])); // 2
```

### O(1) Extra Space — Floyd's Cycle Detection

```js
function findDuplicateOptimized(nums) {
  let slow = nums[0];
  let fast = nums[0];

  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);

  slow = nums[0];

  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }

  return slow;
}

console.log(findDuplicateOptimized([1, 3, 4, 2, 2])); // 2
```

- **Time:** O(n)
- **Space:** O(1)

## 18. Longest Consecutive Sequence

```js
function longestConsecutive(nums) {
  const set = new Set(nums);
  let maxLength = 0;

  for (const num of set) {
    if (!set.has(num - 1)) {
      let current = num;
      let length = 1;

      while (set.has(current + 1)) {
        current++;
        length++;
      }

      maxLength = Math.max(maxLength, length);
    }
  }

  return maxLength;
}

console.log(longestConsecutive([100, 4, 200, 1, 3, 2])); // 4
```

- **Pattern:** Hash Set
- **Time:** O(n) average
- **Space:** O(n)

## Pattern Cheat Sheet

| Problem | Pattern |
|---|---|
| Longest substring without repeating | Sliding Window |
| Longest valid parentheses | Stack |
| Valid anagram | Frequency Map |
| Group anagrams | Hash Map |
| First unique character | Frequency Map |
| Palindrome | Two Pointers |
| Longest palindromic substring | Expand Around Center |
| Maximum sum of K elements | Fixed Sliding Window |
| Minimum subarray | Variable Sliding Window |
| Two Sum sorted | Two Pointers |
| Missing number | Math / XOR |
| Find duplicate | Set / Floyd Cycle |
| Longest consecutive sequence | Hash Set |

## High-Priority Wekan Practice

Practice these until you can code and explain them without looking:

1. Longest Substring Without Repeating Characters
2. Longest Valid Parentheses
3. Group Anagrams
4. Longest Palindromic Substring
5. Longest Consecutive Sequence

For each problem, be ready to explain:

- Brute-force approach
- Optimized approach
- Why the algorithm works
- Time complexity
- Space complexity
- Edge cases
