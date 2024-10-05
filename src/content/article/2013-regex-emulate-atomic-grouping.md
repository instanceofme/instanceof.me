---
title: "Regex: Emulate Atomic Grouping (and Possessive Quantifiers) with LookAhead"
group: "2013"
slug: 2013/regex-emulate-atomic-grouping-with-lookahead
date: 2013-06-05
---

Some regex flavors (like
[JavaScript’s](http://www.regular-expressions.info/javascript.html))
do not support
[Atomic Grouping](http://www.regular-expressions.info/atomic.html) (nor
[possessive quantifiers](http://www.regular-expressions.info/possessive.html)),
but fully support [LookAhead](http://www.regular-expressions.info/lookaround.html).
It can be annoying when atomic grouping usually improves performance and helps
preventing catastrophic backtracking that would cause exponential matching time.

Fortunately, you can emulate atomic grouping with LookAhead.
`(?>a)` becomes `(?=(a))\1`. It works by matching (and capturing) the sub-expression
in a LookAhead non character-consuming assertion, then matching it (effectively
consuming the characters) with a backreference, not allowing backtracking at this point.

As possessive quantifiers like a++ have a strict equivalent using atomic grouping
(here `(?>a+)`), we can also leverage this technique: `a++` becomes `(?=(a+))\1`.

There are two downsides though: it complexifies the regex and it inserts a possibly
unwanted capturing group for the sole purpose of matching. But still, it may still
be a useful trick to know since the JS regex flavor is a bit sub-par.

On a side note, [REL](http://imaginatio.github.io/REL/) implements this behavior when
[converting a regex for the JavaScript flavor](https://github.com/Imaginatio/REL/blob/master/src/main/scala/flavors/JavaScriptFlavor.scala).
