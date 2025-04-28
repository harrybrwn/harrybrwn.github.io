---
title: "Remora Notes"
description: "Random notes about my distributed web crawler project."
layout: ~/layouts/Basic.astro
---

# Crawling
- From the textbook on [Information Retrieval](https://nlp.stanford.edu/IR-book/)
    - [web crawling and indexing](https://nlp.stanford.edu/IR-book/html/htmledition/web-crawling-and-indexes-1.html)
    - <https://nlp.stanford.edu/IR-book/html/htmledition/crawling-1.html>
    - <https://nlp.stanford.edu/IR-book/html/htmledition/the-url-frontier-1.html>
- <https://www.ccs.neu.edu/home/vip/teach/IRcourse/IR_surveys/olston-najork@web-crawling10-crop.pdf>
- [Overview of various webcrawler architectures](https://www.microsoft.com/en-us/research/wp-content/uploads/2009/09/EDS-WebCrawlerArchitecture.pdf)
- [Estimating page freshness](https://www.youtube.com/watch?v=qrBXI_hrWrI)
- [Compaq Research Paper](https://www.cs.cornell.edu/courses/cs685/2002fa/mercator.pdf) with a [video presentation](https://www.youtube.com/watch?v=i5qLt0ShJSg)


# Queues
- The most efficient [Non-Blocking Queue algorithms](https://www.cs.rochester.edu/~scott/papers/1996_PODC_queues.pdf) along with [pseudocode](https://www.cs.rochester.edu/research/synchronization/pseudocode/queues.html)
- [Implementing Lock-Free Queues](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.53.8674&rep=rep1&type=pdf)
- [An Optimistic Approach to Lock-Free FIFO Queues](http://people.csail.mit.edu/shanir/publications/FIFO_Queues.pdf)


# Webpage Caching
- [Detecting Near-Duplicates for Web Crawling](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/33026.pdf)


# Graph Algorithms:
- [On Estimating Average Degree](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/42030.pdf) (Anirban Dasgupta, et al.)
- <https://www.youtube.com/watch?v=Tnu_Ws7Llo4> numberphile: A Breakthrough in graph theory
- <https://www.youtube.com/watch?v=CDMQR422LGM> talk on algebraic graph theory
- <https://www.youtube.com/watch?v=wOeRfcglBng>


# 3D Animations/Rendering:
- <https://www.youtube.com/watch?v=Q7AOvWpIVHU>


# Go Profiling Tutorials:
- <https://www.youtube.com/watch?v=xxDZuPEgbBU>
- <https://www.youtube.com/watch?v=ydWFpcoYraU>


# Names
- lared: "la red" in spanish means network
- reef: there are many biological networks that are supported by a coral reef
    - remora
    - reefnet
    - reefhop
- quest


# The Graph UI
Empower users by handing the graph to them. Google has been successful by
crawling and indexing the web then computing complex graph algorithms on the web
of the internet in order to find what users need. But what if we sent the graph
to the users, give them the power to traverse the graph of links themselves
enabled by tools created by me. In essence, it is dissolving the centralized
brain of google and distributing it's parts across its entire user base. The
brain of the web should not be behind corporate firewalls, but in the hands of
the people.
