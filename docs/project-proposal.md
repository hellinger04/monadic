# Project Proposal: Monad Tutorial
Group Members:
Andrew Hellinger

# Elevator Pitch

Monads are infamously hard to explain. Just look at the comments of Computerphile's video on them. So why not create a website that teaches you monads by doing?

# Problem

Monads are one of the most notorious difficult concepts in theoretical computer science. Anyone who is not previously educated in category theory will not understand the usual dictionary definition (see below). However, monads are quite useful in computer science, with state and exceptions being examples of monads being used in practice. Thus, there is a great need for a way of teaching students what a monad is and how monads are used.

## Introduction to Domain

- Monad: A...well, that's the whole problem, right? A common (joke) definition
is that "a monad is a monoid in the category of endofunctors."
(Source: https://blog.merovius.de/2018/01/08/monads-are-just-monoids.html)
Explained more simply, a monad is one of the many design patterns that allows
code reuse; examples include monads for state and exceptions.

- Functional programming: This is the programming paradigm that is most commonly associated with monads. Functional programming emphasizes functions and the immutability of data, while the other main paradigm (imperative programming) emphasizes changing of state and doing things in a certain order. Examples of functional programming languages include Haskell, Clojure and OCaml.

# Solution

It is common knowledge that most people learn better by doing stuff rather than
just learning from a textbook or lecture. Websites that allow you to learn, say, programming languages via interaction are quite common. As monads have quite a few practical implementation/uses as a software design pattern, it would make sense to make a website that allows you to practice implementing monads interactively.

## Inspirations

- The Haskell main page has an interactive tutorial on its front page:
https://www.haskell.org
- 4Clojure is a Clojure tutorial site that features user accounts that keep track of how many problems the user completes:
http://www.4clojure.com/

## Architecture Overview

- Front-end: A website where users can sign in, select monad problems, and implement solutions to said problems.
- Back-end: A server that keeps track of user data.

## Features

- Users have a profile, where they can store their progress on tutorials and problems
- Problems are listed on a main site with title and difficulty.
- User can type up code, which the website evaluates for correctness.
- User account keeps track of user progression (ie. how many problems have been completed).
- User can submit custom problems to the webpage

## Wireframes

_Actual wireframe to be created_

The wireframe would consist of several web pages:
- A home page with a list of problem sets; clicking on one leads to...
- A page that has the problem description at top and a space to write code at the bottom; there will be a "Submit" button that displays if the user's code is correct or not and leads to the next problem if correct.

![](<!-- TODO -->)

## User Stories
- As someone interested in functional programming, I want to learn about monads without having to go to a university course.
- As a university professor, I would like a neat way for my students to practice their knowledge of monads.

# Viability

## Background Knowledge

- We, the developers, must learn what monads are ourselves!
- We also need to learn JavaScript and other tools, but that's the purpose of OOSE!    

## Hardware

- We at least need a computer (a mobile version is something for a later iteration).

## APIs

- We need some way to host a website. (GitHub provides a way, but it's limited to one website per profile. Also it's not convenient for real projects.)
- We need a backend web server and DB to keep track of user progress.

## Tools

- Programming language: Java + a bit of Kotlin
- IDE: IntelliJ IDEA
- Version control: Git + GitHub (natch)
- Web deployment: Heroku (will be our server; also have SQLite DB?)

## Proof of Concept

- A GitHub repo titled "Learning Monads in an Example" already exists: https://github.com/DiegoVicen/monadic-gcd. However, it only has one example, and it's more of a demo than a serious teaching tool.

# Difficulty

- Shouldn't be too hard to implement, given that this is essentially just a basic web app. The hard part comes from the esoteric domain knowledge and the challenge of implementing solution validation functions.

# Market Research

## Users

- Not too many users actually, as programming language theory is a topic that only a few nerds like myself care about.

## Competition

- There are quite a few online tutorials for monads, usually in relation to Haskell. However, none of them are interactive (save for the aforementioned GitHub repo) and mostly consist of either text or videos.
- Currently, most people learn about monads through books, blog posts, and language documentation - none of which are interactive, or in school - which isn’t feasible for most functional programmers. For those who are no longer in school but are still interested in learning about functional programming.

# Roadmap

https://github.com/jhu-oose/2019-group-monadic/projects/1
