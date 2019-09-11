# Project Proposal: Monad Tutorial
Group Members:
Andrew Hellinger,
Kelvin Qian,
Nathan Vallapureddy

# Elevator Pitch

Monads are infamously hard to explain; just look at the comments of Computerphile's video on them. So why not create a website that teaches you monads by doing?

# Problem

Monads are one of the most notorious difficult concepts in theoretical computer science. Anyone who is not previously educated in category theory will not understand the usual dictionary definition (see below). However, monads are quite useful in computer science, with state and exceptions being examples of monads being used in practice. Thus, there is a great need for a way of teaching students what a monad is and how monads are used.

## Introduction to Domain

- Monad: A...well, that's the whole problem, right? A common (joke) definition is that "a monad is a monoid in the category of endofunctors." (Source: https://blog.merovius.de/2018/01/08/monads-are-just-monoids.html)
Explained more simply, a monad is one of the many design patterns that allows code reuse; examples include monads for state and exceptions. A monad consists of three parts (taken from the [Wikipedia article](https://en.wikipedia.org/wiki/Monad_(functional_programming))):
    1. A _type constructor_ `M` that builds a monadic type `M T` from a regular type `T` (eg. `T` is an `int` or a `string`).
    2. A _type converter_ that turns the regular type `T` into a monadic type `T` (eg. `unit(x) : T -> M T`).
    3. A _combinator_ that takes in  a monadic type and a monadic function and returns another monadic type (eg. `(mx >>= f) : (M T, T -> M U) -> M U`.

An example would be to use a monad to allow an operation to take in both regular data (`int`, `boolean`, `string`, etc.) and also `null` data. For example, the following defines a safe `not` operation using the monadic type `Maybe Boolean` (which can either be `Nothing` or an actual `boolean`, ie. `Just Boolean`):
```
>>= : (Maybe T, T -> Maybe U) -> Maybe U
(mx >>= f) =
    if mx is Just(x) then f(x)
    else Nothing

not : Maybe Boolean -> Maybe Boolean
not(mp) = mp >>= fun p -> (unit(not(p)) // mp is a "Maybe Boolean" variable
```

- Functional programming: This is the programming paradigm that is most commonly associated with monads. Functional programming emphasizes functions and the immutability of data, while the other main paradigm (imperative programming) emphasizes changing of state and doing things in a certain order. Examples of functional programming languages include Haskell, Clojure and OCaml.

# Solution

It is common knowledge that most people learn better by doing stuff rather than
just learning from a textbook or lecture. Websites that allow you to learn, say, programming languages via interaction are quite common. As monads have quite a few practical implementation/uses as a software design pattern, it would make sense to make a website that allows you to practice implementing monads interactively.

## Inspirations

- The Haskell main page has an interactive tutorial on its front page:
https://www.haskell.org
- 4Clojure is a Clojure tutorial site that features user accounts that keep track of how many problems the user completes:
http://www.4clojure.com/
- Leetcode is a commonly-used website for practicing coding skills by solving coding challenges:
https://leetcode.com/
- HackerRank is a website that is similar to Leetcode in purpose:
https://www.hackerrank.com/

## Architecture Overview

- Front-end: A website where users can sign in, select monad problems, and implement solutions to said problems.
- Back-end: A server that keeps track of user data and evaluates user-written solution code.

## Features

- Users have a profile, where they can store their progress on tutorials and problems.
- Problems are listed on a main site with title and difficulty.
- User can type up code, which the website evaluates for correctness.
- User account keeps track of user progression (ie. how many problems have been completed).
- User can submit custom problems to the webpage.
- One webpage will link to a number of open-source projects that use monads.

## Wireframes

![Landing page](https://lh3.googleusercontent.com/KCyogUEw2ZKSvJAUBdnxW7vChcTR0vRSOKaphBes8at2mwhWHG726t1e8CESLBTUnWKiyk008IOCJBnX0MKFCnR8xHST77gF0_9kIwEa_Ekn6H1VlgCDWugZW_Q1JztHa7tuuw0FpbeSTthmZwNZv2Vpn6PQLDvidI8NO_C3yCUYpjxegT_76gppaoMboZvLUkngy5_pBTMsvTT-kdOSpJ1k9EugdsS_DF5M6xoJULPxFkCFj8NzkGkOCIxq4ohfjlmzm_3vobRX_xHre8PXVkfGexQmHpHZukSW1brVV7CMgQRLDYEBQr1PLDwoQxFtnilU58jdX6WdnaJeCbm3newR1eYjvMi9b44MBZJLLMj-danXXq_-kDOT2NGHueytSwdo2qFWUitfjWdDyvxeXYTaVzafkEjUp-vv2qRgXlRjdS0AU06vG3XIJAYQHpUWg0sSSmWkRHWG3Gh66CnfZu97gcnzjtaCdg9Hi8LiKZ4uNBintWsKo-3bRV-JL_XQT9ebyiJh4WWWnp3NfCjIeM5BbYrYRdSp9XHCJkFM5ANsTXAv-SEDx68-cEXqKK4ccBOPKB1-Ua4kEVdu9rX2CNQKytB0wJpLy5UhdXmfOdchcf7S7vlA3TaMdfDrLAijENMxODUYgq1aYp4LmTumHJSsl8YNrdplq0noly4lxNKASfr6FPdl1Fg=w1080-h810-no)
![Tutorial page](https://lh3.googleusercontent.com/PPguzAXRwVoGdujYUjl879yBQpF427iMO57hp_B-VRkVZqiIyqF6mqmvcs_05snHGTj-sQV5nyA-r8-8Aeggif53gqob8NLafdEVgCYp9-bAYbuNuye6ODONcbPzdwlcp0r_uKs1ACrDyLMQfGL7IvKPMOJYtCjG9txPOfHIeT_80CAN6wkYxwWvIwHd35Hwa8ByCxnhXxszNxqcHoG_O3UCqNaUPQTn1ph542-_8D4LF-N3ZC0N89_Bwn6EtP7Y3AD95W5Te4UG9FdsZ-ORgbl5MN3zCiBori-7lsyaiaETCvrL7thuj1W0HHufz8Sc1UD2EZEVcdyGKSKcQeR-SvqUEucUHG-pmOs7iWnyc2nRzLRGnST7-s6u5vkt-aw1k1xA46_tKh6583JynOajHPM2-t94M8VjEvP2EZeb1xbwkwYHm3nIKfQqgDpc9H499tGmOASMRVwaSnRVQNQjpj1fXsXLpHc7gwg2GVb5Yu0owtlLJyqSqh-GhHrzAWlrcyQoXYxK1O3-FsSDuwfcpze2RRUo-v9T7qzZMl0B1XIwiZZLe2PLpzwAyAh01i2X_980JzX9LYbIbYGWcQNoZLhFthHS31MGITqvKfmrBlEvpCpSFPtL9EbAwqeOUlhRSQscqAG3Q8NAnZ1GBLJVkVC4MjfWCTTMTSWZXeoOeu5SL1AvHpKWqxs=w628-h837-no)
![Problems page](https://lh3.googleusercontent.com/EKd18eH3aTVI_1H9_DgtN7mxK1tPwUfFXYdunLyxI5Ki4NVqoSWNXGqUEnMdFtwqZing9PIZHmrbfcpVF2IU8zN4-BKke9CrA7ptxidIKPXsWncS7h_-O-6VIXk0bv26O2UZUPHGQ0PvwLlzzloRNz9L47yb4qNMbTHJ6d90NhPgyrZv6FoR_KZchbf7eoLHaqeUoXzI-C61Ar6SRVzfzFKX1Pdqk05LvCmpbh3hAE8ZVCkHojoBS39kXlL8YoqelW1sPFNWq0O9f1SPwdZRj4wJ7Sti_GpekTm5LHbpGVD_sT5SAsNfNuo3JOjAIJH4KP7H8TdGHPSn6_Qp0iYxCwQZXMUwT0s6LLjx7K9UpT7nYZsMqQS2ySUEf3epeKCcZC5hcpaPqg3MkStnLs0ZrpVkP5-QN2vGTm37xFv92WwKipl28aSfugynNdnmPA4H6Rg9A9YvT7IIxgbtDSDZQz9Sdyw1LYXZUHQ2aC5vYR5GXtvYlK-TFYbwnVgZeZvun86dtHt_H8zF810d9dgRBJ5rFfHfAE7-e7iMUbK4RQcvg2s5-DARqv61exXKIErTEmntMI0wDIophsM0QE3rq84W_Yk594v3Z1GIT6fS_UsdPXnzpJnT-5cDH8QfdwABOnLwfAu76FamkdgnwsOatMuy3gzes9lTpePvblwmBu9hjrvRd9e7tGU=w956-h837-no)
![Problems list](https://lh3.googleusercontent.com/35PQnaCIFOXcA5Z1yjLM-ndRX0aP61r6mp2qSjSBS-S6RL4jPPhBDS2JuC_OOlSnKQuE1KkxqRF9oZEESHJ5v7dEwbSUuZwaRxRyOWSZPKQYEOZS81XC16h7PNVt2XULvWzdxirkEQxzO4lb7B4WVyPhG4f94iUFYqweo2ZWTgwqYgP7RePYdaYKYq88ff5Mfj3igZGYaz-GvFG6Ml0shFG0Okkwqsap1z7ujqKOg1o02rSm3B98AqlT7T882WvVGsjoGsG1o3yUKiXfhVoOoxF8zMzIJJGDvRu_hJgvfxcPQAvj75iFZsGb6IC7wKAjnvIDGzDeTdADTMaTvmSgHM7upiGgpX88BVANhjCRqt6Q7ImyLM-4828ugdQAJ0_G0kEbaE8XjtBDS6dkJorgfK5p2vl-Ejqq9y_FtCYtQVc7D2vaGS4qM4g7pAK2nygLsPoD4UP4Ne4SRofSwysoLBHGuhHxTh-VCz2N2kmkKg70_Moa-dgPCxFuWn69gboOUZQbQ6NHsQVDQh8lwsAwizYCNXowcwQ4XA9rs7JlJFqJiuYSCmVddJ19VI2mALEzAHxAReku4sCbQY7mflqqFNL3HyJfneq73J7iO_cK3dJujO6szk6Y8tlP7rk40m1GIYld6BP6rX3L15ix8oTMHBArtKaTJ-VAnLWeLqjXMamSa2crILqDJWs=w1080-h810-no)
![Open Source](https://lh3.googleusercontent.com/RMtR6LorB6zw_agQxzMR3g3R3hnYx9_Jj5UjJF5nCmvU4hUoN0hLz7k7W2rx1vhLBzbBJm6D3k2Eijjg36JKqr5o_wUKJhVLQjVrJduUxv4FZHUlbIFypnVNhia7fsoCBvZ8RiGeoDai_V_7EwW-NqL_iJwtBCtqz6cI2u10QXcaJE8gKuqjyrRLigATNerksSwowMHhwO0rlxfE0U4UNA4Zj1oUKW_8K5NSAnRRnS2SlrIgVL1igtn_41Iu0ZB-BMswoI7ZKipP1M3dIo9QDmPMgC50u2BuclaIosL8esLq_mRDRK2zJLgneMiS5PwkfKDGLVewj5ZBqt_LsBS6Boo1g4ZU6OVZf20FAzwuZ1VANT5-37jTriId5GrMypbktOuqunMCl7kJKN9n4NKAbQcYxGeh-wBlSaLi8t9dt5eULKH9RY3A09lO2wBqtV4laEsj0Go3lMvnEQKvNo4u9YjQXlXFEdvuMOczodjLAU38n2uvcF2DeweileJkqkd0ZmVnWR3gJQjr_HXIo7rnrL7A2XbAJNIdAgokTGdCPKubLaG0-ZqBAI-U3StnwV0QoTsTjD7AF7PmPDPk50i0lpJyXCh6ceiQRRKd0zgcw5H_64uyXooactJAWhIS8n91Aqa485fEsjtaF5e4ejVhEpmHmnyTbvjtFslxVo_aAAHa5B3KdW8fyKI=w628-h837-no)


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

- We at least need a computer (a mobile version is something for a later iteration), which we all have.

## APIs

- We need some way to host a website. (GitHub provides a way, but it's limited to one website per profile. Also it's not convenient for real projects.)
- We need a backend web server and DB to keep track of user progress.
- We also need a way to compile/interpret/evaluate the code that the user has written, likely in a different language than what the project iself is implemented in (eg. OCaml vs. Java).

## Tools

- Programming language: Java + JavaScript + a bit of Kotlin; will also use a functional programming language for user solution implementation
- IDE: IntelliJ IDEA
- Version control: Git + GitHub (natch)
- Web deployment: Heroku (will be our server; also have SQLite DB?)

## Proof of Concept

- A GitHub repo titled "Learning Monads in an Example" already exists: https://github.com/DiegoVicen/monadic-gcd. However, it only has one example, and it's more of a demo than a serious teaching tool. It's also not interactive, despite the fact that it contains Haskell code snippets.

# Difficulty

- This shouldn't be too hard to implement, given that this is essentially just a basic web app. The hard part comes from the esoteric domain knowledge and the challenge of implementing solution validation functions.

# Market Research

## Users

- Currently there not too many users, but functional programming is becoming more popular due to its use in JavaScript. As monads are an important concept in functional programming, this opens up an opportunity for curious users to learn about them.

## Competition

- There are quite a few online tutorials for monads, usually in relation to Haskell. However, none of them are interactive and mostly consist of either text or videos.
- Example tutorials: [A 5-Minute Monad Tutorial](http://www.cs.cornell.edu/~akhirsch/monads.html), [About Monads](https://www.haskell.org/tutorial/monads.html), and [monads-in-clojure](https://github.com/khinsen/monads-in-clojure).
- Currently, most people learn about monads through books, blog posts, and language documentation - none of which are interactive, or in school - which isn’t feasible for most functional programmers. This is especially true for those who are no longer in school but are still interested in learning about functional programming.

# Roadmap

https://github.com/jhu-oose/2019-group-monadic/projects/1
