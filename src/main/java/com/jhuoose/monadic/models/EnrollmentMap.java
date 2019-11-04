package com.jhuoose.monadic.models;

import com.jhuoose.monadic.models.lesson.Lesson;

import java.util.ArrayList;
import java.util.Map;

public class EnrollmentMap {

    private static Map<Lesson, Integer> lessonList;

    public static Map<Lesson, Integer> getLessonList() {
        return lessonList;
    }

    public static ArrayList<Lesson> update(Lesson completedLesson) {
        // TODO add logic to determine which lessons are open after given a completed lesson
        return new ArrayList<>();
    }
}
