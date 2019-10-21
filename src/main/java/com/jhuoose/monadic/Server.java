package com.jhuoose.monadic;

import com.jhuoose.monadic.models.*;
import io.javalin.Javalin;
import java.util.ArrayList;

public class Server {
    public static void main(String[] args) {

        //construct ArrayList to hold Course lessons
        var courseZeroLessons = new ArrayList<Lesson>();
        var courseOneLessons = new ArrayList<Lesson>();

        Lesson firstLesson = createLesson(0, 0, 4);
        Lesson secondLesson = createLesson(0, 1, 3);
        secondLesson.addLessonElement(new Problem(3, "this is sample text"));
        Lesson thirdLesson = createLesson(0, 2, 4);
        Lesson fourthLesson = createLesson(0, 3, 4);
        Lesson fifthLesson = createLesson(0, 4, 3);

        courseZeroLessons.add(firstLesson);
        courseZeroLessons.add(secondLesson);
        courseZeroLessons.add(thirdLesson);
        courseZeroLessons.add(fourthLesson);
        courseZeroLessons.add(fifthLesson);

        firstLesson = createLesson(1, 0, 3);
        secondLesson = createLesson(1, 1, 2);
        thirdLesson = createLesson(1, 2, 2);
        fourthLesson = createLesson(1, 3, 1);

        courseOneLessons.add(firstLesson);
        courseOneLessons.add(secondLesson);
        courseOneLessons.add(thirdLesson);
        courseOneLessons.add(fourthLesson);


        //construct an ArrayList to hold Courses
        var courseList = new ArrayList<Course>();

        //construct Courses and add them to list of courses
        Course firstCourse = new Course(0, courseZeroLessons);
        Course secondCourse = new Course(1, courseOneLessons);

        courseList.add(firstCourse);
        courseList.add(secondCourse);

        Javalin app = Javalin.create(config -> { config.addStaticFiles("/public"); });
        app.get("/courses", ctx -> {
            ctx.json(courseList);
        });

        app.start(System.getenv("PORT") == null ? 7000 : Integer.parseInt(System.getenv("PORT")));
    }

    private static Lesson createLesson(int courseID, int lessonID, int numElements) {
        //construct empty Lesson
        Lesson lesson = new Lesson(lessonID, new ArrayList<>(), "lesson" + lessonID);

        //create LessonElements and add to Lesson
        for (int i = 0; i < numElements; i++) {
            String filename = "src/main/resources/lessons/course_" + courseID + "/lesson_" + lessonID + "/" + i + ".md";
            //System.out.println("filename" + filename);
            LessonElement element = new Text(i, filename);
            lesson.addLessonElement(element);
        }

        return lesson;
    }
}
