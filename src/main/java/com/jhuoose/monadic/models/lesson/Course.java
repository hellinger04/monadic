package com.jhuoose.monadic.models.lesson;

import java.util.ArrayList;

public class Course {

    private int ID;
    private ArrayList<Lesson> lessonList;

    public Course(int ID, ArrayList<Lesson> lessonList) {
        this.ID = ID;
        this.lessonList = lessonList;
    }

    public int getID() {
        return ID;
    }

    public ArrayList<Lesson> getLessonList() {
        return lessonList;
    }
}
