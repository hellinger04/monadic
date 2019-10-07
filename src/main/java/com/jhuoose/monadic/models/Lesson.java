package com.jhuoose.monadic.models;

import java.util.ArrayList;

public class Lesson {
    int ID;
    ArrayList<LessonElement> lessonElements;

    public Lesson(int ID, ArrayList<LessonElement> lessonElements) {
        this.ID = ID;
        this.lessonElements = lessonElements;
    }

    public double getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public ArrayList<LessonElement> getLessonElements() {
        return lessonElements;
    }

    public void addLessonElement(LessonElement lessonElement) { this.lessonElements.add(lessonElement); }

}