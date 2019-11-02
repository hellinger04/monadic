package com.jhuoose.monadic.models;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

class LessonTests {

    @Test
    void testLessonConstructor() {
        Lesson lesson = new Lesson(0, 3);
        assertEquals(3, lesson.getID());

        LessonElement expectedText = new Text(1, "\n\nWrite a function `foldFunctional` that takes in three arguments:\n" +
                "\n" + "- A two argument function\n" +
                "- An accumulator, which can be of any value (though it has to make sense for the function and the List)\n" +
                "- A `List`\n" + "\n" +
                "Your `foldFunctional` will run the input function repeatedly over the accumulator and each element of the List, and will return the final value of the accumulator as a result. For example, if `adder` is your function, `0` is your accumulator, and `[1, 2, 3]` is your list, you should end up with the number `6` as your output (since 1 + 2 + 3 = 6).\n" +
                "\n" +
                "You should not mutate the value of any pre-existing accumulator; you can only create new accumulator instances. You also can't mutate your `List` since it's an Immutable.js object. Furthermore, you should not use for or while loops; use recursion only.\n" +
                "\n" + "**Problem 0.2.1:** Create a function `filterFunctional` that takes two arguments:\n\n");
        LessonElement actualText = lesson.getLessonElements().get(2);
        assertEquals(actualText.getContents(), expectedText.getContents());
    }

    @Test
    void testTextConstructor() {
        LessonElement text = new Text(1, "test text");
        assertEquals(1, text.getID());
        assertEquals("test text", text.getContents());
        assertFalse(text.isProblem());
    }

    @Test
    void testTestCaseConstructor() {
        TestCase testCase = new TestCase(3,"input", "output");
        assertEquals(3, testCase.getID());
        assertEquals("input", testCase.getInput());
        assertEquals("output", testCase.getOutput());
    }

    @Test
    void testProblemConstructor() {
        LessonElement problem = new Problem(5, "function adder(x, y) {\n" +
                "    // Your code here\n" +
                "}\n" +
                "\n" +
                "// TESTS\n" +
                "// adder(2, 3) ==> 5\n" +
                "// adder(100, -100) ==> 0\n" +
                "// adder(\"Foo\", \"Bar\") ==> \"FooBar\"");
        assertEquals(5, problem.getID());
        assertTrue(problem.isProblem());
        assertEquals("function adder(x, y) {\n" + "    // Your code here\n" + "}\n" + "\n", problem.getContents());
    }

    @Test
    void testProblemTestCases() {
        LessonElement problem = new Problem(5, "function adder(x, y) {\n" +
                "    // Your code here\n" +
                "}\n" +
                "\n" +
                "// TESTS\n" +
                "// adder(2, 3) ==> 5\n" +
                "// adder(100, -100) ==> 0\n" +
                "// adder(\"Foo\", \"Bar\") ==> \"FooBar\"");

        List<TestCase> tests = ((Problem) problem).getTests();
        assertEquals("adder(2, 3)", tests.get(0).getInput());
        assertEquals("adder(100, -100)", tests.get(1).getInput());
        assertEquals("adder(\"Foo\", \"Bar\")", tests.get(2).getInput());
    }
}

