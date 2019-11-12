package com.jhuoose.monadic.models.lesson.element;

import com.jhuoose.monadic.models.lesson.answer.TestCase;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Problem implements LessonElement {

    private int id;
    private List<TestCase> tests;
    private String starterCode;
    private List<String> keyWords;
    // private CanonicalAnswer canonicalAnswer;

    public Problem(int ID, String text) {
        String[] words = new String[] {"run", "bind", "raise", "ret"};

        this.id = ID;
        this.tests = new ArrayList<>();
        String[] texts = text.split("//\\s*TESTS\\s*\n");
        this.starterCode = texts[0];
        this.keyWords = new ArrayList<String>();

        // check specific words in starterCode
        for(int i = 0; i < words.length; i++) {
            words[i] = "\\b" + words[i] + "\\b";
            Pattern p = Pattern.compile(words[i]);
            Matcher m = p.matcher(this.starterCode);
            if(m.find()){
                this.keyWords.add(words[i]);
            }
        }

        if (texts.length > 1) {
            String[] testStrings = texts[1].split("\n");
            int currTest = 0;
            for (String testString : testStrings) {
                String[] inputOutput = testString.split("\\s*==>\\s*");
                tests.add(new TestCase(currTest, inputOutput[0].substring(3), inputOutput[1]));
                currTest++;
            }
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

    public List<String> getKeyWords() {
        return keyWords;
    }
}
