package com.jhuoose.monadic;

import com.jhuoose.monadic.models.Course;
import com.jhuoose.monadic.models.Lesson;
import com.jhuoose.monadic.models.LessonElement;
import com.jhuoose.monadic.models.Text;
import io.javalin.Javalin;
import java.util.ArrayList;

public class Server {
    public static void main(String[] args) {

        var courseZeroLessons = new ArrayList<Lesson>();
        var courseOneLessons = new ArrayList<Lesson>();

        LessonElement element = new Text(0, "src/main/resources/lessons/course_0/0.md");
        var firstLesson = new Lesson(0, new ArrayList<>(), "lesson0");
        firstLesson.addLessonElement(element);

        element = new Text(1, "src/main/resources/lessons/course_0/1.md");
        var secondLesson = new Lesson(1 , new ArrayList<>(), "lesson1");
        secondLesson.addLessonElement(element);

        courseZeroLessons.add(firstLesson);
        courseZeroLessons.add(secondLesson);

      
        element = new Text(0, "src/main/resources/lessons/course_1/0.md");
        firstLesson = new Lesson(0, new ArrayList<>(), "lesson0");
        firstLesson.addLessonElement(element);

        element = new Text(1, "src/main/resources/lessons/course_1/1.md");
        secondLesson = new Lesson(1 , new ArrayList<>(), "lesson1");
        secondLesson.addLessonElement(element);

        element = new Text(2, "src/main/resources/lessons/course_1/2.md");
        var thirdLesson = new Lesson(2, new ArrayList<>(), "lesson2");
        thirdLesson.addLessonElement(element);

        element = new Text(3, "src/main/resources/lessons/course_1/3.md");
        var fourthLesson = new Lesson(3 , new ArrayList<>(), "lesson3");
        fourthLesson.addLessonElement(element);

        courseOneLessons.add(firstLesson);
        courseOneLessons.add(secondLesson);
        courseOneLessons.add(thirdLesson);
        courseOneLessons.add(fourthLesson);
  
        var courses = new ArrayList<Course>();
        var firstCourse = new Course(0, courseZeroLessons);
        var secondCourse = new Course(1, courseOneLessons);

        courses.add(firstCourse);
        courses.add(secondCourse);

        Javalin app = Javalin.create(config -> { config.addStaticFiles("/public"); });
        app.get("/courses", ctx -> {
            ctx.json(courses);
        });

        app.start(7000);
    }
}
