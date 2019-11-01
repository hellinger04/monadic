package com.jhuoose.monadic.models;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class LessonTests {
    @Test
    void testTextConstructor() {
        LessonElement text = new Text(1, "test text");
        assertEquals(1, text.getID());
        assertEquals("test text", text.getContents());
        assertTrue(!text.isProblem());
    }

    @Test
    void testTestCaseConstructor() {
        TestCase testCase = new TestCase("input", "output");
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
    }
}

