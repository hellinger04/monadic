package com.jhuoose.monadic.models;

import java.util.ArrayList;

public class Lesson {
    int ID;
    ArrayList<LessonElement> lessonElements = new ArrayList<>();
    String description;

//    public Lesson(int ID, ArrayList<LessonElement> lessonElements, String description) {
//        this.ID = ID;
//        this.lessonElements = lessonElements;
//        this.description = description;
//    }

    public Lesson(int courseID, int lessonID, boolean[] elements) {
        this.ID = lessonID;
        this.description = "lesson" + lessonID;

        //create LessonElements and add to Lesson
        for (int i = 0; i < elements.length; i++) {
            LessonElement element;
            if (elements[i]) {
                element = new Problem(i, "src/main/resources/lessons/course_" + courseID + "/lesson_" + lessonID + "/" + i + ".md");
                lessonElements.add(element);
            }
            else if (!elements[i]) {
                String filename = "src/main/resources/lessons/course_" + courseID + "/lesson_" + lessonID + "/" + i + ".md";
                element = new Text(i, filename);
                lessonElements.add(element);
            }
        }
    }


    public int getID() {
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