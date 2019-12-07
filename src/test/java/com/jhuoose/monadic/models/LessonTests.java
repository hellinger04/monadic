package com.jhuoose.monadic.models;

import com.jhuoose.monadic.models.lesson.TestCase;
import com.jhuoose.monadic.models.lesson.*;
import com.jhuoose.monadic.models.lesson.element.LessonElement;
import com.jhuoose.monadic.models.lesson.element.Problem;
import com.jhuoose.monadic.models.lesson.element.Text;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

class LessonTests {

    @Test
    void testLessonConstructor() {
        Lesson lesson = new Lesson(0, 0);

        // retrieve actual text from Lesson and set expected text
        LessonElement actualText = lesson.getLessonElements().get(0);
        LessonElement expectedText = new Text(1, "# Lesson 0.0: Intro to Functional Programming\n" +
                        "\n" +
                        "Monads are a *functional programming* concept, so before we even touch monads we need to have a solid understanding of what the heck functional programming is.\n" +
                        "\n" +
                        "First, you know what programming is, with or without the functional part, right? In particular, our tutorial will be using JavaScript and TypeScript throughout, so if you don’t have a good grasp of these languages, we suggest that you learn them. There are plenty of resources on the Internets that can teach you better than we can, so we suggest using Google.\n" +
                        "\n" +
                        "![What Google looked like in 1996](https://www.uxpincdn.com/studio/wp-content/uploads/2013/03/google-first-look.jpg)\n" +
                        "(Photo source: [Studio by UXPin](https://www.uxpin.com/studio/blog/should-designers-code/))\n" +
                        "\n" +
                        "You learned how to do JavaScript? Good? Let's check.\n" +
                        "\n" +
                        "**Problem 0.0.0:** Let’s check that you have a modicum of JavaScript knowledge. Write in JavaScript a function called `adder` that adds two numbers together. We will be using this function in the next lesson.\n" +
                        "\n");

        // assert that values from Lesson are as expected
        assertEquals(0, lesson.getID());
        assertEquals(expectedText.getContents(), actualText.getContents());
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
        LessonElement text = course.getLessonList().get(0).getLessonElements().get(0);
        LessonElement problem = course.getLessonList().get(0).getLessonElements().get(1);

        // set expected values for problem and text (from Lesson 0.0)
        String expectedProblem =
                "function adder(x, y) {\n"
                + "  // TODO: Your code here\n"
                + "}";

        String expectedText = "# Lesson 0.0: Intro to Functional Programming\n" +
                "\n" +
                "Monads are a *functional programming* concept, so before we even touch monads we need to have a solid understanding of what the heck functional programming is.\n" +
                "\n" +
                "First, you know what programming is, with or without the functional part, right? In particular, our tutorial will be using JavaScript and TypeScript throughout, so if you don’t have a good grasp of these languages, we suggest that you learn them. There are plenty of resources on the Internets that can teach you better than we can, so we suggest using Google.\n" +
                "\n" +
                "![What Google looked like in 1996](https://www.uxpincdn.com/studio/wp-content/uploads/2013/03/google-first-look.jpg)\n" +
                "(Photo source: [Studio by UXPin](https://www.uxpin.com/studio/blog/should-designers-code/))\n" +
                "\n" +
                "You learned how to do JavaScript? Good? Let's check.\n" +
                "\n" +
                "**Problem 0.0.0:** Let’s check that you have a modicum of JavaScript knowledge. Write in JavaScript a function called `adder` that adds two numbers together. We will be using this function in the next lesson.\n" +
                "\n";


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
        Problem problem = new Problem(5,
                "///// CODE\n"
                        + "function adder(x, y) {\n"
                        + "    // Your code here\n"
                        + "}\n\n"
                        + "///// TESTS\n"
                        + "adder(2, 3) ==> 5\n"
                        + "adder(100, -100) ==> 0\n"
                        + "adder(\"Foo\", \"Bar\") ==> \"FooBar\"\n\n"
                        + "///// LANGUAGE"
                        + "JavaScript");
        String expectedContents =
                "function adder(x, y) {\n"
                + "    // Your code here\n"
                + "}";

        // assert values are as expected
        assertEquals(5, problem.getID());
        assertTrue(problem.isProblem());
        assertEquals(expectedContents, problem.getContents());
        assertEquals(Problem.Language.JAVASCRIPT, problem.getLanguage());
    }

    @Test
    void testProblemTestCases() {
        // construct new Problem by providing sample text, get list of tests from Problem
        Problem problem = new Problem(5,
                "///// CODE\n"
                        + "function adder(x, y) {\n"
                        + "    // Your code here\n"
                        + "}\n\n"
                        + "///// TESTS\n"
                        + "adder(2, 3) ==> 5\n"
                        + "adder(100, -100) ==> 0\n"
                        + "adder(\"Foo\", \"Bar\") ==> \"FooBar\"");
        List<TestCase> tests = problem.getTests();

        // assert test values are as expected
        assertEquals("adder(2, 3)", tests.get(0).getInput());
        assertEquals("adder(100, -100)", tests.get(1).getInput());
        assertEquals("adder(\"Foo\", \"Bar\")", tests.get(2).getInput());
    }

    @Test
    void testProblemKeyWords() {
        Problem problem = new Problem(11,
                "///// CODE\n" +
                        "function mult(x, y) {\n" +
                        "  return x * y;\n" +
                        "}\n\n" +
                        "function mapped(arr1) {\n" +
                        "  // TODO: Your code here\n" +
                        "}\n\n" +
                        "///// TESTS\n" +
                        "mapped([-1, -2, -3]); ==> [-3,-6,-9]\n\n" +
                        "///// KEYWORDS\n" +
                        "mapped: mult, bind\n" +
                        "foo: bar");
        Map<String, List<String>> kp = problem.getKeyPairs();

        assertEquals("mult", kp.get("mapped").get(0));
        assertEquals("bind", kp.get("mapped").get(1));
        assertEquals("bar", kp.get("foo").get(0));
    }
}

