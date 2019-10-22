package com.jhuoose.monadic.models;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

public class Problem implements LessonElement {

    private int ID;
    private ArrayList<TestCase> tests;
    private CanonicalAnswer canonicalAnswer;
    private String description;
    private String starterCode = "";

//    public Problem(int ID, ArrayList<TestCase> tests, CanonicalAnswer canonicalAnswer, String description, String starterCode) {
////        this.ID = ID;
////        this.tests = tests;
////        this.canonicalAnswer = canonicalAnswer;
////        this.description = description;
////        this.starterCode = starterCode;
////    }

    public Problem(int ID, String filename) {
        this.ID = ID;
        try {
            BufferedReader reader = new BufferedReader(new FileReader(new File(filename)));
            String line;

            while ((line = reader.readLine()) != null) {
                this.starterCode = this.starterCode + line + "\n";
            }
        } catch (IOException e) {
            System.err.println("Bad filepath");
        }
    }

    public boolean isProblem() {
        return true;
    }

    public String getContents() {
        return starterCode;
    }

    public int getID() {
        return ID;
    }

    public ArrayList<TestCase> getTests() {
        return tests;
    }

    public CanonicalAnswer getCanonicalAnswer() {
        return canonicalAnswer;
    }

    public String getDescription() {
        return description;
    }

    public String getStarterCode() {
        return starterCode;
    }
}
