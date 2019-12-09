package com.jhuoose.monadic;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jhuoose.monadic.models.lesson.Course;
import com.jhuoose.monadic.models.lesson.Lesson;
import com.jhuoose.monadic.controllers.UsersController;
import com.jhuoose.monadic.repositories.UsersRepository;
import io.javalin.Javalin;

import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;

import static io.javalin.apibuilder.ApiBuilder.*;

public class Server {
    public static void main(String[] args) throws SQLException {
        ObjectMapper mapper = new ObjectMapper();
        var connection = DriverManager.getConnection("jdbc:sqlite:monadic.db");
        var usersRepository = new UsersRepository(connection);
        var usersController = new UsersController(usersRepository);

        // construct ArrayLists to hold Course lessons and to hold Courses
        var courseZeroLessons = new ArrayList<Lesson>();
        var courseOneLessons = new ArrayList<Lesson>();
        var courseTwoLessons = new ArrayList<Lesson>();
        var courseThreeLessons = new ArrayList<Lesson>();
        var courseFourLessons = new ArrayList<Lesson>();

        var courseList = new ArrayList<Course>();

        // construct course 0 lessons
        for (int i = 0; i < Course.COURSE_0_SIZE; ++i) {
            courseZeroLessons.add(new Lesson(0, i));
        }

        // construct course 1 lessons
        for (int i = 0; i < Course.COURSE_1_SIZE; ++i) {
            courseOneLessons.add(new Lesson(1, i));
        }

        // construct course 2 lessons
        for (int i = 0; i < Course.COURSE_2_SIZE; ++i) {
            courseTwoLessons.add(new Lesson(2, i));
        }

        // construct course 3 lessons 
        for (int i = 0; i < Course.COURSE_3_SIZE; ++i) {
            courseThreeLessons.add(new Lesson(3, i));
        }

        for (int i = 0; i < Course.COURSE_4_SIZE; ++i) {
            courseFourLessons.add(new Lesson(4, i));
        }

        // construct Courses and add them to list of courses
        Course courseZero = new Course(0, courseZeroLessons);
        Course courseOne = new Course(1, courseOneLessons);
        Course courseTwo = new Course(2, courseTwoLessons);
        Course courseThree = new Course(3, courseThreeLessons);
        Course courseFour = new Course(4, courseFourLessons);

        courseList.add(courseZero);
        courseList.add(courseOne);
        courseList.add(courseTwo);
        courseList.add(courseThree);
        courseList.add(courseFour);

        Javalin app = Javalin.create(config -> {
            config.addStaticFiles("/public");
        });
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
                path("getUserStatus", () -> {
                    post(usersController::getUserStatus);
                });
                path("setProblemStatus", () -> {
                   post(usersController::setProblemStatus);
                });
            });
        });

        app.start(System.getenv("PORT") == null ? 7000 : Integer.parseInt(System.getenv("PORT")));
    }
}