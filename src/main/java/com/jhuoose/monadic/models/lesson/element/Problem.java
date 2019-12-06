package com.jhuoose.monadic.models.lesson.element;

import com.jhuoose.monadic.models.lesson.TestCase;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Problem implements LessonElement {

    public  enum Language {
        JAVASCRIPT, TYPESCRIPT, OTHER
    }

    private int id;
    private String starterCode;
    private String answerCode;
    private List<TestCase> tests;
    private List<String> keyWords;
    private Language language;

    public Problem(int ID, String text) {
        // String[] words = new String[] {"run", "bind", "raise", "ret", "tryWith"};

        this.id = ID;
        this.tests = new ArrayList<>();
        this.keyWords = new ArrayList<>();

        String[] sections = text.split("\\s*/////\\s*");
        for (String section : sections) {
            if (section.startsWith("CODE")) {
                this.starterCode = section.replaceFirst("CODE\\s*", "");
            } else if (section.startsWith("SOLUTION")) {
                this.answerCode = section.replaceFirst("SOLUTION\\s*", "");
            } else if (section.startsWith("TESTS")) {
                String[] testStrings = section.replaceFirst("TESTS\\s*", "").split("\n");
                for (int i = 0; i < testStrings.length; ++i) {
                    String[] inputOutput = testStrings[i].split("\\s*==>\\s*");
                    this.tests.add(new TestCase(i, inputOutput[0], inputOutput[1]));
                }
            } else if (section.startsWith("KEYWORDS")) {
                String[] keywords = section.replaceAll("\\s*", "").split(",");
                this.keyWords = Arrays.asList(keywords);
            } else if (section.startsWith("LANGUAGE")) {
                String lang = section.replaceFirst("LANGUAGE", "").replaceAll("\\s*", "");
                if (lang.toLowerCase().equals("javascript")) {
                    this.language = Language.JAVASCRIPT;
                } else if (lang.toLowerCase().equals("typescript")) {
                    this.language = Language.TYPESCRIPT;
                } else {
                    this.language = Language.OTHER;
                }
            }
        }

        // If no solution code exists yet, use regular starter code instead
        if (this.answerCode == null) {
            this.answerCode = this.starterCode;
        }
    }

    public Problem(int ID, String starterCode, String tests, List<String> keyWords) {
        this.id = ID;
        this.starterCode = starterCode;
        this.keyWords = keyWords;
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

    public String getAnswerCode() { return answerCode; }

    public List<String> getKeyWords() {
        return keyWords;
    }

    public Language getLanguage() {
        return language;
    }
}
