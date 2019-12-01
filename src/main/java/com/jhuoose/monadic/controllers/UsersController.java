package com.jhuoose.monadic.controllers;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jhuoose.monadic.models.User;
import com.jhuoose.monadic.models.lesson.Lesson;
import com.jhuoose.monadic.repositories.UserNotFoundException;
import com.jhuoose.monadic.repositories.UsersRepository;
import io.javalin.core.validation.Validator;
import io.javalin.http.Context;
import io.javalin.http.ForbiddenResponse;

import java.sql.SQLException;
import java.util.HashMap;

public class UsersController {
    private UsersRepository usersRepository;

    public UsersController(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    public void signup(Context ctx) {
        var userExists = 201;
        try {
            HashMap<String, Integer> lessonsCompleted = new HashMap<>();
            for (int i = 0; i < 5; ++i) {
                lessonsCompleted.put("c0_l" + i, 0);
            }

            for (int i = 0; i < 8; ++i) {
                lessonsCompleted.put("c1_l" + i, 0);
            }

            for (int i = 0; i < 5; ++i) {
                lessonsCompleted.put("c2_l" + i, 0);
            }

            for (int i = 0; i < 3; ++i) {
                lessonsCompleted.put("c3_l" + i, 0);
            }
            User user = new User(
                    ctx.formParam("username", ""),
                    BCrypt.withDefaults().hashToString(12, ctx.formParam("password", "").toCharArray()),
                    lessonsCompleted
            );
            usersRepository.create(user);
        } catch (SQLException | JsonProcessingException e) {
            userExists = 409;
        }

        ctx.status(userExists);
    }

    public void login(Context ctx) throws SQLException, UserNotFoundException {
        try {
            var user = usersRepository.getOne(ctx.formParam("username", ""));
            BCrypt.Result result = BCrypt.verifyer().verify(ctx.formParam("password", "").toCharArray(),
                    user.getPassword().toCharArray());
            if (!result.verified) {
                ctx.status(401);
            } else {
                ctx.sessionAttribute("user", user);
                ctx.status(200);
            }
        } catch (UserNotFoundException e) {
            ctx.status(401);
        }
    }

    public void getUserStatus(Context ctx) {
        try {
            var user = usersRepository.getOne(ctx.body());
            ctx.status(201);
            ctx.json(user.getLessonsCompleted());
        } catch (UserNotFoundException | SQLException e) {
            ctx.status(401);
        }
    }

    public void changeLessonStatus(Context ctx) {
        try {
            var user = usersRepository.getOne(ctx.formParam("username", ""));
            HashMap<String, Integer> lessonsCompleted = user.getLessonsCompleted();
            String lessonKey = ctx.formParam("lessonKey", "");
            int newLessonStatus = ctx.formParam("newLessonStatus", Integer.class).getValue();
            usersRepository.modifyLessonStatus(user, lessonKey, newLessonStatus);

        } catch (UserNotFoundException | SQLException | JsonProcessingException e) {
            ctx.status(401);
        }
    }

    public User currentUser(Context ctx) {
        var user = (User) ctx.sessionAttribute("user");
        if (user == null) throw new ForbiddenResponse();
        return user;
    }

    public void changePassword(Context ctx) throws SQLException {
        try {
            var user = usersRepository.getOne(ctx.formParam("username", ""));
            // first make sure the user has valid authentication
            BCrypt.Result result = BCrypt.verifyer().verify(ctx.formParam("password", "").toCharArray(),
                    user.getPassword().toCharArray());
            if (!result.verified) {
                ctx.status(401);
            } else {
                ctx.sessionAttribute("user", user);
                user.setPassword(BCrypt.withDefaults().hashToString(12, ctx.formParam("password", "").toCharArray()));
                ctx.status(200);
            }
        } catch (UserNotFoundException e) {
            ctx.status(401);
        }
    }
}
