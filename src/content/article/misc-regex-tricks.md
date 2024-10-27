---
title: "Regex tricks"
group: "Misc"
slug: regex-tricks
date: 2024-10-27
evergreen: true
---

~~Programmers hate #2~~


## Quickies

- `[ -~]` matches any ASCII printable character.  
  Main limitation: only the ASCII range, won't match the many Unicode letters outside of it.
- Matching delimited strings:
  - `('|")(\\?.)*\1` elegantly matches a single or double-quoted string with backslash escapes.  
    YMMV depending on context, the first capturing group is used just for matching.
  - `"(?:[^"\\]|\\.)*"` matches a double-quoted string without using up a capturing group.  
    Can alternatively use the simpler `"([^"\\]|\\.)*"` which does ;
    [source](https://dassur.ma/things/regexp-quote/ "My most useful RegExp trick — Surma").
- `<(?:[^>"]|"[^"]*")*>` can match ~tags (not their content) from simple subset of HTML,
  provided that a potential `>` that doesn't terminate the tag is in a double-quoted attribute.  
  The [inspiration](https://dassur.ma/things/regexp-quote/ "My most useful RegExp trick — Surma")
  uses `<([^>"]|"([^"\\]|\\.)*")*>` but `\` doesn't escape attribute quotes in HTML.  
  Mandatory reminder that [arbitrary HTML can't be matched with a regex](https://stackoverflow.com/a/1732454).
- `(?=(a+))\1` mimics `a++` (possessive grouping) in flavors that don't support it (say, JavaScript).  
  Leaks capturing groups though. [More details](/2013/regex-emulate-atomic-grouping-with-lookahead).


## Matching exceptions to discard them

When trying to match some string _except in some situations_:

```
NotThis|NorThis|(ButThis)
```

Often simpler than trying to exclude via lookbehind, conditionals, parity checks, etc.
Even `\K` — when using a compatible flavor, drops previous character from the match
— becomes unwieldy when the exceptions are a bit complex.

It works by matching all the exceptions, and then only looking at the first matching group.

Downsides:
- Only works when you can discard matches.
- Matches on all exceptions, which can be expensive.
- The captured expression must not swallow exceptions.
- In JavaScript, requires the `g` flag and `/…/g.exec(str)`

Example usage in JavaScript:
```javascript
const regex = /NotThis|NorThis|(ButThis)/g;
const matches = [];
let m;
while (m = regex.exec(str)) {
	if (typeof m[1] === "string") {
		matches.push(m[1]);
	}
}
```

Or with a generator function:
```javascript
function* extract(str) {
	const regex = /NotThis|NorThis|(ButThis)/g;
	let m;
	while (m = regex.exec(str)) {
		if (typeof m[1] === "string") {
			yield m[1];
		}
	}	
}
```

For the full explanation and a good roundup of alternatives, see
[this article](https://www.rexegg.com/regex-best-trick.php "The Best Regex Trick — RexEgg").
