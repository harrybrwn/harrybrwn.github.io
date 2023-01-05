---
title: The Case Against Golang Templates
description: Go's templating engine is good, but not good enough.
pubDate: Jan 5, 2023
tags:
  - opinion
  - tech
  - golang
layout: "~/layouts/BlogPost.astro"
draft: true
---

Ok, this is going to be a bit of a rant but its my first blog post so I'm hoping my writing will improve in the near future.

Go's templating engine is fantastic for the same reasons that Go is fantastic.
It's simplicity and effectiveness are achieved by giving users 90% of what they
would ever want without cluttering the interface with obscure features or high
level abstractions. However, unlike Go, Go's template syntax is almost too
simple.

## Case Study 1: Helm is Terrible

Ok, helm isn't terrible. I'm currently quote dependant on helm for operating the
many complex services in my homelab. As a package manager for kubernetes, it is
irreplaceable. The issue I have with helm is with the experience of writing
charts. It is incredibly difficult to write and maintain helm charts even at a
smaller scale.

## Case Study 2: Hugo

<!-- Hugo was an interesting project  -->
<!-- you cannot manipulate pages as data which is a fundamental paradigm that is used by many other static site generators -->
