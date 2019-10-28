package com.jhuoose.monadic.models;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

public class Problem implements LessonElement {

    private int id;
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

    public Problem(int ID, String text) {
        this.id = ID;
        this.starterCode = text;
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
