package com.jhuoose.monadic;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jhuoose.monadic.models.Course;
import com.jhuoose.monadic.models.Lesson;
import com.jhuoose.monadic.models.LessonElement;
import com.jhuoose.monadic.models.Text;
import io.javalin.Javalin;

import java.io.Reader;
import java.sql.DriverManager;
import java.sql.SQLException;

import java.io.FileNotFoundException;
import java.lang.reflect.Array;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Server {
    public static void main(String[] args) throws SQLException, FileNotFoundException {
        ObjectMapper mapper = new ObjectMapper();
        Javalin app = Javalin.create(config ->
            { config.addStaticFiles("/public");
        });
        var connection = DriverManager.getConnection("jdbc:sqlite:monadic.db");
        app.events(event -> {
            event.serverStarting(() -> {
                var statement = connection.createStatement();
                statement.execute("CREATE TABLE IF NOT EXISTS courses (identifier INTEGER PRIMARY KEY AUTOINCREMENT, lessons VARCHAR)");
                statement.close();
            });
            event.serverStopped(() -> {
                connection.close();
            });
        });
    //    var lessons = List.of(
    //            new Lesson(0.0, new ArrayList<>()),
    //            new Lesson(1.2, new ArrayList<>()),
    //            new Lesson(1.3, new ArrayList<>())
    //    );
        /* this is messy because List.of's are not mutable and
         * for some reason, it wasn't letting me put a List instead
         * of an ArrayList into an ArrayList of type Course
         * - it shouldn't matter - this will all be factored out later
         * when we connect to the DB
         */

        //creating ArrayLists to hold lessons for each course
        var courseZeroLessons = new ArrayList<Lesson>();
        var courseOneLessons = new ArrayList<Lesson>();


        //create lessons for Course Zero
        // TODO Use relative paths in order to get files to render properly
        LessonElement element = new Text(0, "/Users/hellinger/Documents/hopkins/fa19/OOSE/2019-group-monadic/src/main/resources/lessons/course_0/0.md");
        var firstLesson = new Lesson(0, new ArrayList<>(), "lesson0");
        firstLesson.addLessonElement(element);

        element = new Text(1, "/Users/hellinger/Documents/hopkins/fa19/OOSE/2019-group-monadic/2019-group-monadic/src/main/resources/lessons/course_0/1.md");
        var secondLesson = new Lesson(1 , new ArrayList<>(), "lesson1");
        secondLesson.addLessonElement(element);

        courseZeroLessons.add(firstLesson);
        courseZeroLessons.add(secondLesson);


        //create lessons for Course One
        // TODO Use relative paths in order to get files to render properly
        element = new Text(0, "/Users/hellinger/Documents/hopkins/fa19/OOSE/2019-group-monadic/src/main/resources/lessons/course_1/0.md");
        firstLesson = new Lesson(0, new ArrayList<>(), "lesson0");
        firstLesson.addLessonElement(element);

        element = new Text(1, "/Users/hellinger/Documents/hopkins/fa19/OOSE/2019-group-monadic/2019-group-monadic/src/main/resources/lessons/course_1/2.md");
        secondLesson = new Lesson(1 , new ArrayList<>(), "lesson1");
        secondLesson.addLessonElement(element);

        element = new Text(2, "/Users/hellinger/Documents/hopkins/fa19/OOSE/2019-group-monadic/src/main/resources/lessons/course_1/2.md");
        var thirdLesson = new Lesson(2, new ArrayList<>(), "lesson2");
        thirdLesson.addLessonElement(element);

        element = new Text(3, "/Users/hellinger/Documents/hopkins/fa19/OOSE/2019-group-monadic/2019-group-monadic/src/main/resources/lessons/course_1/3.md");
        var fourthLesson = new Lesson(3 , new ArrayList<>(), "lesson3");
        fourthLesson.addLessonElement(element);

        courseOneLessons.add(firstLesson);
        courseOneLessons.add(secondLesson);
        courseOneLessons.add(thirdLesson);
        courseOneLessons.add(fourthLesson);


        //create course list and add arrays of lessons for each course
        var courses = new ArrayList<Course>();
        var firstCourse = new Course(0, courseZeroLessons);
        var secondCourse = new Course(1, courseOneLessons);
        courses.add(firstCourse);
        courses.add(secondCourse);
      
        Javalin app = Javalin.create(config -> { config.addStaticFiles("/public"); });
        app.get("/courses", ctx -> {
            var getStatement = connection.createStatement();
            var result = getStatement.executeQuery("SELECT identifier, lessons FROM courses");
            var courses = new ArrayList<Course>();
            while (result.next()) {
                // get the JSON representation first, then convert to an ArrayList<Lesson>
                String rs = result.getString("lessons");
                // this looks fucking disgusting but Jackson documentation says to do this so ¯\_(ツ)_/¯
                ArrayList<Lesson> lessons = mapper.readValue(rs, new TypeReference<ArrayList<Lesson>>() { } );
                courses.add(new Course(result.getInt("identifier"), lessons));
            }
            result.close();
            getStatement.close();
            ctx.json(courses);
        });

        app.post("/courses", ctx -> {
            // put empty lesson list into the course. we will use update() to add lessons later.
            ArrayList<Lesson> lessons = new ArrayList<>();
            String JSONLessons = mapper.writeValueAsString(lessons);
            var createStatement = connection.createStatement();
            createStatement.execute("INSERT INTO courses (lessons) VALUES " + JSONLessons);
            createStatement.close();
            ctx.status(201);
        });

        app.delete("/items/:identifier", ctx -> {
            var statement = connection.prepareStatement("DELETE FROM courses WHERE identifier = ?");
            statement.setInt(1, Integer.parseInt(ctx.pathParam("identifier")));
            if (statement.executeUpdate() == 0) {
                ctx.status(404);
            } else {
                ctx.status(204);
            }
            statement.close();
        });

        app.put("/items/:identifier", ctx -> {
            var statement = connection.prepareStatement("UPDATE courses SET lessons = ? WHERE identifier = ?");
            statement.setString(1, ctx.formParam("lessons", ""));
            statement.setInt(2, Integer.parseInt(ctx.pathParam("identifier")));
            if (statement.executeUpdate() == 0) {
                ctx.status(404);
            } else {
                ctx.status(204);
            }
            statement.close();
        });
        app.start(7000);
    }
}
