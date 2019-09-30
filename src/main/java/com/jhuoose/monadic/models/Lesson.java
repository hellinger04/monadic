package com.jhuoose.monadic.models;

import java.util.ArrayList;

public class Lesson {

    double ID;
    ArrayList<Problem> problemList;
    String lessonText;

    public Lesson(double ID, ArrayList<Problem> problemList, String lessonText) {
        this.ID = ID;
        this.problemList = problemList;
        this.lessonText = lessonText;
    }

    public double getID() {
        return ID;
    }

    public ArrayList<Problem> getProblemList() {
        return problemList;
    }

    public String getLessonText() {
        return lessonText;
    }
}
