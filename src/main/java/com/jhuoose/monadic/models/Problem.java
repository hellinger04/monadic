package com.jhuoose.monadic.models;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Problem implements LessonElement {

    private int id;
    private List<TestCase> tests;
    // private CanonicalAnswer canonicalAnswer;
    private String starterCode;

    public Problem(int ID, String text) {
        this.id = ID;
        String[] texts = text.split("//\\s?TESTS\n");
        this.starterCode = texts[0];

        if (texts.length > 1) {
            String[] testStrings = texts[1].split("\n");
            this.tests = new ArrayList<>();
            int currTest = 0;
            for (String testString : testStrings) {
                String[] inputOutput = testString.split("\\s*==>\\s*");
                tests.add(new TestCase(currTest, inputOutput[0].substring(3), inputOutput[1]));
                currTest++;
            }
        }
    }

    public Problem(int ID, String starterCode, String tests) {
        this.id = ID;
        this.starterCode = starterCode;
    }

    public boolean isProblem() {
        return true;
    }

    public String getContents() {
        return starterCode;
    }

    public int getID() {
        return id;
    }

    public List<TestCase> getTests() {
        return tests;
    }

    public String getStarterCode() {
        return starterCode;
    }
}
