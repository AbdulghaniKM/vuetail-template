# Clean Code Rules 🌻

These guidelines are based on "Clean Code: A Handbook of Agile Software Craftsmanship" by Robert C. Martin. All AI agents working on this template MUST deeply internalize and strictly adhere to these rules to maintain a pristine, maintainable, and readable codebase.

## 1. Naming Conventions

*   **Use Intention-Revealing Names:** The name of a variable, function, or class should answer all the big questions. It should tell you why it exists, what it does, and how it is used. Avoid generic names like `data`, `res`, `val`, `temp`.
*   **Avoid Disinformation:** Avoid leaving false clues that obscure the meaning of code. Do not use words with entrenched meanings that vary from our intended meaning.
*   **Make Meaningful Distinctions:** If names must be different, then they should also mean something different. Number-series naming (`a1`, `a2`) is the opposite of intentional naming.
*   **Use Pronounceable Names:** If you can't pronounce it, you can't discuss it without sounding like an idiot.
*   **Use Searchable Names:** The length of a name should correspond to the size of its scope. Single-letter names can ONLY be used as local variables inside short methods.
*   **Avoid Mental Mapping:** Readers shouldn't have to mentally translate your names into other names they already know.
*   **Class Names:** Classes and objects should have noun or noun phrase names like `Customer`, `WikiPage`, `Account`, and `AddressParser`. Avoid words like `Manager`, `Processor`, `Data`, or `Info` in the name of a class. A class name should not be a verb.
*   **Method Names:** Methods should have verb or verb phrase names like `postPayment`, `deletePage`, or `save`.
*   **Pick One Word per Concept:** Pick one word for one abstract concept and stick with it. Don't use `fetch`, `retrieve`, and `get` as equivalent methods of different classes.
*   **Don't Pun:** Avoid using the same word for two purposes.
*   **Use Solution Domain Names:** Remember that the people reading your code will be programmers. Go ahead and use computer science (CS) terms, algorithm names, pattern names, math terms, etc.
*   **Use Problem Domain Names:** When there is no "programmer-ese" for what you're doing, use the name from the problem domain.

## 2. Functions

*   **Rule 1: Small!** The first rule of functions is that they should be small.
*   **Rule 2: Smaller Than That!** The second rule of functions is that they should be smaller than that. They should hardly ever be 20 lines long.
*   **Do One Thing (SRP):** Functions should do one thing. They should do it well. They should do it only.
*   **One Level of Abstraction per Function:** We want the code to read like a top-down narrative. Every function should be followed by those at the next level of abstraction (The Step-down Rule).
*   **Switch Statements:** Bury switch statements in low-level classes and hide them behind polymorphism (e.g., Abstract Factories) whenever possible.
*   **Use Descriptive Names:** Don't be afraid to make a name long. A long descriptive name is better than a short enigmatic name. A long descriptive name is better than a long descriptive comment.
*   **Function Arguments:** The ideal number of arguments for a function is zero (niladic). Next comes one (monadic), followed closely by two (dyadic). Three arguments (triadic) should be avoided where possible. More than three (polyadic) requires very special justification—and then shouldn't be used anyway.
*   **Flag Arguments:** Flag arguments are ugly. Passing a boolean into a function is a terrible practice. It immediately complicates the signature of the method, loudly proclaiming that this function does more than one thing.
*   **Have No Side Effects:** Side effects are lies. Your function promises to do one thing, but it also does other hidden things.
*   **Command Query Separation:** Functions should either do something or answer something, but not both.
*   **Prefer Exceptions to Returning Error Codes:** Returning error codes implies that the caller must deal with the error immediately. Exceptions allow you to separate error processing from the happy path.
*   **Extract Try/Catch Blocks:** Try/catch blocks are ugly in their own right. They confuse the structure of the code and mix error processing with normal processing. Extract the bodies of the `try` and `catch` blocks out into functions of their own.
*   **Don't Repeat Yourself (DRY):** Duplication may be the root of all evil in software.

## 3. Comments

Comments do not make up for bad code. **Explain yourself in code.** Clear and expressive code with few comments is far superior to cluttered and complex code with lots of comments.

**Good Comments:**
*   Legal comments (Copyrights, licenses).
*   Informative comments (e.g., explaining a complex Regex pattern).
*   Explanation of Intent (Explaining *why* a decision was made).
*   Clarification (Translating obscure arguments or return values into readable form).
*   Warning of Consequences (e.g., `// Don't run this unless you have some time to kill.`).
*   TODO Comments.
*   Amplification (Amplifying the importance of something that might otherwise seem inconsequential).

**Bad Comments:**
*   Mumbling (Plopping in a comment just because you feel you should or because the process requires it).
*   **Redundant Comments:** Comments that take longer to read than the code itself, or comments that just restate what the code clearly says.
*   Misleading comments.
*   Mandated comments (e.g., a rule that every function must have a Javadoc).
*   Journal comments (We have git for this).
*   **Noise Comments:** Restating the obvious (e.g., `// Title` above `const title = ...`).
*   Scary noise (Comments that are just plain wrong).
*   Don't use a comment when you can use a function or a variable.
*   Position markers (e.g., `// Actions ///////////////////`).
*   Closing brace comments.
*   Attributions and bylines (Git does this).
*   **Commented-Out Code:** DELETE IT. Others won't delete it because they assume it's there for a reason.
*   HTML Comments in source code.
*   Nonlocal information (A comment should describe the code adjacent to it).

## 4. Classes and Composables

*   **Classes Should Be Small:** With functions, we measure size by counting physical lines. With classes, we measure size by counting responsibilities.
*   **The Single Responsibility Principle (SRP):** A class or module should have one, and only one, reason to change.
*   **Cohesion:** Classes should have a small number of instance variables. Each of the methods of a class should manipulate one or more of those variables. The more variables a method manipulates, the more cohesive that method is to its class.
*   **Maintaining Cohesion Results in Many Small Classes:** When classes lose cohesion, split them!
*   **Organizing for Change:** Isolate your classes from change. Classes should be open for extension but closed for modification (OCP).
*   **Dependency Inversion Principle (DIP):** Classes should depend upon abstractions, not on concrete details.