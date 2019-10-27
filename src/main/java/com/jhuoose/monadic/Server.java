package com.jhuoose.monadic;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jhuoose.monadic.models.Course;
import com.jhuoose.monadic.models.Lesson;
import io.javalin.Javalin;

import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;

public class Server {
    public static void main(String[] args) throws SQLException {

        //construct ArrayList to hold Course lessons
        var courseZeroLessons = new ArrayList<Lesson>();
        var courseOneLessons = new ArrayList<Lesson>();

        /*
        Lesson firstLesson = new Lesson(0, 0, new boolean[]{false, true, false, false, false});
        Lesson secondLesson = new Lesson(0, 1, new boolean[]{false, false, false, true});
        Lesson thirdLesson = new Lesson(0, 2, new boolean[]{false, false, false, false});
        Lesson fourthLesson = new Lesson(0, 3, new boolean[]{false, false, false, true, false, true});
        Lesson fifthLesson = new Lesson(0, 4, new boolean[]{false, false, false});

        courseZeroLessons.add(firstLesson);
        courseZeroLessons.add(secondLesson);
        courseZeroLessons.add(thirdLesson);
        courseZeroLessons.add(fourthLesson);
        courseZeroLessons.add(fifthLesson);

        firstLesson = new Lesson(1, 0, new boolean[]{false, false, false});
        secondLesson = new Lesson(1, 1, new boolean[]{false, false});
        thirdLesson = new Lesson(1, 2, new boolean[]{false, false, true});
        fourthLesson = new Lesson(1, 3, new boolean[]{false});

        courseOneLessons.add(firstLesson);
        courseOneLessons.add(secondLesson);
        courseOneLessons.add(thirdLesson);
        courseOneLessons.add(fourthLesson);
*/

        for (int i = 0; i < 5; ++i) {
            courseZeroLessons.add(new Lesson(0, i));
        }

        for (int i = 0; i < 4; ++i) {
            courseOneLessons.add(new Lesson(1, i));
        }


        //construct an ArrayList to hold Courses
        var courseList = new ArrayList<Course>();

        //construct Courses and add them to list of courses
        Course firstCourse = new Course(0, courseZeroLessons);
        Course secondCourse = new Course(1, courseOneLessons);

        courseList.add(firstCourse);
        courseList.add(secondCourse);

        ObjectMapper mapper = new ObjectMapper();
        Javalin app = Javalin.create(config -> {
            config.addStaticFiles("/public");
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
        app.get("/courses", ctx -> {
            ctx.json(courseList);
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

        app.start(System.getenv("PORT") == null ? 7000 : Integer.parseInt(System.getenv("PORT")));
    }
}
