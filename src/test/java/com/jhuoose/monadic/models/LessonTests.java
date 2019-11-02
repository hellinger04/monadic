package com.jhuoose.monadic.models;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

class LessonTests {

    @Test
    void testLessonConstructor() {
        Lesson lesson = new Lesson(0, 3);

        // retrieve actual text from Lesson and set expected text
        LessonElement actualText = lesson.getLessonElements().get(2);
        LessonElement expectedText = new Text(1, "\n\nWrite a function `foldFunctional` that takes in three "
                + "arguments:\n" + "\n" + "- A two argument function\n" + "- An accumulator, which can be of any value "
                + "(though it has to make sense for the function and the List)\n" + "- A `List`\n\n" +
                "Your `foldFunctional` will run the input function repeatedly over the accumulator and each element of "
                + "the List, and will return the final value of the accumulator as a result. For example, if `adder` is"
                + " your function, `0` is your accumulator, and `[1, 2, 3]` is your list, you should end up with the "
                + "number `6` as your output (since 1 + 2 + 3 = 6).\n\n" + "You should not mutate the value of any "
                + "pre-existing accumulator; you can only create new accumulator instances. You also can't mutate your "
                + "`List` since it's an Immutable.js object. Furthermore, you should not use for or while loops; use "
                + "recursion only.\n\n" + "**Problem 0.2.1:** Create a function `filterFunctional` that takes two "
                + "arguments:\n\n");

        // assert that values from Lesson are as expected
        assertEquals(3, lesson.getID());
        assertEquals(actualText.getContents(), expectedText.getContents());
    }

    @Test
    void testCourseConstructor() {
        // construct four lessons to comprise the course
        Lesson lesson0 = new Lesson(0, 0);
        Lesson lesson1 = new Lesson(0, 1);
        Lesson lesson2 = new Lesson (0, 2);
        Lesson lesson3 = new Lesson (0, 3);

        // construct an ArrayList and add each lesson to it
        ArrayList<Lesson> lessons = new ArrayList<>();
        lessons.add(lesson0);
        lessons.add(lesson1);
        lessons.add(lesson2);
        lessons.add(lesson3);

        // construct Course and get a sample problem and text from the Course's lessons
        Course course = new Course(1, lessons);
        LessonElement problem = course.getLessonList().get(0).getLessonElements().get(1);
        LessonElement text = course.getLessonList().get(3).getLessonElements().get(4);

        // set expected values for problem and text
        String expectedProblem = "function adder(x, y) {\n" + "    // your code here\n" + "    // solution added for " +
                "development purposes\n" + "    return x + y\n" + "}\n\n";
        String expectedText = "\n\n" +
                "- A predicate, ie. a function that takes in a single argument and returns true or false.\n" +
                "- A `List`\n\n" + "Your `filterFunctional` will run the predicate repeatedly over each element in the "
                + "list. The output is a new `List` where only elements that make the predicate return `true` exist. "
                + "For instance, if `greaterThan2` is your predicate and `[1, 3, 2, 5, 7]` is your `List`, then " +
                "`filterFunctional` should return `[3, 5, 7]`.\n\n" + "Again, you should not mutate the `List`, nor " +
                "should you use for or while loops.\n";

        // assert that values from Course are as expected
        assertEquals(1, course.getID());
        assertEquals(problem.getContents(), expectedProblem);
        assertEquals(text.getContents(), expectedText);
    }

    @Test
    void testTextConstructor() {
        // construct new Text and assert values are as expected
        LessonElement text = new Text(1, "test text");
        assertEquals(1, text.getID());
        assertEquals("test text", text.getContents());
        // Text should not be a Problem, so assert this is the case
        assertFalse(text.isProblem());
    }

    @Test
    void testTestCaseConstructor() {
        // construct new TestCase and assert values are as expected
        TestCase testCase = new TestCase(3,"input", "output");
        assertEquals(3, testCase.getID());
        assertEquals("input", testCase.getInput());
        assertEquals("output", testCase.getOutput());
    }

    @Test
    void testProblemConstructor() {
        // construct new Problem by providing sample text, define expected contents based on sample text
        LessonElement problem = new Problem(5, "function adder(x, y) {\n" + "    // Your code here\n" + "}\n\n"
                + "// TESTS\n" + "// adder(2, 3) ==> 5\n" + "// adder(100, -100) ==> 0\n" + "// adder(\"Foo\", \"Bar\")"
                + " ==> \"FooBar\"");
        String expectedContents = "function adder(x, y) {\n" + "    // Your code here\n" + "}\n" + "\n";

        // assert values are as expected
        assertEquals(5, problem.getID());
        assertTrue(problem.isProblem());
        assertEquals(expectedContents, problem.getContents());
    }

    @Test
    void testProblemTestCases() {
        // construct new Problem by providing sample text, get list of tests from Problem
        Problem problem = new Problem(5, "function adder(x, y) {\n" + "    // Your code here\n" + "}\n\n"
                + "// TESTS\n" + "// adder(2, 3) ==> 5\n" + "// adder(100, -100) " + "==> 0\n// adder(\"Foo\", \"Bar\")"
                + " ==> \"FooBar\"");
        List<TestCase> tests = problem.getTests();

        // assert test values are as expected
        assertEquals("adder(2, 3)", tests.get(0).getInput());
        assertEquals("adder(100, -100)", tests.get(1).getInput());
        assertEquals("adder(\"Foo\", \"Bar\")", tests.get(2).getInput());
    }
}

