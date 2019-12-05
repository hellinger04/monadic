package com.jhuoose.monadic.models.lesson;

import java.util.ArrayList;

public class Course {

    public static final int COURSE_0_SIZE = 5;
    public static final int COURSE_1_SIZE = 7;
    public static final int COURSE_2_SIZE = 8;
    public static final int COURSE_3_SIZE = 4;

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
