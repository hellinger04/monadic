package com.jhuoose.monadic.controllers;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jhuoose.monadic.models.User;
import com.jhuoose.monadic.repositories.UserNotFoundException;
import com.jhuoose.monadic.repositories.UsersRepository;
import io.javalin.http.Context;
import io.javalin.http.ForbiddenResponse;

import java.io.IOException;
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
            User user = new User(
                    ctx.formParam("username", ""),
                    BCrypt.withDefaults().hashToString(12, ctx.formParam("password", "").toCharArray())
            );
            usersRepository.create(user);
        } catch (SQLException | JsonProcessingException e) {
            userExists = 409;
        }

        ctx.status(userExists);
    }

    public void login(Context ctx) throws SQLException {
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
            //get username of current User
            var user = usersRepository.getOne(ctx.body());

            //store both lesson status and user's solutions in a HashMap
            HashMap<String, HashMap<String, String>> results = new HashMap<>();
            results.put("status", user.getUserStatus());
            results.put("solutions", user.getSolutions());
            //encode results HashMap as JSON and assign to Context
            ctx.json(results);
            ctx.status(201);
        } catch (UserNotFoundException | SQLException e) {
            ctx.status(401);
        }
    }

    public void setProblemStatus(Context ctx) {
        try {
            HashMap<String, String> components = new ObjectMapper().readValue(ctx.body(), HashMap.class);
            var user = usersRepository.getOne(components.get("Username"));
            String problemKey = getProblemKey(components);
            int newProblemStatus = Integer.parseInt(components.get("ProblemStatus"));
            usersRepository.setProblemStatus(user, problemKey, newProblemStatus);
            String newSolution = components.get("newSolution");
            usersRepository.setSolution(user, problemKey, newSolution);
            ctx.json(user.getUserStatus());
        } catch (UserNotFoundException | SQLException | IOException e) {
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
            HashMap<String, String> components = new ObjectMapper().readValue(ctx.body(), HashMap.class);
            var user = usersRepository.getOne(components.get("Username"));;
            // first make sure the user has valid authentication
            BCrypt.Result result = BCrypt.verifyer().verify(components.get("OldPassword").toCharArray(), user.getPassword().toCharArray());
            if (!result.verified) {
                ctx.status(401);
            } else {
                user.setPassword(BCrypt.withDefaults().hashToString(12, components.get("NewPassword").toCharArray()));
                usersRepository.setNewPassword(user);
                ctx.status(200);
            }
        } catch (UserNotFoundException | IOException e) {
            ctx.status(401);
        }
    }

    private String getProblemKey(HashMap<String, String> components) {
        String courseID = components.get("CourseID");
        String lessonID = components.get("LessonID");
        String problemID = components.get("ElementID");
        return "c" + courseID + "_l" + lessonID + "_p" + problemID;
    }
}
