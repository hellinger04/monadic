package com.jhuoose.monadic;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jhuoose.monadic.models.Course;
import com.jhuoose.monadic.models.Lesson;
import com.jhuoose.monadic.models.LessonElement;
import com.jhuoose.monadic.models.Text;
import io.javalin.Javalin;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

public class Server {
    public static void main(String[] args) throws SQLException, FileNotFoundException {
        ObjectMapper mapper = new ObjectMapper();
        var connection = DriverManager.getConnection("jdbc:sqlite:monadic.db");
        var statement = connection.createStatement();
        statement.execute("CREATE TABLE IF NOT EXISTS courses (identifier INTEGER PRIMARY KEY AUTOINCREMENT, lessons VARCHAR)");
        statement.close();

        var moreLessons = new ArrayList<Lesson>();
        Scanner inFile = new Scanner("../../../../resources/lessons/course_0/1.md");

        LessonElement element = new Text(1, inFile);
        var firstLesson = new Lesson(1, new ArrayList<>(), "lesson1");
        firstLesson.addLessonElement(element);

        inFile = new Scanner("../../../../resources/lessons/course_0/2.md");

        element = new Text(2, inFile);
        var secondLesson = new Lesson(2 , new ArrayList<>(), "lesson2");
        secondLesson.addLessonElement(element);

        moreLessons.add(firstLesson);
        moreLessons.add(secondLesson);

        var courses = new ArrayList<Course>();
        var firstCourse = new Course(0, moreLessons);
        var secondCourse = new Course(1, moreLessons);
        courses.add(firstCourse);
        courses.add(secondCourse);

        Javalin app = Javalin.create(config -> { config.addStaticFiles("/public"); });
        app.get("/courses", ctx -> {
            var getStatement = connection.createStatement();
            var result = getStatement.executeQuery("SELECT identifier, lessons FROM courses");
            var retrieveCourses = new ArrayList<Course>();
            while (result.next()) {
                // get the JSON representation first, then convert to an ArrayList<Lesson>
                String rs = result.getString("lessons");
                // this looks disgusting but Jackson documentation says to do this so ¯\_(ツ)_/¯
                ArrayList<Lesson> lessons = mapper.readValue(rs, new TypeReference<ArrayList<Lesson>>() { } );
                retrieveCourses.add(new Course(result.getInt("identifier"), lessons));
            }
            result.close();
            getStatement.close();
            ctx.json(retrieveCourses);
        });

        app.post("/courses", ctx -> {
            // put empty lesson list into the course. we will use update() to add lessons later.
            ArrayList<Lesson> lessons = new ArrayList<>();
            String JSONLessons = mapper.writeValueAsString(lessons);
            var createStatement = connection.createStatement();
            createStatement.execute("INSERT INTO courses (lessons) VALUES " + JSONLessons);
        });
        app.start(7000);
    }
}
