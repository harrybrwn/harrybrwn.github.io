---
title: Infomation Retrieval
description: Notes on IR.
pubDate: 2023-01-12T18:21:03.000Z
tags:
- computer-science
slug: Information-Retrieval
---

## The Inverted Index

See this [natural language processing playlist](https://www.youtube.com/playlist?list=PLLssT5z_DsK8HbD2sPcUIDfQ7zmBarMYv).

- [TF*IDF](https://en.wikipedia.org/wiki/Tf%E2%80%93idf)

## Web Crawling

[[Web Crawler|Web crawlers]] are just programs that download webpages, collect all the
links, and visit all those links to repeat the process. This understates the potential
complexity of the process quite a bit. There are many other additions and features to be
added to a web crawler.

To figure out what features a [[Web Crawler|web crawler]] must implement you need to
produce a  list of characteristics for the system. This can be difficult because many
characteristics interfere with one another leading to trade-offs.

### Features and Characteristics

- **Scalability**: the web is absolutely enormous and indexing any sizable portion
	requires a scalable system. Having a [[Web Crawler#Distributed Web Crawlers|distributed web crawler]]
-  is a good strategy for scalability.
- **Niceness**: It is considered rude for a crawler to send very frequent requests to a
	given server, some might even block the crawler's IP if it is running too fast
- **Freshness**: The web is always changing so keeping the index up to date is ideal
- **Robustness**: The web can have _spider traps_ either put there maliciously to stop
	web crawlers or created on accident. A crawler should be resilient when finding these traps.
- **Extensibility**: The web is always changing and a web crawler should be able to adapt easily [1].

## Related

- [[Search Engine]]

## References

- [Stanford textbook on Information Retrieval][1]

[1]: https://nlp.stanford.edu/IR-book/ "Stanford Information Retrieval Book"
