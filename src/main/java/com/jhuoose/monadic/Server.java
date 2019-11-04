package com.jhuoose.monadic;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jhuoose.monadic.models.Course;
import com.jhuoose.monadic.models.Lesson;
import com.jhuoose.monadic.controllers.UsersController;
import com.jhuoose.monadic.repositories.UsersRepository;
import io.javalin.Javalin;

import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;

import static io.javalin.apibuilder.ApiBuilder.*;

public class Server {
    public static void main(String[] args) throws SQLException, JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        var connection = DriverManager.getConnection("jdbc:sqlite:monadic.db");
        var usersRepository = new UsersRepository(connection);
        var usersController = new UsersController(usersRepository);


        // construct ArrayLists to hold Course lessons and to hold Courses
        var courseZeroLessons = new ArrayList<Lesson>();
        var courseOneLessons = new ArrayList<Lesson>();
        var courseList = new ArrayList<Course>();

        // construct course 0 lessons
        for (int i = 0; i < 5; ++i) {
            courseZeroLessons.add(new Lesson(0, i));
        }

        // construct course 1 lessons
        for (int i = 0; i < 7; ++i) {
            courseOneLessons.add(new Lesson(1, i));
        }

        // construct Courses and add them to list of courses
        Course firstCourse = new Course(0, courseZeroLessons);
        Course secondCourse = new Course(1, courseOneLessons);

        courseList.add(firstCourse);
        courseList.add(secondCourse);



        String firstCourseJSON = mapper.writeValueAsString(firstCourse);
        String secondCourseJSON = mapper.writeValueAsString(secondCourse);

        Javalin app = Javalin.create(config -> {
            config.addStaticFiles("/public");
        });
        app.events(event -> {
            event.serverStarting(() -> {
                var statement = connection.createStatement();
                statement.execute("CREATE TABLE IF NOT EXISTS courses (identifier INTEGER PRIMARY KEY AUTOINCREMENT, lessons VARCHAR)");
                statement.execute("INSERT INTO courses (lessons) VALUES (' ')");
                statement.execute("INSERT INTO courses (lessons) VALUES ('1')");
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

        app.delete("/courses/:identifier", ctx -> {
            var statement = connection.prepareStatement("DELETE FROM courses WHERE identifier = ?");
            statement.setInt(1, Integer.parseInt(ctx.pathParam("identifier")));
            if (statement.executeUpdate() == 0) {
                ctx.status(404);
            } else {
                ctx.status(204);
            }
            statement.close();
        });

        app.put("/courses/:identifier", ctx -> {
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
        app.routes(() -> {
            path("users", () -> {
                post(usersController::signup);
                path("login", () -> {
                    post(usersController::login);
                });
            });
        });

        app.start(System.getenv("PORT") == null ? 7000 : Integer.parseInt(System.getenv("PORT")));
    }
}
