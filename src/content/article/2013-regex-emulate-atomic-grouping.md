---
title: "Regex: Emulate Atomic Grouping (and Possessive Quantifiers) with Lookahead"
group: "2013"
slug: 2013/regex-emulate-atomic-grouping-with-lookahead
date: 2013-06-05
---

Some regex flavors (like
[JavaScript’s](http://www.regular-expressions.info/javascript.html))
do not support
[atomic grouping](http://www.regular-expressions.info/atomic.html) (nor
[possessive quantifiers](http://www.regular-expressions.info/possessive.html)),
but fully support [lookahead](http://www.regular-expressions.info/lookaround.html).
Impractical, for atomic grouping usually improves performance and helps prevent
[catastrophic backtracking](http://www.regular-expressions.info/catastrophic.html)
that can cause exponential matching time.

Fortunately, you can emulate Atomic Grouping with Lookahead: `(?>a)` becomes `(?=(a))\1`.
It works by matching (and capturing) the sub-expression in a Lookahead assertion
that doesn't consume characters, then matching it (effectively consuming the characters)
with a backreference, not allowing backtracking at this point.

As possessive quantifiers like `a++` have a strict equivalent using atomic grouping
(here `(?>a+)`), we can also leverage this technique: `a++` becomes `(?=(a+))\1`.

There are two downsides though: it complexifies the regex, and it inserts a possibly
unwanted capturing group for the sole purpose of matching. But this trick may still
prove handy since the JS regex flavor is a bit subpar.

On a side note, [REL](http://imaginatio.github.io/REL/) implements this behavior when
[converting a regex for the JavaScript flavor](https://github.com/Imaginatio/REL/blob/master/src/main/scala/flavors/JavaScriptFlavor.scala).
