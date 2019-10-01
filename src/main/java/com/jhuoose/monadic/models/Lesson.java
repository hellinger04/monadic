package com.jhuoose.monadic.models;

import java.util.ArrayList;

public class Lesson {
    double id;
    ArrayList<String> problemList;
    String lessonText;

    public Lesson(double id, ArrayList<String> problemList, String lessonText) {
        this.id = id;
        this.problemList = problemList;
        this.lessonText = lessonText;
    }

    public double getId() {
        return id;
    }

    public void setId(double id) {
        this.id = id;
    }

    public ArrayList<String> getProblemList() {
        return problemList;
    }

    public void setProblemList(ArrayList<String> problemList) {
        this.problemList = problemList;
    }

    public String getLessonText() {
        return lessonText;
    }

    public void setLessonText(String lessonText) {
        this.lessonText = lessonText;
    }

}